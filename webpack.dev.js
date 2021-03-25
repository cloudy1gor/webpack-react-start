const WebpackNotifierPlugin = require("webpack-notifier");
const WebpackBar = require("webpackbar");
const path = require("path");

module.exports = () => {
  return {
    mode: "development",
    devtool: "source-map",
    entry: ["./src/index.js"],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 3000,
      overlay: true, // выводит на странице ошибку
      hot: true,
      open: false,
      stats: "errors-only", // только ошибки в консоле
      clientLogLevel: "none",
    },
    target: "web",
    module: {
      rules: [
        {
          test: /\.html$/i,
          use: [
            {
              loader: "html-loader",
            },
          ],
        },
        {
          test: /\.js|jsx$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: [
                [
                  "@babel/plugin-proposal-class-properties",
                  {
                    loose: true,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                native: false, // react-native-svg
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/i,
        },
      ],
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    plugins: [
      new WebpackNotifierPlugin({ onlyOnError: true }),
      new WebpackBar(),
    ],
  };
};
