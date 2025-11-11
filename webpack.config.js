import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.cjs': ['.cts', '.cjs'],
      '.mjs': ['.mts', '.mjs'],
    },
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),

    // 👇 Вот эта строка — ключевая
    library: { type: 'module' },
  },

  experiments: {
    outputModule: true, // 👈 разрешает ESM-вывод
  },
};
