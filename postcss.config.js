module.exports = ({ env }) => ({
  plugins: {
    stylelint: {},
    "postcss-cssnext": {
      browsers: "last 2 versions"
    },
    "postcss-reporter": {},
    ...(env !== "production" && { "postcss-browser-reporter": {} })
  }
});
