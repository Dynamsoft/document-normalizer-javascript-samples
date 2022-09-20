<template>
  <HelloWorld msg="Hello World for Vue 3" />
</template>

<script>
import './dce';
import './ddn';
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>

</style>
