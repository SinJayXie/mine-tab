<template>
    <div class="wallpaper-view" :style="{ '--SCALE_SIZE': wallpaperScale }">
        <div class="content" ref="ContentRef">
            <img :style="{ opacity: isLoadSuccess ? '1' : '0' }" :src="wallpaperUrl" @loadstart="loadStart" @load="loadEnd" alt="" @error="imageLoadError">
        </div>
    </div>
</template>


<script setup>
import { onMounted, nextTick, ref, watch } from "vue";
import { addEvent } from "../../../utils/Event";

import ChromeStorage from "../../../utils/ChromeStorage";

const storage = new ChromeStorage('mineTab')
const ContentRef = ref()
const scaleRate = ref(1.2)
const wallpaperScale = ref(1)
const bodyRect = ref(new DOMRect())
const wallpaperUrl = ref("")
const isLoadSuccess = ref(false)
const props = defineProps({
    isScale: {
        type: Boolean,
        default: false
    }
})

// https://cdn.seovx.com/?mom=302

addEvent('change-wallpaper', async function (url) {
    wallpaperUrl.value = _.get(await storage.get(["wallpaper_url"]), 'wallpaper_url', '/images/backgroundImage.jpg') || '/images/backgroundImage.jpg'
})

watch(() => props.isScale, val => {
    wallpaperScale.value = val ? 1.2 : 1
})


const loadEnd = function () {
    isLoadSuccess.value = true
}

const loadStart = function () {
    isLoadSuccess.value = false
}

const startDeepView = function () {
    const target = ContentRef.value
    bodyRect.value = document.body.getBoundingClientRect()
    
    window.addEventListener("mousemove", function (event) {
        // console.log(event.clientX, event.clientY);
        const xOffset = (event.clientX / bodyRect.value.width - 0.5) * -(scaleRate.value * 2)
        const yOffset = (event.clientY / bodyRect.value.height - 0.5) * -(scaleRate.value * 2)
        target.style.setProperty('--OFFSET_X', xOffset + '%')
        target.style.setProperty('--OFFSET_Y', yOffset + '%')
        target.style.setProperty('--SCALE', scaleRate.value)
    })

    window.addEventListener("mouseleave", function () {
        target.style.setProperty('--OFFSET_X', '0')
        target.style.setProperty('--OFFSET_Y', '0')
    })
}

const imageLoadError = function (err) {
    console.error("[Wallpaper]: Load image failed, change default image");
    wallpaperUrl.value = '/images/backgroundImage.jpg'
}


onMounted(async() => {

    wallpaperUrl.value = _.get(await storage.get(["wallpaper_url"]), 'wallpaper_url', '/images/backgroundImage.jpg') || '/images/backgroundImage.jpg'


    nextTick(() => {
        startDeepView()
    })
})

</script>


<style lang="scss" scoped>
.wallpaper-view {
    --SCALE_SIZE: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    filter: brightness(70%);
    perspective: 1000px;
    transition: all 1s ease;
    transform: scale(var(--SCALE_SIZE));
    background-color: #000;


    .content {
        --OFFSET_X: 0;
        --OFFSET_Y: 0;
        --SCALE: 1.2;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        transform: translate(var(--OFFSET_X), var(--OFFSET_Y)) scale(var(--SCALE));

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: all ease .5s;

        }
    }
}
</style>