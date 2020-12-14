module.exports = {
  debug: typeof process !== 'undefined' && process.env.NODE_ENV === 'development',
  metadata: {
    title: 'ADASilk',
  },
  home: {
    hero: {
      showHeadline: true,
      // showLogo: true,
      image: '/images/silknow-hero.jpg',
    },
  },
  footer: {
    logo: [
      '/images/silknow-footer.png',
      '/images/virtual-loom-logo.png',
      '/images/stmaps-logo.png'
    ]
  },
  search: {
    route: 'object',
    allowTextSearch: true,
    textSearchQuery: {
      '@graph': [
        {
          '@id': '?id',
          '@type': '?rdfType',
          label: '?label',
          representation: {
            '@id': '?representation',
            image: '?representationUrl',
          },
        },
      ],
      $where: [
        '?id a ?rdfType',
        'VALUES ?rdfType { <http://erlangen-crm.org/current/E22_Man-Made_Object> }',
        '?id <http://www.w3.org/2000/01/rdf-schema#label> ?label',
        // Needed because silknow has 2 duplicate images (the source one and the one hosted on silknow.org cloud server)
        // We should only return the silknow.org one
        `OPTIONAL {
          SELECT ?id ?representation (SAMPLE(?representationUrl) AS ?representationUrl) WHERE {
            ?id <http://erlangen-crm.org/current/P138i_has_representation> ?representation .
            OPTIONAL {
              ?representation <http://schema.org/contentUrl> ?representationUrl .
              FILTER(STRSTARTS(STR(?representationUrl), "https://silknow.org/"))
            }
          }
        }`,
      ],
      $langTag: 'hide',
    },
    allowImageSearch: false,
    placeholderImage: '/images/silknow-placeholder.png',
    languages: {
      en: 'English',
      fr: 'Français',
    },
    graphFieldLabel: {
      en: 'Museum',
      fr: 'Musée',
    },
    defaultLanguage: 'en',
  },
  api: {
    endpoint: 'https://data.silknow.org/sparql',
  },
  routes: {
    object: {
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
          isMulti: false,
          isSortable: true,
          query: {
            '@graph': [
              {
                '@id': '?time',
                label: '?label',
              },
            ],
            $where: [
              '?production <http://erlangen-crm.org/current/P4_has_time-span> ?time',
              '?time <http://www.w3.org/2004/02/skos/core#prefLabel> ?label',
            ],
            $filter: ['langmatches(lang(?label), "en") || lang(?label) = ""'],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?production <http://erlangen-crm.org/current/P4_has_time-span> ?time',
            'OPTIONAL { ?time <http://erlangen-crm.org/current/P86_falls_within> ?fallsWithin . }'
          ],
          filterFunc: (value) => {
            return [`?time = <${value}> || ?fallsWithin = <${value}>`];
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
            },
            technique: {
              '@id': '?technique',
            },
            usedType: {
              '@id': '?usedType',
            },
            depiction: {
              '@id': '?depiction',
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
    },
    techniques: {
      view: 'vocabulary',
      backgroundColor: '#16406c',
      textColor: '#ffffff',
      query: {
        '@graph': [
          {
            '@id': '?member',
            label: '?memberLabel',
            items: {
              '@id': '?item',
              label: '?itemLabel',
              description: '?itemDefinition',
              count: '?count',
              items: {
                '@id': '?item2',
                label: '?itemLabel2',
                description: '?itemDefinition2',
                count: '?count2',
              },
            },
          },
        ],
        $where: [
          'VALUES ?member { <http://data.silknow.org/vocabulary/827> <http://data.silknow.org/vocabulary/318> }',
          '?member <http://www.w3.org/2004/02/skos/core#prefLabel> ?memberLabel',
          `OPTIONAL {
            ?member <http://www.w3.org/2004/02/skos/core#narrower> ?item .
            {
              OPTIONAL {
                ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
                FILTER(LANG(?itemLabel) = "en")
              }
            }
            UNION
            {
              OPTIONAL {
                ?item <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition .
                FILTER(LANG(?itemDefinition) = "en")
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?production) AS ?count) WHERE {
                ?production <http://erlangen-crm.org/current/P32_used_general_technique> ?item .
              }
            }

            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#narrower> ?item2 .
              {
                OPTIONAL {
                  ?item2 <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel2 .
                  FILTER(LANG(?itemLabel2) = "en")
                }
              }
              UNION
              {
                OPTIONAL {
                  ?item2 <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition2 .
                  FILTER(LANG(?itemDefinition2) = "en")
                }
              }
              UNION
              {
                SELECT ?item2 (COUNT(DISTINCT ?production2) AS ?count2) WHERE {
                  ?production2 <http://erlangen-crm.org/current/P32_used_general_technique> ?item2 .
                }
              }
            }
          }`,
        ],
        $filter: ['lang(?memberLabel) = "en"'],
        $orderby: ['DESC(?count)'],
        $langTag: 'hide',
      },
      useWith: [
        {
          route: 'object',
          filter: 'technique',
        },
      ],
      skosmos: {
        uri: 'http://data.silknow.org/vocabulary/facet/techniques'
      },
      featured: {
        query: {
          '@graph': [
            {
              '@id': '?item',
              label: '?itemLabel',
              count: '?count',
            },
          ],
          $where: [
            `VALUES ?item {
              <http://data.silknow.org/vocabulary/379>
              <http://data.silknow.org/vocabulary/168>
              <http://data.silknow.org/vocabulary/192>
              <http://data.silknow.org/vocabulary/366>
              <http://data.silknow.org/vocabulary/236>
              <http://data.silknow.org/vocabulary/238>
              <http://data.silknow.org/vocabulary/103>
              <http://data.silknow.org/vocabulary/87>
              <http://data.silknow.org/vocabulary/305>
            }
            {
              OPTIONAL {
                ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
                FILTER(LANG(?itemLabel) = "en")
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
                ?object <http://erlangen-crm.org/current/P32_used_general_technique> ?item .
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
                ?item skos:member* ?member .
                ?object <http://erlangen-crm.org/current/P32_used_general_technique> ?member .
              }
            }`
          ],
          $langTag: 'hide',
        },
      },
    },
    materials: {
      view: 'vocabulary',
      backgroundColor: '#335a80',
      textColor: '#ffffff',
      query: {
        '@graph': [
          {
            '@id': '?member',
            label: '?memberLabel',
            items: {
              '@id': '?item',
              label: '?itemLabel',
              description: '?itemDefinition',
              count: '?count',
              items: {
                '@id': '?item2',
                label: '?itemLabel2',
                description: '?itemDefinition2',
                count: '?count2',
              },
            },
          },
        ],
        $where: [
          'VALUES ?member { <http://data.silknow.org/vocabulary/209> <http://data.silknow.org/vocabulary/268> }',
          '?member <http://www.w3.org/2004/02/skos/core#prefLabel> ?memberLabel',
          `OPTIONAL {
            ?member <http://www.w3.org/2004/02/skos/core#narrower> ?item .
            {
              OPTIONAL {
                ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
                FILTER(LANG(?itemLabel) = "en")
              }
            }
            UNION
            {
              OPTIONAL {
                ?item <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition .
                FILTER(LANG(?itemDefinition) = "en")
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?production) AS ?count) WHERE {
                ?production <http://erlangen-crm.org/current/P126_employed> ?item .
              }
            }

            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#narrower> ?item2 .
              {
                OPTIONAL {
                  ?item2 <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel2 .
                  FILTER(LANG(?itemLabel2) = "en")
                }
              }
              UNION
              {
                OPTIONAL {
                  ?item2 <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition2 .
                  FILTER(LANG(?itemDefinition2) = "en")
                }
              }
              UNION
              {
                SELECT ?item2 (COUNT(DISTINCT ?production2) AS ?count2) WHERE {
                  ?production2 <http://erlangen-crm.org/current/P126_employed> ?item2 .
                }
              }
            }
          }`,
        ],
        $filter: ['lang(?memberLabel) = "en"'],
        $orderby: ['DESC(?count)'],
        $langTag: 'hide',
      },
      useWith: [
        {
          route: 'object',
          filter: 'material',
        },
      ],
      skosmos: {
        uri: 'http://data.silknow.org/vocabulary/facet/materials'
      },
      featured: {
        query: {
          '@graph': [
            {
              '@id': '?item',
              label: '?itemLabel',
              count: '?count',
            },
          ],
          $where: [
            `VALUES ?item {
              <http://data.silknow.org/vocabulary/441>
              <http://data.silknow.org/vocabulary/497>
              <http://data.silknow.org/vocabulary/627>
              <http://data.silknow.org/vocabulary/628>
              <http://data.silknow.org/vocabulary/214>
            }
            {
              OPTIONAL {
                ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
                FILTER(LANG(?itemLabel) = "en")
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
                ?object <http://erlangen-crm.org/current/P126_employed> ?item .
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
                ?item skos:member* ?member .
                ?object <http://erlangen-crm.org/current/P126_employed> ?member .
              }
            }`
          ],
          $langTag: 'hide',
        },
      },
    },
    depictions: {
      view: 'vocabulary',
      backgroundColor: '#5c81a6',
      textColor: '#ffffff',
      query: {
        '@graph': [
          {
            '@id': '?member',
            label: '?memberLabel',
            items: {
              '@id': '?item',
              label: '?itemLabel',
              description: '?itemDefinition',
              count: '?count',
              items: {
                '@id': '?item2',
                label: '?itemLabel2',
                description: '?itemDefinition2',
                count: '?count2',
              },
            },
          },
        ],
        $where: [
          'VALUES ?member { <http://data.silknow.org/vocabulary/742> }',
          '?member <http://www.w3.org/2004/02/skos/core#prefLabel> ?memberLabel',
          `OPTIONAL {
            ?member <http://www.w3.org/2004/02/skos/core#narrower> ?item .
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
              FILTER(LANG(?itemLabel) = "en")
            }
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition .
              FILTER(LANG(?itemDefinition) = "en")
            }
            {
              SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
                ?object <http://erlangen-crm.org/current/P62_depicts> ?item .
              }
            }

            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#narrower> ?item2 .
              {
                OPTIONAL {
                  ?item2 <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel2 .
                  FILTER(LANG(?itemLabel2) = "en")
                }
              }
              UNION
              {
                OPTIONAL {
                  ?item2 <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition2 .
                  FILTER(LANG(?itemDefinition2) = "en")
                }
              }
              UNION
              {
                SELECT ?item2 (COUNT(DISTINCT ?production2) AS ?count2) WHERE {
                  ?production2 <http://erlangen-crm.org/current/P62_depicts> ?item2 .
                }
              }
            }
          }`,
        ],
        $filter: ['lang(?memberLabel) = "en"'],
        $orderby: ['DESC(?count)'],
        $langTag: 'hide',
      },
      skosmos: {
        uri: 'http://data.silknow.org/vocabulary/facet/depiction'
      },
      useWith: [
        {
          route: 'object',
          filter: 'depiction',
        },
      ],
      featured: {
        query: {
          '@graph': [
            {
              '@id': '?item',
              label: '?itemLabel',
              count: '?count',
            },
          ],
          $where: [
            `VALUES ?item {
              <http://data.silknow.org/vocabulary/761>
              <http://data.silknow.org/vocabulary/743>
              <http://data.silknow.org/vocabulary/745>
              <http://data.silknow.org/vocabulary/747>
              <http://data.silknow.org/vocabulary/744>
              <http://data.silknow.org/vocabulary/818>
            }
            {
              OPTIONAL {
                ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
                FILTER(LANG(?itemLabel) = "en")
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
                ?object <http://erlangen-crm.org/current/P62_depicts> ?item .
              }
            }
            UNION
            {
              SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
                ?item skos:member* ?member .
                ?object <http://erlangen-crm.org/current/P62_depicts> ?member .
              }
            }`
          ],
          $langTag: 'hide',
        },
      },
    },
  },
  gallery: {
    options: {
      showArrows: true,
      showStatus: true,
      showIndicators: false,
      infiniteLoop: false,
      showThumbs: true,
      autoPlay: false,
      stopOnHover: true,
      swipeable: true,
      dynamicHeight: false,
      emulateTouch: true,
    },
  },
  graphs: {
    'http://data.silknow.org/graph/met': {
      label: 'Metropolitan Museum of Art',
      icon: '/images/graphs/http-data-silknow-org-met.png',
    },
    'http://data.silknow.org/graph/unipa': {
      label: 'Sicily Cultural Heritage',
      icon: '/images/graphs/http-data-silknow-org-unipa.png',
    },
    'http://data.silknow.org/graph/imatex': {
      label: 'CDMT Terrassa',
      icon: '/images/graphs/http-data-silknow-org-imatex.png',
    },
    'http://data.silknow.org/graph/vam': {
      label: 'Victoria and Albert Museum',
      icon: '/images/graphs/http-data-silknow-org-vam.png',
    },
    'http://data.silknow.org/graph/garin': {
      label: 'Garín 1820',
      icon: '/images/graphs/http-data-silknow-org-garin.png',
    },
    'http://data.silknow.org/graph/mad': {
      label: 'Musée des Arts Décoratifs',
      icon: '/images/graphs/http-data-silknow-org-mad.png',
    },
    'http://data.silknow.org/graph/mfa': {
      label: 'Boston Museum of Fine Arts',
      icon: '/images/graphs/http-data-silknow-org-mfa.png',
    },
    'http://data.silknow.org/graph/risd': {
      label: 'Rhode Island School of Design',
      icon: '/images/graphs/http-data-silknow-org-risd.png',
    },
    'http://data.silknow.org/graph/cer': {
      label: 'Red Digital de Colecciones de Museos de España',
      icon: '/images/graphs/http-data-silknow-org-cer.png',
    },
    'http://data.silknow.org/graph/joconde': {
      label: 'Joconde Database of French Museum Collections',
      icon: '/images/graphs/http-data-silknow-org-joconde.png',
    },
    'http://data.silknow.org/graph/mtmad': {
      label: 'Musée des Tissus',
      icon: '/images/graphs/http-data-silknow-org-mtmad.png',
    },
  },
  vocabularies: {
    technique: {
      query: {
        '@graph': [
          {
            '@id': '?technique',
            label: '?techniqueLabel',
          },
        ],
        $where: [
          `
          { ?production <http://erlangen-crm.org/current/P32_used_general_technique> ?technique . }
          UNION
          { <http://data.silknow.org/vocabulary/facet/techniques> (skos:member|skos:narrower)* ?technique . }
          ?technique <http://www.w3.org/2004/02/skos/core#prefLabel> ?techniqueLabel
          `,
        ],
        $filter: ['lang(?techniqueLabel) = "en"'],
        $langTag: 'hide',
      },
    },
    material: {
      query: {
        '@graph': [
          {
            '@id': '?material',
            label: '?materialLabel',
          },
        ],
        $where: [
          `
          { ?production <http://erlangen-crm.org/current/P126_employed> ?material . }
          UNION
          { <http://data.silknow.org/vocabulary/facet/materials> (skos:member|skos:narrower)* ?material . }
          ?material <http://www.w3.org/2004/02/skos/core#prefLabel> ?materialLabel
          `,
        ],
        $filter: ['lang(?materialLabel) = "en"'],
        $langTag: 'hide',
      },
    },
    depiction: {
      query: {
        '@graph': [
          {
            '@id': '?depiction',
            label: '?depictionLabel',
          },
        ],
        $where: [
          `
          { ?id <http://erlangen-crm.org/current/P62_depicts> ?depiction . }
          UNION
          { <http://data.silknow.org/vocabulary/facet/depiction> (skos:member|skos:narrower)* ?depiction . }
          ?depiction <http://www.w3.org/2004/02/skos/core#prefLabel> ?depictionLabel
          `,
        ],
        $filter: ['lang(?depictionLabel) = "en"'],
        $langTag: 'hide',
      },
    },
    type: {
      query: {
        '@graph': [
          {
            '@id': '?digAsignedGroup',
            label: '?digAssignedGroupLabel',
          },
        ],
        $where: [
          '?dig ecrm:P129_is_about ?production',
          '?dig a crmdig:D1_Digital_Object',
          '?dig ecrm:P129_is_about/ecrm:P42_assigned ?digTypeAssigned',
          '?digAsignedGroup skos:member ?digTypeAssigned',
          '<http://data.silknow.org/vocabulary/facet/assignedtypes> skos:member ?digAsignedGroup',
          `OPTIONAL {
            ?digAsignedGroup <http://www.w3.org/2004/02/skos/core#prefLabel> ?digAssignedGroupLabel .
            FILTER(LANG(?digAssignedGroupLabel) = "en" || LANG(?digAssignedGroupLabel) = "")
          }`,
        ],
        $filter: ['lang(?digAssignedGroupLabel) = "en"'],
        $langTag: 'hide',
      },
    },
  },
  plugins: {
    virtualLoom: {
      url: 'https://ada.silknow.org/vloom/',
    },
    spatioTemporalMaps: {
      url: 'https://ada.silknow.org/spatio-temporal-maps/',
    },
    skosmos: {
      thesaurusUrl: 'https://skosmos.silknow.org/thesaurus/',
      baseUrl: 'https://skosmos.silknow.org/thesaurus/en/page/?uri=',
    },
    consent: {
      show: true
    }
  },
};
