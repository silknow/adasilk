module.exports = {
  baseWhere: [
    'VALUES ?member { <http://data.silknow.org/vocabulary/827> <http://data.silknow.org/vocabulary/318> } . ?member skos:narrower+ ?id',
    'BIND(<http://data.silknow.org/vocabulary> AS ?g)',
  ],
  view: 'vocabulary',
  backgroundColor: '#16406c',
  textColor: '#ffffff',
  query: ({ language }) => ({
    '@graph': [
      {
        '@id': '?id',
        label: '?itemLabel',
        description: '?itemDefinition',
        count: '?count',
      },
    ],
    $where: [
      'VALUES ?member { <http://data.silknow.org/vocabulary/827> <http://data.silknow.org/vocabulary/318> }',
      '?member skos:narrower+ ?id',
      `OPTIONAL {
        ?id skos:prefLabel ?itemLabel .
        FILTER(LANG(?itemLabel) = "${language}")
      }`,
      `OPTIONAL {
        ?id skos:definition ?itemDefinition .
        FILTER(LANG(?itemDefinition) = "${language}")
      }`,
      `OPTIONAL {
        SELECT ?id (COUNT(DISTINCT ?production) AS ?count) WHERE {
          ?production ecrm:P32_used_general_technique ?id .
        }
        GROUP BY ?id
      }`,
    ],
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
  textSearchFunc: (q) => {
    const words = q.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
    const wordsFor = (lit) => words.map((w) => `${lit} ql:has-word ${JSON.stringify(w)}`).join(' . ');
    return [
      `
      ?id skos:prefLabel ?_s1lit .
      ${wordsFor('?_s1lit')}
      `,
    ];
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
          GROUP BY ?item
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?item skos:member* ?id .
            ?object ecrm:P32_used_general_technique ?id .
          }
          GROUP BY ?item
        }`
      ],
      $langTag: 'hide',
    }),
  },
};
