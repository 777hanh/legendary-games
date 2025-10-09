<script setup lang="ts">
    // Route: / (Home page - cần authentication)
    definePageMeta({
        middleware: ['auth']
    });

    const authStore = useAuthStore();
    const { logout } = authStore;
    const { user } = storeToRefs(authStore);
</script>

<template>
    <NuxtLayout>
        <div>
            <h1 class="text-3xl font-bold underline">Home Page</h1>
            <p v-if="user" class="mt-4">Welcome, {{ user.username }}!</p>

            <u-button
                @click="logout"
                class="mt-4 flex cursor-pointer items-center justify-center px-8 py-5 select-none"
            >
                <Icon
                    name="mdi-logout"
                    class="flex h-5 w-5 items-center justify-between"
                />
                Logout
            </u-button>
        </div>
    </NuxtLayout>
</template>
