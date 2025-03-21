/**
 * https://starlight.astro.build/reference/configuration/#sidebaritem
 */
export default [
  {
    label: 'Components',
    collapsed: false,
    items: [
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