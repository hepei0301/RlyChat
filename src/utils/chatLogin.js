import './MD5.min.js';
import './base64.min.js';
import * as $ from './jquery-3.1.0.min.js';
import './ytx-web-im7.2.2.5.js';
import './ytx-web-av3.js';
import { app, ip } from './config.js';
import './RL_Meet.js';
function LOGIN() {
  this._appid = app._appid || '8a2af988536458c301537d7197320004';
  this._appToken = app._appToken || '0f26f16e4a8d4680a586c6eb2a9f4e03';
  this._3rdServer = 'https://imapp.yuntongxun.com/2016-08-15/Corp/yuntongxun/inner/authen/genSig';
  this._callBacks = [];
  this._login = false;
}

LOGIN.prototype = {
  init: function (cb) {
    this._callBacks.push(cb);
    console.log(this, 99);
    if (this._login && this._callBacks.length === 2) {
      this._callBacks[1]();
    }
    var resp = RL_YTX_NEW.init({
      appId: this._appid,
      serverIp: ip.serverIp,
      isV3: true,
    });
    RL_YTX_NEW.chatInit({
      fileServerIp: ip.fileServerIp,
      lvsServer: ip.lvsServer,
    });
    if (resp.code != 200) {
      alert('SDK初始化错误');
      return;
    } else if (174001 == resp.code) {
      alert('您的浏览器不支持html5，请更换新的浏览器。推荐使用chrome浏览器。');
      return;
    } else if (170002 == resp.code) {
      console.log('错误码：170002,错误码描述' + resp.msg);
      return;
    }
    if ($.inArray(174004, resp.unsupport) > -1 || $.inArray(174009, resp.unsupport) > -1) {
      //不支持getUserMedia方法或者url转换
      // IM.Check_usermedie_isDisable(); //拍照、录音、音视频呼叫都不支持
    } else if ($.inArray(174007, resp.unsupport) > -1) {
      //不支持发送附件
      // IM.SendFile_isDisable();
    } else if ($.inArray(174008, resp.unsupport) > -1) {
      //不支持音视频呼叫，音视频不可用
      // IM.SendVoiceAndVideo_isDisable();
    }
    this.getSig('15071046271', '', cb);
  },
  getSig: function (account_number, pwd, cb) {
    var pass = pwd ? pwd : '';
    var now = new Date();
    var timestamp =
      now.getFullYear() +
      '' +
      (now.getMonth() + 1 >= 10 ? '' + (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) +
      (now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()) +
      (now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) +
      (now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) +
      (now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());

    var sig = hex_md5(this._appid + account_number + timestamp + this._appToken);
    console.log(this.EV_login, 55);
    this.EV_login(account_number, pass, sig, timestamp, cb);
  },
  EV_login: function (user_account, pwd, sig, timestamp, cb) {
    const data = {
      sig,
      pwd,
      type: 1,
      userName: user_account,
      timestamp: timestamp,
    };
    console.log(this, this.RL_YTX_NEW, this._callBacks);
    if (this._callBacks.length < 2) {
      const that = this;
      window.RL_YTX_NEW.login(
        data,
        function () {
          window.RL_YTX_NEW.setLogClose();
          if (that._callBacks.length === 1) {
            that._login = true;
            that._callBacks[0]();
          }
          if (that._callBacks.length === 2) {
            that._login = false;
            that._callBacks.forEach((element) => {
              element && element();
            });
          }
        },
        function () {
          console.error('登录失败');
        }
      );
    }
  },
};

window.ChatLogin = new LOGIN();
