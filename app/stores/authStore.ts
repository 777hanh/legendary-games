import { defineStore, storeToRefs } from 'pinia';

interface IUser {
    username: string;
    avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
    const commonStore = useCommonStore();
    const { isGlobalLoading } = storeToRefs(commonStore);

    const user = ref<IUser | null>(null);
    const isAuthenticated = computed(() => !!user.value);

    const login = async (username: string, password: string) => {
        isGlobalLoading.value = true;

        console.log('User logged in:', user.value);
        console.log('Logging in with', username, password);
        // Simulate an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        user.value = { username };

        console.log('User logged in:', user.value);

        isGlobalLoading.value = false;
    };

    const logout = () => {
        user.value = null;
    };

    return { user, isAuthenticated, login, logout };
});
