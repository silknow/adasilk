module.exports = {
  baseWhere: [
    'VALUES ?member { <http://data.silknow.org/vocabulary/209> <http://data.silknow.org/vocabulary/268> } . ?member skos:narrower+ ?id',
    'BIND(<http://data.silknow.org/vocabulary> AS ?g)',
  ],
  view: 'vocabulary',
  backgroundColor: '#335a80',
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
      'VALUES ?member { <http://data.silknow.org/vocabulary/209> <http://data.silknow.org/vocabulary/268> }',
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
          ?production ecrm:P126_employed ?id .
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
      filter: 'material',
    },
  ],
  skosmos: {
    uri: 'http://data.silknow.org/vocabulary/facet/materials'
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
          <http://data.silknow.org/vocabulary/441>
          <http://data.silknow.org/vocabulary/497>
          <http://data.silknow.org/vocabulary/627>
          <http://data.silknow.org/vocabulary/628>
          <http://data.silknow.org/vocabulary/214>
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
            ?object ecrm:P126_employed ?item .
          }
          GROUP BY ?item
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?item skos:member* ?id .
            ?object ecrm:P126_employed ?id .
          }
          GROUP BY ?item
        }`
      ],
      $langTag: 'hide',
    }),
  },
};
