<script setup lang="ts">
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import 'swiper/css/navigation';
    import 'swiper/css/effect-fade';
    import {
        Pagination,
        Navigation,
        Autoplay,
        EffectFade
    } from 'swiper/modules';

    const slides = [
        {
            id: 1,
            title: 'Epic Battle Royale',
            subtitle: 'Join the ultimate gaming experience',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80',
            buttonText: 'Play Now'
        },
        {
            id: 2,
            title: 'Tournament Season',
            subtitle: 'Compete for glory and prizes',
            image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920&q=80',
            buttonText: 'Join Tournament'
        },
        {
            id: 3,
            title: 'New Champions',
            subtitle: 'Discover powerful heroes',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&q=80',
            buttonText: 'Explore'
        }
    ];

    const modules = [Pagination, Navigation, Autoplay, EffectFade];
</script>

<template>
    <section
        class="hero-section relative aspect-[16/9] h-auto max-h-[100vh] w-full overflow-hidden md:max-h-[90vh]"
    >
        <Swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="0"
            :loop="true"
            :autoplay="{
                delay: 5000,
                disableOnInteraction: false
            }"
            :pagination="{
                clickable: true,
                dynamicBullets: true
            }"
            :navigation="false"
            :effect="'fade'"
            :fadeEffect="{
                crossFade: true
            }"
            class="hero-swiper h-full w-full"
        >
            <SwiperSlide
                v-for="slide in slides"
                :key="slide.id"
                class="relative"
            >
                <div class="slide-content relative h-full w-full">
                    <!-- Background Image -->
                    <div class="absolute inset-0">
                        <img
                            :src="slide.image"
                            :alt="slide.title"
                            class="h-full w-full object-cover"
                        />
                        <!-- Overlay Gradient -->
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
                        ></div>
                    </div>

                    <!-- Content -->
                    <div
                        class="relative z-10 container mx-auto flex h-full items-center"
                    >
                        <div class="container mx-auto max-w-7xl">
                            <div class="max-w-2xl space-y-6">
                                <h1
                                    class="text-5xl leading-tight font-bold text-white md:text-6xl lg:text-7xl"
                                >
                                    {{ slide.title }}
                                </h1>
                                <p class="text-xl text-gray-300 md:text-2xl">
                                    {{ slide.subtitle }}
                                </p>
                                <div class="flex gap-4">
                                    <UButton
                                        size="xl"
                                        class="bg-primary hover:bg-primary/90 px-8 py-4 text-lg font-semibold"
                                    >
                                        {{ slide.buttonText }}
                                    </UButton>
                                    <UButton
                                        size="xl"
                                        variant="outline"
                                        class="border-white/30 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10"
                                    >
                                        Learn More
                                    </UButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>

        <!-- Scroll Down Indicator -->
        <!-- <div
            class="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce"
        >
            <UIcon
                name="i-tabler-chevron-down"
                class="text-4xl text-white/70"
            />
        </div> -->
    </section>
</template>

<style scoped>
    .hero-section {
        position: relative;
    }

    .hero-swiper :deep(.swiper-pagination) {
        bottom: 2rem;
    }

    .hero-swiper :deep(.swiper-pagination-bullet) {
        width: 12px;
        height: 12px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 1;
        transition: all 0.3s ease;
    }

    .hero-swiper :deep(.swiper-pagination-bullet-active) {
        background: #fff;
        width: 32px;
        border-radius: 6px;
    }

    .hero-swiper :deep(.swiper-button-next),
    .hero-swiper :deep(.swiper-button-prev) {
        color: #fff;
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .hero-swiper :deep(.swiper-button-next):hover,
    .hero-swiper :deep(.swiper-button-prev):hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    .hero-swiper :deep(.swiper-button-next::after),
    .hero-swiper :deep(.swiper-button-prev::after) {
        font-size: 20px;
        font-weight: bold;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .hero-swiper :deep(.swiper-button-next),
        .hero-swiper :deep(.swiper-button-prev) {
            display: none;
        }
    }

    /* Animations */
    .slide-content h1 {
        animation: slideInUp 0.8s ease-out;
    }

    .slide-content p {
        animation: slideInUp 0.8s ease-out 0.2s both;
    }

    .slide-content .flex {
        animation: slideInUp 0.8s ease-out 0.4s both;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
