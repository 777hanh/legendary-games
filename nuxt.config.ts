// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['@/assets/css/main.css'],
    vite: {
        server: {
            watch: { usePolling: true },
            hmr: {
                host: 'localhost',
                port: 3000
            }
        }
    },
    ssr: process.env.NODE_ENV === 'production' ? false : true,
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
    }
});
