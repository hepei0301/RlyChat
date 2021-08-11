var ip = {
  serverIp: "wss://im-demo.gcnao.cn:9002/ws", //'wss://h5-im.yuntongxun.com:8061/ws'，ws://192.168.182.118:9448
  fileServerIp: "https://im-demo.gcnao.cn:9002/uploadFile", //'http://139.199.128.158:8090'
  lvsServer: "https://im-demo.gcnao.cn:9002/accessFile", //'http://192.168.26.114'
  mwsgServer: "wss://im-demo.gcnao.cn:9003/h5websocket" //wss://139.199.130.143:1443/h5websocket，wss://192.168.182.117:1443/h5websocket
};
var app = {
  _appid: "8a2af988536458c301537d7197320004", //'e750de49d8254db1a3d735c6c4d80b52'， d4e3dc5c10934284afea8056cc8f7295
  _appToken: "0f26f16e4a8d4680a586c6eb2a9f4e03" // '06f8c2f3df6654b8986aa752dd945954'， e1c89b1d5af1c3b4a738b456a86e6428
};

window.restUrl = "https://im-demo.gcnao.cn:9002";
window._ws = "wss://im-demo.gcnao.cn:9002/ws";
// (window.fileServerIp = "https://192.168.27.239:8090"),
(window.fileServerIp = "https://im-demo.gcnao.cn:9002/uploadFile"),
  (window.lvsServer = "https://im-demo.gcnao.cn:9002/accessFile");
window.FILE_ACCESS_URL = "https://im-demo.gcnao.cn:9002/accessFile";
window.IM_REST_URL = "https://120.78.65.0:8883";
// 会议相关
window.AppId = "8a2af988536458c301537d7197320004";
window.AppToken = "0f26f16e4a8d4680a586c6eb2a9f4e03";
window.ConnectorAddrs = ["120.78.65.0:8085"];
window.LvsAddrs = ["120.78.65.0:8888"];
window.WbssAddrs = ["https://120.78.65.0:9001"];
window.dvrFileAddrs = "https://im-demo.gcnao.cn:9002/dvrFile";
