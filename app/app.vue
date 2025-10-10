<script setup lang="ts">
    const commonStore = useCommonStore();
    const { fetchAll } = commonStore;

    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);

    watch(
        () => user.value,
        (newUser) => {
            if (!newUser) {
                // remove token from local storage
                localStorage.removeItem('auth_token');
                // reset auth store

                // redirect to login with param redirect current route
                const route = useRoute();
                const router = useRouter();
                router.replace(
                    '/login?redirect=' + encodeURIComponent(route.path)
                );
            }
        },
        { immediate: true }
    );

    onMounted(() => {
        fetchAll();
    });
</script>
<template>
    <!-- <scroll-animation /> -->
    <NuxtPage />
</template>
