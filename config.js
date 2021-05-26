const object = require('./config/routes/object');
const techniques = require('./config/routes/techniques');
const materials = require('./config/routes/materials');
const depictions = require('./config/routes/depictions');
const museums = require('./config/routes/museums');
const time = require('./config/routes/time');
const places = require('./config/routes/places');
const collections = require('./config/routes/collections');

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
        'VALUES ?rdfType { ecrm:E22_Man-Made_Object }',
        '?id rdfs:label ?label',
        // Needed because silknow has 2 duplicate images (the source one and the one hosted on silknow.org cloud server)
        // We should only return the silknow.org one
        `OPTIONAL {
          SELECT ?id ?representation (SAMPLE(?representationUrl) AS ?representationUrl) WHERE {
            ?id ecrm:P138i_has_representation ?representation .
            OPTIONAL {
              ?representation schema:contentUrl ?representationUrl .
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
      es: 'Español',
      fr: 'Français',
      it: 'Italiano',
    },
    graphFieldLabel: {
      en: 'Museum',
      fr: 'Musée',
      es: 'Museo',
      it: 'Museo',
    },
    defaultLanguage: 'en',
  },
  api: {
    endpoint: process.env.API_ENDPOINT || 'https://data.silknow.org/sparql',
    prefixes: {
      'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
      'schema': 'http://schema.org/',
      'ecrm': 'http://erlangen-crm.org/current/',
      'crmdig': 'http://www.ics.forth.gr/isl/CRMext/CRMdig.rdfs/',
      'dc': 'http://purl.org/dc/elements/1.1/',
      'geo': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
      'geonames': 'http://www.geonames.org/ontology#',
      'skos': 'http://www.w3.org/2004/02/skos/core#',
      'silk': 'http://data.silknow.org/ontology/property/',
    }
  },
  routes: {
    object,
    techniques,
    materials,
    depictions,
    museums,
    places,
    time,
    collections,
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
  graphs: museums.items.reduce((acc, cur) => {
    acc[cur['@id']] = { label: cur.label, icon: cur.icon };
    return acc;
  }, {}),
  vocabularies: {
    technique: {
      query: ({ language }) => ({
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
            ?technique skos:prefLabel ?techniqueLabel .
            FILTER(LANG(?techniqueLabel) = "${language}")
          }
          `
        ],
        $langTag: 'hide',
      }),
    },
    material: {
      query: ({ language }) => ({
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
            ?material skos:prefLabel ?materialLabel .
            FILTER(LANG(?materialLabel) = "${language}")
          }
          `
        ],
        $langTag: 'hide',
      }),
    },
    depiction: {
      query: ({ language }) => ({
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
            ?depiction skos:prefLabel ?depictionLabel .
            FILTER(LANG(?depictionLabel) = "${language}")
          }
          `,
        ],
        $langTag: 'hide',
      }),
    },
    type: {
      query: ({ language }) => ({
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
            ?digAsignedGroup skos:prefLabel ?digAssignedGroupLabel .
            FILTER(LANG(?digAssignedGroupLabel) = "${language}" || LANG(?digAssignedGroupLabel) = "")
          }`,
        ],
        $filter: ['lang(?digAssignedGroupLabel) = "${language}"'],
        $langTag: 'hide',
      }),
    },
    collection: {
      query: {
        '@graph': [
          {
            '@id': '?collection',
            label: '?collectionLabel',
          },
        ],
        $where: [
          '?collection a ecrm:E78_Collection',
          '?collection rdfs:label ?collectionLabel',
        ],
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
  analytics: {
    id: 'G-V38ZZ1WE9V'
  }
};
