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
      "tag_text": "标签",
      "text": "文本",
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
  <b-navbar toggleable="lg">
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
        <b-nav-item :href="localePath({ path: '/home' })">{{ $t('navbar.index') }}</b-nav-item>
        <b-nav-item :href="localePath({ path: '/lists' })">{{ $t('navbar.playlist') }}</b-nav-item>
        <b-nav-item :href="localePath({ path: '/postvideo' })">{{ $t('navbar.postvideo') }}</b-nav-item>
        <b-nav-item :href="localePath({ path: '/edittag' })">{{ $t('navbar.edittag') }}</b-nav-item>
        <b-nav-item :href="localePath({ path: '/logscontributes' })">历史和贡献</b-nav-item>
      </b-navbar-nav>
      <!-- 右侧导航栏 -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form @submit.stop.prevent="gotoHome">
          <b-input-group size="sm" class="top-search-bar">
            <b-input-group-prepend class="align-items-center ml-2 mr-2">
              <b-icon icon="search"></b-icon>
            </b-input-group-prepend>
            <b-form-input v-model="iptVal" placeholder="搜索视频" class="search-input"></b-form-input>
            <b-input-group-append>
              <b-form-select
                v-model="searchType"
                size="sm"
                :options="searchTypes"
                class="search-select"
              ></b-form-select>
            </b-input-group-append>
          </b-input-group>
        </b-nav-form>

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
          <b-nav-item :href="localePath({ path: '/login' })">{{ $t('user.login') }}</b-nav-item>
          <b-nav-item :href="localePath({ path: '/signup' })">{{ $t('user.signup') }}</b-nav-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown v-else right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <b-avatar variant="primary" size="28" :src="userAvatar"></b-avatar>
          </template>
          <b-dropdown-item :href="localePath({ path: 'user/me' })">{{ this.$store.state.username }}</b-dropdown-item>
          <b-dropdown-item>{{ $t('user.logout') }}</b-dropdown-item>
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
      // iptVal3: '',
      // 进行搜索的时候关键字的开头位置(起始位置)
      startlocation: 0,
      // 进行搜索的时候光标的位置(终止位置)
      endlocation: 0,
      // 退出登录时退出框处于加载状态的判断
      loading: false,
      // 类型
      searchTypes: [
        { value: 'tag', text: this.$t('search.tag_text') },
        { value: 'text', text: this.$t('search.text') }
      ],
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
    // 头像
    userAvatar() {
      if (this.$store.state.userAvatar === 'default') {
        return require('~/static/img/defaultAvatar.jpg')
      } else {
        return 'be/images/userphotos/' + this.$store.state.userAvatar
      }
    }
  },
  watch: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    // 登录跳转
    login() {
      this.$store.commit('changeifRouter', '0')
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
        this.$router.push(
          this.localePath({
            path: '/home',
            query: { keyword: this.iptVal, qtype: this.searchType }
          })
        )
      } else {
        // 对于在 home 页面时无参数搜索的兼容
        if (JSON.stringify(this.$route.query) === '{}') return
        this.$router.push(
          this.localePath({
            path: '/home'
          })
        )
      }
    },
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
    }
  }
}
</script>

<style scoped lang="less">
.patchyvideo-icon {
  height: 30px;
}
.top-search-bar {
  .search-input {
    padding: 0px;
    border: none;
  }
  .search-input:focus {
    border: none;
    box-shadow: none;
  }
  .search-select {
    padding: 0px;
    border: none;
  }
  .search-select:focus {
    border: none;
    box-shadow: none;
  }
}
@media (max-width: 979px) {
  .top-search-bar {
    border: 1px solid #e0e0e0;
    border-radius: 15px;
    .search-select {
      width: 60px;
      margin-right: 0.6rem;
    }
  }
}
@media (min-width: 979px) {
  .top-search-bar {
    border-width: 1px;
    border-style: solid;
    border-color: #ffffff;
    border-radius: 15px;
    animation-name: leave-border;
    animation-duration: 0.7s;
    .search-input {
      transition: all 0.7s;
      width: 0px;
      border: none;
    }
    .search-select {
      transition: all 0.7s;
      width: 0px;
      border: none;
      border-radius: 15px;
    }
  }
  .top-search-bar:hover,
  .top-search-bar:focus-within {
    border-color: #e0e0e0;
    animation-name: enter-border;
    animation-duration: 0.7s;
    .search-input {
      width: 120px;
    }
    .search-select {
      width: 60px;
    }
  }
}
@keyframes enter-border {
  0% {
    border-color: #ffffff;
  }
  25% {
    border-color: #e0e0e0;
  }
  100% {
    border-color: #e0e0e0;
  }
}
@keyframes leave-border {
  0% {
    border-color: #e0e0e0;
  }
  75% {
    border-color: #e0e0e0;
  }
  100% {
    border-color: #ffffff;
  }
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
