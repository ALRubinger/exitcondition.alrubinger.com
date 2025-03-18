/**
 * https://starlight.astro.build/reference/configuration/#sidebaritem
 */
export default [
  {
    label: 'Starlight Components',
    autogenerate: { directory: 'components/starlight' },
    collapsed: true,
  },
  {
    label: 'Examples',
    items: [
      { slug: 'docs/examples/markdown' },
    ],
    collapsed: true,
  },
]