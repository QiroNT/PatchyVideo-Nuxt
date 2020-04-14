<!-- https://s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/js/index.141cf916.js 18:25510 -->

<template>
  <div
    ref="cdiv"
    @mouseenter="
      (e) => {
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
    <b-aspect v-if="hover" aspect="8:5" style="overflow:hidden">
      <div class="progress-bar"><span ref="pspan" :style="'width:' + progress + '%'"></span></div>
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
            (height - 11) +
            'px'
        "
      ></div>
    </b-aspect>
    <b-aspect
      v-else
      aspect="8:5"
      :style="'background:url(/images/covers/' + coverImage + ') center center no-repeat;background-size:100% 100%'"
    ></b-aspect>
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
      height: 0,
      hover: false,
      data: null
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
            }
            this.loadStatus = true
            this.$nextTick(function() {
              this.width = this.$refs.cdiv.clientWidth
              this.height = this.$refs.cdiv.clientHeight
            })
          })
          .catch((e) => {
            this.loadStatus = false
          })
      }
    }
  },
  methods: {
    onMouseOver(e) {
      this.hover = true
    },
    onMouseOut(e) {
      this.hover = false
    },
    onMouseMove(e) {
      if (this.loadStatus && this.data) {
        const i = Math.floor((e.offsetX / this.width) * this.data.index.length)
        const n = (this.data.img_y_size / this.data.img_x_size) * this.width
        this.progress = Math.floor((e.offsetX / this.width) * 100)
        this.x = (-i % this.data.img_x_len) * this.width
        this.y = -Math.floor(i / this.data.img_x_len) * n
      }
    }
  }
}
</script>

<style>
.bilibili-cover {
  left: 0;
}
.progress-bar {
  height: 13px;
  border-width: 5px 8px 6px 8px;
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
