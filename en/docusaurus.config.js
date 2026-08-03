// @ts-check
const {themes: prismThemes} = require('prism-react-renderer');

const rehypeFixAssetImages = require('./src/plugins/rehype-fix-asset-images');

const baseUrl = process.env.BASE_URL || '/';

/** @param {string} path */
function staticAsset(path) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Healthcare Solution Documentation',
  tagline: 'Documentation for WSO2 Open Healthcare Accelerator',
  favicon: 'img/favicon.svg',
  url: 'https://oh.docs.wso2.com',
  baseUrl,
  organizationName: 'wso2',
  projectName: 'open-healthcare-docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: ['./plugins/docusaurus-plugin-markdown-export'],
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: 'docs',
        indexBlog: false,
        indexPages: true,
        searchBarShortcutHint: false,
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/wso2/open-healthcare-docs/edit/main/en/',
          showLastUpdateTime: true,
          exclude: ['**/old-content/**'],
          rehypePlugins: [[rehypeFixAssetImages, {baseUrl}]],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  stylesheets: [
    staticAsset('/assets/css/ohtheme.css'),
    staticAsset('/assets/css/blue-palette-alt1.css'),
    staticAsset('/assets/css/config-catalog.css'),
    staticAsset('/assets/css/redoc.css'),
    staticAsset('/assets/lib/highlightjs/styles/vs.min.css'),
    staticAsset('/assets/lib/json-formatter/json-formatter.css'),
    staticAsset('/assets/lib/fontawesome-free-6.3.0-web/css/all.min.css'),
  ],
  scripts: [
    staticAsset('/assets/lib/highlightjs/highlight.min.js'),
    staticAsset('/assets/lib/json-formatter/json-formatter.umd.js'),
    staticAsset('/assets/js/ohtheme.js'),
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: 'WSO2 Open Healthcare',
        logo: {
          alt: 'WSO2 Open Healthcare Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {to: '/docs/get-started/architecture', label: 'Get Started', position: 'left'},
          {to: '/docs/fhir/guides/overview-of-fhir', label: 'FHIR', position: 'left'},
          {to: '/docs/hl7/guides/overview', label: 'HL7', position: 'left'},
          {
            to: '/docs/data-transformation/guides/hl7v2-fhir',
            label: 'Data Transformation',
            position: 'left',
          },
          {
            to: '/docs/secure-health-apis/guides/smart-on-fhir-overview',
            label: 'Security',
            position: 'left',
          },
          {
            href: 'https://github.com/wso2/open-healthcare-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Get Started',
            items: [
              {label: 'Accelerators', to: '/docs/get-started/architecture'},
              {label: 'Architecture', to: '/docs/architecture/overview'},
              {label: 'Installation', to: '/docs/install-and-setup/manual'},
            ],
          },
          {
            title: 'Learn',
            items: [
              {label: 'FHIR', to: '/docs/fhir/guides/overview-of-fhir'},
              {label: 'HL7', to: '/docs/hl7/guides/overview'},
              {
                label: 'Data Transformation',
                to: '/docs/data-transformation/guides/hl7v2-fhir',
              },
              {
                label: 'EMR Connectivity',
                to: '/docs/emr-connectivity/guides/emr-systems-overview',
              },
            ],
          },
          {
            title: 'Operations',
            items: [
              {
                label: 'Security & SMART',
                to: '/docs/secure-health-apis/guides/smart-on-fhir-overview',
              },
              {label: 'Performance', to: '/docs/performance/overview'},
              {label: 'Compliance', to: '/docs/compliance/overview'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} WSO2 LLC. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'bash', 'json', 'yaml', 'toml', 'markup'],
      },
    }),
};

module.exports = config;
