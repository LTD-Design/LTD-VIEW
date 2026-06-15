import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LtdView',
  description: '可视化 BI 大屏报表生成系统 - 支持拖拽式布局、图表配置、数据绑定',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vite.svg' }]
  ],

  themeConfig: {
    logo: '/vite.svg',

    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/chart' },
      { text: 'API', link: '/api/data-source' },
      { text: '示例', link: '/examples/dashboard' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com/ltd-view/ltd-view' },
          { text: 'Gitee', link: 'https://gitee.com/ltd_1/ltd-view' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '项目介绍', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '功能特性', link: '/guide/features' },
            { text: '贡献指南', link: '/guide/contribute' }
          ]
        }
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '图表组件', link: '/components/chart' },
            { text: '表格组件', link: '/components/table' },
            { text: '表单组件', link: '/components/form' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: '数据源配置', link: '/api/data-source' },
            { text: '导入导出', link: '/api/export' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '分析仪表盘', link: '/examples/dashboard' },
            { text: '数据大屏', link: '/examples/bigscreen' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ltd-view/ltd-view' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2024-present LtdView'
    },

    editLink: {
      pattern: 'https://github.com/ltd-view/ltd-view/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  }
})
