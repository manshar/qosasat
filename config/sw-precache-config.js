module.exports = {
  staticFileGlobs: [
    'dist/**.js',
    'dist/**.css',
    'dist/assets/css/**.css',
    'dist/assets/icon/**.png',
    'dist/assets/img/**.png',
    'dist/**.json',
  ],
  navigateFallbackWhitelist: [/\/download\/?/],
  root: 'dist',
  runtimeCaching: [{
    urlPattern: /\/$/,
    handler: 'networkFirst',
  }, {
    urlPattern: /\/index\.html/,
    handler: 'networkFirst',
  }, {
    urlPattern: /\/assets\/css\/all-ar-fonts\.css/,
    handler: 'cacheFirst',
  }, {
    urlPattern: /https:\/\/fonts\.carbon\.tools\//,
    handler: 'cacheFirst',
  }, {
    urlPattern: /https:\/\/www\.fontstatic\.com\//,
    handler: 'cacheFirst',
  }, {
    urlPattern: /https:\/\/srcsrc\.carbon\.tools\//,
    handler: 'fastest',
    options: {
      cache: {
        maxEntries: 20,
        name: 'srcsrc-cache'
      }
    },
  }, {
    urlPattern: /https:\/\/cors-anywhere\.herokuapp\.com\//,
    handler: 'fastest',
    options: {
      cache: {
        maxEntries: 50,
        name: 'yorwa-cache'
      },
    },
  }, {
    urlPattern: /https:\/\/images\.unsplash\.com\//,
    handler: 'cacheFirst',
    options: {
      cache: {
        maxEntries: 100,
        name: 'images-cache',
      }
    },
  },],
};
