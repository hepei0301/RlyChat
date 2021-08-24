var ip = {
  serverIp: 'wss://h5-im.yuntongxun.com/ws', //websocket地址
  fileServerIp: 'http://139.199.128.158:8090', //文件上传地址
  lvsServer: 'http://139.199.128.158:8888', //文件下载地址
  mwsgServer: 'ws://47.97.153.227:3520/h5websocket', //H5媒体地址
};

var app = {
  _appid: 'e750de49d8254db1a3d735c6c4d80b52', //appkey
  _appToken: '06f8c2f3df6654b8986aa752dd945954', //apptoken
};

window.restUrl = 'https://im-demo.gcnao.cn:9002';
window._ws = 'wss://im-demo.gcnao.cn:9002/ws';
// (window.fileServerIp = "https://192.168.27.239:8090"),
(window.fileServerIp = 'https://im-demo.gcnao.cn:9002/uploadFile'), (window.lvsServer = 'https://im-demo.gcnao.cn:9002/accessFile');
window.FILE_ACCESS_URL = 'https://im-demo.gcnao.cn:9002/accessFile';
window.IM_REST_URL = 'https://120.78.65.0:8883';
// 会议相关
window.AppId = '8a2af988536458c301537d7197320004';
window.AppToken = '0f26f16e4a8d4680a586c6eb2a9f4e03';
window.ConnectorAddrs = ['120.78.65.0:8085'];
window.LvsAddrs = ['120.78.65.0:8888'];
window.WbssAddrs = ['https://120.78.65.0:9001'];
window.dvrFileAddrs = 'https://im-demo.gcnao.cn:9002/dvrFile';
