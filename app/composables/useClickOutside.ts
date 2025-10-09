import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function useClickOutside(
    elementRef: Ref<HTMLElement | null>,
    callback: () => void
) {
    const handleClickOutside = (event: MouseEvent) => {
        if (
            elementRef.value &&
            !elementRef.value.contains(event.target as Node)
        ) {
            callback();
        }
    };

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    return {
        handleClickOutside
    };
}
