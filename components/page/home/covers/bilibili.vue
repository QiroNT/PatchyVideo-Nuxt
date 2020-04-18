<!-- https://s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/js/index.141cf916.js 18:25510 -->

<template>
  <div
    ref="cdiv"
    @mouseenter="
      (e) => {
        width = $refs.cdiv.clientWidth
        hover = true
      }
    "
    @mouseleave="
      (e) => {
        hover = false
      }
    "
    @mousemove="onMouseMove"
  >
    <b-aspect v-if="hover && loadStatus && !error" aspect="16:9" style="overflow:hidden">
      <div class="progress-bar" :style="'height:' + prh + 'px;border-width: ' + Math.floor((prh - 2) / 2) + 'px 8px;'">
        <span ref="pspan" :style="'width:' + progress + '%'"></span>
      </div>
      <div
        v-if="loadStatus"
        class="bilibili-cover"
        :style="
          'background:url(/proxy/bili/cover/bfs/videoshot/' +
            data.image[0].replace('//i0.hdslb.com/bfs/videoshot/', '') +
            ');background-position: ' +
            x +
            'px ' +
            y +
            'px;background-size:' +
            data.img_x_len * width +
            'px;width:' +
            width +
            'px;height:' +
            (width / 16) * 9 +
            'px'
        "
      ></div>
    </b-aspect>
    <div v-else-if="hover && !loadStatus">
      <b-overlay :show="true" rounded="sm">
        <b-aspect
          aspect="8:5"
          :style="'background:url(/images/covers/' + coverImage + ') center center no-repeat;background-size:100% 100%'"
        ></b-aspect>
      </b-overlay>
    </div>
    <b-overlay v-else :show="hover && !!error" style="overflow:hidden">
      <template v-slot:overlay
        ><div class="text-center">{{ error || '未知错误' }}</div></template
      >
      <b-aspect
        aspect="8:5"
        :style="'background:url(/images/covers/' + coverImage + ') center center no-repeat;background-size:100% 100%'"
      ></b-aspect>
    </b-overlay>
  </div>
</template>

<script>
export default {
  props: {
    aid: {
      type: Number,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgLink: '',
      progress: 0,
      loadStatus: false,
      pic: '',
      x: 0,
      y: 0,
      size: 0,
      width: 0,
      hover: false,
      data: null,
      error: null,
      prefresh: null
    }
  },
  computed: {
    prh() {
      return (this.width / 8) * 5 - (this.width / 16) * 9
    }
  },
  watch: {
    hover() {
      if (this.hover && !this.data) {
        this.$axios({
          method: 'get',
          url: `/proxy/bili/x/player/videoshot?aid=${this.aid}&index=1`
        })
          .then((result) => {
            if (result.data.code === 0 && result.data.data) {
              this.data = result.data.data
              if (this.prefresh && this.hover) {
                this.fresh(this.prefresh)
                this.prefresh = null
              }
            } else {
              this.error = result.data.message
            }
            this.loadStatus = true
          })
          .catch((e) => {
            this.error = e.message
            this.loadStatus = true
          })
      }
    }
  },
  methods: {
    onMouseMove(e) {
      if (this.loadStatus && this.data) {
        this.fresh(e)
      } else {
        this.prefresh = e
      }
    },
    fresh(e) {
      const i = Math.floor((e.offsetX / this.width) * this.data.index.length)
      const n = (this.data.img_y_size / this.data.img_x_size) * this.width
      this.progress = Math.floor((e.offsetX / this.width) * 100)
      this.x = (-i % this.data.img_x_len) * this.width
      this.y = -Math.floor(i / this.data.img_x_len) * n
    }
  }
}
</script>

<style>
.bilibili-cover {
  left: 0;
}
.progress-bar {
  border-style: solid;
  border-color: #000;
  background: #444;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.progress-bar > span {
  display: block;
  background: #fff;
  height: 2px;
}
</style>
