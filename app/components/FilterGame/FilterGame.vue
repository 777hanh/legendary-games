<script setup lang="ts">
    const emit = defineEmits(['update:filters']);
    import _ from 'lodash';
    import type {
        IFiltersGame,
        statusGameBase,
        categoryGameBase
    } from '~/types';

    const filters = ref<IFiltersGame>({
        search: '',
        category: 'all',
        status: 'top-game'
    });

    const categories = ref<{ label: string; value: categoryGameBase }[]>([
        { label: 'Choose Category', value: 'all' },
        { label: 'Action', value: 'action' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'RPG', value: 'rpg' },
        { label: 'Strategy', value: 'strategy' }
    ]);

    const statuses = ref<{ label: string; value: statusGameBase }[]>([
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
        emit('update:filters', { ...filters.value });
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
            emit('update:filters', { ...filters.value });
        }
    );
</script>

<template>
    <div
        class="top container mx-auto flex items-center justify-between border-b border-gray-700 pb-4"
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
</template>
