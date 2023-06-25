<template>
    <router-view />
</template>


<script setup>
import { isInstall, install } from './utils/Install'

isInstall().then(async (res) => {
    if(!res){
        install()
    }
})
</script>


<style lang="scss">
@import './styles/main.scss';
</style>