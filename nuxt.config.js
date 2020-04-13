import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

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
    // Driver for basic functions
    '~/plugins/patchyDriver.js',
    // Video for Video related functions
    '~/plugins/patchyVideo.js',
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
    '@nuxtjs/proxy',
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
      target: 'https://thvideo.tv/v/',
      changeOrigin: true,
      pathRewrite: {
        '^/v/': ''
      }
    },
    '/be/': {
      target: 'https://thvideo.tv/be/',
      changeOrigin: true,
      pathRewrite: {
        '^/be/': ''
      }
    },
    '/images/': {
      target: 'https://thvideo.tv/images/',
      changeOrigin: true,
      pathRewrite: {
        '^/images/': ''
      }
    },
    '/autocomplete/ ': {
      target: 'https://thvideo.tv/autocomplete/',
      changeOrigin: true,
      pathRewrite: {
        '^/autocomplete/': ''
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
    vendor: ['jquery'],
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerPort: 0,
        openAnalyzer: false
      }),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ],
    extend(config, ctx) {}
  }
}
