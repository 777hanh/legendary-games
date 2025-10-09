<script setup lang="ts">
    const commonStore = useCommonStore();
    const { fetchAll } = commonStore;

    onMounted(() => {
        fetchAll();
    });
</script>
<template>
    <!-- <scroll-animation /> -->
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
