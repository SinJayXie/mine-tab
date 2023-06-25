<template>
    <div class="search-view" @click.stop="holderplaceOptions = []">
        <div class="search-view__inner">
            <clock-view />
            <div class="search-input-block">
                <input v-model="searchString" @keyup="searchHolderplaceWord" type="text" :placeholder="'Search engine: ' + searchConfig.search_engine" @keydown.enter="searchHandler">
                <div class="holderplace-word" v-show="_.size(holderplaceOptions) > 0">
                    <ul>
                        <li v-for="(item, index) in holderplaceOptions" :key="index" @click="searchHandler(item.q)">{{ item.q }}</li>
                    </ul>
                </div>
            </div>
            <bookmarks :bookmarks="bookmarks" @open="emitOpenFolderHanlder"/>
        </div>
    </div>
</template>



<script setup>
import { onMounted, ref } from 'vue';
import ClockView from './ClockView.vue';
import Bookmarks from './Bookmarks.vue';
import ChromeRuntime from '../../../utils/ChromeRuntime';
import _ from 'lodash';
import ChromeStorage from '../../../utils/ChromeStorage';
import { addEvent } from '../../../utils/Event'
const emit = defineEmits(['open-folder'])

const searchString = ref("")
const searchLoading = ref(false)

const storage = new ChromeStorage('mineTab')
const chromeUtils = ref(ChromeRuntime)
const bookmarks = ref([])

chromeUtils.value.init(() => {
    bookmarks.value = chromeUtils.value.bookmarks
})

const searchConfig = ref({
    search_engine: '',
    search_engine_option: {}
})


onMounted(async () => {
    searchConfig.value = _.merge(searchConfig.value, await storage.get(['search_engine', 'search_engine_option']))
})



addEvent("update-setting", async(setting) => {
    console.log(setting);
    searchConfig.value = _.merge(searchConfig.value, await storage.get(['search_engine', 'search_engine_option']))
})


const emitOpenFolderHanlder = function (status) {
    emit("open-folder", status)
}


const searchHandler = function (str) {
    if(typeof str === 'string') {
        searchString.value = str
        holderplaceOptions.value = []
    }
    const searchUrl = _.get(searchConfig.value, 'search_engine_option.' + searchConfig.value.search_engine, false)
    if(searchUrl) {
        window.open(searchUrl.replace("($QUERY_STRING$)", searchString.value))
        searchString.value = ""
    } else {
        console.error("Search engine error");
    }
    
    
}

const holderplaceOptions = ref([])

const searchHolderplaceWord = function () {
    if(searchString.value) {
        searchLoading.value = true
        fetch('https://www.baidu.com/sugrec?json=1&prod=pc&from=pc_web&req=2&csor=1&wd=' + searchString.value).then(fetchRes => {
            fetchRes.text().then(res => {
                const json = JSON.parse(res)
                holderplaceOptions.value = _.get(json, 'g', [])
            }).catch(err => {
                holderplaceOptions.value = []
            })
        }).catch(err => {

        }).finally(() => {
            searchLoading.value = false
        })
    }
 }

</script>



<style lang="scss">
.search-view {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 1;

    &__inner {
        color: #fff;
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        justify-content: center;
        align-items: center;
        flex-direction: column;


        .search-input-block {
            width: 60%;
            max-width: 700px;
            position: relative;
            height: 6vw;
            max-height: 55px;
            border-radius: 12px;
            margin-top: 2vw;
            animation: search-block-in ease .9s;

            ::-webkit-scrollbar {
                display: none;
            }

            .holderplace-word {
                width: 100%;
                background-color: #ffffff55;
                position: absolute;
                backdrop-filter: blur(30px) saturate(2);
                z-index: 3;
                margin-top: 5px;
                border-radius: 12px;
                max-height: 40vh;
                overflow: auto;

                

                ul {
                    position: relative;
                    padding: 10px 0;
                    height: 100%;
                    margin: 0;
                    list-style: none;
                    user-select: none;
                

                    li {
                        height: 2.5vw;
                        line-height: 2.5vw;
                        padding: 0 1.5vw;
                        color: #00000099;
                        cursor: pointer;

                        &:hover {
                            background-color: #ffffff22;
                        }

                        &:active {
                            background-color: #00000022;
                            color: #ffffff88;
                        }
                    }
                }
            }

            input {
                background: #ffffff88;
                backdrop-filter: blur(30px) saturate(2);
                border-radius: 12px;
                outline: none;
                border: 0;
                width: 100%;
                height: 6vw;
                max-height: 55px;
                padding: 0 2vw;
                font-size: 1.2vw;
                line-height: 2vw;
                transition: all ease .3s;
                color: #00000033;


                &:focus {
                    font-size: 1.5vw;
                    opacity: 1;
                    color: #000000;

                    &::placeholder {
                        opacity: 0.5;
                    }
                }


                &::placeholder {
                    color: #000;
                    opacity: 0.2;
                }
            }
        }
    }


    @keyframes search-block-in {
        0% {
            opacity: 0;
            transform: translateY(50vh);
        }

        50% {
            opacity: 1;
            transform: translateY(-10px);
        }


        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>