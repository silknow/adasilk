module.exports = {
  view: 'vocabulary',
  backgroundColor: '#16406c',
  textColor: '#ffffff',
  query: ({ language }) => ({
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
      'VALUES ?member { <http://data.silknow.org/vocabulary/827> <http://data.silknow.org/vocabulary/318> }',
      '?member skos:prefLabel ?memberLabel',
      `OPTIONAL {
        ?member skos:narrower ?item .
        {
          OPTIONAL {
            ?item skos:prefLabel ?itemLabel .
            FILTER(LANG(?itemLabel) = "${language}")
          }
        }
        UNION
        {
          OPTIONAL {
            ?item skos:definition ?itemDefinition .
            FILTER(LANG(?itemDefinition) = "${language}")
          }
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?production) AS ?count) WHERE {
            ?production ecrm:P32_used_general_technique ?item .
          }
        }

        OPTIONAL {
          ?item skos:narrower ?item2 .
          {
            OPTIONAL {
              ?item2 skos:prefLabel ?itemLabel2 .
              FILTER(LANG(?itemLabel2) = "${language}")
            }
          }
          UNION
          {
            OPTIONAL {
              ?item2 skos:definition ?itemDefinition2 .
              FILTER(LANG(?itemDefinition2) = "${language}")
            }
          }
          UNION
          {
            SELECT ?item2 (COUNT(DISTINCT ?production2) AS ?count2) WHERE {
              ?production2 ecrm:P32_used_general_technique ?item2 .
            }
          }

          OPTIONAL {
            ?item2 skos:narrower ?item3 .
            {
              OPTIONAL {
                ?item3 skos:prefLabel ?itemLabel3 .
                FILTER(LANG(?itemLabel3) = "${language}")
              }
            }
            UNION
            {
              OPTIONAL {
                ?item3 skos:definition ?itemDefinition3 .
                FILTER(LANG(?itemDefinition3) = "${language}")
              }
            }
            UNION
            {
              SELECT ?item3 (COUNT(DISTINCT ?production3) AS ?count3) WHERE {
                ?production3 ecrm:P32_used_general_technique ?item3 .
              }
            }
          }
        }
      }`,
    ],
    $filter: [`lang(?memberLabel) = "${language}"`],
    $orderby: ['DESC(?count)'],
    $langTag: 'hide',
  }),
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
    query: ({ language }) => ({
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
            ?item skos:prefLabel ?itemLabel .
            FILTER(LANG(?itemLabel) = "${language}")
          }
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?object ecrm:P32_used_general_technique ?item .
          }
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?item skos:member* ?member .
            ?object ecrm:P32_used_general_technique ?member .
          }
        }`
      ],
      $langTag: 'hide',
    }),
  },
};
