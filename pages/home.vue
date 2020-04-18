<!--    vue页面：Home.vue     -->

<i18n>
    {
    "zh-Hans": {
    "page_count": "显示 {count} / {maxcount} 个视频",
    "no_result": "没有搜索到视频",
    "show_deleted": "显示已失效视频",
    "blacklist_prompt": "*已屏蔽含有敏感标签的视频，可在个人界面设置",
    "latest": "发布时间正序",
    "oldest": "发布时间倒序",
    "latest_video": "原视频上传时间正序",
    "oldest_video": "原视频上传时间倒序",
    "popular_tags": "热门标签",
    "search_result": "搜索结果 - {result}",
    "syntax_error": "查询语法错误！",
    "syntax_error_not": "所输入的查询不能与NOT连用！",
    "see_uploaders":"查看上传者"
    },
    "en-US": {
    "page_count": "Showing {count} / {maxcount} videos",
    "no_result": "No video found",
    "show_deleted": "Show deleted videos",
    "blacklist_prompt": "*Some videos are blacklisted, you can change your blacklist setting in your settings panel.",
    "latest": "Latest",
    "oldest": "Oldest",
    "latest_video": "Latest Video",
    "oldest_video": "Oldest Video",
    "popular_tags": "Popular Tags",
    "search_result": "Search - {result}",
    "syntax_error": "Syntax error in query",
    "syntax_error_not": "NOT cannot be used here",
    "see_uploaders":"See Uploaders"
    },
    "zh-Hant": {
    "page_count": "顯示 {count} / {maxcount} 個視頻",
    "no_result": "沒有搜索到視頻",
    "show_deleted": "顯示已失效視頻",
    "blacklist_prompt": "*已屏蔽含有敏感標簽的視頻，可在個人界面設置",
    "latest": "發布時間正序",
    "oldest": "發布時間倒序",
    "latest_video": "原視頻上傳時間正序",
    "oldest_video": "原視頻上傳時間倒序",
    "popular_tags": "熱門標簽",
    "search_result": "搜索結果 - {result}",
    "syntax_error": "查詢語法錯誤！",
    "syntax_error_not": "所輸入的查詢不能與NOT連用！",
    "see_uploaders":"查看上傳者"
    }
    }
</i18n>

<template>
  <div>
    <!-- 正文 -->
    <div class="container">
      <div class="row">
        <!-- 左栏（热门标签） -->
        <div class="col-xl-2 d-none d-xl-block">
          <left-bar :title="ifSearch ? '相关标签' : '热门标签'" :tags="tags" />
        </div>
        <!-- 视频区 -->
        <div class="col-xl-10">
          <!-- 播放列表抬头 -->
          <div class="row video-list-header">
            <!-- 数量显示 -->
            <div class="col-auto">
              <span v-if="loading">
                <b-spinner small></b-spinner
                ><vue-typed-js :strings="['少女祈祷中']" :type-speed="100" style="display:inline-block;"
                  ><span class="typing"></span
                ></vue-typed-js>
              </span>
              <span v-else>
                <span v-if="maxcount">{{ $t('page_count', { count: count2, maxcount: maxcount }) }}</span>
                <span v-else>{{ $t('no_result') }}</span>
              </span>
            </div>
            <!-- 设置按钮 -->
            <b-icon v-b-toggle.video-showing-settings-sidebar icon="gear"></b-icon>
            <b-sidebar id="video-showing-settings-sidebar" title="显示设定" shadow>
              <div class="p-3">
                <!-- 黑名单提示 -->
                <p>
                  <span class="blacklist-prompt">{{ $t('blacklist_prompt') }}</span>
                </p>
                <!-- 视频排列顺序 -->
                <h5>视频排列顺序</h5>
                <b-form-select v-model="couponSelected" :options="options" size="lg"></b-form-select>
                <!-- 站点选择 -->
                <h5>显示站点</h5>
                <div>
                  <span
                    :class="'badge ' + (visibleSites.includes('') ? 'badge-info' : 'badge-secondary')"
                    style="cursor:pointer;margin:0 5px"
                    @click="(e) => onSitesChange()"
                    >全部</span
                  >
                  <span
                    v-for="item in allSites"
                    :key="item.id"
                    :class="'badge ' + (visibleSites.includes(item.value) ? 'badge-info' : 'badge-secondary')"
                    style="cursor:pointer;margin:0 5px"
                    @click="(e) => onSitesChange(item.value)"
                    >{{ item.text }}</span
                  >
                </div>
                <!-- 是否显示已删除视频 -->
                <b-form-checkbox v-model="checked" class="show-deleted">{{ $t('show_deleted') }}</b-form-checkbox>
                <b-button variant="primary" block @click="getListVideo()">应用</b-button>
              </div>
            </b-sidebar>
          </div>
          <!-- 播放列表正文 -->
          <div class="video-list">
            <b-alert variant="danger" dismissible fade :show="showErrorAlert" @dismissed="showErrorAlert = false">
              {{ errorAlert }}
            </b-alert>
            <div v-for="item in listvideo" :key="item._id.$oid" class="list-item">
              <div class="row video-item">
                <!-- 封面图片 -->
                <div class="col-sm-4 col-lg-3">
                  <div class="video-thumbnail">
                    <nuxt-link
                      target="_blank"
                      :to="localePath({ path: '/video', query: { id: item._id.$oid } })"
                      tag="a"
                    >
                      <!-- <img :src="'/images/covers/' + item.item.cover_image" height="100%" /> -->
                      <bilibili-cover
                        v-if="item.item.site === 'bilibili'"
                        :aid="parseInt(item.item.unique_id.replace('bilibili:av', ''))"
                        :cover-image="item.item.cover_image"
                      ></bilibili-cover>
                      <b-aspect
                        v-else
                        aspect="8:5"
                        :style="
                          'background:url(/images/covers/' +
                            item.item.cover_image +
                            ') center center no-repeat;background-size:100% 100%'
                        "
                      ></b-aspect>
                    </nuxt-link>
                  </div>
                </div>
                <!-- 视频信息 -->
                <div class="col-sm-8 col-lg-9 video-detail">
                  <!-- 图标和标题 -->
                  <div class="title-div">
                    <img
                      :src="require('~/static/img/' + item.item.site + '.png')"
                      width="16px"
                      style="display:inline;"
                    />
                    <p class="title-p">
                      <nuxt-link
                        target="_blank"
                        :to="localePath({ path: '/video', query: { id: item._id.$oid } })"
                        tag="a"
                        >{{ item.item.title }}</nuxt-link
                      >
                    </p>
                  </div>
                  <!-- 简介 -->
                  <p
                    class="d-none d-md-block detail-p"
                    :title="toGMT(item.item.upload_time.$date) + '\n' + (item.item.desc || '此视频没有简介哦~')"
                  >
                    {{ item.item.desc || '此视频没有简介哦~' }}
                  </p>
                  <!-- 底部信息 -->
                  <div class="time-up">{{ toGMT(item.item.upload_time.$date) }}</div>
                </div>
                <div class="rating-box d-none d-lg-block">
                  <span class="rating" title="评分">{{
                    (item.total_rating / item.total_rating_user || 0).toFixed(1)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 分页器 -->
            <b-pagination
              v-model="page"
              limit="9"
              :total-rows="maxcount"
              :per-page="count"
              align="center"
            ></b-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import leftBar from '~/components/page/home/LeftBar.vue'
import bilibiliCover from '~/components/page/home/covers/bilibili.vue'

// import { copyToClipboardText } from '~/static/js/generic'
export default {
  layout: 'page',
  components: {
    leftBar,
    bilibiliCover
  },
  async asyncData(content) {
    const data = {}
    const config = content.app.$ppl.configFromRoute(content.route, content.app.i18n)
    // 设置转义
    data.ifSearch = !!config.searchKeyWord
    data.page = config.page
    data.count = config.page_size
    data.couponSelected = config.order
    data.checked = !config.hide_placeholder
    data.visibleSites = config.visibleSites
    // 请求数据
    try {
      const videoResult = await content.app.$ppl.listVideo(content.$axios, config)
      // 整理数据
      const trdVideoData = content.app.$pvideo.trVideoData(data, videoResult)
      for (const i in trdVideoData) {
        data[i] = trdVideoData[i]
      }
    } catch (e) {
      data.showErrorAlert = true
      data.errorAlert = e.message
    }
    data.loading = false
    return data
  },
  data() {
    // this.$i18n.locale = localStorage.getItem('lang')
    return {
      // 视频列表的排序规则
      options: [
        { value: 'latest', text: this.$t('latest') },
        { value: 'oldest', text: this.$t('oldest') },
        { value: 'video_latest', text: this.$t('latest_video') },
        { value: 'video_oldest', text: this.$t('oldest_video') }
      ],
      // 当前视频列表的排列顺序
      couponSelected: 'latest',
      // 当前页数
      page: 1,
      // 每一页的视频数量
      count: 20,
      // 视频列表是否属于加载状态的判断
      loading: true,
      // 是否渲染的是搜索的数据，默认 false 为主页数据
      ifSearch: false,
      // 判断是否执行查询,有时候页面会进行多次查询浪费资源
      // ifQuest: true,
      // 判断当前页数是不是被搜索事件改变的,即：当我跳转到其他页数，此时再搜索新的关键词，新的页数会被置为 1。
      // 这时会触发 page 监听的事件，重新请求搜索的数据，因为根据关键词的改变也会重新请求的数据，会造成资源浪费。
      pageMark: false,
      // 是否显示隐藏视频
      checked: false,
      visibleSites: [''],
      allSites: [
        { text: 'Bilibili', value: 'bili' },
        { text: 'Nicovideo', value: 'nico' },
        { text: 'YouTube', value: 'ytb' },
        { text: 'Twitter', value: 'twitter' },
        { text: 'Acfun', value: 'acfun' },
        { text: '站酷', value: 'zcool' },
        { text: 'IPFS', value: 'ipfs' },
        { text: 'weibo', value: 'weibo-mobile' }
      ],
      // 请求到的标签列表
      tags: [],
      // 请求到的视频列表（本页的视频列表）
      listvideo: [],
      // 搜索关键字
      searchKeyWord: '',
      // 视频的全部数量
      maxcount: 0,
      // 全部分页数
      maxpage: 1,
      // 每一页视频的真实数量
      count2: 0,
      // 错误提示框
      showErrorAlert: false,
      errorAlert: '',
      GMT: 99 // 99 的时候为当前时区
    }
  },
  computed: {},
  watch: {
    $route(newV, oldV) {
      this.getListVideo()
    }
  },
  created() {},
  mounted() {},
  updated() {},
  methods: {
    isLogin() {
      return !!this.$store.state.username
    },
    toGMT(timeStamp) {
      return this.$pdriver.utils.toGMT(timeStamp, this.GMT)
    },
    getListVideo() {
      // 先使页面处于加载状态
      this.loading = true
      this.maxcount = 0
      this.maxpage = 1
      this.count2 = 0
      this.tags = []
      this.listvideo = []
      this.ifSearch = !!this.$route.query.keyword
      this.$pvideo
        .listVideo({
          searchKeyWord: this.$route.query.keyword || '',
          qtype: this.$route.query.qtype || 'tag',
          page: this.page,
          page_size: this.count,
          order: this.couponSelected,
          hide_placeholder: !this.checked,
          visibleSites: this.visibleSites,
          locale: this.$i18n.locale
        })
        .then((result) => {
          // 整理数据
          const trdVideoData = this.$pvideo.trVideoData(this, result)
          for (const i in trdVideoData) {
            try {
              this[i] = trdVideoData[i]
            } catch (e) {}
          }

          // 加载结束，加载动画消失
          this.loading = false

          // 回到顶部
          if ($('html').scrollTop()) {
            // 动画效果
            $('html').animate({ scrollTop: 0 }, 100)
          }
        })
        .catch((e) => {
          this.errorAlert = '获取视频失败：' + e.message
          this.showErrorAlert = true
          this.loading = false
        })
    },
    onSitesChange(id = '') {
      if (id === '') {
        this.visibleSites = ['']
      } else if (this.visibleSites.includes(id)) {
        const index = this.visibleSites.indexOf(id)
        this.visibleSites.splice(index, 1)
      } else {
        this.visibleSites.push(id)
        const index = this.visibleSites.indexOf('')
        if (index > -1) {
          this.visibleSites.splice(index, 1)
        }
      }
      if (this.visibleSites.length === 0) {
        this.visibleSites = ['']
      }
    },
    showHover() {}
  }
}
</script>

<style lang="less">
.tab-class {
  width: 80% !important;
  margin-left: auto;
  margin-right: auto;
}
.main-page-background-img {
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
  margin-top: 20px;
}

.blacklist_prompt {
  font-size: 14px;
  color: #606266;
}
.changeLineIcon {
  position: absolute;
  font-size: 30px;
  top: 62px;
  right: 80px;
}

.tag-box {
  text-align: center;
  h4 > span {
    cursor: pointer;
  }
}

.content {
  background-color: #ffffffc9;
}

.page-selector {
  display: block;
  text-align: center;
}

.video-item {
  display: flex;
  padding-top: 2px;
  padding-bottom: 2px;
  &:hover {
    /*background-color: rgba(255,255,255,0.3);*/
    background-color: rgb(244, 244, 245);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  width: 100%;
  .video-thumbnail {
    border-radius: 4px;
    overflow: hidden;
    .Imgcover {
      vertical-align: middle;
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
  .video-detail {
    flex-grow: 1;
    position: relative;
    transition: all 0.3s ease;

    .title-div {
      overflow: hidden;
      text-overflow: ellipsis;
      @media (min-width: 768px) {
        white-space: nowrap;
      }
      @media (max-width: 768px) {
        line-height: 1.15rem;
        max-height: 2.3rem;
      }
      .title-p {
        display: inline;
      }
      img {
        vertical-align: middle;
      }
    }
    .detail-p {
      display: block;
      width: 90%;
      font-size: 1rem;
      line-height: 1.15rem;
      white-space: normal;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 3.45rem;
      margin-bottom: 5px;
      margin-top: 5px;
      letter-spacing: 0;
    }
    .time-up {
    }
    .linkToPublisher {
    }
  }
  .rating-box {
    position: relative;

    .rating {
      position: absolute;
      bottom: 0;
      right: 0;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      color: #f8d714;
      font-size: 25px;
      font-weight: bolder;
    }
  }
}

.video-detail > .link-div {
  position: absolute;
  bottom: 0px;
  left: 220px;
}

.list-item {
  padding-top: 5px;
  padding-bottom: 5px;
}

.fa-copy:hover {
  color: olive;
  cursor: pointer;
}

.video-list {
  min-height: 600px;
}

.video-list-header p {
  display: block;
}
.show_deleted {
  text-align: center;
  line-height: 50px;
}
.video-list-header select {
  height: 25px;
  font: 12px Arial;
  padding: 1px 3px 0 3px;
  vertical-align: middle;
  margin-bottom: 1px;
  float: right;
}
.video-list-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  vertical-align: middle;
  width: 100%;
  margin-bottom: 10px;
}

.el-select {
  width: 200px;
  float: right;
  right: 0px;
}
.left-navbar {
  position: relative;
  width: 15%;
  margin-right: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
:root {
  --view-height: 50px;
}
.w {
  text-align: left;
}
.main-page-background-img {
  background-repeat: no-repeat;
  min-height: 800px;
  width: 85%;
}

.blacklist_prompt {
  font-size: 14px;
  color: #606266;
}
.updatetime {
  margin-top: 5px;
  font-size: 12px;
  color: rgb(0, 0, 0);
}
.linkToPublisher {
  font-size: 14px;
}
</style>
