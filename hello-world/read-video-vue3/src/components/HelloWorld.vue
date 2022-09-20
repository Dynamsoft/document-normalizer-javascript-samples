<template>
  <div className="helloWorld">
    <h1>{{ msg }} <img class="applogo" alt="Vue logo" src="../assets/logo.png" /></h1>
    <div className="btn-group" v-if="libLoaded">
        <button :style="{marginRight: '5px', backgroundColor: bShowVideoNormalizer ? 'rgb(255,174,55)' : 'white'}" @click="showVideoNormalizer">Video Recognizer</button>
        <button :style="{marginRight: '5px', backgroundColor: bShowImgNormalizer ? 'rgb(255,174,55)' : 'white'}" @click="showImgNormalizer">Image Recognizer</button>
    </div>
    <div class="container">
      <span style="font-size: x-large" v-if="!libLoaded">Loading Library...</span>
      <VideoNormalizer v-if="bShowVideoNormalizer"></VideoNormalizer>
      <ImgNormalizer v-if="bShowImgNormalizer"></ImgNormalizer>
    </div>
  </div>
</template>

<script>
import VideoNormalizer from "./VideoNormalizer";
import ImgNormalizer from './ImgNormalizer.vue'
import { ref, onMounted } from "vue";
import { DocumentNormalizer } from "shen-dynamsoft-document-normalizer";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const libLoaded = ref(false);
    const bShowVideoNormalizer = ref(true);
    const bShowImgNormalizer = ref(false);
    onMounted(async () => {
      try {
        //Load the library on page load to speed things up.
        await DocumentNormalizer.loadWasm();
        libLoaded.value = true;
        showVideoNormalizer();
      } catch (ex) {
        let errMsg;
        if (ex.message.includes("network connection error")) {
          errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
        } else {
          errMsg = ex.message||ex;
        }
        console.error(errMsg);
        alert(errMsg);
      }
    });
    const showVideoNormalizer = () => {
      bShowVideoNormalizer.value = true;
      bShowImgNormalizer.value = false;
    };
    const showImgNormalizer = () => {
      bShowVideoNormalizer.value = false;
      bShowImgNormalizer.value = true;
    }
    
    return {
      libLoaded,
      bShowVideoNormalizer,
      bShowImgNormalizer,
      showVideoNormalizer,
      showImgNormalizer
    };
  },
  components: {
    VideoNormalizer,ImgNormalizer
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin: 2vmin auto;
  text-align: center;
  font-size: medium;
  height: 80%;
  width: 80vw;
}
.applogo {
  height: 25px;
}
.btn-group {
  width: 100%;
  text-align: center;
}
button {
  font-size: 1.5rem;
  margin: 1.5vh 0;
  border: 1px solid black;
  background-color: white;
  color: black;
}
.helloWorld {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  color: #455a64;
}

h1 {
  font-size: 1.5em;
}
</style>
