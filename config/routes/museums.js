module.exports = {
  view: 'list',
  showInNavbar: false,
  backgroundColor: '#16406c',
  textColor: '#ffffff',
  items: [{
    '@id': 'http://data.silknow.org/graph/met',
    label: 'Metropolitan Museum of Art',
    icon: '/images/graphs/http-data-silknow-org-met.png',
    url: 'https://www.metmuseum.org/',
  }, {
    '@id': 'http://data.silknow.org/graph/unipa',
    label: 'Sicily Cultural Heritage',
    icon: '/images/graphs/http-data-silknow-org-unipa.png',
    url: 'http://unipa.it/',
  }, {
    '@id': 'http://data.silknow.org/graph/imatex',
    label: 'CDMT Terrassa',
    icon: '/images/graphs/http-data-silknow-org-imatex.png',
    url: 'https://cdmt.cat/',
  }, {
    '@id': 'http://data.silknow.org/graph/vam',
    label: 'Victoria and Albert Museum',
    icon: '/images/graphs/http-data-silknow-org-vam.png',
    url: 'https://www.vam.ac.uk/',
  }, {
    '@id': 'http://data.silknow.org/graph/garin',
    label: 'Garín 1820',
    icon: '/images/graphs/http-data-silknow-org-garin.png',
    url: 'http://garin1820.com/',
  }, {
    '@id': 'http://data.silknow.org/graph/mad',
    label: 'Musée des Arts Décoratifs',
    icon: '/images/graphs/http-data-silknow-org-mad.png',
    url: 'https://madparis.fr/',
  }, {
    '@id': 'http://data.silknow.org/graph/mfa',
    label: 'Boston Museum of Fine Arts',
    icon: '/images/graphs/http-data-silknow-org-mfa.png',
    url: 'https://www.mfa.org/',
  }, {
    '@id': 'http://data.silknow.org/graph/risd',
    label: 'Rhode Island School of Design',
    icon: '/images/graphs/http-data-silknow-org-risd.png',
    url: 'https://www.risd.edu/',
  }, {
    '@id': 'http://data.silknow.org/graph/cer',
    label: 'Red Digital de Colecciones de Museos de España',
    icon: '/images/graphs/http-data-silknow-org-cer.png',
    url: 'http://ceres.mcu.es/',
  }, {
    '@id': 'http://data.silknow.org/graph/joconde',
    label: 'Joconde Database of French Museum Collections',
    icon: '/images/graphs/http-data-silknow-org-joconde.png',
    url: 'http://www2.culture.gouv.fr/documentation/joconde/fr/pres.htm',
  }, {
    '@id': 'http://data.silknow.org/graph/mtmad',
    label: 'Musée des Tissus',
    icon: '/images/graphs/http-data-silknow-org-mtmad.png',
    url: 'https://www.museedestissus.fr/',
  }, {
    '@id': 'http://data.silknow.org/graph/versailles',
    label: 'Versailles',
    icon: '/images/graphs/http-data-silknow-org-versailles.png',
    url: 'https://chateauversailles.fr/',
  }, {
    '@id': 'http://data.silknow.org/graph/smithsonian',
    label: 'Smithsonian',
    icon: '/images/graphs/http-data-silknow-org-smithsonian.png',
    url: 'https://www.si.edu/',
  }, {
    '@id': 'http://data.silknow.org/graph/venezia',
    label: 'Musei di Venezia',
    icon: '/images/graphs/http-data-silknow-org-venezia.png',
    url: 'http://www.archiviodellacomunicazione.it/',
  }, {
    '@id': 'http://data.silknow.org/graph/mobilier',
    label: 'Collection du Mobilier National',
    icon: '/images/graphs/http-data-silknow-org-mobilier.png',
    url: 'https://collection.mobiliernational.culture.gouv.fr/',
  }, {
    '@id': 'http://data.silknow.org/graph/paris-musees',
    label: 'Paris Musées',
    icon: '/images/graphs/http-data-silknow-org-paris-musees.png',
    url: 'http://www.parismusees.paris.fr/',
  }, {
    '@id': 'http://data.silknow.org/graph/artic',
    label: 'Art Institute of Chicago',
    icon: '/images/graphs/http-data-silknow-org-artic.png',
    url: 'https://www.artic.edu/',
  }, {
    '@id': 'http://data.silknow.org/graph/europeana',
    label: 'Europeana',
    icon: '/images/graphs/http-data-silknow-org-europeana.png',
    url: 'https://www.europeana.eu/',
  }, {
    '@id': 'http://data.silknow.org/graph/gallica',
    label: 'Gallica',
    icon: '/images/graphs/http-data-silknow-org-gallica.png',
    url: 'https://gallica.bnf.fr/',
  }, {
    '@id': 'http://data.silknow.org/graph/el-tesoro',
    label: 'Museo de Arte Sacro El Tesoro de la Concepción',
    icon: '/images/graphs/http-data-silknow-org-el-tesoro.png',
    url: 'https://www.facebook.com/tesoroconcepcionorotava',
  }],
  useWith: [
    {
      route: 'object',
      filter: 'graph',
    },
  ],
};
