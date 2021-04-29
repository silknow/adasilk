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
};
