<script setup lang="ts">
    import _ from 'lodash';

    const isLoading = ref(false);

    const filters = ref({
        search: '',
        category: 'all',
        status: 'top-game'
    });

    // Fake getData
    const getData = async () => {
        isLoading.value = true;
        console.log('Fetching data with filter:', filters.value);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        isLoading.value = false;
    };

    const handleGetData = (data: any) => {
        if (!isLoading.value) {
            getData();
        }
    };

    // Watch category and status without debounce
    watch(
        () => filters.value,
        () => {
            if (!isLoading.value) {
                getData();
            }
        }
    );

    onMounted(() => {
        getData();
    });
</script>

<template>
    <div class="list-game">
        <div
            v-if="isLoading"
            class="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/10 backdrop-blur-md transition-opacity"
        >
            <Icon
                name="mdi-loading"
                class="text-primary h-12 w-12 animate-spin"
            />
        </div>

        <!-- Top -->
        <filter-game
            v-model:filters="filters"
            @update:filters="handleGetData"
        />

        <!-- List -->
    </div>
</template>
