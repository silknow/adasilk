module.exports = {
  baseWhere: [
    '?production ecrm:P8_took_place_on_or_within ?id',
    'BIND(<http://data.silknow.org/vocabulary> AS ?g)',
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
      '?production ecrm:P8_took_place_on_or_within ?id',
      '?id geonames:name ?itemLabel',
    ],
    $langTag: 'hide',
  },
  useWith: [
    {
      route: 'object',
      filter: 'location',
    },
  ],
  textSearchFunc: (q) => {
    const words = q.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
    const wordsFor = (lit) => words.map((w) => `${lit} ql:has-word ${JSON.stringify(w)}`).join(' . ');
    return [
      `
      ?id geonames:name ?_s1lit .
      ${wordsFor('?_s1lit')}
      `,
    ];
  },
};
