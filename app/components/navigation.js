// Menu items. `icon` is a NavIcon name; `secondary` items move into the account menu on phones.
export function getMenu(variant, isAdmin) {
    if (variant === 'admin') {
        return [
            { icon: 'grid', title: 'Overview', link: '/admin-dashboard', exact: true },
            { icon: 'cases', title: 'Cases', link: '/admin-dashboard/cases', also: ['/admin-dashboard/create-new-case'] },
            { icon: 'bell', title: 'Announcements', short: 'News', link: '/admin-dashboard/announcements' },
            { icon: 'help', title: 'Help & FAQ', short: 'Help', link: '/admin-dashboard/faq' },
            { icon: 'users', title: 'Users', link: '/admin-dashboard/users' },
            { icon: 'eye', title: 'Student view', link: '/dashboard', secondary: true },
        ]
    }
    return [
        { icon: 'home', title: 'Dashboard', link: '/dashboard' },
        { icon: 'cases', title: 'Cases', link: '/cases' },
        { icon: 'chart', title: 'My attempts', short: 'Attempts', link: '/attempts' },
        { icon: 'bell', title: 'Announcements', short: 'News', link: '/announcements' },
        { icon: 'help', title: 'Help & FAQ', short: 'Help', link: '/help&faq' },
        ...(isAdmin ? [{ icon: 'shield', title: 'Admin', link: '/admin-dashboard', secondary: true }] : []),
    ]
}

export function isActive(pathname, item) {
    if (item.exact) return pathname === item.link
    const paths = [item.link, ...(item.also ?? [])]
    return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
