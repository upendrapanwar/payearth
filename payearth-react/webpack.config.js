// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

// module.exports = {
//   mode: "development",
//   entry: path.resolve(__dirname, "src/index.js"),
//   output: {
//     path: path.resolve(__dirname, "output"),
//     filename: "bundle.js",
//   },
//   resolve: {
//     extensions: [".js", ".jsx"],
//   },
//   module: {
//     rules: [

//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },
//       {
//         test: /\.css$/i,
//         use: ["style-loader", "css-loader"],
//       },
//     ],
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: "./public/index.html",
//       filename: "./index.html",
//     }),
//   ],
// };

//************************************main code************************************ */
// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const webpack = require("webpack");
// module.exports = {
//   mode: "development",
//   target: "node",
//   // target: "web",
//   entry: path.resolve(__dirname, "src/index.js"),
//   output: {
//     path: path.resolve(__dirname, "output"),
//     filename: "bundle.js",
//   },
//   resolve: {
//     extensions: [".js", ".jsx"],
//     fallback: {
//       path: require.resolve("path-browserify"),
//       zlib: require.resolve("browserify-zlib"),
//       querystring: false,
//     },
//   },

//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },

//*********************** */
// {
//   test : /\.m?js/,
//   resolve: {
//     fullySpecified : false
//   }
// }
//************************* */
//       {
//         test: /\.css$/i,
//         use: ["style-loader", "css-loader"],
//       },
//     ],
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: "./public/index.html",
//       filename: "./index.html",
//     }),
//     new webpack.DefinePlugin({
//       process: { env: {} },
//       // process: require.resolve("process/browser"),
//       // process: "process/browser",
//     }),

//     new NodePolyfillPlugin(),
//   ],
// };

//************************************main code************************************ */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        include: /node_modules/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new webpack.DefinePlugin({
      "process.platform": JSON.stringify(process.platform),
    }),
  ],
};
