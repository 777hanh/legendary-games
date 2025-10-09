<script setup lang="ts">
    const commonStore = useCommonStore();
    const { isGlobalLoading } = storeToRefs(commonStore);

    const handleHeaderHeightChange = (height: number) => {
        document.documentElement.style.setProperty(
            '--header-height',
            `${height}px`
        );
    };
</script>

<template>
    <loading-screen v-if="isGlobalLoading" />

    <template v-else>
        <!-- Header -->
        <header-app @height-change="handleHeaderHeightChange" />

        <!-- <div class="mt-[var(--header-height)]"><slot /></div> -->
        <div class="container mx-auto min-h-screen"><slot /></div>

        <!-- Footer -->
        <footer-app />
    </template>
</template>
