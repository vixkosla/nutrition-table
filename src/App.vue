<template>
  <div id="app">
    <h1>Table UI</h1>
    <hr />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
// import TheFilters from "./components/TheFilters.vue";

export default {
  name: "App",
  components: {
    HelloWorld
    // TheFilters
  }
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  background-color: #fbfbfb;
}

h1 {
  font-size: 32px;
  text-align: left;
  font-weight: 600;
  padding-top: 32px;
  margin: 0 0 16px 0;
}

hr {
  background-color: #ededed;
  border: 0.5px solid #ededed;
  margin: 0;
}

#app {
  // padding: 0 1rem;
  margin: 0 auto;
  width: 1140px;
  font-family: "Source Sans Pro";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #282136;
  margin-bottom: 100px;
  // margin-top: 60px;
}
</style>
