<template>
  <div>
    <div class="ImgNormalizer"><input type="file" ref="iptRef" @change="normalizeImg"></div>
    <div class="img-normalized-result" ref="elInr"></div>
  </div>
</template>

<script>
import { onBeforeUnmount, ref } from '@vue/runtime-core';
import { DocumentNormalizer } from "dynamsoft-document-normalizer";
export default {
  name: 'ImgNormalizer',
  setup() {
    const iptRef = ref(null);
    const elInr = ref(null);
    let pNormalizer = null;

    const normalizeImg = async (e) => {
      try {
        const normalizer = await (pNormalizer = DocumentNormalizer.createInstance());;
        let results = await normalizer.detectQuad(e.target.files[0]);
        elInr.value.innerHTML = "";
        for(let item of results) {
          const norRes = await normalizer.normalize(e.target.files[0], {quad: item.location});
          const cvs = norRes.image.toCanvas();
          if(document.body.clientWidth < 600) {
            cvs.style.width = "100%";
          }
          elInr.value.appendChild(cvs);
        }
        console.log(results);
      } catch(ex) {
        let errMsg;
        if (ex.message.includes("network connection error")) {
            errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
        } else {
            errMsg = ex.message||ex;
        }
        console.error(errMsg);
        alert(errMsg);
      }
      iptRef.value.value = '';
    }

    onBeforeUnmount(async ()=>{
      if(pNormalizer) {
        (await pNormalizer).dispose();
        pNormalizer = null;
        console.log('ImgNormalizer Component Unmount');
      }
    })

    return {
      normalizeImg,
      iptRef,
      elInr
    }
  },
}
</script>

<style scoped>
  .ImgNormalizer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 90%;
    border: 1px solid black;
    margin-bottom: 10px;
  }
</style>