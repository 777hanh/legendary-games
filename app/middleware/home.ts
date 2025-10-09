export default defineNuxtRouteMiddleware((to, from) => {
    console.log('home-redirect middleware');

    if (to.path === '/home') {
        return navigateTo('/');
    }
});
