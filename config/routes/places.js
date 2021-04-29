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
      '?production ecrm:P8_took_place_on_or_within ?item',
      '?item geonames:name ?itemLabel',
    ],
    $langTag: 'hide',
  },
  useWith: [
    {
      route: 'object',
      filter: 'location',
    },
  ],
};
