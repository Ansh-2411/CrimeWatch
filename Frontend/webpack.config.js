module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('@tailwindcss/postcss'),
                    require('autoprefixer'),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'], // Skip PostCSS for node_modules
        },
      ],
    },
  };