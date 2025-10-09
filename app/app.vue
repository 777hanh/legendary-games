<script setup lang="ts">
    const commonStore = useCommonStore();
    const { fetchAll } = commonStore;

    onMounted(() => {
        fetchAll();
    });
</script>
<template>
    <!-- <scroll-animation /> -->
    <NuxtPage />
</template>
