export default {
  title: 'Easyest',
  base: process.env.NODE_ENV === 'production' ? '/easyest/' : '/',
  themeConfig: {
    nav: [{ text: '文档', link: '/guild/introduce' }],
    sidebar: {
      '/': [
        {
          text: '引入',
          items: [
            {
              text: '介绍',
              link: '/guild/introduce'
            },
            {
              text: '快速开始',
              link: '/guild/quickstart'
            }
          ]
        },
        {
          text: '开发',
          items: [
            {
              text: '目录结构',
              link: '/develop/'
            },
            {
              text: '组件开发',
              link: '/develop/component'
            },
            {
              text: '全局组件',
              link: '/develop/global'
            },

            {
              text: '打包发布',
              link: '/develop/build'
            }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/qddidi/easyest' }]
  }
};
