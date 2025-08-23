// postcss.config.js (Tailwind v4)
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwind(),
    autoprefixer(),
  ],
};
