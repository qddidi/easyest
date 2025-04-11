<template>
    <button class="bt">测试按钮</button>
</template>
<script lang="ts" setup>
import './style/index.scss'
defineOptions({
    name: "EButton"
})
defineProps<{ a: string }>()
</script>