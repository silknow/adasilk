module.exports = {
  view: 'list',
  showInNavbar: false,
  backgroundColor: '#16406c',
  textColor: '#ffffff',
  query: {
    '@graph': [
      {
        '@id': '?item',
        label: '?itemLabel',
      },
    ],
    $where: [
      `
      ?item a ecrm:E78_Collection .
      ?item ecrm:P106_is_composed_of ?id .
      ?item rdfs:label ?itemLabel .
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
      ?item rdfs:label ?_s1lit .
      ${wordsFor('?_s1lit')}
      `,
    ];
  },
};
