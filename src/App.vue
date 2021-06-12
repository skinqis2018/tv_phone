<template>
  <div id="app">
    <guide v-show="portrait"></guide>
    <home v-show="!portrait"></home>
  </div>
</template>
<script>
import home from '@/views/home.vue'
import guide from '@/views/guide.vue'
export default {
  components: {
    home,
    guide
  },
  data() {
    return {
      portrait: true
    }
  },
  created() {
    if (window.orientation === 180 || window.orientation === 0) { 
      console.log("竖屏");
      this.portrait = true
    } 
    if (window.orientation === 90 || window.orientation === -90 ){ 
      console.log("横屏");
      this.portrait = false
    } 
  },
  mounted() {
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", () => {
      if (window.orientation === 180 || window.orientation === 0) { 
        console.log("竖屏");
        this.portrait = true
      } 
      if (window.orientation === 90 || window.orientation === -90 ){ 
        console.log("横屏");
        this.portrait = false
      } 
    }, false);
  }
}
</script>
<style>
#app {
  font-family: "KaiTi", "楷体", "STKaiti", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
p,div{
  margin:0;
}
body {
  font-family: "KaiTi", "楷体", "STKaiti", sans-serif;
}
</style>
