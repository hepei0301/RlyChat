let defineConfig = require('umi');

const config = defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/imChat', component: '@/pages/im/index' },
    { path: '/meetChat', component: '@/pages/meet/index' },
  ],
  fastRefresh: {},
});

module.exports = config;
