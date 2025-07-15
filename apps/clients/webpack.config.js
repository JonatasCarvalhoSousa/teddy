const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/bootstrap.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'clients',
      filename: 'remoteEntry.js',
      exposes: {
        './ClientsApp': './src/ClientsApp.tsx',
        './ClientsService': './src/services/clientsService.ts',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.8.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
