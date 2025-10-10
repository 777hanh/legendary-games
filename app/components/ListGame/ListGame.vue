<script setup lang="ts">
    import _ from 'lodash';

    const isLoading = ref(false);

    // Fake getData
    const getData = async () => {
        isLoading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        isLoading.value = false;
    };

    const filters = ref({
        search: '',
        category: 'all',
        status: 'top-game'
    });

    const categories = ref([
        { label: 'All', value: 'all' },
        { label: 'Action', value: 'action' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'RPG', value: 'rpg' },
        { label: 'Strategy', value: 'strategy' }
    ]);

    const statuses = ref([
        { label: 'Top Games', value: 'top-game' },
        { label: 'Released', value: 'released' },
        { label: 'Upcoming', value: 'upcoming' }
    ]);

    const getClassActive = (value: string) => {
        return filters.value.status === value
            ? 'bg-primary text-white/80'
            : 'bg-transparent text-primary border border-primary hover:bg-primary/80 hover:text-white/80';
    };

    const handleChangeStatus = (value: typeof filters.value.status) => {
        filters.value.status = value;
    };

    const debouncedSearch = _.debounce(() => {
        if (!isLoading.value) {
            getData();
        }
    }, 700);

    // Watch only search input with debounce
    watch(
        () => filters.value.search,
        () => {
            debouncedSearch();
        }
    );

    // Watch category and status without debounce
    watch(
        () => [filters.value.category, filters.value.status],
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
        <div
            class="top flex items-center justify-between border-b border-gray-300 pb-4"
        >
            <!-- Filter -->
            <div class="filters flex space-x-4">
                <div class="status flex space-x-2">
                    <UButton
                        v-for="status in statuses"
                        :key="status.value"
                        @click="handleChangeStatus(status.value)"
                        class="cursor-pointer transition-colors duration-300"
                        :class="getClassActive(status.value)"
                        >{{ status.label }}</UButton
                    >
                </div>

                <select
                    v-model="filters.category"
                    class="border-primary/40 focus:border-primary/60 text-primary cursor-pointer rounded border px-2 py-2 focus:outline-none"
                >
                    <option
                        class="text-primary hover:bg-primary/80! bg-transparent hover:text-white/80!"
                        v-for="category in categories"
                        :key="category.value"
                        :value="category.value"
                    >
                        {{ category.label }}
                    </option>
                </select>
            </div>

            <!-- Search -->
            <form
                @submit.prevent=""
                class="search border-primary/70 flex items-center-safe justify-between gap-2 rounded border px-3 py-2"
            >
                <label for="search-games" class="flex items-center">
                    <Icon name="mdi-magnify" class="h-5 w-5 text-gray-400"
                /></label>

                <input
                    id="search-games"
                    v-model="filters.search"
                    type="text"
                    placeholder="Search games..."
                    class="flex-1 focus:outline-none"
                />
            </form>
        </div>

        <!-- List -->
    </div>
</template>
