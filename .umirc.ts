const umi = require('umi');
const content = umi.defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  //   chainWebpack(config: any) {
  //     config.module
  //       .rule('html-with-file')
  //       .test(/\.html/)
  //       .use('html-with-file-loader')
  //       .loader('html-loader');
  //   },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/imChat', component: '@/pages/im/index' },
    { path: '/meetChat', component: '@/pages/meet/index' },
  ],
  fastRefresh: {},
});

module.exports = content;
