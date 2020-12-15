const object = require('./config/routes/object');
const techniques = require('./config/routes/techniques');
const materials = require('./config/routes/materials');
const depictions = require('./config/routes/materials');

module.exports = {
  debug: typeof process !== 'undefined' && process.env.NODE_ENV === 'development',
  metadata: {
    title: 'ADASilk',
  },
  home: {
    hero: {
      showHeadline: true,
      // showLogo: true,
      image: '/images/silknow-hero.jpg',
    },
  },
  footer: {
    logo: [
      '/images/silknow-footer.png',
      '/images/virtual-loom-logo.png',
      '/images/stmaps-logo.png'
    ]
  },
  search: {
    route: 'object',
    allowTextSearch: true,
    textSearchQuery: {
      '@graph': [
        {
          '@id': '?id',
          '@type': '?rdfType',
          label: '?label',
          representation: {
            '@id': '?representation',
            image: '?representationUrl',
          },
        },
      ],
      $where: [
        '?id a ?rdfType',
        'VALUES ?rdfType { <http://erlangen-crm.org/current/E22_Man-Made_Object> }',
        '?id <http://www.w3.org/2000/01/rdf-schema#label> ?label',
        // Needed because silknow has 2 duplicate images (the source one and the one hosted on silknow.org cloud server)
        // We should only return the silknow.org one
        `OPTIONAL {
          SELECT ?id ?representation (SAMPLE(?representationUrl) AS ?representationUrl) WHERE {
            ?id <http://erlangen-crm.org/current/P138i_has_representation> ?representation .
            OPTIONAL {
              ?representation <http://schema.org/contentUrl> ?representationUrl .
              FILTER(STRSTARTS(STR(?representationUrl), "https://silknow.org/"))
            }
          }
        }`,
      ],
      $langTag: 'hide',
    },
    allowImageSearch: false,
    placeholderImage: '/images/silknow-placeholder.png',
    languages: {
      en: 'English',
      fr: 'Français',
    },
    graphFieldLabel: {
      en: 'Museum',
      fr: 'Musée',
    },
    defaultLanguage: 'en',
  },
  api: {
    endpoint: 'https://data.silknow.org/sparql',
  },
  routes: {
    object,
    techniques,
    materials,
    depictions
  },
  gallery: {
    options: {
      showArrows: true,
      showStatus: true,
      showIndicators: false,
      infiniteLoop: false,
      showThumbs: true,
      autoPlay: false,
      stopOnHover: true,
      swipeable: true,
      dynamicHeight: false,
      emulateTouch: true,
    },
  },
  graphs: {
    'http://data.silknow.org/graph/met': {
      label: 'Metropolitan Museum of Art',
      icon: '/images/graphs/http-data-silknow-org-met.png',
    },
    'http://data.silknow.org/graph/unipa': {
      label: 'Sicily Cultural Heritage',
      icon: '/images/graphs/http-data-silknow-org-unipa.png',
    },
    'http://data.silknow.org/graph/imatex': {
      label: 'CDMT Terrassa',
      icon: '/images/graphs/http-data-silknow-org-imatex.png',
    },
    'http://data.silknow.org/graph/vam': {
      label: 'Victoria and Albert Museum',
      icon: '/images/graphs/http-data-silknow-org-vam.png',
    },
    'http://data.silknow.org/graph/garin': {
      label: 'Garín 1820',
      icon: '/images/graphs/http-data-silknow-org-garin.png',
    },
    'http://data.silknow.org/graph/mad': {
      label: 'Musée des Arts Décoratifs',
      icon: '/images/graphs/http-data-silknow-org-mad.png',
    },
    'http://data.silknow.org/graph/mfa': {
      label: 'Boston Museum of Fine Arts',
      icon: '/images/graphs/http-data-silknow-org-mfa.png',
    },
    'http://data.silknow.org/graph/risd': {
      label: 'Rhode Island School of Design',
      icon: '/images/graphs/http-data-silknow-org-risd.png',
    },
    'http://data.silknow.org/graph/cer': {
      label: 'Red Digital de Colecciones de Museos de España',
      icon: '/images/graphs/http-data-silknow-org-cer.png',
    },
    'http://data.silknow.org/graph/joconde': {
      label: 'Joconde Database of French Museum Collections',
      icon: '/images/graphs/http-data-silknow-org-joconde.png',
    },
    'http://data.silknow.org/graph/mtmad': {
      label: 'Musée des Tissus',
      icon: '/images/graphs/http-data-silknow-org-mtmad.png',
    },
  },
  vocabularies: {
    technique: {
      query: {
        '@graph': [
          {
            '@id': '?technique',
            label: '?techniqueLabel',
          },
        ],
        $where: [
          `
          VALUES ?vocabulary {
            <http://data.silknow.org/vocabulary/827>
            <http://data.silknow.org/vocabulary/318>
          }
          ?vocabulary (skos:member|skos:narrower)* ?technique
          OPTIONAL {
            ?technique <http://www.w3.org/2004/02/skos/core#prefLabel> ?techniqueLabel .
            FILTER(LANG(?techniqueLabel) = "en")
          }
          `
        ],
        $langTag: 'hide',
      },
    },
    material: {
      query: {
        '@graph': [
          {
            '@id': '?material',
            label: '?materialLabel',
          },
        ],
        $where: [
          `
          VALUES ?vocabulary {
            <http://data.silknow.org/vocabulary/209>
            <http://data.silknow.org/vocabulary/268>
          }
          ?vocabulary (skos:member|skos:narrower)* ?material .
          OPTIONAL {
            ?material <http://www.w3.org/2004/02/skos/core#prefLabel> ?materialLabel .
            FILTER(LANG(?materialLabel) = "en")
          }
          `
        ],
        $langTag: 'hide',
      },
    },
    depiction: {
      query: {
        '@graph': [
          {
            '@id': '?depiction',
            label: '?depictionLabel',
          },
        ],
        $where: [
          `
          VALUES ?vocabulary {
            <http://data.silknow.org/vocabulary/742>
          }
          ?vocabulary (skos:member|skos:narrower)* ?depiction
          OPTIONAL {
            ?depiction <http://www.w3.org/2004/02/skos/core#prefLabel> ?depictionLabel .
            FILTER(LANG(?depictionLabel) = "en")
          }
          `,
        ],
        $langTag: 'hide',
      },
    },
    type: {
      query: {
        '@graph': [
          {
            '@id': '?digAsignedGroup',
            label: '?digAssignedGroupLabel',
          },
        ],
        $where: [
          '?dig ecrm:P129_is_about ?production',
          '?dig a crmdig:D1_Digital_Object',
          '?dig ecrm:P129_is_about/ecrm:P42_assigned ?digTypeAssigned',
          '?digAsignedGroup skos:member ?digTypeAssigned',
          '<http://data.silknow.org/vocabulary/facet/assignedtypes> skos:member ?digAsignedGroup',
          `OPTIONAL {
            ?digAsignedGroup <http://www.w3.org/2004/02/skos/core#prefLabel> ?digAssignedGroupLabel .
            FILTER(LANG(?digAssignedGroupLabel) = "en" || LANG(?digAssignedGroupLabel) = "")
          }`,
        ],
        $filter: ['lang(?digAssignedGroupLabel) = "en"'],
        $langTag: 'hide',
      },
    },
  },
  plugins: {
    virtualLoom: {
      url: 'https://ada.silknow.org/vloom/',
    },
    spatioTemporalMaps: {
      url: 'https://ada.silknow.org/spatio-temporal-maps/',
    },
    skosmos: {
      thesaurusUrl: 'https://skosmos.silknow.org/thesaurus/',
      baseUrl: 'https://skosmos.silknow.org/thesaurus/en/page/?uri=',
    },
    consent: {
      show: true
    }
  },
};
