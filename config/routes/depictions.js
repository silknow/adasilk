module.exports = {
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
            items: {
              '@id': '?item3',
              label: '?itemLabel3',
              description: '?itemDefinition3',
              count: '?count3',
            },
          },
        },
      },
    ],
    $where: [
      'VALUES ?member { <http://data.silknow.org/vocabulary/742> }',
      '?member skos:prefLabel ?memberLabel',
      `OPTIONAL {
        ?member skos:narrower ?item .
        OPTIONAL {
          ?item skos:prefLabel ?itemLabel .
          FILTER(LANG(?itemLabel) = "en")
        }
        OPTIONAL {
          ?item skos:definition ?itemDefinition .
          FILTER(LANG(?itemDefinition) = "en")
        }
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?object ecrm:P62_depicts ?item .
          }
        }

        OPTIONAL {
          ?item skos:narrower ?item2 .
          {
            OPTIONAL {
              ?item2 skos:prefLabel ?itemLabel2 .
              FILTER(LANG(?itemLabel2) = "en")
            }
          }
          UNION
          {
            OPTIONAL {
              ?item2 skos:definition ?itemDefinition2 .
              FILTER(LANG(?itemDefinition2) = "en")
            }
          }
          UNION
          {
            SELECT ?item2 (COUNT(DISTINCT ?production2) AS ?count2) WHERE {
              ?production2 ecrm:P62_depicts ?item2 .
            }
          }

          OPTIONAL {
            ?item2 skos:narrower ?item3 .
            {
              OPTIONAL {
                ?item3 skos:prefLabel ?itemLabel3 .
                FILTER(LANG(?itemLabel3) = "en")
              }
            }
            UNION
            {
              OPTIONAL {
                ?item3 skos:definition ?itemDefinition3 .
                FILTER(LANG(?itemDefinition3) = "en")
              }
            }
            UNION
            {
              SELECT ?item3 (COUNT(DISTINCT ?production3) AS ?count3) WHERE {
                ?production3 ecrm:P62_depicts ?item3 .
              }
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
            ?item skos:prefLabel ?itemLabel .
            FILTER(LANG(?itemLabel) = "en")
          }
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?object ecrm:P62_depicts ?item .
          }
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?item skos:member* ?member .
            ?object ecrm:P62_depicts ?member .
          }
        }`
      ],
      $langTag: 'hide',
    },
  },
};
