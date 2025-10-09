export default defineNuxtRouteMiddleware((to, from) => {
    console.log('🔒 Auth middleware - From:', from.path, 'To:', to.path);

    const authStore = useAuthStore();
    const { isAuthenticated } = storeToRefs(authStore);

    console.log('   isAuthenticated:', isAuthenticated.value);

    // If user is authenticated and trying to access login/register, redirect to home
    if (
        (to.path === '/login' || to.path === '/register') &&
        isAuthenticated.value
    ) {
        console.log('   ✅ Already logged in, redirecting to home');
        return navigateTo('/');
    }

    // If user is NOT authenticated and trying to access protected route, redirect to login
    if (to.path !== '/login' && !isAuthenticated.value) {
        console.log('   ❌ Not authenticated, redirecting to login');
        const currentPath = to.fullPath;
        const redirectParam = encodeURIComponent(currentPath);
        return navigateTo(`/login?redirect=${redirectParam}`);
    }

    console.log('   ✅ Auth check passed');
});
