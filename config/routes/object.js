module.exports = {
  view: 'browse',
  showInNavbar: true,
  rdfType: 'http://erlangen-crm.org/current/E22_Man-Made_Object',
  uriBase: 'http://data.silknow.org/object',
  details: {
    view: 'silknow-gallery',
    excludedMetadata: ['representation', 'description', 'category', 'usedType', 'century', 'sameAs'],
    showPermalink: true,
  },
  filterByGraph: true,
  filters: [
    {
      id: 'time',
      isMulti: true,
      isSortable: true,
      query: ({ language }) => ({
        '@graph': [
          {
            '@id': '?fallsWithin',
            label: '?label',
          },
        ],
        $where: [
          '?production ecrm:P4_has_time-span ?time',
          '?time ecrm:P86_falls_within ?fallsWithin',
          '?fallsWithin skos:prefLabel ?label',
        ],
        $filter: [`langmatches(lang(?label), "${language}") || lang(?label) = ""`],
        $langTag: 'hide',
      }),
      whereFunc: () => [
        '?production ecrm:P4_has_time-span ?time',
        'OPTIONAL { ?time ecrm:P86_falls_within ?fallsWithin . }'
      ],
      filterFunc: (val) => `?time = <${val}> || ?fallsWithin = <${val}>`,
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
          '?production ecrm:P8_took_place_on_or_within ?location',
          '?location geonames:name ?locationLabel',
        ],
        $filter: [
          'langmatches(lang(?locationLabel), "en") || lang(?locationLabel) = ""',
        ],
        $orderby: ['ASC(?locationLabel)'],
        $langTag: 'hide',
      },
      whereFunc: () => [
        '?production ecrm:P8_took_place_on_or_within ?location',
        'OPTIONAL { ?location geonames:parentCountry ?parentCountry . }'
      ],
      filterFunc: (val) => `?location = <${val}> || ?parentCountry = <${val}>`,
    },
    {
      id: 'material',
      isMulti: true,
      isSortable: true,
      vocabulary: 'material',
      whereFunc: () => [
        `
        ?production ecrm:P126_employed ?material .
        {
          SELECT ?material ?broaderMaterial WHERE {
            OPTIONAL { ?broaderMaterial (skos:member|skos:narrower)* ?material. }
          }
        }
        `
      ],
      filterFunc: (val) => `?material = <${val}> || ?broaderMaterial = <${val}>`,
    },
    {
      id: 'technique',
      isMulti: true,
      isSortable: true,
      vocabulary: 'technique',
      whereFunc: () => [
        `
        ?production ecrm:P32_used_general_technique ?technique .
        {
          SELECT ?technique ?broaderTechnique WHERE {
            OPTIONAL { ?broaderTechnique (skos:member|skos:narrower)* ?technique. }
          }
        }
        `
      ],
      filterFunc: (val) => `?technique = <${val}> || ?broaderTechnique = <${val}>`,
    },
    {
      id: 'depiction',
      isMulti: true,
      isSortable: true,
      vocabulary: 'depiction',
      whereFunc: () => [
        '?id ecrm:P65_shows_visual_item ?depiction',
        'OPTIONAL { ?broaderDepiction (skos:member|skos:narrower)* ?depiction }'
      ],
      filterFunc: (val) => `?depiction = <${val}> || ?broaderDepiction = <${val}>`,
    },
    {
      id: 'type',
      isMulti: true,
      isSortable: true,
      vocabulary: 'type',
      whereFunc: () => [
        '?type_a ecrm:P41_classified ?id',
        '?type_a silk:L4|silk:L1 ?digTypeAssigned',
        '?type_a_group skos:member ?digTypeAssigned',
        '?digAssignedGroup skos:member ?digTypeAssigned',
      ],
      filterFunc: (val) => `?digAssignedGroup = <${val}>`,
    },
    {
      id: 'composed',
      isMulti: true,
      vocabulary: 'collection',
      whereFunc: () => [
        '?collection a ecrm:E78_Collection',
        '?collection ecrm:P106_is_composed_of ?id',
      ],
      filterFunc: (val) => `?collection = <${val}>`,
    },
    {
      id: 'show-only-fabric',
      isOption: true,
      whereFunc: () => [
        '?type_a ecrm:P41_classified ?id',
        '?type_a silk:L4|silk:L1 ?digTypeAssigned',
        '?type_a_group skos:member ?digTypeAssigned',
        '<http://data.silknow.org/vocabulary/facet/fabrics> skos:member ?digTypeAssigned',
      ],
    },
    {
      id: 'show-only-images',
      isOption: true,
      whereFunc: () => [
        '?id ecrm:P138i_has_representation ?representation',
        '?representation schema:contentUrl ?representationUrl',
        'FILTER(STRSTARTS(STR(?representationUrl), "https://silknow.org/"))',
      ],
    },
    {
      id: 'show-only-location',
      isOption: true,
      whereFunc: () => [
        '?production ecrm:P8_took_place_on_or_within ?location',
        '?location geo:lat ?locationLat',
        '?location geo:long ?locationLong',
      ],
    },
  ],
  labelFunc: (props) => props.label || props.identifier,
  baseWhere: [
    'GRAPH ?g { ?id a ecrm:E22_Man-Made_Object }',
    '?production ecrm:P108_has_produced ?id',
  ],
  metadata: {
    dimension: (value, index, { dimension }) => `${dimension[index].value} ${dimension[index].unit} (${dimension[index].type})`,
    technique: (value, index, { usedType }) =>
      // Combine technique and used object type
      `${value}${usedType && usedType[index] ? ` / ${usedType[index]['@id']}` : ''}`
    ,
    carriedOut: (value, index, { carriedOut }) => `${value}${carriedOut[index] && carriedOut[index].type ? ` (${carriedOut[index].type})` : ''}`,
  },
  query: {
    '@graph': [
      {
        '@type': 'http://erlangen-crm.org/current/E22_Man-Made_Object',
        '@id': '?id',
        '@graph': '?g',
        label: '?label',
        sameAs: '?sameAs',
        identifier: '?identifier',
        description: '?description',
        representation: {
          '@id': '?representation',
          image: '?representationUrl',
          label: '?representationRightComment'
        },
        legalBody: {
          '@id': '?legalBody',
          label: '?legalBodyLabel',
        },
        acquisition: {
          '@id': '?acquisition',
          label: '?acquisitionLabel',
        },
        carriedOut: {
          '@id': '?carriedOut',
          label: '?carriedOutLabel',
          type: '?carriedOutType',
          url: '?carriedOutUrl',
        },
        composed: {
          '@id': '?collection',
          '@type': 'http://erlangen-crm.org/current/E78_Collection',
          label: '?collectionLabel',
        },
        material: {
          '@id': '?material',
          label: '?materialLabel',
          prediction: {
            '@id': '?materialStatement',
            score: '?predictedMaterialScore',
            kind: '?predictedMaterialKind',
            explanation: '?predictedMaterialExplanation',
            used: '?predictedMaterialUsed',
          }
        },
        technique: {
          '@id': '?technique',
          label: '?techniqueLabel',
          prediction: {
            '@id': '?techniqueStatement',
            score: '?predictedTechniqueScore',
            kind: '?predictedTechniqueKind',
            explanation: '?predictedTechniqueExplanation',
            used: '?predictedTechniqueUsed',
          }
        },
        usedType: {
          '@id': '?usedType',
        },
        depiction: {
          '@id': '?depiction',
          label: '?depictionLabel',
          prediction: {
            '@id': '?depictionStatement',
            score: '?predictedDepictionScore',
            kind: '?predictedDepictionKind',
            explanation: '?predictedDepictionExplanation',
            used: '?predictedDepictionUsed',
          }
        },
        dimension: {
          '@id': '?dimension',
          type: '?dimensionType',
          value: '?dimensionValue',
          unit: '?dimensionUnit',
        },
        time: {
          '@id': '?time',
          label: '?timeLabel',
          prediction: {
            '@id': '?timeStatement',
            score: '?predictedTimeScore',
            kind: '?predictedTimeKind',
            explanation: '?predictedTimeExplanation',
            used: '?predictedTimeUsed',
          }
        },
        century: {
          '@id': '?century',
          label: '?centuryLabel'
        },
        location: {
          '@id': '?location',
          label: '?locationLabel',
          featureCode: '?locationFeatureCode',
          latitude: '?locationLat',
          longitude: '?locationLong',
          prediction: {
            '@id': '?locationStatement',
            score: '?predictedLocationScore',
            kind: '?predictedLocationKind',
            explanation: '?predictedLocationExplanation',
            used: '?predictedLocationUsed',
          }
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
      'GRAPH ?g { ?id a ecrm:E22_Man-Made_Object }',
      `
      {
        ?id dc:identifier ?identifier .
      }
      UNION
      {
        ?id rdfs:label ?label .
      }
      UNION
      {
        ?id owl:sameAs ?sameAs .
      }
      UNION
      {
        ?id ecrm:P3_has_note ?description .
      }
      UNION
      {
        ?custody ecrm:P30_transferred_custody_of ?id .
        ?custody ecrm:P29_custody_received_by ?legalBody .
        ?legalBody rdfs:label ?legalBodyLabel .
      }
      UNION
      {
        ?acquisition ecrm:P24_transferred_title_of ?id .
        ?acquisition ecrm:P23_transferred_title_from ?acquisitionLabel .
      }
      UNION
      {
        ?collection ecrm:P106_is_composed_of ?id .
        ?collection rdfs:label ?collectionLabel .
      }
      UNION
      {
        ?id ecrm:P43_has_dimension ?dimension .
        ?dimension ecrm:P2_has_type/skos:prefLabel ?dimensionType .
        ?dimension ecrm:P90_has_value ?dimensionValue .
        ?dimension ecrm:P91_has_unit ?dimensionUnit .
      }
      UNION
      {
        ?type_a ecrm:P41_classified ?id .
        ?type_a silk:L4|silk:L1 ?assigned .
        ?type_a_group skos:member ?assigned .
        ?assigned skos:prefLabel ?assignedLabel .
        FILTER(LANG(?assignedLabel) = "en" || LANG(?assignedLabel) = "")
      }
      UNION
      {
        ?production ecrm:P108_has_produced ?id .
        {
          GRAPH ?g {
            ?production ecrm:P32_used_general_technique ?technique .
          }
          ?technique skos:prefLabel ?techniqueLabel .
          FILTER(LANG(?techniqueLabel) = "en" || LANG(?techniqueLabel) = "")
        }
        UNION
        {
          SELECT DISTINCT ?production ?techniqueStatement ?technique ?techniqueLabel ?predictedTechniqueScore ?predictedTechniqueKind ?predictedTechniqueUsed ?predictedTechniqueExplanation WHERE {
            GRAPH <http://data.silknow.org/predictions> {
              ?techniqueStatement rdf:subject ?production .
              ?techniqueStatement rdf:predicate ecrm:P32_used_general_technique .
              ?techniqueStatement rdf:object ?technique .
              ?techniqueStatement silk:L18 ?predictedTechniqueScore .
              ?techniqueStatement prov:wasGeneratedBy/prov:wasAssociatedWith ?predictedTechniqueKind .
              OPTIONAL { ?techniqueStatement prov:wasGeneratedBy/prov:used ?predictedTechniqueUsed . }
              ?predictedTechniqueKind ecrm:P70_documents ?predictedTechniqueExplanation .
            }
            ?technique skos:prefLabel ?techniqueLabel .
            FILTER(LANG(?techniqueLabel) = "en" || LANG(?techniqueLabel) = "")
          }
        }
        UNION
        {
          ?production ecrm:P125_used_object_of_type ?usedType .
        }
        UNION
        {
          GRAPH ?g {
            ?production ecrm:P126_employed ?material .
          }
          ?material skos:prefLabel ?materialLabel .
          FILTER(LANG(?materialLabel) = "en" || LANG(?materialLabel) = "")
        }
        UNION
        {
          SELECT DISTINCT ?production ?materialStatement ?material ?materialLabel ?predictedMaterialScore ?predictedMaterialKind ?predictedMaterialUsed ?predictedMaterialExplanation WHERE {
            GRAPH <http://data.silknow.org/predictions> {
              ?materialStatement rdf:subject ?production .
              ?materialStatement rdf:predicate ecrm:P126_employed .
              ?materialStatement rdf:object ?material .
              ?materialStatement silk:L18 ?predictedMaterialScore .
              ?materialStatement prov:wasGeneratedBy/prov:wasAssociatedWith ?predictedMaterialKind .
              OPTIONAL { ?materialStatement prov:wasGeneratedBy/prov:used ?predictedMaterialUsed . }
              ?predictedMaterialKind ecrm:P70_documents ?predictedMaterialExplanation .
            }
            ?material skos:prefLabel ?materialLabel .
            FILTER(LANG(?materialLabel) = "en" || LANG(?materialLabel) = "")
          }
        }
        UNION
        {
          GRAPH ?g {
            { ?production ecrm:P4_has_time-span ?time . }
            UNION
            { ?production ecrm:P4_has_time-span/ecrm:P86_falls_within ?time . }
          }
          ?time skos:prefLabel ?timeLabel .
          FILTER(LANG(?timeLabel) = "en" || LANG(?timeLabel) = "")
        }
        UNION
        {
          SELECT DISTINCT ?production ?productionStatement ?time ?timeLabel ?predictedTimeScore ?predictedTimeKind ?predictedTimeUsed ?predictedTimeExplanation WHERE {
            GRAPH <http://data.silknow.org/predictions> {
              ?productionStatement rdf:subject ?production .
              ?productionStatement rdf:predicate ecrm:P4_has_time-span .
              { ?productionStatement rdf:object ?time . }
              UNION
              { ?productionStatement rdf:object/ecrm:P86_falls_within ?time . }
              ?productionStatement silk:L18 ?predictedTimeScore .
              ?productionStatement prov:wasGeneratedBy/prov:wasAssociatedWith ?predictedTimeKind .
              OPTIONAL { ?productionStatement prov:wasGeneratedBy/prov:used ?predictedTimeUsed . }
              ?predictedTimeKind ecrm:P70_documents ?predictedTimeExplanation .
            }
            ?time skos:prefLabel ?timeLabel .
            FILTER(LANG(?timeLabel) = "en" || LANG(?timeLabel) = "")
          }
        }
        UNION
        {
          { ?production ecrm:P4_has_time-span ?century . }
          UNION
          { ?production ecrm:P4_has_time-span/ecrm:P86_falls_within ?century . }
          <http://vocab.getty.edu/aat/300404464> skos:member ?century .
          ?century skos:prefLabel ?centuryLabel .
          FILTER(LANG(?centuryLabel) = "en" || LANG(?centuryLabel) = "")
        }
        UNION
        {
          GRAPH ?g {
            ?production ecrm:P8_took_place_on_or_within ?location .
          }
          OPTIONAL {
            ?location ?locationProp ?locationLabel .
            VALUES ?locationProp { geonames:name rdfs:label }
            FILTER(LANG(?locationLabel) = "en" || LANG(?locationLabel) = "")
          }
          OPTIONAL { ?location geo:lat ?locationLat . }
          OPTIONAL { ?location geo:long ?locationLong . }
          OPTIONAL { ?location geonames:parentCountry/geonames:name ?locationCountry . }
          OPTIONAL { ?location geonames:featureCode ?locationFeatureCode . }
        }
        UNION
        {
          SELECT DISTINCT ?production ?locationStatement ?location ?locationLabel ?locationFeatureCode ?locationLat ?locationLong ?predictedLocationScore ?predictedLocationKind ?predictedLocationUsed ?predictedLocationExplanation WHERE {
            GRAPH <http://data.silknow.org/predictions> {
              ?locationStatement rdf:subject ?production .
              ?locationStatement rdf:predicate ecrm:P8_took_place_on_or_within .
              ?locationStatement rdf:object ?location .
              ?locationStatement silk:L18 ?predictedLocationScore .
              ?locationStatement prov:wasGeneratedBy/prov:wasAssociatedWith ?predictedLocationKind .
              OPTIONAL { ?locationStatement prov:wasGeneratedBy/prov:used ?predictedLocationUsed . }
              ?predictedLocationKind ecrm:P70_documents ?predictedLocationExplanation .
            }
            OPTIONAL {
              ?location ?locationProp ?locationLabel .
              VALUES ?locationProp { geonames:name rdfs:label }
              FILTER(LANG(?locationLabel) = "en" || LANG(?locationLabel) = "")
            }
            OPTIONAL { ?location geo:lat ?locationLat . }
            OPTIONAL { ?location geo:long ?locationLong . }
            OPTIONAL { ?location geonames:parentCountry/geonames:name ?locationCountry . }
            OPTIONAL { ?location geonames:featureCode ?locationFeatureCode . }
          }
        }
        UNION
        {
          ?type_a ecrm:P41_classified ?id .
          ?type_a silk:L4|silk:L1 ?digTypeAssigned .
          ?type_a_group skos:member ?digTypeAssigned .
          ?digAssignedGroup skos:member ?digTypeAssigned .
          OPTIONAL {
            ?digAssignedGroup skos:prefLabel ?digAssignedGroupLabel .
            FILTER(LANG(?digAssignedGroupLabel) = "en" || LANG(?digAssignedGroupLabel) = "")
          }
        }
        UNION
        {
          ?production ecrm:P9_consists_of ?activityCarried .
          ?activityCarried ecrm:P14_carried_out_by ?carriedOut .
          OPTIONAL { ?activityCarried ecrm:P2_has_type ?carriedOutType . }
          ?carriedOut ecrm:P1_is_identified_by ?carriedOutLabel .
          OPTIONAL { ?carriedOut foaf:isPrimaryTopicOf ?carriedOutUrl . }
        }
      }
      UNION
      {
        GRAPH ?g {
          ?id ecrm:P65_shows_visual_item ?depiction .
        }
        ?depiction skos:prefLabel ?depictionLabel .
        FILTER(LANG(?depictionLabel) = "en" || LANG(?depictionLabel) = "")
      }
      UNION
      {
        SELECT DISTINCT ?id ?depictionStatement ?depiction ?depictionLabel ?predictedDepictionScore ?predictedDepictionKind ?predictedDepictionUsed ?predictedDepictionExplanation WHERE {
          GRAPH <http://data.silknow.org/predictions> {
            ?depictionStatement rdf:subject ?id .
            ?depictionStatement rdf:predicate ecrm:P65_shows_visual_item .
            ?depictionStatement rdf:object ?depiction .
            ?depictionStatement silk:L18 ?predictedDepictionScore .
            ?depictionStatement prov:wasGeneratedBy/prov:wasAssociatedWith ?predictedDepictionKind .
            OPTIONAL { ?depictionStatement prov:wasGeneratedBy/prov:used ?predictedDepictionUsed . }
            ?predictedDepictionKind ecrm:P70_documents ?predictedDepictionExplanation .
          }
          OPTIONAL {
            ?depiction skos:prefLabel ?depictionLabel .
            FILTER(LANG(?depictionLabel) = "en" || LANG(?depictionLabel) = "")
          }
        }
      }
      UNION
      {
        SELECT ?id ?representation ?representationRightComment (SAMPLE(?representationUrl) AS ?representationUrl) WHERE {
          ?id ecrm:P138i_has_representation ?representation .
          OPTIONAL {
            ?representation schema:contentUrl ?representationUrl .
            FILTER(STRSTARTS(STR(?representationUrl), "https://silknow.org/"))
          }
          OPTIONAL {
            ?representationRight a ecrm:E30_Right .
            ?representationRight ecrm:P104i_applies_to ?representation .
            ?representationRight rdfs:comment ?representationRightComment .
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
  },
};
