module.exports = {
  view: 'browse',
  showInNavbar: true,
  rdfType: 'http://erlangen-crm.org/current/E22_Man-Made_Object',
  uriBase: 'http://data.silknow.org/object',
  details: {
    view: 'gallery',
    excludedMetadata: ['representation', 'description', 'category', 'usedType'],
    showPermalink: true,
  },
  filterByGraph: true,
  filters: [
    {
      id: 'time',
      isMulti: true,
      isSortable: true,
      query: {
        '@graph': [
          {
            '@id': '?fallsWithin',
            label: '?label',
          },
        ],
        $where: [
          '?production <http://erlangen-crm.org/current/P4_has_time-span> ?time',
          '?time <http://erlangen-crm.org/current/P86_falls_within> ?fallsWithin',
          '?fallsWithin <http://www.w3.org/2004/02/skos/core#prefLabel> ?label',
        ],
        $filter: ['langmatches(lang(?label), "en") || lang(?label) = ""'],
        $langTag: 'hide',
      },
      whereFunc: () => [
        '?production <http://erlangen-crm.org/current/P4_has_time-span> ?time',
        'OPTIONAL { ?time <http://erlangen-crm.org/current/P86_falls_within> ?fallsWithin . }'
      ],
      filterFunc: (values) => {
        return [values.map((val) => `?time = <${val}> || ?fallsWithin = <${val}>`).join(' || ')];
      },
    },
    {
      id: 'location',
      isMulti: true,
      isSortable: true,
      query: {
        '@graph': [
          {
            '@id': '?location',
            label: '?locationLabel',
          },
        ],
        $where: [
          '?production <http://erlangen-crm.org/current/P8_took_place_on_or_within> ?location',
          '?location <http://www.geonames.org/ontology#name> ?locationLabel',
        ],
        $filter: [
          'langmatches(lang(?locationLabel), "en") || lang(?locationLabel) = ""',
        ],
        $orderby: ['ASC(?locationLabel)'],
        $langTag: 'hide',
      },
      whereFunc: () => [
        '?production <http://erlangen-crm.org/current/P8_took_place_on_or_within> ?location',
        'OPTIONAL { ?location geonames:parentCountry ?parentCountry . }'
      ],
      filterFunc: (values) => {
        return [values.map((val) => `?location = <${val}> || ?parentCountry = <${val}>`).join(' || ')];
      },
    },
    {
      id: 'material',
      isMulti: true,
      isSortable: true,
      vocabulary: 'material',
      whereFunc: () => [
        '?production <http://erlangen-crm.org/current/P126_employed> ?material',
        'OPTIONAL { ?broaderMaterial (skos:member|skos:narrower)* ?material }'
      ],
      filterFunc: (values) => {
        return [values.map((val) => `?material = <${val}> || ?broaderMaterial = <${val}>`).join(' || ')];
      },
    },
    {
      id: 'technique',
      isMulti: true,
      isSortable: true,
      vocabulary: 'technique',
      whereFunc: () => [
        '?production <http://erlangen-crm.org/current/P32_used_general_technique> ?technique',
        'OPTIONAL { ?broaderTechnique (skos:member|skos:narrower)* ?technique }'
      ],
      filterFunc: (values) => {
        return [values.map((val) => `?technique = <${val}> || ?broaderTechnique = <${val}>`).join(' || ')];
      },
    },
    {
      id: 'depiction',
      isMulti: true,
      isSortable: true,
      vocabulary: 'depiction',
      whereFunc: () => [
        '?id <http://erlangen-crm.org/current/P62_depicts> ?depiction',
        'OPTIONAL { ?broaderDepiction (skos:member|skos:narrower)* ?depiction }'
      ],
      filterFunc: (values) => {
        return [values.map((val) => `?depiction = <${val}> || ?broaderDepiction = <${val}>`).join(' || ')];
      },
    },
    {
      id: 'type',
      isMulti: true,
      isSortable: true,
      vocabulary: 'type',
      whereFunc: () => [
        '?dig ecrm:P129_is_about ?production',
        '?dig a crmdig:D1_Digital_Object',
        '?dig ecrm:P129_is_about/ecrm:P42_assigned ?digTypeAssigned',
        '?assignedGroup skos:member ?digTypeAssigned',
        '<http://data.silknow.org/vocabulary/facet/assignedtypes> skos:member ?digAssignedGroup',
      ],
      filterFunc: (values) => {
        return [values.map((val) => `?digAssignedGroup = <${val}>`).join(' || ')];
      },
    },
    {
      id: 'show-only-fabric',
      isOption: true,
      whereFunc: () => [
        '?classified ecrm:P41_classified ?id',
        '?classified ecrm:P42_assigned ?assigned',
        '?assigned skos:inScheme <http://data.silknow.org/category/silk-category-vocabulary>',
        '<http://data.silknow.org/vocabulary/facet/fabrics> skos:member ?assigned',
      ],
    },
    {
      id: 'show-only-images',
      isOption: true,
      whereFunc: () => [
        '?id <http://erlangen-crm.org/current/P138i_has_representation> ?representation',
        '?representation <http://schema.org/contentUrl> ?representationUrl',
        'FILTER(STRSTARTS(STR(?representationUrl), "https://silknow.org/"))',
      ],
    },
    {
      id: 'show-only-location',
      isOption: true,
      whereFunc: () => [
        '?production <http://erlangen-crm.org/current/P8_took_place_on_or_within> ?location',
        '?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?locationLat',
        '?location <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?locationLong',
      ],
    },
    {
      id: 'show-only-vloom',
      isOption: true,
    },
  ],
  labelFunc: (props) => props.label || props.identifier,
  baseWhere: [
    'GRAPH ?g { ?id a <http://erlangen-crm.org/current/E22_Man-Made_Object> }',
    '?production <http://erlangen-crm.org/current/P108_has_produced> ?id',
  ],
  metadata: {
    dimension: (value, index, { dimension }) => {
      return `${dimension[index].value} ${dimension[index].unit} (${dimension[index].type})`;
    },
    technique: (value, index, { usedType }) => {
      // Combine technique and used object type
      return `${value}${usedType && usedType[index] ? ` / ${usedType[index]['@id']}` : ''}`;
    }
  },
  query: {
    '@graph': [
      {
        '@type': 'http://erlangen-crm.org/current/E22_Man-Made_Object',
        '@id': '?id',
        '@graph': '?g',
        label: '$<http://www.w3.org/2000/01/rdf-schema#label>$var:label',
        identifier: '$<http://purl.org/dc/elements/1.1/identifier>$var:identifier',
        description: '$<http://erlangen-crm.org/current/P3_has_note>$lang:en$var:description',
        representation: {
          '@id': '?representation',
          image: '?representationUrl',
          label: '?representationRightComment'
        },
        legalBody: {
          '@id': '?legalBody',
          label: '?legalBodyLabel',
        },
        composed: {
          '@id': '?collection',
          '@type': 'http://erlangen-crm.org/current/E78_Collection',
          label: '?collectionLabel',
        },
        material: {
          '@id': '?material',
          label: '?materialLabel',
        },
        technique: {
          '@id': '?technique',
          label: '?techniqueLabel',
        },
        usedType: {
          '@id': '?usedType',
        },
        depiction: {
          '@id': '?depiction',
          label: '?depictionLabel',
        },
        dimension: {
          '@id': '?dimension',
          type: '?dimensionType',
          value: '?dimensionValue',
          unit: '?dimensionUnit',
        },
        time: {
          '@id': '?time',
          label: '?timeLabel'
        },
        location: {
          '@id': '?location',
          featureCode: '?locationFeatureCode',
          label: '?locationLabel',
          latitude: '?locationLat',
          longitude: '?locationLong',
        },
        type: {
          '@id': '?digAssignedGroup',
          'label': '?digAssignedGroupLabel',
        },
        category: {
          '@id': '?assigned',
          'label': '?assignedLabel',
        }
      },
    ],
    $where: [
      'GRAPH ?g { ?id a <http://erlangen-crm.org/current/E22_Man-Made_Object> }',
      `
      {
        OPTIONAL {
          ?custody <http://erlangen-crm.org/current/P30_transferred_custody_of> ?id .
          ?custody <http://erlangen-crm.org/current/P29_custody_received_by> ?legalBody .
          ?legalBody <http://www.w3.org/2000/01/rdf-schema#label> ?legalBodyLabel .
          FILTER(LANG(?legalBodyLabel) = "en" || LANG(?legalBodyLabel) = "")
        }
      }
      UNION
      {
        OPTIONAL {
          ?collection <http://erlangen-crm.org/current/P106_is_composed_of> ?id .
          ?collection <http://www.w3.org/2000/01/rdf-schema#label> ?collectionLabel .
        }
      }
      UNION
      {
        OPTIONAL {
          ?id <http://erlangen-crm.org/current/P43_has_dimension> ?dimension .
          ?dimension <http://erlangen-crm.org/current/P2_has_type> ?dimensionType .
          ?dimension <http://erlangen-crm.org/current/P90_has_value> ?dimensionValue .
          ?dimension <http://erlangen-crm.org/current/P91_has_unit> ?dimensionUnit .
        }
      }
      UNION
      {
        OPTIONAL {
          ?classified ecrm:P41_classified ?id .
          ?classified ecrm:P42_assigned ?assigned .
          ?assigned skos:prefLabel ?assignedLabel .
          FILTER(LANG(?assignedLabel) = "en" || LANG(?assignedLabel) = "")
        }
      }
      UNION
      {
        OPTIONAL {
          ?production <http://erlangen-crm.org/current/P108_has_produced> ?id .
          {
            OPTIONAL {
              ?production <http://erlangen-crm.org/current/P32_used_general_technique> ?technique .
              ?technique skos:prefLabel ?techniqueLabel .
              FILTER(LANG(?techniqueLabel) = "en" || LANG(?techniqueLabel) = "")
            }
          }
          UNION
          {
            OPTIONAL {
              ?production <http://erlangen-crm.org/current/P125_used_object_of_type> ?usedType .
            }
          }
          UNION
          {
            OPTIONAL {
              ?production <http://erlangen-crm.org/current/P126_employed> ?material .
              ?material skos:prefLabel ?materialLabel .
              FILTER(LANG(?materialLabel) = "en" || LANG(?materialLabel) = "")
            }
          }
          UNION
          {
            OPTIONAL {
              ?production <http://erlangen-crm.org/current/P4_has_time-span> ?time .
              ?time skos:prefLabel ?timeLabel .
              FILTER(LANG(?timeLabel) = "en" || LANG(?timeLabel) = "")
            }
          }
          UNION
          {
            OPTIONAL {
              ?production <http://erlangen-crm.org/current/P8_took_place_on_or_within> ?location .
              OPTIONAL {
                ?location <http://www.geonames.org/ontology#name>|rdfs:label ?locationLabel .
                FILTER(LANG(?locationLabel) = "en" || LANG(?locationLabel) = "")
              }
              OPTIONAL { ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?locationLat . }
              OPTIONAL { ?location <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?locationLong . }
              OPTIONAL { ?location <http://www.geonames.org/ontology#parentCountry>/<http://www.geonames.org/ontology#name> ?locationCountry . }
              OPTIONAL { ?location <http://www.geonames.org/ontology#featureCode> ?locationFeatureCode . }
            }
          }
          UNION
          {
            OPTIONAL {
              ?dig ecrm:P129_is_about ?production .
              ?dig a crmdig:D1_Digital_Object .
              ?dig ecrm:P129_is_about/ecrm:P42_assigned ?digTypeAssigned .
              ?digAssignedGroup skos:member ?digTypeAssigned .
              <http://data.silknow.org/vocabulary/facet/assignedtypes> skos:member ?digAssignedGroup .
              OPTIONAL {
                ?digAssignedGroup <http://www.w3.org/2004/02/skos/core#prefLabel> ?digAssignedGroupLabel .
                FILTER(LANG(?digAssignedGroupLabel) = "en" || LANG(?digAssignedGroupLabel) = "")
              }
            }
          }
        }
      }
      UNION
      {
        OPTIONAL {
          ?id <http://erlangen-crm.org/current/P62_depicts> ?depiction .
          ?depiction skos:prefLabel ?depictionLabel .
          FILTER(LANG(?depictionLabel) = "en" || LANG(?depictionLabel) = "")
        }
      }
      UNION
      {
        OPTIONAL {
          SELECT ?id ?representation ?representationRightComment (SAMPLE(?representationUrl) AS ?representationUrl) WHERE {
            ?id <http://erlangen-crm.org/current/P138i_has_representation> ?representation .
            OPTIONAL {
              ?representation <http://schema.org/contentUrl> ?representationUrl .
              FILTER(STRSTARTS(STR(?representationUrl), "https://silknow.org/"))
            }
            OPTIONAL {
              ?representationRight a ecrm:E30_Right .
              ?representationRight ecrm:P104i_applies_to ?id .
              ?representationRight rdfs:comment ?representationRightComment .
            }
          }
        }
      }
      `
    ],
    $langTag: 'hide',
  },
  textSearchFunc: (q) => {
    const quotedValue = JSON.stringify(q);
    const bifValue = `${q.replace(/'/g, '\\\'')}*`;
    const quotedBifValue = JSON.stringify(bifValue);
    return [
      `
      {
        { ?id ?_s1p ?_s1o . ?_s1o bif:contains '${quotedBifValue}' }
        UNION
        { ?id ?_s1p ?_s1o . FILTER(?_s1o = ${quotedValue}) }
        UNION
        { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . ?_s2o bif:contains '${quotedBifValue}' }
        UNION
        { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . FILTER(?_s2o = ${quotedValue}) }
        UNION
        { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . ?_s2o ?_s3p ?_s3o . ?_s3o bif:contains '${quotedBifValue}' }
        UNION
        { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . ?_s2o ?_s3p ?_s3o . FILTER(?_s3o = ${quotedValue}) }
      }
      `
    ]
  }
};
