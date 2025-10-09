import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', () => {
    const isGlobalLoading = ref(false);
    const isApiLoading = ref(false);

    const fetchAll = async () => {
        isGlobalLoading.value = true;

        const a = new Promise((resolve) => setTimeout(resolve, 1000));
        const b = new Promise((resolve) => setTimeout(resolve, 2000));
        const c = new Promise((resolve) => setTimeout(resolve, 3000));

        await Promise.all([a, b, c]).finally(() => {
            isGlobalLoading.value = false;
        });
    };

    return { isGlobalLoading, isApiLoading, fetchAll };
});
