<template>
    <div class="setting-content-block">
        <div class="setting-content-block__title">Setting</div>
        <div class="setting-content-block__content">
            <ul>
                <li class="setting-item">
                    <div class="label">Search engine</div>
                    <div class="append"><UISelector v-model="setting_config.search_engine" :options="engineOption" @change="saveOption" /></div>
                </li>

                <li class="setting-item">
                    <div class="label">Wallpaper image</div>
                    <div class="append" style="width: 50%;"><UIInput v-model="wallpaper_url_string" placeholder="Wallpaper url,default: empty text" @blur="changeWallpaper"/></div>
                </li>
            </ul>
        </div>
        <div class="setting-content-block__footer">
            <button @click="closeSettingHandler">Close</button>
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import UISelector from '../../components/UISelector.vue';
import UIInput from '../../components/UIInput.vue';
import ChromeStorage from '../../utils/ChromeStorage';
import defaultConfig from '../../defaultConfig';
import _ from 'lodash';
import { emitEvent } from '../../utils/Event';


const storage = new ChromeStorage('mineTab')

const setting_config = ref(defaultConfig)

const wallpaper_url_string = ref("")

onMounted(async() => {
    const config = await storage.get(_.keys(defaultConfig))
    setting_config.value = _.merge(setting_config.value, config);
    console.log(setting_config);
    wallpaper_url_string.value = setting_config.value.wallpaper_url
})



const emit = defineEmits(['close-setting'])
const engineOption = ref([
    { label: "Baidu", value: 'baidu' },
    { label: "Bing", value: 'bing' },
    { label: "Google", value: 'google' },
])


const closeSettingHandler = function () {
    emit("close-setting")
}



const saveOption = function (val) {
    storage.set(setting_config.value)


    emitEvent('update-setting', _.cloneDeep(setting_config.value))
}


const changeWallpaper = function (val, old) {
    setting_config.value.wallpaper_url = val
    saveOption()
    emitEvent('change-wallpaper', val)

    
}

</script>


<style lang="scss">
.setting-content-block {
    width: 70%;
    height: 60%;
    min-width: 500px;
    max-width: 900px;
    background-color: #ffffff22;
    border-radius: 10px;
    box-shadow: 0 0 60px rgba(0,0,0,.1);
    color: #ffffffee;
    user-select: none;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 30px;
        position: relative;
        border-bottom: 1px solid #00000011;
    }


    &__content {
        width: 100%;
        padding: 4vw;
        font-size: 12px;
        overflow: auto;
        flex: 1;
        padding: 10px 0;

        ul {
            padding: 0 4vw;
            margin: 0;
            list-style: none;

            .setting-item {
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                margin-bottom: 5px;
                border-radius: 4px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                transition: all ease .3s;


                // &:hover {
                //     background-color: #ffffff22;
                //     transform: scale(1.02);
                // }


                .label {
                    flex: 1;
                }

                .append {
                    padding: 0 10px;
                }
            }
        }
    }


    &__footer {
        width: 100%;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        border-top: 1px solid #00000011;

        button {
            outline: none;
            border: 0;
            background: #ffffff33;
            padding: 10px 20px;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
            transition: all ease .3s;
            border: 1px solid transparent;

            &:hover {
                transform: scale(1.1);
                box-shadow: 0 0 10px #00000022;
            }

            &:active {
                opacity: 0.6;
                transform: scale(0.9);
            }
        }


        .save {
            border: 1px solid #409eff;

            &:hover  {
                background-color: #409eff;
            }
        }
    }
}
</style>