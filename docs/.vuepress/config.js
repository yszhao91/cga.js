module.exports = {
  title: 'XtorCGA',
  description: 'Just playing around',
  head: [
    ['link', { rel: 'icon', href: './logo.png' }]
  ],
  host: 'localhost',
  // dest: './dist',
  // base: '/xtorcga/', // 这是部署到github相关的配置 下面会讲
  base: '/', // 这是部署到github相关的配置 下面会讲
  port: 8800,
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'xtorcga',
      description: '计算几何库（CGA)'
    },
    // '/EN/': {
    //   lang: 'en-US',
    //   title: 'XtorCGA',
    //   description: 'Vue large screen data display component library'
    // }
  },
  themeConfig: {
    locales: {
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        nav: [
          {
            text: '指南',
            link: '/guide/'
          },
          {
            text: 'Demo',
            link: '/demo/'
          },
          {
            text: '支持赞助',
            link: '/sponsor/'
          },

          {
            text: 'GitHub',
            items: [
              {
                text: '项目源码仓库',
                link: 'https://github.com/yszhao91/xtorcga'
              },
              {
                text: '国内镜像',
                link: 'https://gitee.com/Dcgraph/xtorcga'
              }
            ]
          }
        ],
        sidebar: {
          '/guide/': [
            '',
            'distPointAll',
            'distLineAll',
            'distRayAll',
            'distSegmentAll',
          ],
          '/demo/': [
            '',
            // "distPointAll"
          ]
        }
      },

      '/EN/': {
        selectText: 'Languages',
        label: 'English',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'GitHub',
            items: [
              {
                text: '项目源码仓库',
                link: 'https://github.com/jiaming743/XtorCGA'
              },
              {
                text: '文档及Demo源码仓库',
                link: 'https://github.com/jiaming743/XtorCGA.jiaminghi.com'
              }
            ]
          }
        ],
        sidebar: {
          '/EN/guide/': [
            ''
          ]
        }
      }
    }
  }
}
