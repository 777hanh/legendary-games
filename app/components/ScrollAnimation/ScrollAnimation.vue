<script setup lang="ts">
    const { targetElement: targetElement_1, isVisible: isVisible_1 } =
        useScrollAnimation({
            threshold: 0.5,
            once: false,
            rootMargin: '0px',
            onEnter: () => console.log('Entered viewport'),
            onExit: () => console.log('Exited viewport')
        });
</script>

<template class="">
    <div class="container mx-auto mb-10 bg-blue-500">
        <div class="min-h-[300vh] bg-black/15">
            <h2>Hello Guys!</h2>
            <Icon
                name="i-lucide:circle-dollar-sign"
                class="h-7 w-7 text-green-500"
            />
        </div>
        <p>Scroll down to see the target element</p>
        <div ref="targetElement_1" class="h-[300px] bg-red-500">
            <p
                v-if="targetElement_1"
                :class="{
                    'translate-y-4 opacity-0': !isVisible_1,
                    'translate-y-0 opacity-100': isVisible_1
                }"
                class="transition-all duration-700"
            >
                Target element is in the viewport
            </p>
        </div>
        <div class="min-h-[300vh] bg-black/15"></div>
    </div>
</template>
