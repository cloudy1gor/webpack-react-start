const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const WebpackNotifierPlugin = require("webpack-notifier");
const WebpackBar = require("webpackbar");
// const SpriteLoaderPlugin = require("svg-sprite-loader/plugin"); TODO-не получилось настроить
const path = require("path");

const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === "dev";
const isProd = ENV === "build";

function setDevTool() {
  if (isDev) {
    return "source-map";
  } else {
    return "none";
  }
}

function setDMode() {
  if (isProd) {
    return "production";
  } else {
    return "development";
  }
}

const config = {
  mode: setDMode(),
  devtool: setDevTool(),
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    overlay: true, // выводит на странице ошибку
    hot: true,
    open: true,
    stats: "errors-only",
    clientLogLevel: "none",
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },

      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
            ],
          },
        },
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },

          {
            loader: "css-loader",
          },

          {
            loader: "postcss-loader",
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
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./assets/images/`",
              name: "[name].[ext]",
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
                enabled: false,
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
                quality: 75,
              },
            },
          },
        ],
      },
      // {
      //   test: /\.svg$/,
      //   loader: "svg-sprite-loader",
      //   options: {
      //     extract: true,
      //     outputPath: "./assets/svg/",
      //     publicPath: "images/svg/",
      //   },
      // },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./assets/fonts",
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
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
  },

  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      // favicon: "./src/images/favicon.ico",
      filename: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(
            __dirname,
            "./src/assets/images"
          ),
          to: path.resolve(__dirname, "dist/assets/images"),
        },
      ],
    }),
    // new SpriteLoaderPlugin(),
    new WebpackNotifierPlugin({ onlyOnError: true }),
    new WebpackBar(),
    new BundleAnalyzerPlugin(),
  ],
};

if (isProd) {
  config.plugins.push(new UglifyJSPlugin());
}

module.exports = config;
