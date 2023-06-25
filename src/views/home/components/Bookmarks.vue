<template>
    <div class="bookmarks">
        <div class="content">
            <div class="bookmark-item" v-for="(bookmark, index) in bookmarks.children" :key="index" @contextmenu.stop="openContextMenu(bookmark, $event)" @click="showBookmarkMenu(bookmark, $event)">
                <div class="icon">
                    <img v-if="_.has(bookmark, 'children')" src="/images/folder.png" alt="">
                    <img v-else :src="ChromeRuntime.getFaviconUrl(bookmark.url)" alt="">
                </div>
                <div class="bookmark-label">{{ bookmark.title }}</div>
            </div>
        </div>

        <div class="bookmarks-fixed bookmarks-dir-hidden" ref="bookmarksFixedRef" @keydown.esc="hideBookmark">
            <div class="animation-icon" ref="AnimationIconRef">
                <img :src="animationIconUrl" alt="">
            </div>
            <div class="bookmarks-dir-view" ref="bookmarksDirViewRef" @click="hideBookmark">
                <div class="title-bookmarks">
                    {{ displayBookmarksTitle[displayBookmarksTitle.length - 1] }}
                </div>
                <div class="directory-view-block" @click.stop="() => {}">
                    <div class="back-up-btn" v-if="displayBookmarksTitle.length > 1" @click="backBookmarks">
                        <svg t="1686644907875" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28599" width="128" height="128"><path d="M789.333333 490.666667H243.2l243.2-238.933334c8.533333-8.533333 8.533333-21.333333 0-29.866666-8.533333-8.533333-21.333333-8.533333-29.866667 0l-277.333333 275.2c-8.533333 8.533333-8.533333 21.333333 0 29.866666 0 0 2.133333 0 2.133333 2.133334l275.2 277.333333c4.266667 4.266667 10.666667 6.4 14.933334 6.4 6.4 0 10.666667-2.133333 14.933333-6.4 8.533333-8.533333 8.533333-21.333333 0-29.866667L245.333333 533.333333H789.333333c12.8 0 21.333333-8.533333 21.333334-21.333333s-8.533333-21.333333-21.333334-21.333333z" fill="#e6e6e6" p-id="28600"></path></svg>
                    </div>
                    <ul>
                        <li v-for="(item, index) in displayBookmarks[displayBookmarks.length - 1]" :key="index">
                            <div v-if="_.has(item, 'children')" class="item-content" @click="nextBookmarks(item)">
                                <img src="/images/folder.png" alt="">
                                <div class="title">{{ item.title }}</div>
                            </div>
                            <div v-else class="item-content" @click="openUrl(item.url)">
                                <img :src="ChromeRuntime.getFaviconUrl(item.url)" alt="">
                                <div class="title">{{ item.title }}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import _ from 'lodash';
import ChromeRuntime from '../../../utils/ChromeRuntime';
import UIMessage from '../../../utils/Message/UIMessage';





const props = defineProps({
    bookmarks: {
        type: Object,
        default: () => { return {} },
        required: true
    }
})


const emit = defineEmits(['open'])
const bookmarksFixedRef = ref()
const bookmarksDirViewRef = ref()
const animationIconUrl = ref("/images/folder.png")

const AnimationIconRef = ref()

const displayBookmarks = ref([[]])
const displayBookmarksTitle = ref(["Bookmarks"])

const openTarget = ref(document.createElement("div"))



const openUrl = function (url) {
    window.open(url)
}


const showBookmarkMenu = function (bookmark, event) { 
    if(!_.has(bookmark, 'children')) {
        window.open(bookmark.url)
        return false
    }
    const target = event.target
    if(target.className.indexOf('bookmark-item') === 0) {
        const targetRect = target.getBoundingClientRect()
        const bodyRect = document.body.getBoundingClientRect()
        const image = target.querySelector("img")
        const imageRect = image.getBoundingClientRect()

        animationIconUrl.value = image.src

        openTarget.value = target
        
        image.style.opacity = '0'



        const x = targetRect.width / bodyRect.width
        const y = targetRect.height / bodyRect.height

        const image_x = imageRect.width / bodyRect.width
        const image_y = imageRect.height / bodyRect.height

        bookmarksDirViewRef.value.style.setProperty("--SCALE_X", image_x)
        bookmarksDirViewRef.value.style.setProperty("--SCALE_Y", image_y)

        AnimationIconRef.value.style.setProperty("--SCALE_X", image_x)
        AnimationIconRef.value.style.setProperty("--SCALE_Y", image_y)

        AnimationIconRef.value.style.transformOrigin = (imageRect.left * (1+image_x)) + 'px ' + (imageRect.top * (1+image_y)) + 'px'
        AnimationIconRef.value.classList.remove("animation-icon-hidden")
        AnimationIconRef.value.classList.add("animation-icon-show")

        bookmarksFixedRef.value.classList.remove("bookmarks-dir-hidden")
        bookmarksFixedRef.value.classList.remove("bookmarks-dir-leave")
        bookmarksFixedRef.value.classList.add("bookmarks-dir-show")
        bookmarksDirViewRef.value.style.transformOrigin = (imageRect.left * (1+image_x)) + 'px ' + (imageRect.top * (1+image_x)) + 'px'
        bookmarksDirViewRef.value.classList.remove("bookmarks-dir-view-hidden")
        bookmarksDirViewRef.value.classList.add("bookmarks-dir-view-show")
        displayBookmarks.value = [bookmark.children]
        displayBookmarksTitle.value = [bookmark.title]

        emit("open", true)
    }
 }

const backBookmarks = function () { 
    if(displayBookmarksTitle.value.length > 1) {
        displayBookmarksTitle.value.splice(displayBookmarksTitle.value.length - 1, 1)
        displayBookmarks.value.splice(displayBookmarks.value.length - 1, 1)
    }
}

const hideBookmark = function () {
    bookmarksFixedRef.value.classList.remove("bookmarks-dir-hidden")
    bookmarksFixedRef.value.classList.remove("bookmarks-dir-leave")
    bookmarksFixedRef.value.classList.remove("bookmarks-dir-show")
    bookmarksFixedRef.value.classList.add("bookmarks-dir-leave")
    bookmarksDirViewRef.value.classList.remove("bookmarks-dir-view-show")
    bookmarksDirViewRef.value.classList.add("bookmarks-dir-view-hidden")
    AnimationIconRef.value.classList.add("animation-icon-show")
    AnimationIconRef.value.classList.add("animation-icon-hidden")
    emit("open", false)
    setTimeout(() => {
        bookmarksFixedRef.value.classList.remove("bookmarks-dir-hidden")
        bookmarksFixedRef.value.classList.remove("bookmarks-dir-leave")
        bookmarksFixedRef.value.classList.remove("bookmarks-dir-show")
        bookmarksFixedRef.value.classList.add("bookmarks-dir-hidden")


        const image = openTarget.value.querySelector("img")
        image.style.opacity = '1'
    }, 490)
}

const nextBookmarks = function (bookmark) {
    displayBookmarksTitle.value.push(bookmark.title)
    displayBookmarks.value.push(bookmark.children)
}

const contextmenuOption = [
    {
        label: "Rename",
        cb: function (bookmark) {
            UIMessage.prompt("Edit bookmark title", "Input new title!", bookmark.title, (val) => {

                if(val === bookmark.title) {
                    UIMessage.alert("Alert", "New and old title are consistent!")
                } else {
                    ChromeRuntime.updateBookmark(bookmark.id, { title: val })
                }
            })
        }
    },
    {
        label: "Edit url",
        rule: 'link',
        cb: function (bookmark) {
            UIMessage.prompt("Edit bookmark url", "Input new url!", bookmark.url, (val) => {

                if(val === bookmark.url) {
                    UIMessage.alert("Alert", "New and old link are consistent!")
                } else {
                    ChromeRuntime.updateBookmark(bookmark.id, { url: val })
                }
            })
        }
    },
    {
        label: "Delete",
        color: 'red',
        cb: function (bookmark) {
            UIMessage.confirm("Remove", `You are attempting to delete "${bookmark.title}"`).then(() => {
                ChromeRuntime.deleteBookmark(bookmark.id).then(() => {
                    UIMessage.alert("Remove Success", `Removed ${bookmark.title} !`)
                }).catch(e => {
                    UIMessage.alert("Remove Error", e.message)
                }) 
            })    
        }
    }
]

const checkIsLink = function (bookmark) {
    return !_.has(bookmark, 'children')
}


const openContextMenu = function (bookmark, ev) {
    ev.stopPropagation()
    ev.preventDefault()
    const iconImg = ev.target.querySelector("img")


    const mask = document.createElement("div")
    mask.classList.add("bookmark-contextmenu")

    mask.addEventListener("click", ev => {
        ev.stopPropagation()
        ev.preventDefault()
        closeMenu()
    })
    
    const inner = document.createElement("div")
    inner.classList.add(mask.className + "__inner")

    const icon = document.createElement('div')
    icon.classList.add(inner.className + "_icon")

    icon.appendChild(iconImg.cloneNode(true))

    inner.appendChild(icon)


    const list = document.createElement('div')
    list.classList.add(inner.className + "_list")
    const title = document.createElement("div")
    title.classList.add(list.className + "_title")
    title.innerText = bookmark.title
    list.appendChild(title)
    contextmenuOption.forEach(opt => {
        if(opt.rule === 'link') {
            if(!checkIsLink(bookmark)) return false
        }

        const option = document.createElement("div")
        option.classList.add(list.className + "_option")
        option.innerText = opt.label
        if(opt.color) option.style.color = opt.color
        

        option.addEventListener("click", ev => {
            ev.stopPropagation()
            ev.preventDefault()
            closeMenu()
            if(typeof opt.cb === 'function') opt.cb(bookmark)
        })

        list.appendChild(option)
    
    })

    inner.appendChild(list)

    const imgRect = iconImg.getBoundingClientRect()

    iconImg.style.opacity = '0'


    inner.style.setProperty('--OFFSET_X', imgRect.left + 'px')
    inner.style.setProperty('--OFFSET_Y', imgRect.top + 'px')


    mask.appendChild(inner)

    document.body.appendChild(mask)


    function closeMenu() {
        mask.style.animation = "bookmark-contextmenu-close ease .4s forwards"
        list.style.animation = "bookmark-contextmenu-out ease .4s forwards"
        setTimeout(() => {
            mask.remove()
            iconImg.style.opacity = '1'
        }, 390)
    }

    return true
}

// onMounted(() => {
//     setTimeout(() => {
//         const fakeEl = document.createElement("div")
//         fakeEl.className = 'bookmark-item'
//         props.bookmarks.title = "Bookmarks"
//         showBookmarkMenu(props.bookmarks, { target: fakeEl })
//         console.log(props.bookmarks);
//     }, 200)
// })




</script>

<style lang="scss">

.bookmark-contextmenu {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #00000022;
    backdrop-filter: blur(20px) saturate(2);
    z-index: 88;
    user-select: none;
    -webkit-user-select: none;
    animation: bookmark-contextmenu-open ease .4s forwards;

    &__inner {
        --OFFSET_X: 0;
        --OFFSET_Y: 0;
        position: absolute;
        left: var(--OFFSET_X);
        top: var(--OFFSET_Y);

        &_icon {
            width: 50px;
            height: 50px;
            position: relative;
            overflow: hidden;
            z-index: 8;
            border-radius: 10px;
           
            
            img {
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
        }

        &_list {
            margin-top: 10px;
            min-width: 190px;
            background-color: #ffffff44;
            border-radius: 10px;
            overflow: auto;
            box-shadow: 0 0 10px #00000011;
            transform-origin: left top;
            animation: bookmark-contextmenu-in 0.3s ease forwards;
            z-index: 5;
            max-height: 50vh;

            &_title {
                text-align: center;
                height: 25px;
                line-height: 25px;
                border-bottom: 1px solid #ffffff22;
                color: #ffffffaa;
                font-weight: bold;
            }

            &_option {
                padding: 0 10px;
                height: 35px;
                transition: all ease .3s;
                line-height: 35px;
                color: #ffffffaa;
                cursor: pointer;
                

                &:hover {
                    background-color: #ffffff22;
                }

                &:active {
                    background-color: #00000022;
                }
            }
        }
    }


    @keyframes bookmark-contextmenu-in {
        0% {
            opacity: 0;
            transform: scale(0) translate(0%, -200%);
        }

        100% {
            opacity: 1;
            transform: scale(1) translate(0);
        }
    }

    @keyframes bookmark-contextmenu-out {
        0% {
            opacity: 1;
            transform: scale(1) translate(0);
        }

        100% {
            opacity: 0;
            transform: scale(0) translate(0%, -200%);
        }
        
    }

    @keyframes bookmark-contextmenu-open {
        0% {
            background-color: #00000000;
            backdrop-filter: blur(0) saturate(1);
        }

        100% {
            background-color: #00000022;
            backdrop-filter: blur(20px) saturate(2);
        }
    }

    @keyframes bookmark-contextmenu-close {
        0% {
            background-color: #00000022;
            backdrop-filter: blur(20px) saturate(2);
        }

        100% {
            background-color: #00000000;
            backdrop-filter: blur(0) saturate(1);
        }

    }
}


.bookmarks {
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    z-index: 2;
    margin-top: 2vw;
    width: 60%;
    max-width: 700px;
    height: 30%;
    min-height: 100px;

    ::-webkit-scrollbar {
        display: none;
    }
    

    .content {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 5px;
        animation: bookmark-in cubic-bezier(0.17, 0.55, 0.2, 0.94) .9s forwards;
        padding: 0 10px;
        overflow: auto;

        .bookmark-item {
            padding: 0 5px;
            cursor: pointer;
            text-shadow: #ffffff;
            border-radius: 4px;
            transition: all ease .2s;
            width: 80px;
            height: 100px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 10px;
            justify-content: center;
            align-items: center;
            padding: 5px;

            &:hover {
                background: #ffffff55;
            }

            &:active {
                background: #00000044;
                color: #fff;
            }

            .bookmark-label {
                width: 100%;
                height: 20px;
                line-height: 12px;
                font-size: 12px;
                height: 15px;
                overflow: hidden;
                pointer-events: none;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
            }


            .icon {
                width: 50px;
                height: 50px;
                border-radius: 10px;
                overflow: hidden;
                pointer-events: none;

                img {
                    width: 50px;
                    height: 50px;
                }
            }
        }
    }


    .bookmarks-fixed {
        position: fixed;
        // display: none;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background: #00000044;
        z-index: 10;


        .animation-icon {
            pointer-events: none;
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 4;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .animation-icon-show {
            animation: animation-icon-in 0.4s cubic-bezier(0.17, 0.55, 0.2, 0.94) forwards;
        }

        .animation-icon-hidden {
            animation: animation-icon-out 0.4s cubic-bezier(0.17, 0.55, 0.2, 0.94) forwards;
        }

        .bookmarks-dir-view {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            transform-origin: 0 0;
            flex-direction: column;

            .title-bookmarks {
                font-size: 5vw;
                color: #fff;
                margin-bottom: 5vw;
                opacity: 0.8;
                text-shadow: 0 0 40px #000000;
                display: flex;
                justify-items: center;
                height: 50px;
                line-height: 50px;
            }
            

            .directory-view-block {
                width: 70%;
                height: 50%;
                background-color: #ffffff33;
                border-radius: 10px;
                position: relative;

                .back-up-btn {
                    overflow: hidden;
                    width: 5vw;
                    height: 5vw;
                    border-radius: 50%;
                    position: absolute;
                    top: -6vw;
                    transition: all ease .2s;
                    cursor: pointer;

                    &:hover {
                        background-color: #ffffff33;
                    }

                    &:active {
                        background-color: #00000011;
                    }

                    svg {
                        width: 100%;
                        height: 100%;
                    }
                }

                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    padding: 20px;
                    overflow: auto;

                    li {
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        padding: 0 10px;
                        margin-bottom: 4px;
                        border-radius: 4px;
                        transition: all ease .2s;
                        cursor: pointer;

                        &:hover {
                            background-color: #ffffff22;
                        }

                        .item-content {
                            display: flex;
                            justify-content: flex-start;
                            gap: 5px;
                            align-items: center;

                            .title {
                                font-size: 12px;
                                margin: 0;
                                color: #fff;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                flex: 1;
                            }

                            img {
                                width: 20px;
                                height: 20px;
                                border-radius: 5px;
                            }
                        }

                    }
                }
            }
        }

        .bookmarks-dir-view-show {
            animation: bookmarks-mask-in-dir-view cubic-bezier(0.17, 0.55, 0.2, 0.94) 0.4s forwards;
        }

        .bookmarks-dir-view-hidden {
            animation: bookmarks-mask-out-dir-view cubic-bezier(0.17, 0.55, 0.2, 0.94) 0.4s forwards;
        }
    }

    .bookmarks-dir-hidden {
        display: none;
    }


    .bookmarks-dir-leave {
        animation: bookmarks-mask-out 0.4s forwards;
    }


    .bookmarks-dir-show {
        display: block;

        animation: bookmarks-mask-in 0.4s forwards;
    }


    @keyframes bookmarks-mask-in {
        0% {
            background-color: #00000000;
            backdrop-filter: blur(0) saturate(1);
        }

        100% {
            background-color: #00000044;
            backdrop-filter: blur(20px) saturate(2);
        }
    }

    @keyframes bookmarks-mask-out {
        0% {
            background-color: #00000044;
            backdrop-filter: blur(20px) saturate(2);
        }

        100% {
            background-color: #00000000;
            backdrop-filter: blur(0) saturate(1);
        }
    }

    @keyframes bookmarks-mask-in-dir-view {
        0% {
            opacity: 0;
            transform: scale(var(--SCALE_X), var(--SCALE_Y));
        }

        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes bookmarks-mask-out-dir-view {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        
        100% {
            opacity: 0;
            transform: scale(var(--SCALE_X), var(--SCALE_Y));
        }
    }


    @keyframes animation-icon-in {
        0% {
            opacity: 1;
            transform: scale(var(--SCALE_X), var(--SCALE_Y));
        }

        40% {
            opacity: 0;

        }

        100% {
            opacity: 0;
            transform: scale(1);
        }
    }

    @keyframes animation-icon-out {
        0% {
            opacity: 0;
            transform: scale(1);
        }

        25% {
            opacity: 0;
        }
        
        100% {
            opacity: 1;
            transform: scale(var(--SCALE_X), var(--SCALE_Y));
        }
    }
}


@keyframes bookmark-in {
    0% {
        opacity: 0;
        transform: scale(1.5);
    }

    50% {
        opacity: 1;
        transform: scale(0.95);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>