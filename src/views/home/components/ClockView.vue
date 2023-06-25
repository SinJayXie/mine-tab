<template>
    <div class="clock-view" ref="ClockRef">
        <span class="text" v-for="(text, index) in displayDate" :style="{ animation: `text-in ease ${(index + 1) * 100}ms forwards` }" :key="index">{{ text }}</span>    
    </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from "vue";
import _ from 'lodash';

const ClockRef = ref()
const displayDate = ref("00:00:00")



const updateDate = function () {
    const date = new Date()
    const hours = _.padStart(date.getHours(), 2, '0')
    const minutes = _.padStart(date.getMinutes(), 2, '0')
    const seconds = _.padStart(date.getSeconds(), 2, '0')

    displayDate.value = `${hours}:${minutes}:${seconds}`
}

const clockWalk = function () { 
    setInterval(updateDate, 500)
}


onMounted(() => {
    updateDate()
    nextTick(() => {
        clockWalk()
    })
})




</script>

<style lang="scss">
@font-face {
  font-family: 'QUARTZLREGULAR';
  src: url("../../../styles/font/QUARTZLREGULAR.ttf") format('truetype');
  font-weight: normal;
  font-style: normal;
}
.clock-view {
    user-select: none;
    -webkit-user-select: none;
    font-size: 10vw;
    font-family: "QUARTZLREGULAR";
    display: flex;
    
    

    .text {
        display: block;
        transition: all ease .3s;
        transition: all ease .2s;
        opacity: 0.6;
        

        &:hover {
            text-shadow: 0 0 20px #515f81;
            padding: 0 1vw;
            opacity: 0.9;
        }
    }


    @keyframes text-in {
        0% {
            transform: translateY(-20vw);
        }

        50% {
            transform: translateY(20px);
        }

        100% {
            transform: translateY(0);
        }
    }

}
</style>