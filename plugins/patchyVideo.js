import Vue from 'vue'
import axios from 'axios'
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

function listVideo(config) {
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
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/be/queryvideo.do',
        data: cfg
      })
        .then((result) => {
          resolve(result)
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
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/be/listvideo.do',
        data: cfg
      })
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          const res = e.response
          reject(rsReject(res) || e)
        })
    })
  }
}

const patchyVideo = {}
patchyVideo.install = function(Vue, options) {
  Vue.prototype.$pvideo = {
    init() {},
    fetch() {},
    listVideo
  }
}

Vue.use(patchyVideo)
