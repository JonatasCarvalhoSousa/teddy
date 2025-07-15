const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// URLs dos micro frontends
const MICROFRONTEND_URLS = {
  development: {
    clients: 'http://localhost:3001/remoteEntry.js',
    selected: 'http://localhost:3002/remoteEntry.js',
  },
  production: {
    clients: 'https://your-vercel-app.vercel.app/clients/remoteEntry.js',
    selected: 'https://your-vercel-app.vercel.app/selected/remoteEntry.js',
  }
};

const currentUrls = isProduction ? MICROFRONTEND_URLS.production : MICROFRONTEND_URLS.development;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/bootstrap.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
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
  devServer: isDevelopment ? {
    port: 3000,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    hot: true,
    liveReload: true,
  } : undefined,
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        clients: `clients@${currentUrls.clients}`,
        selected: `selected@${currentUrls.selected}`,
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
