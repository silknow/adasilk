module.exports = {
  view: 'list',
  showInNavbar: false,
  backgroundColor: '#16406c',
  textColor: '#ffffff',
  items: [{
    '@id': 'http://data.silknow.org/graph/met',
    label: 'Metropolitan Museum of Art',
    icon: '/images/graphs/http-data-silknow-org-met.png',
  }, {
    '@id': 'http://data.silknow.org/graph/unipa',
    label: 'Sicily Cultural Heritage',
    icon: '/images/graphs/http-data-silknow-org-unipa.png',
  }, {
    '@id': 'http://data.silknow.org/graph/imatex',
    label: 'CDMT Terrassa',
    icon: '/images/graphs/http-data-silknow-org-imatex.png',
  }, {
    '@id': 'http://data.silknow.org/graph/vam',
    label: 'Victoria and Albert Museum',
    icon: '/images/graphs/http-data-silknow-org-vam.png',
  }, {
    '@id': 'http://data.silknow.org/graph/garin',
    label: 'Garín 1820',
    icon: '/images/graphs/http-data-silknow-org-garin.png',
  }, {
    '@id': 'http://data.silknow.org/graph/mad',
    label: 'Musée des Arts Décoratifs',
    icon: '/images/graphs/http-data-silknow-org-mad.png',
  }, {
    '@id': 'http://data.silknow.org/graph/mfa',
    label: 'Boston Museum of Fine Arts',
    icon: '/images/graphs/http-data-silknow-org-mfa.png',
  }, {
    '@id': 'http://data.silknow.org/graph/risd',
    label: 'Rhode Island School of Design',
    icon: '/images/graphs/http-data-silknow-org-risd.png',
  }, {
    '@id': 'http://data.silknow.org/graph/cer',
    label: 'Red Digital de Colecciones de Museos de España',
    icon: '/images/graphs/http-data-silknow-org-cer.png',
  }, {
    '@id': 'http://data.silknow.org/graph/joconde',
    label: 'Joconde Database of French Museum Collections',
    icon: '/images/graphs/http-data-silknow-org-joconde.png',
  }, {
    '@id': 'http://data.silknow.org/graph/mtmad',
    label: 'Musée des Tissus',
    icon: '/images/graphs/http-data-silknow-org-mtmad.png',
  }, {
    '@id': 'http://data.silknow.org/graph/versailles',
    label: 'Versailles',
    icon: '/images/graphs/http-data-silknow-org-versailles.png',
  }, {
    '@id': 'http://data.silknow.org/graph/smithsonian',
    label: 'Smithsonian',
    icon: '/images/graphs/http-data-silknow-org-smithsonian.png',
  }, {
    '@id': 'http://data.silknow.org/graph/venezia',
    label: 'Musei di Venezia',
    icon: '/images/graphs/http-data-silknow-org-venezia.png',
  }, {
    '@id': 'http://data.silknow.org/graph/mobilier',
    label: 'Collection du Mobilier International',
    icon: '/images/graphs/http-data-silknow-org-mobilier.png',
  }, {
    '@id': 'http://data.silknow.org/graph/paris-musees',
    label: 'Paris Musées',
    icon: '/images/graphs/http-data-silknow-org-paris-musees.png',
  }, {
    '@id': 'http://data.silknow.org/graph/artic',
    label: 'Art Institute of Chicago',
    icon: '/images/graphs/http-data-silknow-org-artic.png',
  }, {
    '@id': 'http://data.silknow.org/graph/europeana',
    label: 'Europeana',
    icon: '/images/graphs/http-data-silknow-org-europeana.png',
  }, {
    '@id': 'http://data.silknow.org/graph/gallica',
    label: 'Gallica',
    icon: '/images/graphs/http-data-silknow-org-gallica.png',
  }],
  useWith: [
    {
      route: 'object',
      filter: 'graph',
    },
  ],
};
