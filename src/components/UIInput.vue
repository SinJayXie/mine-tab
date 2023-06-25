<template>
    <div class="ui-input">
        <input class="ui-input__inner" v-model="bindValue" type="text" @input="inputHandler" @blur="updateValue" @focus="focusHandler" :placeholder="props.placeholder">
    </div>
</template>


<script setup>
import { onMounted, watch, ref } from "vue"


const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'asd'
    }
})

const bindValue = ref("")

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus'])
const isChange = ref(false)
watch(() => props.modelValue, (val, old) => {
    if(isChange.value) {
        isChange.value = false
        return
    }
    if(val === old) return
    bindValue.value = val
})


const inputHandler = function (val) {
    emit('input', bindValue.value)
}

const focusHandler = function (val) {
    emit('focus', bindValue.value)
}

const updateValue = function () {
    isChange.value = true
    emit('blur', bindValue.value, props.modelValue)
    emit('update:modelValue', bindValue.value)
}

</script>

<style lang="scss">
.ui-input {

    position: relative;
    overflow: hidden;
    height: 30px;
    width: 100%;
    box-shadow: 0 0 10px #00000022;
    border-radius: 4px;
    

    &__inner {
        background-color: #ffffff22;
        outline: none;
        border: 0;
        color: #fff;
        padding: 0 10px;
        width: 100%;
        height: 100%;

        &::placeholder {
            color: #ccc;
        }
    }
}
</style>