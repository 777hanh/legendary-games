<script setup lang="ts">
    const authStore = useAuthStore();
    const route = useRoute();

    const { login } = authStore;
    const { user } = storeToRefs(authStore);

    // Custom login handler
    const handleLogin = async () => {
        console.log('� handleLogin called');

        // Gọi login từ store
        await login('777hanh', 'password');
    };

    watch(
        () => user.value,
        async (newValue) => {
            // Redirect sau khi login thành công
            if (newValue) {
                const redirect = (route.query.redirect as string) || '/';
                await navigateTo(redirect);
            } else {
                console.error('❌ Login failed - user is null');
            }
        },
        { immediate: true }
    );

    // QUAN TRỌNG: Login page KHÔNG được có middleware 'auth'
    definePageMeta({
        middleware: []
    });
</script>

<template>
    <NuxtLayout>
        <h1 class="text-3xl font-bold underline">Login Page</h1>
        <u-button
            @click="handleLogin"
            class="mt-4 flex cursor-pointer items-center justify-center px-8 py-5 select-none"
        >
            <Icon
                name="mdi-login"
                class="flex h-5 w-5 items-center justify-between"
            />
            Login
        </u-button>
    </NuxtLayout>
</template>
