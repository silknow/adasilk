module.exports = {
  baseWhere: [
    'VALUES ?member { <http://data.silknow.org/vocabulary/742> } . ?member skos:narrower+ ?id',
    'BIND(<http://data.silknow.org/vocabulary> AS ?g)',
  ],
  view: 'vocabulary',
  backgroundColor: '#5c81a6',
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
      'VALUES ?member { <http://data.silknow.org/vocabulary/742> }',
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
        SELECT ?id (COUNT(DISTINCT ?object) AS ?count) WHERE {
          ?object ecrm:P65_shows_visual_item ?id .
        }
        GROUP BY ?id
      }`,
    ],
    $orderby: ['DESC(?count)'],
    $langTag: 'hide',
  }),
  skosmos: {
    uri: 'http://data.silknow.org/vocabulary/facet/depiction'
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
  useWith: [
    {
      route: 'object',
      filter: 'depiction',
    },
  ],
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
            FILTER(LANG(?itemLabel) = "${language}")
          }
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?object ecrm:P65_shows_visual_item ?item .
          }
          GROUP BY ?item
        }
        UNION
        {
          SELECT ?item (COUNT(DISTINCT ?object) AS ?count) WHERE {
            ?item skos:member* ?id .
            ?object ecrm:P65_shows_visual_item ?id .
          }
          GROUP BY ?item
        }`
      ],
      $langTag: 'hide',
    }),
  },
};
