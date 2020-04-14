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
    <!-- home 页面的正文 -->
    <b-tabs v-model="activeTab" card nav-class="tab-class">
      <!-- 主页 -->
      <b-tab :title="labelInfo[0]" active lazy>
        <!-- 正文 -->
        <div class="container">
          <div class="row">
            <!-- 左栏（热门标签） -->
            <div class="col-xl-3 d-none d-xl-block">
              <left-bar :title="videoListOptions.ifSearch ? '相关标签' : '热门标签'" :tags="videoListData.tags" />
            </div>
            <!-- 视频区 -->
            <div class="col-xl-9">
              <!-- 播放列表抬头 -->
              <div class="row video-list-header">
                <!-- 数量显示 -->
                <div class="col-auto">
                  <span v-if="videoListOptions.loading">
                    <b-spinner small></b-spinner
                    ><vue-typed-js :strings="['少女祈祷中']" :type-speed="100" style="display:inline-block;"
                      ><span class="typing"></span
                    ></vue-typed-js>
                  </span>
                  <span v-else>
                    <span v-if="videoListData.maxcount">{{
                      $t('page_count', { count: videoListData.count2, maxcount: videoListData.maxcount })
                    }}</span>
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
                    <b-form-select
                      v-model="videoListOptions.couponSelected"
                      :options="videoListOptions.options"
                      size="lg"
                    ></b-form-select>
                    <!-- 站点选择 -->
                    <h5>显示站点</h5>
                    <div>
                      <span
                        :class="
                          'badge ' + (videoListOptions.visibleSites.includes('') ? 'badge-info' : 'badge-secondary')
                        "
                        style="cursor:pointer;margin:0 5px"
                        @click="(e) => onSitesChange()"
                        >全部</span
                      >
                      <span
                        v-for="item in videoListOptions.allSites"
                        :key="item.id"
                        :class="
                          'badge ' +
                            (videoListOptions.visibleSites.includes(item.value) ? 'badge-info' : 'badge-secondary')
                        "
                        style="cursor:pointer;margin:0 5px"
                        @click="(e) => onSitesChange(item.value)"
                        >{{ item.text }}</span
                      >
                    </div>
                    <!-- 是否显示已删除视频 -->
                    <b-form-checkbox v-model="videoListOptions.checked" class="show-deleted">{{
                      $t('show_deleted')
                    }}</b-form-checkbox>
                    <b-button variant="primary" block @click="getListVideo()">应用</b-button>
                  </div>
                </b-sidebar>
              </div>
              <!-- 播放列表正文 -->
              <div class="video-list">
                <b-alert
                  variant="danger"
                  dismissible
                  fade
                  :show="videoListData.showErrorAlert"
                  @dismissed="videoListData.showErrorAlert = false"
                >
                  {{ videoListData.errorAlert }}
                </b-alert>
                <div v-for="item in videoListData.listvideo" :key="item._id.$oid" class="list-item">
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
                          <b-aspect
                            aspect="8:5"
                            class="Imgcover"
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
                    <div class="col video-detail">
                      <!-- 图标和标题 -->
                      <div class="title-div">
                        <img
                          :src="require('~/static/img/' + item.item.site + '.png')"
                          width="16px"
                          style="display:inline;"
                        />
                        <p>
                          <nuxt-link
                            target="_blank"
                            :to="localePath({ path: '/video', query: { id: item._id.$oid } })"
                            tag="a"
                            >{{ item.item.title }}</nuxt-link
                          >
                        </p>
                      </div>
                      <!-- 简介 -->
                      <p class="d-none d-md-block" :title="toGMT(item.item.upload_time.$date) + '\n' + item.item.desc">
                        {{ item.item.desc }}
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
                  v-model="videoListOptions.page"
                  limit="9"
                  :total-rows="videoListData.maxcount"
                  :per-page="videoListData.count"
                  align="center"
                ></b-pagination>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
      <!-- 订阅 -->
      <b-tab v-if="isLogin()" :title="labelInfo[1]" lazy>
        <subscribed v-if="activeName === 'second'"></subscribed>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import leftBar from '~/components/page/home/LeftBar.vue'

// import { copyToClipboardText } from '~/static/js/generic'
export default {
  layout: 'page',
  components: {
    leftBar
  },
  data() {
    // this.$i18n.locale = localStorage.getItem('lang')
    return {
      activeTab: 0,
      label: ['主页'],
      labelInfo: ['主页', '订阅'],
      videoListOptions: {
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
        ]
      },
      videoListData: {
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
        errorAlert: ''
      },
      GMT: 99 // 99 的时候为当前时区
    }
  },
  computed: {},
  watch: {
    $route(newV, oldV) {
      this.activeTab = 0
      this.getListVideo()
    }
  },
  created() {
    this.getListVideo()
  },
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
      this.videoListOptions.loading = true
      this.videoListOptions.ifSearch = !!this.$route.query.keyword
      this.$pvideo
        .listVideo({
          searchKeyWord: this.$route.query.keyword || '',
          qtype: this.$route.query.qtype || 'tag',
          page: this.videoListOptions.page,
          page_size: this.videoListOptions.count,
          order: this.videoListOptions.couponSelected,
          hide_placeholder: !this.videoListOptions.checked,
          visibleSites: this.videoListOptions.visibleSites,
          locale: this.$i18n.locale
        })
        .then((result) => {
          this.videoListData.maxcount = result.data.data.count
          // 取得总页数制作分页
          this.videoListData.maxpage = Math.ceil(result.data.data.count / this.videoListOptions.count)
          if (this.videoListData.maxpage < this.videoListOptions.page) {
            this.videoListOptions.page = 1
          }
          this.$store.commit('getMaxPage', this.videoListData.maxpage)
          this.videoListData.listvideo = result.data.data.videos
          /* 排序处理 */
          // 获得热门标签
          const tags = result.data.data.tags
          if (result.data.data.tag_pops) {
            const tagswithcount = result.data.data.tag_pops
            // 排序热门标签
            // let ntags = {}
            // tagswithcount = Object.keys(tagswithcount)
            //   .sort((a, b) => tagswithcount[b] - tagswithcount[a])
            //   .forEach((key) => {
            //     ntags[key] = tags[key]
            //   })
            const ntags = []
            for (const i in tags) {
              ntags.push({
                name: i,
                tagType: tags[i],
                tagCount: tagswithcount[i]
              })
            }
            this.videoListData.tags = ntags
          } else {
            const ntags = []
            for (const i in tags) {
              ntags.push({
                name: i,
                tagType: tags[i]
              })
            }
            this.videoListData.tags = ntags
          }
          /* 处理结束 */

          // this.tags = result.data.data.tags;
          this.videoListData.count2 = result.data.data.videos.length

          // 加载结束，加载动画消失
          this.videoListOptions.loading = false

          // 回到顶部
          if ($('html').scrollTop()) {
            // 动画效果
            $('html').animate({ scrollTop: 0 }, 100)
          }
        })
        .catch((e) => {
          this.videoListData.errorAlert = '获取视频失败：' + e.message
          this.videoListData.showErrorAlert = true
          this.videoListOptions.loading = false
        })
    },
    onSitesChange(id = '') {
      if (id === '') {
        this.videoListOptions.visibleSites = ['']
      } else if (this.videoListOptions.visibleSites.includes(id)) {
        const index = this.videoListOptions.visibleSites.indexOf(id)
        this.videoListOptions.visibleSites.splice(index, 1)
      } else {
        this.videoListOptions.visibleSites.push(id)
        const index = this.videoListOptions.visibleSites.indexOf('')
        if (index > -1) {
          this.videoListOptions.visibleSites.splice(index, 1)
        }
      }
      if (this.videoListOptions.visibleSites.length === 0) {
        this.videoListOptions.visibleSites = ['']
      }
    }
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      p {
        display: inline;
      }
      img {
        vertical-align: middle;
      }
    }
    p {
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
