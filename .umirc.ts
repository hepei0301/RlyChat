// let defineConfig = require('umi');
import { defineConfig } from 'umi';

export default defineConfig({
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
