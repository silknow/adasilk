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
      $limit: 5,
      $langTag: 'hide',
    },
    whereFunc: (q) => {
      const value = q.replace(/'/g, '\\\'');
      return [
        `
        {
          { ?id ?_s1p ?_s1o . ?_s1o bif:contains '"${value}*"' }
          UNION
          { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . ?_s2o bif:contains '"${value}*"' }
          UNION
          { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . ?_s2o ?_s3p ?_s3o . ?_s3o bif:contains '"${value}*"' }
        }
        `
      ];
    },
    allowImageSearch: true,
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
        excludedMetadata: ['representation', 'category'],
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
            '?production <http://erlangen-crm.org/current/P108_has_produced> ?id',
            '?production <http://erlangen-crm.org/current/P4_has_time-span> ?time',
          ],
          filterFunc: (value) => {
            return [`?time = <${value}>`];
          },
        },
        {
          id: 'location',
          isMulti: true,
          isSortable: true,
          query: {
            '@graph': [
              {
                '@id': '?locationCountry',
                label: '?locationCountryLabel',
              },
            ],
            $where: [
              '?production <http://erlangen-crm.org/current/P108_has_produced> ?id',
              '?production <http://erlangen-crm.org/current/P8_took_place_on_or_within> ?location',
              '?location <http://www.geonames.org/ontology#parentCountry> ?locationCountry',
              '?locationCountry <http://www.geonames.org/ontology#name> ?locationCountryLabel',
            ],
            $filter: [
              'langmatches(lang(?locationCountryLabel), "en") || lang(?locationCountryLabel) = ""',
            ],
            $orderby: ['ASC(?locationCountryLabel)'],
            $langTag: 'hide',
          },
          whereFunc: () => [
            '?production <http://erlangen-crm.org/current/P8_took_place_on_or_within> ?location',
            '?location <http://www.geonames.org/ontology#parentCountry> ?locationCountry',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?locationCountry = <${val}>`).join(' || ')];
          },
        },
        {
          id: 'material',
          isMulti: true,
          isSortable: true,
          vocabulary: 'material',
          whereFunc: () => [
            '?production <http://erlangen-crm.org/current/P126_employed> ?material',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?material = <${val}>`).join(' || ')];
          },
        },
        {
          id: 'technique',
          isMulti: true,
          isSortable: true,
          vocabulary: 'technique',
          whereFunc: () => [
            '?production <http://erlangen-crm.org/current/P32_used_general_technique> ?technique',
          ],
          filterFunc: (values) => {
            return [values.map((val) => `?technique = <${val}>`).join(' || ')];
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
      labelFunc: (props) => {
        if (props.label && props.label.length) {
          return props.label;
        }
        if (props.category && props.category.length) {
          return Array.isArray(props.category) ? props.category.map(cat => cat.label).join(', ') : props.category.label;
        }
        return props.identifier;
      },
      baseWhere: [
        'GRAPH ?g { ?id a <http://erlangen-crm.org/current/E22_Man-Made_Object> }',
        '?production <http://erlangen-crm.org/current/P108_has_produced> ?id',
      ],
      metadata: {
        dimension: (value) => {
          const dimensions = [];
          if (typeof value.width !== 'undefined') {
            dimensions.push(`${value.width}cm`);
          }
          if (typeof value.height !== 'undefined') {
            dimensions.push(`${value.height}cm`);
          }
          return dimensions.length > 0 ? dimensions.join(' x ') : null;
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
            representation: {
              '@id': '?representation',
              image: '?representationUrl',
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
            dimension: {
              '@id': '?id',
              width: '?dimensionWidthValue',
              height: '?dimensionHeightValue',
            },
            time: {
              '@id': '?time',
              label: '?timeLabel',
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
              ?collection <http://erlangen-crm.org/current/P106_is_composed_of> ?id .
              ?collection <http://www.w3.org/2000/01/rdf-schema#label> ?collectionLabel .
            }
          }
          UNION
          {
            OPTIONAL {
              ?id <http://erlangen-crm.org/current/P43_has_dimension> ?dimensionWidth .
              ?dimensionWidth <http://erlangen-crm.org/current/P2_has_type> "width" .
              ?dimensionWidth <http://erlangen-crm.org/current/P90_has_value> ?dimensionWidthValue .
            }
          }
          UNION
          {
            OPTIONAL {
              ?id <http://erlangen-crm.org/current/P43_has_dimension> ?dimensionHeight .
              ?dimensionHeight <http://erlangen-crm.org/current/P2_has_type> "height" .
              ?dimensionHeight <http://erlangen-crm.org/current/P90_has_value> ?dimensionHeightValue .
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
                  FILTER(ISIRI(?technique))
                }
              }
              UNION
              {
                OPTIONAL {
                  ?production <http://erlangen-crm.org/current/P126_employed> ?material .
                  FILTER(ISIRI(?material))
                }
              }
              UNION
              {
                OPTIONAL {
                  ?production <http://erlangen-crm.org/current/P4_has_time-span> ?time .
                  ?time <http://www.w3.org/2004/02/skos/core#prefLabel> ?timeLabel .
                  FILTER(LANG(?timeLabel) = "en")
                }
              }
              UNION
              {
                OPTIONAL {
                  ?production <http://erlangen-crm.org/current/P8_took_place_on_or_within> ?location .
                  OPTIONAL {
                    ?location <http://www.geonames.org/ontology#name> ?locationLabel .
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
              SELECT ?id ?representation (SAMPLE(?representationUrl) AS ?representationUrl) WHERE {
                ?id <http://erlangen-crm.org/current/P138i_has_representation> ?representation .
                OPTIONAL {
                  ?representation <http://schema.org/contentUrl> ?representationUrl .
                  FILTER(STRSTARTS(STR(?representationUrl), "https://silknow.org/"))
                }
              }
            }
          }
          `
        ],
        $langTag: 'hide',
      },
      textSearchFunc: (q) => {
        const value = q.replace(/'/g, '\\\'');
        return [
          `
          {
            { ?id ?_s1p ?_s1o . ?_s1o bif:contains '"${value}*"' }
            UNION
            { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . ?_s2o bif:contains '"${value}*"' }
            UNION
            { ?_s1o ?_s1p ?id . ?_s1o ?_s2p ?_s2o . ?_s2o ?_s3p ?_s3o . ?_s3o bif:contains '"${value}*"' }
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
            },
          },
        ],
        $where: [
          '<http://data.silknow.org/vocabulary/facet/techniques> <http://www.w3.org/2004/02/skos/core#member> ?member',
          '?member <http://www.w3.org/2004/02/skos/core#prefLabel> ?memberLabel',
          `OPTIONAL {
            ?member <http://www.w3.org/2004/02/skos/core#member> ?item .
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
              FILTER(LANG(?itemLabel) = "en")
            }
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition .
              FILTER(LANG(?itemDefinition) = "en")
            }
          }`,
        ],
        $filter: ['lang(?memberLabel) = "en"'],
        $orderby: ['ASC(?memberLabel)', 'ASC(?itemLabel)'],
        $langTag: 'hide',
      },
      useWith: [
        {
          route: 'object',
          filter: 'technique',
        },
      ],
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
            },
          },
        ],
        $where: [
          '<http://data.silknow.org/vocabulary/facet/materials> <http://www.w3.org/2004/02/skos/core#member> ?member',
          '?member <http://www.w3.org/2004/02/skos/core#prefLabel> ?memberLabel',
          `OPTIONAL {
            ?member <http://www.w3.org/2004/02/skos/core#member> ?item .
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
              FILTER(LANG(?itemLabel) = "en")
            }
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition .
              FILTER(LANG(?itemDefinition) = "en")
            }
          }`,
        ],
        $filter: ['lang(?memberLabel) = "en"'],
        $orderby: ['ASC(?memberLabel)', 'ASC(?itemLabel)'],
        $langTag: 'hide',
      },
      useWith: [
        {
          route: 'object',
          filter: 'material',
        },
      ],
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
            },
          },
        ],
        $where: [
          '<http://data.silknow.org/vocabulary/facet/depiction> <http://www.w3.org/2004/02/skos/core#member> ?member',
          '?member <http://www.w3.org/2004/02/skos/core#prefLabel> ?memberLabel',
          `OPTIONAL {
            ?member <http://www.w3.org/2004/02/skos/core#member> ?item .
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel .
              FILTER(LANG(?itemLabel) = "en")
            }
            OPTIONAL {
              ?item <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition .
              FILTER(LANG(?itemDefinition) = "en")
            }
          }`,
        ],
        $filter: ['lang(?memberLabel) = "en"'],
        $orderby: ['ASC(?memberLabel)', 'ASC(?itemLabel)'],
        $langTag: 'hide',
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
          '?production <http://erlangen-crm.org/current/P32_used_general_technique> ?technique',
          '?technique <http://www.w3.org/2004/02/skos/core#prefLabel> ?techniqueLabel',
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
          '?production <http://erlangen-crm.org/current/P126_employed> ?material',
          '?material <http://www.w3.org/2004/02/skos/core#prefLabel> ?materialLabel',
        ],
        $filter: ['lang(?materialLabel) = "en"'],
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
      url: 'https://skosmos.silknow.org/thesaurus/en/page/?uri=',
    },
  },
};
