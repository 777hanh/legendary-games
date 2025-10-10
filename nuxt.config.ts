// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['@/assets/css/main.css'],

    ssr: false,
    modules: ['@nuxt/image', '@nuxt/ui', '@nuxt/scripts', '@pinia/nuxt'],
    components: {
        dirs: [
            {
                path: '~/components',
                extensions: ['vue'],
                pathPrefix: false
            }
        ]
    },

    imports: {
        dirs: [
            'stores',
            'composables',
            'utils',
            'components',
            'components/**/*'
        ]
    },
    colorMode: {
        preference: 'dark', // luôn ưu tiên dark mode
        fallback: 'dark', // nếu không xác định được thì vẫn dark
        classSuffix: '', // không thêm "-dark" hay "-light" vào class
        storageKey: 'color-mode', // tên key localStorage, tuỳ chọn
        disableTransition: true // tắt hiệu ứng chuyển đổi
    }
});
