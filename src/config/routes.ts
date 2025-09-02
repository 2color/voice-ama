import { extendSEO, defaultSEO } from './seo'

/**
 * Application routes configuration
 * Defines navigation paths, labels, and SEO metadata for each page
 * Used for consistent routing and SEO across the application
 */
const routes = {
  home: {
    label: 'Home',
    path: '/',
    seo: defaultSEO,
  },
  ama: {
    label: 'Ask Me Anything',
    path: '/',
    seo: extendSEO({
      title: 'Ask Me Anything',
      description: 'Answering questions, just for fun.',
      image: 'meta/ama.png', // Custom OG image for AMA page
      url: 'ama',
    }),
  },
  login: {
    label: 'Login',
    path: '/login',
    seo: extendSEO({
      title: 'Login',
      description: 'Login to answer questions',
      url: 'login',
    }),
  },
}

export default routes
