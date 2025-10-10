<script setup lang="ts">
    import { APP_NAME, footerMenuLeft, footerMenuRight } from '~/constants';

    const classFooterLink =
        'text-white/70 underline-offset-2 transition-all duration-300 hover:text-white after:content-[""] after:block after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:rounded';
</script>

<template>
    <div class="footer-wrapper bg-black/70">
        <footer class="container mx-auto mt-8 py-4 text-white">
            <div class="grid-col-1 grid w-full md:grid-cols-3">
                <!-- LINKs -->
                <div
                    class="col-span-1 flex flex-col items-start justify-center space-y-4 md:col-span-2 md:space-y-6 md:space-x-6"
                >
                    <h3
                        class="mr-0! mb-4! w-full text-center text-2xl font-bold sm:text-start md:mb-6!"
                    >
                        {{ APP_NAME }}
                    </h3>
                    <div
                        class="sm-gap-10 flex w-full flex-col justify-center gap-8 sm:flex-row sm:justify-start md:gap-12"
                    >
                        <div
                            class="flex w-full flex-col items-center space-y-2 sm:w-2/4 sm:items-start md:w-1/4"
                        >
                            <template v-for="value in footerMenuLeft">
                                <NuxtLink
                                    v-if="value?.to"
                                    :key="value.title + value.to"
                                    :to="value.to"
                                    :class="classFooterLink"
                                    >{{ value.title }}</NuxtLink
                                >
                                <a
                                    v-else-if="value?.href"
                                    target="_blank"
                                    :key="value.title + value.href"
                                    :href="value.href"
                                    :class="classFooterLink"
                                    >{{ value.title }}</a
                                >
                                <UButton
                                    v-else-if="value?.click"
                                    :key="value.title + 'button'"
                                    @click.stop.prevent="value.click"
                                    variant="link"
                                    :class="classFooterLink"
                                >
                                    {{ value.title }}
                                </UButton>

                                <span v-else>{{ value.title }}</span>
                            </template>
                        </div>
                        <div
                            class="flex w-full flex-col items-center space-y-2 sm:w-2/4 sm:items-start md:w-1/4"
                        >
                            <template v-for="value in footerMenuRight">
                                <NuxtLink
                                    v-if="value?.to"
                                    :key="value.title + value.to"
                                    :to="value.to"
                                    :class="classFooterLink"
                                    >{{ value.title }}</NuxtLink
                                >
                                <a
                                    v-else-if="value?.href"
                                    target="_blank"
                                    :key="value.title + value.href"
                                    :href="value.href"
                                    :class="classFooterLink"
                                    >{{ value.title }}</a
                                >
                                <UButton
                                    v-else-if="value?.click"
                                    :key="value.title + 'button'"
                                    @click.stop.prevent="value.click"
                                    variant="link"
                                    :class="classFooterLink"
                                >
                                    {{ value.title }}
                                </UButton>

                                <span v-else>{{ value.title }}</span>
                            </template>
                        </div>
                    </div>

                    <h4
                        class="text-primary/50 mt-4 hidden text-center text-xs md:mt-0 md:flex md:text-left"
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

                <h4
                    class="text-primary/50 mt-4 text-center text-xs md:mt-0 md:hidden md:text-left"
                >
                    Copyright &copy;
                    {{ new Date().getFullYear() }} Legendary Games
                </h4>
            </div>
        </footer>
    </div>
</template>
