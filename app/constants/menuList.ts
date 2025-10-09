import { routes } from './routes';

export interface MenuItem {
    title: string;
    url?: string;
    scrollTo?: string;
    icon?: string;
    children?: MenuItem[];
}

export const menuList: MenuItem[] = [
    {
        title: 'Home',
        scrollTo: 'hero'
    },
    {
        title: 'Tournament',
        icon: 'i-tabler-chevron-down',
        children: [
            {
                title: 'Browse Tournaments',
                url: '/tournaments',
                icon: 'i-tabler-trophy'
            },
            {
                title: 'Create Tournament',
                url: '/tournaments?new=1',
                icon: 'i-tabler-plus'
            }
        ]
    },
    {
        title: 'Games',
        scrollTo: 'featured-games'
    },
    {
        title: 'Teams',
        scrollTo: 'top-teams'
    },
    {
        title: 'Tournaments',
        scrollTo: 'tournaments'
    },
    {
        title: 'Players',
        scrollTo: 'top-players'
    },
    {
        title: 'Pages',
        icon: 'i-tabler-chevron-down',
        children: [
            {
                title: 'FAQ',
                url: '/faq',
                icon: 'i-tabler-help'
            },
            {
                title: 'Terms',
                url: '/terms',
                icon: 'i-tabler-file-description'
            },
            {
                title: 'Error Page',
                url: '/error',
                icon: 'i-tabler-alert-triangle'
            },
            {
                title: 'Profile',
                url: '/profile',
                icon: 'i-tabler-user'
            }
        ]
    }
];

export const userMenuActions = [
    {
        label: 'Profile',
        icon: 'i-heroicons-user',
        to: '/profile'
    },
    {
        label: 'Settings',
        icon: 'i-heroicons-cog-8-tooth',
        to: '/settings'
    },
    {
        label: 'Logout',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        click: 'logout'
    }
];
