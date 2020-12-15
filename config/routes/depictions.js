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
                ?production3 <http://erlangen-crm.org/current/P62_depicts> ?item3 .
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
};
