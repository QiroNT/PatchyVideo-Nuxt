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
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/be/listvideo.do',
        data: cfg
      })
        .then((result) => {
          resolve(result.data)
        })
        .catch((e) => {
          const res = e.response
          reject(rsReject(res) || e)
        })
    })
  }
}

function trVideoData(data_, videoResult) {
  const data = data_
  // 总视频个数
  data.maxcount = videoResult.data.count
  // 总分页数
  data.maxpage = Math.ceil(videoResult.data.count / data.count)
  if (data.maxpage < data.page) {
    data.page = 1
  }
  // 视频列表
  data.listvideo = videoResult.data.videos
  // 视频数
  data.count2 = videoResult.data.videos.length
  // 标签 & 排序
  const tags = videoResult.data.tags
  if (videoResult.data.tag_pops) {
    const tagswithcount = videoResult.data.tag_pops
    const ntags = []
    for (const i in tags) {
      ntags.push({
        name: i,
        tagType: tags[i],
        tagCount: tagswithcount[i]
      })
    }
    data.tags = ntags
  } else {
    const ntags = []
    for (const i in tags) {
      ntags.push({
        name: i,
        tagType: tags[i]
      })
    }
    data.tags = ntags
  }
  return data
}

export default ({ app }, inject) => {
  inject('pvideo', {
    init() {},
    fetch() {},
    listVideo,
    trVideoData
  })
}
