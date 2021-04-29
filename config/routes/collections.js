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
};
