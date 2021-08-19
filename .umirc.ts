const aa = require('umi');
console.log(444555666, aa);
const cc = aa.defineConfig({
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

module.exports = cc;
