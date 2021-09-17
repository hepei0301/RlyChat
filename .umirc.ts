const umi = require('umi');
const content = umi.defineConfig({
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

module.exports = content;
