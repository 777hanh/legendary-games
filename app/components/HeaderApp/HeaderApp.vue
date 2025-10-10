<script setup lang="ts">
    import {
        menuList,
        userMenuActions,
        type MenuItem
    } from '~/constants/menuList';

    const emit = defineEmits<{
        (e: 'height-change', height: number): void;
    }>();

    const authStore = useAuthStore();
    const { logout } = authStore;
    const { user, isAuthenticated } = storeToRefs(authStore);

    const isMenuOpen = ref(false);
    const isNotificationOpen = ref(false);
    const isProfileOpen = ref(false);
    const isScrolled = ref(false);
    const isHeaderVisible = ref(true);

    // State for hover dropdowns on desktop
    const openDropdownIndex = ref<number | null>(null);
    const dropdownWrappers = ref<Map<number, HTMLElement>>(new Map());

    interface Notification {
        id: number;
        title: string;
        message: string;
        avatar?: string;
    }

    const headerRef = ref<HTMLElement | null>(null);
    const profileMenu = ref<HTMLElement | null>(null);
    const profileMenuWrapper = ref<HTMLElement | null>(null);
    const notificationPanel = ref<HTMLElement | null>(null);
    const mobileMenuRef = ref<HTMLElement | null>(null);
    const burgerButtonRef = ref<HTMLElement | null>(null);

    // Track scroll direction for auto-hide header
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Show header when at top
        if (currentScrollY < 10) {
            isHeaderVisible.value = true;
            isScrolled.value = false;
        } else {
            isScrolled.value = true;

            // Hide header when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                isHeaderVisible.value = false;
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                isHeaderVisible.value = true;
            }
        }

        lastScrollY = currentScrollY;
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    };

    // Set dropdown wrapper ref
    const setDropdownRef = (index: number, el: any) => {
        if (el) {
            dropdownWrappers.value.set(index, el);
        }
    };

    // Prevent body scroll when mobile menu is open
    watch(isMenuOpen, (newValue) => {
        if (typeof window !== 'undefined') {
            if (newValue) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    });

    function onAfterEnter(el: Element) {
        (el as HTMLElement).style.position = 'absolute';
    }
    function onAfterLeave(el: Element) {
        (el as HTMLElement).style.position = '';
    }

    const notifications = ref<Notification[]>([
        {
            id: 1,
            title: 'Cristofer Dorwart',
            message: 'Winners The Last Game',
            avatar: ''
        },
        {
            id: 2,
            title: 'Piter Maio',
            message: 'Accept your challenge',
            avatar: ''
        },
        { id: 3, title: 'Copa Punto Gamer', message: 'Tournament start' },
        { id: 4, title: 'Daily Bonus', message: 'Tournament start' }
    ]);

    // Convert menuList children to UDropdownMenu format
    const getDropdownItems = (children?: MenuItem[]) => {
        if (!children) return [];
        return [
            children.map((child) => ({
                label: child.title,
                icon: child.icon,
                click: () => {
                    if (child.url) navigateTo(child.url);
                    else if (child.to) useRouter().push(child.to);
                    else if (child.scrollTo) scrollToSection(child.scrollTo);
                }
            }))
        ];
    };

    const activeSection = ref<string>('hero');

    function linkClass(id: string) {
        return [
            'relative transition-colors',
            activeSection.value === id
                ? 'text-primary font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary after:rounded'
                : 'hover:text-primary'
        ];
    }

    function scrollToSection(id: string) {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
        isMenuOpen.value = false;
    }

    function handleMenuItemClick(item: MenuItem) {
        if (item.url) {
            navigateTo(item.url);
        } else if (item.to) {
            useRouter().push(item.to);
        } else if (item.scrollTo) {
            scrollToSection(item.scrollTo);
        }
        // Close mobile menu after navigation
        isMenuOpen.value = false;
    }

    // Hover handlers for custom dropdowns - no flicker
    function handleDropdownMouseEnter(index: number) {
        openDropdownIndex.value = index;
    }

    function handleDropdownMouseLeave(index: number) {
        openDropdownIndex.value = null;
    }

    // Click outside for dropdowns
    function setupDropdownClickOutside() {
        dropdownWrappers.value.forEach((el, index) => {
            useClickOutside(ref(el), () => {
                if (openDropdownIndex.value === index) {
                    openDropdownIndex.value = null;
                }
            });
        });
    }

    function handleUserAction(action: any) {
        if (action.click === 'logout') {
            logout();
        } else if (action.to) {
            useRouter().push(action.to);
        }
        isProfileOpen.value = false;
    }

    // Click outside handlers
    useClickOutside(profileMenuWrapper, () => {
        isProfileOpen.value = false;
    });

    useClickOutside(notificationPanel, () => {
        isNotificationOpen.value = false;
    });

    // Custom click outside for mobile menu that excludes burger button
    onMounted(() => {
        // Setup scroll listener
        window.addEventListener('scroll', onScroll, { passive: true });

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedInsideMenu = mobileMenuRef.value?.contains(target);
            const clickedBurger = burgerButtonRef.value?.contains(target);

            if (isMenuOpen.value && !clickedInsideMenu && !clickedBurger) {
                isMenuOpen.value = false;
            }
        };

        document.addEventListener('click', handleClickOutside);

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', onScroll);
        });
    });

    watch(
        () => headerRef.value,
        (newVal) => {
            if (newVal) {
                emit('height-change', newVal.offsetHeight);
            }
        }
    );

    onMounted(() => {
        setupDropdownClickOutside();
    });
</script>

<template>
    <header
        ref="headerRef"
        class="app-header z-50 mx-auto w-full"
        :class="{
            'is-scrolled': isScrolled,
            'header-hidden': !isHeaderVisible
        }"
        data-header
    >
        <div class="container mx-auto px-4 py-3 md:px-6 lg:px-8">
            <div class="flex w-full items-center justify-between">
                <!-- Left: Logo + Mobile Toggle -->
                <div
                    class="header-left flex items-center gap-4"
                    data-header-left
                >
                    <div ref="burgerButtonRef">
                        <UButton
                            variant="ghost"
                            icon="i-tabler-menu-2"
                            class="burger-menu flex lg:hidden!"
                            @click="isMenuOpen = !isMenuOpen"
                        />
                    </div>
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <LazyNuxtImg
                            src="/images/logo.png"
                            alt="Logo"
                            class="w-10 object-contain"
                        />
                        <span class="text-xl font-bold">Legendary</span>
                    </NuxtLink>

                    <!-- Center: Desktop Navigation -->
                    <nav
                        class="main-nav ml-6 hidden items-center gap-6 lg:flex"
                        data-main-nav
                    >
                        <ul class="flex flex-row gap-6">
                            <li v-for="(item, index) in menuList" :key="index">
                                <!-- Desktop: Custom Dropdown with hover -->
                                <div
                                    v-if="item.children"
                                    :ref="(el) => setDropdownRef(index, el)"
                                    class="dropdown-wrapper relative"
                                    @mouseenter="
                                        handleDropdownMouseEnter(index)
                                    "
                                    @mouseleave="
                                        handleDropdownMouseLeave(index)
                                    "
                                >
                                    <button
                                        class="flex cursor-pointer items-center gap-1"
                                        :class="linkClass(item.scrollTo || '')"
                                    >
                                        {{ item.title }}
                                        <UIcon
                                            v-if="item.icon"
                                            :name="item.icon"
                                            class="text-sm transition-transform"
                                            :class="{
                                                'rotate-180':
                                                    openDropdownIndex === index
                                            }"
                                        />
                                    </button>

                                    <!-- Invisible bridge to prevent gap -->
                                    <div
                                        v-if="openDropdownIndex === index"
                                        class="absolute top-full left-0 h-2 w-full"
                                    ></div>

                                    <!-- Dropdown Content -->
                                    <Transition name="dropdown-fade">
                                        <div
                                            v-if="openDropdownIndex === index"
                                            class="absolute top-full left-0 z-50 mt-2 min-w-[200px] rounded-lg border border-white/10 bg-gray-900/95 p-2 shadow-xl backdrop-blur-sm"
                                        >
                                            <button
                                                v-for="(
                                                    child, childIdx
                                                ) in item.children"
                                                :key="childIdx"
                                                class="hover:text-primary flex w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10"
                                                @click="
                                                    handleMenuItemClick(child)
                                                "
                                            >
                                                <UIcon
                                                    v-if="child.icon"
                                                    :name="child.icon"
                                                    class="text-base"
                                                />
                                                <span class="text-start">{{
                                                    child.title
                                                }}</span>
                                            </button>
                                        </div>
                                    </Transition>
                                </div>

                                <!-- Simple link (no children) -->
                                <button
                                    v-else
                                    class="cursor-pointer"
                                    :class="linkClass(item.scrollTo || '')"
                                    @click="handleMenuItemClick(item)"
                                >
                                    {{ item.title }}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                <!-- Right: Actions -->
                <div
                    v-if="isAuthenticated"
                    class="header-actions flex items-center gap-3"
                    data-header-actions
                >
                    <!-- <UButton
                        variant="ghost"
                        icon="i-tabler-bell"
                        class="cursor-pointer rounded-full"
                        @click="isNotificationOpen = !isNotificationOpen"
                    /> -->
                    <div ref="profileMenuWrapper" class="relative">
                        <UButton
                            variant="ghost"
                            class="cursor-pointer rounded-full"
                            @click="isProfileOpen = !isProfileOpen"
                        >
                            <div class="flex items-center gap-2">
                                <UAvatar
                                    class="rounded-full"
                                    :src="user?.avatar || ''"
                                    alt="Profile"
                                    width="40"
                                    height="40"
                                />
                                <span class="hidden lg:inline"
                                    >David Malan</span
                                >
                                <UIcon
                                    name="i-tabler-chevron-down"
                                    class="hidden lg:block"
                                />
                            </div>
                        </UButton>

                        <Transition
                            name="slide-right"
                            @after-enter="onAfterEnter"
                            @after-leave="onAfterLeave"
                        >
                            <div
                                v-if="isProfileOpen"
                                ref="profileMenu"
                                class="top-full right-0 z-10 mt-2 min-w-40 rounded bg-gray-900 p-2 will-change-auto"
                            >
                                <template
                                    v-for="(action, idx) in userMenuActions"
                                    :key="idx"
                                >
                                    <NuxtLink
                                        v-if="action.to"
                                        :to="action.to"
                                        class="flex cursor-pointer items-center rounded px-3 py-2 hover:bg-gray-800"
                                        @click="isProfileOpen = false"
                                    >
                                        <Icon
                                            :name="action.icon"
                                            class="mr-2 flex h-4 w-4"
                                        />
                                        {{ action.label }}
                                    </NuxtLink>
                                    <button
                                        v-else
                                        class="flex w-full cursor-pointer items-center rounded px-3 py-2 text-left hover:bg-gray-800"
                                        @click="
                                            handleUserAction({
                                                click: action.click
                                            })
                                        "
                                    >
                                        <Icon
                                            v-if="action.icon"
                                            :name="action.icon"
                                            class="mr-2 flex h-4 w-4"
                                        />
                                        {{ action.label }}
                                    </button>
                                </template>
                            </div>
                        </Transition>
                    </div>
                </div>

                <div v-else>
                    <NuxtLink
                        to="/login"
                        class="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white"
                    >
                        <Icon name="i-tabler-login" class="mr-2 inline" />
                        Login</NuxtLink
                    >
                </div>
            </div>
        </div>

        <!-- Mobile Menu - Teleported to body -->
        <Teleport to="body">
            <!-- Mobile Menu Overlay -->
            <Transition name="overlay-fade">
                <div
                    v-if="isMenuOpen"
                    class="mobile-overlay fixed inset-0 z-[90] bg-black/70 lg:hidden"
                    @click="isMenuOpen = false"
                ></div>
            </Transition>

            <!-- Mobile Menu Sidebar -->
            <Transition name="slide-from-right">
                <nav
                    v-if="isMenuOpen"
                    ref="mobileMenuRef"
                    class="mobile-sidebar fixed top-0 right-0 bottom-0 z-[100] w-80 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl lg:hidden"
                >
                    <!-- Close Button -->
                    <div
                        class="mb-6 flex items-center justify-between border-b border-white/10 p-6 pb-4"
                    >
                        <span class="text-xl font-bold">Menu</span>
                        <UButton
                            variant="ghost"
                            icon="i-tabler-x"
                            class="cursor-pointer"
                            @click.stop="isMenuOpen = false"
                        />
                    </div>

                    <!-- Mobile Menu Items -->
                    <div class="px-6 pb-6">
                        <ul class="space-y-2">
                            <li v-for="(item, index) in menuList" :key="index">
                                <!-- Mobile: Expandable menu -->
                                <div v-if="item.children">
                                    <details class="group">
                                        <summary
                                            class="hover:text-primary flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-white/10"
                                        >
                                            <span class="font-medium">{{
                                                item.title
                                            }}</span>
                                            <UIcon
                                                name="i-tabler-chevron-down"
                                                class="text-sm transition-transform group-open:rotate-180"
                                            />
                                        </summary>
                                        <ul
                                            class="border-primary/30 mt-2 space-y-1 border-l-2 pl-4"
                                        >
                                            <li
                                                v-for="(
                                                    child, childIndex
                                                ) in item.children"
                                                :key="childIndex"
                                            >
                                                <button
                                                    class="hover:text-primary flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10"
                                                    @click="
                                                        handleMenuItemClick(
                                                            child
                                                        )
                                                    "
                                                >
                                                    <UIcon
                                                        v-if="child.icon"
                                                        :name="child.icon"
                                                        class="text-base"
                                                    />
                                                    {{ child.title }}
                                                </button>
                                            </li>
                                        </ul>
                                    </details>
                                </div>

                                <!-- Simple link (no children) -->
                                <button
                                    v-else
                                    class="hover:text-primary flex w-full cursor-pointer items-center rounded-lg px-4 py-3 font-medium transition-colors hover:bg-white/10"
                                    @click="handleMenuItemClick(item)"
                                >
                                    {{ item.title }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </Transition>
        </Teleport>

        <!-- Notification Panel -->
        <div
            v-if="isNotificationOpen"
            ref="notificationPanel"
            class="absolute top-16 right-4 z-50 w-80 rounded bg-gray-900 p-4 shadow-lg"
        >
            <div class="space-y-4">
                <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-800"
                >
                    <UAvatar
                        v-if="notification.avatar"
                        :src="notification.avatar"
                        size="sm"
                    />
                    <div>
                        <p class="font-medium">{{ notification.title }}</p>
                        <p class="text-sm text-gray-400">
                            {{ notification.message }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
    .app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        backdrop-filter: blur(14px);
        background: transparent;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        transition:
            background 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease,
            transform 0.3s ease-in-out;
    }

    .app-header.header-hidden {
        transform: translateY(-100%);
    }
    .app-header.is-scrolled {
        background: rgba(10, 14, 20, 0.92);
        box-shadow:
            0 6px 24px -8px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.08);
    }
    .main-nav a,
    .main-nav button {
        position: relative;
        font-weight: 500;
    }
    .main-nav a::after,
    .main-nav button::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -6px;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #00c6ff, #0072ff);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
        border-radius: 2px;
    }
    .main-nav a:hover::after,
    .main-nav a.router-link-active::after,
    .main-nav button:hover::after {
        transform: scaleX(1);
    }
    .main-nav .group:hover > button::after {
        transform: scaleX(1);
    }
    .main-nav ul li {
        list-style: none;
    }

    /* Dropdown */
    .main-nav .group ul {
        animation: fadeSlide 0.35s ease forwards;
        transform-origin: top center;
    }
    @keyframes fadeSlide {
        from {
            opacity: 0;
            transform: translateY(-6px) scale(0.96);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Dropdown wrapper - ensure no gap */
    .dropdown-wrapper {
        /* Add extra padding to capture mouse events */
        /* padding-bottom: 8px; */
    }

    /* Custom Dropdown Transitions */
    .dropdown-fade-enter-active,
    .dropdown-fade-leave-active {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .dropdown-fade-enter-from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
    }
    .dropdown-fade-leave-to {
        opacity: 0;
        transform: translateY(-4px) scale(0.98);
    }
    .dropdown-fade-enter-to,
    .dropdown-fade-leave-from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    /* Mobile dropdown styles */
    .main-nav details summary {
        list-style: none;
        position: relative;
        font-weight: 500;
    }
    .main-nav details summary::-webkit-details-marker {
        display: none;
    }
    .main-nav details[open] summary {
        color: var(--color-primary);
    }
    .main-nav details ul {
        animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Notification panel */
    [data-header] .absolute.bg-gray-900 {
        animation: panelIn 0.4s ease;
    }
    @keyframes panelIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Buttons refinement */
    .header-actions .rounded-full {
        transition:
            background 0.3s ease,
            color 0.3s ease;
    }
    .header-actions .rounded-full:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    /* Avatar */
    .header-actions img {
        border: 2px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 4px 10px -3px rgba(0, 0, 0, 0.5);
    }

    /* Mobile Menu Overlay */
    .mobile-overlay {
        will-change: opacity;
    }

    .overlay-fade-enter-active {
        transition: opacity 0.25s ease-out;
    }

    .overlay-fade-leave-active {
        transition: opacity 0.2s ease-in;
    }

    .overlay-fade-enter-from,
    .overlay-fade-leave-to {
        opacity: 0;
    }

    /* Mobile Sidebar Slide Transition */
    .slide-from-right-enter-active {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slide-from-right-leave-active {
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.6, 1);
    }

    .slide-from-right-enter-from {
        transform: translateX(100%);
    }

    .slide-from-right-leave-to {
        transform: translateX(100%);
    }

    /* Mobile Sidebar Styling */
    .mobile-sidebar {
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
        will-change: transform;
        -webkit-overflow-scrolling: touch;
    }

    /* Custom scrollbar for mobile sidebar */
    .mobile-sidebar::-webkit-scrollbar {
        width: 6px;
    }

    .mobile-sidebar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }

    .mobile-sidebar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }

    .mobile-sidebar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Mobile sidebar details/summary styling */
    .mobile-sidebar details summary {
        list-style: none;
        will-change: background-color, color;
    }

    .mobile-sidebar details summary::-webkit-details-marker {
        display: none;
    }

    .mobile-sidebar details[open] > summary {
        color: var(--color-primary);
        background: rgba(255, 255, 255, 0.05);
    }

    .mobile-sidebar details ul {
        animation: slideDown 0.25s ease;
    }

    .mobile-sidebar button {
        will-change: background-color, color;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Burger menu visibility */
    .burger-menu {
        display: none;
    }

    @media (max-width: 1023px) {
        .burger-menu {
            display: flex !important;
        }
    }

    /* transition classes */
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: all 0.25s ease;
        will-change: transform, opacity;
        position: absolute;
    }

    .slide-right-enter-from,
    .slide-right-leave-to {
        opacity: 0 !important;
        transform: translateX(100%) !important;
        position: absolute;
    }
    .slide-right-enter-to,
    .slide-right-leave-from {
        opacity: 1 !important;
        position: absolute;
        transform: translateX(0) !important;
    }
</style>
