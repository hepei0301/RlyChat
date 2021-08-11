(function (e) {
  if (typeof (hex_md5) == "undefined") {
    document.write('<script src="https://app.cloopen.com/im50/MD5.min.js" type="text/javascript" charset="utf-8"></script>')
  }
  if (typeof (Base64) == "undefined") {
    document.write('<script src="https://app.cloopen.com/im50/base64.min.js" type="text/javascript" charset="utf-8"></script>')
  }
  if (typeof (jQuery) == "undefined") {
    document.write('<script src="https://app.cloopen.com/im50/jquery-1.11.3.min.js" type="text/javascript" charset="utf-8"></script>')
  }
  // function createScript(src){
  //     YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, "createScript" + src);
  //     var md5script = document.createElement('script');
  //     md5script.type = 'text/javascript';
  //     md5script.charset = 'UTF-8';
  //     md5script.src = src;
  //     scriptArray.push(md5script);
  // }
  // var docu = document.getElementsByTagName('head')[0];
  // for(var i= 0; i<scriptArray.length; i++){
  //     docu.parentNode.insertBefore(scriptArray[i],docu);
  // }

  function log(lev, content) {
    if (!YTX_CONFIG._logPrint) { //如果开关关闭，则不打印日志 直接返回
      return;
    }
    if (lev < YTX_CONFIG._logLevStat) {
      return;
    }
    if (!window.console || !window.console.log || !window.console.info || !window.console.warn || !window.console.error) {
      return;
    }
    var timeStamp = YTX_CONFIG._getTimeStamp();
    content = timeStamp + " :: SDK :: " + content;
    if (lev == YTX_CONFIG._logLev._DEBUG) {
      console.log(content);
    } else if (lev == YTX_CONFIG._logLev._INFO) {
      console.info(content);
    } else if (lev == YTX_CONFIG._logLev._WARN) {
      console.warn(content);
    } else if (lev == YTX_CONFIG._logLev._ERROR) {
      console.error(content);
    }
  }

  function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
      return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    }
    if (typeof o == "object") {
      if (!o.sort) {
        for (var i in o) {
          r.push(i + ":" + obj2string(o[i]));
        }
        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
          r.push("toString:" + o.toString.toString());
        }
        r = "{" + r.join() + "}";
      } else {
        for (var i = 0; i < o.length; i++) {
          r.push(obj2string(o[i]))
        }
        r = "[" + r.join() + "]";
      }
      return r;
    }
    if (!o)
      o = "";
    return o.toString();
  }

  function getBase64Image(img, outputFormat) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    return dataURL // return dataURL.replace("data:image/png;base64,", "");
  }

  // canvas转dataURL：canvas对象、转换格式、图像品质
  function canvasToDataURL(canvas, format, quality) {
    return canvas.toDataURL(format || 'image/jpeg', quality || 1.0);
  }
  // DataURL转canvas
  function dataURLToCanvas(dataurl, cb) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      cb(canvas);
    };
    img.src = dataurl;
  }
  /*-----------------------------------------------------------------------*/
  // image转canvas：图片地址
  function imageToCanvas(src, cb) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = src;
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      cb(canvas);
    };
  }
  // canvas转image
  function canvasToImage(canvas) {
    var img = new Image();
    img.src = canvas.toDataURL('image/jpeg', 1.0);
    return img;
  }
  /*-----------------------------------------------------------------------*/
  // File/Blob对象转DataURL
  function fileOrBlobToDataURL(obj, cb) {
    var a = new FileReader();
    a.readAsDataURL(obj);
    a.onload = function (e) {
      // var imageData = e.target.result;
      // for(var i = 0; i < imageData.data.length; i += 4) {
      //     // 当该像素是透明的，则设置成白色
      //     if(imageData.data[i + 3] == 0) {
      //         imageData.data[i] = 255;
      //         imageData.data[i + 1] = 255;
      //         imageData.data[i + 2] = 255;
      //         imageData.data[i + 3] = 255;
      //     }
      // }
      cb(e.target.result);
    };
  }
  // DataURL转Blob对象
  function dataURLToBlob(dataurl) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }
  /*-----------------------------------------------------------------------*/
  // Blob转image
  function blobToImage(blob, cb) {
    fileOrBlobToDataURL(blob, function (dataurl) {
      var img = new Image();
      img.src = dataurl;
      img.onload = function () {
        cb(img);
      }
    });
  }
  // image转Blob
  function imageToBlob(src, cb) {
    imageToCanvas(src, function (canvas) {
      cb(dataURLToBlob(canvasToDataURL(canvas)));
    });
  }
  /*-----------------------------------------------------------------------*/
  // Blob转canvas
  function BlobToCanvas(blob, cb) {
    fileOrBlobToDataURL(blob, function (dataurl) {
      dataURLToCanvas(dataurl, cb);
    });
  }
  // canvas转Blob
  function canvasToBlob(canvas, cb) {
    cb(dataURLToBlob(canvasToDataURL(canvas)));
  }
  /*-----------------------------------------------------------------------*/
  // image转dataURL
  function imageToDataURL(src, cb) {
    imageToCanvas(src, function (canvas) {
      cb(canvasToDataURL(canvas));
    });
  }
  // dataURL转image，这个不需要转，直接给了src就能用
  function dataURLToImage(dataurl) {
    var img = new Image();
    img.src = d;
    return img;
  }
  /*-----------------------------------------------------------------------*/
  //配置
  var YTX_CONFIG = {
    _version: "ytx_web_wbss_sdk v2.2.0.2",
    // server
    _server_ip: [], // ip:port
    _file_server: [], // "ip:port"
    _rest_server: ["MTkyLjE2OC4xNzkuMTA1OjgwMDA="], // "192.168.179.105:8000"
    _getServer: true,
    _isSSLEncrypt: true, // 加密传输

    _isConnect: false,
    _isConnecting: false,
    _isReconnect: false,

    _intervalId: null,

    _isSupportHeartBeatInConnect: false,
    _heartBeatErrNum: 0,
    _heartBeatTimeOut: 5,
    _heartBeatInterval: {
      _2G: 45,
      _3G: 90,
      _4G: 180,
      _WIFI: 300,
      _RECONNECT: 15,
      _TEST_NETWORK: 10,
    },
    _failHeartBeatInterval: 10,

    _logPrint: true, //打印日志控制开关
    _logLevStat: 1,
    _logLev: {
      _TRACE: 0,
      _DEBUG: 1,
      _INFO: 2,
      _WARN: 3,
      _ERROR: 4
    },
    _drawCnt: 0, // draw函数帧记录，方便日志打印清晰

    _authKey: "123456",
    _appId: "a23bafe1a84bfe096d25b79eba321f1a",
    _userId: "mingyang_h5_test",
    _roomId: -1,

    _roleId: 0,
    _roomPass: "",

    // render
    _drawStatus: {
      DRAW_STATUS_NONE: 0,
      DRAW_STATUS_NORMAL: 1,
      DRAW_STATUS_ERASER: 2,
      DRAW_STATUS_ZOOM: 3,
      DRAW_STATUS_LASER_PEN: 4,
      DRAW_STATUS_DELETE: 5,
      DRAW_STATUS_ELEMENT_MOVE: 6,
      DRAW_STATUS_END: 7
    },
    _drawContext: {
      curRoom: 0, // 当前房间id
      curDoc: 0, // 当前文档id
      curPage: 1, // 当前页id
      shapeType: 1, // 形状
      lineWidth: 1, // 线宽
      lineColor: 0xFF, // 线的颜色
      isFillMode: false, // 形状是否填充
      drawStatus: null, // 当前绘制状态, 比如缩放移动状态，元素选择移动等
      docBackgroundColor: 0xFF, // 默认黑色背景
      // wbRatio: 4.0 / 3, // 白板比例
      wbRatio: 0,
      wbIfSacle: false, // 白板是否缩放
      canvasLastWidth: 0, // 处理canvas缩放
      canvasLastHeight: 0, // 处理canvas缩放
      // initDrawContext: function () {
      //     this.canvasLastWidth = YTX_CONFIG._canvas.width;
      //     this.canvasLastHeight = YTX_CONFIG._canvas.height;
      // }
    },
    _drawDelType: {
      DRAW_DEL_TYPE_LINE: 1,
      DRAW_DEL_TYPE_PAGE: 2,
      DRAW_DEL_TYPE_DOC: 3
    },
    _canvas: null,

    _socket: null,
    _clientNo: 0,
    _clientMap: {}, // 消息缓存
    _docConvertMap: {}, // 文档转换缓存
    _prototype: {
      CreateRoomReq: 1,
      CreateRoomResp: 2,
      JoinRoomReq: 3,
      JoinRoomResp: 4,
      LeaveRoomReq: 5,
      LeaveRoomResp: 6,
      KickoutReq: 7,
      KickoutResp: 8,
      KickoutNotify: 9,
      DeleteRoomReq: 10,
      DeleteRoomResp: 11,
      ClearRoomReq: 12,
      ClearRoomResp: 13,
      ClearRoomNotify: 14,
      AssignRoleReq: 15,
      AssignRoleResp: 16,
      AssignMemberAuthReq: 17,
      AssignMemberAuthResp: 18,
      SyncRoomDataReq: 19,
      SyncRoomDataResp: 20,
      GetRoomListReq: 21,
      GetRoomListResp: 22,
      GetRoomMemberReq: 23,
      GetRoomMemberResp: 24,
      GetDocListReq: 25,
      GetDocListResp: 26,
      BroadcastMsgReq: 27,
      BroadcastMsgResp: 28,
      ShareApplyReq: 29,
      ShareApplyResp: 30,
      WbControlReq: 31,
      ShareApplyHandleReq: 32,
      ShareApplyHandleResp: 33,
      StopMemberShareReq: 34,
      StopMemberShareResp: 35,
      ShareForbiddenReq: 36,
      ShareForbiddenResp: 37,
      StopSelfShareReq: 38,
      StopSelfShareResp: 39,
      ShareDocReq: 40,
      ShareDocResp: 41,
      RemoveShareDocReq: 42,
      RemoveShareDocResp: 43,
      GotoPageReq: 44,
      GotoPageResp: 45,
      RemoveWbPageReq: 46,
      RemoveWbPageResp: 47,
      WbssDrawReq: 48,
      WbssDrawResp: 49,
      WbssDeleteDrawReq: 50,
      WbssDeleteDrawResp: 51,
      DrawUndoReq: 52,
      DrawUndoResp: 53,
      DrawScaleReq: 54,
      DrawScaleResp: 55,
      DrawMoveReq: 56,
      DrawMoveResp: 57,
      JoinApplyNotify: 58,
      MemberJoinNotify: 59,
      MemberLeaveNotify: 60,
      RoleChangeNotify: 61,
      AssignMemberAuthNotify: 62,
      DeleteRoomNotify: 63,
      DocConvertNotify: 64,
      RemoveShareDocNotify: 65,

    },

    _errcode: {
      _SUCC: 200,
      _INVALID_PARAM: 368113,
      _NOT_INROOM_ERROR: 368114,
      _SHAREDOC_REPEAT_ERROR: 368115,
      _RESP_TIME_OUT: 368501,
      _REQUEST_TOO_FREQUENT: 368502,
      _NETWORK_TIME_OUT: 368503,
      _FILE_PARAM_ERROR: 368504,
      _FILE_TOO_LARGE: 368505,
      _HTTP_CONECT_ERROR: 368506,
      _CONNECT_WEB_SERVER_ERROR: 368507,
      _NO_INIT: 368508,
      _OUT_OF_RANGE_ERROR: 368509,
      _DOCCONVERT_TIME_OUT: 368510,
      _NOT_SUPPORT_H5: 368510
    },
    _loginStatus: 1, // 1 不在房间 2 在房间中
    _timeOutSecond: 40,
    _timeOutDocConvert: 50,
    _requestTime: null,
    _requestCounter: 0,
    _requestLimit: 300,
    _roomInfoMap: {},
    _maxFileLen: 1024 * 1024 * 50,

    _xhr: null,

    // indexDb
    _db: null,
    _dbInfo: {
      dbVersion: 2,
      dbName: "ytx_wb_db",
      dbStoreName: "ytx_doc_images"
    },

    // 监听器
    _connectStatListener: null,
    _onUploadDocProcessListener: null,
    _onDocConvertListener: null,
    _onGotoPageListener: null,
    _onShareDocListener: null,

    _log: function (lev, content) { //打印日志
      if (!YTX_CONFIG._logPrint) { //如果开关关闭，则不打印日志 直接返回
        return;
      }
      if (lev < YTX_CONFIG._logLevStat) {
        return;
      }
      if (!window.console || !window.console.log || !window.console.info || !window.console.warn || !window.console.error) {
        return;
      }
      var timeStamp = YTX_CONFIG._getTimeStamp();
      content = timeStamp + " :: SDK :: " + content;
      if (lev == YTX_CONFIG._logLev._DEBUG) {
        console.log(content);
      } else if (lev == YTX_CONFIG._logLev._INFO) {
        console.info(content);
      } else if (lev == YTX_CONFIG._logLev._WARN) {
        console.warn(content);
      } else if (lev == YTX_CONFIG._logLev._ERROR) {
        console.error(content);
      }
    },
    _sendMsg: function (content) { //发送消息
      var curTime = new Date().getTime();
      if (!YTX_CONFIG._requestTime) {
        YTX_CONFIG._requestTime = curTime;
        YTX_CONFIG._requestCounter = 0;
      } else if ((curTime - YTX_CONFIG._requestTime) > 60 * 1000) {
        YTX_CONFIG._requestTime = curTime;
        YTX_CONFIG._requestCounter = 0;
      }
      if (YTX_CONFIG._requestCounter++ < YTX_CONFIG._requestLimit) {
        YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, "send msg : " + content);
        YTX_CONFIG._socket.send(content);
      } else {
        var json = JSON.parse(content);
        var msgLite = json["MsgLite"];
        var clientNo = msgLite["3"];
        var request = YTX_CONFIG._clientMap[clientNo];
        try {
          clearTimeout(request.timeout);
        } catch (e) {
          console.log("Cannot read property 'timeout' of undefined");
        }
        var onError = request.onError;
        var resp = {};
        resp.code = YTX_CONFIG._errcode._REQUEST_TOO_FREQUENT;
        resp.msg = 'request too quick, please wait a minute.';
        onError(resp);
      }
    },
    _onResponse: function (obj) { //接受消息
      YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, "receive msg : " + obj);
      obj = JSON.parse(obj);

      if (!obj) {
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "internal error");
        return;
      }

      if (!!obj["hb"]) {
        YTX_CONFIG._heartBeatCallBack(obj["hb"]);
        return
      }

      var type = obj["type"];
      var payload = obj["payload"];
      if (!payload) {
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "receive msg invalid");
        return;
      }
      // 处理通知消息, 白板目前无法通过流水号判断是否通知
      switch (type) {
        case YTX_CONFIG._prototype.DeleteRoomReq:
          {
            YTX_CONFIG._parseDeleteRoomNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.ClearRoomReq:
          {
            YTX_CONFIG._parseClearRoomNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.MemberJoinNotify:
          {
            YTX_CONFIG._parseMemberJoinNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.MemberLeaveNotify:
          {
            YTX_CONFIG._parseMemberLeaveNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.ShareDocReq:
          {
            YTX_CONFIG._parseShareDocNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.RemoveShareDocReq:
          {
            YTX_CONFIG._parseRemoveDocNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.GotoPageReq:
          {
            YTX_CONFIG._parseGotoPageNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.WbssDrawReq:
          {
            YTX_CONFIG._parseDrawNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.WbssDeleteDrawReq:
          {
            YTX_CONFIG._parseDrawDeleteNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.DocConvertNotify:
          {
            YTX_CONFIG._parseDocConvertNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.DrawUndoReq:
          {
            YTX_CONFIG._parseDrawUndoNotify(payload);
            return;
          }
          break;
        case YTX_CONFIG._prototype.KickoutNotify:
          {
            YTX_CONFIG._parseKickOutNotify(payload);
            return;
          }
          break;
        default:
          break;
      }

      // 处理响应消息
      var reqId = payload["head"]["reqID"];
      var request = YTX_CONFIG._clientMap[reqId];
      if (!request) {
        log(YTX_CONFIG._logLev._WARN, "receive a unrequest response, clientNo:" + payload["head"]["reqID"]);
        return;
      }
      var callback = request.callback;
      try {
        clearTimeout(request.timeout);
      } catch (e) {
        console.log("Cannot read property 'timeout' of undefined");
      }
      if (!callback) {
        return;
      }
      switch (type) {
        case YTX_CONFIG._prototype.CreateRoomResp:
          {
            YTX_CONFIG._parseCreateRoomResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.JoinRoomResp:
          {
            YTX_CONFIG._parseJoinRoomResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.LeaveRoomResp:
          {
            YTX_CONFIG._parseLeaveRoomResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.DeleteRoomResp:
          {
            YTX_CONFIG._parseDeleteRoomResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.KickoutResp:
          {
            YTX_CONFIG._parseKickoutResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.ClearRoomResp:
          {
            YTX_CONFIG._parseClearRoomResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.SyncRoomDataResp:
          {
            YTX_CONFIG._parseSyncRoomDataResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.ShareDocResp:
          {
            YTX_CONFIG._parseShareDocResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.RemoveShareDocResp:
          {
            YTX_CONFIG._parseRemoveShareDocResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.GotoPageResp:
          {
            YTX_CONFIG._parseGotoPageResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.RemoveWbPageResp:
          {
            YTX_CONFIG._parseRemoveWbPageResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.WbssDrawResp:
          {
            YTX_CONFIG._parseWbssDrawResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.WbssDeleteDrawResp:
          {
            YTX_CONFIG._parseWbssDeleteDrawResp(payload, request);
          }
          break;
        case YTX_CONFIG._prototype.DrawUndoResp:
          {
            YTX_CONFIG._parseDrawUndoResp(payload, request);
          }
          break;
        default:
          log(YTX_CONFIG._logLev.ERROR, "response error: type is undefined");
          break;
      }
      if (YTX_CONFIG._clientMap) {
        delete YTX_CONFIG._clientMap[reqId];
      }

    },
    //生成ClientNo
    _generateClientNo: function (callback, onError, type, notUpdate) {
      var clientNo;
      if (notUpdate) {
        clientNo = YTX_CONFIG._clientNo;
      } else {
        clientNo = ++YTX_CONFIG._clientNo;
      }
      var data = {};
      if (!!callback) {
        data.callback = callback;
      } else {
        data.callback = function () {};
      }
      data.onError = onError;
      if (!!type) {
        data.type = type;
      }
      var i = setTimeout(function () {
        var resp = {};
        if (YTX_CONFIG._loginStatus == 2) {
          YTX_CONFIG._loginStatus = 1;
        }
        resp.code = YTX_CONFIG._errcode._RESP_TIME_OUT;
        resp.msg = 'request time out.', onError(resp);
        console.log('time out clientNo is: ' + clientNo);
        delete YTX_CONFIG._clientMap[clientNo];
      }, YTX_CONFIG._timeOutSecond * 1000);
      data.timeout = i;
      YTX_CONFIG._clientMap[clientNo] = data;
      return clientNo;
    },
    //连接服务器
    _connectServer: function (roomId, callback, onError, reset) {
      if (!YTX_CONFIG._getServer) {
        // use local servers settings
        YTX_CONFIG._initScoket(callback, onError, reset);
        return;
      }
      // access rest to get servers info
      var datas = {
        "roomId": roomId.toString(),
        "userId": YTX_CONFIG._userId,
        "appId": YTX_CONFIG._appId,
        "authKey": YTX_CONFIG._authKey,
      };

      $.ajax({
        type: "POST",
        timeout: 5000,
        url: Base64.decode(YTX_CONFIG._rest_server[0]) + "/rest/auth",
        data: JSON.stringify(datas),
        async: true,
        success: function (e) {
          if (!e) {
            YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'connect rest error, please check server ip and port' + e);
            var resp = {};
            resp.code = YTX_CONFIG._errcode._HTTP_CONECT_ERROR;
            resp.msg = 'connect rest error, please check server ip and port';
            onError(resp);
            console.log(e);
            return;
          }
          YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, 'rest response=' + e);
          var response = JSON.parse(e);
          var statusCode = parseInt(response["statusCode"]);
          //YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'statusCode=' + statusCode);
          if (statusCode == 0) {
            //by wjh
            if (YTX_CONFIG._isSSLEncrypt) {
              var wss_server_ip = response["websocketServers"][0].split(":")[0];
              var wss_server_port = Number(response["websocketServers"][0].split(":")[1]) + 1;
              var wss_server = wss_server_ip + ":" + wss_server_port;
              var file_server_ip = response["fileServers"][0].split(":")[0];
              var file_server_port = Number(response["fileServers"][0].split(":")[1]) + 1;
              var file_https_server = file_server_ip + ":" + file_server_port;
              YTX_CONFIG._server_ip = [Base64.encode(wss_server)];
              YTX_CONFIG._file_server = [Base64.encode(file_https_server)];
            } else {
              var websocketServer = response["websocketServers"][0];
              var fileServer = response["fileServers"][0];
              YTX_CONFIG._server_ip = [Base64.encode(websocketServer)];
              YTX_CONFIG._file_server = [Base64.encode(fileServer)];
            }

            // YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, '_server_ip=' + YTX_CONFIG._server_ip[0] +
            //     ' _file_server' + YTX_CONFIG._file_server[0]);
            YTX_CONFIG._initScoket(callback, onError, reset);
            //建立webscoket链接
          } else {
            YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, 'error: response status not success');
            var resp = {};
            resp.code = statusCode;
            resp.msg = 'request rest error';
            onError(resp);
          }
        },
        error: function (e) {
          console.log("error");
          YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, 'connect rest error ' + e);
          var resp = {};
          resp.code = YTX_CONFIG._errcode._HTTP_CONECT_ERROR;
          resp.msg = 'connect rest error, please check server ip and port';
          onError(resp);
          //console.log(e);
        }
      });
    },
    //初始化webcocket
    _initScoket: function (callback, onError, reset) {
      YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, 'init WebSocket');
      if (reset) {
        if (!!YTX_CONFIG._socket) {
          YTX_CONFIG._socket.onclose = function () {};
          try {
            YTX_CONFIG._socket.close();
          } catch (e) {

          } finally {
            YTX_CONFIG._socket = null;
          }
        }
        YTX_CONFIG._isConnect = false;
        YTX_CONFIG._isConnecting = false;
      }
      if (!YTX_CONFIG._isConnect) {
        if (!YTX_CONFIG._isConnecting) {
          var serverip;
          if (YTX_CONFIG._isSSLEncrypt)
            serverip = "wss://" + Base64.decode(YTX_CONFIG._server_ip[0]);
          else
            serverip = "ws://" + Base64.decode(YTX_CONFIG._server_ip[0]);
          // YTX_CONFIG._socket = new WebSocket(serverip);
          YTX_CONFIG._socket = new WebSocket("wss://testyhws.yomeeting.com:81");
          YTX_CONFIG._isConnecting = true;
          var tId = setTimeout(function () {
            YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'connect to websocket time out');
            if (YTX_CONFIG._isConnecting) {
              YTX_CONFIG._isConnecting = false;
              var resp = {};
              resp.code = YTX_CONFIG._errcode._NETWORK_TIME_OUT;
              resp.msg = 'connect to websocket time out.';
              onError(resp);
              return;
            }
          }, YTX_CONFIG._timeOutSecond * 1000);
          YTX_CONFIG._socket.onopen = function (event) {
            if (!!tId) {
              clearTimeout(tId);
            }
            YTX_CONFIG._isConnect = true;
            YTX_CONFIG._isConnecting = false;

            if (!YTX_CONFIG._isReconnect)
              YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, "Client connect to Server ");
            else {
              YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, "Client reconnect to Server ");
              YTX_CONFIG._isReconnect = false;
              var joinRoomBuilder = new window.RL_WBSS_YTX.JoinRoomBuilder(YTX_CONFIG._roomId, YTX_CONFIG._roomPass, YTX_CONFIG._roleId);
              var sendStr = YTX_CONFIG._protobuf._buildJoinRoom(joinRoomBuilder);
              if (!!sendStr) {
                YTX_CONFIG._sendMsg(sendStr)
              }
            }
            if (callback) {
              var resp = {};
              resp.code = YTX_CONFIG._errcode._SUCC;
              resp.msg = 'login server success';
              callback(resp);
            }
          };
          YTX_CONFIG._socket.onmessage = function (event) {
            //var timeStamp = YTX_CONFIG._getTimeStamp();
            YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'Client received a message');
            YTX_CONFIG._onResponse(event.data);
          };
          YTX_CONFIG._socket.onclose = function (event) {
            console.warn('main websocket has closed, error code :' + event.code + ': ' + event.reason + ': ' + event.wasClean);
            if (event.code > 1000) {
              console.warn('main websocket has closed, error code :' + event.code + ': ' + event.reason + ': ' + event.wasClean);
            }
            if (!!tId) {
              clearTimeout(tId);
            }
            YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'Client notified socket has closed', event);
            if (YTX_CONFIG._loginStatus == 2) {
              YTX_CONFIG._isConnect = false;
              YTX_CONFIG._isConnecting = false;
              YTX_CONFIG._loginStatus = 1;
              YTX_CONFIG._connectStateChange(1, "connect closeed");
              YTX_CONFIG._reconnect(function () {});
              if (!!YTX_CONFIG._intervalId) {
                window.clearInterval(YTX_CONFIG._intervalId);
              }
              YTX_CONFIG._intervalId = window.setInterval(YTX_CONFIG._heartBeat, YTX_CONFIG._heartBeatInterval._RECONNECT * 1000)
            } else if (YTX_CONFIG._isConnecting) {
              YTX_CONFIG._isConnecting = false;
              var resp = {};
              resp.code = YTX_CONFIG._errcode._NETWORK_ERR;
              resp.msg = 'connecting to websocket, please wait.';
              onError(resp);
              return;
            }
            YTX_CONFIG._isConnecting = false;
          };
          YTX_CONFIG._socket.onerror = function (event) {
            console.warn('main websocket has exception, error code');
          }
        } else {
          YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'Client is connecting to server, please wait')
        }
      } else {
        YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'Client has been connected server');
        // if(YTX_CONFIG._loginStatus == 1) {
        //     var sendStr = YTX_CONFIG._protobuf._buildLogin(type, callback, onError, sig, timestamp);
        //     if(!!sendStr) {
        //         YTX_CONFIG._loginStatus = 2;
        //         YTX_CONFIG._sendMsg(sendStr);
        //     }
        // } else if(YTX_CONFIG._loginStatus == 2) {
        //     YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'user is logining, please wait..');
        // } else {
        //     YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'user has login');
        // }
      }
    },
    //检查状态
    _checkState: function (onErr) {
      var resp = {};
      if (!YTX_CONFIG._userId || !YTX_CONFIG._appId || !YTX_CONFIG._authKey) {
        resp.code = YTX_CONFIG._errcode._NO_LOGIN;
        resp.msg = 'user not init';
        onErr(resp);
        return false;
      }
      if (!YTX_CONFIG._isConnect) {
        resp.code = YTX_CONFIG._errcode._CONNECT_WEB_SERVER_ERROR;
        resp.msg = 'not connect web socket server';
        onErr(resp);
        return false;
      }

      return true;
    },
    //连接状态更改
    _connectStateChange: function (code, msg) {
      if (YTX_CONFIG._connectStatListener) {
        var resp = {};
        resp.code = code;
        resp.msg = msg;
        YTX_CONFIG._connectStatListener(resp);
      }
    },
    //重新连接
    _reconnect: function (callback) {
      YTX_CONFIG._connectStateChange(2, "reconnect to server");
      YTX_CONFIG._isReconnect = true;
      YTX_CONFIG._initScoket(callback, function () {}, true);
    },
    //心跳
    _heartBeat: function () {
      YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "heartBeat start");
      if (!YTX_CONFIG._isReconnect) {
        if (YTX_CONFIG._isSupportHeartBeatInConnect) {
          var heartBeatStr = YTX_CONFIG._protobuf._buildHeartBeat();
          YTX_CONFIG._sendMsg(heartBeatStr);
        }
      } else if (!YTX_CONFIG._isConnecting) {
        YTX_CONFIG._reconnect(function () {});
      }
    },
    //心跳回调
    _heartBeatCallBack: function (obj) {
      YTX_CONFIG._heartBeatErrNum = 0;
      if (!!obj) {
        clearTimeout(obj);
      }
      YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, "heartBeat succ");
    },
    //心跳回调报错
    _heartBeatCallBackErr: function (times) {
      YTX_CONFIG._log(YTX_CONFIG._logLevStat._INFO, "heart beak err");
      if ((!YTX_CONFIG._isConnect) || (YTX_CONFIG._loginStatus == 1) || times > 3) {
        if (YTX_CONFIG._loginStatus == 2) {
          YTX_CONFIG._connectStateChange(1, "connect closeed");
        }
        YTX_CONFIG._loginStatus = 1;
        YTX_CONFIG._socket.close();
        YTX_CONFIG._socket = null;
        YTX_CONFIG._isConnect = false;
        YTX_CONFIG._isReconnect = true;
        YTX_CONFIG._reconnect(function () {});
        if (!YTX_CONFIG._failIntervalId) {
          YTX_CONFIG._failIntervalId = window.setInterval(YTX_CONFIG._heartBeat, YTX_CONFIG._failHeartBeatInterval * 1000)
        }
        if (!!YTX_CONFIG._intervalId) {
          clearInterval(YTX_CONFIG._intervalId);
          YTX_CONFIG._intervalId = null;
        }
      }
    },
    //获取时间戳
    _getTimeStamp: function () {
      var now = new Date();
      var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : "0" + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds());
      return timestamp;
    },
    //取整
    _mathRound: function (value) {
      return Math.round(value);
    },
    //报错
    _throwError: function (code, msg, onError) {
      var resp = {};
      resp.code = code;
      resp.msg = msg;
      if (onError)
        onError(resp);
    },
    //未初始化插座
    _unInitSocket: function () {
      try {
        YTX_CONFIG._socket.close();
      } catch (e) {}
      YTX_CONFIG._socket = null;
      YTX_CONFIG._isConnect = false;
      YTX_CONFIG._isConnecting = false;
      YTX_CONFIG._isReconnect = false;

      if (!!YTX_CONFIG._intervalId)
        window.clearInterval(YTX_CONFIG._intervalId);

      if (!!YTX_CONFIG._failHeartBeatInterval)
        window.clearInterval(YTX_CONFIG._failHeartBeatInterval);
    },
    // 用户和房间数据
    _clearRoomInfo: function () {
      // 用户和房间数据
      YTX_CONFIG._clientMap = {};
      YTX_CONFIG._roomId = -1;

      YTX_CONFIG._drawContext.curRoom = -1;
      YTX_CONFIG._drawContext.curDocId = 0;
      YTX_CONFIG._drawContext.curPage = 1;
      YTX_CONFIG._roomInfoMap = [];
    },
    _protobuf: {
      //建立心跳
      _buildHeartBeat: function () {
        var id = setTimeout(YTX_CONFIG._heartBeatCallBackErr(++YTX_CONFIG._heartBeatErrNum), YTX_CONFIG._heartBeatTimeOut * 1000);
        return '{"hb":' + id + '}'
      },
      //绘制数据
      _buildDrawData: function (node) {
        //var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = ++YTX_CONFIG._clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        // this._drawId = drawId;
        // this._type = type;
        // this._lineWidth = lineWidth;
        // this._lineColor = !!lineColor ? lineColor : 0;
        // this._isFill =  isFill;
        // this._coordinates = coordinates;
        // this._isValid = true;
        // this._isUndo = false;
        // this._isFinal = false;

        var coors = [];
        var _coordinates = node._coordinates;
        for (var i in _coordinates) {
          coors.push(_coordinates[i].x);
          coors.push(_coordinates[i].y);
        }

        var drawData = new Object();
        drawData["drawID"] = node._drawId;
        drawData["docID"] = YTX_CONFIG.getCurDocId();
        drawData["pageIndex"] = YTX_CONFIG.getCurPageId().toString();
        drawData["coordinates"] = coors;
        drawData["color"] = node._lineColor;
        drawData["shapeType"] = node._type;
        drawData["isFinal"] = node._isFinal;
        drawData["lineSize"] = node._lineWidth;
        drawData["isFill"] = node._isFill;
        drawData["drawAreaWidth"] = node._drawAreaWidth;
        drawData["drawAreaHeight"] = node._drawAreaHeight;
        if (!!node._textObj) {
          drawData["fontText"] = node._textObj["text"];
          drawData["fontType"] = "wbss_fangzheng_font.ttf"; // 目前只支持一种字体
        }
        // drawData["fontType"] = "sadfas";
        // drawData["startX"] = 100.5;
        // drawData["startY"] = 200.0;
        // drawData["endX"] = 200.1;
        // drawData["endY"] = 200.5;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['data'] = drawData;
        sendJsonStr = JSON.stringify(sendJsonStr);
        YTX_CONFIG._sendMsg('{\"type\":' + YTX_CONFIG._prototype.WbssDrawReq + ',\"payload\":' + sendJsonStr + '}');
      },

      _buildCreateRoom: function (createRoomBuilder, callback, onError) {
        if (!YTX_CONFIG._checkState(onError)) {
          return null;
        }

        if (YTX_CONFIG._canvasAppManager)
          YTX_CONFIG._canvasAppManager.registerMouseEvent();

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['roomType'] = createRoomBuilder.getRoomType();
        sendJsonStr['memberLimit'] = createRoomBuilder.getMemberLimit();
        sendJsonStr['password'] = createRoomBuilder.getPassword();
        sendJsonStr['appID'] = YTX_CONFIG._appId;
        sendJsonStr['roleID'] = createRoomBuilder.getRoleId();
        sendJsonStr['wbCreateorScale'] = YTX_CONFIG._drawContext.wbRatio;
        sendJsonStr['wbCreateorDevice'] = 3;
        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.CreateRoomReq + ',\"payload\":' + sendJsonStr + '}';
      },
      //建立加入室
      _buildJoinRoom: function (joinRoomBuilder, callback, onError) {
        if (YTX_CONFIG._canvasAppManager)
          YTX_CONFIG._canvasAppManager.registerMouseEvent();

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = joinRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['password'] = joinRoomBuilder.getPassword();
        sendJsonStr['appID'] = YTX_CONFIG._appId;
        sendJsonStr['roleID'] = joinRoomBuilder.getRoleId();

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.JoinRoomReq + ',\"payload\":' + sendJsonStr + '}';
      },
      //建立删除室
      _buildDeleteRoom: function (deleteRoomBuilder, callback, onError) {
        if (!deleteRoomBuilder || !deleteRoomBuilder.getRoomId()) {
          var resp = {};
          resp.code = YTX_CONFIG._errcode._INVALID_PARAM;
          resp.msg = 'param invalid';
          if (onError)
            onError(resp);
          return;
        }

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = deleteRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;

        sendJsonStr = JSON.stringify(sendJsonStr);
        //log(YTX_CONFIG._logLev._DEBUG, sendJsonStr);
        //return sendJsonStr;
        return '{\"type\":' + YTX_CONFIG._prototype.DeleteRoomReq + ',\"payload\":' + sendJsonStr + '}';
      }, //建立离开室
      _buildLeaveRoom: function (leaveRoomBuilder, callback, onError) {
        if (!leaveRoomBuilder || !leaveRoomBuilder.getRoomId()) {
          var resp = {};
          resp.code = YTX_CONFIG._errcode._INVALID_PARAM;
          resp.msg = 'param invalid';
          if (onError)
            onError(resp);
          return;
        }

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = leaveRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.LeaveRoomReq + ',\"payload\":' + sendJsonStr + '}';
      },
      //建立清除室
      _buildClearRoom: function (clearRoomBuilder, callback, onError) {
        if (!clearRoomBuilder || !clearRoomBuilder.getRoomId()) {
          var resp = {};
          resp.code = YTX_CONFIG._errcode._NO_REQUIRED_PARAM;
          resp.msg = 'param invalid';
          if (onError)
            onError(resp);
          return;
        }

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = clearRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;

        sendJsonStr = JSON.stringify(sendJsonStr);
        //log(YTX_CONFIG._logLev._DEBUG, sendJsonStr);
        //return sendJsonStr;
        return '{\"type\":' + YTX_CONFIG._prototype.ClearRoomReq + ',\"payload\":' + sendJsonStr + '}';
      },
      //建立共享文档
      _buildShareDoc: function (shareDocBuilder, callback, onError) {
        if (!shareDocBuilder || (!shareDocBuilder.getRoomId() && !!shareDocBuilder.getDocId())) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._INVALID_PARAM, 'param invalid', onError);
          return;
        }
        //if(shareDocBuilder.getDocId() == YTX_CONFIG.getCurDocId()) {
        //
        //    // 当前正在共享，重复共享
        //    YTX_CONFIG._throwError(YTX_CONFIG._errcode._SHAREDOC_REPEAT_ERROR, 'param invalid', onError);
        //}
        var roomId = shareDocBuilder.getRoomId();
        var docId = shareDocBuilder.getDocId();
        var di = YTX_CONFIG.getDocInfo(roomId, docId);
        // debugger
        var toDocPageIndex = di.getCurPageIndex();
        YTX_CONFIG.updateRDP(roomId, docId, toDocPageIndex);

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = shareDocBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr["docID"] = shareDocBuilder.getDocId();
        sendJsonStr["pageIndex"] = toDocPageIndex;

        sendJsonStr = JSON.stringify(sendJsonStr);
        //console.log(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.ShareDocReq + ',\"payload\":' + sendJsonStr + '}';
      },
      //建立删除共享文档
      _buildRemoveDoc: function (removeDocBuilder, callback, onError) {
        if (!removeDocBuilder || !removeDocBuilder.getRoomId() ||
          !removeDocBuilder.getDocId()) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }
        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);
        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = removeDocBuilder.getRoomId();
        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.RemoveShareDocReq + ',\"payload\":' + sendJsonStr + '}';
      },
      //建立下一个白板
      _buildGotoPage: function (gotoPageBuilder, callback, onError) {
        if (!gotoPageBuilder || !gotoPageBuilder.getPageId()) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }

        YTX_CONFIG.updateRDP(gotoPageBuilder.getRoomId(), gotoPageBuilder.getDocId(), parseInt(gotoPageBuilder.getPageId()));

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = gotoPageBuilder.getDocId();
        sendJsonStr['pageIndex'] = gotoPageBuilder.getPageId();

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.GotoPageReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildGotoNextPage: function (callback, onError) {
        var nextPageId = YTX_CONFIG.getCurPageId() + 1;
        if (!YTX_CONFIG.findPageId(YTX_CONFIG.getCurDocId(), nextPageId)) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }
        YTX_CONFIG.updateRDP(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId(), nextPageId);

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = YTX_CONFIG.getCurDocId();
        sendJsonStr['pageIndex'] = nextPageId;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.GotoPageReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildGotoPrevPage: function (callback, onError) {
        var nextPageId = YTX_CONFIG.getCurPageId() - 1;
        if (!YTX_CONFIG.findPageId(YTX_CONFIG.getCurDocId(), nextPageId)) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }
        YTX_CONFIG.updateRDP(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId(), nextPageId);

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = YTX_CONFIG.getCurDocId();
        sendJsonStr['pageIndex'] = nextPageId;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.GotoPageReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildDrawUndo: function (type, callback, onError) {
        if (!type || (type != 0 && type != 1)) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }

        log(YTX_CONFIG._logLev._DEBUG, "_buildDrawUndo");
        var drawId = "";
        drawId = YTX_CONFIG.setElementNodeDrawUndo();
        if (drawId == "") {
          log(YTX_CONFIG._logLev._DEBUG, "drawId == null");
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }
        log(YTX_CONFIG._logLev._DEBUG, "drawId" + drawId);

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = YTX_CONFIG.getCurDocId();
        sendJsonStr['drawID'] = drawId;
        sendJsonStr['pageIndex'] = YTX_CONFIG.getCurPageId();
        sendJsonStr['type'] = false; // 0代表撤销

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.DrawUndoReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildDrawRedo: function (callback, onError) {
        log(YTX_CONFIG._logLev._DEBUG, "_buildDrawRedo");
        var drawId = "";
        drawId = YTX_CONFIG.setElementNodeDrawRedo();
        if (drawId == "") {
          log(YTX_CONFIG._logLev._DEBUG, "drawId == null");
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }
        log(YTX_CONFIG._logLev._DEBUG, "drawId =" + drawId);

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = YTX_CONFIG.getCurDocId();
        sendJsonStr['drawID'] = drawId;
        sendJsonStr['pageIndex'] = YTX_CONFIG.getCurPageId();
        sendJsonStr['type'] = true; // true代表恢复

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.DrawUndoReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildDrawRdo: function (callback, onError) {
        var drawId = "11";

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = YTX_CONFIG.getCurDocId();
        sendJsonStr['drawID'] = drawId;
        sendJsonStr['pageIndex'] = YTX_CONFIG.getCurPageId();
        sendJsonStr['type'] = 1; // 1代表恢复

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.DrawUndoReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildDeleteElement: function (drawId, callback, onError) {
        var pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) return;

        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = YTX_CONFIG._drawContext.curDoc;
        sendJsonStr['pageIndex'] = YTX_CONFIG._drawContext.curPage;
        sendJsonStr['type'] = YTX_CONFIG._drawDelType.DRAW_DEL_TYPE_LINE;
        sendJsonStr['drawID'] = drawId;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.WbssDeleteDrawReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildClearCurrentPage: function (callback, onError) {
        var pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) return;

        pi.clearElementNode(2);
        var clientNo = YTX_CONFIG._generateClientNo(callback, onError);

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = YTX_CONFIG._drawContext.curDoc;
        sendJsonStr['pageIndex'] = YTX_CONFIG._drawContext.curPage;
        sendJsonStr['type'] = YTX_CONFIG._drawDelType.DRAW_DEL_TYPE_PAGE;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return '{\"type\":' + YTX_CONFIG._prototype.WbssDeleteDrawReq + ',\"payload\":' + sendJsonStr + '}';
      },
      _buildScale: function (scaleBuilder, callback, onError) {
        if (!scaleBuilder || scaleBuilder.getRatio() >= 1.0 || scaleBuilder.getRatio() <= -1.0) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._NO_REQUIRED_PARAM, 'param invalid', onError);
          return;
        }
        log(YTX_CONFIG._logLev._DEBUG, "SCALE");
        var type = scaleBuilder.getScaleMode();
        var ratio = scaleBuilder.getRatio();
        var pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) {
          return;
        }
        var di = YTX_CONFIG.getDocInfo();
        if (!di) {
          return;
        }
        var originalImgInfo = di.getOriginalImgInfo();
        if (!originalImgInfo) return;
        var originalWidth = originalImgInfo["width"];
        var originalHeight = originalImgInfo["height"];
        var newFromX, newFromY, newViewWidth, newViewHeight;
        if (type == 0) { // 步长缩放
          log(YTX_CONFIG._logLev._DEBUG, "originalInfo={" + originalWidth + "," + originalHeight + "}");
          newFromX = pi.fromX - Math.round(originalWidth * ratio / 2.0);
          newFromY = pi.fromY - Math.round(originalHeight * ratio / 2.0);
          newViewWidth = pi.viewWidth + Math.round(originalWidth * ratio);
          newViewHeight = pi.viewHeight + Math.round(originalHeight * ratio);
        } else if (type == 1) { // 全比例缩放
          // do something
          // todo...
        } else {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._INVALID_PARAM, 'param invalid', onError);
          return;
        }
        if (newViewWidth / pi.viewHeight < 0.1) {
          YTX_CONFIG._throwError(YTX_CONFIG._errcode._OUT_OF_RANGE_ERROR, 'now is lease or max, out of range', onError);
          return;
        }
        pi.fromX = newFromX;
        pi.fromY = newFromY;
        pi.viewWidth = newViewWidth;
        pi.viewHeight = newViewHeight;
        // 通知重绘
        YTX_CONFIG._rePaint();
      },
    },
    _parseCreateRoomResp: function (obj, request) {
      log(YTX_CONFIG._logLev._DEBUG, "=====onCreateRoom()=====");
      var head = obj["head"];
      var roomId = head["roomID"];
      var respCode = head["respCode"];
      var respMsg = head["reason"];
      if (respCode == 0) {
        YTX_CONFIG._loginStatus = 2;
        if (!!YTX_CONFIG._intervalId) {
          window.clearInterval(YTX_CONFIG._intervalId);
        }
        YTX_CONFIG._intervalId = window.setInterval(YTX_CONFIG._heartBeat, YTX_CONFIG._heartBeatInterval._TEST_NETWORK * 1000);
        if (!!YTX_CONFIG._failIntervalId) {
          clearInterval(YTX_CONFIG._failIntervalId);
          YTX_CONFIG._failIntervalId = null;
        }
        YTX_CONFIG._roomId = roomId;
        var ri = new YTX_CONFIG.RoomInfo(roomId);
        YTX_CONFIG._roomInfoMap[roomId] = ri;
        YTX_CONFIG.updateRDP(roomId, 0, 1);
      }
      var resp = {};
      resp.code = respCode;
      resp.msg = respMsg;
      resp.roomId = roomId;
      request.callback(resp);
    },
    _parseJoinRoomResp: function (obj, request) {
      log(YTX_CONFIG._logLev._DEBUG, "=====onJoinRoom()=====");
      var head = obj["head"];
      var roomId = head["roomID"];
      var respCode = head["respCode"];
      var respMsg = head["reason"];
      var cbData = {};
      if (respCode == 0) {
        YTX_CONFIG._loginStatus = 2;
        if (!!YTX_CONFIG._intervalId) {
          window.clearInterval(YTX_CONFIG._intervalId);
        }
        YTX_CONFIG._intervalId = window.setInterval(YTX_CONFIG._heartBeat, YTX_CONFIG._heartBeatInterval._TEST_NETWORK * 1000);
        if (!!YTX_CONFIG._failIntervalId) {
          clearInterval(YTX_CONFIG._failIntervalId);
          YTX_CONFIG._failIntervalId = null;
        }

        var wbScale = obj["wbCreateorScale"];
        if (!wbScale) wbScale = 0;
        YTX_CONFIG._drawContext.wbRatio = wbScale;
        YTX_CONFIG._roomId = roomId;
        var ri = new YTX_CONFIG.RoomInfo(roomId);
        YTX_CONFIG._roomInfoMap[roomId] = ri;
        var curDocId = obj["curDocID"];
        var curPageIndex = obj["curPageIndex"]
        var docArr = obj["docData"];
        var cbDocData = [];
        for (var i in docArr) {
          var doc = docArr[i]
          var docId = doc["docID"];
          cbDocData.push({
            docId: docId,
            filename: (docId == 0 ? "whitebord" : doc["filename"]),
            pages: doc["totalPage"]
          });
          if (docId > 0) {
            var di = new YTX_CONFIG.DocInfo(docId, doc["filename"], doc["totalPage"], doc["url"], "");
            ri.addDocInfo(di);
          }
          if (curDocId == docId) {
            YTX_CONFIG.getDocPageImages(roomId, curDocId, doc["totalPage"], ++YTX_CONFIG._clientNo);
            var curDocTimestamp = doc["timestamp"];
            if (curDocTimestamp > 0) {
              // sync drawdata
              YTX_CONFIG.syncDrawData(roomId, docId, curDocTimestamp);
            }
          }

        }

        YTX_CONFIG.updateRDP(roomId, curDocId, curPageIndex);

        cbData["curDocId"] = curDocId;
        cbData["curPageId"] = curPageIndex;
        cbData["docs"] = cbDocData;
      }
      var resp = {};
      resp.code = respCode;
      resp.msg = respMsg;
      resp.roomInfo = cbData;
      // console.log(resp);
      // console.log(obj2string(resp));
      request.callback(resp);
    },
    _parseLeaveRoomResp: function (obj, request) {
      log(YTX_CONFIG._logLev._DEBUG, "=====onLeaveRoom()=====");
      var head = obj["head"];
      var roomId = head["roomID"];
      var respCode = head["respCode"];
      var respMsg = head["reason"];

      if (respCode == 0) {
        YTX_CONFIG._loginStatus = 1;

        YTX_CONFIG._unInitSocket();

        YTX_CONFIG._clearRoomInfo();

        YTX_CONFIG._canvasAppManager.removeMouseEvent();
      }
      var resp = {};
      resp.code = respCode;
      resp.msg = respMsg;
      request.callback(resp);
    },
    _parseDeleteRoomResp: function (obj, request) {
      log(YTX_CONFIG._logLev._DEBUG, "=====onDeleteRoom()=====");
      var head = obj["head"];
      var roomId = head["roomID"];
      var respCode = head["respCode"];
      var respMsg = head["reason"];

      if (respCode == 0) {
        YTX_CONFIG._loginStatus = 1;

        YTX_CONFIG._unInitSocket();

        YTX_CONFIG._clearRoomInfo();

        YTX_CONFIG._canvasAppManager.removeMouseEvent();
      }
      var resp = {};
      resp.code = respCode;
      resp.msg = respMsg;
      request.callback(resp);
    },
    _parseKickoutResp: function (obj, request) {

    },
    _parseClearRoomResp: function (obj, request) {

    },
    _parseSyncRoomDataResp: function (obj, request) {
      var head = obj["head"];
      var roomId = head["roomID"];
      var respCode = head["respCode"];
      var respMsg = head["reason"];
      var data = obj["data"];
      var docId = 0;

      if (respCode == 0) {
        if (!data)
          return;
        var node;
        var newTimestamp = 0;
        for (var i = 0; i < data.length; i++) {
          //log(YTX_CONFIG._logLev._DEBUG, "i=" + i + "data.length=" + data.length);
          node = data[i];
          if (node["timestamp"] > newTimestamp) {
            newTimestamp = node["timestamp"];
          }
          docId = node["docID"];
          var pageId = node["pageIndex"];
          var node = YTX_CONFIG.createElementNode(node);
          YTX_CONFIG.addServerDrawData(roomId, docId, pageId, node, newTimestamp, false);
        }
        YTX_CONFIG._rePaint();

        if (data.length >= 100) {
          YTX_CONFIG.syncDrawData(roomId, docId, newTimestamp);
        }
      }
    },
    _parseShareDocResp: function (obj, request) {
      log(YTX_CONFIG._logLev._DEBUG, "=====onShareDoc=====");
      var head = obj["head"];
      var roomId = head["roomID"];
      var respCode = head["respCode"];
      var respMsg = head["reason"];
      var docId = obj["docID"];
      var pageIndex = obj["pageIndex"];
      var timestamp = obj["timestamp"];

      YTX_CONFIG.syncDrawData(roomId, docId, timestamp);

      var di = YTX_CONFIG.getDocInfo(roomId, docId);
      var pageSize = di.getPageSize();

      // 判断是否下载图片
      YTX_CONFIG.getDocPageImages(roomId, docId, pageSize, ++YTX_CONFIG._clientNo);

      if (!!request.callback) {
        var resp = {};
        resp.code = respCode;
        resp.msg = respMsg;
        resp.docId = docId;
        resp.pageId = pageIndex;
        YTX_CONFIG._log(YTX_CONFIG._DEBUG, resp);
        request.callback(resp);
      }
    },
    _parseRemoveShareDocResp: function (obj, request) {

    },
    _parseGotoPageResp: function (obj, request) {
      log(YTX_CONFIG._logLev._DEBUG, "=====onGotoPage=====");
      var head = obj["head"];
      var roomId = head["roomID"];
      var respCode = head["respCode"];
      var code = head["reason"];
      var pageIndex = obj["pageIndex"];

      var pages = YTX_CONFIG.getDocPageSize(roomId, YTX_CONFIG.getCurDocId());

      var resp = {};
      resp.code = respCode;
      resp.roomId = roomId;
      resp.docId = YTX_CONFIG.getCurDocId();
      resp.pageId = pageIndex;
      resp.pages = pages;

      if (!!request.callback)
        request.callback(resp);
    },
    _parseRemoveWbPageResp: function (obj, request) {

    },
    _parseWbssDrawResp: function (obj, request) {

    },
    _parseWbssDeleteDrawResp: function (obj, request) {

    },
    _parseDrawUndoResp: function (obj, request) {

    },
    _parseDeleteRoomNotify: function (obj) {
      YTX_CONFIG._loginStatus = 1;

      YTX_CONFIG._unInitSocket();

      YTX_CONFIG._clearRoomInfo();

      YTX_CONFIG._canvasAppManager.removeMouseEvent();
    },
    _parseClearRoomNotify: function (obj) {

    },
    //分析成员加入通知
    _parseMemberJoinNotify: function (obj) {

    },
    _parseMemberLeaveNotify: function (obj) {

    },
    _parseShareDocNotify: function (obj) {

      var roomId = obj["head"]["roomID"];
      var docId = obj["docID"];
      var pageId = obj["pageIndex"];
      var timestamp = obj["timestamp"];
      YTX_CONFIG.syncDrawData(roomId, docId, timestamp);
      YTX_CONFIG.updateRDP(roomId, docId, pageId);

      YTX_CONFIG.syncDrawData(roomId, docId, timestamp);
      var pages = YTX_CONFIG.getDocPageSize(roomId, YTX_CONFIG.getCurDocId());
      // 检测是否下载文件
      var di = YTX_CONFIG.getDocInfo(roomId, docId);
      var pageSize = di.getPageSize();

      // 判断是否下载图片
      YTX_CONFIG.getDocPageImages(roomId, docId, pageSize, ++YTX_CONFIG._clientNo);

      if (!!YTX_CONFIG._onShareDocListener) {
        var resp = {};
        resp.roomId = roomId;
        resp.docId = docId;
        resp.pageId = pageId;
        resp.pages = pages;
        YTX_CONFIG._onShareDocListener(resp);
      }

    },
    _parseRemoveDocNotify: function (obj) {

    },
    _parseGotoPageNotify: function (obj) {
      log(YTX_CONFIG._logLev._DEBUG, "=====onGotoPageNotify=====");
      //{"type":44, "payload":{"head": {"authKey": "123456","userID": "QWt4vXTU9szVh7LDOrQHqBom1SKTWxGgdfjlk-sadfk","reqID": 323,"roomID": 44},"docID": 0,"pageIndex": 2}
      var roomId = obj["head"]["roomID"];
      var docId = obj["docID"];
      var pageId = obj["pageIndex"];
      var pages = YTX_CONFIG.getDocPageSize(roomId, YTX_CONFIG.getCurDocId());
      YTX_CONFIG.updateRDP(roomId, docId, pageId);
      if (!!YTX_CONFIG._onGotoPageListener) {
        var resp = {};
        resp.roomId = roomId;
        resp.docId = docId;
        resp.pageId = pageId;
        resp.pages = pages;
        YTX_CONFIG._onGotoPageListener(resp)
      }
    },
    _parseDrawNotify: function (obj) {
      var head = obj["head"];
      var data = obj["data"];
      var roomId = head["roomID"];
      var userId = head["userID"];
      var docId = data["docID"];
      var pageId = parseInt(data["pageIndex"]);
      var timestamp = data["timestamp"];
      var pi = YTX_CONFIG.getCurrentPageInfo(roomId, docId, pageId);
      if (!pi) return;
      var isSelfData = (userId == YTX_CONFIG._userId);
      var node = YTX_CONFIG.createElementNode(data);
      YTX_CONFIG.addServerDrawData(roomId, docId, pageId, node, timestamp, isSelfData);
      //YTX_CONFIG._canvasAppManager.appendElementNode(pi, node, false, isSelfData);
      YTX_CONFIG._rePaint();
    },
    _parseDrawDeleteNotify: function (obj) {
      var head = obj["head"]
      var type = obj["type"];
      var roomId = head["roomID"];
      var docId = obj["docID"];
      var pageId = obj["pageIndex"];
      var drawId = null;
      if (type == 1) {
        drawId = obj["drawID"];
      }
      var pi = YTX_CONFIG.getCurrentPageInfo(roomId, docId, pageId);
      if (!pi) return;
      pi.clearElementNode(type, drawId);
      YTX_CONFIG._rePaint();
    },
    _parseDocConvertNotify: function (obj) {
      log(YTX_CONFIG._logLev._DEBUG, "======onDocConvertNotify()======");
      var head = obj["head"];
      var reqId = head["reqID"];
      var roomId = head["roomID"];
      var docId = obj["docID"];
      var result = obj["result"];
      var userId = obj["userID"];
      if (result == 0) {
        if (YTX_CONFIG._userId == userId) { // 只有自己上传才判断
          // 删除定时器
          if (!YTX_CONFIG._docConvertMap[reqId]) {
            log(YTX_CONFIG._logLev._DEBUG, "docConvertMap not has data")
            return;
          }
          var tId = YTX_CONFIG._docConvertMap[reqId].tId;
          clearTimeout(tId);
          delete YTX_CONFIG._docConvertMap[reqId];
        }

        // 添加文档
        YTX_CONFIG.addDocInfo(roomId, docId, obj["filename"], obj["totalPage"], obj["url"], obj["userID"]);

        // 下载图片
        YTX_CONFIG.getDocPageImages(roomId, docId, obj["totalPage"], ++YTX_CONFIG._clientNo);
      } else {

      }
      // callback
      if (YTX_CONFIG._onDocConvertListener) {
        var resp = {};
        resp.code = result;
        resp.msg = obj["reason"];
        resp.roomId = roomId;
        //roomId, docId, totalPage, filename.c_str()
        resp.docId = docId;
        resp.filename = obj["filename"];
        resp.totalPage = obj["totalPage"];
        YTX_CONFIG._onDocConvertListener(resp);
      }
    },
    _parseDrawUndoNotify: function (obj) {
      var roomId = obj["head"]["roomID"];
      var docId = obj["docID"];
      var pageId = obj["pageIndex"];
      var drawId = obj["drawID"];
      var type = obj["type"];
      YTX_CONFIG.setDrawIdUndoStatus(roomId, docId, pageId, drawId, type);
      YTX_CONFIG._rePaint();
    },
    _parseKickOutNotify: function (obj) {
      YTX_CONFIG._loginStatus = 1;

      YTX_CONFIG._unInitSocket();

      YTX_CONFIG._clearRoomInfo();

      YTX_CONFIG._canvasAppManager.removeMouseEvent();
    },
    _canvasAppManager: null,
    _canvasApp: function () {
      if (!canvasSupport()) {
        return;
      }
      // get canvas object
      // var canvas = document.getElementById("canvas");
      var canvas = YTX_CONFIG._canvas;
      var context = canvas.getContext("2d");

      //YTX_CONFIG._canvas = canvas;
      //console.log("xxxxxxxxxxxxxxxxxxxxx=" + canvas);
      // YTX_CONFIG._drawContext.initDrawContext();

      // register mouse event
      canvas.addEventListener("mousedown", doMouseDown, false);
      canvas.addEventListener('mousemove', doMouseMove, false);
      canvas.addEventListener('mouseup', doMouseUp, false);
      canvas.addEventListener("mouseleave", doMouseLeave, false);
      var isRegisterMouserEvent = true;

      $(window).resize(resizeCanvas);

      function resizeCanvas() {
        YTX_CONFIG._rePaint();
      };

      var MOUSE_EVENT_STATUS = {
        EVENT_NONE: 0,
        EVENT_DOWN: 1,
        EVENT_MOVE: 2,
        EVENT_UP: 3
      }

      var mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_NONE;
      var pressDown = false; // 鼠标是否按下
      var posDown = {}; // 鼠标按下坐标
      var posMove = {}; // 鼠标移动坐标
      var tmpCoordinates = []; // 坐标点缓冲数组
      var lastTime = 0;
      // var shapeType = 1; // 当前绘制类型
      var test = 50;
      var index = 0;
      var strDrawId = ""; // 每次生成图形的唯一标识drawId

      var fromX = 0;
      var fromY = 0;
      var viewWidth = 500;
      var viewHeight = 300;

      var pi = null;

      // var img = new Image();
      // img.src = "bg.jpg";
      //img.src = "test_8bit.bmp";

      var image = null;

      //Debugger.log("Drawing Canvas");

      // ===================test=======================
      // var coors = [];
      // coors.push({x: 250, y: 150});
      // coors.push({x: 500, y: 300});
      // coors.push({x: 180, y: 127});
      // screenToWorldCoors(coors);
      // printCoordinates(coors);
      //
      // var coors1 = [];
      // coors1.push({x: 1.0, y: -0.5});
      //
      // worldToScreenCoors(coors1);
      // printCoordinates(coors1);

      // var testRoomId = 22;
      // var ri = new YTX_CONFIG.RoomInfo(testRoomId);
      // YTX_CONFIG._roomInfoMap[testRoomId] = ri;
      // //log(YTX_CONFIG._logLev._DEBUG, '_roomInfoMap=' + obj2string(YTX_CONFIG._roomInfoMap));
      // var di = new YTX_CONFIG.DocInfo(1, "mingyang.txt", 10, "", "mingyang");
      // ri.addDocInfo(di);
      // YTX_CONFIG.updateRDP(testRoomId, 1, 1);

      this.registerMouseEvent = function () {
        if (!isRegisterMouserEvent) {
          isRegisterMouserEvent = true;
          canvas.addEventListener("mousedown", doMouseDown, false);
          canvas.addEventListener('mousemove', doMouseMove, false);
          canvas.addEventListener('mouseup', doMouseUp, false);
          canvas.addEventListener("mouseleave", doMouseLeave, false);
        }
      }

      this.removeMouseEvent = function () {
        if (isRegisterMouserEvent) {
          canvas.removeEventListener("mousedown", doMouseDown, false);
          canvas.removeEventListener('mousemove', doMouseMove, false);
          canvas.removeEventListener('mouseup', doMouseUp, false);
          canvas.removeEventListener("mouseleave", doMouseLeave, false);
          isRegisterMouserEvent = false;
        }
      }

      this.appendElementNode = function (pi, node, isLocalHandle, isSelfData) {
        var drawId = node._drawId;
        // 如果缓存中有待处理元素直接更新
        if (drawId in pi.elementNodeMap) {
          var piNode = pi.elementNodeMap[drawId];
          if (piNode._type == RL_WBSS_YTX._shapeType.FREELINE) {
            if (isLocalHandle || !isSelfData)
              piNode.appendCoordinates(node._coordinates);
          } else if (piNode._type == RL_WBSS_YTX._shapeType.FONT) {
            // 字体暂不处理
            return;
          } else if (piNode._type == RL_WBSS_YTX._shapeType.LASERPEN) {
            // 激光笔
            if (isLocalHandle || !isSelfData) {
              piNode._coordinates[0].x = node._coordinates[0].x;
              piNode._coordinates[0].y = node._coordinates[0].y;
              piNode._isValid = !node._isFinal;
            }
          } else {
            if (isLocalHandle || !isSelfData) {
              piNode._coordinates[1].x = node._coordinates[1].x;
              piNode._coordinates[1].y = node._coordinates[1].y;
            }
          }
          return;
        }

        pi.elementNodeList.push(node);
        pi.elementNodeMap[drawId] = node;
      }

      this.appendElementNode2 = function (pi, node, isLocalHandle, isSelfData) {
        var drawId = node._drawId;
        // 如果缓存中有待处理元素直接更新
        if (drawId in pi.elementNodeMap) {
          var piNode = pi.elementNodeMap[drawId];
          if (piNode._type == RL_WBSS_YTX._shapeType.FREELINE) {
            if (isLocalHandle || !isSelfData)
              piNode.appendCoordinates(node._coordinates);
            return;
          } else {
            if (node._isFinal && !isLocalHandle) { // 服务器的最终划线更新到map
              piNode._isValid = false;
            } else { // 中间过程线直接修改顶点数据
              if (isSelfData)
                piNode._coordinates[1].x = node._coordinates[1].x;
              piNode._coordinates[1].y = node._coordinates[1].y;
              return;
            }
          }
        }

        pi.elementNodeList.push(node);
        pi.elementNodeMap[drawId] = node;
      }

      // 生成图形元素
      function generateElementNode(eventSatus) {
        // 获取当前页对象
        var pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) return;

        // 屏幕转换为相对绘制区的世界坐标
        if (YTX_CONFIG._drawContext.shapeType == RL_WBSS_YTX._shapeType.LASERPEN) {
          tmpCoordinates = [];
          if (eventSatus == MOUSE_EVENT_STATUS.EVENT_DOWN)
            tmpCoordinates.push({
              x: posDown.x,
              y: posDown.y
            });
          else
            tmpCoordinates.push({
              x: posMove.x,
              y: posMove.y
            });
          tmpCoordinates.push({
            x: 0,
            y: 0
          });
        } else if (YTX_CONFIG._drawContext.shapeType != RL_WBSS_YTX._shapeType.FREELINE) {
          tmpCoordinates = [];
          tmpCoordinates.push({
            x: posDown.x,
            y: posDown.y
          });
          tmpCoordinates.push({
            x: posMove.x,
            y: posMove.y
          });
        }
        screenToWorldCoors(pi, tmpCoordinates);

        // 数组顶点拷贝
        var coors = [];
        if (YTX_CONFIG._drawContext.shapeType == RL_WBSS_YTX._shapeType.FREELINE) {
          for (var i = 0; i < tmpCoordinates.length; i++) {
            coors.push({
              x: tmpCoordinates[i].x,
              y: tmpCoordinates[i].y
            });
          }
        } else {
          coors.push({
            x: tmpCoordinates[0].x,
            y: tmpCoordinates[0].y
          });
          coors.push({
            x: tmpCoordinates[1].x,
            y: tmpCoordinates[1].y
          });
        }

        // 添加元素
        var node = new YTX_CONFIG.ElementNode(strDrawId,
          YTX_CONFIG._drawContext.shapeType,
          YTX_CONFIG._drawContext.lineWidth,
          YTX_CONFIG._drawContext.lineColor,
          YTX_CONFIG._drawContext.isFillMode,
          coors,
          pi.viewWidth,
          pi.viewHeight,
          eventSatus == MOUSE_EVENT_STATUS.EVENT_UP ? true : false);

        // 激光笔up状态设置无效
        if (YTX_CONFIG._drawContext.shapeType == RL_WBSS_YTX._shapeType.LASERPEN &&
          eventSatus == MOUSE_EVENT_STATUS.EVENT_UP ? true : false) {
          node.setIsValid(false);
        }

        YTX_CONFIG._canvasAppManager.appendElementNode(pi, node, true, true);

        // 渲染
        YTX_CONFIG._canvasAppManager.drawScreen();

        log(YTX_CONFIG._logLev._DEBUG, "_buildDrawData");
        // 发送渲染数据到服务器
        YTX_CONFIG._protobuf._buildDrawData(node);
      }

      // 生成文本元素(单独处理)
      this.generateTextNode = function (pos, text) {
        // 获取当前页对象
        var pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) return;

        var coors = []
        coors.push({
          x: pos.x,
          y: pos.y
        });
        screenToWorldCoors(pi, coors);

        var strDrawId = pi.generateDrawId(YTX_CONFIG._userId, YTX_CONFIG._drawContext.curRoom, YTX_CONFIG._drawContext.curDoc);

        var textObj = new Object();
        textObj["text"] = text;

        // 添加元素
        var node = new YTX_CONFIG.ElementNode(strDrawId,
          RL_WBSS_YTX._shapeType.FONT,
          13,
          YTX_CONFIG._drawContext.lineColor,
          YTX_CONFIG._drawContext.isFillMode,
          coors,
          pi.viewWidth,
          pi.viewHeight,
          true,
          textObj
        );

        YTX_CONFIG._canvasAppManager.appendElementNode(pi, node, true, true);

        // 渲染
        YTX_CONFIG._canvasAppManager.drawScreen();

        log(YTX_CONFIG._logLev._DEBUG, "_buildDrawData");
        // 发送渲染数据到服务器
        YTX_CONFIG._protobuf._buildDrawData(node);
      }

      function isSelectRegion(pos, element) {
        var pos1 = {};
        var pos2 = {};
        switch (element._type) {
          case RL_WBSS_YTX._shapeType.FREELINE:
            {
              var leftX, rightX, bottomY, topY;
              leftX = element._coordinates[0].x;
              rightX = element._coordinates[0].x;
              bottomY = element._coordinates[0].y;
              topY = element._coordinates[0].y;
              for (var i = 1; i < element._coordinates.length; i++) {
                if (element._coordinates[i].x < leftX)
                  leftX = element._coordinates[i].x;
                if (element._coordinates[i].x > rightX)
                  rightX = element._coordinates[i].x;
                if (element._coordinates[i].y > bottomY)
                  bottomY = element._coordinates[i].y;
                if (element._coordinates[i].y < topY)
                  topY = element._coordinates[i].y;
              }
              pos1.x = leftX;
              pos1.y = topY;
              pos2.x = rightX;
              pos2.y = bottomY;
            }
            break;
          case RL_WBSS_YTX._shapeType.LINE:
          case RL_WBSS_YTX._shapeType.RECT:
          case RL_WBSS_YTX._shapeType.TRIANGLE:
          case RL_WBSS_YTX._shapeType.CIRCLE:
          case RL_WBSS_YTX._shapeType.ELLIPSE:
          case RL_WBSS_YTX._shapeType.ARROWMARK:
          case RL_WBSS_YTX._shapeType.FONT:
            {
              pos1.x = element._coordinates[0].x;
              pos1.y = element._coordinates[0].y;
              pos2.x = element._coordinates[1].x;
              pos2.y = element._coordinates[1].y;
            }
            break;
        }

        if (((pos.x >= pos1.x && pos.x <= pos2.x) || (pos.x <= pos1.x && pos.x >= pos2.x)) &&
          ((pos.y <= pos1.y && pos.y >= pos2.y) || (pos.y >= pos1.y && pos.y <= pos2.y))) {
          return true;
        }
        return false;
      }

      // 检测点是否选中图形
      function handleIsSelectOnPoint(pos) {
        screenToWorldCoor(pi, pos);
        if (!pi) return;
        for (var i = pi.elementNodeList.length - 1; i >= 0; i--) {
          var element = pi.elementNodeList[i];
          if (!element || !element._isValid || element._isUndo)
            continue;
          if (isSelectRegion(pos, element)) {
            element._isValid = false;
            YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "Delete Element Success");
            return element._drawId;
          }
        }
        return "";
      }

      // 鼠标按下
      function doMouseDown(event) {
        // 获取当前页对象
        pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) return;

        var loc = getPointOnCanvas(event);
        log(YTX_CONFIG._logLev._TRACE, "mouse down at point( x:" + loc.x + ", y:" + loc.y + ")");

        posDown.x = loc.x;
        posDown.y = loc.y;

        if (!isPosRangeInView(posDown)) {
          log(YTX_CONFIG._logLev._TRACE, "down pos range out");
          return;
        }

        if (YTX_CONFIG._drawContext.shapeType == RL_WBSS_YTX._shapeType.FREELINE) {
          tmpCoordinates = [];
          tmpCoordinates.push({
            x: loc.x,
            y: loc.y
          });
        }

        // 图形元素删除模式
        if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_DELETE) {
          log(YTX_CONFIG._logLev._DEBUG, "DRAW_STATUS_DELETE===");
          var drawId = handleIsSelectOnPoint(posDown);
          YTX_CONFIG._rePaint();
          log(YTX_CONFIG._logLev._DEBUG, "drawId = " + drawId);
          if (drawId != "") {
            var sendStr = YTX_CONFIG._protobuf._buildDeleteElement(drawId, function () {}, function () {});
            if (!!sendStr)
              YTX_CONFIG._sendMsg(sendStr);
          }
          return;
        }

        // 更新鼠标事件状态, idle down
        mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_DOWN;
        pressDown = true;

        // 缩放移动模式
        if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_ZOOM) {
          return;
        }

        // 图形元素移动模式
        if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_ELEMENT_MOVE) {
          return;
        }

        // 生成划线drawId, 格式:roomID-docID-pageIndex-drawNum-userID-timestamp
        strDrawId = pi.generateDrawId(YTX_CONFIG._userId, YTX_CONFIG._drawContext.curRoom, YTX_CONFIG._drawContext.curDoc);
        log(YTX_CONFIG._logLev._TRACE, "drawId=" + strDrawId);

        // 如果是激光笔直接生成图形元素
        if (YTX_CONFIG._drawContext.shapeType == RL_WBSS_YTX._shapeType.LASERPEN) {
          generateElementNode(mouseEventStatus);
        }
      }

      // 鼠标移动
      function doMouseMove(event) {
        if (mouseEventStatus != MOUSE_EVENT_STATUS.EVENT_NONE) {
          var loc = getPointOnCanvas(event);
          log(YTX_CONFIG._logLev._DEBUG, "mouse move at point( x:" + loc.x + ", y:" + loc.y + ")");
          posMove.x = loc.x;
          posMove.y = loc.y;

          if (!isPosRangeInView(posMove)) {
            log(YTX_CONFIG._logLev._DEBUG, "move pos range out");
            // 更新鼠标事件状态, idle move
            mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_NONE;

            // 生成绘制数据，并发送到服务器
            generateElementNode(MOUSE_EVENT_STATUS.EVENT_UP);
            return;
          }

          if (YTX_CONFIG._drawContext.shapeType == RL_WBSS_YTX._shapeType.FREELINE) {
            tmpCoordinates.push({
              x: loc.x,
              y: loc.y
            });
          }

          // 设定帧率间隔时间，处理数据并发送
          var nowTime = new Date().getTime();
          if (nowTime - lastTime > 50) {
            // 缩放移动模式
            if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_ZOOM) {
              log(YTX_CONFIG._logLev._DEBUG, "DRAW_STATUS_ZOOM");
              var pi = YTX_CONFIG.getCurrentPageInfo();
              if (!pi) return;

              log(YTX_CONFIG._logLev._DEBUG, "pi=(" + pi.fromX + "," + pi.fromY + ")");
              pi.fromX += (posMove.x - posDown.x);
              pi.fromY += (posMove.y - posDown.y);
              posDown.x = posMove.x;
              posDown.y = posMove.y;

              YTX_CONFIG._canvasAppManager.drawScreen();
              return;
            }

            // 元素选中删除模式
            // 元素选中移动模式
            if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_DELETE) {
              return;
            }

            // 元素选中移动模式
            if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_ELEMENT_MOVE) {
              return;
            }

            // 更新鼠标事件状态, idle move
            mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_MOVE;

            // 生成绘制数据，并发送到服务器
            generateElementNode(mouseEventStatus);

            // 清空顶点缓冲数据
            tmpCoordinates = [];
            lastTime = nowTime;
          }
        }
      }

      // 鼠标弹起
      function doMouseUp(event) {
        if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_ZOOM ||
          YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_DELETE) {
          mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_NONE;
          return;
        }
        var loc = getPointOnCanvas(event);
        log(YTX_CONFIG._logLev._DEBUG, "mouse up at point( x:" + loc.x + ", y:" + loc.y + ")");

        if (mouseEventStatus == MOUSE_EVENT_STATUS.EVENT_MOVE || YTX_CONFIG._drawContext.shapeType == RL_WBSS_YTX._shapeType.LASERPEN) {
          tmpCoordinates.push({
            x: loc.x,
            y: loc.y
          });
          //Debugger.log("tmpConordinates.x="+tmpCoordinates[1].x);
          generateElementNode(MOUSE_EVENT_STATUS.EVENT_UP);
          YTX_CONFIG._canvasAppManager.drawScreen();
        }
        // 更新鼠标事件状态,idle state
        mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_NONE;
      }

      // 鼠标离开
      function doMouseLeave(event) {
        var loc = getPointOnCanvas(event);
        log(YTX_CONFIG._logLev._TRACE, "mouse leave at point( x:" + loc.x + ", y:" + loc.y + ")");

        if (YTX_CONFIG._drawContext.drawStatus == YTX_CONFIG._drawStatus.DRAW_STATUS_ZOOM) {
          mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_NONE;
          return;
        }

        if (mouseEventStatus != MOUSE_EVENT_STATUS.EVENT_NONE) {
          generateElementNode(MOUSE_EVENT_STATUS.EVENT_UP);
          // 更新鼠标事件状态,idle state
          mouseEventStatus = MOUSE_EVENT_STATUS.EVENT_NONE;
        }
      }

      function isPosRangeInView(pos) {
        if (pi) {
          log(YTX_CONFIG._logLev._TRACE, "isPosRangeInView");
          if (pos.x < pi.fromX ||
            pos.x > (pi.fromX + pi.viewWidth) ||
            pos.y < pi.fromY ||
            pos.y > (pi.fromY + pi.viewHeight)) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      }

      // 获取canvas相对坐标
      function getPointOnCanvas(event) {
        return {
          x: event.offsetX,
          y: event.offsetY
        }
        // var x = event.pageX;
        // var y = event.pageY;
        // var canvas = event.target;
        // var bbox = canvas.getBoundingClientRect();
        // return {
        //     x: x - bbox.left * (canvas.width / bbox.width),
        //     y: y - bbox.top * (canvas.height / bbox.height)
        // };
      }

      // 画布相对坐标转换世界坐标
      function screenToWorldCoor(pi, coor) {
        if (!pi) return;
        if (YTX_CONFIG._drawContext.curDoc >= 0) {
          coor.x = Math.round(1000 * (2.0 * (coor.x - pi.fromX) / pi.viewWidth - 1.0)) / 1000; //.toFixed(3);
          coor.y = Math.round(1000 * (1.0 - 2.0 * (coor.y - pi.fromY) / pi.viewHeight)) / 1000; //.toFixed(3);
        }
      }

      // 画布相对坐标转换世界坐标
      function screenToWorldCoors(pi, coors) {
        if (!pi) return;
        if (YTX_CONFIG._drawContext.curDoc >= 0) {
          for (var i = 0; i < coors.length; i++) {
            coors[i].x = Math.round(1000 * (2.0 * (coors[i].x - pi.fromX) / pi.viewWidth - 1.0)) / 1000; //.toFixed(3);
            coors[i].y = Math.round(1000 * (1.0 - 2.0 * (coors[i].y - pi.fromY) / pi.viewHeight)) / 1000; //.toFixed(3);
          }
        }
      }

      // 世界坐标转换画布相对坐标
      function worldToScreenCoors(coors) {
        var pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) return;
        if (YTX_CONFIG._drawContext.curDoc >= 0) {
          for (var i = 0; i < coors.length; i++) {
            coors[i].x = (coors[i].x + 1.0) * pi.viewWidth / 2.0;
            coors[i].y = (1.0 - coors[i].y) * pi.viewHeight / 2.0;
            coors[i].x += pi.fromX;
            coors[i].y += pi.fromY;
          }
        }
      }

      function printCoordinates(tag, coordinates) {
        var strLog = tag;
        strLog += "[";
        for (var i = 0; i < coordinates.length; i++) {
          strLog += "(";
          strLog += +coordinates[i].x;
          strLog += ",";
          strLog += +coordinates[i].y;
          strLog += ")";

        }
        strLog += "]"
        log(YTX_CONFIG._logLev._TRACE, strLog);
      }

      function coorAssigin(dstCoors, srcCoors) {
        for (var i = 0; i < srcCoors.length; i++) {
          dstCoors.push({
            x: srcCoors[i].x,
            y: srcCoors[i].y
          });
        }
      }

      function channelFormat(colorChannel) {
        return (colorChannel.length == 2 ? colorChannel : ("0" + colorChannel));
      }

      function ParseColorIntToRgbaString(colorInt) {
        var r = (colorInt >> 24) & 0xFF;
        var g = (colorInt >> 16) & 0xFF;
        var b = (colorInt >> 8) & 0xFF;
        var a = ((colorInt >> 0) & 0xFF) / 255.0;
        //'rgba(192, 80, 77, 0.7)'
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      }

      function ParseColorIntTo16String(colorInt) {
        var r = ((colorInt >> 24) & 0xFF).toString("16");
        var g = ((colorInt >> 16) & 0xFF).toString("16");
        var b = ((colorInt >> 8) & 0xFF).toString("16");
        //console.log("(rgb)=(" + r + "," + g + "," + b + ")");
        return "#" + channelFormat(r) + channelFormat(g) + channelFormat(b);
      }

      function getZoomWidth(lineWidth, drawAreadWidth, curViewWidth) {
        if (drawAreadWidth <= 0 || viewWidth <= 0) return lineWidth;
        var w = Math.round(lineWidth * (1.0 * curViewWidth / drawAreadWidth));
        if (w < 1) w = 1;
        return w;
      }

      // 椭圆
      function EvenCompEllipse(x, y, a, b) {
        context.save();
        //选择a、b中的较大者作为arc方法的半径参数
        var r = (a > b) ? a : b;
        var ratioX = a / r; //横轴缩放比率
        var ratioY = b / r; //纵轴缩放比率
        context.scale(ratioX, ratioY); //进行缩放（均匀压缩）
        context.beginPath();
        //从椭圆的左端点开始逆时针绘制
        context.moveTo((x + a) / ratioX, y / ratioY);
        context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        context.restore();
      };

      function clearCanvas() {
        // 清空canvas
        context.clearRect(0, 0, YTX_CONFIG._drawContext.canvasLastWidth, YTX_CONFIG._drawContext.canvasLastHeight);

        // 设置canvas边框
        context.strokeStyle = "#000000";
        context.lineWidth = 1; //设置边框线框
        context.strokeRect(0, 0, YTX_CONFIG._drawContext.canvasLastWidth, YTX_CONFIG._drawContext.canvasLastHeight);

        context.fillStyle = "rgba(255, 255, 255, 0)";
        context.fillRect(0, 0, YTX_CONFIG._drawContext.canvasLastWidth, YTX_CONFIG._drawContext.canvasLastHeight); //蓝色填充矩形
      }

      // 渲染
      this.drawScreen = function () {
        YTX_CONFIG._drawCnt++;
        log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ")");
        var pi = YTX_CONFIG.getCurrentPageInfo();
        if (!pi) return;

        // 文档共享，图片处理
        if (YTX_CONFIG._drawContext.curDoc > 0) {
          // 查询图像
          if (!pi.image) {
            // var key = YTX_CONFIG.getCurRoomId().toString() + "-" + YTX_CONFIG.getCurDocId().toString() + "_" + YTX_CONFIG.getCurPageId().toString() + ".png";
            // YTX_CONFIG.getdata(YTX_CONFIG._dbInfo.dbStoreName, key, function (data) {
            //             console.log("getdata callback")
            //             blobToImage(data["imagedata"], function (img) {
            //                 pi.image = img;
            //                 YTX_CONFIG.setDocViewPosition(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId(), img.width, img.height);
            //                 console.log("img onload");
            //                 // 绘制图像
            //                 context.drawImage(pi.image, pi.fromX, pi.fromY, pi.viewWidth, pi.viewHeight);
            //                 log(YTX_CONFIG._logLev._DEBUG, "viewinfo(" + pi.fromX + "," + pi.fromY + "," + pi.viewWidth + "," + pi.viewHeight + ")");
            //             });
            // }, function () {
            //     console.log("getdata error")
            //     // 获取数据失败，下载图片
            //     YTX_CONFIG.getDocPageOneImage(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId(), YTX_CONFIG.getCurPageId(), ++YTX_CONFIG._clientNo);
            // });
            // return;
            var key = YTX_CONFIG.getCurRoomId().toString() + "-" + YTX_CONFIG.getCurDocId().toString() + "_" + YTX_CONFIG.getCurPageId().toString() + ".png";
            YTX_CONFIG.getdata(YTX_CONFIG._dbInfo.dbStoreName, key, function (data) {
              log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ") " + "getdata " + key + " success");
              var blob = data["imagedata"];
              blobToImage(blob, function (img) {
                pi.image = img;
                YTX_CONFIG.setDocViewPosition(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId(), img.width, img.height);
                YTX_CONFIG._canvasAppManager.drawScreen(); // 重绘
              });
            }, function () {
              log(YTX_CONFIG._logLev._DEBUG, "getdata " + key + " error");
              // 获取数据失败，下载图片
              //YTX_CONFIG.getDocPageOneImage(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId(), YTX_CONFIG.getCurPageId(), ++YTX_CONFIG._clientNo);
            });
            return;
          } else {
            clearCanvas();
            YTX_CONFIG.checkIfReGetViewInfo(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId());
            context.fillStyle = "rgba(0, 0, 0, 1)"; //ParseColorIntTo16String(YTX_CONFIG._drawContext.docBackgroundColor);
            context.fillRect(0, 0, canvas.width, canvas.height); //填充背景

            context.fillStyle = "rgba(255, 255, 255, 1)"; //ParseColorIntTo16String(YTX_CONFIG._drawContext.docBackgroundColor);
            context.fillRect(pi.fromX, pi.fromY, pi.viewWidth, pi.viewHeight); //填充背景

            context.drawImage(pi.image, pi.fromX, pi.fromY, pi.viewWidth, pi.viewHeight);
            log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ") " + "viewinfo(" + pi.fromX + "," + pi.fromY + "," + pi.viewWidth + "," + pi.viewHeight + ")");
          }

          // if (!pi.image) {
          //     log(YTX_CONFIG._logLev._DEBUG, "img first show, need load");
          //     var tx = YTX_CONFIG._db.transaction('docimages', 'readwrite');
          //     store = tx.objectStore('docimages');
          //     var id = YTX_CONFIG.getCurRoomId().toString() + "-" + YTX_CONFIG.getCurDocId().toString() + "_" + "1" + ".png";
          //     var request = store.get(id);
          //     request.onsuccess = function () {
          //         console.log(request.result);
          //         var data = request.result;
          //         var blob = data["imagedata"]
          //         console.log(blob);
          //
          //         blobToImage(blob, function (img) {
          //             image = img;
          //             console.log("img onload");
          //             // 绘制图像
          //             context.drawImage(image, pi.fromX, pi.fromY, pi.viewWidth, pi.viewHeight);
          //             log(YTX_CONFIG._logLev._DEBUG, "imagePos(" + pi.fromX + "," + pi.fromY + "," + pi.viewWidth + "," + pi.viewHeight + ")");
          //         });
          //
          //         console.log("img onload laters")
          //     }
          // } else {
          //     log(YTX_CONFIG._logLev._DEBUG, "img has loaded");
          //     // 绘制图像
          //     context.drawImage(image, pi.fromX, pi.fromY, pi.viewWidth, pi.viewHeight);
          //     log(YTX_CONFIG._logLev._DEBUG, "imagePos(" + pi.fromX + "," + pi.fromY + "," + pi.viewWidth + "," + pi.viewHeight + ")");
          // }
        } else {
          YTX_CONFIG.checkIfReGetViewInfo(YTX_CONFIG.getCurRoomId(), YTX_CONFIG.getCurDocId());

          // 白板
          clearCanvas();
          context.fillStyle = "gray"
          context.fillRect(0, 0, canvas.width, canvas.height); //蓝色填充矩形

          context.fillStyle = "#FFFFFF";
          log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ") " + "viewinfo(" + pi.fromX + "," + pi.fromY + "," + pi.viewWidth + "," + pi.viewHeight + ")");
          context.fillRect(pi.fromX, pi.fromY, pi.viewWidth, pi.viewHeight);
          //context.fillRect(50, 0, 300, pi.viewHeight);
        }

        // 设置裁剪
        context.save();
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.rect(pi.fromX, pi.fromY, pi.viewWidth, pi.viewHeight);
        context.stroke();
        context.clip();
        context.closePath();

        for (var i = 0; i < pi.elementNodeList.length; i++) {
          var element = pi.elementNodeList[i];
          if (!element || !element._isValid || element._isUndo)
            continue;
          // 世界坐标转换相对canvas坐标
          var coors = [];
          coorAssigin(coors, element._coordinates);
          //coors = coors.concat(element._coordinates);
          worldToScreenCoors(coors);

          // 设置线宽
          //console.log("drawAreaWidth=" + element._drawAreaWidth + ",viewWidth=" + pi.viewWidth);
          context.lineWidth = getZoomWidth(element._lineWidth, element._drawAreaWidth, pi.viewWidth);

          // 设置颜色
          var color = ParseColorIntToRgbaString(element._lineColor); //ParseColorIntTo16String(element._lineColor);
          //log(YTX_CONFIG._logLev._DEBUG, "element._lineColor=" + element._lineColor + "," + "color=" + color);
          log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ") " + "colorint=" + element._lineColor + "string=" + color);
          context.strokeStyle = color; //'rgba(0, 0, 0, 0.0)'; // 边框颜色

          // 设置其他属性
          context.lineJoin = "round";

          switch (element._type) {
            case RL_WBSS_YTX._shapeType.FREELINE:
              {
                //context.globalAlpha = 0.5;
                // context.save();
                // context.globalCompositeOperation = "destination-out";
                context.beginPath();
                // for (var j = 1; j < element._coordinates.length; j++) {
                //     context.lineTo(element._coordinates[j].x, element._coordinates[j].y);
                // }
                for (var j = 1; j < coors.length; j++) {
                  context.lineTo(coors[j].x, coors[j].y);
                }
                context.stroke();
                context.closePath();
                //context.restore();
                //context.globalAlpha = 1.0;
              }
              break;
            case RL_WBSS_YTX._shapeType.LINE:
              {
                context.beginPath();
                context.moveTo(coors[0].x, coors[0].y);
                context.lineTo(coors[1].x, coors[1].y);
                context.closePath();
                context.stroke();
              }
              break;
            case RL_WBSS_YTX._shapeType.RECT:
              {
                context.strokeRect(coors[0].x, coors[0].y, coors[1].x - coors[0].x, coors[1].y - coors[0].y);
              }
              break;
            case RL_WBSS_YTX._shapeType.TRIANGLE:
              {
                var pos_c_x = 2 * coors[0].x - coors[1].x;
                var pos_c_y = coors[1].y;
                context.beginPath();
                context.moveTo(coors[0].x, coors[0].y);
                context.lineTo(coors[1].x, coors[1].y);
                context.lineTo(pos_c_x, pos_c_y);
                context.closePath();
                context.stroke();
              }
              break;
            case RL_WBSS_YTX._shapeType.CIRCLE:
              {
                context.beginPath();
                context.arc((coors[1].x + coors[0].x) / 2,
                  (coors[1].y + coors[0].y) / 2,
                  Math.sqrt(Math.pow((coors[1].x - coors[0].x), 2) + Math.pow((coors[1].y - coors[0].y), 2)) / 2,
                  0, 2 * Math.PI);
                context.stroke();
                context.closePath();
              }
              break;
            case RL_WBSS_YTX._shapeType.ELLIPSE:
              {
                EvenCompEllipse((coors[1].x + coors[0].x) / 2,
                  (coors[1].y + coors[0].y) / 2,
                  Math.abs(coors[1].x - coors[0].x) / 2,
                  Math.abs(coors[1].y - coors[0].y) / 2)
              }
              break;
            case RL_WBSS_YTX._shapeType.ARROWMARK:
              {

              }
              break;
            case RL_WBSS_YTX._shapeType.FONT:
              {
                context.save();
                context.translate(coors[0].x, coors[0].y + 24);
                var text = element._textObj["text"];
                context.font = "24px Courier New";
                context.fillStyle = color;
                context.scale(pi.viewWidth / element._drawAreaWidth, pi.viewWidth / element._drawAreaWidth);
                context.fillText(text, 0, 0);
                context.restore();
              }
              break;
            case RL_WBSS_YTX._shapeType.LASERPEN:
              {
                context.fillStyle = 'rgba(255, 0, 0, 1.0)'; //'rgba(0, 0, 0, 0.0)'; // 边框颜色
                context.lineJoin = "round";
                context.beginPath();
                context.arc(coors[0].x, coors[0].y, 12, 0, 2 * Math.PI);
                context.fill();
                context.closePath();
              }
              break;
          }
        }
        // 解除裁剪测试
        context.restore();
        log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ") end");
      }

      // this.drawScreen();

    },
    _rePaint: function () {
      if (YTX_CONFIG._canvasAppManager)
        YTX_CONFIG._canvasAppManager.drawScreen();
    },
    updateRDP: function (roomId, docId, pageId) {
      YTX_CONFIG._drawContext.curRoom = roomId;
      YTX_CONFIG._drawContext.curDoc = docId;
      YTX_CONFIG._drawContext.curPage = pageId;
      //log(YTX_CONFIG._logLev._DEBUG, "_canvasObject=" + YTX_CONFIG._canvasObject);
      YTX_CONFIG._rePaint();
    },
    syncDrawData: function (roomId, docId, curDocTimestamp) {
      var di = YTX_CONFIG.getDocInfo(roomId, docId);
      if (!di) return;
      var localDocTimestamp = di.getTimestamp();
      if (curDocTimestamp > localDocTimestamp) {
        // send sync message
        var clientNo = YTX_CONFIG._generateClientNo(function () {});

        var headJson = new Object();
        headJson["authKey"] = YTX_CONFIG._authKey;
        headJson["userID"] = YTX_CONFIG._userId;
        headJson["reqID"] = clientNo;
        headJson["roomID"] = YTX_CONFIG._roomId;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = docId;
        sendJsonStr['syncType'] = 2; // 时间戳同步
        sendJsonStr['timestamp'] = localDocTimestamp;
        sendJsonStr = JSON.stringify(sendJsonStr);
        var sendStr = '{\"type\":' + YTX_CONFIG._prototype.SyncRoomDataReq + ',\"payload\":' + sendJsonStr + '}';

        if (!!sendStr) {
          YTX_CONFIG._sendMsg(sendStr)
        }
      }
    },
    addServerDrawData: function (roomId, docId, pageId, node, newTimestamp, isSelfData) {
      var ri = YTX_CONFIG._roomInfoMap[roomId];
      if (!ri) {
        log(YTX_CONFIG._logLev._INFO, '找不到房间(' + roomId + ')信息');
        return;
      }
      var di = ri.docInfo[docId];
      if (!di) {
        log(YTX_CONFIG._logLev._INFO, '找不到文档(' + docId + ')信息');
        return;
      }
      var num = di.getPageSize();
      if (pageId < 1 || pageId > num) {
        log(YTX_CONFIG._logLev._INFO, '找不到页(' + pageId + ')信息');
        return
      }
      var pi = di.pageInfo[pageId - 1];

      di.setTimestamp(newTimestamp);
      YTX_CONFIG._canvasAppManager.appendElementNode(pi, node, false, isSelfData);
    },
    createElementNode: function (data) {
      var coordinates = data["coordinates"];
      var coors = []
      for (var i = 0; i < coordinates.length; i += 2) {
        coors.push({
          x: coordinates[i],
          y: coordinates[i + 1]
        });
      }

      var textObj = null;
      if (!!data["fontText"]) {
        textObj = new Object();
        textObj["text"] = data["fontText"];
      }
      var node = new YTX_CONFIG.ElementNode(
        data["drawID"],
        data["shapeType"],
        data["lineSize"],
        data["color"],
        data["isFill"],
        coors,
        data["drawAreaWidth"],
        data["drawAreaHeight"],
        data["isFinal"],
        textObj);
      return node;
    },
    getCurRoomId: function () {
      return YTX_CONFIG._drawContext.curRoom;
    },
    getCurDocId: function () {
      return YTX_CONFIG._drawContext.curDoc;
    },
    getCurPageId: function () {
      return YTX_CONFIG._drawContext.curPage;
    },
    findPageId: function (docId, pageId) {
      var size = YTX_CONFIG.getDocSize(docId);
      if (pageId < 1 || pageId > size) {
        return false;
      }
      return true;
    },
    getDocSize: function (_docId) {
      var docId = !!_docId ? _docId : YTX_CONFIG.getCurDocId();

      var ri = YTX_CONFIG._roomInfoMap[YTX_CONFIG._drawContext.curRoom];
      //log(YTX_CONFIG._logLev._INFO, 'ri=' + ri);
      if (!ri) {
        log(YTX_CONFIG._logLev._INFO, '找不到房间(' + YTX_CONFIG._drawContext.curRoom + ')信息');
        return;
      }
      var di = ri.docInfo[docId];
      //log(YTX_CONFIG._logLev._INFO, 'di=' + di);
      if (!di) {
        log(YTX_CONFIG._logLev._INFO, '找不到文档(' + YTX_CONFIG._drawContext.curDoc + ')信息');
        return;
      }
      return di.getPageSize();
    },
    getPageImageInfo: function (imgWidth, imgHeight) {
      var ri = YTX_CONFIG._roomInfoMap[YTX_CONFIG._drawContext.curRoom];
      //log(YTX_CONFIG._logLev._INFO, 'ri=' + ri);
      if (!ri) {
        log(YTX_CONFIG._logLev._INFO, '找不到房间(' + YTX_CONFIG._drawContext.curRoom + ')信息');
        return;
      }
      var di = ri.docInfo[YTX_CONFIG.getCurDocId()];
      //log(YTX_CONFIG._logLev._INFO, 'di=' + di);
      if (!di) {
        log(YTX_CONFIG._logLev._INFO, '找不到文档(' + YTX_CONFIG._drawContext.curDoc + ')信息');
        return;
      }
      imgWidth = di.imgWidth;
      imgHeight = di.imgHeight;
      return;
    },
    getCurrentPageInfo: function (_roomId, _docId, _pageId) {
      var roomId = !!_roomId ? _roomId : YTX_CONFIG.getCurRoomId();
      var docId = !!_docId ? _docId : YTX_CONFIG.getCurDocId();
      var pageId = !!_pageId ? _pageId : YTX_CONFIG.getCurPageId();
      var ri = YTX_CONFIG._roomInfoMap[roomId];
      if (!ri) {
        log(YTX_CONFIG._logLev._INFO, '找不到房间(' + roomId + ')信息');
        return;
      }
      var di = ri.docInfo[docId];
      //log(YTX_CONFIG._logLev._INFO, 'di=' + di);
      if (!di) {
        log(YTX_CONFIG._logLev._INFO, '找不到文档(' + docId + ')信息');
        return;
      }
      var num = di.getPageSize();
      // log(YTX_CONFIG._logLev._INFO, 'num=' + num);
      if (pageId < 1 || pageId > num) {
        log(YTX_CONFIG._logLev._INFO, '找不到页(' + pageId + ')信息');
        return
      }
      var pi = di.pageInfo[pageId - 1];
      //log(YTX_CONFIG._logLev._INFO, 'pi=' + pi);
      return pi;
    },
    setDrawIdUndoStatus: function (roomId, docId, pageId, drawId, type) {
      var pi = YTX_CONFIG.getCurrentPageInfo(roomId, docId, pageId);
      if (!pi) return false;
      return pi.setDrawUndoStatus(drawId, type);
    },
    setElementNodeDrawUndo: function () {
      var pi = YTX_CONFIG.getCurrentPageInfo();
      if (!pi) return "";
      var element;
      for (var ri = pi.elementNodeList.length - 1; ri >= 0; ri--) {
        element = pi.elementNodeList[ri];
        if (!element || element._isValid == false || element._isUndo)
          continue;
        element._isUndo = true;
        pi.startUndoIndex = ri;
        YTX_CONFIG._rePaint();
        return element._drawId;
      }
      return "";
    },
    setElementNodeDrawRedo: function () {
      var pi = YTX_CONFIG.getCurrentPageInfo();
      if (!pi) return "";
      var element;
      for (var i = pi.startUndoIndex; i < pi.elementNodeList.length; i++) {
        element = pi.elementNodeList[i];
        if (!element || !element._isValid || !element._isUndo)
          continue;
        element._isUndo = false;
        pi.startUndoIndex = i;
        YTX_CONFIG._rePaint();
        return element._drawId;
      }
      return "";
    },
    asyncDownfile: function (roomId, docId, pageId, reqId) {
      log(YTX_CONFIG._logLev._DEBUG, "asyncDownload(" + roomId + "," + docId + "," + pageId + ")");
      var xhr;
      var blob;
      var url;
      if (YTX_CONFIG._isSSLEncrypt) {
        url = "https://" + Base64.decode(YTX_CONFIG._file_server[0]) + "/download";
      } else {
        url = "http://" + Base64.decode(YTX_CONFIG._file_server[0]) + "/download";
      }
      var filename = roomId.toString() + "-" + docId.toString() + "_" + pageId.toString() + ".png";
      var params = {
        "roomId": roomId.toString(),
        "userId": YTX_CONFIG._userId,
        "docId": docId.toString(),
        "fileName": filename,
        "reqId": reqId.toString(),
        "fileType": "1" // 文档图片下载
      };
      console.log(JSON.stringify(params));

      xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
      xhr.open("GET", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
      xhr.responseType = "blob";
      xhr.setRequestHeader("Accept", "application/octet-stream");
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.setRequestHeader("Content-Disposition", "attachment;filename=1.png");
      xhr.setRequestHeader("Ytx-Params", Base64.encode(JSON.stringify(params)));
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          log(YTX_CONFIG._logLev._DEBUG, "Image(" + roomId + "," + docId + "," + pageId + ") download success");
          console.log(xhr.response);
          blob = xhr.response;
          var data = {
            "id": filename,
            "imagedata": blob
          }
          YTX_CONFIG.putdata(YTX_CONFIG._dbInfo.dbStoreName, data, function () {
            blobToImage(blob, function (img) {
              var pi = YTX_CONFIG.getCurrentPageInfo(roomId, docId, pageId);
              pi.setImage(img);
              YTX_CONFIG.setDocViewPosition(roomId, docId, img.width, img.height);
              //console.log("img onload 111");
              if (YTX_CONFIG.isSamePage(roomId, docId, pageId)) {
                YTX_CONFIG._rePaint();
              }
            });
          });
        } else {
          //log(YTX_CONFIG._logLev._DEBUG, "Image(" + roomId + "," + docId + "," + pageId + ") download error" );
          console.log(xhr.statusText);
        }
      };
      xhr.send();
    },
    getDocPageOneImage: function (roomId, docId, pageId, reqId) {
      YTX_CONFIG.asyncDownfile(roomId, docId, pageId, reqId);
    },
    getDocPageImages: function (roomId, docId, pageSize, reqId) {
      if (docId <= 0) return;
      log(YTX_CONFIG._log._DEBUG, "=====getDocPageImages()=====");
      var key = "" + roomId + "-" + docId;
      YTX_CONFIG.getdata(YTX_CONFIG._dbInfo.dbStoreName, key, function () {
        // 已经下载
      }, function () {
        var data = {
          "id": key,
          "imagedata": true
        }
        YTX_CONFIG.putdata(YTX_CONFIG._dbInfo.dbStoreName, data, function () {

        });
        for (var i = 1; i <= pageSize; i++) {
          //YTX_CONFIG.getdata()
          YTX_CONFIG.asyncDownfile(roomId, docId, i, reqId);
        }
      });
    },
    getDocPageSize: function (roomId, docId) {
      var di = YTX_CONFIG.getDocInfo(roomId, docId);
      if (!di) {
        log(YTX_CONFIG._logLev._INFO, '找不到文档(' + docId + ')信息');
        return 0;
      }
      return di.getPageSize();
    },
    checkIfReGetViewInfo: function (roomId, docId) {
      // if (YTX_CONFIG._drawContext.canvasLastWidth != YTX_CONFIG._canvas.width ||
      //         YTX_CONFIG._drawContext.canvasLastHeight != YTX_CONFIG._canvas.height) {
      //     console.log("canvas is resize need get view info");
      //
      // }
      var bbox = YTX_CONFIG._canvas.getBoundingClientRect();
      log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ") " + "bbox.width=" + bbox.width + ", bbox.height=" + bbox.height);
      var newWidth = bbox.width;
      var newHeight = bbox.height;
      if (newWidth != YTX_CONFIG._drawContext.canvasLastWidth ||
        newHeight != YTX_CONFIG._drawContext.canvasLastHeight) {

        log(YTX_CONFIG._logLev._DEBUG, "draw(" + YTX_CONFIG._drawCnt + ") " + " canvasLastWidth=" + YTX_CONFIG._drawContext.canvasLastWidth + ", canvasLastHeight=" + YTX_CONFIG._drawContext.canvasLastHeight);

        var fromX, fromY, viewWidth, viewHeight;
        if (docId == 0) {
          if (YTX_CONFIG._drawContext.wbRatio <= 0) {
            fromX = fromY = 0;
            viewWidth = newWidth;
            viewHeight = newHeight;
          } else {
            var r = 1.0 * newWidth / newHeight;
            if (r > YTX_CONFIG._drawContext.wbRatio) {
              viewHeight = newHeight;
              viewWidth = Math.round(YTX_CONFIG._drawContext.wbRatio * viewHeight);
              fromX = Math.round((newWidth - viewWidth) * 0.5);
              fromY = 0;
            } else {
              viewWidth = newWidth;
              viewHeight = Math.round(viewWidth / YTX_CONFIG._drawContext.wbRatio);
              fromX = 0;
              fromY = Math.round((newHeight - viewHeight) * 0.5);
            }
          }

          // view width and height need 整數
          viewWidth = YTX_CONFIG._mathRound(viewWidth);
          viewHeight = YTX_CONFIG._mathRound(viewHeight);

          var di = YTX_CONFIG.getDocInfo(roomId, docId);
          for (var i = 0; i < di.getPageSize(); i++) {
            di.pageInfo[i].setViewInfo(fromX, fromY, viewWidth, viewHeight);
          }
        } else {
          var di = YTX_CONFIG.getDocInfo(roomId, docId);
          var pi;
          for (var i = 0; i < di.getPageSize(); i++) {
            pi = di.pageInfo[i];
            fromX = (newWidth - pi.viewWidth) / 2;
            fromY = (newHeight - pi.viewHeight) / 2;
            di.pageInfo[i].setViewInfo(fromX, fromY, pi.viewWidth, pi.viewHeight);
          }
        }
        // this.originalImgWidth = viewWidth;
        // this.originalImgHeight = viewHeight;

        YTX_CONFIG._drawContext.canvasLastWidth = newWidth;
        YTX_CONFIG._drawContext.canvasLastHeight = newHeight;
        YTX_CONFIG._canvas.setAttribute("width", newWidth);
        YTX_CONFIG._canvas.setAttribute("height", newHeight);
      }
    },
    isSamePage: function (roomId, docId, pageId) {
      return (YTX_CONFIG.getCurRoomId() == roomId && YTX_CONFIG.getCurDocId() == docId && YTX_CONFIG.getCurPageId() == pageId);
    },
    setDocViewPosition: function (roomId, docId, imageWidth, imageHeight) {
      var di = YTX_CONFIG.getDocInfo(roomId, docId);
      if (di) {
        di.setDocViewPosition(imageWidth, imageHeight);
      }
    },
    addDocInfo: function (roomId, docId, docName, pageSize, docUrl, owner) {
      var ri = YTX_CONFIG._roomInfoMap[roomId];
      if (!ri) {
        log(YTX_CONFIG._logLev._INFO, '找不到房间(' + roomId + ')信息');
        return false;
      }
      var di = new YTX_CONFIG.DocInfo(docId, docName, pageSize, docUrl, owner);
      ri.addDocInfo(di);
      return true;
    },
    getDocInfo: function (_roomId, _docId) {
      var roomId = !!_roomId ? _roomId : YTX_CONFIG.getCurRoomId();
      var docId = !!_docId ? _docId : YTX_CONFIG.getCurDocId();
      var ri = YTX_CONFIG._roomInfoMap[roomId];
      if (!ri) {
        log(YTX_CONFIG._logLev._INFO, '找不到房间(' + roomId + ')信息');
        return;
      }
      var di = ri.docInfo[docId];
      if (!di) {
        log(YTX_CONFIG._logLev._INFO, '找不到文档(' + docId + ')信息');
        return;
      }
      return di;
    },
    RoomInfo: function (roomId) {
      this.roomId = roomId;
      this.docInfo = {};
      var wbDoc = new YTX_CONFIG.DocInfo(0);
      this.docInfo[0] = wbDoc;
      this.addDocInfo = function (docInfo) {
        this.docInfo[docInfo.docId] = docInfo;
      }
    },
    DocInfo: function (docId, docName, pageSize, docUrl, owner) {
      this.docId = docId;
      this.docName = docName;
      this.pageSize = !!pageSize ? pageSize : 10;
      this.docUrl = docUrl;
      this.curPageIndex = 1; // 默认第一页
      this.originalImgWidth = 0; // 原始图片宽，白板代表第一次显示宽
      this.originalImgHeight = 0; // 原始图片高，白板代表第一次显示高
      this.owner = owner;
      this.startUndoIndex = 0;
      this.timestamp = 0;
      this.isDownloadImage = false;
      this.lastCanvasWidth = 0;
      this.lastCanvasHeight = 0;
      this.isDocViewInit = false;
      this.pageInfo = [];
      if (docId == 0) {
        this.lastCanvasWidth = YTX_CONFIG._canvas.width;
        this.lastCanvasHeight = YTX_CONFIG._canvas.height;

        var fromX, fromY, viewWidth, viewHeight;
        if (YTX_CONFIG._drawContext.wbRatio <= 0) {
          fromX = fromY = 0;
          viewWidth = YTX_CONFIG._canvas.width;
          viewHeight = YTX_CONFIG._canvas.height;
        } else {
          var r = 1.0 * YTX_CONFIG._canvas.width / YTX_CONFIG._canvas.height;
          if (r > YTX_CONFIG._drawContext.wbRatio) {
            viewHeight = YTX_CONFIG._canvas.height;
            viewWidth = Math.round(YTX_CONFIG._drawContext.wbRatio * viewHeight);
            fromX = Math.round((YTX_CONFIG._canvas.width - viewWidth) * 0.5);
            fromY = 0;
          } else {
            viewWidth = YTX_CONFIG._canvas.width;
            viewHeight = Math.round(viewWidth / YTX_CONFIG._drawContext.wbRatio);
            fromX = 0;
            fromY = Math.round((YTX_CONFIG._canvas.height - viewHeight) * 0.5);
          }
        }

        viewWidth = YTX_CONFIG._mathRound(viewWidth);
        viewHeight = YTX_CONFIG._mathRound(viewHeight);

        this.originalImgWidth = viewWidth;
        this.originalImgHeight = viewHeight;

        // console.log("kkkkk=" + fromX + "," + fromY + "," + viewWidth + "," + viewHeight);
        for (var i = 1; i <= 10; i++) {
          var pi = new YTX_CONFIG.PageInfo(i);
          pi.setViewInfo(fromX, fromY, viewWidth, viewHeight);
          this.pageInfo.push(pi);
        }
      } else {
        for (var i = 1; i <= pageSize; i++) {
          var pi = new YTX_CONFIG.PageInfo(i);
          this.pageInfo.push(pi);
        }
      }
      this.getPageSize = function () {
        return this.pageSize;
      }
      this.setTimestamp = function (_timestamp) {
        this.timestamp = _timestamp;
      }
      this.getTimestamp = function () {
        return this.timestamp;
      }
      this.setCurPageIndex = function (_curPageIndex) {
        this.curPageIndex = _curPageIndex;
      }
      this.getCurPageIndex = function () {
        return this.curPageIndex;
      }
      this.setDocViewPosition = function (imageWidth, imageHeight) {
        if (!this.isDocViewInit) {
          this.isDocViewInit = true;
          log(YTX_CONFIG._logLev._DEBUG, "DocInitViewPostion(" + imageWidth + "," + imageHeight + ")");
          var fromX, fromY, viewWidth, viewHeight;
          this.originalImgWidth = imageWidth;
          this.originalImgHeight = imageHeight;
          var canvasWidth = YTX_CONFIG._canvas.width;
          var canvasHeight = YTX_CONFIG._canvas.height;
          this.lastCanvasWidth = canvasWidth;
          this.lastCanvasHeight = canvasHeight;
          var canvasWDivH = canvasWidth / canvasHeight;
          var imageWDivH = imageWidth / imageHeight;
          if (canvasWDivH > imageWDivH) {
            var scale = 1.0 * canvasHeight / imageHeight;
            viewWidth = Math.round(imageWidth * scale);
            viewHeight = canvasHeight;
            fromX = Math.round((canvasWidth - viewWidth) / 2.0);
            fromY = 0;
          } else {
            var scale = 1.0 * canvasWidth / imageWidth;
            viewWidth = canvasWidth;
            viewHeight = Math.round(imageHeight * scale);
            fromX = 0;
            fromY = Math.round((canvasHeight - viewHeight) / 2.0);
          }
          log(YTX_CONFIG._logLev._DEBUG, "viewInfo(" + fromX + "," + fromY + "," + viewWidth + "," + viewHeight + ")");
          for (var i in this.pageInfo) {
            this.pageInfo[i].setViewInfo(fromX, fromY, viewWidth, viewHeight);
          }
        }
      }
      this.getOriginalImgInfo = function () {
        return {
          width: this.originalImgWidth,
          height: this.originalImgHeight
        };
      }
    },
    PageInfo: function (pageId) {
      this.pageId = pageId;
      this.drawIdNum = 1;
      this.fromX = 50;
      this.fromY = 0;
      this.viewWidth = 0;
      this.viewHeight = 0;
      this.elementNodeList = [];
      this.elementNodeMap = {};
      this.image = null;
      this.generateDrawId = function (userId, roomId, docId) {
        var nowTime = parseInt(new Date().getTime() / 1000);
        var arr = new Array();
        arr.push(roomId);
        arr.push(docId);
        arr.push(this.pageId);
        arr.push(this.drawIdNum++);
        arr.push(userId);
        arr.push(nowTime);
        return arr.join("-");
      }
      this.clearElementNode = function (type, drawId) {
        if (type == 1) {
          for (var i = this.elementNodeList.length - 1; i >= 0; i--) {
            var element = this.elementNodeList[i];
            if (!element || !element._isValid || element._isUndo)
              continue;
            if (element._drawId == drawId) {
              element._isValid = false;
              YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "Delete Element Success");
              break;
            }
          }
        } else if (type == 2) {
          this.elementNodeList = [];
          this.elementNodeMap = [];
        }
      }
      this.setDrawUndoStatus = function (drawId, type) {
        if (drawId in this.elementNodeMap) {
          var node = this.elementNodeMap[drawId];
          if (type) {
            node._isUndo = false;
          } else {
            node._isUndo = true;
          }
          return true;
        }
        return false;
      }
      this.setImage = function (img) {
          this.image = img;
        },
        this.getImage = function () {
          return this.image;
        }
      this.setViewInfo = function (_fromX, _fromY, _viewWidth, _viewHeight) {
        this.fromX = _fromX;
        this.fromY = _fromY;
        this.viewWidth = _viewWidth;
        this.viewHeight = _viewHeight;
      }
    },
    ElementNode: function (drawId, type, lineWidth, lineColor, isFill, coordinates, drawAreaWidth, drawAreaHeight, isFinal, textObj) {
      this._drawId = drawId;
      this._type = type;
      this._lineWidth = lineWidth;
      this._lineColor = lineColor == undefined ? 255 : lineColor;
      this._isFill = isFill;
      this._coordinates = coordinates;
      this._isValid = true;
      this._isUndo = false;
      this._isFinal = !!isFinal ? isFinal : false;
      this._drawAreaWidth = !!drawAreaWidth ? drawAreaWidth : 0;
      this._drawAreaHeight = !!drawAreaHeight ? drawAreaHeight : 0;
      this._textObj = !!textObj ? textObj : null;
      this.setIsValid = function (isValid) {
        this._isValid = isValid;
      }
      this.appendCoordinates = function (coordinates) {
        for (var i = 0; i < coordinates.length; i++) {
          this._coordinates.push({
            x: coordinates[i].x,
            y: coordinates[i].y
          });
        }
      }
    },
    Point: function (_x, _y) {
      this.x = _x;
      this.y = _y;
      this.setX = function (_x) {
        this.x = _x;
      }
      this.setY = function (_y) {
        this.y = _y;
      }
      this.setPoint = function (point) {
        this.x = point.x;
        this.y = point.y;
      }
    },

    // wbss index handle
    opendb: function () {
      window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
      window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

      if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
      }
      var db;
      var request = indexedDB.open(YTX_CONFIG._dbInfo.dbName, YTX_CONFIG._dbInfo.dbVersion);
      request.onerror = function (evt) {
        alert("Why didn't you allow my web app to use IndexedDB?!");
        console.error("openDb:", evt.target.errorCode);
      };
      request.onsuccess = function (evt) {
        db = request.result;
        YTX_CONFIG._db = db;
        // 在新创建的对象存储空间中保存值
        // var img = new Image();
        // img.src = "test_8bit.bmp";
        // img.onload = function() {
        //     var base64_image = getBase64Image(img, "image/jpeg");
        //     //console.log(data);
        //     var data = {
        //         "id": "22-1-1",
        //         "imagedata": base64_image,
        //     }
        //     var tx = db.transaction(YTX_CONFIG._dbInfo.dbStoreName,'readwrite');
        //     store = tx.objectStore(YTX_CONFIG._dbInfo.dbStoreName);
        //     store.put(data);
        //     var req = store.get('22-1-1');
        //     req.onsuccess = function(evt) {
        //         var value = evt.target.result;
        //         //console.log(value);
        //     };
        // }
        log(YTX_CONFIG._logLev._DEBUG, "initDb DONE");
      };
      request.onupgradeneeded = function (evt) {
        console.log("openDb.onupgradeneeded");
        var db = evt.currentTarget.result;
        var store = db.createObjectStore(YTX_CONFIG._dbInfo.dbStoreName, {
          keyPath: 'id'
        });
        //store.createIndex("imagedata", "imagedata", { unique: false });
      };
    },
    putdata: function (storeName, data, callback) {

      var tx = YTX_CONFIG._db.transaction(storeName, 'readwrite');
      var store = tx.objectStore(storeName);
      var request = store.put(data);
      request.onerror = function () {
        console.error('put添加数据库中已有该数据')
      };
      request.onsuccess = function () {
        log(YTX_CONFIG._logLev._DEBUG, '数据' + data["id"] + "已存入数据库");
        callback();
      };
    },
    getdata: function (storeName, key, callback, onError) {
      var store = YTX_CONFIG._db.transaction(storeName, 'readwrite').objectStore(storeName);
      var id = key;
      var request = store.get(id);
      request.onsuccess = function () {
        if (!!request.result) {
          console.log(request.result);
          var data = request.result;
          callback(data);
          console.log("getdata " + key + " success")
        } else {
          onError();
        }
      }
      request.onerror = function () {
        console.log("getdata " + key + " error");
        onError();
      }
    },

    _unInit: function () {
      log(YTX_CONFIG._logLev._INFO, "_unInit()");

      // 网络
      YTX_CONFIG._unInitSocket();

      //indexdb
      YTX_CONFIG._db.close();

      // 清除房间缓存
      YTX_CONFIG._clearRoomInfo();
    },
    util: {
      checkFileReader: function () {
        var FileReader = FileReader || window.FileReader;
        if (!FileReader) {
          return false
        }
        return true
      },
      getWindowURL: function () {
        var url = window.URL || window.webkitURL || window.mozURL || window.msURL;
        return url
      },
      getUserMedia: function () {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (!!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia) {
          getUserMedia = navigator.mediaDevices.getUserMedia
        } else if (typeof navigator !== 'undefined' && navigator.webkitGetUserMedia) {
          getUserMedia = navigator.webkitGetUserMedia.bind(navigator)
        } else if (typeof navigator !== 'undefined' && navigator.mozGetUserMedia) {
          getUserMedia = navigator.mozGetUserMedia.bind(navigator)
        } else if (typeof navigator !== 'undefined' && navigator.getUserMedia) {
          getUserMedia = navigator.getUserMedia.bind(navigator)
        }
        return getUserMedia
      },
      getPeerConnection: function () {
        var peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
        if (typeof RTCPeerConnection !== 'undefined') {
          peerConnection = RTCPeerConnection
        } else if (typeof mozRTCPeerConnection !== 'undefined') {
          peerConnection = mozRTCPeerConnection
        } else if (typeof webkitRTCPeerConnection !== 'undefined') {
          peerConnection = webkitRTCPeerConnection
        }
        return peerConnection
      },
      getSessionDescription: function () {
        var sessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
        if (typeof RTCSessionDescription !== 'undefined') {
          sessionDescription = RTCSessionDescription
        } else if (typeof mozRTCSessionDescription !== 'undefined') {
          sessionDescription = mozRTCSessionDescription
        } else if (typeof webkitRTCSessionDescription !== 'undefined') {
          sessionDescription = webkitRTCSessionDescription
        }
        return sessionDescription
      },
      getBrowerPrefix: function () {
        return 'hidden' in document ? null : function () {
          var r = null;
          ['webkit', 'moz', 'ms', 'o'].forEach(function (prefix) {
            if ((prefix + 'Hidden') in document) {
              return r = prefix
            }
          });
          return r
        }()
      },
      checkWindowHidden: function () {
        var prefix = YTX_CONFIG.util.getBrowerPrefix();
        if (!prefix) {
          return document['hidden']
        }
        return document[prefix + 'Hidden']
      },
      getWindowVisibleState: function () {
        var prefix = YTX_CONFIG.util.getBrowerPrefix();
        if (!prefix) {
          return document['visibilityState']
        }
        return document[prefix + 'VisibilityState']
      },
      stopMediaStream: function (stream) {
        if (stream.getTracks()) {
          console.log("stream.getTracks()");
          for (var track in stream.getTracks()) {
            stream.getTracks()[track].stop();
          }

        } else {
          stream.stop();
        }
      }
    },
  };
  //给元素添加事件
  window.addEventListener("load", eventWindowLoaded, false);
  //销毁初始化
  window.onbeforeunload = function (event) {
    YTX_CONFIG._unInit();
  };

  var Debugger = function () {};
  Debugger.log = function (message) {
    try {
      console.log(message);
    } catch (exception) {
      return;
    }
  }

  function eventWindowLoaded() {
    //log(YTX_CONFIG._logLev._DEBUG, "eventWindowLoaded()");
    //YTX_CONFIG._canvasAppManager = new YTX_CONFIG._canvasApp();
    //YTX_CONFIG._canvasAppManager.drawScreen();
  }
  //支持canvas
  function canvasSupport() {
    return Modernizr.canvas;
  }

  // 白板初始化
  window.RL_WBSS_YTX = window.RL_WBSS_YTX || {
    // 白板初始化
    init: function (userId, authKey, appId, serverIp, canvas) {
      YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "init()");
      var resp = {};
      if (!RL_WBSS_YTX.checkH5()) {
        resp.code = YTX_CONFIG._errcode._NOT_SUPPORT_H5;
        resp.msg = 'The brower do not support HTML5,please change the brower';
        return resp
      }
      if (!userId || !authKey || !appId || !canvas) {
        resp.code = YTX_CONFIG._errcode._INVALID_PARAM;
        resp.msg = 'appid is null,please check you param';
        return resp;
      }
      if (!!serverIp) {
        YTX_CONFIG._rest_server[0] = Base64.encode(serverIp);
      }
      var notSupport = [];
      if (!YTX_CONFIG.util.checkFileReader()) {
        notSupport.push(YTX_CONFIG._errcode._NOT_SUPPORT_FILE)
      }
      // indexdb

      YTX_CONFIG.opendb();
      YTX_CONFIG._isSSLEncrypt = (serverIp.indexOf("https") != -1) ? true : false;

      YTX_CONFIG._userId = userId;
      YTX_CONFIG._authKey = authKey;
      YTX_CONFIG._appid = appId;
      YTX_CONFIG._canvas = canvas;
      YTX_CONFIG._canvasAppManager = new YTX_CONFIG._canvasApp();
      resp.code = YTX_CONFIG._errcode._SUCC;
      resp.msg = 'init success';
      resp.unsupport = notSupport;
      return resp;
    },
    // login: function (callback, onError) {
    //     YTX_CONFIG._connectServer(callback, onError, true);
    // },
    checkH5: function () {
      try {
        window.localStorage.testItem = 'test';
        window.localStorage.removeItem('testItem');
      } catch (e) {
        YTX_CONFIG.hasLocalStorage = false;
      }
      if (!!window.applicationCache && !!window.WebSocket) {
        log(YTX_CONFIG._logLev._DEBUG, "this brower is support H5 . Version is " + navigator.appVersion + ". vendor is :" + navigator.vendor + ". Is online :" + navigator.onLine + ' version:' + YTX_CONFIG._version);
        return true;
      } else {
        log(YTX_CONFIG._logLev._ERROR, "sorry, your brower not support H5, exist!");
        return false;
      }

    },

    // 业务接口参数定义
    CreateRoomBuilder: function (roomType, memberLimit, password, roleId) {
      this._roomType = !!roomType ? roomType : 1;
      this._memberLimit = memberLimit;
      this._password = password;
      this._roleId = roleId;
      this.setRoomType = function (roomType) {
        this._roomType = roomType
      };
      this.setMemberLimit = function (memberLimit) {
        this._memberLimit = memberLimit;
      };
      this.setPassword = function (password) {
        this._password = password;
      };
      this.setRoleId = function (roleId) {
        this._roleId = roleId;
      };
      this.getRoomType = function () {
        return this._roomType;
      };
      this.getMemberLimit = function () {
        return this._memberLimit;
      }
      this.getPassword = function () {
        return this._password;
      }
      this.getRoleId = function () {
        return this._roleId;
      }
    },
    JoinRoomBuilder: function (roomId, password, roleId) {
      this._roomId = roomId;
      this._password = !!password ? password : "";
      this._roleId = !!roleId ? roleId : 0;
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.setPassword = function (password) {
        this._password = password;
      };
      this.setRoleId = function (roleId) {
        this._roleId = roleId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
      this.getPassword = function () {
        return this._password;
      }
      this.getRoleId = function () {
        return this._roleId;
      }
    },
    DeleteRoomBuilder: function (roomId) {
      this._roomId = roomId;
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
    },
    LeaveRoomBuilder: function (roomId) {
      this._roomId = roomId;
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
    },
    ClearRoomBuilder: function (roomId) {
      this._roomId = roomId;
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
    },
    ShareDocBuilder: function (roomId, docId) {
      this._roomId = roomId;
      this._docId = (typeof (docId) == 'number') ? docId : YTX_CONFIG._drawContext.curDoc;
      // debugger
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
      this.setDocId = function (docId) {
        this._docId = docId;
      }
      this.getDocId = function () {
        return this._docId;
      }
    },
    RemoveDocBuilder: function (roomId, docId) {
      this._roomId = roomId;
      this._docId = !!docId ? docId : YTX_CONFIG._drawContext.curDoc;
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
      this.setDocId = function (docId) {
        this._docId = docId;
      }
      this.getDocId = function () {
        return this._docId;
      }
    },
    GotoPageBuilder: function (roomId, docId, pageId) {
      this._roomId = !!roomId ? roomId : YTX_CONFIG._drawContext.curRoom;
      this._docId = !!docId ? docId : YTX_CONFIG._drawContext.curDoc;
      this._pageId = pageId;
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      }
      this.getRoomId = function () {
        return this._roomId;
      }
      this.setDocId = function (docId) {
        this._docId = docId;
      }
      this.getDocId = function () {
        return this._docId;
      }
      this.setPageId = function (pageId) {
        this._pageId = pageId;
      }
      this.getPageId = function () {
        return this._pageId;
      }

    },
    ColorBuilder: function (r, g, b, a) {
      this._r = r;
      this._g = g;
      this._b = b;
      this._a = !!a ? a : 255;
      this.setR = function (r) {
        this._r = r;
      }
      this.getR = function () {
        return this._r;
      }
      this.setG = function (g) {
        this._g = g;
      }
      this.getG = function () {
        return this._g;
      }
      this.setB = function (b) {
        this._b = b;
      }
      this.getB = function () {
        return this._b;
      }
      this.setA = function (a) {
        this._a = a;
      }
      this.getA = function () {
        return this._a;
      }
    },
    ScaleBuilder: function (scaleMode, ratio) {
      this._scaleMode = !!scaleMode ? scaleMode : 0;
      this._ratio = !!ratio ? ratio : 0.2;
      this.setScaleMode = function (scaleMode) {
        this._scaleMode = scaleMode;
      }
      this.setRatio = function (ratio) {
        this._ratio = ratio;
      }
      this.getScaleMode = function () {
        return this._scaleMode;
      }
      this.getRatio = function () {
        return this._ratio;
      }
    },

    // 业务接口
    createRoom: function (createRoomBuilder, callback, onError) {
      YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "=====createRoom()=====");
      var roomType = createRoomBuilder.getRoomType();
      if (!createRoomBuilder || !roomType || (roomType != 1 && roomType != 2)) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._NO_REQUIRED_PARAM;
        resp.msg = 'param invalid';
        if (onError)
          onError(resp);
        return;
      }
      YTX_CONFIG._connectServer(-1, function () {
        var sendStr = YTX_CONFIG._protobuf._buildCreateRoom(createRoomBuilder, callback, onError);
        if (!!sendStr) {
          YTX_CONFIG._sendMsg(sendStr)
        }
      }, onError, true);
    },
    joinRoom: function (joinRoomBuilder, callback, onError) {
      if (!joinRoomBuilder || !joinRoomBuilder.getRoomId() || !joinRoomBuilder.getPassword()) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._NO_REQUIRED_PARAM;
        resp.msg = 'param invalid';
        if (onError)
          onError(resp);
        return;
      }
      YTX_CONFIG._connectServer(joinRoomBuilder.getRoomId(), function () {
        var sendStr = YTX_CONFIG._protobuf._buildJoinRoom(joinRoomBuilder, callback, onError);
        if (!!sendStr) {
          YTX_CONFIG._sendMsg(sendStr)
        }
      }, onError, true);
    },
    deleteRoom: function (deleteRoomBuilder, callback, onError) {
      var sendStr = YTX_CONFIG._protobuf._buildDeleteRoom(deleteRoomBuilder, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    leaveRoom: function (leaveRoomBuilder, callback, onError) {
      YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "=====leaveRoom()=====");
      var sendStr = YTX_CONFIG._protobuf._buildLeaveRoom(leaveRoomBuilder, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    clearRoom: function (clearRoomBuilder, callback, onError) {
      var sendStr = YTX_CONFIG._protobuf._buildClearRoom(clearRoomBuilder, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    uploadDoc: function (fileInfo, callback, onError, process) {
      log(YTX_CONFIG._logLev._DEBUG, "=====uploadDoc=====");
      if (!fileInfo) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._FILE_PARAM_ERROR;
        resp.msg = 'param file is empty';
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "'param file is empty'");
        onError(resp);
        return;
      }
      if (!(fileInfo instanceof File) && !(fileInfo instanceof Blob)) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._FILE_PARAM_ERROR;
        resp.msg = 'param file is illegal';
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "'param file is illegal'");
        onError(resp);
        return;
      }
      if (fileInfo.size >= YTX_CONFIG._maxFileLen) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._FILE_TOO_LARGE;
        resp.msg = 'param file is too large';
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "'param file is too large'");
        onError(resp);
        return;
      }

      if (YTX_CONFIG._loginStatus != 2) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._NOT_INROOM_ERROR;
        resp.msg = 'not in room.';
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "'not in room'");
        onError(resp);
        return;
      }

      //log(YTX_CONFIG._logLev._INFO, fileInfo);
      //console.log(fileInfo);

      var total = fileInfo.size; //   文件总大小 在文件读取完毕后赋值
      var part;
      var start = 0;
      var binaryString;

      var reader = new FileReader();
      reader.readAsArrayBuffer(fileInfo);
      reader.onload = function loaded(evt) {
        //console.log(evt)
        binaryString = evt.target.result;
        console.log(YTX_CONFIG._file_server[0]);
        var xhr;
        var url;
        if (YTX_CONFIG._isSSLEncrypt) {
          url = "https://" + Base64.decode(YTX_CONFIG._file_server[0]) + "/upload";
        } else {
          url = "http://" + Base64.decode(YTX_CONFIG._file_server[0]) + "/upload";
        }
        var reqId = ++YTX_CONFIG._clientNo;
        var params = {
          "roomId": YTX_CONFIG._roomId.toString(),
          "userId": YTX_CONFIG._userId,
          "fileName": encodeURI(fileInfo.name),
          "reqId": reqId.toString(),
          "fileType": "1",
          "extOpts": ""
        };
        //console.log(JSON.stringify(params));
        xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
        YTX_CONFIG._xhr = xhr;
        xhr.open("POST", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        xhr.responseType = "text";
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Content-Disposition", "attachment;filename=" + encodeURI(fileInfo.name));
        xhr.setRequestHeader("Ytx-Params", Base64.encode(JSON.stringify(params)));
        xhr.setRequestHeader("Session-ID", "13498021401asf");
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            YTX_CONFIG._xhr = null;
            var responseText = xhr.responseText;
            log(YTX_CONFIG._logLev._DEBUG, "responseText=" + responseText);
            var response = JSON.parse(responseText);
            var resp = {};
            var result = response["statusCode"];
            var reason = response["reason"];
            var docId = response["docId"];
            resp["result"] = result;
            resp["reason"] = reason;
            resp["docId"] = docId;
            callback(resp);
            var tId = setTimeout(function () {
              YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'server convert doc time out');
              if (YTX_CONFIG._onDocConvertListener) {
                var resp = {};
                resp.code = YTX_CONFIG._errcode._DOCCONVERT_TIME_OUT;
                resp.msg = "doc convert timeout";
                resp.roomId = YTX_CONFIG.getCurRoomId();
                resp.docId = docId;
                resp.filename = fileInfo.name;
                YTX_CONFIG._onDocConvertListener(resp);
              }
              delete YTX_CONFIG._docConvertMap[reqId];
            }, YTX_CONFIG._timeOutDocConvert * 1000);
            var data = {};
            data.tId = tId;
            YTX_CONFIG._docConvertMap[reqId] = data;
          } else {
            log(YTX_CONFIG._logLev._DEBUG, xhr.statusText);
            onError(xhr.statusText);
          }
        };
        // 上传进度调用方法实现
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "loaded=" + event.loaded + ",total=" + event.total);
            if (YTX_CONFIG._onUploadDocProcessListener) {
              var resp = {};
              resp.filename = fileInfo.name;
              resp.process = event.loaded;
              resp.total = event.total;
              YTX_CONFIG._onUploadDocProcessListener(resp);
            }
          }
        };
        // xhr.onload = uploadComplete; //请求完成
        // xhr.onerror =  uploadFailed; //请求失败
        // xhr.upload.onloadstart = function(){//上传开始执行方法
        //     ot = new Date().getTime();   //设置上传开始时间
        //     oloaded = 0;//设置上传开始时，以上传的文件大小为0
        // };
        xhr.send(binaryString); // 发送文件数据
      }
    },
    cancelUploadDoc: function (callback, onError) {
      if (!!YTX_CONFIG._xhr) {
        YTX_CONFIG._log(YTX_CONFIG._logLev._DEBUG, "TX_CONFIG._xhr.abort()");
        YTX_CONFIG._xhr.abort();
        YTX_CONFIG._xhr = null;
        if (callback) {
          var resp = {};
          resp.code = 0;
          resp.msg = 'success';
          callback(resp);
        }
      } else {
        if (onError) {
          var resp = {};
          resp.code = -1;
          resp.msg = 'The file has been uploaded.';
          onError(resp);
        }
      }
    },
    // 共享一个文件url
    uploadFileUrl: function (fileurl, callback, onError) {
      log(YTX_CONFIG._logLev._DEBUG, "=====uploadFileUrl=====");
      if (!fileurl) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._FILE_PARAM_ERROR;
        resp.msg = 'param fileurl is empty';
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "'param fileurl is empty'");
        onError(resp);
        return;
      }

      if (YTX_CONFIG._loginStatus != 2) {
        var resp = {};
        resp.code = YTX_CONFIG._errcode._NOT_INROOM_ERROR;
        resp.msg = 'not in room.';
        YTX_CONFIG._log(YTX_CONFIG._logLev._ERROR, "'not in room'");
        onError(resp);
        return;
      }
      console.log(YTX_CONFIG._file_server[0]);
      var xhr;
      var url;
      if (YTX_CONFIG._isSSLEncrypt) {
        url = "https://" + Base64.decode(YTX_CONFIG._file_server[0]) + "/download_agent";
      } else {
        url = "http://" + Base64.decode(YTX_CONFIG._file_server[0]) + "/download_agent";
      }
      var reqId = ++YTX_CONFIG._clientNo;
      var params = {
        "roomId": YTX_CONFIG._roomId.toString(),
        "userId": YTX_CONFIG._userId,
        "fileName": fileurl,
        "reqId": reqId.toString(),
        "fileType": "3",
        "extOpts": ""
      };

      console.log(JSON.stringify(params));
      xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
      YTX_CONFIG._xhr = xhr;
      xhr.open("POST", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
      xhr.responseType = "text";
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "text/plain");
      xhr.setRequestHeader("Ytx-Params", Base64.encode(JSON.stringify(params)));
      xhr.setRequestHeader("Session-ID", "abcedfghigk");
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          YTX_CONFIG._xhr = null;
          var responseText = xhr.responseText;
          log(YTX_CONFIG._logLev._DEBUG, "responseText=" + responseText);
          var response = JSON.parse(responseText);
          var resp = {};
          var result = response["statusCode"];
          var reason = response["reason"];
          var docId = response["docId"];
          resp["result"] = result;
          resp["reason"] = reason;
          resp["docId"] = docId;
          callback(resp);
          var tId = setTimeout(function () {
            YTX_CONFIG._log(YTX_CONFIG._logLev._INFO, 'server convert doc time out');
            if (YTX_CONFIG._onDocConvertListener) {
              var resp = {};
              resp.code = YTX_CONFIG._errcode._DOCCONVERT_TIME_OUT;
              resp.msg = "doc convert timeout";
              resp.roomId = YTX_CONFIG.getCurRoomId();
              resp.docId = docId;
              resp.filename = fileInfo.name;
              YTX_CONFIG._onDocConvertListener(resp);
            }
            delete YTX_CONFIG._docConvertMap[reqId];
          }, YTX_CONFIG._timeOutDocConvert * 1000);
          var data = {};
          data.tId = tId;
          YTX_CONFIG._docConvertMap[reqId] = data;
        } else {
          log(YTX_CONFIG._logLev._DEBUG, xhr.statusText);
          onError(xhr.statusText);
        }
      };
      xhr.send();
    },
    shareDoc: function (shareDocBuilder, callback, onError) {
      log(YTX_CONFIG._logLev._DEBUG, "=====shareDoc=====");
      var sendStr = YTX_CONFIG._protobuf._buildShareDoc(shareDocBuilder, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    removeDoc: function (removeDocBuilder, callback, onError) {
      var sendStr = YTX_CONFIG._protobuf._buildRemoveDoc(removeDocBuilder, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    removeWhiteBoardPage: function () {

    },
    insertWhiteBoardPage: function () {

    },
    setDocBackgroundColor: function (ColorBuilder) {

    },
    setLineShape: function (shape) {
      YTX_CONFIG._drawContext.shapeType = shape;
      if (shape == RL_WBSS_YTX._shapeType.LASERPEN) {
        YTX_CONFIG._drawContext.drawStatus = YTX_CONFIG._drawStatus.DRAW_STATUS_NORMAL;
      }
    },
    setLineColor: function (ColorBuilder) {
      YTX_CONFIG._drawContext.lineColor =
        (ColorBuilder.getR() << 24 | ColorBuilder.getG() << 16 |
          ColorBuilder.getB() << 8 | ColorBuilder.getA() << 0);
    },
    setLineWidth: function (lineWidth) {
      YTX_CONFIG._drawContext.lineWidth = lineWidth;
    },
    setFillMode: function (isFill) {
      YTX_CONFIG._drawContext.isFillMode = isFill;
    },
    getEraser: function () {

    },
    getPen: function () {
      YTX_CONFIG._drawContext.drawStatus = YTX_CONFIG._drawStatus.DRAW_STATUS_NORMAL;
    },
    clearCurrentPage: function (callback, onError) {
      var sendStr = YTX_CONFIG._protobuf._buildClearCurrentPage(callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    gotoPage: function (gotoPageBuilder, callback, onError) {
      log(YTX_CONFIG._logLev._DEBUG, "=====gotoPage=====");
      var sendStr = YTX_CONFIG._protobuf._buildGotoPage(gotoPageBuilder, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    gotoNextPage: function (callback, onError) {
      log(YTX_CONFIG._logLev._DEBUG, "=====gotoNextPage=====");
      var sendStr = YTX_CONFIG._protobuf._buildGotoNextPage(callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    gotoPrevPage: function (callback, onError) {
      log(YTX_CONFIG._logLev._DEBUG, "=====gotoPrevPage=====");
      var sendStr = YTX_CONFIG._protobuf._buildGotoPrevPage(callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    drawUndo: function (type, callback, onError) { //撤销，应该在这判断是否是当前用户，未添加
      var sendStr = YTX_CONFIG._protobuf._buildDrawUndo(type, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    drawRedo: function (callback, onError) {
      var sendStr = YTX_CONFIG._protobuf._buildDrawRedo(callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    setDeleteModel: function () {
      YTX_CONFIG._drawContext.drawStatus = YTX_CONFIG._drawStatus.DRAW_STATUS_DELETE;
    },
    setMoveModel: function () {
      YTX_CONFIG._drawContext.drawStatus = YTX_CONFIG._drawStatus.DRAW_STATUS_ZOOM;
    },
    setZoomState: function () {
      YTX_CONFIG._drawContext.drawStatus = YTX_CONFIG._drawStatus.DRAW_STATUS_ZOOM;
    },
    scale: function (scaleBuilder, callback, onError) {
      var sendStr = YTX_CONFIG._protobuf._buildScale(scaleBuilder, callback, onError);
      if (!!sendStr) {
        YTX_CONFIG._sendMsg(sendStr)
      }
    },
    save: function () {

    },
    addText: function (pos, text) {
      YTX_CONFIG._canvasAppManager.generateTextNode(pos, text);
    },
    setWhiteBoardScale: function (scale) {
      if (scale == "undefined")
        return false;
      if (scale <= 0)
        scale = 0;
      YTX_CONFIG._drawContext.wbRatio = scale;
      return true;
    },

    setWhiteBoardIfScale: function () {

    }, // 暂时废弃
    // 通知监听器注册

    // 监听通知注册
    onUploadDocProcessListener: function (callback) {
      YTX_CONFIG._onUploadDocProcessListener = callback;
    },
    onDocConvertListener: function (callback) {
      YTX_CONFIG._onDocConvertListener = callback;
    },
    onGotoPageListener: function (callback) {
      YTX_CONFIG._onGotoPageListener = callback;
    },
    onShareDocListener: function (callback) {
      YTX_CONFIG._onShareDocListener = callback;
    },

    // canvas渲染相关函数
    notifyCanvasEventResize: function () {
      YTX_CONFIG._rePaint();
    },

    // 划线类型定义
    _shapeType: {
      NONE: 0,
      FREELINE: 1,
      LINE: 2,
      TRIANGLE: 4,
      RECT: 3,
      CIRCLE: 5,
      ELLIPSE: 6,
      DASHLINE: 7,
      ARROWMARK: 8,
      ARROWMARK1: 9,
      TEXTURE: 10,
      FONT: 11,
      LASERPEN: 12,
      END: 13
    },
  };
}())
