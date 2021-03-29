const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const WebpackBar = require("webpackbar");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const path = require("path");

module.exports = (env) => {
  const isDev = env.development === true;
  const isProd = env.production === true;
  const fileName = (ext) =>
    isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

  return {
    mode: "production",
    entry: ["./src/index.js"],
    target: isDev ? "web" : "browserslist",
    devtool: isDev ? "source-map" : false,
    devServer: {
      contentBase: path.join(__dirname, "./src"),
      watchContentBase: true,
      compress: true,
      port: 3000,
      overlay: true, // выводит на странице ошибку
      hot: true,
      open: false,
      stats: "errors-only", // только ошибки в консоле
      clientLogLevel: "none",
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          use: [
            {
              loader: "html-loader",
              options: {
                minimize: isProd,
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.js|jsx$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
              ],
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
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    "css-mqpacker",
                    "autoprefixer",
                    "postcss-preset-env",
                  ],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: isDev,
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|webp)$/i,
          type: "javascript/auto",
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: isDev ? "./assets/images" : "./images",
                name: "[name].[ext]",
                outputPath: "images/",
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true,
                mozjpeg: {
                  progressive: true,
                  quality: 75,
                },
                optipng: {
                  enabled: true,
                  optimizationLevel: 5,
                },
                pngquant: {
                  quality: [0.65, 0.8],
                  speed: 1,
                },
                gifsicle: {
                  interlaced: false,
                  optimizationLevel: 1,
                },
                webp: {
                  quality: 65,
                },
              },
            },
          ],
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
          test: /\.(woff(2)?|eot|ttf|otf)$/,
          type: "javascript/auto",
          exclude: /images/,
          loader: "file-loader",
          options: {
            publicPath: "../",
            context: path.resolve(__dirname, "./src/assets"),
            name: "[path][name].[ext]",
            emitFile: false,
          },
        },
      ],
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
      filename: fileName("js"),
      path: path.resolve(__dirname, "./dist"),
      publicPath: "",
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: fileName("css"),
      }),
      new HtmlWebpackPlugin({
        // title: "Start",
        template: path.resolve(__dirname, "./src/index.html"),
        // favicon: "./src/images/favicon.ico",
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "./src/assets/fonts", to: "fonts" },
          // { from: "./src/assets/images", to: "images" },
        ],
      }),
      new WebpackNotifierPlugin({ onlyOnError: true }),
      new WebpackBar(),
      new BundleAnalyzerPlugin(),
    ],
  };
};

// убирает неиспользуемые импорты
// npx react-codemod update-react-imports
