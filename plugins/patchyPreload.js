import locale from '~/plugins/patchyDriver/locale'

function rsReject(res) {
  if (res) {
    switch (res.status) {
      case 502:
        return new Error('巴瓦鲁魔法服务器正在跃迁中 (Bad Gateway)')
      case 500:
        return new Error('巴瓦鲁魔法服务器哮喘犯了 (Internal Server Error)')
      case 503:
        return new Error('巴瓦鲁魔法服务器正在睡觉 (Service Unavailable)')
      case 403:
        return new Error('你被帕秋莉禁止进入巴瓦鲁魔法服务器 (Forbidden)')
      default:
        return new Error('巴瓦鲁魔法服务器被隙间了 (U.N.Known is this error?)')
      case 404:
        return new Error('')
    }
  }
}

function configFromRoute(route, i18n) {
  return {
    searchKeyWord: route.query.keyword || '',
    qtype: route.query.qtype || 'tag',
    order: route.query.coupon || 'latest',
    page: parseInt(route.query.page) || 1,
    page_size: parseInt(route.query.page_count || 20),
    hide_placeholder: route.query.showDeleted === 'true',
    visibleSites: route.query.visibleSites ? JSON.parse(atob(route.query.visibleSites)) : [''],
    locale: i18n.locale
  }
}

function listVideo($axios, config) {
  let sites = ''
  const index = config.visibleSites.indexOf('')
  if (index === -1) {
    // 用户选择了某几个网站
    for (let i = 0; i < config.visibleSites.length; ++i) {
      sites += 'site:' + config.visibleSites[i] + ' '
    }
    sites = 'ANY(' + sites + ')'
  }
  if (config.searchKeyWord) {
    const cfg = {
      query: config.searchKeyWord,
      qtype: config.qtype,
      page: config.page,
      page_size: config.page_size,
      order: config.order,
      hide_placeholder: config.hide_placeholder,
      additional_constraint: sites,
      lang: locale.getPcode(config.locale)
    }
    const axiosConfig = {
      method: 'post',
      url: '/be/queryvideo.do',
      data: cfg
    }
    return new Promise((resolve, reject) => {
      $axios(axiosConfig)
        .then((result) => {
          resolve(result.data)
        })
        .catch((e) => {
          const res = e.response
          reject(rsReject(res) || e)
        })
    })
  } else {
    const cfg = {
      page: config.page,
      page_size: config.page_size,
      order: config.order,
      hide_placeholder: config.hide_placeholder,
      additional_constraint: sites,
      lang: locale.getPcode(config.locale)
    }
    const axiosConfig = {
      method: 'post',
      url: '/be/listvideo.do',
      data: cfg
    }
    return new Promise((resolve, reject) => {
      $axios(axiosConfig)
        .then((result) => {
          // 返回结果前先设置缓存
          resolve(result.data)
        })
        .catch((e) => {
          const res = e.response
          reject(rsReject(res) || e)
        })
    })
  }
}

export default ({ app }, inject) => {
  inject('ppl', {
    listVideo,
    configFromRoute
  })
}
