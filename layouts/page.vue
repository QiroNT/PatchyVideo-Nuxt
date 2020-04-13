<template>
  <div>
    <top-navbar />
    <nuxt />
    <pfooter />
  </div>
</template>

<script>
import topNavbar from '~/components/page/layout/TopNavbar.vue'
import pfooter from '~/components/page/layout/Footer.vue'
export default {
  components: { topNavbar, pfooter }
}
</script>
