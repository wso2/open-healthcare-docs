const { config } = require("vuepress-theme-hope");
const { description } = require('../../package')

module.exports = config({
  
  base: '/',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Learning Portal',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    Navbar: true,
    logo: '/assets/img/wso2-open-healthcare-logo.png',
    sidebar: [
       ['/','Home'],
       {
        title: 'Getting Started',
       path: '/getting-started/overview',
       collapsable: true, // optional, defaults to true
       children: [
         ['/getting-started/overview','Overview'],
         ['/getting-started/quick-start-guide', 'Quick Start Guide']
       ]
      },
      ['/concepts/concepts','Concepts'],    
      ['/tutorials/', 'Tutorials'],   // required
      ['/videos/videos','Videos'],
      ['/references/references','References'],
      ['/community/community','Community'],
      ['/faq/','FAQ']
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
});
