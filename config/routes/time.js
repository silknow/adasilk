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
      '?production ecrm:P4_has_time-span ?time',
      '?time ecrm:P86_falls_within ?item',
      '?item skos:prefLabel ?itemLabel',
    ],
    $filter: ['langmatches(lang(?itemLabel), "en") || lang(?itemLabel) = ""'],
    $langTag: 'hide',
  },
  useWith: [
    {
      route: 'object',
      filter: 'time',
    },
  ],
  textSearchFunc: (q) => {
    const words = q.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
    const wordsFor = (lit) => words.map((w) => `${lit} ql:has-word ${JSON.stringify(w)}`).join(' . ');
    return [
      `
      ?item skos:prefLabel ?_s1lit .
      ${wordsFor('?_s1lit')}
      `,
    ];
  },
};
