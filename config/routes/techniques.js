module.exports = {
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

          OPTIONAL {
            ?item2 <http://www.w3.org/2004/02/skos/core#narrower> ?item3 .
            {
              OPTIONAL {
                ?item3 <http://www.w3.org/2004/02/skos/core#prefLabel> ?itemLabel3 .
                FILTER(LANG(?itemLabel3) = "en")
              }
            }
            UNION
            {
              OPTIONAL {
                ?item3 <http://www.w3.org/2004/02/skos/core#definition> ?itemDefinition3 .
                FILTER(LANG(?itemDefinition3) = "en")
              }
            }
            UNION
            {
              SELECT ?item3 (COUNT(DISTINCT ?production3) AS ?count3) WHERE {
                ?production3 <http://erlangen-crm.org/current/P32_used_general_technique> ?item3 .
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
};
