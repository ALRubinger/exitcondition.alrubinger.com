/**
 * https://starlight.astro.build/reference/configuration/#sidebaritem
 */
export default [
  {
    label: 'Components',
    collapsed: false,
    items: [
      {
        label: 'Astro D2',
        autogenerate: { 
          directory: 'components/astro-d2',
          collapsed: true,
        },
        collapsed: true,
      },
      {
        label: 'Expressive Code',
        autogenerate: { 
          directory: 'components/expressive-code',
          collapsed: true,
        },
        collapsed: true,
      },
      {
        label: 'Starlight',
        autogenerate: { 
          directory: 'components/starlight',
          collapsed: true,
        },
        collapsed: true,
      },
    ]
  },
  {
    label: 'Examples',
    items: [
      { slug: 'docs/examples/markdown' },
    ],
    collapsed: true,
  },
]