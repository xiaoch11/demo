var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, 'public/javascripts/index.js'),
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: 'bundle.js'
  },
  module: {
        rules: [
            {
                test: /\.css$/,
                use: {
                  loader: "css-loader",
                  options: {
                    alias: {
                      "stylesheets": path.resolve(__dirname, 'public/stylesheets/')
                    }
                  }
                }
                // use: ExtractTextPlugin.extract({
                //   fallback: "style-loader",
                //   use: "css-loader"
                // })
            }
        ]
    },
  plugins: [
    new ExtractTextPlugin('bundle.css')
  ],
  resolve: {
    alias: {
      stylesheets: path.resolve(__dirname, 'public/stylesheets/')
    }
  }
}