<template>
  <div>
    <h1>{{ title }}</h1>
    <ul class="tag-ul">
      <li v-for="(val, key) in tags" :key="key" class="tag">
        <div :id="'lb-tag-item-' + key" class="tag belong-to-home">
          <div class="tag-div">
            <!-- 存在标签颜色 -->
            <p
              v-if="colorTagList.indexOf(val.tagType) != -1"
              :ref="val.tagType"
              :class="val.tagType"
              @click="gotoHome(val.name)"
            >
              {{ val.name.replace(/_/g, ' ') }}
            </p>
            <!-- 其他情况 -->
            <p v-else @click="gotoHome(val.name)">{{ val.name.replace(/_/g, ' ') }}</p>
          </div>
        </div>
        <b-tooltip
          :disabled="overflowed.indexOf(val.name) == -1"
          :target="'lb-tag-item-' + key"
          variant="light"
          placement="left"
        ></b-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default() {
        return '热门标签'
      }
    },
    tags: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // Tag 颜色列表
      colorTagList: ['Copyright', 'Language', 'Character', 'General', 'Meta', 'Soundtrack', 'Author'],
      // 溢出元素表
      overflowed: []
    }
  },
  watch: {
    // 当标签发生变动时刷新溢出属性
    tags() {
      this.$nextTick(function() {
        this.freshOverflow()
      })
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.freshOverflow()
    })
    // 监听resize
    const _this = this
    window.onresize = () => {
      _this.freshOverflow()
    }
  },
  methods: {
    // 点击标签显示标签的搜索结果
    gotoHome(key) {
      if (key) {
        this.$router.push(this.localePath({ path: '/home', query: { keyword: key } }))
      } else {
        this.$router.push(this.localePath({ path: '/home' }))
      }
    },
    freshOverflow() {
      this.overflowed = []
      this.colorTagList.forEach((i) => {
        if (this.$refs[i]) {
          this.$refs[i].forEach((i2) => {
            if (
              Math.floor(
                this.$pdriver.utils.getTextSize(
                  i2.textContent,
                  '100%',
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
                ).width
              ) > i2.offsetWidth
            ) {
              this.overflowed.push(i2.textContent)
            }
          })
        }
      })
    }
  }
}
</script>

<style>
.tag-ul {
  margin: 0;
  padding: 0;
}
.tag {
  display: inline-block;
}
.tag-div {
  cursor: pointer;
  padding: 0 12px;
  border-radius: 100px;
  border: 1px solid #a4a4a4;
  margin: 0 10px 8px 0;
  /* 使文字变为最多显示1行，多余的使用省略号代替 */
  display: -webkit-inline-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-div > p {
  margin: 0;
}
.tag-div:hover {
  border-color: #ff88a0;
}
.tag-div > p:hover {
  color: #ff88a0;
}
/* 针对列表调整颜色 */
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
