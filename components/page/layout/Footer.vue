<!--    vue组件：Foot.vue     -->
<!--
    组件：网站最底端的声明
    大小：100% * 100px
    功能：网站的版权声明等
    必要传入参数：无
    更新日志：
    12/3/2019：v1.0 
      release
    12/10/2019：v1.0.1
      1.修改了注释内容  
    2/7/2020：v1.0.2
      1.显示内容更改为网站的代码提交地址的前八位
    4/1/2020: v1.1.0
      1.翻新了foot排版,将顶部导航栏的wiki,ipfs,bug反馈界面以及语言选择界面移动到了里面
-->
<i18n>
{
  "zh-Hans": {
    "LanguageSettings":"语言选项",
    "About":"关于帕琪站",
    "Wiki":"网站维基",
    "OfficialAccount":"B站官方账户",
    "JoinUs":"招募祈愿",
    "AboutIPFS":"IPFS相关",
    "IPFS":"幻想之物",
    "WhatIsIPFS":"IPFS是什么?",
    "Codes":"代码相关",
    "Repositories":"项目仓库",
    "bug_report":"反馈BUG"
  },
  "en-US": {
    "LanguageSettings":"Languages",
    "About":"About Patchyvideo",
    "Wiki":"Wiki",
    "OfficialAccount":"BiliBili Official Account",
    "JoinUs":"Join Us",
    "AboutIPFS":"About IPFS",
    "IPFS":"IPFS",
    "WhatIsIPFS":"What is IPFS?",
    "Codes":"Codes",
    "Repositories":"Repositories",
    "bug_report":"Report Bugs"
  },
  "zh-Hant": {
    "LanguageSettings":"語言選項",
    "About":"關於帕琪站",
    "Wiki":"網站維基",
    "OfficialAccount":"B站官方账户",
    "JoinUs":"招募祈願",
    "AboutIPFS":"關於IPFS",
    "IPFS":"幻想之物",
    "WhatIsIPFS":"什麼是IPFS?",
    "Codes":"代碼相關",
    "Repositories":"項目倉庫",
    "bug_report":"反饋BUG"
  }
}
</i18n>

<template>
  <div class="patchyvideo-footer">
    <div class="row">
      <!-- 插图 -->
      <div class="col-lg-2 col-md-3 d-none d-lg-block mx-auto">
        <img height="150px" src="~/static/img/footImg.png" />
      </div>
      <!-- 网站上方的链接 -->
      <div class="col-6 col-lg-2 col-md-3 col-sm-6 mx-auto patchyvideo-links">
        <p>
          <strong>{{ $t('About') }}</strong>
        </p>
        <a href="https://patchyvideo.wiki" target="_blank">{{ $t('Wiki') }}</a>
        <a href="https://space.bilibili.com/515657675" target="_blank">{{ $t('OfficialAccount') }}</a>
        <a href="https://patchyvideo.wiki/JoinUs" target="_blank">{{ $t('JoinUs') }}</a>
      </div>
      <div class="col-6 col-lg-2 col-md-3 col-sm-6 mx-auto patchyvideo-links">
        <p>
          <strong>{{ $t('AboutIPFS') }}</strong>
        </p>
        <nuxt-link to="/ipfs">{{ $t('IPFS') }}</nuxt-link>
        <a
          href="https://zh.wikipedia.org/wiki/%E6%98%9F%E9%99%85%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F"
          target="_blank"
          >{{ $t('WhatIsIPFS') }}</a
        >
      </div>
      <div class="col-6 col-lg-2 col-md-3 col-sm-6 mx-auto patchyvideo-links">
        <p>
          <strong>{{ $t('Codes') }}</strong>
        </p>
        <a href="https://patchyvideo.wiki/Repositories" target="_blank">{{ $t('Repositories') }}</a>
        <a href="https://github.com/zyddnys/PatchyVideo/issues" target="_blank">{{ $t('bug_report') }}</a>
      </div>
      <!-- 语言选项 -->
      <div class="col-6 col-lg-2 col-md-3 col-sm-6 mx-auto patchyvideo-languageSettings">
        <p>
          <strong>{{ $t('LanguageSettings') }}</strong>
        </p>
        <nuxt-link v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">{{
          locale.name
        }}</nuxt-link>
      </div>
    </div>
    <!-- 最下部的网站声明 -->
    <div class="patchyvideo-declear">
      <vue-typed-js
        :strings="this.$pdriver.utils.getYiyanArray()"
        :type-speed="75"
        :back-speed="15"
        :back-delay="5000"
        :shuffle="true"
        :loop="true"
        style="display:block;"
      >
        <span class="typing" style="color:gray;"></span>
      </vue-typed-js>
      <span
        >此版本的 PatchyVideo 为测试版，功能可能有些许差距，请谅解<span class="d-lg-none">
          | 获取最佳体验，请使用电脑访问</span
        ></span
      ><br />
      <span>
        © 2019-{{ new Date().getFullYear() }} PatchyVideo<span v-if="isDevMode()"> | DEV MODE ENABLED</span>
        <!-- © 2019-{{ new Date().getFullYear() }} PatchyVideo(Client:
        <a :href="'https://github.com/suwadaimyojin/patchyvideo-vue/commit/' + commitOfClient">{{ commitOfClient2 }}</a>
        ;Server:
        <a :href="'https://github.com/zyddnys/PatchyVideo/commit/' + commitOfServer">{{ commitOfServer2 }}</a>
        ) うちょうてんネットワーク -->
      </span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    // this.$i18n.locale = localStorage.getItem('lang')
    return {
      // github 上的前台 commit 地址
      commitOfClient: '',
      // github 上的后台 commit 地址
      commitOfServer: ''
      // 多语言支持
      // locale: localStorage.getItem('lang'),
      // 吾有一言，请诸位静听
      // yiyan: ''
    }
  },
  computed: {
    commitOfClient2() {
      return this.commitOfClient.slice(0, 8)
    },
    commitOfServer2() {
      return this.commitOfServer.slice(0, 8)
    },
    availableLocales() {
      return this.$pdriver.locale.availableLocales
    }
  },
  watch: {},
  created() {
    // this.yiyan = this.$pdriver.getYiyan(true)
    // this.getCommit()
  },
  mounted() {
    // setInterval(() => {
    //   this.yiyan = this.$pdriver.getYiyan(true)
    // }, 10 * 1000)
  },
  methods: {
    isDevMode() {
      return this.$pdriver.dev.isDevMode()
    },
    // 获取 github 上的 commit 地址
    getCommit() {
      // 获取前端地址
      this.$axios({
        method: 'get',
        url: '/v/fe/?' + new Date().getTime()
      }).then((result) => {
        this.commitOfClient = result.data
      })
      // 获取后端地址
      this.$axios({
        method: 'get',
        url: '/v/be/?' + new Date().getTime()
      }).then((result) => {
        this.commitOfServer = result.data
      })
    }
  }
}
</script>

<style scoped>
.patchyvideo-footer {
  position: relative;
  width: 100%;
  padding: 20px;
  padding-bottom: 3px;
  background-color: rgba(253, 204, 226, 0.267);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  text-align: center;
}
.patchyvideo-links {
  margin: 20px;
  display: flex;
  justify-content: center;
  font-size: 17px;
  flex-direction: column;
}
.patchyvideo-links a {
  line-height: 25px;
  color: #606266;
  text-decoration: none;
  transition: all 0.4s ease;
}
.patchyvideo-links a:hover {
  color: #409eff;
}
.patchyvideo-declear {
  color: #909399;
  /* text-align: left; */
  border-top-style: dotted;
  border-top-width: thin;
  border-top-color: #c0c4cc;
  font-size: 15px;
  line-height: 25px;
}
.footImg {
  position: absolute;
  left: 50px;
}
.patchyvideo-languageSettings {
  display: flex;
  flex-direction: column;
}
.patchyvideo-languageSettings a {
  line-height: 22px;
  color: #606266;
  text-decoration: none;
  transition: all 0.4s ease;
  cursor: pointer;
}
.patchyvideo-languageSettings a:hover {
  color: #409eff;
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-ms-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-o-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
