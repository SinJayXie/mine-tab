<template>
    <div class="ui-selector" @click.stop="openSelectorList" ref="UISelectorRef">
        <div class="content">
            <div class="ui-selector__inner">
                <span v-if="hoverText">{{ hoverText }}</span>
                <span v-else>Please select ...</span>
            </div>
            <div class="ui-selector__icon">
                <svg t="1686818321939" :style="{ fill: props.color }" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27548" width="128" height="128"><path d="M512 608c-6.4 0-19.2 0-25.6-6.4l-128-128c-12.8-12.8-12.8-32 0-44.8s32-12.8 44.8 0L512 531.2l102.4-102.4c12.8-12.8 32-12.8 44.8 0s12.8 32 0 44.8l-128 128C531.2 608 518.4 608 512 608z" p-id="27549"></path></svg>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import _ from 'lodash';
const props = defineProps({
    color: {
        type: String,
        default: '#ffffff'
    },
    options: {
        type: [Object, Array],
        default: () => { return [] }
    },
    labelKeyName: {
        type: String,
        default: 'label'
    },
    valueKeyName: {
        type: String,
        default: 'value'
    },
    modelValue: {
        type: [String, Number, null],
        default: null
    }
})


const emit = defineEmits(['update:modelValue', 'change'])




const hoverText = ref("")
const selectValue = ref(null)
const UISelectorRef = ref()
const menuTarget = ref(document.createElement("div"))
const isOpen = ref(false)
const isChange = ref(false)


watch(() => props.modelValue, (val, old) => {
    if(isChange.value) {
        emit('change', val)
        isChange.value = false
        return 
    }
    if(val === old) return
    selectValue.value = val
    hoverText.value = _.get(_.find(props.options, { [props.valueKeyName]: val }), props.labelKeyName, val)
})

window.addEventListener("click", () => {
    const target = menuTarget.value
    target.classList.add("selector-list-menu-close")
    setTimeout(() => {
        target.remove()
        isOpen.value = false
    }, 290)
})

const onResize = function (ev) {
    if(isOpen.value) {
        const target = menuTarget.value
        const selectRect = UISelectorRef.value.getBoundingClientRect()

        target.style.left = selectRect.left + 'px'
        target.style.top = (selectRect.top + selectRect.height + 2) + 'px'
        target.style.width = selectRect.width + 'px'
    }
}



const openSelectorList = function () {
    if(isOpen.value) {
        const target = menuTarget.value
        target.classList.add("selector-list-menu-close")
        setTimeout(() => {
            target.remove()
            isOpen.value = false
        }, 290)
        return
    }
    const selectMenu = document.createElement("div")
    selectMenu.classList.add("selector-list-menu")
    const selectRect = UISelectorRef.value.getBoundingClientRect()

    selectMenu.style.left = selectRect.left + 'px'
    selectMenu.style.top = (selectRect.top + selectRect.height + 2) + 'px'
    selectMenu.style.width = selectRect.width + 'px'

    const selectMenuContent = document.createElement('div')
    selectMenuContent.classList.add(selectMenu.className + '__content')

    selectMenu.appendChild(selectMenuContent)
    const emptyItem = document.createElement('div')
    emptyItem.classList.add(selectMenuContent.className + '__item')
    emptyItem.innerText = "Please select"
    emptyItem.onclick = ev => {
        ev.stopPropagation()
        ev.preventDefault()
        // isChange.value = true
        // hoverText.value = ""
        // const target = selectMenu
        // target.classList.add("selector-list-menu-close")
        // emit("update:modelValue", null)
        // setTimeout(() => {
        //     target.remove()
        //     isOpen.value = false
        // }, 290)

        return true
    }
    selectMenuContent.appendChild(emptyItem)


    if(_.isArray(props.options)) {
        _.forEach(props.options, (item) => {
            const listItem = document.createElement('div')
            listItem.classList.add(selectMenuContent.className + '__item')
            listItem.innerText = _.get(item, props.labelKeyName, 'undefined')
            listItem.onclick = ev => {
                ev.stopPropagation()
                ev.preventDefault()
                hoverText.value = _.get(item, props.labelKeyName, 'null')
                const target = selectMenu
                isChange.value = true
                target.classList.add("selector-list-menu-close")
                emit("update:modelValue", _.get(item, props.valueKeyName, null))
                setTimeout(() => {
                    target.remove()
                    isOpen.value = false
                }, 290)

                return true
            }
            selectMenuContent.appendChild(listItem)
        })
        
    } else if(_.isObject(props.options)) {

    }

    setTimeout(() => {
        menuTarget.value = selectMenu
        document.body.appendChild(selectMenu)
        isOpen.value = true
    }, 50)
}

onMounted(() => {
    selectValue.value = props.modelValue
    hoverText.value = _.get(_.find(props.options, { [props.valueKeyName]: props.modelValue }), props.labelKeyName, props.modelValue)
    window.addEventListener("resize", onResize)
})

onUnmounted(() => {
    window.removeEventListener("resize", onResize)
})


</script>


<style lang="scss">

.selector-list-menu {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #ffffff33;
    z-index: 20;
    border-radius: 4px;
    backdrop-filter: blur(20px);
    user-select: none;
    -webkit-user-select: none;
    box-shadow: 0 0 10px #00000022;
    transform-origin: left top;
    animation: selector-list-menu-in ease .3s forwards;
    min-width: 120px;

    &__content {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: auto;

        &__item {
            width: 100%;
            color: #fff;
            font-size: 14px;
            line-height: 30px;
            min-height: 30px;
            padding: 0 10px;
            cursor: pointer;
            transition: all ease .3s;

            &:hover {
                background-color: #ffffff22;
            }

            &:active {
                background-color: #00000022;
            }
        }
    }
}


.selector-list-menu-close {
    animation: selector-list-menu-out ease .3s forwards;
}



@keyframes selector-list-menu-in {
    0% {
        opacity: 0;
        transform: translateY(-30px) scale(0);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes selector-list-menu-out {

    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    100% {
        opacity: 0;
        transform: translateY(-30px) scale(0);
    }
    
}

.ui-selector {
    width: 100%;
    height: 30px;
    font-size: 12px;
    box-shadow: 0 0 10px #00000022;
    background-color: #ffffff22;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all ease .3s;

    &:hover {
        background-color: #ffffff33;
    }

    &:active {
        background-color: #00000022;
    }
    

    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        padding-left: 10px;
        pointer-events: none;
    }

    &__inner {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }


    &__icon {
        width: 30px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            width: 30px;
            height: 30px;
        }

    }

}

</style>