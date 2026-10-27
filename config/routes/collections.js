module.exports = {
  baseWhere: [
    'BIND(<http://data.silknow.org/vocabulary> AS ?g)',
    '?id a ecrm:E78_Collection',
  ],
  view: 'list',
  showInNavbar: false,
  backgroundColor: '#16406c',
  textColor: '#ffffff',
  query: {
    '@graph': [
      {
        '@id': '?id',
        label: '?itemLabel',
      },
    ],
    $where: [
      `
      ?id a ecrm:E78_Collection .
      ?id rdfs:label ?itemLabel .
      `
    ],
    $langTag: 'hide',
  },
  useWith: [
    {
      route: 'object',
      filter: 'composed',
    },
  ],
  textSearchFunc: (q) => {
    const words = q.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
    const wordsFor = (lit) => words.map((w) => `${lit} ql:has-word ${JSON.stringify(w)}`).join(' . ');
    return [
      `
      ?id rdfs:label ?_s1lit .
      ${wordsFor('?_s1lit')}
      `,
    ];
  },
};
