<template>
    <button class="aa">Icon</button>

</template>
<script lang="ts" setup>
import './style/index.scss'
defineOptions({
    name: "EButton"
})
defineProps<{ a: string }>()
</script>