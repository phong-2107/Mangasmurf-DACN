const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'COMIC-DATA MANAGER',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'main-page',
          title: 'Main Page',
          type: 'item',
          icon: 'feather icon-home',
          url: '/manager',
        },
        {
          id: 'comic-manager',
          title: 'Comic Manager',
          type: 'collapse',
          icon: 'feather icon-layers',
          children: [
            {
              id: 'comic-list',
              title: 'Comic Index',
              type: 'item',
              icon: 'feather icon-book',
              url: '/manager/comic/comic-index',
            },
            {
              id: 'comic-author',
              title: 'Author Index',
              type: 'item',
              icon: 'feather icon-edit',
              url: '/manager/comic/author-index',
            },
            {
              id: 'comic-gerne',
              title: 'Gerne Index',
              type: 'item',
              icon: 'feather icon-edit',
              url: '/manager/comic/gerne-index',
            },
            {
              id: 'chapter-list',
              title: 'Chapter Manager',
              type: 'item',
              icon: 'feather icon-layers',
              url: '/manager/comic/chapter',
            },
          ],
        },
      ],
    },
    {
      id: 'ui-element',
      title: 'UI ELEMENT',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'components',
          title: 'Components',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/manager/basic/button',
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/manager/basic/badges',
            },
            {
              id: 'breadcrumb',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/manager/basic/breadcrumb',
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/manager/basic/collapse',
            },
            {
              id: 'tabs-pills',
              title: 'Tabs & Pills',
              type: 'item',
              url: '/manager/basic/tabs',
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/manager/basic/typography',
            },
          ],
        },
      ],
    },
    {
      id: 'ui-element',
      title: 'Config website',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'components',
          title: 'Config',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/manager/basic/button',
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/manager/basic/badges',
            },
            {
              id: 'breadcrumb',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/manager/basic/breadcrumb',
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/manager/basic/collapse',
            },
            {
              id: 'tabs-pills',
              title: 'Tabs & Pills',
              type: 'item',
              url: '/manager/basic/tabs',
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/manager/basic/typography',
            },
          ],
        },
      ],
    },
    {
      id: 'pages',
      title: 'PAGES',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
          // badge: {
          //   title: 'New',
          //   type: 'label-danger',
          // },
          children: [
            {
              id: 'signup',
              title: 'Sign up',
              type: 'item',
              url: '/manager/auth/signup',
              target: true,
              breadcrumbs: false,
            },
            {
              id: 'signin',
              title: 'Sign in',
              type: 'item',
              url: '/manager/login',
              target: true,
              breadcrumbs: false,
            },
          ],
        },
      ],
    },
  ],
};

export default menuItems;
