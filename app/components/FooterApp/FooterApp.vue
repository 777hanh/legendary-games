<script setup lang="ts">
    import { APP_NAME, footerMenuLeft, footerMenuRight } from '~/constants';
</script>

<template>
    <div class="footer-wrapper bg-black/70">
        <footer class="container mx-auto mt-8 py-4 text-white">
            <div class="grid-col-1 grid w-full md:grid-cols-3">
                <!-- LINKs -->
                <div
                    class="col-span-1 flex flex-col items-start justify-center space-y-4 md:col-span-2 md:space-y-6 md:space-x-6"
                >
                    <h3 class="mr-0! mb-4! text-2xl md:mb-6!">
                        {{ APP_NAME }}
                    </h3>
                    <div
                        class="flex w-full flex-col justify-center gap-8 md:flex-row md:justify-start md:gap-12"
                    >
                        <div class="flex w-1/4 flex-col space-y-2">
                            <template v-for="value in footerMenuLeft">
                                <NuxtLink
                                    v-if="value?.to"
                                    :key="value.title + value.to"
                                    :to="value.to"
                                    class="hover:underline"
                                    >{{ value.title }}</NuxtLink
                                >
                                <a
                                    v-else-if="value?.href"
                                    target="_blank"
                                    :key="value.title + value.href"
                                    :href="value.href"
                                    class="hover:underline"
                                    >{{ value.title }}</a
                                >
                                <UButton
                                    v-else-if="value?.click"
                                    :key="value.title + 'button'"
                                    @click.stop.prevent="value.click"
                                    variant="link"
                                    class="hover:underline"
                                >
                                    {{ value.title }}
                                </UButton>

                                <span v-else>{{ value.title }}</span>
                            </template>
                        </div>
                        <div class="flex w-1/4 flex-col space-y-2">
                            <template v-for="value in footerMenuRight">
                                <NuxtLink
                                    v-if="value?.to"
                                    :key="value.title + value.to"
                                    :to="value.to"
                                    class="hover:underline"
                                    >{{ value.title }}</NuxtLink
                                >
                                <a
                                    v-else-if="value?.href"
                                    target="_blank"
                                    :key="value.title + value.href"
                                    :href="value.href"
                                    class="hover:underline"
                                    >{{ value.title }}</a
                                >
                                <UButton
                                    v-else-if="value?.click"
                                    :key="value.title + 'button'"
                                    @click.stop.prevent="value.click"
                                    variant="link"
                                    class="hover:underline"
                                >
                                    {{ value.title }}
                                </UButton>

                                <span v-else>{{ value.title }}</span>
                            </template>
                        </div>
                    </div>

                    <h4
                        class="text-primary/50 mt-4 text-center text-xs md:mt-0 md:text-left"
                    >
                        Copyright &copy;
                        {{ new Date().getFullYear() }} Legendary Games
                    </h4>
                </div>

                <!-- SUBSCRIBER -->
                <div
                    class="col-span-1 flex flex-col items-start justify-start space-y-4 md:col-span-1"
                >
                    <SubscriberComponent />
                </div>
            </div>
        </footer>
    </div>
</template>
