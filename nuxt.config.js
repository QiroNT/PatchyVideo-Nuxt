import webpack from 'webpack'

const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://localhost' : 'https://thvideo.tv'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'PatchyVideo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // patchyDriver for basic functions
    '~/plugins/patchyDriver.js',
    // patchyVideo for Video related functions
    '~/plugins/patchyVideo.js',
    // patchyPreload for SSR specific functions
    '~/plugins/patchyPreload.js',
    // Typed.js
    '~/plugins/typed.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://fontawesome.com/how-to-use/on-the-web/referencing-icons/basic-use
    '@nuxtjs/fontawesome'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://bootstrap-vue.js.org/docs
    'bootstrap-vue/nuxt',
    // Doc: https://nuxt-community.github.io/nuxt-i18n
    [
      'nuxt-i18n',
      {
        vueI18nLoader: true,
        defaultLocale: 'zh-Hans',
        locales: ['zh-Hans', 'zh-Hant', 'ja', 'en-US']
      }
    ]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  proxy: {
    '/v/': {
      target: BASE_URL + '/v/',
      changeOrigin: true,
      pathRewrite: {
        '^/v/': ''
      }
    },
    '/be/': {
      target: BASE_URL + '/be/',
      changeOrigin: true,
      pathRewrite: {
        '^/be/': ''
      }
    },
    '/images/': {
      target: BASE_URL + '/images/',
      changeOrigin: true,
      pathRewrite: {
        '^/images/': ''
      }
    },
    '/autocomplete/ ': {
      target: BASE_URL + '/autocomplete/',
      changeOrigin: true,
      pathRewrite: {
        '^/autocomplete/': ''
      }
    },
    '/proxy/bili/x/player/videoshot': {
      target: 'https://api.bilibili.com/x/player/videoshot',
      changeOrigin: true,
      headers: {
        host: 'api.bilibili.com',
        origin: 'https://t.bilibili.com',
        referer: 'https://t.bilibili.com/'
      },
      pathRewrite: {
        '^/proxy/bili/x/player/videoshot': ''
      }
    },
    '/proxy/bili/cover/bfs/videoshot/': {
      target: 'http://i0.hdslb.com/bfs/videoshot/',
      changeOrigin: true,
      headers: {
        host: 'i0.hdslb.com',
        origin: 'https://t.bilibili.com',
        referer: 'https://t.bilibili.com/'
      },
      pathRewrite: {
        '^/proxy/bili/cover/bfs/videoshot/': ''
      }
    }
  },
  /**
   * Bootstrap-Vue configuration
   */
  bootstrapVue: {
    icons: true
  },
  /*
   ** Build configuration
   */
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ],
    extend(config, ctx) {}
  }
}
