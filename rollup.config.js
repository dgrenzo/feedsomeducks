import cleanup from 'rollup-plugin-cleanup';

export default {
  input: 'src/main.js',
  plugins: [
    cleanup(),
  ],
  output: {
    file: 'docs/main.js',
    format: 'iife'
  }
};