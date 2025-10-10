/**
 * useScrollAnimation composable
 * Triggers animations when an element enters the viewport
 * Uses Intersection Observer API via @vueuse/core
 * @see https://vueuse.org/core/useIntersectionObserver/
 * @returns { targetElement, isVisible, stop }
 * - targetElement: ref to be bound to the element to observe
 * - isVisible: reactive boolean indicating if the element is in the viewport
 * - stop: function to stop observing the element
 * @param {Object} options - Configuration options
 * @param {Function} options.onEnter - Callback when the element enters the viewport
 * @param {Function} options.onExit - Callback when the element exits the viewport
 * @param {Boolean} options.once - If true, the animation triggers only once
 * @param {Number} options.threshold - Intersection threshold (default 0.1)
 * @param {String} options.rootMargin - Root margin for the observer (default "0px")
 * @example
 * <template>
 *   <div ref="targetElement" :class="{ 'animate-fade-in': isVisible }">
 *     Content to animate
 *   </div>
 * </template>
 * <script setup lang="ts">
 * import { useScrollAnimation } from '@/composables/useScrollAnimation';
 * const { targetElement, isVisible } = useScrollAnimation({
 *   onEnter: () => console.log('Entered viewport'),
 *   onExit: () => console.log('Exited viewport'),
 *   once: true,
 *   threshold: 0.1,
 *   rootMargin: '0px',
 * });
 */

import { useIntersectionObserver } from '@vueuse/core';

export function useScrollAnimation(
    options?: { [key: string]: any },
    targetElementProp?: HTMLElement | null
) {
    const targetElement = ref<HTMLElement | null>(targetElementProp || null);
    const isVisible = ref(false);

    const { stop } = useIntersectionObserver(
        targetElement,
        (entries) => {
            const [entry] = entries;

            if (entry && entry.isIntersecting) {
                isVisible.value = true;

                if (options?.onEnter) {
                    options.onEnter();
                }

                if (options?.once) {
                    stop(); // Stop observing if we only want the animation to trigger once
                }
            } else if (entry && !entry.isIntersecting) {
                isVisible.value = false;

                if (options?.onExit) {
                    options.onExit();
                }
            }
        },
        {
            threshold: options?.threshold ?? 0.1, // Trigger when 10% of the element is visible
            rootMargin: options?.rootMargin ?? '0px' // Margin around the root
        }
    );
    return { targetElement, isVisible, stop };
}
