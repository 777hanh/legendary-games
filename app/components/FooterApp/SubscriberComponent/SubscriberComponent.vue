<script setup lang="ts">
    import { socialLinks } from '~/constants';

    const toast = useToast();

    const emailSubscription = ref('');

    const handleSubmit = () => {
        console.log(`Subscribed with email: ${emailSubscription.value}`);

        toast.add({
            title: 'Subscription Successful',
            color: 'success',
            description: `Subscribed with ${emailSubscription.value} successfully!`,
            duration: 3000
        });
    };
</script>

<template>
    <div
        class="flex w-full flex-col items-center justify-start space-y-4 md:col-span-2 md:items-start md:space-y-6 md:space-x-6"
    >
        <h3 class="text-lg font-bold uppercase">Get Legendary News</h3>
        <div
            class="flex w-full flex-col items-center justify-start space-y-1 md:items-start md:space-y-2"
        >
            <form
                class="flex w-full max-w-md items-center border border-[gray-300] px-1 py-1 text-[gray-300] md:px-3 md:py-2"
                @submit.prevent="handleSubmit"
            >
                <label
                    for="email-subscriber"
                    class="flex items-center justify-center"
                >
                    <Icon
                        name="material-symbols:mail-rounded"
                        class="h-4 w-8 text-[inherit] md:h-7 md:w-12"
                    />
                </label>
                <input
                    v-model="emailSubscription"
                    autocomplete="off"
                    id="email-subscriber"
                    type="email"
                    placeholder="Enter your email address..."
                    class="w-full px-2 text-base text-[inherit] placeholder:text-white/20 focus:outline-none"
                />
                <button
                    type="submit"
                    @click.stop.prevent="handleSubmit"
                    class="hover:text-primary flex cursor-pointer items-center justify-center text-[inherit] transition-colors duration-300 ease-in-out"
                >
                    <Icon
                        name="material-symbols:send"
                        class="h-6 w-6 md:h-8 md:w-8"
                    />
                </button>
            </form>

            <p class="text-sm text-[gray-300]">
                Don't worry, we hate spam as much as you do!
            </p>
        </div>

        <!-- Social Media Links -->
        <div class="flex space-x-4">
            <a
                v-for="(link, index) in socialLinks"
                :key="index"
                :href="Object.values(link)[0]"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-primary flex items-center justify-center rounded-full bg-white/10 p-1 text-[gray-300] transition-colors duration-300 ease-in-out md:p-2"
            >
                <Icon :name="link.icon" class="h-5 w-5" />
            </a>
        </div>
    </div>
</template>
