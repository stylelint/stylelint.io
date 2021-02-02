module.exports={
  "title": "stylelint",
  "tagline": "A mighty, modern style linter",
  "url": "https://stylelint.io",
  "baseUrl": "/",
  "organizationName": "stylelint",
  "projectName": "stylelint",
  "scripts": [
    "/js/pattern-validity.js"
  ],
  "favicon": "img/favicon.ico",
  "customFields": {
    "docsUrl": "",
    "disableHeaderTitle": true
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "homePageId": "index",
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "path": "../docs",
          "sidebarPath": "../website-v1/sidebars.json"
        },
        "blog": {},
        "theme": {
          "customCss": "../src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "stylelint",
      "logo": {
        "src": "img/logo.svg"
      },
      "items": [
        {
          "to": "docs/",
          "label": "Docs",
          "position": "left"
        },
        {
          "to": "/demo",
          "label": "Demo",
          "position": "left"
        },
        {
          "href": "https://github.com/stylelint/stylelint",
          "label": "GitHub",
          "position": "left"
        },
        {
          "href": "https://twitter.com/stylelint",
          "label": "Twitter",
          "position": "left"
        }
      ]
    },
    "footer": {
      "links": [],
      "logo": {}
    },
    "algolia": {
      "apiKey": "29d680ce97507c5cd2836c6c74783c05",
      "indexName": "stylelint"
    }
  }
}