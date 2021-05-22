const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",

  output: {
    path: path.resolve("dist"),
    filename: "rgmde-bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
      },
    ],
  },
};
