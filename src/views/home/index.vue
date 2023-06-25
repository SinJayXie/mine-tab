<template>
    <div class="new-tab-page">
        <wallpaper-view :isScale="isScaleWallpaper || showSetting"/>
        <div class="main-block" :class="{ 'main-hide': showSetting, 'main-show': !showSetting }">
            <search-view @open-folder="openFolderHandler" />
        </div>
        <div class="setting-block" :class="{ 'setting-show': showSetting, 'setting-hide': !showSetting }" :style="{ opacity: isInit ? '0' : '1' }">
            <setting-view @close-setting="closeSetting" />
        </div>
        <div class="button-tools" :style="{ '--BOTTOM_OFFSET': isScaleWallpaper || showSetting ? '100%' : '0' }">
            <button @click="showSetting = true"><img src="/images/setting.svg" alt=""></button>
        </div>
        
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'

import WallpaperView from './components/WallpaperView.vue';
import SearchView from './components/SearchView.vue';
import SettingView from '../setting/Setting.vue';

const showSetting = ref(false)
const isInit = ref(true)
const isScaleWallpaper = ref(false)

const openFolderHandler = function (status) {
    isScaleWallpaper.value = status
}


const closeSetting = function () {
    showSetting.value = false
}

onMounted(() => {
    nextTick(() => {
        setTimeout(() => {
            isInit.value = false
        }, 1000)
        setTimeout(() => {
            // showSetting.value = true
        }, 1200)
    })
})

</script>


<style lang="scss">
.new-tab-page {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .button-tools {
        --BOTTOM_OFFSET: 0;
        z-index: 2;
        bottom: 0;
        width: 100%;
        position: absolute;
        padding: 4vw;
        background-color: transparent;
        transform: translateY(var(--BOTTOM_OFFSET));
        transition: all ease .4s;
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;

        &::after {
            content: 'Copyright 2023 dishuyl.xyz. All rights reserved.';
            position: absolute;
            pointer-events: none;
            bottom: 5px;
            left: 5px;
            opacity: 0.6;
            color: #fff;
            font-size: 10px;
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            outline: none;
            border: 0;
            background-color: transparent;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: all ease .3s;
            border-radius: 50%;
            overflow: hidden;
            backdrop-filter: blur(20px) saturate(2);
            box-shadow: 0 0 10px #00000022;
            

            &:hover {
                background-color: #ffffff22;
            }

            &:active {
                background-color: #00000022;
            }

            img {
                pointer-events: none;
                width: 100%;
                height: 100%;
            }
        }
    }

    .main-block {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    .main-show {
        animation: main-in ease 1s forwards;
    }


    .main-hide {
        animation: main-out ease 2.5s forwards;
    }

    .setting-block {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        display: none;
    }


    .setting-show {
        display: flex;
        animation: setting-in ease .4s forwards;

        .setting-content-block {
            animation: setting-content-in ease .5s forwards;
        }

    }


    .setting-hide {
        pointer-events: none;
        display: flex;
        animation: setting-out ease .4s forwards;

        .setting-content-block {
            animation: setting-content-out ease .5s forwards;
        }
    }

    @keyframes setting-content-in {
        0% {
            opacity: 0.5;
            filter: blur(30px);
            transform: scale(1.2);
        }


        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes setting-content-out {
        0% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
        }


        100% {
            opacity: 0;
            filter: blur(30px);
            transform: scale(1.2);
        }
    }

    @keyframes main-out {
        0% {
            transform: scale(1);
        }


        100% {
            transform: scale(0.8);
        }
    }

    @keyframes main-in {
        0% {
            transform: scale(0.8);
        }


        100% {
            transform: scale(1);
        }
    }

    @keyframes setting-in {
        0% {
            background-color: #00000000;
            backdrop-filter: blur(0) saturate(1);
        }

        100% {
            background-color: #00000033;
            backdrop-filter: blur(20px) saturate(2);
        }
    }

    @keyframes setting-out {

        0% {
            background-color: #00000033;
            backdrop-filter: blur(20px) saturate(2);
        }

        100% {
            background-color: #00000000;
            backdrop-filter: blur(0) saturate(1);
        }

        
    }
}
</style>