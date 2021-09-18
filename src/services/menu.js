export async function getLeftMenuData() {
  return [
    {
      title: 'Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboardAlpha',
      icon: 'icmn icmn-meter',
      url: '/dashboard/alpha',
    },
  ]
}
