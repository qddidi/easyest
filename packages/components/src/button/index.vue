<template>
    <button class="bt">测试按钮</button>
    <ElButton>测试按钮</ElButton>
</template>
<script lang="ts" setup>
import './style/index.scss'
import { ElButton } from 'element-plus';
defineOptions({
    name: "EButton"
})
defineProps<{ a: string }>()
</script>