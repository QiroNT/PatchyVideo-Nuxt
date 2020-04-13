<!--    vue组件：TopNavbar.vue     -->
<!--
    组件：页面顶部的导航栏
    大小：100% * 80px
    功能：网站主导航栏
    必要传入参数：无
    更新日志：
-->

<i18n>
{
  "zh-Hans": {
    "navbar": {
      "index": "首页",
      "playlist": "播放列表",
      "postvideo": "发布视频",
      "edittag": "标签"
    },

    "search": {
      "tag_text": "标签/文本",
      "text": "仅文本",
      "prompt": "请输入标签",
      "button": "搜索"
    },
    "user": {
      "signup": "注册",
      "login": "登录",
      "message": "消息",
      "logout": "退出",
      "logout_prompt": "你确定要退出登陆吗?",
      "login_expire_prompt": "登录已过期，请新登录！"
    },
    "prompt": {
      "msg": "提示",
      "ok": "确 定",
      "cancel": "取 消"
    }
  },
  "en-US": {
    "navbar": {
      "index": "Home",
      "playlist": "Playlists",
      "postvideo": "Post Video",
      "edittag": "Tags"
    },

    "search": {
      "tag_text": "Tag/Text",
      "text": "Text Only",
      "prompt": "Search...",
      "button": "Search"
    },
    "user": {
      "signup": "Sign up",
      "login": "Log in",
      "message": "Messages",
      "logout": "Log out",
      "logout_prompt": "Are you sure you want to log out?",
      "login_expire_prompt": "Your session has expired. Please relogin"
    },
    "prompt": {
      "msg": "Are you sure?",
      "ok": "OK",
      "cancel": "Cancel"
    }
  },
  "zh-Hant": {
    "navbar": {
      "index": "首頁",
      "playlist": "播放列表",
      "postvideo": "發布視頻",
      "edittag": "標簽"
    },

    "search": {
      "tag_text": "標簽/文本",
      "text": "僅文本",
      "prompt": "請輸入標簽",
      "button": "搜索"
    },
    "user": {
      "signup": "註冊",
      "login": "登錄",
      "message": "消息",
      "logout": "退出",
      "logout_prompt": "妳確定要退出登陸嗎?",
      "login_expire_prompt": "登錄已過期，請新登錄！"
    },
    "prompt": {
      "msg": "提示",
      "ok": "確 定",
      "cancel": "取 消"
    }
  }
}
</i18n>

<template>
  <b-navbar toggleable="md">
    <!-- 退出登录的弹出框 -->
    <!-- <el-dialog :title="$t('prompt.msg')" :modal-append-to-body="false" :visible.sync="dialogVisible" width="30%">
      <p>{{ $t('user.logout_prompt') }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('prompt.cancel') }}</el-button>
        <el-button type="primary" @click="cleanLocalStorage">{{ $t('prompt.ok') }}</el-button>
      </span>
    </el-dialog> -->
    <!-- 网站icon &标题 -->
    <b-navbar-brand href="/">
      <img class="patchyvideo-icon" src="~/static/img/patchyvideo.svg" /><strong>PatchyVideo</strong></b-navbar-brand
    >

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- 左侧导航栏 -->
      <b-navbar-nav>
        <b-nav-item href="/home" @click="cleanIptV">{{ $t('navbar.index') }}</b-nav-item>
        <b-nav-item href="/lists">{{ $t('navbar.playlist') }}</b-nav-item>
        <b-nav-item href="/postvideo">{{ $t('navbar.postvideo') }}</b-nav-item>
        <b-nav-item href="/edittag">{{ $t('navbar.edittag') }}</b-nav-item>
        <b-nav-item href="/logscontributes">历史和贡献</b-nav-item>
      </b-navbar-nav>
      <!-- 右侧导航栏 -->
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form> -->

        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->
        <b-nav-item-dropdown v-if="!isLogin" right>
          <template v-slot:button-content>
            <b-avatar variant="primary" size="28" src="~/static/img/defaultAvatar.jpg"></b-avatar>
          </template>
          <b-nav-item href="/login" @click="login">{{ $t('user.login') }}</b-nav-item>
          <b-nav-item href="/signup">{{ $t('user.signup') }}</b-nav-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-else right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <b-avatar variant="primary" size="28" :src="userAvatar"></b-avatar>
          </template>
          <b-dropdown-item href="/user/me">{{ this.$store.state.username }}</b-dropdown-item>
          <b-dropdown-item @click="dialogVisible = true">{{ $t('user.logout') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  // inject: ['reload'],
  data() {
    // this.$i18n.locale = localStorage.getItem('lang')
    return {
      // 控制退出登录的弹出框
      dialogVisible: false,
      // 判断是否登录
      isLogin: false,
      // 搜索框的搜索类型(标签+文本或仅文本)
      searchType: 'tag',
      // 搜索框的内容，不知道为什么在自动补全之后会被清空
      iptVal: '',
      // 搜索框的内容，在自动补全的时候作为备份使用，防止搜索框内容被清空
      // ps：iptVal2在计算属性里，所以请勿随便更改变量名
      iptVal3: '',
      // 进行搜索的时候关键字的开头位置(起始位置)
      startlocation: 0,
      // 进行搜索的时候光标的位置(终止位置)
      endlocation: 0,
      // 退出登录时退出框处于加载状态的判断
      loading: false,
      // 网站推荐栏以及关键字推荐栏
      sites: [
        { tag: 'site:acfun', cat: 6, cnt: null },
        { tag: 'site:bilibili', cat: 6, cnt: null },
        { tag: 'site:nicovideo', cat: 6, cnt: null },
        { tag: 'site:twitter', cat: 6, cnt: null },
        { tag: 'site:youtube', cat: 6, cnt: null },
        { tag: 'site:zcool', cat: 6, cnt: null },
        { tag: 'site:ipfs', cat: 6, cnt: null },
        { tag: 'AND', cat: 6, cnt: null },
        { tag: 'OR', cat: 6, cnt: null },
        { tag: 'NOT', cat: 6, cnt: null },
        { tag: 'date:', cat: 6, cnt: null },
        { tag: 'tags:', cat: 6, cnt: null }
      ],
      infoTipMark: false,
      // 未读信息的数量
      messagesNum: 0,
      // 控制读取未读信息方法的变量
      queryMessages: ''
    }
  },
  computed: {
    // 搜索的关键字
    iptVal2() {
      return this.$store.state.TopNavbarSearching
    },
    // 搜索的关键字
    userAvatar() {
      if (this.$store.state.userAvatar === 'default') {
        return require('~/static/img/defaultAvatar.jpg')
      } else {
        return 'be/images/userphotos/' + this.$store.state.userAvatar
      }
    }
  },
  watch: {
    iptVal2() {
      this.iptVal = this.iptVal2
    }
  },
  created() {},
  mounted() {
    // 查看是否在别的设备上登录过
    if (this.$store.state.ifTruelyLogin === 0) {
      this.checkUser()
    }
    // this.getCookie()
    // 查看是否登录
    if (JSON.stringify(this.$store.state.username) !== 'null' && this.$store.state.username !== '') {
      this.isLogin = true
      if (this.$route.path !== '/messages') this.getUnreadCount()
      // 每2min查询一次未读消息
      // 注意,这里的this.getUnreadCount不能加括号!
      this.queryMessages = setInterval(this.getUnreadCount, 120000)
    }
    this.iptVal = this.iptVal2
  },
  updated() {},
  methods: {
    // 测试用户的登录状态
    checkUser() {
      this.$axios({
        method: 'post',
        url: 'be/user/whoami',
        data: {}
      }).then((result) => {
        if (result.data.data === 'UNAUTHORISED_OPERATION' && this.getCookie()) {
          this.$axios({
            method: 'post',
            url: '/be/logout.do',
            data: {}
          }).then((result) => {
            this.open(this.$t('user.login_expire_prompt'))
            this.isLogin = false
            // 清除所有session值(退出登录)
            sessionStorage.clear()
            // 清除用户名
            this.$store.commit('clearUserName')
            // 清除本地数据
            localStorage.setItem('username', '')
            // 清除cookie
            this.clearCookie()
            // 改变用户登录状态
            this.$store.commit('changeifTruelyLogin', '2')
          })
        } else {
          this.$store.commit('changeifTruelyLogin', '1')
        }
      })
    },
    // 登录跳转
    login() {
      this.$store.commit('changeifRouter', '0')
    },
    // 退出时清除所有数据
    cleanLocalStorage() {
      this.loading = true
      this.$axios({
        method: 'post',
        url: '/be/logout.do',
        data: {}
      }).then((result) => {
        this.isLogin = false
        // 清除所有 session 值(退出登录)
        sessionStorage.clear()
        // 清除用户名
        this.$store.commit('clearUserName')
        // 清除本地数据
        localStorage.setItem('username', '')
        // 清除 cookie
        this.clearCookie()
        // 刷新界面
        location.reload()
        this.loading = false
        this.dialogVisible = false
      })
    },
    // 跳转至个人界面
    gotoUserPage() {
      this.$router.push({ path: '/users/me' })
    },
    // 点击搜索按钮使 home 页面显示搜索结果
    gotoHome() {
      // 如果回车搜索之前有选中建议框的数据，则取消这次搜索
      if (this.infoTipMark === true) {
        this.infoTipMark = false
        return
      }
      if (this.iptVal !== '') {
        this.$router
          .push({
            path: '/home',
            query: { keyword: this.iptVal, qtype: this.searchType }
          })
          .catch((err) => {
            return err
          })
      } else {
        // 对于在 home 页面时无参数搜索的兼容
        if (JSON.stringify(this.$route.query) === '{}') return
        this.$router.push({ path: '/home' })
      }
    },
    // 清除搜索结果
    cleanIptV() {
      this.$store.commit('getTopNavbarSearching', '')
      // this.reload();
    },
    // 清除 cookie
    // clearCookie() {
    //   this.setCookie('', -1)
    //   this.setCookie('session', -1)
    //   this.setCookie('userAvatar', -1)
    // },
    // // 设置 cookie
    // // 储存变量为 username
    // setCookie(username, days) {
    //   const date = new Date() // 获取时间
    //   date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days) // 保存的天数
    //   // 字符串拼接 cookie
    //   window.document.cookie = 'username' + ':' + username + ';path=/;expires=' + date.toGMTString()
    //   window.document.cookie = 'userAvatar' + '=' + username + ';path=/;expires=' + date.toGMTString()
    // },
    // 获取 cookie
    // getCookie() {
    //   if (document.cookie.length > 0) {
    //     const arr = document.cookie.split('; ')
    //     for (let i = 0; i < arr.length; i++) {
    //       const arr3 = arr[i].split('=')
    //       // 判断查找相对应的值
    //       if (arr3[0] === 'userAvatar') {
    //         this.$store.commit('getUserAvatar', arr3[1])
    //       }
    //       const arr2 = arr[i].split(':')
    //       // 判断查找相对应的值
    //       if (arr2[0] === 'username') {
    //         if (arr2[1] !== '') {
    //           this.isLogin = true
    //           this.$store.commit('getUserName', arr2[1])
    //         }
    //       }
    //     }
    //     return true
    //   }
    //   this.$store.commit('getUserName', '')
    //   return false
    // },
    // 获取未读通知数量
    getUnreadCount() {
      this.$axios({
        method: 'post',
        url: 'be/notes/list_unread.do',
        data: {}
      })
        .then((result) => {
          this.messagesNum = result.data.data.notes.length
        })
        .catch((_error) => {
          // console.log(error)
        })
    },
    // 搜索输入框内的搜索文字是否包含网站内容
    createFilter(query) {
      return (sites) => {
        return sites.tag.toLowerCase().indexOf(query.toLowerCase()) === 0
      }
    },
    // 搜索输入框内的搜索文字，返回搜索关键字所在的起始位置
    match(text) {
      let i = text.length
      while (i--) {
        if (
          text.charAt(i) === ' ' ||
          text.charAt(i) === '\t' ||
          text.charAt(i) === '\n' ||
          text.charAt(i) === '\v' ||
          text.charAt(i) === '\f' ||
          text.charAt(i) === '\r' ||
          // 把括号转化成ascII码判断,否则谜之报错
          text.charAt(i).charCodeAt() === 41
        ) {
          return i + 1
        } else if (text.charAt(i).charCodeAt() === 40) {
          if (i > 0 && text.charAt(i - 1) === '_') {
            continue
          } else {
            return i + 1
          }
        }
      }
      return 0
    },
    // 判断字符串是否全为空格
    isNull(str) {
      if (str === '') return true
      const re = /^[ ]+$/
      return re.test(str)
    },
    ConvertLangRes(langs, hastran = true) {
      if (!langs) return
      const LangList = [
        { id: 1, lang: 'zh-Hans' },
        { id: 2, lang: 'zh-Hant' },
        { id: 5, lang: 'en-US' },
        { id: 10, lang: 'ja' }
      ]
      const level = [10, 5, 1, 2]
      let Lang = ''
      let mainLang = ''
      let subLang = ''
      // 经过一系列计算得出主副语言

      // 匹配当前语言的 ID
      let CurrLangID = LangList.find((x) => {
        return x.lang === this.$i18n.locale
      })
      CurrLangID = CurrLangID ? CurrLangID.id : 1

      // 匹配对应 ID 的内容
      let CurrLangWord = langs.find((x) => {
        return x.l === CurrLangID
      })
      if (!CurrLangWord) {
        for (let i = 0; i < level.length; i++) {
          CurrLangWord = langs.find((x) => {
            return x.l === level[i]
          })
          if (CurrLangWord) break
        }
      }
      mainLang = CurrLangWord.w

      if (hastran) {
        // 副语言匹配
        // 优先级：日语，英语，简体中文，繁体中文
        let SubLangWord = null
        for (let i = 0; i < level.length; i++) {
          if (level[i] === CurrLangWord.l) continue
          SubLangWord = langs.find((x) => {
            return x.l === level[i]
          })
          if (SubLangWord) break
        }
        subLang = SubLangWord ? SubLangWord.w : mainLang

        // 合成语言
        Lang = `${mainLang.replace(/_/g, ' ')}`
        Lang += `<span style='font-size:8px;color: gray;display: block;'>${subLang.replace(/_/g, ' ')}</span>`
      } else {
        Lang = mainLang
      }
      return Lang
    },
    open(message) {
      this.$message({
        message,
        type: 'error'
      })
    },
    handleSelect2(item) {
      // 切割字符串，并在中间加入搜索到的标签拼接成新的输入框的内容
      const iptVal1 = this.iptVal3.slice(0, this.startlocation)
      const iptVal2 = this.iptVal3.slice(this.endlocation)
      const iptVal = iptVal1 + (item.tag || this.ConvertLangRes(item.langs, false)) + ' ' + iptVal2
      this.iptVal = iptVal
      // 光标设置焦点事件
      $('#ipt').focus()
      this.infoTipMark = true
    }
  }
}
</script>

<style scoped lang="less">
.top-navbar {
  padding: 5px 5%;
  // width: 90%;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.iconAndTitle {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.patchyvideo-icon {
  height: 30px;
}
.patchyvideo-title {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.nav_left {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-around;
}
.navItem {
  margin: 10px;
  font-size: 18px;
}
.navItem a {
  color: rgb(46, 46, 46);
}
.navItem a:hover {
  color: rgb(255, 166, 251);
}

.search-bar-query .el-select {
  width: 110px;
}

.loginUser {
  width: 50%;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.userHome {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.loginUser-userAvatar {
  margin: 5px;
}
.loginUser-login {
  margin: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 20px;
}
.loginUser-message {
  margin: 5px;
  white-space: nowrap;
  font-size: 20px;
}
.loginUser-signup {
  margin: 5px;
  white-space: nowrap;
  font-size: 20px;
}

.adviceList {
  /* 针对webkit内核（如Safari）进行的调整 */
  display: -webkit-flex;
  display: flex;
}
.highlighted .addr {
  color: #ddd;
}
.name {
  flex: 0 0 80%;
  font-size: 14px;
  line-height: 150%;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
  text-align: left;
}
.addr {
  flex: 0 0 20%;
  line-height: 150%;
  font-size: 12px;
  color: #b4b4b4;
  text-align: right;
}
/* 针对tag类别调整颜色 */
.Copyright {
  color: #a0a;
}
.Language {
  color: #585455;
}
.Character {
  color: #0a0;
}
.Author {
  color: #a00;
}
.General {
  color: #0073ff;
}
.Meta {
  color: #f80;
}
.Soundtrack {
  color: #ff7792;
}
</style>
