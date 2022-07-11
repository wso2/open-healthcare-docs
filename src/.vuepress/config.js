const { config } = require("vuepress-theme-hope");
const { description } = require('../../package')

module.exports = config({
  
  base: '/',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'WSO2 OH Docs',
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
    hostname : 'https://wso2.com',
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    Navbar: true,
    logo: '/assets/img/wso2-open-healthcare-logo.png',
    sidebar : [
      ['/', "Home"],
      {
        title: 'Getting Started',
        path: '/getting-started/open-healthcare',
        children: [
         ['/getting-started/open-healthcare','What is Open Healthcare'],
         ['/getting-started/accelerators','Accelerators'],
         ['/getting-started/architecture', 'Architecture']
       ]
      },
      {
        title: 'Install and Setup',
        path: '/install-and-setup/manual',
        children: [
         ['/install-and-setup/manual','Manual Installation'],
         ['/install-and-setup/container','Containerization Support'],
         ['/install-and-setup/deployment', 'Deployment Methods'],
         {
           title: 'Updating the Accelerator',
           path: '/install-and-setup/updates/overview',
           children: [
               ['/install-and-setup/updates/overview','WSO2 Update tool overview'],
               ['/install-and-setup/updates/update-tool','How to use WSO2 Update tool'],
               ['/install-and-setup/updates/update-accelerators','How to update OH accelerator'],
           ]
         }
       ]
      },
      {
        title: 'Learn',
        path: '/learn/apidefs',
        sidebarDepth: 2,
        children: [
         ['/learn/apidefs', 'FHIR API Definitions'],
         ['/learn/capstmt', 'FHIR Capability Statement'],
         {
            title: 'Consent Management',
            path: '/learn/consent-mgt/intro',
            children: [
              ['/learn/consent-mgt/intro', 'Introduction'],
              ['/learn/consent-mgt/admin', 'Consent Administration'],
              ['/learn/consent-mgt/req', 'Consent Requisition'],
              ['/learn/consent-mgt/collection', 'Consent Collection'],
              ['/learn/consent-mgt/enforcement', 'Consent Enforcement']
          ]
        },
        {
          title: 'FHIR Mappers',
          path: '/learn/fhir-mappers/xml-json-to-fhir',
          children: [
            ['/learn/fhir-mappers/xml-json-to-fhir', 'XML/JSON To FHIR'],
            ['/learn/fhir-mappers/hl7-to-fhir', 'HL7 To FHIR'],
            ['/learn/fhir-mappers/x12-to-fhir', 'X12 To FHIR']
          ]
        },
        {
          title: 'FHIR Mapping Templates',
          path: '/learn/fhir-mapping-templates/fhir-mapping-templates-overview',
          children: [
            ['/learn/fhir-mapping-templates/fhir-mapping-templates-overview', 'FHIR Mapping Templates Overview'],
            ['/learn/fhir-mapping-templates/fhir-mapping-templates-example', 'FHIR Mapping Templates: Example'],
            ['/learn/fhir-mapping-templates/fhir-mapping-templates-reference', 'FHIR Mapping Templates References'],
          ]
        },
        ['/learn/fhir-connectors', 'FHIR Connectors'],
        {
          title: 'SMART On FHIR',
          path: '/learn/smart-on-fhir/wkc',
          children: [
            ['/learn/smart-on-fhir/wkc', 'Well-Known Configuration'],
            ['/learn/smart-on-fhir/jwt', 'JWT Claims Handling'],
            ['/learn/smart-on-fhir/get-patient-id', 'How to Get Patient/Member ID'],
            ['/learn/smart-on-fhir/tips', 'Tips on Building a SMART Application']
          ]
        },
        ['/learn/connector', 'EHR/EMR Connector Support'],
       ]
      },
      {
        title: 'Sample Usecases',
        path: '/use-cases/patient-access',
        children: [
          ['/use-cases/patient-access', 'Patient Access API'],
          ['/use-cases/provider-dir', 'Provider Directory API'],
          ['/use-cases/db-to-fhir', 'Database to FHIR'],
          ['/use-cases/smart-on-fhir', 'SMART on FHIR'],
          ['/use-cases/ehr-int', 'EHR Integration']
        ]
      },
      {
        title: 'Configurations',
        path: '/configs/email-notifications',
        children: [
          ['/configs/email-notifications', 'Email Notifications']
        ]
      }
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
