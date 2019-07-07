const siteConfig = {
  title: "stylelint",
  tagline: "A mighty, modern style linter",

  url: "https://stylelint.io",
  baseUrl: "/",

  projectName: "stylelint",
  organizationName: "stylelint",

  copyright: `Copyright © ${new Date().getFullYear()} stylelint`,

  headerLinks: [
    { doc: "user-guide", label: "User guide" },
    { doc: "user-guide/rules", label: "Rules" },
    { doc: "user-guide/plugins", label: "Plugins" },
    { doc: "user-guide/processors", label: "Processors" },
    { doc: "developer-guide", label: "Developer guide" },
    { page: "demo", label: "Demo" },
    {
      href: "https://github.com/stylelint/stylelint",
      label: "GitHub"
    },
    {
      href: "https://twitter.com/stylelint",
      label: "Twitter"
    }
  ],

  headerIcon: "img/logo.svg",
  favicon: "img/favicon.ico",

  colors: {
    primaryColor: "#263238",
    secondaryColor: "#546e7a"
  },

  highlight: {
    theme: "atelier-forest-light"
  },

  docsUrl: "",

  disableHeaderTitle: true,

  docsSideNavCollapsible: true,

  cleanUrl: true,

  onPageNav: "separate",

  scripts: ["/js/pattern-validity.js"],

  algolia: {
    apiKey: "29d680ce97507c5cd2836c6c74783c05",
    indexName: "stylelint"
  }
};

module.exports = siteConfig;
