<script setup lang="ts">
    const commonStore = useCommonStore();
    const { isGlobalLoading } = storeToRefs(commonStore);
</script>

<template>
    <loading-screen v-if="isGlobalLoading" />

    <template v-else><slot /></template>
</template>
