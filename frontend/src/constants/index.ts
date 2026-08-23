const navItems = [
    { to: '/', icon: '/icons/sparkles.svg', label: 'Generate', end: true },
    { to: '/feed', icon: '/icons/apps.svg', label: 'Feed' },
    { to: '/history', icon: '/icons/clock.svg', label: 'History' },
    { to: '/collections', icon: '/icons/folder.svg', label: 'My Collection' },
];

const RESOLUTIONS = [
    { label: '1024 x 1024 (1:1)', value: '1024x1024' },
    { label: '1152 x 896 (9:7)', value: '1152x896' },
    { label: '896 x 1152 (7:9)', value: '896x1152' },
    { label: '1344 x 768 (7:4)', value: '1344x768' },
    { label: '768 x 1344 (4:7)', value: '768x1344' },
];

const COLOR_SWATCHES = [
    { name: 'red', icon: '/icons/swatch-red.svg' },
    { name: 'orange', icon: '/icons/swatch-orange.svg' },
    { name: 'green', icon: '/icons/swatch-green.svg' },
    { name: 'blue', icon: '/icons/swatch-blue.svg' },
    { name: 'purple', icon: '/icons/swatch-purple.svg' },
    { name: 'white', icon: '/icons/swatch-white.svg' },
];

export {
    navItems,
    RESOLUTIONS,
    COLOR_SWATCHES
}