<script setup lang="ts">
    const commonStore = useCommonStore();
    const { isGlobalLoading } = storeToRefs(commonStore);
</script>

<template>
    <loading-screen v-if="isGlobalLoading" />

    <template v-else>
        <div class="container mx-auto">
            <slot />
        </div>

        <!-- Footer -->
        <FooterApp />
    </template>
</template>
