import Vue from 'vue'
import yiyan from '~/plugins/patchyDriver/yiyan'

const patchyDriver = {}
patchyDriver.install = function(Vue, options) {
  Vue.prototype.$pdriver = {
    toGMT(time, GMT) {
      const uploadTime = new Date(time)
      // 获得当前时区
      let currentGMT = 0 - uploadTime.getTimezoneOffset() / 60
      if (GMT >= -12 && GMT <= 14) {
        // 时区差
        const GMToffset = GMT - (0 - currentGMT)
        // 设置为对应时区的时间
        uploadTime.setTime(uploadTime.getTime() + 1000 * 3600 * GMToffset)
        currentGMT = GMT
      }
      const year = uploadTime.getFullYear() // getFullYear 方法以四位数字返回年份
      const month = uploadTime.getMonth() + 1 // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      const days = uploadTime.getDate() // getDate 方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      const hours = uploadTime.getHours() // getHours 方法返回 Date 对象的小时 (0 ~ 23)
      const minutes = uploadTime.getMinutes() // getMinutes 方法返回 Date 对象的分钟 (0 ~ 59)
      const seconds = uploadTime.getSeconds() // getSeconds 方法返回 Date 对象的秒数 (0 ~ 59)

      return `${year}-${(Array(2).join(0) + month).slice(-2)}-${(Array(2).join(0) + days).slice(-2)} ${(
        Array(2).join(0) + hours
      ).slice(-2)}:${(Array(2).join(0) + minutes).slice(-2)}:${(Array(2).join(0) + seconds).slice(-2)} (GMT${
        currentGMT >= 0 ? '+' : ''
      }${currentGMT})`
    },
    getYiyan(short) {
      let yy = yiyan
      if (short) {
        yy = yy.filter((v) => v.length <= 40)
      }
      const random = Math.floor(Math.random() * 100, 2) % yy.length
      return yy[random]
    },
    getYiyanArray(short) {
      let yy = yiyan
      if (short) {
        yy = yy.filter((v) => v.length <= 40)
      }
      for (let i = 1; i < yy.length; i++) {
        const random = Math.floor(Math.random() * (i + 1))
        const tmp = yy[random]
        yy[random] = yy[i]
        yy[i] = tmp
      }
      return yy
    }
  }
}

Vue.use(patchyDriver)
