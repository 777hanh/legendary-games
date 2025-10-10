<script setup lang="ts">
    definePageMeta({
        middleware: ['auth']
    });
</script>

<template>
    <NuxtLayout name="default">
        <!-- Hero section -->
        <HeroSection />

        <!-- Content -->
        <div class="container mx-auto py-8">
            <!-- List Games -->
            <list-game />

            <!-- News List -->
        </div>
    </NuxtLayout>
</template>
