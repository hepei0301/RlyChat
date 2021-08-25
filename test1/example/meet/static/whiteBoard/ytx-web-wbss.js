//
// create by liusm is webH5-wbss-sdk on 2020-04-28
//

(function (e) {
  if (typeof hex_md5 == 'undefined') {
    document.write(
      '<script src="https://app.cloopen.com/im50/MD5.min.js" type="text/javascript" charset="utf-8"></script>'
    );
  }
  if (typeof Base64 == 'undefined') {
    document.write(
      '<script src="https://app.cloopen.com/im50/base64.min.js" type="text/javascript" charset="utf-8"></script>'
    );
  }
  if (typeof jQuery == 'undefined') {
    document.write(
      '<script src="https://app.cloopen.com/im50/jquery-1.11.3.min.js" type="text/javascript" charset="utf-8"></script>'
    );
  }

  function obj2string(o) {
    var r = [];
    if (typeof o == 'string') {
      return (
        '"' +
        o
          .replace(/([\'\"\\])/g, '\\$1')
          .replace(/(\n)/g, '\\n')
          .replace(/(\r)/g, '\\r')
          .replace(/(\t)/g, '\\t') +
        '"'
      );
    }
    if (typeof o == 'object') {
      if (!o.sort) {
        for (var i in o) {
          r.push(i + ':' + obj2string(o[i]));
        }
        if (
          !!document.all &&
          !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)
        ) {
          r.push('toString:' + o.toString.toString());
        }
        r = '{' + r.join() + '}';
      } else {
        for (var i = 0; i < o.length; i++) {
          r.push(obj2string(o[i]));
        }
        r = '[' + r.join() + ']';
      }
      return r;
    }
    if (!o) o = '';
    return o.toString();
  }

  // ============  YTX_WBSS_KERNEL 【Start】=================

  var YTX_WBSS_KERNEL = {
    // 预设信息
    WBSS_SDK_VERSION_STRING: 'v2.2.0.8',
    WBSS_SDK_VERSION_NUMBER: 2020008,
    WHITEBOARD_DOC_NAME: 'whiteboard',
    DEFAULT_DOC_PAGE_NUMBER: 10,

    // Surport Ability
    _isSurportWebSocket: false, ///< 是否支持WebSocket
    _isSurportFileReader: false, ///< 是否支持文件读取
    _isSurportCanvas: false, ///< 是否支持画布

    isShowDebugDownLoadFile: false, ///< 显示调试日志信息
    isShowDebugUpLoadFile: false, ///< 显示调试日志信息
    isShowDebugDocPageManager: false, ///< 显示调试当前页切换信息
    isShowDebugMouseEventCoors: false, ///< 显示调试坐标信息
    isShowDebugManagerDrawDataElement: false, ///< 显示绘图对象创建、更新、删除管理信息
    isShowDebugWebSocketSendMessage: true, ///< 显示发送的websocket json信息
    isShowDebugWebSocketRecvMessage: true, ///< 显示接收的websocket json信息

    _authKey: '123456',
    _appId: '8a2af988536458c301537d7197320004',
    _userId: 'aadasdsdasd_h5_test',

    _role_authorities_array: [], ///< 用户角色和权限

    _timeOutDocConvert: 50,

    _getTimeStamp: function () {
      var now = new Date();
      var timestamp =
        now.getFullYear() +
        '' +
        (now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1)) +
        (now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()) +
        (now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) +
        (now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) +
        (now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());
      return timestamp;
    },
    _mathRound: function (value) {
      return Math.round(value);
    },

    // ============  wbss kernel onListener =================

    // 监听器
    _roomtStatListener: null,
    _onUploadDocProcessListener: null,
    _onDocConvertListener: null,
    _onGotoPageListener: null, ///< 翻页回调
    _onShareDocListener: null, ///< 共享文档回调
    _onFilePathListener: function () {}, ///< 文档地址下发

    // ============  wbss kernel release room resource =================

    releaseRoomResourceTimeOutMS: 500, ///< 例如：解散房间延时清楚房间资源
    releaseRoomResource: function () {
      // 移除鼠标事件
      YTX_WBSS_KERNEL.CANVAS_MOD.removeMouseEvent();

      // 关闭 WebSocket 连接
      if (YTX_WBSS_KERNEL.websocket_handle_obj !== null)
        YTX_WBSS_KERNEL.disconnectWebScoketServer(true);

      // 释放 Rest Server 记录资源
      // YTX_WBSS_KERNEL._room_servers_websocket_url = [];
      // YTX_WBSS_KERNEL._room_servers_http_url = [];
      // YTX_WBSS_KERNEL._file_servers_http_url = [];
      var canvas_context = YTX_WBSS_KERNEL.canvas_html_handle.getContext('2d');
      console.log(
        '===canvas_html_handle===',
        YTX_WBSS_KERNEL.canvas_html_handle.width,
        YTX_WBSS_KERNEL.canvas_html_handle.height
      );
      console.log('===canvas_context===', canvas_context);
      canvas_context.clearRect(
        0,
        0,
        YTX_WBSS_KERNEL.canvas_html_handle.width,
        YTX_WBSS_KERNEL.canvas_html_handle.height
      );
      // 释放 RoomInfo 资源
      YTX_WBSS_KERNEL.isLoginInRoomServer = false;
      YTX_WBSS_KERNEL.currentLoginInRoomID = -1;
      YTX_WBSS_KERNEL.currentLoginInDocID = -1;
      YTX_WBSS_KERNEL.currentLoginInPageIndex = -1;
      YTX_WBSS_KERNEL.allRoomInfoMap = {};

      // 释放 DrawContext
      YTX_WBSS_KERNEL.drawContext.drawToolStatus =
        YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NONE;
      YTX_WBSS_KERNEL.drawContext.createDrawDataElementObjectNum = null;
      YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject = null;

      // 同步绘图
      YTX_WBSS_KERNEL.updateDrawScreen();
    },

    // ============  wbss kernel _parse Resp =================

    _parseCreateRoomResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      var head = obj['head'];
      var roomId = head['roomID'];
      var docId = 0;
      var doc_name = YTX_WBSS_KERNEL.WHITEBOARD_DOC_NAME;
      var doc_page_number = YTX_WBSS_KERNEL.DEFAULT_DOC_PAGE_NUMBER;
      var doc_url = '';
      var doc_timestamp = 0;
      var pageIndex = 1;
      var respCode = head['respCode'];
      var respMsg = head['reason'];
      var roleIDs_array = obj['roleIDs'];
      var authorities_array = obj['authorities'];

      if (respCode == 0) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=====_parseCreateRoomResp(roomId=' + (roomId == null ? 'null' : roomId) + ')====='
        );

        if (roomId != null && roomId > 0) {
          // 回调数据
          var callbackRoomInfoDataMap = {};
          var callbackDocDataArray = [];

          //进入房间成功
          YTX_WBSS_KERNEL.isLoginInRoomServer = true;
          YTX_WBSS_KERNEL.updateCurrentRoomId_DocId_PageIndex(roomId, docId, pageIndex);

          //保存用户角色和权限
          YTX_WBSS_KERNEL._role_authorities_array = [];
          if (roleIDs_array != null && authorities_array != null) {
            if (roleIDs_array.length == authorities_array.length && roleIDs_array.length > 0) {
              for (var i = 0; i < roleIDs_array.length; i++) {
                YTX_WBSS_KERNEL._role_authorities_array.push({
                  roleID: roleIDs_array[i],
                  authorities: authorities_array[i],
                });
              }
            }
          }

          // 保存房间信息
          var currentRoomInfo = new YTX_WBSS_KERNEL.RoomInfo(roomId);
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId] = currentRoomInfo;

          //保存文档信息
          callbackDocDataArray.push({
            wbssDocId: docId,
            wbssDocFileName: doc_name,
            wbssDocTotalPage: doc_page_number,
            wbssDocURL: doc_url,
          });
          var currentDocInfo = new YTX_WBSS_KERNEL.DocInfo(
            docId,
            doc_name,
            doc_page_number,
            doc_url,
            doc_timestamp
          );
          currentRoomInfo.addDocInfo(docId, currentDocInfo);

          // 返回数据
          callbackRoomInfoDataMap['wbssCurrentRoomId'] = YTX_WBSS_KERNEL.currentLoginInRoomID;
          callbackRoomInfoDataMap['wbssCurrentDocId'] = YTX_WBSS_KERNEL.currentLoginInDocID;
          callbackRoomInfoDataMap['wbssCurtentPageId'] = YTX_WBSS_KERNEL.currentLoginInPageIndex;
          callbackRoomInfoDataMap['wbssDocInfoDataArray'] = callbackDocDataArray;

          // 同步绘图
          YTX_WBSS_KERNEL.updateDrawScreen();

          // 注册鼠标事件
          if (YTX_WBSS_KERNEL.CANVAS_MOD != null) {
            YTX_WBSS_KERNEL.CANVAS_MOD.registerMouseEvent();
          }

          //回调接口
          var respOnSuccess = {};
          respOnSuccess.code = respCode;
          respOnSuccess.msg = respMsg;
          respOnSuccess.wbssRoomInfoMap = callbackRoomInfoDataMap;
          if (request_onSuccess != null) {
            request_onSuccess(respOnSuccess);
          }
        } //if(roomId != null && roomId > 0)
      } else {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          '=====_parseCreateRoomResp(respCode=' + respCode + ')====='
        );

        //回调接口
        var respOnError = {};
        respOnError.code = respCode;
        respOnError.msg = respMsg;
        if (request_onError != null) {
          request_onError(respOnError);
        }
      }
    },
    _parseJoinRoomResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseJoinRoomResp()=====');

      // 解析包头
      var head = obj['head'];
      var jsonCurRoomId = head['roomID'];
      var jsonCurDocId = obj['curDocID'];
      var jsonCurPageIndex = obj['curPageIndex'];
      var respCode = head['respCode'];
      var respMsg = head['reason'];

      // 回调数据
      var callbackRoomInfoDataMap = {};
      var callbackDocDataArray = [];

      // 响应结果
      if (respCode == 0) {
        //进入房间成功
        YTX_WBSS_KERNEL.isLoginInRoomServer = true;
        YTX_WBSS_KERNEL.updateCurrentRoomId_DocId_PageIndex(
          jsonCurRoomId,
          jsonCurDocId,
          jsonCurPageIndex
        );

        // 画布比例
        var wbScale = obj['wbCreateorScale'];
        if (wbScale != null) {
          YTX_WBSS_KERNEL.drawContext.wbRatio = wbScale;
        }

        // 保存房间信息
        var currentRoomInfo = new YTX_WBSS_KERNEL.RoomInfo(jsonCurRoomId);
        YTX_WBSS_KERNEL.allRoomInfoMap[jsonCurRoomId] = currentRoomInfo;

        // 保存文档数据信息
        var jsonDocDataArray = obj['docData'];
        for (var i in jsonDocDataArray) {
          var jsonDocData = jsonDocDataArray[i];
          var jsonDocId = jsonDocData['docID'];
          var jsonDocFileName = decodeURI(jsonDocData['filename']);
          var jsonDocTotalPage = jsonDocData['totalPage'];
          var jsonDocURL = jsonDocData['url'];
          var jsonDocTimestamp = jsonDocData['timestamp'];
          if (jsonDocFileName == null) {
            if (jsonDocId == 0) {
              jsonDocFileName = YTX_WBSS_KERNEL.WHITEBOARD_DOC_NAME;
            } else {
              jsonDocFileName = '';
            }
          }
          if (jsonDocTotalPage == null || jsonDocTotalPage < 0) {
            jsonDocTotalPage = 0;
          }
          if (jsonDocId == 0) {
            if (jsonDocURL == null) {
              jsonDocURL = '';
            }
          } else {
            jsonDocURL =
              YTX_WBSS_KERNEL.currentLoginInRoomID.toString() + '-' + jsonDocId.toString();
          }

          // 检查PageIndex信息
          if (jsonCurDocId == jsonDocId) {
            if (jsonCurPageIndex <= 0 || jsonCurPageIndex > jsonDocTotalPage) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._ERROR,
                'Check DocId= ' +
                  jsonCurDocId +
                  ' PageIndex Failed: index=' +
                  jsonCurPageIndex +
                  ' total=' +
                  jsonDocTotalPage +
                  ' PageIndex Force Set Zero!'
              );
              jsonCurPageIndex = 0;
              YTX_WBSS_KERNEL.updateCurrentRoomId_DocId_PageIndex(
                jsonCurRoomId,
                jsonCurDocId,
                jsonCurPageIndex
              );
            }
          }

          //保存文档信息
          callbackDocDataArray.push({
            wbssDocId: jsonDocId,
            wbssDocFileName: jsonDocFileName,
            wbssDocTotalPage: jsonDocTotalPage,
            wbssDocURL: jsonDocURL,
          });
          var currentDocInfo = new YTX_WBSS_KERNEL.DocInfo(
            jsonDocId,
            jsonDocFileName,
            jsonDocTotalPage,
            jsonDocURL,
            jsonDocTimestamp
          );
          currentRoomInfo.addDocInfo(jsonDocId, currentDocInfo);

          if (jsonDocId !== 0) {
            YTX_WBSS_KERNEL.setFileToLocal({
              roomId: jsonCurRoomId + '',
              docId: jsonDocId,
              ext: jsonDocData.ext,
              fileName: jsonDocFileName,
            });
          }
        } // for (var i in jsonDocDataArray)

        // 返回数据
        callbackRoomInfoDataMap['wbssCurrentRoomId'] = YTX_WBSS_KERNEL.currentLoginInRoomID;
        callbackRoomInfoDataMap['wbssCurrentDocId'] = YTX_WBSS_KERNEL.currentLoginInDocID;
        callbackRoomInfoDataMap['wbssCurtentPageId'] = YTX_WBSS_KERNEL.currentLoginInPageIndex;
        callbackRoomInfoDataMap['wbssDocInfoDataArray'] = callbackDocDataArray;

        // 是否需要同步更新绘图
        var isNeedUpdateDrawScreen = true;

        // 下载文档过多，导致drawscreen开始比较慢，不下载全部，只请求下载当前doc
        // YTX_WBSS_KERNEL.requestSynchronizeOneRoomAllDocsAllPageFiles(YTX_WBSS_KERNEL.currentLoginInRoomID);
        // YTX_WBSS_KERNEL.requestSynchronizeOneRoomOneDocAllPageFiles(YTX_WBSS_KERNEL.currentLoginInRoomID, YTX_WBSS_KERNEL.currentLoginInDocID);
        if (
          YTX_WBSS_KERNEL.requestSynchronizeOneRoomOneDocOnePageFile(
            YTX_WBSS_KERNEL.currentLoginInRoomID,
            YTX_WBSS_KERNEL.currentLoginInDocID,
            YTX_WBSS_KERNEL.currentLoginInPageIndex
          ) == true
        ) {
          isNeedUpdateDrawScreen = false;
        }

        // sync drawdata 同步划线
        var current_doc_info = YTX_WBSS_KERNEL.getDocInfo(
          YTX_WBSS_KERNEL.currentLoginInRoomID,
          YTX_WBSS_KERNEL.currentLoginInDocID,
          true
        );
        if (current_doc_info != null) {
          var current_doc_server_sync_draw_data_timestamp =
            current_doc_info.getServerSyncDocDrawDataTimeStamp();
          if (current_doc_server_sync_draw_data_timestamp > 0) {
            isNeedUpdateDrawScreen = false;
            YTX_WBSS_KERNEL.requestSyncDrawData(
              YTX_WBSS_KERNEL.currentLoginInRoomID,
              YTX_WBSS_KERNEL.currentLoginInDocID,
              current_doc_server_sync_draw_data_timestamp
            );
          }
        }

        // 同步绘图
        if (isNeedUpdateDrawScreen) {
          YTX_WBSS_KERNEL.updateDrawScreen();
        }

        // 注册鼠标事件
        if (YTX_WBSS_KERNEL.CANVAS_MOD != null) {
          YTX_WBSS_KERNEL.CANVAS_MOD.registerMouseEvent();
        }

        //回调接口
        var respOnSuccess = {};
        respOnSuccess.code = respCode;
        respOnSuccess.msg = respMsg;
        respOnSuccess.wbssRoomInfoMap = callbackRoomInfoDataMap;
        if (request_onSuccess != null) {
          request_onSuccess(respOnSuccess);
        }
      } else {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          '=====_parseJoinRoomResp()===== respCode=' + respCode
        );

        //回调接口
        var respOnError = {};
        respOnError.code = respCode;
        respOnError.msg = respMsg;
        if (request_onError != null) {
          request_onError(respOnError);
        }
      }
    },

    _parseLeaveRoomResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      var head = obj['head'];
      var room_id = head['roomID'];
      var respCode = head['respCode'];
      var respMsg = head['reason'];

      if (respCode == 0) {
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseLeaveRoomResp()=====');
        if (YTX_WBSS_KERNEL.currentLoginInRoomID == room_id) {
          // 退出释放房间资源
          YTX_WBSS_KERNEL.releaseRoomResource();
        }
      } else {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=====_parseLeaveRoomResp()===== respCode=' + respCode
        );
        // 退出释放房间资源
        YTX_WBSS_KERNEL.releaseRoomResource();
      }
      var resp = {};
      resp.code = respCode;
      resp.msg = respMsg;
      if (request_onSuccess != null) {
        request_onSuccess(resp);
      }
    },

    _parseDeleteRoomResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      var head = obj['head'];
      var room_id = head['roomID'];
      var respCode = head['respCode'];
      var respMsg = head['reason'];

      if (respCode == 0) {
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseDeleteRoomResp()=====');
        if (YTX_WBSS_KERNEL.currentLoginInRoomID == room_id) {
          // 退出释放房间资源
          YTX_WBSS_KERNEL.releaseRoomResource();
        }
      } else {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=====_parseDeleteRoomResp()===== respCode=' + respCode
        );
        YTX_WBSS_KERNEL.releaseRoomResource();
      }

      var resp = {};
      resp.code = respCode;
      resp.msg = respMsg;
      if (request_onSuccess != null) {
        request_onSuccess(resp);
      }
    },
    _parseKickoutResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseKickoutResp()=====');
    },
    _parseClearRoomResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseClearRoomResp()=====');
    },
    _parseShareDocResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseShareDocResp()=====');
      var head = obj['head'];
      var roomId = head['roomID'];
      var respCode = head['respCode'];
      var respMsg = head['reason'];
      var docId = obj['docID'];
      var pageIndex = obj['pageIndex'];
      var timestamp = obj['timestamp'];

      if (roomId != null && docId != null && pageIndex != null) {
        // 构建切换文档消息
        var parseShareDocNotifyObject = new Object();
        parseShareDocNotifyObject['head'] = { roomID: roomId };
        parseShareDocNotifyObject['docID'] = docId;
        parseShareDocNotifyObject['pageIndex'] = pageIndex;
        parseShareDocNotifyObject['timestamp'] = timestamp;
        YTX_WBSS_KERNEL._parseShareDocNotify(parseShareDocNotifyObject);

        // 返回成功
        var respSuccess = {};
        respSuccess.code = respCode;
        respSuccess.msg = respMsg;
        respSuccess.docId = docId;
        respSuccess.pageId = pageIndex;
        if (request_onSuccess != null) {
          request_onSuccess(respSuccess);
        }
        return;
      }

      // 返回失败
      var respError = {};
      respError.code = respCode;
      respError.msg = respMsg;
      if (request_onError != null) {
        request_onError(respError);
      }
    },
    _parseRemoveShareDocResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseRemoveShareDocResp()=====');
    },
    _parseGotoPageResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseGotoPageResp()=====');

      if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
        respError.msg = 'not in room.';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
        if (request_onError != null) {
          request_onError(respError);
        }
        return null;
      }

      var head = obj['head'];
      var roomId = head['roomID'];
      var respCode = head['respCode'];
      var reason = head['reason'];
      var pageIndex = obj['pageIndex'];

      var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
      var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
      var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo();
      var min_page_index = 1;
      var max_page_index = current_doc_info != null ? current_doc_info.getPageSize() : 0;

      if (
        head == null ||
        roomId == null ||
        respCode == null ||
        reason == null ||
        pageIndex == null ||
        current_room_id == null ||
        current_doc_id == null ||
        current_doc_info == null ||
        current_room_id != roomId ||
        pageIndex < min_page_index ||
        pageIndex > max_page_index
      ) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM;
        respError.msg = '_parseGotoPageResp param invalid';
        if (request_onError != null) {
          request_onError(respError);
        }
        return null;
      }

      // 返回错误信息
      if (respCode != 0) {
        var respError = {};
        respError.code = respCode;
        respError.msg = reason;
        if (request_onError != null) {
          request_onError(respError);
        }
        return null;
      }

      // 设置当前页
      YTX_WBSS_KERNEL.updateCurrentRoomId_DocId_PageIndex(
        current_room_id,
        current_doc_id,
        pageIndex
      );

      // 响应回调
      var respSuccess = {};
      respSuccess.code = respCode;
      respSuccess.msg = reason;
      respSuccess.roomId = current_room_id;
      respSuccess.docId = current_doc_id;
      respSuccess.pageId = pageIndex;
      respSuccess.pages = max_page_index;

      if (request_onSuccess != null) {
        request_onSuccess(respSuccess);
      }

      // 同步绘图
      YTX_WBSS_KERNEL.updateDrawScreen();
    },
    _parseRemoveWbPageResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseRemoveWbPageResp()=====');
    },
    _parseWbssDrawResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseWbssDrawResp()=====');
    },
    _parseWbssDeleteDrawResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      var head = obj['head'];
      var type = obj['type'];
      var reason = head['reason'];
      var reqID = head['reqID'];
      var respCode = head['respCode'];
      var roomID = head['roomID'];
      if (head != null && respCode != null && request_msgExtData != null && respCode == 0) {
        // 复用接收消息
        var obj_delete_notify_head = new Object();
        obj_delete_notify_head['authKey'] = '';
        obj_delete_notify_head['reqID'] = reqID;
        obj_delete_notify_head['roomID'] = request_msgExtData.room_id;
        obj_delete_notify_head['userID'] = '';

        var obj_delete_notify = new Object();
        obj_delete_notify['head'] = obj_delete_notify_head;
        obj_delete_notify['docID'] = request_msgExtData.doc_id;
        obj_delete_notify['drawID'] = request_msgExtData.draw_id;
        obj_delete_notify['pageIndex'] = request_msgExtData.page_index;
        obj_delete_notify['type'] = type;

        YTX_WBSS_KERNEL._parseDrawDeleteNotify(obj_delete_notify);

        //  响应回调
        var respSuccess = {};
        respSuccess.code = respCode;
        respSuccess.msg = reason;
        respSuccess.room_id = request_msgExtData.room_id;
        respSuccess.doc_id = request_msgExtData.doc_id;
        respSuccess.page_index = request_msgExtData.page_index;
        respSuccess.draw_id = request_msgExtData.draw_id;
        if (request_onSuccess != null) {
          request_onSuccess(respSuccess);
        }
      } else {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          '=====_parseWbssDeleteDrawResp() code=' + respCode + '====='
        );
        var respError = {};
        respError.code = respCode;
        respError.msg = reason;
        if (request_onError != null) {
          request_onError(respError);
        } else {
        }
      }
    },
    _parseDrawUndoResp: function (
      obj,
      request_id_number,
      request_msgType,
      request_msgExtData,
      request_onSuccess,
      request_onError
    ) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseDrawUndoResp()=====');
      var head = obj['head'];
      var type = obj['type'];
      var roomID = head['roomID'];
      var respCode = head['respCode'];
      var reason = head['reason'];
      if (
        head != null &&
        type != null &&
        roomID != null &&
        respCode != null &&
        reason != null &&
        respCode == 0
      ) {
        if (request_onSuccess != null) {
          var respSuccess = {};
          respSuccess.code = respCode;
          respSuccess.msg = reason;
          request_onSuccess(respSuccess);
        }
      } else {
        if (request_onError != null) {
          var respError = {};
          respError.code = respCode;
          respError.msg = reason;
          request_onError(respError);
        }
      }
    },

    // ============  wbss kernel _parse Notify =================

    _parseDeleteRoomNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseDeleteRoomNotify()=====');
      // 退出释放房间资源
      YTX_WBSS_KERNEL.releaseRoomResource();
    },
    _parseClearRoomNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseClearRoomNotify()=====');
    },
    _parseMemberJoinNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseMemberJoinNotify()=====');
    },
    _parseMemberLeaveNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseMemberLeaveNotify()=====');
    },
    _parseShareDocNotify: function (obj) {
      var roomId = obj['head']['roomID'];
      var docId = obj['docID'];
      var pageId = obj['pageIndex'];
      var timestamp = obj['timestamp'];

      // Json 校验
      if (roomId != null && docId != null && pageId != null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=====_parseShareDocNotify(roomId=' + roomId + ',docId=' + docId + ',' + pageId + ')====='
        );

        // 检查当前文档是否需要切换
        if (YTX_WBSS_KERNEL.isCurrentRoomId_DocId_PageIndex(roomId, docId, pageId) == true) {
          // 当前文档
          if (timestamp != null && timestamp > 0) {
            var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo(true);
            var current_doc_local_timestamp = current_doc_info.getLocalSyncDocDrawDataTimeStamp();
            if (timestamp > current_doc_local_timestamp) {
              YTX_WBSS_KERNEL.requestSyncDrawData(roomId, docId, timestamp);
            }
          } //if(timestamp != null && timestamp > 0)
        } else {
          // 设置当前显示页
          YTX_WBSS_KERNEL.updateCurrentRoomId_DocId_PageIndex(roomId, docId, pageId);

          // 请求获取文档数据
          if (YTX_WBSS_KERNEL.currentLoginInDocID > 0) {
            YTX_WBSS_KERNEL.requestSynchronizeOneRoomOneDocAllPageFiles(
              YTX_WBSS_KERNEL.currentLoginInRoomID,
              YTX_WBSS_KERNEL.currentLoginInDocID
            );
          }

          // 当前文档
          if (timestamp != null && timestamp > 0) {
            var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo(true);
            var current_doc_local_timestamp = current_doc_info.getLocalSyncDocDrawDataTimeStamp();
            if (timestamp > current_doc_local_timestamp) {
              YTX_WBSS_KERNEL.requestSyncDrawData(roomId, docId, timestamp);
            }
          } //if(timestamp != null && timestamp > 0)
        }

        // 同步绘图
        YTX_WBSS_KERNEL.updateDrawScreen();

        // 响应应用层
        if (YTX_WBSS_KERNEL._onShareDocListener != null) {
          var resp = {};
          resp.roomId = roomId;
          resp.docId = docId;
          resp.pageId = pageId;
          resp.curDocInfo = YTX_WBSS_KERNEL.getCurrentDocInfo(true);
          YTX_WBSS_KERNEL._onShareDocListener(resp);
        } //if (YTX_WBSS_KERNEL._onShareDocListener != null)
      } //if(roomId != null && docId != null && pageId != null)
    },
    _parseRemoveDocNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, '=====_parseRemoveDocNotify()=====');
    },
    _parseGotoPageNotify: function (obj) {
      var roomId = obj['head']['roomID'];
      var docId = obj['docID'];
      var pageId = obj['pageIndex'];

      // Json 校验
      if (roomId != null && docId != null && pageId != null && docId >= 0 && pageId >= 1) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=====_parseGotoPageNotify(roomId=' + roomId + ',docId=' + docId + ',' + pageId + ')====='
        );

        // 校验页数
        var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo(true);
        if (current_doc_info != null) {
          var page_total_num = current_doc_info.getPageSize();
          if (page_total_num > 0 && pageId <= page_total_num) {
            // 设置当前显示页
            YTX_WBSS_KERNEL.updateCurrentRoomId_DocId_PageIndex(roomId, docId, pageId);

            // 请求同步资源图片
            if (YTX_WBSS_KERNEL.currentLoginInDocID > 0) {
              YTX_WBSS_KERNEL.requestSynchronizeOneRoomOneDocOnePageFile(roomId, docId, pageId);
            }

            // 同步绘图
            YTX_WBSS_KERNEL.updateDrawScreen();

            // 响应应用层
            if (YTX_WBSS_KERNEL._onGotoPageListener != null) {
              var resp = {};
              resp.roomId = roomId;
              resp.docId = docId;
              resp.pageId = pageId;
              resp.curPageInfo = YTX_WBSS_KERNEL.getCurrentPageInfo(true);
              YTX_WBSS_KERNEL._onGotoPageListener(resp);
            }
          } //if(page_total_num > 0 && pageId <= page_total_num)
        } //if(current_doc_info != null)
      } //if(roomId != null && docId != null && pageId != null)
    },
    _parseDrawNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseDrawNotify()=====');

      var head = obj['head'];
      var current_draw_data_object = obj['data'];
      var userId = head['userID'];
      var room_id = head['roomID'];
      var doc_id = current_draw_data_object['docID'];
      var page_index = parseInt(current_draw_data_object['pageIndex']);

      var page_info = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, true);
      if (page_info != null) {
        if (
          YTX_WBSS_KERNEL.addServerDrawDataObject(
            room_id,
            doc_id,
            page_index,
            current_draw_data_object
          )
        ) {
          // 保存数据成功，是否需要更新当前，页面
          if (YTX_WBSS_KERNEL.isCurrentRoomId_DocId_PageIndex(room_id, doc_id, page_index)) {
            // 同步绘图
            YTX_WBSS_KERNEL.updateDrawScreen();
          }
        }
      }
    },
    _parseDrawDeleteNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_parseDrawDeleteNotify()=====');

      var head = obj['head'];
      var docID = obj['docID'];
      var drawID = obj['drawID'];
      var pageIndex = obj['pageIndex'];
      var type = obj['type'];
      var head_authKey = head != null ? head['authKey'] : null;
      var head_reqID = head != null ? head['reqID'] : null;
      var head_roomID = head != null ? head['roomID'] : null;
      var head_userID = head != null ? head['userID'] : null;

      // 是否在会议室中
      if (YTX_WBSS_KERNEL.isLoginInRoomServer) {
        // 当前信息
        var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
        var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
        var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();

        if (
          type != null &&
          head != null &&
          docID != null &&
          head_roomID != null &&
          head_roomID == current_room_id
        ) {
          var isUpdateDrawScreen = false;
          switch (type) {
            case YTX_WBSS_KERNEL.drawConextDelType.DRAW_DEL_TYPE_LINE:
              {
                if (pageIndex != null) {
                  // 获取页信息
                  var page_info = YTX_WBSS_KERNEL.getPageInfo(head_roomID, docID, pageIndex, true);
                  if (page_info != null) {
                    // 删除元素
                    var drawId = obj['drawID'];
                    if (drawId != null) {
                      if (
                        YTX_WBSS_KERNEL.allRoomInfoMap[head_roomID].docInfoMap[docID].pageInfoArray[
                          pageIndex - 1
                        ].clearDrawDataElement(drawId) == true
                      ) {
                        if (
                          head_roomID == current_room_id &&
                          docID == current_doc_id &&
                          pageIndex == current_page_index
                        ) {
                          // 当前页需要更新画布
                          isUpdateDrawScreen = true;
                        }
                      }
                    }
                  }
                }
              }
              break;
            case YTX_WBSS_KERNEL.drawConextDelType.DRAW_DEL_TYPE_PAGE:
              {
                if (pageIndex != null) {
                  // 清空页
                  var page_info = YTX_WBSS_KERNEL.getPageInfo(head_roomID, docID, pageIndex, true);
                  if (page_info != null) {
                    if (
                      YTX_WBSS_KERNEL.allRoomInfoMap[head_roomID].docInfoMap[docID].pageInfoArray[
                        pageIndex - 1
                      ].clearAllDrawDataElement() == true
                    ) {
                      if (
                        head_roomID == current_room_id &&
                        docID == current_doc_id &&
                        pageIndex == current_page_index
                      ) {
                        // 当前页需要更新画布
                        isUpdateDrawScreen = true;
                      }
                    }
                  }
                }
              }
              break;
            case YTX_WBSS_KERNEL.drawConextDelType.DRAW_DEL_TYPE_DOC:
              {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._WARN,
                  '===== unknow YTX_WBSS_KERNEL.drawConextDelType.DRAW_DEL_TYPE_DOC ====='
                );
              }
              break;
          }

          // 同步绘图
          if (isUpdateDrawScreen) {
            YTX_WBSS_KERNEL.updateDrawScreen();
          }
        } //if(type != null && head != null)
      }
    },
    _parseDocConvertNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '======_parseDocConvertNotify()======');
      var head = obj['head'];
      var docID = obj['docID'];
      var ext = obj['ext'];
      var filename = obj['filename'];
      var reason = obj['reason'];
      var result = obj['result'];
      var totalPage = obj['totalPage'];
      var url = obj['url'];
      var userID = obj['userID'];
      var head_reqID = head['reqID'];
      var head_roomID = head['roomID'];

      // 回调数据
      var callbackRoomInfoDataMap = {};
      var callbackDocDataArray = [];

      // 已在房间中
      if (YTX_WBSS_KERNEL.isLoginInRoomServer == true) {
        // 成功
        if (result == 0 && docID > 0 && totalPage > 0) {
          // 清除本地上传文档的缓存
          var wait_convert_complete_doc_obj = YTX_WBSS_KERNEL._docWaitConvertCompletedMap[docID];
          if (wait_convert_complete_doc_obj != null) {
            // 清除缓存对象
            delete YTX_WBSS_KERNEL._docWaitConvertCompletedMap[docID];

            // 停止定时器
            if (wait_convert_complete_doc_obj.timer_handle != null) {
              window.clearInterval(wait_convert_complete_doc_obj.timer_handle);
              wait_convert_complete_doc_obj.timer_handle = null;
            }
          }

          // 当前房间信息
          var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
          var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
          var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();

          // 当前房间信息
          if (
            current_room_id == head_roomID &&
            current_doc_id != null &&
            current_page_index != null
          ) {
            // 检查 doc_id 是否已经存在
            var recv_doc_info = YTX_WBSS_KERNEL.getDocInfo(current_room_id, docID, false);
            if (recv_doc_info == null) {
              // 保存文档信息
              var jsonDocURL = current_room_id.toString() + '-' + docID.toString();
              var currentDocInfo = new YTX_WBSS_KERNEL.DocInfo(
                docID,
                filename,
                totalPage,
                jsonDocURL,
                0
              );
              YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id].addDocInfo(docID, currentDocInfo);

              // 获取文档信息
              var doc_id_array = window.Object.keys(
                YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id].docInfoMap
              );
              for (var i = 0; i < doc_id_array.length; i++) {
                var doc_id = doc_id_array[i];
                var doc_info = YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id].docInfoMap[doc_id];
                if (doc_info != null) {
                  callbackDocDataArray.push({
                    wbssDocId: doc_info.docId,
                    wbssDocFileName: decodeURI(doc_info.docName),
                    wbssDocTotalPage: doc_info.pageSize,
                    wbssDocURL: doc_info.docUrl,
                  });
                }
              }
              YTX_WBSS_KERNEL.setFileToLocal({
                roomId: current_room_id,
                docId: docID,
                ext,
                fileName: decodeURI(doc_info.docName),
              });

              // 返回数据
              callbackRoomInfoDataMap['wbssCurrentRoomId'] = current_room_id;
              callbackRoomInfoDataMap['wbssCurrentDocId'] = current_doc_id;
              callbackRoomInfoDataMap['wbssCurtentPageId'] = current_page_index;
              callbackRoomInfoDataMap['wbssDocInfoDataArray'] = callbackDocDataArray;
            }
          }
        }
      }

      // 事件回调
      if (YTX_WBSS_KERNEL._onDocConvertListener != null) {
        var resp = {};
        resp.code = result;
        resp.msg = reason;
        var map_length = window.Object.keys(callbackRoomInfoDataMap).length;
        if (map_length <= 0) {
          resp.recv_room_id = head_roomID;
          resp.recv_doc_idc = docID;
          resp.recv_doc_pagesize = totalPage;
        } else {
          resp.wbssRoomInfoMap = callbackRoomInfoDataMap;
        }
        YTX_WBSS_KERNEL._onDocConvertListener(resp);
      }
    },
    _parseDrawUndoNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '======_parseDrawUndoNotify()======');
      var room_id = obj['head']['roomID'];
      var doc_id = obj['docID'];
      var page_index = obj['pageIndex'];
      var drawId = obj['drawID'];
      var type = obj['type']; ///< type 【0-false is 撤销】 【1-true is 恢复】
      var page_info = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, true);
      if (page_info != null) {
        if (
          YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
            page_index - 1
          ].setDrawUndoStatus(drawId, type)
        ) {
          // 同步绘图
          YTX_WBSS_KERNEL.updateDrawScreen();
        }
      }
    },
    _parseKickOutNotify: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '======_parseKickOutNotify()======');
      // 退出释放房间资源
      YTX_WBSS_KERNEL.releaseRoomResource();
    },

    // ============  wbss kernel others =================

    findPageId: function (docId, pageId) {
      var size = YTX_WBSS_KERNEL.getDocSize(docId);
      if (pageId < 1 || pageId > size) {
        return false;
      }
      return true;
    },
    getDocSize: function (_docId) {
      var docId = !!_docId ? _docId : YTX_WBSS_KERNEL.getCurDocId();

      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[YTX_WBSS_KERNEL.currentLoginInRoomID];
      //YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, "currentRoomInfo=" + currentRoomInfo);
      if (!currentRoomInfo) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          '找不到房间(' + YTX_WBSS_KERNEL.currentLoginInRoomID + ')信息'
        );
        return;
      }
      var di = currentRoomInfo.getDocInfo(docId);
      //YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, "di=" + di);
      if (!di) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          '找不到文档(' + YTX_WBSS_KERNEL.currentLoginInDocID + ')信息'
        );
        return;
      }
      return di.getPageSize();
    },
    getPageImageInfo: function (imgWidth, imgHeight) {
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[YTX_WBSS_KERNEL.currentLoginInRoomID];
      if (currentRoomInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          '找不到房间(' + YTX_WBSS_KERNEL.currentLoginInRoomID + ')信息'
        );
        return;
      }

      var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
      var currentDocInfo = currentRoomInfo.getDocInfo(current_doc_id);
      //YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, "di=" + di);
      if (!currentDocInfo) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          '找不到文档(' + current_doc_id + ')信息'
        );
        return;
      }
      imgWidth = currentDocInfo.imgWidth;
      imgHeight = currentDocInfo.imgHeight;
      return;
    },

    isSamePage: function (roomId, docId, pageId) {
      return (
        YTX_WBSS_KERNEL.getCurRoomId() == roomId &&
        YTX_WBSS_KERNEL.getCurDocId() == docId &&
        YTX_WBSS_KERNEL.getCurPageIndex() == pageId
      );
    },

    // ============  wbss kernel log =================

    _logPrint: true, ///< 打印日志控制开关
    _logLevStat: 0,
    _logLev: {
      _TRACE: 0,
      _DEBUG: 1,
      _INFO: 2,
      _WARN: 3,
      _ERROR: 4,
    },

    // 打印日志
    _log: function (lev, content) {
      if (!YTX_WBSS_KERNEL._logPrint) {
        //如果开关关闭，则不打印日志 直接返回
        return;
      }
      if (lev < YTX_WBSS_KERNEL._logLevStat) {
        return;
      }
      if (
        !window.console ||
        !window.console.log ||
        !window.console.info ||
        !window.console.warn ||
        !window.console.error
      ) {
        return;
      }
      var timeStamp = YTX_WBSS_KERNEL._getTimeStamp();
      content = timeStamp + ' ::wbss SDK :: ' + content;
      if (lev == YTX_WBSS_KERNEL._logLev._DEBUG) {
        console.log(content);
      } else if (lev == YTX_WBSS_KERNEL._logLev._INFO) {
        console.info(content);
      } else if (lev == YTX_WBSS_KERNEL._logLev._WARN) {
        console.warn(content);
      } else if (lev == YTX_WBSS_KERNEL._logLev._ERROR) {
        console.error(content);
      }
    },

    // ============  wbss kernel rest server =================

    // server addr config
    _rest_servers_url: ['MTkyLjE2OC4xODIuNTI6ODAwMQ'], ///< "ip:port"  Base64
    _room_servers_websocket_url: [], ///< "ip:port"  Base64
    _room_servers_http_url: [], ///< "ip:port"  Base64
    _file_servers_http_url: [], ///< "ip:port"  Base64

    //var wss_server_ip =  _room_servers_websocket_url[0].split(":")[0];
    //var wss_server_port = Number(_room_servers_websocket_url[0].split(":")[1]);

    // 连接rest服务器
    _requestRestServer: function (roomId, callback_wbss_room_start, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====_requestRestServer()=====');
      var request_data_array = {
        roomId: roomId.toString(),
        userId: YTX_WBSS_KERNEL._userId,
        appId: YTX_WBSS_KERNEL._appId,
        authKey: YTX_WBSS_KERNEL._authKey,
      };
      var json_data_array = JSON.stringify(request_data_array);
      YTX_WBSS_KERNEL.websocket_sendByteDataTotal += json_data_array.length;
      var request_ajax_url = $.ajax({
        type: 'POST',
        timeout: 5000,
        url: Base64.decode(YTX_WBSS_KERNEL._rest_servers_url[0]) + '/rest/auth',
        data: json_data_array,
        async: true,
        crossDomain: true,
        // xhrFields:{
        //     withCredentials:true
        // },
        success: function (e) {
          if (!e) {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._ERROR,
              'error: connect rest failed, please check server ip and port' + e
            );
            var resp = {};
            resp.code = YTX_WBSS_KERNEL._errcode._HTTP_CONECT_ERROR;
            resp.msg = 'connect rest failed, please check server ip and port';
            onError(resp);
            YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, e);
            return;
          }
          YTX_WBSS_KERNEL.websocket_recvByteDataTotal += e.length;
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, 'rest response=' + e);
          var response = JSON.parse(e);
          var statusCode = parseInt(response['statusCode']);
          var reason_string = response['reason'];
          if (statusCode == 0) {
            // 保存 Rest Server 配置
            var wbss_http_room_server_url = response['roomServers'][0];
            var wbss_websocket_room_server_url = response['websocketServers'][0];
            var wbss_file_server_url = response['fileServers'][0];
            if (wbss_websocket_room_server_url.length > 0 && wbss_file_server_url.length > 0) {
              YTX_WBSS_KERNEL._room_servers_http_url[0] = Base64.encode(wbss_http_room_server_url);
              YTX_WBSS_KERNEL._room_servers_websocket_url[0] = Base64.encode(
                wbss_websocket_room_server_url
              );
              YTX_WBSS_KERNEL._file_servers_http_url[0] = Base64.encode(wbss_file_server_url);

              //连接Websocket
              YTX_WBSS_KERNEL.connectWebScoketServer(callback_wbss_room_start, onError);
            } else {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._ERROR,
                'error: respose room server or file server is null'
              );
              var resp = {};
              resp.code = statusCode;
              resp.msg = 'respose room server or file server is null';
              onError(resp);
            }
          } else {
            var resp = {};
            resp.code = statusCode;
            resp.msg = 'restserver:response status not success,' + reason_string;
            YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, resp.msg);
            onError(resp);
          }
        },
        error: function (e) {
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'connect rest error ' + e);
          var resp = {};
          resp.code = YTX_WBSS_KERNEL._errcode._HTTP_CONECT_ERROR;
          resp.msg = 'connect rest error, please check server ip and port';
          onError(resp);
        },
      });
    },

    // ============  wbss kernel websocket api =================

    websocket_isSSLEncrypt: false, ///< WebSocket ws or wss
    websocket_handle_obj: null, ///< WebSocket Handle
    websocket_url_string: '', ///< WebSocket Handle URL
    websocket_connect_timeout_ms: 8000, ///< WebSocket Connect Timeout MilliSecond
    websocket_enumConnectStatus: {
      websocket_enumStatusCloned: 0, ///< 已关闭
      websocket_enumStatusConnecting: 1, ///< 正在连接中
      websocket_enumStatusReconnecting: 2, ///< 正在重接中
      websocket_enumStatusConnected: 3, ///< 已连接
    },
    websocket_connectStatus: 0, ///< WebSocket连接状态
    websocket_recvByteDataTotal: 0, ///< 接收数据总量统计
    websocket_sendByteDataTotal: 0, ///< 发送数据总量统计

    websocket_sendMsgRequestIDSeed: 1, ///< 发送消息的req序号，自增长种子
    websocket_sendMsgRequestIDMap: {}, ///< 发送消息的req序号，消息缓存，为了回调事件
    websocket_sendMsgRequestIDTimeOutMS: 8000, ///< 发送消息，需要服务器端resp回调，超时时间
    intervalId: '',
    heartBeatInterval: {
      _2G: 45,
      _3G: 90,
      _4G: 180,
      _WIFI: 15,
      _RECONNECT: 15,
    }, //心跳间隔
    heartBeatTimeOut: 5, //心跳超时时间
    failIntervalId: null,
    failHeartBeatInterval: 10,
    reconnectInterval: null,
    reconnectIntervalTime: 15, //重连定时器时间
    reconnectNum: 0, //重连次数
    maxReconnectNum: 15, //最大重连次数
    isOffLine: false, //是否是网络掉线

    connectWebScoketServer: function (callback_wbss_room_start, onError) {
      YTX_WBSS_KERNEL._log(
        YTX_WBSS_KERNEL._logLev._DEBUG,
        '=====_connectWebScoketServer【Start】====='
      );

      // 检查已连接
      var wbss_websocket_connect_url = Base64.decode(
        YTX_WBSS_KERNEL._room_servers_websocket_url[0]
      );
      if (
        YTX_WBSS_KERNEL.websocket_url_string == wbss_websocket_connect_url &&
        YTX_WBSS_KERNEL.websocket_handle_obj != null
      ) {
        if (
          YTX_WBSS_KERNEL.websocket_connectStatus ==
          YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusConnected
        ) {
          // 复用已经连接的 Websocket 对象
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'Reuse connected Websocket object and connection !'
          );
          var resp = {};
          resp.code = this._errcode._SUCCESS;
          resp.msg = 'already login server';
          callback_wbss_room_start(resp);
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._DEBUG,
            '=====_connectWebScoketServer【End】====='
          );
          return;
        } else if (
          YTX_WBSS_KERNEL.websocket_connectStatus ==
            YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusConnecting ||
          YTX_WBSS_KERNEL.websocket_connectStatus ==
            YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusReconnecting
        ) {
          // 已有正在连接的处理，防止重复连接，吃掉此消息，直接返回
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._WARN,
            'Other websocket handle is connecting， return now !'
          );
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._DEBUG,
            '=====_connectWebScoketServer【End】====='
          );
          return;
        }
      }

      // 断开连接
      if (YTX_WBSS_KERNEL.websocket_handle_obj != null) {
        YTX_WBSS_KERNEL.disconnectWebScoketServer(true);
      }

      // 创建 WebSocket 对象，服务器端，不使用 wss
      var full_wbss_websocket_connect_url = '';
      if (YTX_WBSS_KERNEL.websocket_isSSLEncrypt) {
        full_wbss_websocket_connect_url = 'wss://' + wbss_websocket_connect_url;
      } else {
        full_wbss_websocket_connect_url = 'ws://' + wbss_websocket_connect_url;
      }
      YTX_WBSS_KERNEL.websocket_handle_obj = new WebSocket(full_wbss_websocket_connect_url);
      YTX_WBSS_KERNEL.websocket_url_string = wbss_websocket_connect_url;
      YTX_WBSS_KERNEL.websocket_connectStatus =
        YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusConnecting;

      // 超时检测对象，创建，连接超时定时器
      var connect_websocket_timeout_timer = window.setTimeout(function () {
        if (
          YTX_WBSS_KERNEL.websocket_connectStatus !=
          YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusConnected
        ) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._WARN,
            'Connect to websocket ' + full_wbss_websocket_connect_url + ' time out'
          );

          // 断开连接
          if (YTX_WBSS_KERNEL.websocket_handle_obj != null) {
            YTX_WBSS_KERNEL.disconnectWebScoketServer(true);
          }

          // 超时回调
          var resp = {};
          resp.code = YTX_WBSS_KERNEL._errcode._NETWORK_TIME_OUT;
          resp.msg = 'connect to websocket time out.';
          if (onError != null) {
            onError(resp);
          }
          return;
        } else {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._DEBUG,
            'connect_websocket_timeout_timer is Dead!'
          );
        }
      }, YTX_WBSS_KERNEL.websocket_connect_timeout_ms);

      // WebSocket OnOpen 事件
      YTX_WBSS_KERNEL.websocket_handle_obj.onopen = function (event) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          '=====YTX_WBSS_KERNEL.websocket_handle_obj.onopen====='
        );

        // 关闭，连接超时定时器
        if (connect_websocket_timeout_timer != null) {
          window.clearTimeout(connect_websocket_timeout_timer);
          connect_websocket_timeout_timer = null;
        }

        // WebSocket 已连接状态
        YTX_WBSS_KERNEL.websocket_connectStatus =
          YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusConnected;

        // 回调 WebSocket 连接成功
        if (callback_wbss_room_start) {
          var resp = {};
          resp.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
          resp.msg = 'login server success';
          callback_wbss_room_start(resp);
        }

        //  注册心跳
        YTX_WBSS_KERNEL.intervalId = window.setInterval(
          YTX_WBSS_KERNEL.heartBeat,
          YTX_WBSS_KERNEL.heartBeatInterval._WIFI * 1000
        );
        window.addEventListener(
          'offline',
          function () {
            console.log('offline---');
            YTX_WBSS_KERNEL.isOffLine = true;
            if (YTX_WBSS_KERNEL.reconnectNum === 0) {
              YTX_WBSS_KERNEL.reconnect(function () {});
            }
          },
          true
        );
        window.addEventListener(
          'online',
          function () {
            YTX_WBSS_KERNEL.isOffLine = false;
            YTX_WBSS_KERNEL.reconnect(function () {});
          },
          true
        );
      };

      // WebSocket onmessage 事件
      YTX_WBSS_KERNEL.websocket_handle_obj.onmessage = function (event) {
        // 关闭，连接超时定时器
        if (connect_websocket_timeout_timer != null) {
          window.clearTimeout(connect_websocket_timeout_timer);
          connect_websocket_timeout_timer = null;
        }

        //消息处理
        YTX_WBSS_KERNEL.onWebSocketRecvMsg(event.data);
      };

      // WebSocket onclose 事件
      YTX_WBSS_KERNEL.websocket_handle_obj.onclose = function (event) {
        window.addEventListener('offline', function () {}, true);
        window.addEventListener('online', function () {}, true);
        YTX_WBSS_KERNEL.connectStateChange(5, 'connect closed');
        // if (YTX_WBSS_KERNEL.reconnectNum === 0) {
        //   YTX_WBSS_KERNEL.connectStateChange(1, "connect closed");
        //   YTX_WBSS_KERNEL.reconnect(function () {
        //   });
        // }

        // 关闭，连接超时定时器
        if (connect_websocket_timeout_timer != null) {
          window.clearTimeout(connect_websocket_timeout_timer);
          connect_websocket_timeout_timer = null;
        }

        // 关闭WebSocket事件处理
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          '=====YTX_WBSS_KERNEL.websocket_handle_obj.onclose code=' + event.code + '====='
        );

        // 断开连接
        if (YTX_WBSS_KERNEL.websocket_handle_obj != null) {
          YTX_WBSS_KERNEL.disconnectWebScoketServer(false);
        }
      };

      // WebSocket onerror 事件
      YTX_WBSS_KERNEL.websocket_handle_obj.onerror = function (event) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          '=====YTX_WBSS_KERNEL.websocket_handle_obj.onerror errorCode=' + event.errorCode + '====='
        );
      };

      // WebSocket 结束
      YTX_WBSS_KERNEL._log(
        YTX_WBSS_KERNEL._logLev._DEBUG,
        '=====_connectWebScoketServer【End】====='
      );
    },

    disconnectWebScoketServer: function (isCloseWebSocket) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====disconnectWebScoketServer=====');
      // 断开连接
      if (YTX_WBSS_KERNEL.websocket_handle_obj != null) {
        if (isCloseWebSocket == true) {
          YTX_WBSS_KERNEL.websocket_handle_obj.onclose = function () {};
          try {
            YTX_WBSS_KERNEL.websocket_handle_obj.close();
          } catch (e) {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._WARN,
              'YTX_WBSS_KERNEL.websocket_handle_obj.close Error e=' + e
            );
          } finally {
            YTX_WBSS_KERNEL.websocket_handle_obj = null;
          }
        } else {
          YTX_WBSS_KERNEL.websocket_handle_obj = null;
        }
      }
      YTX_WBSS_KERNEL.releaseRoomResource();
      YTX_WBSS_KERNEL.websocket_url_string = '';
      YTX_WBSS_KERNEL.websocket_connectStatus =
        YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusCloned;
    },

    // 获取 Client Req Number
    getRequestIDNumber: function (msgType, onSuccess, onError, msgExtData) {
      var request_id_number = ++YTX_WBSS_KERNEL.websocket_sendMsgRequestIDSeed;

      if (msgType != null || onSuccess != null || onError != null) {
        // Need Callback Function
        var request_id_obj = {};
        if (onSuccess != null) {
          request_id_obj.onSuccess = onSuccess;
        } else {
          request_id_obj.onSuccess = function (resp) {};
        }
        if (onError != null) {
          request_id_obj.onError = onError;
        } else {
          request_id_obj.onError = function (resp) {};
        }

        // Msg Type and Data
        request_id_obj.msgType = msgType;
        request_id_obj.msgExtData = msgExtData;

        // TimeOut Proc
        var send_msg_timeout_ms = YTX_WBSS_KERNEL.websocket_sendMsgRequestIDTimeOutMS;
        switch (request_id_obj.msgType) {
          case YTX_WBSS_KERNEL._prototype.LeaveRoomReq:
            {
              send_msg_timeout_ms = send_msg_timeout_ms * 2;
            }
            break;
          case YTX_WBSS_KERNEL._prototype.DeleteRoomReq:
            {
              send_msg_timeout_ms = send_msg_timeout_ms * 2;
            }
            break;
        }
        var current_timeout_headle = window.setTimeout(function () {
          // 回调超时错误
          var request_id_obj = YTX_WBSS_KERNEL.websocket_sendMsgRequestIDMap[request_id_number];
          if (request_id_obj != null) {
            // 超时消息预处理
            if (request_id_obj.msgType != null) {
              switch (request_id_obj.msgType) {
                case YTX_WBSS_KERNEL._prototype.LeaveRoomReq:
                  {
                    if (YTX_WBSS_KERNEL.isLoginInRoomServer == true) {
                      // 退出释放房间资源
                      YTX_WBSS_KERNEL.releaseRoomResource();
                    }
                  }
                  break;
                case YTX_WBSS_KERNEL._prototype.DeleteRoomReq:
                  {
                    if (YTX_WBSS_KERNEL.isLoginInRoomServer == true) {
                      // 退出释放房间资源
                      // YTX_WBSS_KERNEL.releaseRoomResource();
                    }
                  }
                  break;
              }
            }

            // 消息超时处理
            var resp_time_out_msg = {};
            resp_time_out_msg.code = YTX_WBSS_KERNEL._errcode._RESP_TIME_OUT;
            resp_time_out_msg.msg = 'request msgType=' + request_id_obj.msgType + ' msg time out';
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._ERROR,
              'time out msgType=' +
                request_id_obj.msgType +
                ' request_id_number=' +
                request_id_number
            );
            if (onError != null) {
              onError(resp_time_out_msg);
            }

            // 删除 request_id_obj
            delete YTX_WBSS_KERNEL.websocket_sendMsgRequestIDMap[request_id_number];
          }
        }, send_msg_timeout_ms);
        request_id_obj.timeout_headle = current_timeout_headle;

        // 保存 request_id_obj
        YTX_WBSS_KERNEL.websocket_sendMsgRequestIDMap[request_id_number] = request_id_obj;
        return request_id_number;
      } else {
        return request_id_number;
      }
    },

    // 发送消息
    sendWebSocketMsg: function (send_json_string) {
      if (YTX_WBSS_KERNEL.isShowDebugWebSocketSendMessage) {
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, 'send msg : ' + send_json_string);
      }
      YTX_WBSS_KERNEL.websocket_sendByteDataTotal += send_json_string.length;
      if (YTX_WBSS_KERNEL.websocket_handle_obj)
        YTX_WBSS_KERNEL.websocket_handle_obj.send(send_json_string);
    },

    // 接收消息
    onWebSocketRecvMsg: function (recv_json_string) {
      YTX_WBSS_KERNEL.websocket_recvByteDataTotal += recv_json_string.length;
      var recv_json_obj = JSON.parse(recv_json_string);
      if (recv_json_obj != null) {
        if (YTX_WBSS_KERNEL.isShowDebugWebSocketRecvMessage) {
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, 'receive msg : ' + recv_json_string);
        }
      } else {
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'receive msg : Json Parse Error !');
        return;
      }

      if (recv_json_obj.hb) {
        YTX_WBSS_KERNEL.heartBeatCallBack(recv_json_obj['hb']);
        return;
      }

      var statusCode = recv_json_obj['statusCode'];
      var statusMsg = recv_json_obj['statusMsg'];

      var type = recv_json_obj['type'];
      var payload = recv_json_obj['payload'];
      if (type == null || payload == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          'receive msg Parse invalid' +
            (statusCode != null ? 'statusCode=' + statusCode : '') +
            ' ' +
            (statusMsg != null ? 'statusMsg=' + statusMsg : '')
        );
        return;
      }

      // 处理通知消息, 不需要保存reqID的响应事件
      switch (type) {
        case YTX_WBSS_KERNEL._prototype.DeleteRoomReq:
          {
            YTX_WBSS_KERNEL._parseDeleteRoomNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.ClearRoomReq:
          {
            YTX_WBSS_KERNEL._parseClearRoomNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.SyncRoomDataResp:
          {
            YTX_WBSS_KERNEL.resposeSyncDrawData(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.MemberJoinNotify:
          {
            YTX_WBSS_KERNEL._parseMemberJoinNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.MemberLeaveNotify:
          {
            YTX_WBSS_KERNEL._parseMemberLeaveNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.ShareDocReq:
          {
            YTX_WBSS_KERNEL._parseShareDocNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.RemoveShareDocReq:
          {
            YTX_WBSS_KERNEL._parseRemoveDocNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.GotoPageReq:
          {
            YTX_WBSS_KERNEL._parseGotoPageNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.WbssDrawReq:
          {
            YTX_WBSS_KERNEL._parseDrawNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.WbssDeleteDrawReq:
          {
            YTX_WBSS_KERNEL._parseDrawDeleteNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.DocConvertNotify:
          {
            YTX_WBSS_KERNEL._parseDocConvertNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.DrawUndoReq:
          {
            YTX_WBSS_KERNEL._parseDrawUndoNotify(payload);
            return;
          }
          break;
        case YTX_WBSS_KERNEL._prototype.KickoutNotify:
          {
            YTX_WBSS_KERNEL._parseKickOutNotify(payload);
            return;
          }
          break;
        default:
          break;
      }

      // 处理响应消息
      var request_id_number = payload['head']['reqID'];
      var request_id_obj = YTX_WBSS_KERNEL.websocket_sendMsgRequestIDMap[request_id_number];
      if (request_id_obj == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._WARN,
          'receive a unrequest response, request_id_number:' + payload['head']['reqID']
        );
        return;
      }

      // 删除超时定时器
      try {
        if (request_id_obj.timeout_headle != null) {
          window.clearTimeout(request_id_obj.timeout_headle);
          request_id_obj.timeout_headle = null;
        }
      } catch (e) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          'Cannot read property timeout of undefined'
        );
      }

      // 获取 request 信息
      var request_msgType = request_id_obj.msgType;
      var request_msgExtData = request_id_obj.msgExtData;
      var request_onSuccess = request_id_obj.onSuccess;
      var request_onError = request_id_obj.onError;

      // 删除 request_id_obj
      if (YTX_WBSS_KERNEL.websocket_sendMsgRequestIDMap != null && request_id_number != null) {
        delete YTX_WBSS_KERNEL.websocket_sendMsgRequestIDMap[request_id_number];
      }

      // 消息分发
      switch (type) {
        case YTX_WBSS_KERNEL._prototype.CreateRoomResp:
          {
            YTX_WBSS_KERNEL._parseCreateRoomResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.JoinRoomResp:
          {
            YTX_WBSS_KERNEL._parseJoinRoomResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.LeaveRoomResp:
          {
            YTX_WBSS_KERNEL._parseLeaveRoomResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.DeleteRoomResp:
          {
            YTX_WBSS_KERNEL._parseDeleteRoomResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.KickoutResp:
          {
            YTX_WBSS_KERNEL._parseKickoutResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.ClearRoomResp:
          {
            YTX_WBSS_KERNEL._parseClearRoomResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.ShareDocResp:
          {
            YTX_WBSS_KERNEL._parseShareDocResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.RemoveShareDocResp:
          {
            YTX_WBSS_KERNEL._parseRemoveShareDocResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.GotoPageResp:
          {
            YTX_WBSS_KERNEL._parseGotoPageResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.RemoveWbPageResp:
          {
            YTX_WBSS_KERNEL._parseRemoveWbPageResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.WbssDrawResp:
          {
            YTX_WBSS_KERNEL._parseWbssDrawResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.WbssDeleteDrawResp:
          {
            YTX_WBSS_KERNEL._parseWbssDeleteDrawResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        case YTX_WBSS_KERNEL._prototype.DrawUndoResp:
          {
            YTX_WBSS_KERNEL._parseDrawUndoResp(
              payload,
              request_id_number,
              request_msgType,
              request_msgExtData,
              request_onSuccess,
              request_onError
            );
          }
          break;
        default:
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'response error: type is undefined');
          break;
      }
    },
    //发送心跳
    heartBeat: function () {
      if (YTX_WBSS_KERNEL.reconnectNum === 0) {
        var id = setTimeout(function () {
          YTX_WBSS_KERNEL.heartBeatCallBackErr();
        }, YTX_WBSS_KERNEL.heartBeatTimeOut * 1000);
        var str = JSON.stringify({
          hb: id,
        });
        YTX_WBSS_KERNEL.sendWebSocketMsg(str);
      }
    },
    //心跳成功会调
    heartBeatCallBack: function (obj) {
      if (!!obj) {
        clearTimeout(obj);
      }
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, 'wbss heartBeat succ');
    },
    //心跳失败回调
    heartBeatCallBackErr: function () {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, 'wbss heartBeat err');
      YTX_WBSS_KERNEL.websocket_connectStatus =
        YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusReconnecting;
      if (YTX_WBSS_KERNEL.intervalId) clearInterval(YTX_WBSS_KERNEL.intervalId);
      if (YTX_WBSS_KERNEL.reconnectNum === 0) {
        YTX_WBSS_KERNEL.reconnect(function () {});
      }
    },
    reconnect: function (callback) {
      //重连
      return;
      // YTX_WBSS_KERNEL.releaseRoomResource();
      YTX_WBSS_KERNEL.websocket_connectStatus =
        YTX_WBSS_KERNEL.websocket_enumConnectStatus.websocket_enumStatusReconnecting;
      YTX_WBSS_KERNEL.reconnectInterval && clearInterval(YTX_WBSS_KERNEL.reconnectInterval);
      YTX_WBSS_KERNEL.reconnectNum = 0;
      YTX_WBSS_KERNEL.reconnectFn(callback);
      YTX_WBSS_KERNEL.reconnectInterval = setInterval(function () {
        YTX_WBSS_KERNEL.reconnectFn(callback);
      }, YTX_WBSS_KERNEL.reconnectIntervalTime * 1000);
    },
    reconnectFn: function (callback) {
      YTX_WBSS_KERNEL.reconnectNum++;
      console.log('YTX_WBSS_KERNEL.reconnectNum-------------', YTX_WBSS_KERNEL.reconnectNum);
      if (YTX_WBSS_KERNEL.reconnectNum > YTX_WBSS_KERNEL.maxReconnectNum) {
        YTX_WBSS_KERNEL.reconnectInterval && clearInterval(YTX_WBSS_KERNEL.reconnectInterval);
        if (YTX_WBSS_KERNEL.isOffLine) {
          YTX_WBSS_KERNEL.connectStateChange(1, '网络掉线');
        } else {
          YTX_WBSS_KERNEL.reconnectNum = 0;
          YTX_WBSS_KERNEL.reconnectInterval && clearInterval(YTX_WBSS_KERNEL.reconnectInterval);
          YTX_WBSS_KERNEL.connectStateChange(5, '超出最大重连次数，请重新登录', '550004');
        }
        return;
      }
      YTX_WBSS_KERNEL.connectStateChange(2, 'reconnect to server');
      YTX_WBSS_KERNEL.reconnectToServer(callback);
    },
    //连接ws，并加入白板房间
    reconnectToServer: function (callback) {
      YTX_WBSS_KERNEL.connectWebScoketServer(
        function () {
          if (YTX_WBSS_KERNEL.currentLoginInRoomID && YTX_WBSS_KERNEL.currentLoginInRoomID != -1) {
            var joinRoomBuilder = new YTX_WBSS_API.JoinRoomBuilder(
              YTX_WBSS_KERNEL.currentLoginInRoomID,
              '123456',
              0
            );
            var sendReqJoinRoomJsonStr = YTX_WBSS_KERNEL._protobuf._buildJoinRoom(
              joinRoomBuilder,
              function () {
                YTX_WBSS_KERNEL.connectStateChange(3, 'reconnect to server suc!');
                callback();
              },
              function () {}
            );
            if (sendReqJoinRoomJsonStr != null && sendReqJoinRoomJsonStr.length > 0) {
              YTX_WBSS_KERNEL.sendWebSocketMsg(sendReqJoinRoomJsonStr);
            }
          }
        },
        function () {}
      );
    },

    // ============  wbss kernel room data info =================

    isLoginInRoomServer: false, ///< 是否登陆房间
    currentLoginInRoomID: -1, ///< 当前登陆的房间ID，大于0
    currentLoginInDocID: -1, ///< 当前登陆的文档ID，0是白板，其他为上传文档
    currentLoginInPageIndex: -1, ///< 当前登陆的页面Index，从1开始
    allRoomInfoMap: {}, ///< 保存当前房间信息,元素类型 RoomInfo
    updateCurrentRoomId_DocId_PageIndex: function (room_id, doc_id, page_index) {
      if (YTX_WBSS_KERNEL.isShowDebugDocPageManager) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          'updateCurrentRoomId_DocId_PageIndex(room_id=' +
            room_id +
            ' doc_id=' +
            doc_id +
            ' page_index=' +
            page_index +
            ') oldinfo=(' +
            YTX_WBSS_KERNEL.currentLoginInRoomID +
            ',' +
            YTX_WBSS_KERNEL.currentLoginInDocID +
            ',' +
            YTX_WBSS_KERNEL.currentLoginInPageIndex +
            ')'
        );
      }

      YTX_WBSS_KERNEL.currentLoginInRoomID = room_id;
      YTX_WBSS_KERNEL.currentLoginInDocID = doc_id;
      YTX_WBSS_KERNEL.currentLoginInPageIndex = page_index;
    },
    getCurRoomId: function () {
      ///< 获取当前房间ID
      return YTX_WBSS_KERNEL.currentLoginInRoomID;
    },
    getCurDocId: function () {
      ///< 获取当前文档ID
      return YTX_WBSS_KERNEL.currentLoginInDocID;
    },
    getCurPageIndex: function () {
      ///< 获取当前页面Index
      return YTX_WBSS_KERNEL.currentLoginInPageIndex;
    },
    getRoomInfo: function (room_id, isShowLog) {
      ///< 获取房间信息
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[room_id];
      if (currentRoomInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getRoomInfo 找不到房间(' + room_id + ')信息'
          );
        }
        return null;
      }

      return currentRoomInfo;
    },
    getDocInfo: function (room_id, doc_id, isShowLog) {
      ///< 获取文档信息
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[room_id];
      if (currentRoomInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getDocInfo 找不到房间(' + room_id + ')信息'
          );
        }
        return null;
      }

      var currentDocInfo = currentRoomInfo.getDocInfo(doc_id);
      if (currentDocInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getDocInfo 找不到文档(' + doc_id + ')信息'
          );
        }
        return null;
      }

      return currentDocInfo;
    },
    getPageInfo: function (room_id, doc_id, page_index, isShowLog) {
      ///< 获取页信息
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[room_id];
      if (currentRoomInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getPageInfo 找不到房间(' + room_id + ')信息'
          );
        }
        return null;
      }

      var currentDocInfo = currentRoomInfo.getDocInfo(doc_id);
      if (currentDocInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getPageInfo 找不到文档(' + doc_id + ')信息'
          );
        }
        return null;
      }

      var currentPageInfo = currentDocInfo.getPageInfo(page_index);
      if (currentPageInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getPageInfo 找不到页(' + page_index + ')信息'
          );
        }
        return null;
      }

      return currentPageInfo;
    },
    getCurrentRoomInfo: function (isShowLog) {
      var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id];
      if (currentRoomInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getCurrentRoomInfo 找不到房间(' + current_room_id + ')信息'
          );
        }
        return null;
      }

      return currentRoomInfo;
    },
    getCurrentDocInfo: function (isShowLog) {
      var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id];
      if (currentRoomInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getCurrentDocInfo 找不到房间(' + current_room_id + ')信息'
          );
        }
        return null;
      }

      var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
      var currentDocInfo = currentRoomInfo.getDocInfo(current_doc_id);
      if (currentDocInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getCurrentDocInfo 找不到文档(' + current_doc_id + ')信息'
          );
        }
        return null;
      }

      return currentDocInfo;
    },
    getCurrentPageInfo: function (isShowLog) {
      var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id];
      if (currentRoomInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getCurrentPageInfo 找不到房间(' + current_room_id + ')信息'
          );
        }
        return null;
      }

      var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
      var currentDocInfo = currentRoomInfo.getDocInfo(current_doc_id);
      if (currentDocInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getCurrentPageInfo 找不到文档(' + current_doc_id + ')信息'
          );
        }
        return null;
      }

      var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();
      var currentPageInfo = currentDocInfo.getPageInfo(current_page_index);
      if (currentPageInfo == null) {
        if (isShowLog != null && isShowLog == true) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._INFO,
            'getCurrentPageInfo 找不到页(' + current_page_index + ')信息'
          );
        }
        return null;
      }

      return currentPageInfo;
    },
    isCurrentRoomId_DocId_PageIndex: function (room_id, doc_id, page_index) {
      ///< 是否当前RoomID、DocID、PageIndex
      if (YTX_WBSS_KERNEL.isLoginInRoomServer && YTX_WBSS_KERNEL.currentLoginInRoomID > 0) {
        if (room_id != null && doc_id != null && page_index != null) {
          if (
            room_id == YTX_WBSS_KERNEL.currentLoginInRoomID &&
            doc_id == YTX_WBSS_KERNEL.currentLoginInDocID &&
            page_index == YTX_WBSS_KERNEL.currentLoginInPageIndex
          ) {
            var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[room_id];
            if (currentRoomInfo != null) {
              var currentDocInfo = currentRoomInfo.getDocInfo(doc_id);
              if (currentDocInfo != null) {
                var currentPageInfo = currentDocInfo.getPageInfo(page_index);
                if (currentPageInfo != null) {
                  return true;
                } //if(currentPageInfo != null)
              } //if(currentDocInfo != null)
            } //if(currentRoomInfo != null)
          }
        } //if(room_id != null && doc_id != null && page_index != null)
      }
      return false;
    },
    setImageInfo: function (room_id, doc_id, page_index, _image_width, _image_height) {
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[room_id];
      if (currentRoomInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'setImageInfo 找不到房间(' + room_id + ')信息'
        );
        return false;
      }

      var currentDocInfo = currentRoomInfo.docInfoMap[doc_id];
      if (currentDocInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'setImageInfo 找不到文档(' + current_doc_id + ')信息'
        );
        return false;
      }

      var currentPageInfo = currentDocInfo.pageInfoArray[page_index - 1];
      if (currentPageInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'setImageInfo 找不到页(' + current_page_index + ')信息'
        );
        return false;
      }

      YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
        page_index - 1
      ].setImageInfo(_image_width, _image_height);
      return true;
    },
    setDrawSpaceInfo: function (
      room_id,
      doc_id,
      page_index,
      _canvas_width,
      _canvas_height,
      _draw_space_ratio,
      _draw_space_ifSacle
    ) {
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[room_id];
      if (currentRoomInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'setDrawSpaceInfo 找不到房间(' + room_id + ')信息'
        );
        return false;
      }

      var currentDocInfo = currentRoomInfo.docInfoMap[doc_id];
      if (currentDocInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'setDrawSpaceInfo 找不到文档(' + current_doc_id + ')信息'
        );
        return false;
      }

      var currentPageInfo = currentDocInfo.pageInfoArray[page_index - 1];
      if (currentPageInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'setDrawSpaceInfo 找不到页(' + current_page_index + ')信息'
        );
        return false;
      }

      YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
        page_index - 1
      ].setDrawSpaceInfo(_canvas_width, _canvas_height, _draw_space_ratio, _draw_space_ifSacle);
      return true;
    },
    addServerDrawDataObject: function (roomId, docId, pageId, draw_data_object) {
      var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[roomId];
      if (!currentRoomInfo) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'addServerDrawDataObject 找不到房间(' + roomId + ')信息'
        );
        return false;
      }
      var currentDocInfo = currentRoomInfo.docInfoMap[docId];
      if (currentDocInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'addServerDrawDataObject 找不到文档(' + docId + ')信息'
        );
        return false;
      }
      var currentPageInfo = currentDocInfo.pageInfoArray[pageId - 1];
      if (currentPageInfo == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'addServerDrawDataObject 找不到页(' + pageId + ')信息'
        );
        return false;
      }

      // Save Timestamp
      var currentTimestamp = draw_data_object['timestamp'];
      var lastTimestamp = 0;
      if (currentTimestamp != null) {
        lastTimestamp =
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[
            docId
          ].getLocalSyncDocDrawDataTimeStamp();
        if (currentTimestamp > lastTimestamp) {
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[docId].setLocalSyncDocDrawDataTimeStamp(
            currentTimestamp
          );
        }

        lastTimestamp =
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[
            docId
          ].getServerSyncDocDrawDataTimeStamp();
        if (currentTimestamp > lastTimestamp) {
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[
            docId
          ].setServerSyncDocDrawDataTimeStamp(currentTimestamp);
        }

        lastTimestamp =
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[docId].pageInfoArray[
            pageId - 1
          ].getLocalSyncPageDrawDataTimeStamp();
        if (currentTimestamp > lastTimestamp) {
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[docId].pageInfoArray[
            pageId - 1
          ].setLocalSyncPageDrawDataTimeStamp(currentTimestamp);
        }

        lastTimestamp =
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[docId].pageInfoArray[
            pageId - 1
          ].getServerSyncPageDrawDataTimeStamp();
        if (currentTimestamp > lastTimestamp) {
          YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[docId].pageInfoArray[
            pageId - 1
          ].setServerSyncPageDrawDataTimeStamp(currentTimestamp);
        }
      }

      // Get Coordinate Array
      var coordinate_array = [];
      var json_coordinate_array = draw_data_object['coordinates'];
      if (json_coordinate_array != null) {
        for (var i = 0; i < json_coordinate_array.length; i += 2) {
          coordinate_array.push({ x: json_coordinate_array[i], y: json_coordinate_array[i + 1] });
        }
      }

      // Get Text Info
      var textObj = null;
      if (draw_data_object['fontText'] != null) {
        textObj = new Object();
        textObj['fontText'] = draw_data_object['fontText'];
        textObj['fontType'] = draw_data_object['fontType'];
        textObj['fontSize'] = draw_data_object['lineSize'];
      }

      // Save Draw Data Element Node
      var drawDataElement = new YTX_WBSS_KERNEL.DrawDataElement(
        draw_data_object['drawID'],
        draw_data_object['shapeType'],
        draw_data_object['lineSize'],
        draw_data_object['color'],
        draw_data_object['isFill'],
        coordinate_array,
        draw_data_object['drawAreaWidth'],
        draw_data_object['drawAreaHeight'],
        draw_data_object['isFinal'],
        draw_data_object['isUndo'],
        textObj,
        draw_data_object['timestamp']
      );

      // Sync Draw Data
      YTX_WBSS_KERNEL.allRoomInfoMap[roomId].docInfoMap[docId].pageInfoArray[
        pageId - 1
      ].addDrawDataElement(drawDataElement);

      //return result
      return true;
    },
    RoomInfo: function (roomId) {
      this.roomId = roomId;
      this.docInfoMap = {};

      // 添加文档信息
      this.addDocInfo = function (curDocID, curdocInfo) {
        this.docInfoMap[curDocID] = curdocInfo;
      };

      // 删除文档信息
      this.deleteDocInfo = function (curDocID) {
        delete this.docInfoMap[curDocID];
      };

      // 获取文档信息
      this.getDocInfo = function (curDocID) {
        return this.docInfoMap[curDocID];
      };

      // 获取文档个数
      this.getDocIDArray = function () {
        var key_array = window.Object.keys(this.docInfoMap);
        return key_array;
      };
    },
    DocInfo: function (curDocID, curDocName, curDocPageTotalNum, curDocUrl, curServerTimeStamp) {
      this.docId = curDocID;
      this.docName = curDocName;
      this.pageSize =
        curDocPageTotalNum != null ? curDocPageTotalNum : YTX_WBSS_KERNEL.DEFAULT_DOC_PAGE_NUMBER;
      this.docUrl = curDocUrl;
      this.last_local_sync_draw_data_timestamp_ms = 0; ///< 已经画完的数据实际
      this.last_server_sync_draw_data_timestamp_ms = curServerTimeStamp; ///< 服务端最新的时间戳
      this.local_page_index = 1; ///< 本地保存的pageIndex数据，文档切换的时候请求的缺失索引
      this.pageInfoArray = [];

      //Init pageInfoArray
      for (var i = 1; i <= this.pageSize; i++) {
        var page_url = '';
        if (this.docUrl.length > 0) {
          page_url = this.docUrl + '_' + i.toString() + '.png'; ///< 拼接文档Page文件的URL
        } else {
          page_url = i.toString(); ///< 拼接白板Page文件的URL
        }
        var page_info = new YTX_WBSS_KERNEL.PageInfo(i, page_url);
        this.pageInfoArray.push(page_info);
      }

      this.getDocId = function () {
        return this.docId;
      };
      this.setLocalSyncDocDrawDataTimeStamp = function (cur_timestamp) {
        this.last_local_sync_draw_data_timestamp_ms = cur_timestamp;
      };
      this.getLocalSyncDocDrawDataTimeStamp = function () {
        return this.last_local_sync_draw_data_timestamp_ms;
      };
      this.setServerSyncDocDrawDataTimeStamp = function (cur_timestamp) {
        this.last_server_sync_draw_data_timestamp_ms = cur_timestamp;
      };
      this.getServerSyncDocDrawDataTimeStamp = function () {
        return this.last_server_sync_draw_data_timestamp_ms;
      };
      this.getPageInfoArray = function () {
        return this.pageInfoArray;
      };
      this.getPageSize = function () {
        return this.pageSize;
      };
      this.getPageFileName = function (page_index) {
        ///< 默认从1开始
        var current_page_filename = '';
        if (page_index >= 1 && page_index <= this.pageSize) {
          var current_page_info = this.pageInfoArray[page_index - 1];
          current_page_filename = current_page_info.pageinfo_filename;
        }
        return current_page_filename;
      };
      this.getPageInfo = function (page_index) {
        if (page_index > 0 && page_index <= this.pageSize) {
          return this.pageInfoArray[page_index - 1];
        }
      };
    },
    PageInfo: function (pageinfo_index, pageinfo_filename) {
      this.pageinfo_index = pageinfo_index;
      this.pageinfo_filename = pageinfo_filename;

      this.last_canvas_width = 0; ///< 最后保存的canvas信息
      this.last_canvas_height = 0; ///< 最后保存的canvas信息
      this.last_draw_space_ratio = 0.0; ///< 最后保存的canvas中的显示比例
      this.last_draw_space_ifSacle = 0.0; ///< 最后保存的canvas缩放信息，1.0正常比例
      this.last_draw_space_fromX = 0; ///< 最后保存的canvas可以绘图的区域
      this.last_draw_space_fromY = 0; ///< 最后保存的canvas可以绘图的区域
      this.last_draw_space_width = 0; ///< 最后保存的canvas可以绘图的区域
      this.last_draw_space_height = 0; ///< 最后保存的canvas可以绘图的区域

      this.last_image_width = 0; ///< image的图片大小，非白板
      this.last_image_height = 0; ///< image的图片大小，非白板

      this.last_local_sync_draw_data_timestamp_ms = 0; ///< 已经画完的数据实际
      this.last_server_sync_draw_data_timestamp_ms = 0; ///< 服务端最新的时间戳

      this.drawIDSeedNumber = 1;
      this.drawDataElementArray = []; ///< 保存绘图数据
      this.getPageFileName = function () {
        return this.pageinfo_filename;
      };
      this.getPageInfoDrawSpaceRatio = function () {
        return this.last_draw_space_ratio;
      };
      this.setLocalSyncPageDrawDataTimeStamp = function (cur_timestamp) {
        this.last_local_sync_draw_data_timestamp_ms = cur_timestamp;
      };
      this.getLocalSyncPageDrawDataTimeStamp = function () {
        return this.last_local_sync_draw_data_timestamp_ms;
      };
      this.setServerSyncPageDrawDataTimeStamp = function (cur_timestamp) {
        this.last_server_sync_draw_data_timestamp_ms = cur_timestamp;
      };
      this.getServerSyncPageDrawDataTimeStamp = function () {
        return this.last_server_sync_draw_data_timestamp_ms;
      };
      this.addDrawDataElement = function (drawDataElement) {
        if (drawDataElement != null) {
          var isOnlyUpdate = false;
          var currentDrawId = drawDataElement._drawID;
          for (var i = 0; i < this.drawDataElementArray.length; i++) {
            if (currentDrawId == this.drawDataElementArray[i]._drawID) {
              //已有的DrawId添加信息的坐标信息
              this.drawDataElementArray[i].appendDrawDataElement(
                drawDataElement,
                this.drawDataElementArray,
                i
              );
              isOnlyUpdate = true;
              break;
            }
          }
          if (
            isOnlyUpdate == false &&
            !(
              drawDataElement._isFinal &&
              drawDataElement._shapeType == YTX_WBSS_API._shapeType.LASERPEN
            )
          ) {
            this.drawDataElementArray.push(drawDataElement);
          }
        }
      };
      this.clearAllDrawDataElement = function () {
        this.drawDataElementArray = [];
        return true;
      };
      this.clearDrawDataElement = function (draw_id) {
        if (draw_id != null) {
          for (var i = 0; i < this.drawDataElementArray.length; i++) {
            if (draw_id == this.drawDataElementArray[i]._drawID) {
              this.drawDataElementArray.splice(i, 1);
              return true;
            }
          }
        }
        return false;
      };
      this.findDrawDataElement = function (mouse_pos_x, mouse_pos_y) {
        // 保存缓存坐标
        var screen_coordinate_array = [];
        screen_coordinate_array.push({ x: mouse_pos_x, y: mouse_pos_y });
        var world_coordinate_array = [];
        if (screen_coordinate_array.length > 0) {
          YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
            world_coordinate_array,
            this,
            screen_coordinate_array
          );
        }
        if (world_coordinate_array.length > 0) {
          var pix_line_size = YTX_WBSS_KERNEL.drawContext.lineSize;
          var screen_coordinate_offset_array = [];
          screen_coordinate_offset_array.push({
            x: this.last_draw_space_fromX + pix_line_size,
            y: this.last_draw_space_fromY + pix_line_size,
          });
          var world_coordinate_offset_array = [];
          YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
            world_coordinate_offset_array,
            this,
            screen_coordinate_offset_array
          );
          if (world_coordinate_offset_array.length > 0) {
            world_coordinate_offset_array[0].x = 1.0 + world_coordinate_offset_array[0].x;
            world_coordinate_offset_array[0].y = 1.0 - world_coordinate_offset_array[0].y;

            // 获取 Limit Rect 区域
            var limit_left_x = world_coordinate_array[0].x - world_coordinate_offset_array[0].x;
            var limit_right_x = world_coordinate_array[0].x + world_coordinate_offset_array[0].x;
            var limit_top_y = world_coordinate_array[0].y + world_coordinate_offset_array[0].y;
            var limit_bottom_y = world_coordinate_array[0].y - world_coordinate_offset_array[0].y;
            if (limit_left_x < -1.0) {
              limit_left_x = -1.0;
            }
            if (limit_right_x > 1.0) {
              limit_right_x = 1.0;
            }
            if (limit_top_y > 1.0) {
              limit_top_y = 1.0;
            }
            if (limit_bottom_y < -1.0) {
              limit_bottom_y = -1.0;
            }

            // 区域校验
            if (limit_left_x < limit_right_x && limit_bottom_y < limit_top_y) {
              // 遍历元素
              for (var i = this.drawDataElementArray.length - 1; i >= 0; i--) {
                ///< 从尾部开始遍历
                var draw_info = this.drawDataElementArray[i];
                if (
                  draw_info != null &&
                  draw_info._coordinate_array != null &&
                  draw_info._isValid == true &&
                  draw_info._isUndo == false
                ) {
                  if (draw_info._coordinate_array.length > 0) {
                    if (draw_info._shapeType == YTX_WBSS_API._shapeType.FREELINE) {
                      ///< 自由线
                      // 遍历坐标点
                      for (var j = 0; j < draw_info._coordinate_array.length - 1; j++) {
                        var start_coor = draw_info._coordinate_array[j];
                        var end_coor = draw_info._coordinate_array[j + 1];
                        if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            start_coor.x,
                            start_coor.y,
                            end_coor.x,
                            end_coor.y,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        }
                      }
                    } else if (draw_info._shapeType == YTX_WBSS_API._shapeType.LINE) {
                      ///< 直线
                      if (draw_info._coordinate_array.length == 2) {
                        if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            draw_info._coordinate_array[0].x,
                            draw_info._coordinate_array[0].y,
                            draw_info._coordinate_array[1].x,
                            draw_info._coordinate_array[1].y,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        }
                      }
                    } else if (draw_info._shapeType == YTX_WBSS_API._shapeType.RECT) {
                      ///< 矩形
                      if (draw_info._coordinate_array.length == 2) {
                        var x1 = draw_info._coordinate_array[0].x;
                        var y1 = draw_info._coordinate_array[0].y;
                        var x2 = draw_info._coordinate_array[1].x;
                        var y2 = draw_info._coordinate_array[1].y;
                        if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            x1,
                            y1,
                            x1,
                            y2,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        } else if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            x1,
                            y1,
                            x2,
                            y1,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        } else if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            x2,
                            y1,
                            x2,
                            y2,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        } else if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            x1,
                            y2,
                            x2,
                            y2,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        }
                      }
                    } else if (draw_info._shapeType == YTX_WBSS_API._shapeType.TRIANGLE) {
                      ///< 三角形
                      if (draw_info._coordinate_array.length == 3) {
                        var x1 = draw_info._coordinate_array[0].x;
                        var y1 = draw_info._coordinate_array[0].y;
                        var x2 = draw_info._coordinate_array[1].x;
                        var y2 = draw_info._coordinate_array[1].y;
                        var x3 = 2 * x1 - x2;
                        var y3 = y2;
                        if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            x1,
                            y1,
                            x2,
                            y2,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        } else if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            x2,
                            y2,
                            x3,
                            y3,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        } else if (
                          YTX_WBSS_KERNEL.MathLib.intersectLineRect(
                            x3,
                            y3,
                            x1,
                            y1,
                            limit_left_x,
                            limit_right_x,
                            limit_top_y,
                            limit_bottom_y
                          ) == true
                        ) {
                          return draw_info._drawID;
                        }
                      }
                    } else if (draw_info._shapeType == YTX_WBSS_API._shapeType.CIRCLE) {
                      ///< 圆形
                      if (draw_info._coordinate_array.length == 2) {
                        var circle_center_x =
                          (draw_info._coordinate_array[0].x + draw_info._coordinate_array[1].x) / 2;
                        var circle_center_y =
                          (draw_info._coordinate_array[0].y + draw_info._coordinate_array[1].y) / 2;
                        var circle_radius = YTX_WBSS_KERNEL.MathLib.twoPointsDistance(
                          { x: circle_center_x, y: circle_center_y },
                          draw_info._coordinate_array[0]
                        );
                        var rect_left_top_pos = { x: limit_left_x, y: limit_top_y };
                        var rect_right_top_pos = { x: limit_right_x, y: limit_top_y };
                        var rect_left_bottom_pos = { x: limit_left_x, y: limit_bottom_y };
                        var rect_right_bottom_pos = { x: limit_right_x, y: limit_bottom_y };
                        if (
                          YTX_WBSS_KERNEL.MathLib.intersectRectCircle(
                            rect_left_top_pos,
                            rect_right_top_pos,
                            rect_left_bottom_pos,
                            rect_right_bottom_pos,
                            { x: circle_center_x, y: circle_center_y },
                            circle_radius
                          ) == true
                        ) {
                          return draw_info._drawID;
                        }
                      }
                    } else {
                      // 遍历坐标点
                      for (var j = 0; j < draw_info._coordinate_array.length; j++) {
                        var coor = draw_info._coordinate_array[j];
                        if (coor != null && coor.x != null && coor.y != null) {
                          if (
                            coor.x >= limit_left_x &&
                            coor.x <= limit_right_x &&
                            coor.y >= limit_bottom_y &&
                            coor.y <= limit_top_y
                          ) {
                            return draw_info._drawID;
                          }
                        }
                      }
                    }
                  } //if(draw_info._coordinate_array.length > 0)
                } //if(draw_info != null && draw_info._coordinate_array != null && draw_info._isValid == true && draw_info._isUndo == false)
              } //for (var i = 0; i  < this.drawDataElementArray.length; i++)
            } //if(limit_left_x < limit_right_x && limit_bottom_y < limit_top_y)
            else {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._WARN,
                'findDrawDataElement limit rect space failed left_x=' +
                  limit_left_x +
                  ' right_x=' +
                  limit_right_x +
                  ' top_y=' +
                  limit_top_y +
                  ' bottom_y=' +
                  limit_bottom_y
              );
            }
          } //if(world_coordinate_offset_array.length > 0)
        } //if(coordinate_array .length > 0)

        return '';
      };
      this.setDrawUndoStatus = function (drawId, type) {
        ///< type 【0-false is 撤销】 【1-true is 恢复】
        for (var i = 0; i < this.drawDataElementArray.length; i++) {
          if (drawId == this.drawDataElementArray[i]._drawID) {
            if (type) {
              this.drawDataElementArray[i]._isUndo = false; ///< 恢复显示出来
              this.drawDataElementArray[i]._isValid = true; ///< 同步端上逻辑，显示出来
            } else {
              this.drawDataElementArray[i]._isUndo = true; ///< 撤销不再显示出来
              this.drawDataElementArray[i]._isValid = false; ///< 同步端上逻辑，不显示出来
            }
            return true;
          }
        }
        return false;
      };
      this.setImageInfo = function (_image_width, _image_height) {
        this.last_image_width = _image_width;
        this.last_image_height = _image_height;
      };
      this.setDrawSpaceInfo = function (
        _canvas_width,
        _canvas_height,
        _draw_space_ratio,
        _draw_space_ifSacle
      ) {
        if (
          this.last_canvas_width != _canvas_width ||
          this.last_canvas_height != _canvas_height ||
          this.last_draw_space_ratio != _draw_space_ratio ||
          this.last_draw_space_ifSacle != _draw_space_ifSacle
        ) {
          // Save Data
          this.last_canvas_width = _canvas_width;
          this.last_canvas_height = _canvas_height;
          this.last_draw_space_ratio = _draw_space_ratio;
          this.last_draw_space_ifSacle = _draw_space_ifSacle;

          // if Image Page
          if (this.last_image_width > 0 && this.last_image_height > 0) {
            var img_draw_space_ratio = (1.0 * this.last_image_width) / this.last_image_height;
            if (img_draw_space_ratio != this.last_draw_space_ratio) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._WARN,
                'setDrawSpaceInfo Force img_draw_space_ratio=' +
                  img_draw_space_ratio +
                  ' to last_draw_space_ratio=' +
                  this.last_draw_space_ratio
              );
              this.last_draw_space_ratio = img_draw_space_ratio;
            }
          }

          // Sync DrawSpace
          var current_fromX = 0;
          var current_fromY = 0;
          var current_draw_space_width = 0;
          var current_draw_space_height = 0;
          if (this.last_draw_space_ratio <= 0) {
            // 全屏模式
            current_fromX = current_fromY = 0;
            current_draw_space_width = this.last_canvas_width;
            current_draw_space_height = this.last_canvas_height;
          } else {
            // 比例模式
            var canvas_ratio = (1.0 * this.last_canvas_width) / this.last_canvas_height;
            if (canvas_ratio > this.last_draw_space_ratio) {
              current_draw_space_height = this.last_canvas_height;
              current_draw_space_width = Math.round(
                this.last_draw_space_ratio * current_draw_space_height
              );
              current_fromX = Math.round((this.last_canvas_width - current_draw_space_width) * 0.5);
              current_fromY = 0;
            } else {
              current_draw_space_width = this.last_canvas_width;
              current_draw_space_height = Math.round(
                current_draw_space_width / this.last_draw_space_ratio
              );
              current_fromX = 0;
              current_fromY = Math.round(
                (this.last_canvas_height - current_draw_space_height) * 0.5
              );
            }
          }
          this.updateDrawSpaceRect(
            current_fromX,
            current_fromY,
            current_draw_space_width,
            current_draw_space_height
          );
        }
      };
      this.updateDrawSpaceRect = function (_fromX, _fromY, _draw_space_width, _draw_space_height) {
        this.last_draw_space_fromX = _fromX;
        this.last_draw_space_fromY = _fromY;
        this.last_draw_space_width = _draw_space_width;
        this.last_draw_space_height = _draw_space_height;
      };
    },

    DrawDataElement: function (
      drawID,
      shapeType,
      lineSize,
      color,
      isFill,
      coordinate_array,
      drawAreaWidth,
      drawAreaHeight,
      isFinal,
      isUndo,
      textObj,
      timestamp
    ) {
      this._drawID = drawID;
      this._shapeType = shapeType; ///< 形状
      this._lineSize = lineSize;
      (this._lineStyle = 1), ///< 1 实线 2 虚线 3 终结标志
        (this._element_color_num = color != null ? color : 255); ///< 颜色
      this._isFill = isFill != null ? isFill : false; ///< 是否填充
      this._coordinate_array = coordinate_array;
      this._isFinal = isFinal != null ? isFinal : false; ///< 是否为最终划线数据
      this._drawAreaWidth = drawAreaWidth != null ? drawAreaWidth : 0;
      this._drawAreaHeight = drawAreaHeight != null ? drawAreaHeight : 0;
      this._textObj = textObj != null ? textObj : null;
      this._timestamp = timestamp;
      this._isValid = true; ///< 是否为有效显示数据, 激光笔
      this._isUndo = isUndo != null ? isUndo : false; ///< 是否为撤销数据

      this.appendDrawDataElement = function (
        drawDataElement,
        parentDrawDataElementArray,
        parentDrawDataElementIndex
      ) {
        if (drawDataElement != null) {
          if (
            this._drawID == drawDataElement._drawID &&
            this._shapeType == drawDataElement._shapeType
          ) {
            if (this._isFinal == true) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._WARN,
                'appendDrawDataElement Failed drawId=' + this._drawID + ' is Final Statue!'
              );
            } else {
              // 更新坐标信息
              if (
                drawDataElement._coordinate_array != null &&
                drawDataElement._coordinate_array.length > 0
              ) {
                switch (this._shapeType) {
                  case YTX_WBSS_API._shapeType.FREELINE:
                    {
                      // 添加坐标
                      for (var i = 0; i < drawDataElement._coordinate_array.length; i++) {
                        this._coordinate_array.push({
                          x: drawDataElement._coordinate_array[i].x,
                          y: drawDataElement._coordinate_array[i].y,
                        });
                      }
                    }
                    break;
                  case YTX_WBSS_API._shapeType.LINE:
                    {
                      // 更新坐标
                      if (
                        this._coordinate_array.length >= 2 &&
                        drawDataElement._coordinate_array.length == 2
                      ) {
                        var this_end_pos_index = this._coordinate_array.length - 1;
                        if (
                          this._coordinate_array[this_end_pos_index].x ==
                            drawDataElement._coordinate_array[0].x &&
                          this._coordinate_array[this_end_pos_index].y ==
                            drawDataElement._coordinate_array[0].y
                        ) {
                          // 加入数据的起始坐标等于当前数据的最后坐标，为连续线段模式，添加坐标
                          for (var i = 1; i < drawDataElement._coordinate_array.length; i++) {
                            ///< 注意index需要从1开始
                            this._coordinate_array.push({
                              x: drawDataElement._coordinate_array[i].x,
                              y: drawDataElement._coordinate_array[i].y,
                            });
                          }
                        } else if (
                          this._coordinate_array.length == 2 &&
                          this._coordinate_array[0].x == drawDataElement._coordinate_array[0].x &&
                          this._coordinate_array[0].y == drawDataElement._coordinate_array[0].y
                        ) {
                          // 如果其实坐标相同，为替换更新模式
                          this._coordinate_array = drawDataElement._coordinate_array;
                        } else {
                          YTX_WBSS_KERNEL._log(
                            YTX_WBSS_KERNEL._logLev._WARN,
                            'appendDrawDataElement straight line Failed Unknow CoorsInfo drawId=' +
                              this._drawID +
                              ' is Final Statue!'
                          );
                        }
                      } //if(this._coordinate_array.length >= 2 && drawDataElement._coordinate_array.length == 2)
                    }
                    break;
                  case YTX_WBSS_API._shapeType.RECT:
                    {
                      // 更新坐标
                      if (drawDataElement._coordinate_array.length >= 2) {
                        this._coordinate_array = drawDataElement._coordinate_array;
                      }
                    }
                    break;
                  case YTX_WBSS_API._shapeType.TRIANGLE:
                    {
                      // 更新坐标
                      if (drawDataElement._coordinate_array.length >= 3) {
                        this._coordinate_array = drawDataElement._coordinate_array;
                      }
                    }
                    break;
                  case YTX_WBSS_API._shapeType.CIRCLE:
                    {
                      // 更新坐标
                      if (drawDataElement._coordinate_array.length >= 2) {
                        this._coordinate_array = drawDataElement._coordinate_array;
                      }
                    }
                    break;
                  case YTX_WBSS_API._shapeType.ELLIPSE:
                    {
                      // 更新坐标
                      if (drawDataElement._coordinate_array.length >= 2) {
                        this._coordinate_array = drawDataElement._coordinate_array;
                      }
                    }
                    break;
                  case YTX_WBSS_API._shapeType.LASERPEN:
                    {
                      // 更新坐标
                      if (drawDataElement._coordinate_array.length >= 1) {
                        this._coordinate_array = drawDataElement._coordinate_array;
                      }
                    }
                    break;
                }
              }

              // 保存最后时间戳
              if (drawDataElement._timestamp > this._timestamp) {
                this._timestamp = drawDataElement._timestamp;
              }

              // 保存完成状态
              if (drawDataElement._isFinal) {
                this._isFinal = true;
                if (this._shapeType == YTX_WBSS_API._shapeType.LASERPEN) {
                  if (parentDrawDataElementArray != null && parentDrawDataElementIndex != null) {
                    //删掉此元素
                    parentDrawDataElementArray[parentDrawDataElementIndex] = null;
                    parentDrawDataElementArray.splice(parentDrawDataElementIndex, 1);
                  }
                }
              }
            }
          } //if((this._drawID == drawDataElement._drawID) && (this._shapeType == drawDataElement._shapeType))
          else {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._WARN,
              'appendDrawDataElement input inVailed DrawId(' +
                this._drawID +
                ')(' +
                drawDataElement._drawID +
                ') shapeType(' +
                this._shapeType +
                ')(' +
                drawDataElement._shapeType +
                ').'
            );
          }
        } //if(drawDataElement != null)
      };
      this.replaceDrawDataElement = function (drawDataElement) {};
    },

    // ============  wbss kernel MathLib =================

    MathLib: {
      twoPointsDistance: function (posA, posB) {
        return Math.sqrt(
          Math.pow(Math.abs(posA.x - posB.x), 2) + Math.pow(Math.abs(posA.y - posB.y), 2)
        );
      },
      twoPointsSlope: function (posA, posB) {
        return Math.abs(posB.y - posA.y) / Math.abs(posB.x - posA.x);
      },
      intersectLines: function (lineA_start_pos, lineA_end_pos, lineB_start_pos, lineB_end_pos) {
        // 坐标系转换为正数坐标系
        lineA_start_pos.x = lineA_start_pos.x + 1.0;
        lineA_start_pos.y = lineA_start_pos.y + 1.0;
        lineA_end_pos.x = lineA_end_pos.x + 1.0;
        lineA_end_pos.y = lineA_end_pos.y + 1.0;
        lineB_start_pos.x = lineB_start_pos.x + 1.0;
        lineB_start_pos.y = lineB_start_pos.y + 1.0;
        lineB_end_pos.x = lineB_end_pos.x + 1.0;
        lineB_end_pos.y = lineB_end_pos.y + 1.0;

        // 线段ab的法线N1
        var nx1 = lineA_end_pos.y - lineA_start_pos.y,
          ny1 = lineA_start_pos.x - lineA_end_pos.x;

        // 线段cd的法线N2
        var nx2 = lineB_end_pos.y - lineB_start_pos.y,
          ny2 = lineB_start_pos.x - lineB_end_pos.x;

        //两条法线做叉乘, 如果结果为0, 说明线段ab和线段cd平行或共线,不相交
        var denominator = nx1 * ny2 - ny1 * nx2;
        if (denominator == 0) {
          return null;
        }

        // 在法线N2上的投影
        var distC_N2 = nx2 * lineB_start_pos.x + ny2 * lineB_start_pos.y;
        var distA_N2 = nx2 * lineA_start_pos.x + ny2 * lineA_start_pos.y - distC_N2;
        var distB_N2 = nx2 * lineA_end_pos.x + ny2 * lineA_end_pos.y - distC_N2;

        // 点a投影和点b投影在点c投影同侧 (对点在线段上的情况,本例当作不相交处理);
        if (distA_N2 * distB_N2 >= 0) {
          return null;
        }

        //
        // 判断点c点d 和线段ab的关系, 原理同上
        //
        // 在法线N1上的投影
        var distA_N1 = nx1 * lineA_start_pos.x + ny1 * lineA_start_pos.y;
        var distC_N1 = nx1 * lineB_start_pos.x + ny1 * lineB_start_pos.y - distA_N1;
        var distD_N1 = nx1 * lineB_end_pos.x + ny1 * lineB_end_pos.y - distA_N1;
        if (distC_N1 * distD_N1 >= 0) {
          return null;
        }

        // 计算交点坐标
        var fraction = distA_N2 / denominator;
        var dx = fraction * ny1,
          dy = -fraction * nx1;
        return { x: lineA_start_pos.x + dx - 1.0, y: lineA_start_pos.y + dy - 1.0 };
      },
      intersectLineRect: function (
        line_x1,
        line_y1,
        line_x2,
        line_y2,
        rect_left_x,
        rect_right_x,
        rect_top_y,
        rect_bottom_y
      ) {
        if (
          YTX_WBSS_KERNEL.MathLib.intersectLines(
            { x: line_x1, y: line_y1 },
            { x: line_x2, y: line_y2 },
            { x: rect_left_x, y: rect_top_y },
            { x: rect_right_x, y: rect_top_y }
          ) != null
        ) {
          return true;
        } else if (
          YTX_WBSS_KERNEL.MathLib.intersectLines(
            { x: line_x1, y: line_y1 },
            { x: line_x2, y: line_y2 },
            { x: rect_left_x, y: rect_bottom_y },
            { x: rect_right_x, y: rect_bottom_y }
          ) != null
        ) {
          return true;
        } else if (
          YTX_WBSS_KERNEL.MathLib.intersectLines(
            { x: line_x1, y: line_y1 },
            { x: line_x2, y: line_y2 },
            { x: rect_left_x, y: rect_top_y },
            { x: rect_left_x, y: rect_bottom_y }
          ) != null
        ) {
          return true;
        } else if (
          YTX_WBSS_KERNEL.MathLib.intersectLines(
            { x: line_x1, y: line_y1 },
            { x: line_x2, y: line_y2 },
            { x: rect_right_x, y: rect_top_y },
            { x: rect_right_x, y: rect_bottom_y }
          ) != null
        ) {
          return true;
        } else {
          return false;
        }
      },
      intersectRectCircle: function (
        rect_letf_top_pos,
        rect_right_top_pos,
        rect_left_bottom_pos,
        rect_right_bottom_pos,
        circle_center_pos,
        circle_radius
      ) {
        var letf_top_dist = YTX_WBSS_KERNEL.MathLib.twoPointsDistance(
          rect_letf_top_pos,
          circle_center_pos
        );
        var right_top_dist = YTX_WBSS_KERNEL.MathLib.twoPointsDistance(
          rect_right_top_pos,
          circle_center_pos
        );
        var letf_bottom_dist = YTX_WBSS_KERNEL.MathLib.twoPointsDistance(
          rect_left_bottom_pos,
          circle_center_pos
        );
        var right_bottom_dist = YTX_WBSS_KERNEL.MathLib.twoPointsDistance(
          rect_right_bottom_pos,
          circle_center_pos
        );
        if (
          (letf_top_dist > circle_radius &&
            right_top_dist > circle_radius &&
            letf_bottom_dist > circle_radius &&
            right_bottom_dist > circle_radius) ||
          (letf_top_dist < circle_radius &&
            right_top_dist < circle_radius &&
            letf_bottom_dist < circle_radius &&
            right_bottom_dist < circle_radius)
        ) {
          // fix Accuracy
          var letf_top_diff = Math.abs(circle_radius - letf_top_dist);
          var right_top_diff = Math.abs(circle_radius - right_top_dist);
          var letf_bottom_diff = Math.abs(circle_radius - letf_bottom_dist);
          var right_bottom_diff = Math.abs(circle_radius - right_bottom_dist);
          var all_diff = Math.min(
            letf_top_diff,
            right_top_diff,
            letf_bottom_diff,
            right_bottom_diff
          );
          if (all_diff < 0.00001) {
            ///< .toFixed(6) or Math.round 精度控制，主要影响坐标保存信息
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      },
    },

    // ============  wbss kernel json build or protobuffer =================

    _protobuf: {
      // lsm tag
      // _buildHeartBeat: function() {
      //     var id = setTimeout(YTX_WBSS_KERNEL._heartBeatCallBackErr(++YTX_WBSS_KERNEL._heartBeatErrNum), YTX_WBSS_KERNEL._heartBeatTimeOut * 1000);
      //     return "{\"hb\":" + id + "}"
      // },
      _buildDrawData: function (draw_data_obj) {
        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = YTX_WBSS_KERNEL.getRequestIDNumber();
        headJson['roomID'] = YTX_WBSS_KERNEL.currentLoginInRoomID;

        var payloadJsonObj = new Object();
        payloadJsonObj['head'] = headJson;
        payloadJsonObj['data'] = draw_data_obj;

        var payloadJsonStr = JSON.stringify(payloadJsonObj);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.WbssDrawReq + ',"payload":' + payloadJsonStr + '}'
        );
      },
      _buildCreateRoom: function (createRoomBuilder, onSuccess, onError) {
        // 注册鼠标事件
        if (YTX_WBSS_KERNEL.CANVAS_MOD != null) {
          YTX_WBSS_KERNEL.CANVAS_MOD.registerMouseEvent();
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.CreateRoomReq,
          onSuccess,
          onError
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = YTX_WBSS_KERNEL.currentLoginInRoomID;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['roomType'] = createRoomBuilder.getRoomType();
        sendJsonStr['memberLimit'] = createRoomBuilder.getMemberLimit();
        sendJsonStr['password'] = createRoomBuilder.getPassword();
        sendJsonStr['appID'] = YTX_WBSS_KERNEL._appId;
        sendJsonStr['roleID'] = createRoomBuilder.getRoleId();
        sendJsonStr['wbCreateorScale'] = YTX_WBSS_KERNEL.drawContext.wbRatio;
        sendJsonStr['wbCreateorDevice'] = 3;
        sendJsonStr['conferenceId'] = createRoomBuilder.getConferenceId();
        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.CreateRoomReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildJoinRoom: function (joinRoomBuilder, onSuccess, onError) {
        // 注册鼠标事件
        if (YTX_WBSS_KERNEL.CANVAS_MOD != null) {
          YTX_WBSS_KERNEL.CANVAS_MOD.registerMouseEvent();
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.JoinRoomReq,
          onSuccess,
          onError
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = joinRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['password'] = joinRoomBuilder.getPassword();
        sendJsonStr['appID'] = YTX_WBSS_KERNEL._appId;
        sendJsonStr['roleID'] = joinRoomBuilder.getRoleId();

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.JoinRoomReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildDeleteRoom: function (deleteRoomBuilder, onSuccess, onError) {
        if (!deleteRoomBuilder || !deleteRoomBuilder.getRoomId()) {
          var resp = {};
          resp.code = YTX_WBSS_KERNEL._errcode._INVALID_PARAM;
          resp.msg = 'param invalid';
          if (onError) {
            onError(resp);
          }
          return;
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.DeleteRoomReq,
          null,
          null
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = deleteRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.DeleteRoomReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildLeaveRoom: function (leaveRoomBuilder, onSuccess, onError) {
        if (!leaveRoomBuilder || !leaveRoomBuilder.getRoomId()) {
          var resp = {};
          resp.code = YTX_WBSS_KERNEL._errcode._INVALID_PARAM;
          resp.msg = 'param invalid';
          if (onError) {
            onError(resp);
          }
          return;
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.LeaveRoomReq,
          onSuccess,
          onError
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = leaveRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;

        sendJsonStr = JSON.stringify(sendJsonStr);

        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.LeaveRoomReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildClearRoom: function (clearRoomBuilder, onSuccess, onError) {
        if (!clearRoomBuilder || !clearRoomBuilder.getRoomId()) {
          var resp = {};
          resp.code = YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM;
          resp.msg = 'param invalid';
          if (onError) onError(resp);
          return;
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.ClearRoomReq,
          onSuccess,
          onError
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = clearRoomBuilder.getRoomId();

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.ClearRoomReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildShareDoc: function (shareDocBuilder, onSuccess, onError) {
        if (!shareDocBuilder || (!shareDocBuilder.getRoomId() && !!shareDocBuilder.getDocId())) {
          YTX_WBSS_KERNEL._throwError(
            YTX_WBSS_KERNEL._errcode._INVALID_PARAM,
            'param invalid',
            onError
          );
          return null;
        }

        var roomId = shareDocBuilder.getRoomId();
        var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
        if (roomId == current_room_id) {
          var docId = shareDocBuilder.getDocId();
          var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
          if (docId == current_doc_id) {
            // 当前正在共享，重复共享
            return null;
          }

          var doc_info = YTX_WBSS_KERNEL.getDocInfo(roomId, docId, true);
          if (doc_info != null) {
            var doc_info_page_index = doc_info.local_page_index;

            var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
              YTX_WBSS_KERNEL._prototype.ShareDocReq,
              onSuccess,
              onError
            );

            var headJson = new Object();
            headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
            headJson['userID'] = YTX_WBSS_KERNEL._userId;
            headJson['reqID'] = request_id_number;
            headJson['roomID'] = roomId;

            var sendJsonStr = new Object();
            sendJsonStr['head'] = headJson;
            sendJsonStr['docID'] = docId;
            sendJsonStr['pageIndex'] = doc_info_page_index;

            sendJsonStr = JSON.stringify(sendJsonStr);
            return (
              '{"type":' +
              YTX_WBSS_KERNEL._prototype.ShareDocReq +
              ',"payload":' +
              sendJsonStr +
              '}'
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
      _buildRemoveDoc: function (removeDocBuilder, onSuccess, onError) {
        if (!removeDocBuilder || !removeDocBuilder.getRoomId() || !removeDocBuilder.getDocId()) {
          YTX_WBSS_KERNEL._throwError(
            YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM,
            'param invalid',
            onError
          );
          return;
        }
        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.RemoveShareDocReq,
          onSuccess,
          onError
        );
        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = removeDocBuilder.getRoomId();
        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' +
          YTX_WBSS_KERNEL._prototype.RemoveShareDocReq +
          ',"payload":' +
          sendJsonStr +
          '}'
        );
      },
      _buildGotoPage: function (gotoPageBuilder, onSuccess, onError) {
        if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
          respError.msg = 'not in room.';
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
        var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
        var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();
        var goto_page_index = gotoPageBuilder != null ? gotoPageBuilder.getPageIndex() : null;
        var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo();
        var min_page_index = 1;
        var max_page_index = current_doc_info != null ? current_doc_info.getPageSize() : 0;

        if (
          gotoPageBuilder == null ||
          current_room_id == null ||
          current_doc_id == null ||
          current_page_index == null ||
          goto_page_index == null ||
          current_doc_info == null ||
          current_room_id <= 0 ||
          current_doc_id < 0 ||
          goto_page_index <= 0 ||
          current_page_index == goto_page_index ||
          goto_page_index < min_page_index ||
          goto_page_index > max_page_index
        ) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM;
          respError.msg = 'param invalid';
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.GotoPageReq,
          onSuccess,
          onError
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = current_room_id;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = current_doc_id;
        sendJsonStr['pageIndex'] = goto_page_index;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.GotoPageReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildGotoNextPage: function (onSuccess, onError) {
        if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
          respError.msg = 'not in room.';
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
        var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
        var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();
        var goto_page_index = current_page_index != null ? current_page_index + 1 : null;
        var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo();
        var min_page_index = 1;
        var max_page_index = current_doc_info != null ? current_doc_info.getPageSize() : 0;

        if (
          current_room_id == null ||
          current_doc_id == null ||
          current_page_index == null ||
          goto_page_index == null ||
          current_doc_info == null ||
          current_room_id <= 0 ||
          current_doc_id < 0 ||
          goto_page_index <= 0 ||
          current_page_index == goto_page_index ||
          goto_page_index < min_page_index ||
          goto_page_index > max_page_index
        ) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM;
          respError.msg = 'param invalid';
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.GotoPageReq,
          onSuccess,
          onError
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = current_room_id;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = current_doc_id;
        sendJsonStr['pageIndex'] = goto_page_index;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.GotoPageReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildGotoPrevPage: function (onSuccess, onError) {
        if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
          respError.msg = 'not in room.';
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
        var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
        var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();
        var goto_page_index = current_page_index != null ? current_page_index - 1 : null;
        var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo();
        var min_page_index = 1;
        var max_page_index = current_doc_info != null ? current_doc_info.getPageSize() : 0;

        if (
          current_room_id == null ||
          current_doc_id == null ||
          current_page_index == null ||
          goto_page_index == null ||
          current_doc_info == null ||
          current_room_id <= 0 ||
          current_doc_id < 0 ||
          goto_page_index <= 0 ||
          current_page_index == goto_page_index ||
          goto_page_index < min_page_index ||
          goto_page_index > max_page_index
        ) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM;
          respError.msg = 'param invalid';
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.GotoPageReq,
          onSuccess,
          onError
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = current_room_id;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = current_doc_id;
        sendJsonStr['pageIndex'] = goto_page_index;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' + YTX_WBSS_KERNEL._prototype.GotoPageReq + ',"payload":' + sendJsonStr + '}'
        );
      },
      _buildDraw_Undo_or_wRedo: function (is_Undo_or_wRedo, onSuccess, onError) {
        if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
          respError.msg = 'not in room.';
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var findDrawID = '';
        var current_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(false);
        if (current_page_info != null) {
          // 当前信息
          var room_id = YTX_WBSS_KERNEL.getCurRoomId();
          var doc_id = YTX_WBSS_KERNEL.getCurDocId();
          var page_index = YTX_WBSS_KERNEL.getCurPageIndex();

          // 查询DrawID匹配到当前用户
          if (is_Undo_or_wRedo) {
            // 撤销
            if (
              YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
                page_index - 1
              ].drawDataElementArray != null
            ) {
              for (
                var i =
                  YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
                    page_index - 1
                  ].drawDataElementArray.length - 1;
                i >= 0;
                i--
              ) {
                ///< 从后向前查找
                var draw_data_element =
                  YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
                    page_index - 1
                  ].drawDataElementArray[i];
                if (draw_data_element != null) {
                  if (draw_data_element._drawID != null) {
                    var draw_id_split_arrary = draw_data_element._drawID.split('-');
                    if (draw_id_split_arrary != null) {
                      if (draw_id_split_arrary.length >= 6) {
                        if (
                          draw_id_split_arrary[0] == room_id &&
                          draw_id_split_arrary[1] == doc_id &&
                          draw_id_split_arrary[2] == page_index &&
                          draw_id_split_arrary[4] == YTX_WBSS_KERNEL._userId
                        ) {
                          // 找到属于自己的DrawID
                          if (draw_data_element._isUndo == false) {
                            ///< 可以被撤销的DrawID
                            findDrawID = draw_data_element._drawID;
                            draw_data_element._isUndo = true;
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            // 恢复
            if (
              YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
                page_index - 1
              ].drawDataElementArray != null
            ) {
              for (
                var i = 0;
                i <
                YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
                  page_index - 1
                ].drawDataElementArray.length;
                i++
              ) {
                ///< 从前向后查找
                var draw_data_element =
                  YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
                    page_index - 1
                  ].drawDataElementArray[i];
                if (draw_data_element != null) {
                  if (draw_data_element._drawID != null) {
                    var draw_id_split_arrary = draw_data_element._drawID.split('-');
                    if (draw_id_split_arrary != null) {
                      if (draw_id_split_arrary.length >= 6) {
                        if (
                          draw_id_split_arrary[0] == room_id &&
                          draw_id_split_arrary[1] == doc_id &&
                          draw_id_split_arrary[2] == page_index &&
                          draw_id_split_arrary[4] == YTX_WBSS_KERNEL._userId
                        ) {
                          // 找到属于自己的DrawID
                          if (draw_data_element._isUndo == true) {
                            ///< 可以被恢复的DrawID
                            findDrawID = draw_data_element._drawID;
                            draw_data_element._isUndo = false;
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          // 有可用于撤销的绘图元素数据
          if (findDrawID.length > 0) {
            var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
              YTX_WBSS_KERNEL._prototype.DrawUndoReq,
              onSuccess,
              onError
            );

            var headJson = new Object();
            headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
            headJson['userID'] = YTX_WBSS_KERNEL._userId;
            headJson['reqID'] = request_id_number;
            headJson['roomID'] = room_id;

            var sendJsonObject = new Object();
            sendJsonObject['head'] = headJson;
            sendJsonObject['docID'] = doc_id;
            sendJsonObject['drawID'] = findDrawID;
            sendJsonObject['pageIndex'] = page_index;
            if (is_Undo_or_wRedo) {
              // 撤销
              sendJsonObject['type'] = false; ///< type 【0-false is 撤销】 【1-true is 恢复】
            } else {
              // 恢复
              sendJsonObject['type'] = true; ///< type 【0-false is 撤销】 【1-true is 恢复】
            }

            var sendJsonStr = JSON.stringify(sendJsonObject);
            return (
              '{"type":' +
              YTX_WBSS_KERNEL._prototype.DrawUndoReq +
              ',"payload":' +
              sendJsonStr +
              '}'
            );
          }
        } //if(current_page_info != null)
        return null;
      },
      _buildDeleteElement: function (room_id, doc_id, page_index, draw_id) {
        if (room_id == null || doc_id == null || page_index == null || draw_id == null) {
          return null;
        }

        var page_info = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, true);
        if (page_info == null) {
          return null;
        }

        var ext_data_obj = new Object();
        ext_data_obj['room_id'] = room_id;
        ext_data_obj['doc_id'] = doc_id;
        ext_data_obj['page_index'] = page_index;
        ext_data_obj['draw_id'] = draw_id;
        var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
          YTX_WBSS_KERNEL._prototype.WbssDeleteDrawReq,
          null,
          null,
          ext_data_obj
        );

        var headJson = new Object();
        headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
        headJson['userID'] = YTX_WBSS_KERNEL._userId;
        headJson['reqID'] = request_id_number;
        headJson['roomID'] = room_id;

        var sendJsonStr = new Object();
        sendJsonStr['head'] = headJson;
        sendJsonStr['docID'] = doc_id;
        sendJsonStr['pageIndex'] = page_index;
        sendJsonStr['type'] = YTX_WBSS_KERNEL.drawConextDelType.DRAW_DEL_TYPE_LINE;
        sendJsonStr['drawID'] = draw_id;

        sendJsonStr = JSON.stringify(sendJsonStr);
        return (
          '{"type":' +
          YTX_WBSS_KERNEL._prototype.WbssDeleteDrawReq +
          ',"payload":' +
          sendJsonStr +
          '}'
        );
      },
      _buildClearCurrentPage: function (onSuccess, onError) {
        if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
          respError.msg = 'not in room.';
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
          if (onError != null) {
            onError(respError);
          }
          return null;
        }

        var current_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(true);
        if (current_page_info != null) {
          // 当前信息
          var room_id = YTX_WBSS_KERNEL.getCurRoomId();
          var doc_id = YTX_WBSS_KERNEL.getCurDocId();
          var page_index = YTX_WBSS_KERNEL.getCurPageIndex();

          // 发送数据
          var ext_data_obj = new Object();
          ext_data_obj['room_id'] = room_id;
          ext_data_obj['doc_id'] = doc_id;
          ext_data_obj['page_index'] = page_index;
          ext_data_obj['draw_id'] = null;
          var request_id_number = YTX_WBSS_KERNEL.getRequestIDNumber(
            YTX_WBSS_KERNEL._prototype.WbssDeleteDrawReq,
            onSuccess,
            onError,
            ext_data_obj
          );

          var headJson = new Object();
          headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
          headJson['userID'] = YTX_WBSS_KERNEL._userId;
          headJson['reqID'] = request_id_number;
          headJson['roomID'] = room_id;

          var sendJsonStr = new Object();
          sendJsonStr['head'] = headJson;
          sendJsonStr['docID'] = doc_id;
          sendJsonStr['pageIndex'] = page_index;
          sendJsonStr['type'] = YTX_WBSS_KERNEL.drawConextDelType.DRAW_DEL_TYPE_PAGE;

          sendJsonStr = JSON.stringify(sendJsonStr);
          return (
            '{"type":' +
            YTX_WBSS_KERNEL._prototype.WbssDeleteDrawReq +
            ',"payload":' +
            sendJsonStr +
            '}'
          );
        }
        return null;
      },
      _buildScale: function (scaleBuilder, onSuccess, onError) {
        // lsm tag
        // if (!scaleBuilder || scaleBuilder.getRatio() >= 1.0 || scaleBuilder.getRatio() <= -1.0) {
        //     YTX_WBSS_KERNEL._throwError(YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM, "param invalid", onError);
        //     return;
        // }
        // YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, "SCALE");
        // var type = scaleBuilder.getScaleMode();
        // var ratio = scaleBuilder.getRatio();
        // var page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(true);
        // if (!page_info) {
        //     return;
        // }
        // var di = YTX_WBSS_KERNEL.getCurrentDocInfo(true);
        // if (!di) {
        //     return;
        // }
        // var originalImgInfo = di.getOriginalImgInfo();
        // if (!originalImgInfo) return;
        // var originalWidth = originalImgInfo["width"];
        // var originalHeight = originalImgInfo["height"];
        // var newFromX, newFromY, newViewWidth, newViewHeight;
        // if (type == 0) { // 步长缩放
        //     YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, "originalInfo={" + originalWidth + "," + originalHeight + "}");
        //     newFromX = page_info.last_draw_space_fromX - Math.round(originalWidth * ratio / 2.0);
        //     newFromY = page_info.last_draw_space_fromY - Math.round(originalHeight * ratio / 2.0);
        //     newViewWidth = page_info.last_draw_space_width + Math.round(originalWidth * ratio);
        //     newViewHeight = page_info.last_draw_space_height + Math.round(originalHeight * ratio);
        // } else if (type == 1) { // 全比例缩放
        //     // do something
        //     // todo...
        // } else {
        //     YTX_WBSS_KERNEL._throwError(YTX_WBSS_KERNEL._errcode._INVALID_PARAM, "param invalid", onError);
        //     return;
        // }
        // if (newViewWidth / page_info.last_draw_space_height < 0.1) {
        //     YTX_WBSS_KERNEL._throwError(YTX_WBSS_KERNEL._errcode._OUT_OF_RANGE_ERROR, "now is lease or max, out of range", onError);
        //     return;
        // }
        // page_info.last_draw_space_fromX = newFromX;
        // page_info.last_draw_space_fromY = newFromY;
        // page_info.last_draw_space_width = newViewWidth;
        // page_info.last_draw_space_height = newViewHeight;

        // 通知重绘
        YTX_WBSS_KERNEL.updateDrawScreen();
      },
    },

    // ============  wbss kernel sync draw request/respond =================

    requestSyncDrawData: function (roomId, docId, curServerSyncDocDrawDataTimestamp) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====requestSyncDrawData()=====');

      var doc_info = YTX_WBSS_KERNEL.getDocInfo(roomId, docId, true);
      if (doc_info != null) {
        var localDocTimestamp = doc_info.getLocalSyncDocDrawDataTimeStamp();
        if (curServerSyncDocDrawDataTimestamp > localDocTimestamp) {
          var headJson = new Object();
          headJson['authKey'] = YTX_WBSS_KERNEL._authKey;
          headJson['userID'] = YTX_WBSS_KERNEL._userId;
          headJson['reqID'] = YTX_WBSS_KERNEL.getRequestIDNumber();
          headJson['roomID'] = YTX_WBSS_KERNEL.currentLoginInRoomID;

          var sendJsonObj = new Object();
          sendJsonObj['head'] = headJson;
          sendJsonObj['docID'] = docId;
          sendJsonObj['syncType'] = 2; // 时间戳同步
          sendJsonObj['timestamp'] = localDocTimestamp;

          var sendJsonStr =
            '{"type":' +
            YTX_WBSS_KERNEL._prototype.SyncRoomDataReq +
            ',"payload":' +
            JSON.stringify(sendJsonObj) +
            '}';

          if (sendJsonStr != null) {
            YTX_WBSS_KERNEL.sendWebSocketMsg(sendJsonStr);
          }
        } //if (curServerSyncDocDrawDataTimestamp > localDocTimestamp)
      } //if (doc_info != null)
    },

    resposeSyncDrawData: function (obj) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====resposeSyncDrawData()=====');

      var head = obj['head'];
      var room_id = head['roomID'];
      var respCode = head['respCode'];
      var respMsg = head['reason'];
      var draw_data_objects = obj['data'];

      if (respCode == 0) {
        if (draw_data_objects == null) {
          return;
        }
        var last_recv_server_timestamp = 0;
        var last_doc_id = null;
        for (var i = 0; i < draw_data_objects.length; i++) {
          var current_draw_data_object = draw_data_objects[i];
          if (current_draw_data_object != null) {
            var doc_id = current_draw_data_object['docID'];
            if (doc_id != null) {
              last_doc_id = doc_id;
              var current_doc_info = YTX_WBSS_KERNEL.getDocInfo(room_id, doc_id, true);
              if (current_doc_info != null) {
                var current_recv_server_timestamp = current_draw_data_object['timestamp'];
                var page_index = current_draw_data_object['pageIndex'];
                if (current_recv_server_timestamp != null && page_index != null) {
                  if (current_recv_server_timestamp > last_recv_server_timestamp) {
                    last_recv_server_timestamp = current_recv_server_timestamp; ///< 保存到已经获取画图数据的最大时间戳
                  }
                  YTX_WBSS_KERNEL.addServerDrawDataObject(
                    room_id,
                    doc_id,
                    page_index,
                    current_draw_data_object
                  );
                } //if(last_recv_server_timestamp != null && pageIndex != null)
              } //if(current_doc_info != null)
            } //if(doc_id != null)
          } //if(current_draw_data_object != null)
        } //for (var i = 0; i < draw_data_objects.length; i++)

        //同步更新
        if (draw_data_objects.length > 0) {
          YTX_WBSS_KERNEL.updateDrawScreen();
        }

        // 根据服务器端DrawDataArray最大数，分步请求其他数据
        if (draw_data_objects.length >= 100 && last_doc_id != null) {
          var doc_info = YTX_WBSS_KERNEL.getDocInfo(room_id, last_doc_id, true);
          if (doc_info != null) {
            var doc_server_timestamp = doc_info.getServerSyncDocDrawDataTimeStamp();
            if (doc_server_timestamp > last_recv_server_timestamp) {
              ///< 同步画图数据到，从服务器获取的最后时间戳
              // 和服务器，形成循环调用，直到更新到最后数据
              YTX_WBSS_KERNEL.requestSyncDrawData(room_id, last_doc_id, doc_server_timestamp);
            }
          }
        }
      } else {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          'resposeSyncDrawData ErrorMsg=' + respMsg + ' ErrorCode=' + respCode
        );
      }
    },

    updateDrawScreen: function () {
      return YTX_WBSS_KERNEL.CANVAS_MOD.drawScreen();
    },

    getDrawScreenImage: function (img_type, onSuccess, onError) {
      if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
        respError.msg = 'not in room.';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
        if (onError != null) {
          onError(respError);
        }
        return null;
      }

      // 同步绘图
      if (YTX_WBSS_KERNEL.updateDrawScreen() == true) {
        // 保存Canvas
        if (YTX_WBSS_KERNEL.CANVAS_MOD != null) {
          var img = YTX_WBSS_KERNEL.CANVAS_MOD.getScreenImage(img_type);
          if (img != null) {
            // 回调成功
            var respSuccess = {};
            respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
            respSuccess.msg = 'Success';
            respSuccess.img_blob_url = img;
            if (onSuccess != null) {
              onSuccess(respSuccess);
            }

            // 函数返回
            return img;
          } //if(img != null)
        } //if(YTX_WBSS_KERNEL.CANVAS_MOD != null)
      }

      // 返回错误
      var resp = {};
      resp.code = YTX_WBSS_KERNEL._errcode._OBJECT_NOT_EXSIT;
      resp.msg = 'getDrawScreenImage Failed img is null.';
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'getDrawScreenImage Failed img is null');
      if (onError != null) {
        onError(resp);
      }
      return null;
    },

    // ============  wbss kernel download and upload file manager =================

    getDocPageSize: function (roomId, docId) {
      var doc_info = YTX_WBSS_KERNEL.getDocInfo(roomId, docId, false);
      if (doc_info == null) {
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, '找不到文档(' + docId + ')信息');
        return 0;
      }
      return doc_info.getPageSize();
    },

    // 请求房间内所有文档的数据同步
    requestSynchronizeOneRoomAllDocsAllPageFiles: function (current_room_id) {
      // RoomInfo 请求同步房间内，所有文档数据，如果没有请求下载数据
      if (current_room_id != null && current_room_id >= 0) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '===== requestSynchronizeOneRoomAllDocsAllPageFiles room_id=' + current_room_id + '====='
        );
        var currentRoomInfo = YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id];
        if (currentRoomInfo != null) {
          var doc_id_array = currentRoomInfo.getDocIDArray();
          var doc_number = doc_id_array.length;
          if (doc_id_array != null && doc_number > 1) {
            for (var i = 0; i < doc_number; i++) {
              var current_doc_id = doc_id_array[i];
              if (current_doc_id > 0) {
                // 非白板，文档
                YTX_WBSS_KERNEL.requestSynchronizeOneRoomOneDocAllPageFiles(
                  current_room_id,
                  current_doc_id
                );
              } //if(current_doc_id > 0)
            } //for(var i = 0; i < doc_number; i++)
          } //if(doc_id_array != null && doc_number > 1)
        } //if(currentRoomInfo != null)
      } //if(current_room_id != null && current_room_id.length > 0)
    },

    // 请求房间某一个文档的全部页
    requestSynchronizeOneRoomOneDocAllPageFiles: function (current_room_id, current_doc_id) {
      if (current_doc_id > 0) {
        ///< 文档类型
        var current_doc_info = YTX_WBSS_KERNEL.getDocInfo(current_room_id, current_doc_id, true);
        if (current_room_id != null && current_doc_info != null) {
          var current_total_page = current_doc_info.pageSize;
          if (current_total_page != null && current_total_page > 0) {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._DEBUG,
              '=====requestSynchronizeOneRoomOneDocAllPageFiles room_id=' +
                current_room_id +
                ' doc_id=' +
                current_doc_id +
                ' total_page=' +
                current_total_page +
                '====='
            );
            for (var page_index = 1; page_index <= current_total_page; page_index++) {
              YTX_WBSS_KERNEL.requestSynchronizeOneRoomOneDocOnePageFile(
                current_room_id,
                current_doc_id,
                page_index
              );
            } //for(var page_index = 1; page_index <= current_total_page; page_index++)
          } //if(current_total_page != null)
        } //if(current_room_id != null && current_doc_info != null)
      } //if(current_doc_id > 0)
    },

    // 请求房间某一个文档的某一页
    requestSynchronizeOneRoomOneDocOnePageFile: function (roomId, docId, pageIndex) {
      if (docId > 0) {
        ///< 文档类型
        var current_page_info = YTX_WBSS_KERNEL.getPageInfo(roomId, docId, pageIndex, true);
        if (current_page_info != null) {
          var current_page_filename = current_page_info.getPageFileName();
          if (current_page_filename != null) {
            YTX_WBSS_KERNEL.asynGetLocalDataBaseItem(
              current_page_filename,
              function completedCallback(resp) {
                if (
                  resp != null &&
                  resp.code != null &&
                  resp.code == YTX_WBSS_KERNEL._errcode._SUCCESS
                ) {
                  if (resp.key_value != null) {
                    // 获取数据
                    var image_key_value = resp.key_value;

                    //同步PageInfo信息
                    if (
                      !YTX_WBSS_KERNEL.setImageInfo(
                        roomId,
                        docId,
                        pageIndex,
                        image_key_value.image_width,
                        image_key_value.image_height
                      )
                    ) {
                      YTX_WBSS_KERNEL._log(
                        YTX_WBSS_KERNEL._logLev._ERROR,
                        'Get Image Done, setImageInfo Failed，'
                      );
                    }

                    // 保存数据成功，是否需要更新当前，页面
                    if (YTX_WBSS_KERNEL.isCurrentRoomId_DocId_PageIndex(roomId, docId, pageIndex)) {
                      // 同步绘图
                      YTX_WBSS_KERNEL.updateDrawScreen();
                    }
                  } else {
                    // 没有数据对象，请求下载
                    YTX_WBSS_KERNEL.asynDownloadFile(
                      roomId,
                      docId,
                      pageIndex,
                      current_page_filename
                    );
                  }
                }
              },
              function errorCallback(resp) {
                if (resp != null && resp.code != null && resp.msg != null) {
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._ERROR,
                    'Asyn getLocalDataBaseItem Failed，resp.code=' +
                      resp.code +
                      ' resp.msg=' +
                      resp.msg
                  );
                }
              }
            );
          } //if(current_page_filename != null)
        } //if(current_page_info != null)
      } //if(docId > 0)
      return false;
    },

    // 文件下载
    asynDownloadFile: function (roomId, docId, pageIndex, current_page_filename, docInfo) {
      if (YTX_WBSS_KERNEL.isShowDebugDownLoadFile) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=====asynDownloadFile(roomId=' +
            roomId +
            ',docId=' +
            docId +
            ',filename=' +
            current_page_filename +
            ')====='
        );
      }

      var filename = current_page_filename; // 文件名字
      var download_page_url = ''; // 下载页面的URL
      var download_page_XMLHttpRequest; // 请求访问对象
      var download_page_BlobFile; // 文件对象

      // //服务器端，不使用 https 文件下载
      if (YTX_WBSS_KERNEL.websocket_isSSLEncrypt) {
        download_page_url =
          'https://' + Base64.decode(YTX_WBSS_KERNEL._file_servers_http_url[0]) + '/download';
      } else {
        download_page_url =
          'http://' + Base64.decode(YTX_WBSS_KERNEL._file_servers_http_url[0]) + '/download';
      }

      // 参数数据
      var reqId = YTX_WBSS_KERNEL.getRequestIDNumber();
      var params = {
        roomId: roomId.toString(),
        userId: YTX_WBSS_KERNEL._userId,
        docId: docId.toString(),
        fileName: filename,
        reqId: reqId.toString(),
        fileType: '1', // 文档图片下载
      };
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, JSON.stringify(params));
      var Ytx_Params_value = Base64.encode(JSON.stringify(params));
      YTX_WBSS_KERNEL.websocket_sendByteDataTotal += Ytx_Params_value.length;

      // 请求处理
      download_page_XMLHttpRequest = new XMLHttpRequest();
      download_page_XMLHttpRequest.onreadystatechange = function () {
        if (XMLHttpRequest.DONE == download_page_XMLHttpRequest.readyState) {
          var response_status = download_page_XMLHttpRequest.status;
          var response_datasie = 0;
          if (download_page_XMLHttpRequest.response != null) {
            download_page_BlobFile = download_page_XMLHttpRequest.response;
            response_datasie = download_page_BlobFile.size;
          }
          if (response_status == 200) {
            if (YTX_WBSS_KERNEL.isShowDebugDownLoadFile) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'DownloadFile Done roomId=' +
                  roomId +
                  ',docId=' +
                  docId +
                  ',filename=' +
                  current_page_filename +
                  ' is Done ! status=' +
                  response_status +
                  ' datasize=' +
                  response_datasie
              );
            } else {
              if (YTX_WBSS_KERNEL.isCurrentRoomId_DocId_PageIndex(roomId, docId, pageIndex)) {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._DEBUG,
                  'DownloadFile Done roomId=' +
                    roomId +
                    ',docId=' +
                    docId +
                    ',filename=' +
                    current_page_filename +
                    ' is Done ! status=' +
                    response_status +
                    ' datasize=' +
                    response_datasie
                );
              }
            }
            YTX_WBSS_KERNEL.websocket_recvByteDataTotal += response_datasie;

            // Get Blob URL to Image Dom put in Data Base Map
            var download_page_BlobFile_URL = URL.createObjectURL(download_page_BlobFile);
            if (docInfo) {
              YTX_WBSS_KERNEL._onFilePathListener({
                path: download_page_BlobFile_URL,
                docId,
                fileName: docInfo.fileName,
              });
            }
            var new_page_image_obj = document.createElement('img'); ///< new Image() or document.createElement("img");
            new_page_image_obj.onload = function () {
              if (new_page_image_obj.complete) {
                // Create Image Object
                var image_width = new_page_image_obj.width;
                var image_height = new_page_image_obj.height;
                var newImageDataInfo = new YTX_WBSS_KERNEL.ImageDataInfo(
                  filename,
                  download_page_BlobFile,
                  download_page_BlobFile_URL,
                  new_page_image_obj,
                  image_width,
                  image_height
                );

                // Save Image Object
                YTX_WBSS_KERNEL.asynSetLocalDataBaseItem(
                  filename,
                  newImageDataInfo,
                  function (resp) {
                    //同步PageInfo信息
                    if (
                      !YTX_WBSS_KERNEL.setImageInfo(
                        roomId,
                        docId,
                        pageIndex,
                        image_width,
                        image_height
                      )
                    ) {
                      YTX_WBSS_KERNEL._log(
                        YTX_WBSS_KERNEL._logLev._ERROR,
                        'DownloadFile Done, setImageInfo Failed，'
                      );
                    }

                    // 保存数据成功，是否需要更新当前，页面
                    if (YTX_WBSS_KERNEL.isCurrentRoomId_DocId_PageIndex(roomId, docId, pageIndex)) {
                      // 同步绘图
                      YTX_WBSS_KERNEL.updateDrawScreen();
                    }
                  },
                  function (resp) {
                    if (resp != null) {
                      YTX_WBSS_KERNEL._log(
                        YTX_WBSS_KERNEL._logLev._ERROR,
                        'set database item failed filename=' +
                          filename +
                          'resp.code=' +
                          resp.code +
                          ' resp.msg=' +
                          resp.msg
                      );
                    }
                  }
                );
              }
            };
            new_page_image_obj.src = download_page_BlobFile_URL;
          } else {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._ERROR,
              'DownloadFile Error roomId=' +
                roomId +
                ',docId=' +
                docId +
                ',filename=' +
                current_page_filename +
                ' is Failed ! status=' +
                response_status +
                ' datasize=' +
                response_datasie
            );
          }
        } else {
          if (XMLHttpRequest.OPENED == download_page_XMLHttpRequest.readyState) {
            if (YTX_WBSS_KERNEL.isShowDebugDownLoadFile) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'DownloadFile Opened URL=' + download_page_url + ' filename=' + filename
              );
            }
          } else if (XMLHttpRequest.HEADERS_RECEIVED == download_page_XMLHttpRequest.readyState) {
            if (YTX_WBSS_KERNEL.isShowDebugDownLoadFile) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'DownloadFile Received Header roomId=' +
                  roomId +
                  ',docId=' +
                  docId +
                  ',filename=' +
                  current_page_filename
              );
            }
          } else if (XMLHttpRequest.LOADING == download_page_XMLHttpRequest.readyState) {
            if (YTX_WBSS_KERNEL.isShowDebugDownLoadFile) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'DownloadFile Loading roomId=' +
                  roomId +
                  ',docId=' +
                  docId +
                  ',filename=' +
                  current_page_filename
              );
            }
          } else {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._DEBUG,
              'DownloadFile Unknown roomId=' +
                roomId +
                ',docId=' +
                docId +
                ',filename=' +
                current_page_filename +
                ' download_page_XMLHttpRequest.readyState=' +
                download_page_XMLHttpRequest.readyState
            );
          }
        }
      };
      download_page_XMLHttpRequest.open('GET', download_page_url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
      download_page_XMLHttpRequest.responseType = 'blob';
      download_page_XMLHttpRequest.setRequestHeader('Accept', 'application/octet-stream');
      download_page_XMLHttpRequest.setRequestHeader('Content-Type', 'application/octet-stream');
      download_page_XMLHttpRequest.setRequestHeader(
        'Content-Disposition',
        'attachment;filename=' + filename
      );
      download_page_XMLHttpRequest.setRequestHeader('Ytx-Params', Ytx_Params_value);
      download_page_XMLHttpRequest.send();
    },
    //收到文件后，执行下载，本地进行列表预览展示
    setFileToLocal: function (data) {
      var current_page_info = YTX_WBSS_KERNEL.getPageInfo(data.roomId, data.docId, 1, true);
      var current_page_filename = current_page_info.getPageFileName();
      if (current_page_filename !== null) {
        YTX_WBSS_KERNEL.asynGetLocalDataBaseItem(
          current_page_filename,
          (res) => {
            if (res != null && res.code != null && res.code == YTX_WBSS_KERNEL._errcode._SUCCESS) {
              let image_key_value = res.key_value;
              if (image_key_value !== null) {
                YTX_WBSS_KERNEL._onFilePathListener({
                  path: image_key_value.img_blob_file_url,
                  docId: data.docId,
                  fileName: data.fileName,
                });
              } else {
                YTX_WBSS_KERNEL.asynDownloadFile(
                  data.roomId,
                  data.docId,
                  1,
                  current_page_filename,
                  {
                    fileName: data.fileName,
                  }
                );
              }
            }
          },
          (err) => {}
        );
      } else {
      }
    },

    // 上传文件
    _currentUpLoadDocObject: null, ///< 正在上传的文件对象
    _docWaitConvertCompletedMap: {}, ///< 已上传成功等待转换完成的文档
    _waitConvertCompletedMS: 500, ///< 等待完成时间
    _uploadFileMaxSize: 1024 * 1024 * 200, ///< 上传最大，文件大小
    asynUploadFile: function (
      room_id,
      file_object,
      file_url,
      file_extra_data,
      onSuccess,
      onError,
      onProcess
    ) {
      if (YTX_WBSS_KERNEL.isShowDebugUpLoadFile) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=====asynUploadFile(roomId=' +
            room_id +
            ',file_size=' +
            (file_object == null ? 'null' : file_object.size) +
            ',file_url=' +
            (file_url == null ? 'null' : file_url) +
            ')====='
        );
      }

      if ((file_object == null && file_url == null) || (file_object != null && file_url != null)) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._FILE_PARAM_ERROR;
        respError.msg = 'file_object or file_url param invalid failed';
        if (onError != null) {
          onError(respError);
        } else {
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, respError.msg);
        }
        return false;
      }

      if (file_object != null) {
        if (!(file_object instanceof File) || !(file_object instanceof Blob)) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._FILE_PARAM_ERROR;
          respError.msg = 'file_object param invalid failed';
          if (onError != null) {
            onError(respError);
          } else {
            YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, respError.msg);
          }
          return false;
        }

        if (file_object.size >= YTX_WBSS_KERNEL._uploadFileMaxSize) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._FILE_TOO_LARGE;
          respError.msg = 'file_object size is too large';
          if (onError != null) {
            onError(respError);
          } else {
            YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, respError.msg);
          }
          return false;
        }
      }

      if (file_url != null) {
        if (file_url.length <= 0) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._FILE_PARAM_ERROR;
          respError.msg = 'file_url param invalid failed';
          if (onError != null) {
            onError(respError);
          } else {
            YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, respError.msg);
          }
          return false;
        }
      }

      if (YTX_WBSS_KERNEL._currentUpLoadDocObject != null) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._ALREADY_FILE_UPLOAD_ERROR;
        respError.msg = 'is alreay file is uploading ... ...';
        if (onError != null) {
          onError(respError);
        } else {
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, respError.msg);
        }
        return false;
      }

      // 访问服务器的URL地址
      var upload_doc_server_url;
      // //服务器端，不使用 https 文件上传
      if (YTX_WBSS_KERNEL.websocket_isSSLEncrypt) {
        upload_doc_server_url =
          'https://' + Base64.decode(YTX_WBSS_KERNEL._file_servers_http_url[0]) + '/upload';
      } else {
        upload_doc_server_url =
          'http://' + Base64.decode(YTX_WBSS_KERNEL._file_servers_http_url[0]) + '/upload';
      }

      // Session ID
      var upload_doc_server_session_id = 'lsmh5sdksession' + Math.round(Math.random() * 1000000);

      // 构建参数
      var upload_filename = '';
      if (file_object != null) {
        upload_filename = file_object.name;
      }
      if (file_url != null) {
        upload_filename = file_url;
      }

      // 本地文件上传模式
      if (file_object != null) {
        var file_reader_obj = new FileReader();
        file_reader_obj.readAsArrayBuffer(file_object);
        file_reader_obj.onload = function loaded(evt) {
          var binaryString = evt.target.result; ///< 文件字节流

          // 参数数据
          var reqId = YTX_WBSS_KERNEL.getRequestIDNumber();
          var params = {
            roomId: room_id,
            userId: YTX_WBSS_KERNEL._userId,
            fileName: encodeURI(upload_filename),
            reqId: reqId.toString(),
            fileType: '1',
            extOpts: file_extra_data != null ? file_extra_data : '',
          };
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, JSON.stringify(params));
          var Ytx_Params_value = Base64.encode(JSON.stringify(params));
          YTX_WBSS_KERNEL.websocket_sendByteDataTotal += Ytx_Params_value.length;

          // 请求处理
          var upload_doc_XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequest 对象
          YTX_WBSS_KERNEL._currentUpLoadDocObject = new Object();
          YTX_WBSS_KERNEL._currentUpLoadDocObject.objXMLHttpRequest = upload_doc_XMLHttpRequest;
          YTX_WBSS_KERNEL._currentUpLoadDocObject.startUpLoadTimeStampMs = new Date().getTime(); ///< 开始上传的时间戳
          YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size = 0;
          YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size = 0;
          upload_doc_XMLHttpRequest.onreadystatechange = function () {
            if (XMLHttpRequest.DONE == upload_doc_XMLHttpRequest.readyState) {
              var response_status = upload_doc_XMLHttpRequest.status;
              var response_datasie = 0;
              if (response_status == 200) {
                // 清除当前正在上传的文档信息
                var file_size = YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size;
                var startUpLoadTimeStampMs =
                  YTX_WBSS_KERNEL._currentUpLoadDocObject.startUpLoadTimeStampMs;

                // 保存信息
                var responseText = upload_doc_XMLHttpRequest.responseText;
                if (responseText != null && responseText.length > 0 && file_size > 0) {
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._DEBUG,
                    'responseText=' + responseText
                  );
                  var jsonResponse = JSON.parse(responseText);
                  if (jsonResponse != null) {
                    var statusCode = jsonResponse['statusCode'];
                    var reason = jsonResponse['reason'];
                    var docId = jsonResponse['docId'];
                    if (statusCode == 0) {
                      // 等待文件完成
                      var wait_convert_complete_doc_obj = new Object();
                      wait_convert_complete_doc_obj.docId = docId;
                      wait_convert_complete_doc_obj.code =
                        YTX_WBSS_KERNEL._errcode._UPLOAD_COVERTING_STATUS;
                      wait_convert_complete_doc_obj.filename = upload_filename;
                      wait_convert_complete_doc_obj.complete_percentage = 50.0;
                      var endUpLoadTimeStampMs = new Date().getTime(); ///< 结束上传的时间戳
                      wait_convert_complete_doc_obj.diffUpLoadTimeStampMs =
                        endUpLoadTimeStampMs - startUpLoadTimeStampMs;
                      wait_convert_complete_doc_obj.file_size = file_size;
                      wait_convert_complete_doc_obj.timestamp_step_ms =
                        YTX_WBSS_KERNEL._waitConvertCompletedMS;
                      wait_convert_complete_doc_obj.file_size_step_every100ms = 16933;
                      wait_convert_complete_doc_obj.timeout_step_ms = 0;
                      wait_convert_complete_doc_obj.timeout_total_ms = 1000 * 60 * 30; ///< 最多等待半小时
                      var total_ms =
                        (wait_convert_complete_doc_obj.file_size /
                          wait_convert_complete_doc_obj.file_size_step_every100ms) *
                        100;
                      var total_step_num = total_ms / YTX_WBSS_KERNEL._waitConvertCompletedMS;
                      wait_convert_complete_doc_obj.complete_percentage_step =
                        50.0 / total_step_num;

                      // 定时器
                      wait_convert_complete_doc_obj.timer_handle = window.setInterval(function () {
                        wait_convert_complete_doc_obj.timeout_step_ms =
                          wait_convert_complete_doc_obj.timeout_step_ms +
                          YTX_WBSS_KERNEL._waitConvertCompletedMS;
                        if (
                          wait_convert_complete_doc_obj.timeout_step_ms >
                          wait_convert_complete_doc_obj.timeout_total_ms
                        ) {
                          // 清除缓存对象
                          delete YTX_WBSS_KERNEL._docWaitConvertCompletedMap[
                            wait_convert_complete_doc_obj.docId
                          ];

                          // 停止定时器
                          if (wait_convert_complete_doc_obj.timer_handle != null) {
                            window.clearInterval(wait_convert_complete_doc_obj.timer_handle);
                            wait_convert_complete_doc_obj.timer_handle = null;
                          }
                        }
                        wait_convert_complete_doc_obj.complete_percentage =
                          wait_convert_complete_doc_obj.complete_percentage +
                          wait_convert_complete_doc_obj.complete_percentage_step;
                        if (wait_convert_complete_doc_obj.complete_percentage > 99.99) {
                          wait_convert_complete_doc_obj.complete_percentage = 99.99;
                        }
                        if (YTX_WBSS_KERNEL._onUploadDocProcessListener != null) {
                          var respUploadDocProcess = {};
                          respUploadDocProcess.code = wait_convert_complete_doc_obj.code;
                          respUploadDocProcess.msg = 'converting ... ...';
                          respUploadDocProcess.filename = upload_filename;
                          respUploadDocProcess.complete_percentage =
                            wait_convert_complete_doc_obj.complete_percentage;
                          YTX_WBSS_KERNEL._onUploadDocProcessListener(respUploadDocProcess);
                        } else {
                          YTX_WBSS_KERNEL._log(
                            YTX_WBSS_KERNEL._logLev._DEBUG,
                            'converting filename=' +
                              upload_filename +
                              ' complete_percentage=' +
                              wait_convert_complete_doc_obj.complete_percentage
                          );
                        }
                      }, YTX_WBSS_KERNEL._waitConvertCompletedMS);

                      // 保存缓存
                      YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                      YTX_WBSS_KERNEL._docWaitConvertCompletedMap[docId] =
                        wait_convert_complete_doc_obj;
                    } else {
                      YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                      if (YTX_WBSS_KERNEL._onUploadDocProcessListener != null) {
                        var respUploadDocProcess = {};
                        respUploadDocProcess.code = statusCode;
                        respUploadDocProcess.msg = reason;
                        respUploadDocProcess.filename = upload_filename;
                        respUploadDocProcess.complete_percentage = -1.0;
                        YTX_WBSS_KERNEL._onUploadDocProcessListener(respUploadDocProcess);
                      } else {
                        YTX_WBSS_KERNEL._log(
                          YTX_WBSS_KERNEL._logLev._ERROR,
                          'filename=' + upload_filename + ' convert error=' + statusCode
                        );
                      }
                    }
                  } else {
                    YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                    YTX_WBSS_KERNEL._log(
                      YTX_WBSS_KERNEL._logLev._ERROR,
                      'UploadFile Complete Parse Json Failed'
                    );
                  }
                } //if(responseText != null && responseText.length > 0)
                else {
                  YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._ERROR,
                    'UploadFile Complete Error room_id=' +
                      room_id +
                      ',filename=' +
                      upload_filename +
                      ' is Failed ! status=' +
                      response_status +
                      ' datasize=' +
                      response_datasie
                  );
                }
              } else {
                YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._ERROR,
                  'UploadFile Error room_id=' +
                    room_id +
                    ',filename=' +
                    upload_filename +
                    ' is Failed ! status=' +
                    response_status +
                    ' datasize=' +
                    response_datasie
                );
              }
            } else {
              if (XMLHttpRequest.OPENED == upload_doc_XMLHttpRequest.readyState) {
                if (YTX_WBSS_KERNEL.isShowDebugUpLoadFile) {
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._DEBUG,
                    'UploadFile Opened URL=' +
                      upload_doc_server_url +
                      ' filename=' +
                      upload_filename
                  );
                }
              } else if (XMLHttpRequest.HEADERS_RECEIVED == upload_doc_XMLHttpRequest.readyState) {
                if (YTX_WBSS_KERNEL.isShowDebugUpLoadFile) {
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._DEBUG,
                    'UploadFile Received Header room_id=' + room_id + ',filename=' + upload_filename
                  );
                }
              } else if (XMLHttpRequest.LOADING == upload_doc_XMLHttpRequest.readyState) {
                if (YTX_WBSS_KERNEL.isShowDebugUpLoadFile) {
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._DEBUG,
                    'UploadFile Loading room_id=' + room_id + ',filename=' + upload_filename
                  );
                }
              } else {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._DEBUG,
                  'UploadFile Unknown room_id=' +
                    room_id +
                    ',filename=' +
                    upload_filename +
                    ' upload_doc_XMLHttpRequest.readyState=' +
                    upload_doc_XMLHttpRequest.readyState
                );
              }
            }
          };
          // 上传进度调用方法实现
          upload_doc_XMLHttpRequest.upload.onprogress = function (event) {
            if (event.lengthComputable) {
              if (YTX_WBSS_KERNEL._currentUpLoadDocObject != null) {
                // 保存文件大小
                if (YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size != null) {
                  if (YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size == 0) {
                    YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size = event.total;
                  }
                }

                // 保存发送统计
                if (event.loaded > YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size) {
                  var diff_already_load_size =
                    event.loaded - YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size;
                  YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size = event.loaded;
                  YTX_WBSS_KERNEL.websocket_sendByteDataTotal += diff_already_load_size;
                }
              }

              // 回调进度
              if (YTX_WBSS_KERNEL._onUploadDocProcessListener != null) {
                var respUploadDocProcess = {};
                respUploadDocProcess.code = YTX_WBSS_KERNEL._errcode._UPLOAD_COVERTING_STATUS;
                respUploadDocProcess.msg = 'uploading ... ...';
                respUploadDocProcess.filename = upload_filename;
                respUploadDocProcess.complete_percentage =
                  (((event.loaded * 1.0) / (event.total * 1.0)) * 100.0) / 2;
                if (respUploadDocProcess.complete_percentage > 50.0) {
                  respUploadDocProcess.complete_percentage = 50.0;
                }
                YTX_WBSS_KERNEL._onUploadDocProcessListener(respUploadDocProcess);
              } else {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._DEBUG,
                  'filename=' +
                    upload_filename +
                    ' loaded=' +
                    event.loaded +
                    ',total=' +
                    event.total
                );
              }
            }
          };
          upload_doc_XMLHttpRequest.open('POST', upload_doc_server_url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
          upload_doc_XMLHttpRequest.responseType = 'text';
          upload_doc_XMLHttpRequest.setRequestHeader('Accept', 'application/json');
          upload_doc_XMLHttpRequest.setRequestHeader('Content-Type', 'application/octet-stream');
          upload_doc_XMLHttpRequest.setRequestHeader(
            'Content-Disposition',
            'attachment;filename=' + encodeURI(upload_filename)
          );
          upload_doc_XMLHttpRequest.setRequestHeader('Ytx-Params', Ytx_Params_value);
          upload_doc_XMLHttpRequest.setRequestHeader('Session-ID', upload_doc_server_session_id);
          upload_doc_XMLHttpRequest.send(binaryString); // 发送文件数据
        }; //file_reader_obj.onload = function loaded(evt)
      } //if(file_object != null)

      // 远程文件上传模式
      if (file_url != null) {
        // 参数数据
        var reqId = YTX_WBSS_KERNEL.getRequestIDNumber();
        var params = {
          roomId: room_id,
          userId: YTX_WBSS_KERNEL._userId,
          fileName: encodeURI(upload_filename),
          reqId: reqId.toString(),
          fileType: '3',
          extOpts: file_extra_data != null ? file_extra_data : '',
        };
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, JSON.stringify(params));
        var Ytx_Params_value = Base64.encode(JSON.stringify(params));
        YTX_WBSS_KERNEL.websocket_sendByteDataTotal += Ytx_Params_value.length;

        // 请求处理
        var upload_doc_XMLHttpRequest = new XMLHttpRequest(); // XMLHttpRequest 对象
        YTX_WBSS_KERNEL._currentUpLoadDocObject = new Object();
        YTX_WBSS_KERNEL._currentUpLoadDocObject.objXMLHttpRequest = upload_doc_XMLHttpRequest;
        YTX_WBSS_KERNEL._currentUpLoadDocObject.startUpLoadTimeStampMs = new Date().getTime(); ///< 开始上传的时间戳
        YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size = 0;
        YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size = 0;
        upload_doc_XMLHttpRequest.onreadystatechange = function () {
          if (XMLHttpRequest.DONE == upload_doc_XMLHttpRequest.readyState) {
            var response_status = upload_doc_XMLHttpRequest.status;
            var response_datasie = 0;
            if (response_status == 200) {
              // 清除当前正在上传的文档信息
              var file_size = YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size;
              var startUpLoadTimeStampMs =
                YTX_WBSS_KERNEL._currentUpLoadDocObject.startUpLoadTimeStampMs;

              // 保存信息
              var responseText = upload_doc_XMLHttpRequest.responseText;
              if (responseText != null && responseText.length > 0 && file_size > 0) {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._DEBUG,
                  'responseText=' + responseText
                );
                var jsonResponse = JSON.parse(responseText);
                if (jsonResponse != null) {
                  var statusCode = jsonResponse['statusCode'];
                  var reason = jsonResponse['reason'];
                  var docId = jsonResponse['docId'];
                  if (statusCode == 0) {
                    // 等待文件完成
                    var wait_convert_complete_doc_obj = new Object();
                    wait_convert_complete_doc_obj.docId = docId;
                    wait_convert_complete_doc_obj.code =
                      YTX_WBSS_KERNEL._errcode._UPLOAD_COVERTING_STATUS;
                    wait_convert_complete_doc_obj.filename = upload_filename;
                    wait_convert_complete_doc_obj.complete_percentage = 50.0;
                    var endUpLoadTimeStampMs = new Date().getTime(); ///< 结束上传的时间戳
                    wait_convert_complete_doc_obj.diffUpLoadTimeStampMs =
                      endUpLoadTimeStampMs - startUpLoadTimeStampMs;
                    wait_convert_complete_doc_obj.file_size = file_size;
                    wait_convert_complete_doc_obj.timestamp_step_ms =
                      YTX_WBSS_KERNEL._waitConvertCompletedMS;
                    wait_convert_complete_doc_obj.file_size_step_every100ms = 16933;
                    wait_convert_complete_doc_obj.timeout_step_ms = 0;
                    wait_convert_complete_doc_obj.timeout_total_ms = 1000 * 60 * 30; ///< 最多等待半小时
                    var total_ms =
                      (wait_convert_complete_doc_obj.file_size /
                        wait_convert_complete_doc_obj.file_size_step_every100ms) *
                      100;
                    var total_step_num = total_ms / YTX_WBSS_KERNEL._waitConvertCompletedMS;
                    wait_convert_complete_doc_obj.complete_percentage_step = 50.0 / total_step_num;

                    // 定时器
                    wait_convert_complete_doc_obj.timer_handle = window.setInterval(function () {
                      wait_convert_complete_doc_obj.timeout_step_ms =
                        wait_convert_complete_doc_obj.timeout_step_ms +
                        YTX_WBSS_KERNEL._waitConvertCompletedMS;
                      if (
                        wait_convert_complete_doc_obj.timeout_step_ms >
                        wait_convert_complete_doc_obj.timeout_total_ms
                      ) {
                        // 清除缓存对象
                        delete YTX_WBSS_KERNEL._docWaitConvertCompletedMap[
                          wait_convert_complete_doc_obj.docId
                        ];

                        // 停止定时器
                        if (wait_convert_complete_doc_obj.timer_handle != null) {
                          window.clearInterval(wait_convert_complete_doc_obj.timer_handle);
                          wait_convert_complete_doc_obj.timer_handle = null;
                        }
                      }
                      wait_convert_complete_doc_obj.complete_percentage =
                        wait_convert_complete_doc_obj.complete_percentage +
                        wait_convert_complete_doc_obj.complete_percentage_step;
                      if (wait_convert_complete_doc_obj.complete_percentage > 99.99) {
                        wait_convert_complete_doc_obj.complete_percentage = 99.99;
                      }
                      if (YTX_WBSS_KERNEL._onUploadDocProcessListener != null) {
                        var respUploadDocProcess = {};
                        respUploadDocProcess.code = wait_convert_complete_doc_obj.code;
                        respUploadDocProcess.msg = 'converting ... ...';
                        respUploadDocProcess.filename = upload_filename;
                        respUploadDocProcess.complete_percentage =
                          wait_convert_complete_doc_obj.complete_percentage;
                        YTX_WBSS_KERNEL._onUploadDocProcessListener(respUploadDocProcess);
                      } else {
                        YTX_WBSS_KERNEL._log(
                          YTX_WBSS_KERNEL._logLev._DEBUG,
                          'converting filename=' +
                            upload_filename +
                            ' complete_percentage=' +
                            wait_convert_complete_doc_obj.complete_percentage
                        );
                      }
                    }, YTX_WBSS_KERNEL._waitConvertCompletedMS);

                    // 保存缓存
                    YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                    YTX_WBSS_KERNEL._docWaitConvertCompletedMap[docId] =
                      wait_convert_complete_doc_obj;
                  } else {
                    YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                    if (YTX_WBSS_KERNEL._onUploadDocProcessListener != null) {
                      var respUploadDocProcess = {};
                      respUploadDocProcess.code = statusCode;
                      respUploadDocProcess.msg = reason;
                      respUploadDocProcess.filename = upload_filename;
                      respUploadDocProcess.complete_percentage = -1.0;
                      YTX_WBSS_KERNEL._onUploadDocProcessListener(respUploadDocProcess);
                    } else {
                      YTX_WBSS_KERNEL._log(
                        YTX_WBSS_KERNEL._logLev._ERROR,
                        'filename=' + upload_filename + ' convert error=' + statusCode
                      );
                    }
                  }
                } else {
                  YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._ERROR,
                    'UploadFile Complete Parse Json Failed'
                  );
                }
              } //if(responseText != null && responseText.length > 0)
              else {
                YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._ERROR,
                  'UploadFile Complete Error room_id=' +
                    room_id +
                    ',filename=' +
                    upload_filename +
                    ' is Failed ! status=' +
                    response_status +
                    ' datasize=' +
                    response_datasie
                );
              }
            } else {
              YTX_WBSS_KERNEL._currentUpLoadDocObject = null;
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._ERROR,
                'UploadFile Error room_id=' +
                  room_id +
                  ',filename=' +
                  upload_filename +
                  ' is Failed ! status=' +
                  response_status +
                  ' datasize=' +
                  response_datasie
              );
            }
          } else {
            if (XMLHttpRequest.OPENED == upload_doc_XMLHttpRequest.readyState) {
              if (YTX_WBSS_KERNEL.isShowDebugUpLoadFile) {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._DEBUG,
                  'UploadFile Opened URL=' + upload_doc_server_url + ' filename=' + upload_filename
                );
              }
            } else if (XMLHttpRequest.HEADERS_RECEIVED == upload_doc_XMLHttpRequest.readyState) {
              if (YTX_WBSS_KERNEL.isShowDebugUpLoadFile) {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._DEBUG,
                  'UploadFile Received Header room_id=' + room_id + ',filename=' + upload_filename
                );
              }
            } else if (XMLHttpRequest.LOADING == upload_doc_XMLHttpRequest.readyState) {
              if (YTX_WBSS_KERNEL.isShowDebugUpLoadFile) {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._DEBUG,
                  'UploadFile Loading room_id=' + room_id + ',filename=' + upload_filename
                );
              }
            } else {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'UploadFile Unknown room_id=' +
                  room_id +
                  ',filename=' +
                  upload_filename +
                  ' upload_doc_XMLHttpRequest.readyState=' +
                  upload_doc_XMLHttpRequest.readyState
              );
            }
          }
        };
        // 上传进度调用方法实现
        upload_doc_XMLHttpRequest.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            if (YTX_WBSS_KERNEL._currentUpLoadDocObject != null) {
              // 保存文件大小
              if (YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size != null) {
                if (YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size == 0) {
                  YTX_WBSS_KERNEL._currentUpLoadDocObject.file_size = event.total;
                }
              }

              // 保存发送统计
              if (event.loaded > YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size) {
                var diff_already_load_size =
                  event.loaded - YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size;
                YTX_WBSS_KERNEL._currentUpLoadDocObject.file_load_size = event.loaded;
                YTX_WBSS_KERNEL.websocket_sendByteDataTotal += diff_already_load_size;
              }
            }

            // 回调进度
            if (YTX_WBSS_KERNEL._onUploadDocProcessListener != null) {
              var respUploadDocProcess = {};
              respUploadDocProcess.code = YTX_WBSS_KERNEL._errcode._UPLOAD_COVERTING_STATUS;
              respUploadDocProcess.msg = 'uploading ... ...';
              respUploadDocProcess.filename = upload_filename;
              respUploadDocProcess.complete_percentage =
                (((event.loaded * 1.0) / (event.total * 1.0)) * 100.0) / 2;
              if (respUploadDocProcess.complete_percentage > 50.0) {
                respUploadDocProcess.complete_percentage = 50.0;
              }
              YTX_WBSS_KERNEL._onUploadDocProcessListener(respUploadDocProcess);
            } else {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'filename=' + upload_filename + ' loaded=' + event.loaded + ',total=' + event.total
              );
            }
          }
        };
        upload_doc_XMLHttpRequest.open('POST', upload_doc_server_url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        upload_doc_XMLHttpRequest.responseType = 'text';
        upload_doc_XMLHttpRequest.setRequestHeader('Accept', 'application/json');
        upload_doc_XMLHttpRequest.setRequestHeader('Content-Type', 'application/octet-stream');
        upload_doc_XMLHttpRequest.setRequestHeader(
          'Content-Disposition',
          'attachment;filename=' + encodeURI(upload_filename)
        );
        upload_doc_XMLHttpRequest.setRequestHeader('Ytx-Params', Ytx_Params_value);
        upload_doc_XMLHttpRequest.setRequestHeader('Session-ID', upload_doc_server_session_id);
        upload_doc_XMLHttpRequest.send('this is null file, is used url.'); // 发送文件数据
      }
    },

    // ============  wbss kernel image data manager =================

    // memory image database
    ImageDataInfo: function (
      img_json_filename,
      img_blob_file,
      img_blob_file_url,
      image_object,
      image_width,
      image_height
    ) {
      this.img_json_filename = img_json_filename;
      this.img_blob_file = img_blob_file; ///< http下载的blob文件
      this.img_blob_file_url = img_blob_file_url; ///< 把blob资源转换为blob_url
      this.image_object = image_object; ///< 把blob_url给image src生成图片对象
      this.image_width = image_width;
      this.image_height = image_height;
      this.GetBlobFileURL = function () {
        return this.img_blob_file_url;
      };
      this.GetImageObject = function () {
        return this.image_object;
      };
    },
    all_image_data_info_map: {},

    // indexDB is Key/Value database
    indexDB_handle: null,
    indexDB_objectStore_index: null,
    indexDB_dbInfo: {
      dbName: 'ytx_wbss_indexdb',
      dbStoreName: 'ytx_doc_image_table',
      dbIndexKeyName: 'image_index_name',
    },

    openLocalDataBase: function () {
      window.indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.OIndexedDB ||
        window.msIndexedDB;
      window.IDBTransaction =
        window.IDBTransaction ||
        window.webkitIDBTransaction ||
        window.OIDBTransaction ||
        window.msIDBTransaction;
      window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

      // 初始化 table name
      YTX_WBSS_KERNEL.indexDB_dbInfo.dbName =
        YTX_WBSS_KERNEL.indexDB_dbInfo.dbName + '_' + YTX_WBSS_KERNEL.WBSS_SDK_VERSION_NUMBER;

      // 数据库处理
      if (window.indexedDB == null) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          'Your browser does not support a stable version of IndexedDB. Such and such feature will not be available.'
        );
        window.alert(
          'Your browser does not support a stable version of IndexedDB. Such and such feature will not be available.'
        );
      }
      var db_open_request = indexedDB.open(
        YTX_WBSS_KERNEL.indexDB_dbInfo.dbName,
        YTX_WBSS_KERNEL.WBSS_SDK_VERSION_NUMBER
      );
      db_open_request.onupgradeneeded = function (evt) {
        // 打开数据库版本【YTX_WBSS_KERNEL.indexDB_dbInfo.dbVersion】不一致的时候触发
        if (evt.oldVersion != null && evt.newVersion != null) {
          if (evt.newVersion != evt.oldVersion) {
            // 保存数据库对象
            YTX_WBSS_KERNEL.indexDB_handle = db_open_request.result;
            if (YTX_WBSS_KERNEL.indexDB_handle != null) {
              var isExsitObjectStore = YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames.contains(
                YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName
              );
              if (isExsitObjectStore != true) {
                // 创建数据库表
                var indexDB_objectStore = YTX_WBSS_KERNEL.indexDB_handle.createObjectStore(
                  YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName,
                  { keyPath: YTX_WBSS_KERNEL.indexDB_dbInfo.dbIndexKeyName }
                );
                if (indexDB_objectStore != null) {
                  // 保存信息
                  for (var i = 0; i < YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames.length; i++) {
                    if (
                      YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames[i] ==
                      YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName
                    ) {
                      YTX_WBSS_KERNEL.indexDB_handle.indexDB_objectStore_index = i;
                      break;
                    }
                  }

                  // 添加索引
                  var request_create_index = indexDB_objectStore.createIndex(
                    YTX_WBSS_KERNEL.indexDB_dbInfo.dbIndexKeyName,
                    YTX_WBSS_KERNEL.indexDB_dbInfo.dbIndexKeyName,
                    { unique: true }
                  );
                  if (request_create_index != null) {
                    YTX_WBSS_KERNEL._log(
                      YTX_WBSS_KERNEL._logLev._ERROR,
                      'request_create_index is Failed,is not surport indexDB!'
                    );
                  }
                } //if(indexDB_objectStore != null)
              } //if(isExsitObjectStore != true)
            } //if(YTX_WBSS_KERNEL.indexDB_handle != null)
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._WARN,
              '====== indexDB onUpgradeneeded ======'
            );
          }
        }
      };
      db_open_request.onerror = function (evt) {
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, '====== indexDB onError ======');
        YTX_WBSS_KERNEL.indexDB_handle = null;
      };
      db_open_request.onsuccess = function (evt) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '====== indexDB onSuccess Start ======'
        );

        // 保存数据库对象
        YTX_WBSS_KERNEL.indexDB_handle = db_open_request.result;
        if (YTX_WBSS_KERNEL.indexDB_handle != null) {
          // 注册数据库事件
          if (YTX_WBSS_KERNEL.indexDB_handle.onerror != null) {
            YTX_WBSS_KERNEL.indexDB_handle.onerror = function (evt) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'YTX_WBSS_KERNEL.indexDB_handle.onerror'
              );
            };
          }
          if (YTX_WBSS_KERNEL.indexDB_handle.onclose != null) {
            YTX_WBSS_KERNEL.indexDB_handle.onclose = function (evt) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'YTX_WBSS_KERNEL.indexDB_handle.onclose'
              );
            };
          }

          // 获取数据库信息
          if (YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames != null) {
            var isExsitObjectStore = YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames.contains(
              YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName
            );
            if (isExsitObjectStore != true) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._ERROR,
                'indexDb database_name=' +
                  YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName +
                  ' is not exsit.'
              );
            } else {
              // 遍历 objectStore 保存数据对象
              for (var i = 0; i < YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames.length; i++) {
                if (
                  YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames[i] ==
                  YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName
                ) {
                  YTX_WBSS_KERNEL.indexDB_handle.indexDB_objectStore_index = i;
                  break;
                }
              }
            }
          } //if(YTX_WBSS_KERNEL.indexDB_handle.objectStoreNames != null)
        }
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '====== indexDB onSuccess End ======');
      };
    },
    closeLocalDataBase: function () {
      // indexDB
      if (YTX_WBSS_KERNEL.indexDB_handle != null) {
        YTX_WBSS_KERNEL.indexDB_handle.close();
        YTX_WBSS_KERNEL.indexDB_handle = null;
      }

      // 还原 table name
      YTX_WBSS_KERNEL.indexDB_dbInfo.dbName = 'ytx_wbss_indexdb';
    },

    asynReadIndexDB: function (key_name, asynCompletedCallback, asynErrorCallback) {
      // 保存到持久化层
      if (YTX_WBSS_KERNEL.indexDB_handle != null) {
        var readwrite_transaction = YTX_WBSS_KERNEL.indexDB_handle.transaction(
          [YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName],
          'readwrite'
        );
        if (readwrite_transaction != null) {
          var obj_store = readwrite_transaction.objectStore(
            YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName
          );
          if (obj_store != null) {
            var obj_index = obj_store.index(YTX_WBSS_KERNEL.indexDB_dbInfo.dbIndexKeyName);
            if (obj_index != null) {
              var request_index_db_get = obj_index.get(key_name);
              request_index_db_get.onerror = function (event) {
                var respError = {};
                respError.code = YTX_WBSS_KERNEL._errcode._INDEX_DB_GET_ERROR;
                respError.msg = 'indexDB get is error, key_name=' + key_name;
                if (asynErrorCallback != null) {
                  asynErrorCallback(respError);
                } else {
                  YTX_WBSS_KERNEL._log(
                    YTX_WBSS_KERNEL._logLev._ERROR,
                    'respError.code=' + respError.code + ' respError.msg=' + respError.msg
                  );
                }
              };
              request_index_db_get.onsuccess = function (event) {
                if (request_index_db_get.result != null) {
                  var filename = request_index_db_get.result['img_json_filename'];
                  var download_page_BlobFile = request_index_db_get.result['img_blob_file'];
                  var download_page_BlobFile_URL = URL.createObjectURL(download_page_BlobFile);
                  var new_page_image_obj = document.createElement('img'); ///< new Image() or document.createElement("img");
                  new_page_image_obj.onload = function () {
                    if (new_page_image_obj.complete) {
                      // Create Image Object
                      var image_width = new_page_image_obj.width;
                      var image_height = new_page_image_obj.height;
                      var newImageDataInfo = new YTX_WBSS_KERNEL.ImageDataInfo(
                        filename,
                        download_page_BlobFile,
                        download_page_BlobFile_URL,
                        new_page_image_obj,
                        image_width,
                        image_height
                      );

                      // 持久化层返回数据
                      var respSuccess = {};
                      respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
                      respSuccess.msg = 'indexDB get value Success, key_name=' + key_name;
                      respSuccess.key_value = newImageDataInfo;
                      if (asynCompletedCallback != null) {
                        asynCompletedCallback(respSuccess);
                      }
                    }
                  };
                  new_page_image_obj.src = download_page_BlobFile_URL;
                } else {
                  // 持久化层返回，查找数据未找到
                  var respSuccess = {};
                  respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
                  respSuccess.msg = 'indexDB get value is not exsit, key_name=' + key_name;
                  respSuccess.key_value = null;
                  if (asynCompletedCallback != null) {
                    asynCompletedCallback(respSuccess);
                  }
                }
              };
            } else {
              var respError = {};
              respError.code = YTX_WBSS_KERNEL._errcode._INDEX_DB_INDEX_ERROR;
              respError.msg = 'get index is error, key_name=' + key_name;
              if (asynErrorCallback != null) {
                asynErrorCallback(respError);
              }
            }
          }
        }
      }
      return false;
    },

    asynWriteIndexDB: function (key_name, key_value, asynCompletedCallback, asynErrorCallback) {
      // 保存到持久化层
      if (YTX_WBSS_KERNEL.indexDB_handle != null) {
        var readwrite_transaction = YTX_WBSS_KERNEL.indexDB_handle.transaction(
          [YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName],
          'readwrite'
        );
        if (readwrite_transaction != null) {
          var obj_store = readwrite_transaction.objectStore(
            YTX_WBSS_KERNEL.indexDB_dbInfo.dbStoreName
          );
          if (obj_store != null) {
            var obj_index = obj_store.index(YTX_WBSS_KERNEL.indexDB_dbInfo.dbIndexKeyName);
            if (obj_index != null) {
              var request_index_db_get = obj_index.get(key_name);
              request_index_db_get.onerror = function (event) {
                var respError = {};
                respError.code = YTX_WBSS_KERNEL._errcode._INDEX_DB_GET_ERROR;
                respError.msg = 'indexDB get is error, key_name=' + key_name;
                if (asynErrorCallback != null) {
                  asynErrorCallback(respError);
                }
              };
              request_index_db_get.onsuccess = function (event) {
                if (request_index_db_get.result != null) {
                  // 更新数据
                  var insert_obj_store = new Object();
                  insert_obj_store[YTX_WBSS_KERNEL.indexDB_dbInfo.dbIndexKeyName] = key_name;
                  insert_obj_store['img_json_filename'] = key_value['img_json_filename'];
                  insert_obj_store['img_blob_file'] = key_value['img_blob_file'];
                  insert_obj_store['image_width'] = key_value['image_width'];
                  insert_obj_store['image_height'] = key_value['image_height'];
                  var request_index_db_put = obj_store.put(insert_obj_store);
                  request_index_db_put.onerror = function (event) {
                    var respError = {};
                    respError.code = YTX_WBSS_KERNEL._errcode._INDEX_DB_PUT_ERROR;
                    respError.msg = 'indexDB put is error, key_name=' + key_name;
                    if (asynErrorCallback != null) {
                      asynErrorCallback(respError);
                    }
                  };
                  request_index_db_put.onsuccess = function (event) {
                    var respSuccess = {};
                    respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
                    respSuccess.msg = 'indexDB put is success, key_name=' + key_name;
                    if (asynCompletedCallback != null) {
                      asynCompletedCallback(respSuccess);
                    }
                  };
                } else {
                  // 添加数据
                  var insert_obj_store = new Object();
                  insert_obj_store[YTX_WBSS_KERNEL.indexDB_dbInfo.dbIndexKeyName] = key_name;
                  insert_obj_store['img_json_filename'] = key_value['img_json_filename'];
                  insert_obj_store['img_blob_file'] = key_value['img_blob_file'];
                  insert_obj_store['image_width'] = key_value['image_width'];
                  insert_obj_store['image_height'] = key_value['image_height'];
                  var request_index_db_add = obj_store.add(insert_obj_store);
                  request_index_db_add.onerror = function (event) {
                    var respError = {};
                    respError.code = YTX_WBSS_KERNEL._errcode._INDEX_DB_ADD_ERROR;
                    respError.msg = 'indexDB add is error, key_name=' + key_name;
                    if (asynErrorCallback != null) {
                      asynErrorCallback(respError);
                    }
                  };
                  request_index_db_add.onsuccess = function (event) {
                    var respSuccess = {};
                    respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
                    respSuccess.msg = 'indexDB add is success, key_name=' + key_name;
                    if (asynCompletedCallback != null) {
                      asynCompletedCallback(respSuccess);
                    }
                  };
                }
              };
            } else {
              var respError = {};
              respError.code = YTX_WBSS_KERNEL._errcode._INDEX_DB_INDEX_ERROR;
              respError.msg = 'get index is error, key_name=' + key_name;
              if (asynErrorCallback != null) {
                asynErrorCallback(respError);
              }
            }
          } //if(obj_store != null)
        } //if(readwrite_transaction != null)
      } //if(YTX_WBSS_KERNEL.indexDB_handle != null)
    },

    // 设置数据，Aync：param key_name or error resp object
    asynSetLocalDataBaseItem: function (
      key_name,
      key_value,
      asynCompletedCallback,
      asynErrorCallback
    ) {
      try {
        // 保存到内存中
        YTX_WBSS_KERNEL.all_image_data_info_map[key_name] = key_value;
        if (asynCompletedCallback != null) {
          var respSuccess = {};
          respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
          respSuccess.msg = 'set database item value is Successed, key_name=' + key_name;
          asynCompletedCallback(respSuccess);
        }

        // 保存到持久化层
        YTX_WBSS_KERNEL.asynWriteIndexDB(
          key_name,
          key_value,
          function completedCallback(resp) {
            // 不返回上层
            if (resp != null && resp.code != null && resp.msg != null) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._DEBUG,
                'asynWriteIndexDB Successed resp.code=' + resp.code + ' resp.msg=' + resp.msg
              );
            }
          },
          function errorCallback(resp) {
            // 不返回上层
            if (resp != null && resp.code != null && resp.msg != null) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._ERROR,
                'asynWriteIndexDB Failed resp.code=' + resp.code + ' resp.msg=' + resp.msg
              );
            }
          }
        );
      } catch (error) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._SET_DATABASE_OBJECT_FAILED;
        respError.msg = 'set database item value is Failed, key_name=' + key_name;
        if (asynErrorCallback != null) {
          asynErrorCallback(respError);
        } else {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._ERROR,
            'respError.code=' + respError.code + ' respError.msg=' + respError.msg
          );
        }
      }
    },

    // 获取数据，Sync：return DataObject or null
    syncGetLocalDataBaseItem: function (key_name) {
      try {
        // 更新内存数据
        var key_value = YTX_WBSS_KERNEL.all_image_data_info_map[key_name];
        if (key_value == null) {
          return null;
        } else {
          return key_value;
        }
      } catch (error) {
        return null;
      }
      return null;
    },

    // 获取数据，Aync：param key_value or error resp object
    asynGetLocalDataBaseItem: function (key_name, asynCompletedCallback, asynErrorCallback) {
      try {
        // 更新内存数据
        var key_value = YTX_WBSS_KERNEL.all_image_data_info_map[key_name];
        if (key_value == null) {
          // 内存中没有数据，尝试从持久化层查找
          YTX_WBSS_KERNEL.asynReadIndexDB(
            key_name,
            function (resp) {
              // 保存数据
              var respSuccess = {};
              respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
              respSuccess.msg =
                'get database item value is Failed, key_name=' + key_name + 'is not exsit!';
              respSuccess.key_value = null;
              if (
                resp != null &&
                resp.code != null &&
                resp.code == YTX_WBSS_KERNEL._errcode._SUCCESS &&
                resp.key_value != null
              ) {
                // 同步数据
                respSuccess.key_value = resp.key_value;
                YTX_WBSS_KERNEL.all_image_data_info_map[key_name] = respSuccess.key_value;
              }

              // 返回成功
              if (asynCompletedCallback != null) {
                asynCompletedCallback(respSuccess);
              }
            },
            function (resp) {
              if (resp != null && resp.code != null && resp.msg != null) {
                YTX_WBSS_KERNEL._log(
                  YTX_WBSS_KERNEL._logLev._ERROR,
                  'get database item asyn read indexDB resp.code=' +
                    resp.code +
                    ' resp.msg=' +
                    resp.msg
                );
              }
            }
          );
        } else {
          // 返回成功
          if (asynCompletedCallback != null) {
            var respSuccess = {};
            respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
            respSuccess.msg = 'get database item value is Success, key_name=' + key_name;
            respSuccess.key_value = key_value;
            asynCompletedCallback(respSuccess);
          }
        }
      } catch (error) {
        // 返回失败
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._GET_DATABASE_OBJECT_FAILED;
        respError.msg = 'get database item value is Failed, key_name=' + key_name;
        if (asynErrorCallback != null) {
          asynErrorCallback(respError);
        } else {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._ERROR,
            'respError.code=' + respError.code + ' respError.msg=' + respError.msg
          );
        }
      }
    },

    // ============  wbss kernel drawContext =================

    drawConextToolStatus: {
      DRAW_STATUS_NONE: 0,
      DRAW_STATUS_NORMAL: 1, ///< 画笔(包括所有形状)状态
      DRAW_STATUS_ERASER: 2, ///< 橡皮擦
      DRAW_STATUS_ZOOM: 3, ///< 画布的缩放和移动状态
      DRAW_STATUS_LASER_PEN: 4, ///< 激光笔
      DRAW_STATUS_DELETE: 5, ///< 删除元素
      DRAW_STATUS_ELEMENT_MOVE: 6, ///< 移动元素
      DRAW_STATUS_END: 7,
    },
    drawConextDelType: {
      DRAW_DEL_TYPE_LINE: 1,
      DRAW_DEL_TYPE_PAGE: 2,
      DRAW_DEL_TYPE_DOC: 3,
    },
    drawContext: {
      drawToolStatus: 0, ///< 工具状态 YTX_WBSS_KERNEL.drawContext.drawConextToolStatus
      drawShapeType: 1, ///< 画笔形状 YTX_WBSS_API._shapeType

      drawCountTotalNumber: 0, ///< 绘图帧数，用于统计FPS
      wbRatio: 4.0 / 3.0, ///< 白板比例，文档使用文档图片的比例
      wb_ifSacle: 1.0, ///< 缩放比例
      lineSize: 1, ///< 线宽
      lineColor: 0xff, ///< 线的颜色
      isEraser: false, ///< 是否是橡皮擦
      isFillMode: false, ///< 形状是否填充

      canvas_frame_bg_linesize: 0, ///< Canvas边框大小
      canvas_frame_bg_color: '#000000FF', ///< Canvas边框颜色

      color_whiteboard_undraw_area_bg: '#000000FF', ///< 白板不可画区域的背景颜色
      color_doc_img_undraw_area_bg: '#000000FF', ///< 文档的背景颜色
      color_whiteboard_view_bg: '#FFFFFFFF', ///< 白板的背景颜色
      color_doc_img_view_bg: '#FFFFFFFF', ///< 文档的背景颜色，实际为图片，如果没有图片或是没下载好，为透明颜色

      createDrawDataElementObjectNum: 0,
      currentDrawDataElementObject: null,

      // 创建 Draw Data Object
      createCurrentDrawDataElementObject: function (
        room_id,
        doc_id,
        page_index,
        draw_data_obj,
        lastTimestampMS,
        maxFPS
      ) {
        this.order_index = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObjectNum++;
        this.room_id = room_id;
        this.doc_id = doc_id;
        this.page_index = page_index;
        this.draw_data_obj = draw_data_obj;
        this.sendMsgLastTimestampMS = lastTimestampMS; ///< 发送消息，最后时间戳
        this.sendMsgLastCoorsNumber = 0; ///< 发送消息，最后时坐标数
        this.sendMsgMaxFPS = maxFPS; ///< 发送同步数据，最大帧率
      },

      // 开始画图
      startCurrentDrawDataElement: function (room_id, doc_id, page_index, mouse_event_obj) {
        // 对象检查
        if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null) {
          YTX_WBSS_KERNEL.drawContext.endCurrentDrawDataElement(null);
        }

        // 当前PageInfo
        var curPageInfo = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, false);
        if (curPageInfo == null) {
          return false;
        }

        //画线处理
        if (
          (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画自由线
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.FREELINE) ||
          (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画直线
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LINE) ||
          (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画矩形
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.RECT) ||
          (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画三角形
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.TRIANGLE) ||
          (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画圆
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.CIRCLE) ||
          (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 椭圆
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.ELLIPSE) ||
          (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_LASER_PEN && ///< 激光笔
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LASERPEN)
        ) {
          // 保存缓存坐标
          var screen_coordinate_array = [];
          screen_coordinate_array.push({ x: mouse_event_obj.x, y: mouse_event_obj.y });
          var world_coordinate_array = [];
          YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
            world_coordinate_array,
            curPageInfo,
            screen_coordinate_array
          );
          if (world_coordinate_array.length <= 0) {
            return false;
          }
          var coordinate_array = [];
          coordinate_array.push(world_coordinate_array[0].x);
          coordinate_array.push(world_coordinate_array[0].y);

          // 生成DrawID
          var nowTimeStampMS = new Date().getTime();
          var nowTimeStampSecondString = parseInt(nowTimeStampMS / 1000);
          var draw_id =
            room_id.toString() +
            '-' +
            doc_id.toString() +
            '-' +
            page_index.toString() +
            '-' +
            YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[page_index - 1]
              .drawIDSeedNumber++ +
            '-' +
            YTX_WBSS_KERNEL._userId +
            '-' +
            nowTimeStampSecondString;

          // 创建服务器端draw_data_object对象
          var current_draw_data_object = new Object();
          current_draw_data_object['drawID'] = draw_id;
          current_draw_data_object['docID'] = doc_id;
          current_draw_data_object['pageIndex'] = page_index.toString(); ///< Warn：服务器视此对象为字符串，否正解析失败
          current_draw_data_object['coordinates'] = coordinate_array;
          current_draw_data_object['color'] = YTX_WBSS_KERNEL.drawContext.lineColor;
          current_draw_data_object['lineStyle'] = 'LINE_FULL';
          current_draw_data_object['shapeType'] = YTX_WBSS_KERNEL.drawContext.drawShapeType;
          current_draw_data_object['isFinal'] = false;
          current_draw_data_object['lineSize'] = YTX_WBSS_KERNEL.drawContext.lineSize;
          current_draw_data_object['isFill'] = false;
          current_draw_data_object['drawAreaWidth'] = Math.round(curPageInfo.last_draw_space_width);
          current_draw_data_object['drawAreaHeight'] = Math.round(
            curPageInfo.last_draw_space_height
          );

          if (YTX_WBSS_KERNEL.drawContext.isEraser) {
            if (doc_id === 0) {
              current_draw_data_object.color = -1;
            } else {
              current_draw_data_object.color = 0;
            }
          }
          // 创建对象
          var send_msg_max_fps = 10.0;
          switch (YTX_WBSS_KERNEL.drawContext.drawShapeType) {
            case YTX_WBSS_API._shapeType.FREELINE:
              {
                send_msg_max_fps = 30.0;
              }
              break;
            case YTX_WBSS_API._shapeType.LINE:
              {
                send_msg_max_fps = 30.0;
              }
              break;
            case YTX_WBSS_API._shapeType.RECT:
              {
                send_msg_max_fps = 30.0;
              }
              break;
            case YTX_WBSS_API._shapeType.TRIANGLE:
              {
                send_msg_max_fps = 30.0;
              }
              break;
            case YTX_WBSS_API._shapeType.CIRCLE:
              {
                send_msg_max_fps = 30.0;
              }
              break;
            case YTX_WBSS_API._shapeType.ELLIPSE:
              {
                send_msg_max_fps = 30.0;
              }
              break;
            case YTX_WBSS_API._shapeType.LASERPEN:
              {
                send_msg_max_fps = 30.0;
              }
              break;
            default:
              {
                send_msg_max_fps = 25.0;
              }
              break;
          }
          YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject =
            new YTX_WBSS_KERNEL.drawContext.createCurrentDrawDataElementObject(
              room_id,
              doc_id,
              page_index,
              current_draw_data_object,
              nowTimeStampMS,
              send_msg_max_fps
            );
          if (YTX_WBSS_API._shapeType.LASERPEN == YTX_WBSS_KERNEL.drawContext.drawShapeType) {
            // 发送渲染消息
            var sendStr = YTX_WBSS_KERNEL._protobuf._buildDrawData(
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
            );
            if (sendStr != null && sendStr.length > 0) {
              YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
            }
          } //if(YTX_WBSS_API._shapeType.LASERPEN == YTX_WBSS_KERNEL.drawContext.drawShapeType)
        } else if (
          YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_ERASER && ///< 元素橡皮擦
          YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.ERASER_DRAW_ID
        ) {
          if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject == null) {
            if (mouse_event_obj != null && mouse_event_obj.x != null && mouse_event_obj.y != null) {
              // 保存参数
              var current_draw_data_object = new Object();
              current_draw_data_object['shapeType'] = YTX_WBSS_KERNEL.drawContext.drawShapeType;

              // 帧率和时间戳
              var nowTimeStampMS = new Date().getTime();
              var send_msg_max_fps = 60.0; ///< 提高橡皮擦fps精度，可以提高用户体验，增加更多的计算量

              // 创建对象
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject =
                new YTX_WBSS_KERNEL.drawContext.createCurrentDrawDataElementObject(
                  room_id,
                  doc_id,
                  page_index,
                  current_draw_data_object,
                  nowTimeStampMS,
                  send_msg_max_fps
                );

              // 查找DrawID
              var find_draw_id = curPageInfo.findDrawDataElement(
                mouse_event_obj.x,
                mouse_event_obj.y
              );
              if (find_draw_id != null && find_draw_id.length > 0) {
                // 发送渲染消息
                var sendStr = YTX_WBSS_KERNEL._protobuf._buildDeleteElement(
                  room_id,
                  doc_id,
                  page_index,
                  find_draw_id
                );
                if (sendStr != null && sendStr.length > 0) {
                  YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
                }
              }
            } //if(mouse_event_obj != null && mouse_event_obj.x != null && mouse_event_obj.y != null)
          } //if(YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject == null)
        } else {
          // Show Log
          if (YTX_WBSS_KERNEL.isShowDebugManagerDrawDataElement) {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._WARN,
              'startCurrentDrawDataElement(' +
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.order_index +
                ')'
            );
          }
        }
      },

      // 画图中
      updateCurrentDrawDataElement: function (mouse_event_obj) {
        if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null) {
          // 画线处理
          if (
            YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画自由线
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.FREELINE
          ) {
            // 当前PageInfo
            var room_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.room_id;
            var doc_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.doc_id;
            var page_index = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.page_index;
            var curPageInfo = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, false);
            if (curPageInfo == null) {
              return false;
            }

            // 保存缓存坐标
            var screen_coordinate_array = [];
            if (mouse_event_obj != null) {
              screen_coordinate_array.push({ x: mouse_event_obj.x, y: mouse_event_obj.y });
            }
            var world_coordinate_array = [];
            if (screen_coordinate_array.length > 0) {
              YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
                world_coordinate_array,
                curPageInfo,
                screen_coordinate_array
              );
            }
            if (world_coordinate_array.length <= 0) {
              return false;
            }

            // Check Draw Data Object
            if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj != null) {
              // 添加坐标
              var coordinates_length =
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                  .length;
              if (coordinates_length >= 2) {
                var A_x =
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                    .coordinates[coordinates_length - 2];
                var A_y =
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                    .coordinates[coordinates_length - 1];
                var B_x = world_coordinate_array[0].x;
                var B_y = world_coordinate_array[0].y;
                if (A_x == B_x && A_y == B_y) {
                  //坐标点相同，忽略相同坐标点
                  return false;
                }
              }
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                world_coordinate_array[0].x
              );
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                world_coordinate_array[0].y
              );

              // 获取时间戳
              var nowTimeStampMS = new Date().getTime();
              var diff_nowTimeStampMS =
                nowTimeStampMS -
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS;
              var diff_fps_ms =
                1000.0 / YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgMaxFPS;

              // 处理坐标
              if (diff_nowTimeStampMS > diff_fps_ms) {
                // 根据帧率发送消息

                coordinates_length =
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                    .length;
                if (
                  (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject
                    .sendMsgLastCoorsNumber == 0 &&
                    coordinates_length >= 4) ||
                  (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject
                    .sendMsgLastCoorsNumber != 0 &&
                    coordinates_length >
                      YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject
                        .sendMsgLastCoorsNumber)
                ) {
                  // 保存对象
                  var old_draw_data_object_coordinates =
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                      .coordinates; ///< 备份数据，处理完后恢复
                  var new_draw_data_object_coordinates = [];
                  for (
                    var i =
                      YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject
                        .sendMsgLastCoorsNumber;
                    i < coordinates_length;
                    i++
                  ) {
                    new_draw_data_object_coordinates.push(old_draw_data_object_coordinates[i]);
                  }

                  // 发送渲染消息
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates =
                    new_draw_data_object_coordinates;
                  var sendStr = YTX_WBSS_KERNEL._protobuf._buildDrawData(
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                  );
                  if (sendStr != null && sendStr.length > 0) {
                    YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
                  }
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates =
                    old_draw_data_object_coordinates;

                  // 保存更新
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS =
                    nowTimeStampMS;
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastCoorsNumber =
                    coordinates_length;
                }
              }
            } //if(YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj != null)
          } else if (
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画直线
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LINE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 矩形
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.RECT) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画三角形
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.TRIANGLE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画圆
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.CIRCLE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 椭圆
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.ELLIPSE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_LASER_PEN && ///< 激光笔
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LASERPEN)
          ) {
            // 当前PageInfo
            var room_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.room_id;
            var doc_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.doc_id;
            var page_index = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.page_index;
            var curPageInfo = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, false);
            if (curPageInfo == null) {
              return false;
            }

            // 保存缓存坐标
            var screen_coordinate_array = [];
            if (mouse_event_obj != null) {
              screen_coordinate_array.push({ x: mouse_event_obj.x, y: mouse_event_obj.y });
            }
            var world_coordinate_array = [];
            if (screen_coordinate_array.length > 0) {
              YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
                world_coordinate_array,
                curPageInfo,
                screen_coordinate_array
              );
            }
            if (world_coordinate_array.length <= 0) {
              return false;
            }

            // Check Draw Data Object
            if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj != null) {
              var coordinates_length =
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                  .length;
              if (YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LASERPEN) {
                if (coordinates_length >= 2) {
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[0] =
                    world_coordinate_array[0].x;
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[1] =
                    world_coordinate_array[0].y;
                } else {
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    world_coordinate_array[0].x
                  );
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    world_coordinate_array[0].y
                  );
                }
              } else {
                if (coordinates_length <= 2) {
                  // 添加坐标
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    world_coordinate_array[0].x
                  );
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    world_coordinate_array[0].y
                  );
                  if (
                    YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.TRIANGLE
                  ) {
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                      -1
                    );
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                      -1
                    );
                  }
                } else {
                  // 更新坐标
                  if (world_coordinate_array.length > 0) {
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[2] =
                      world_coordinate_array[0].x;
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[3] =
                      world_coordinate_array[0].y;
                  } //if(world_coordinate_array.length > 0)
                }
              }

              // 获取时间戳
              var nowTimeStampMS = new Date().getTime();
              var diff_nowTimeStampMS =
                nowTimeStampMS -
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS;
              var diff_fps_ms =
                1000.0 / YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgMaxFPS;

              // 处理帧率
              if (diff_nowTimeStampMS > diff_fps_ms) {
                // 根据帧率发送消息

                coordinates_length =
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                    .length;
                if (
                  coordinates_length >= 4 ||
                  (coordinates_length >= 2 &&
                    YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LASERPEN)
                ) {
                  // 发送渲染消息
                  var sendStr = YTX_WBSS_KERNEL._protobuf._buildDrawData(
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                  );
                  if (sendStr != null && sendStr.length > 0) {
                    YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
                  }

                  // 保存更新
                  if (diff_nowTimeStampMS > diff_fps_ms * 2) {
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS =
                      nowTimeStampMS; ///< 如果时差太大，同步到当前时间
                  } else {
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS +=
                      diff_fps_ms; ///< 正常补加时间
                  }
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastCoorsNumber +=
                    coordinates_length;
                }
              }
            } //if(YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj != null)
          } else if (
            YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_ERASER && ///< 元素橡皮擦
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.ERASER_DRAW_ID
          ) {
            if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null) {
              if (
                mouse_event_obj != null &&
                mouse_event_obj.x != null &&
                mouse_event_obj.y != null
              ) {
                var current_draw_data_object =
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj;
                if (
                  current_draw_data_object != null &&
                  current_draw_data_object.shapeType != null
                ) {
                  if (
                    current_draw_data_object.shapeType == YTX_WBSS_API._shapeType.ERASER_DRAW_ID
                  ) {
                    // 获取时间戳
                    var nowTimeStampMS = new Date().getTime();
                    var diff_nowTimeStampMS =
                      nowTimeStampMS -
                      YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject
                        .sendMsgLastTimestampMS;
                    var diff_fps_ms =
                      1000.0 /
                      YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgMaxFPS;

                    // 处理帧率
                    if (diff_nowTimeStampMS > diff_fps_ms) {
                      // 根据帧率发送消息

                      // 当前PageInfo
                      var room_id =
                        YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.room_id;
                      var doc_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.doc_id;
                      var page_index =
                        YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.page_index;
                      var curPageInfo = YTX_WBSS_KERNEL.getPageInfo(
                        room_id,
                        doc_id,
                        page_index,
                        false
                      );
                      if (curPageInfo == null) {
                        return false;
                      }

                      // 查找DrawID
                      var find_draw_id = curPageInfo.findDrawDataElement(
                        mouse_event_obj.x,
                        mouse_event_obj.y
                      );
                      if (find_draw_id != null && find_draw_id.length > 0) {
                        // 发送渲染消息
                        var sendStr = YTX_WBSS_KERNEL._protobuf._buildDeleteElement(
                          room_id,
                          doc_id,
                          page_index,
                          find_draw_id
                        );
                        if (sendStr != null && sendStr.length > 0) {
                          YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
                        }
                      }

                      // 保存更新
                      if (diff_nowTimeStampMS > diff_fps_ms * 2) {
                        YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS =
                          nowTimeStampMS; ///< 如果时差太大，同步到当前时间
                      } else {
                        YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS +=
                          diff_fps_ms; ///< 正常补加时间
                      }
                    }
                  } //if(current_draw_data_object.shapeType == YTX_WBSS_API._shapeType.ERASER_DRAW_ID)
                } //if(current_draw_data_object != null && current_draw_data_object.shapeType != null)
              } //if(mouse_event_obj != null && mouse_event_obj.x != null && mouse_event_obj.y != null)
            } //if(YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject == null)
          } else {
            // Show Log
            if (YTX_WBSS_KERNEL.isShowDebugManagerDrawDataElement) {
              YTX_WBSS_KERNEL._log(
                YTX_WBSS_KERNEL._logLev._INFO,
                'updateCurrentDrawDataElement(' +
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.order_index +
                  ')'
              );
            }
          }
        }
      },

      // 结束画图
      endCurrentDrawDataElement: function (mouse_event_obj) {
        if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null) {
          // 释放画线资源
          if (
            YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画自由线
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.FREELINE
          ) {
            // 当前PageInfo
            var room_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.room_id;
            var doc_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.doc_id;
            var page_index = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.page_index;
            var curPageInfo = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, false);
            if (curPageInfo == null) {
              return false;
            }

            // 保存缓存坐标
            var screen_coordinate_array = [];
            if (mouse_event_obj != null) {
              screen_coordinate_array.push({ x: mouse_event_obj.x, y: mouse_event_obj.y });
            }
            var world_coordinate_array = [];
            if (screen_coordinate_array.length > 0) {
              YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
                world_coordinate_array,
                curPageInfo,
                screen_coordinate_array
              );
            }

            // Check Draw Data Object
            if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj != null) {
              // 添加坐标
              var coordinates_length =
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                  .length;
              if (coordinates_length <= 2) {
                if (world_coordinate_array.length > 0) {
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    world_coordinate_array[0].x
                  );
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    world_coordinate_array[0].y
                  );
                }
              } else {
                if (world_coordinate_array.length > 0) {
                  // 更新坐标
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[2] =
                    world_coordinate_array[0].x;
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[3] =
                    world_coordinate_array[0].y;
                }
              }

              // 保存发送出最后数据
              var coordinates_length =
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                  .length;
              if (
                coordinates_length >=
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastCoorsNumber
              ) {
                // 保存对象
                var old_draw_data_object_coordinates =
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                    .coordinates; ///< 备份数据，处理完后恢复
                var new_draw_data_object_coordinates = [];
                for (
                  var i =
                    YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastCoorsNumber;
                  i < coordinates_length;
                  i++
                ) {
                  new_draw_data_object_coordinates.push(old_draw_data_object_coordinates[i]);
                }

                // 发送渲染消息
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates =
                  new_draw_data_object_coordinates;
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.isFinal = true;
                var sendStr = YTX_WBSS_KERNEL._protobuf._buildDrawData(
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                );
                if (sendStr != null && sendStr.length > 0) {
                  YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
                }
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates =
                  old_draw_data_object_coordinates;

                // 保存更新
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS = 0;
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastCoorsNumber =
                  coordinates_length;
              }
            } //if(YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj != null)
          } else if (
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画直线
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LINE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画矩形
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.RECT) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画三角形
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.TRIANGLE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 画圆
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.CIRCLE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 椭圆
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.ELLIPSE) ||
            (YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_LASER_PEN && ///< 激光笔
              YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LASERPEN)
          ) {
            // 当前PageInfo
            var room_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.room_id;
            var doc_id = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.doc_id;
            var page_index = YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.page_index;
            var curPageInfo = YTX_WBSS_KERNEL.getPageInfo(room_id, doc_id, page_index, false);
            if (curPageInfo == null) {
              return false;
            }

            // 保存缓存坐标
            var screen_coordinate_array = [];
            if (mouse_event_obj != null) {
              screen_coordinate_array.push({ x: mouse_event_obj.x, y: mouse_event_obj.y });
            }
            var world_coordinate_array = [];
            if (screen_coordinate_array.length > 0) {
              YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
                world_coordinate_array,
                curPageInfo,
                screen_coordinate_array
              );
            }

            // 添加坐标
            var coordinates_length =
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                .length;
            if (YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LASERPEN) {
              if (coordinates_length >= 2) {
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[0] =
                  world_coordinate_array[0].x;
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[1] =
                  world_coordinate_array[0].y;
              } else {
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                  world_coordinate_array[0].x
                );
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                  world_coordinate_array[0].y
                );
              }
            } else {
              if (coordinates_length <= 2) {
                // 添加坐标
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                  world_coordinate_array[0].x
                );
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                  world_coordinate_array[0].y
                );
                if (YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.TRIANGLE) {
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    -1
                  );
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates.push(
                    -1
                  );
                }
              } else {
                if (world_coordinate_array.length > 0) {
                  // 更新坐标
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[2] =
                    world_coordinate_array[0].x;
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates[3] =
                    world_coordinate_array[0].y;
                } //if(world_coordinate_array.length > 0)
              }
            }
            coordinates_length =
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.coordinates
                .length;

            // 保存发送出最后数据
            if (
              coordinates_length >= 4 ||
              (coordinates_length >= 2 &&
                YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.LASERPEN)
            ) {
              // 发送渲染消息
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj.isFinal = true;
              var sendStr = YTX_WBSS_KERNEL._protobuf._buildDrawData(
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
              );
              if (sendStr != null && sendStr.length > 0) {
                YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
              }

              // 保存更新
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastTimestampMS = 0;
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.sendMsgLastCoorsNumber +=
                coordinates_length;
            }
          } else if (
            YTX_WBSS_KERNEL.drawContext.drawToolStatus ==
              YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_ERASER && ///< 元素橡皮擦
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.ERASER_DRAW_ID
          ) {
          }

          // 释放资源
          if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null) {
            delete YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject;
            YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject = null;
          }

          // Show Log
          if (YTX_WBSS_KERNEL.isShowDebugManagerDrawDataElement) {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._WARN,
              'endCurrentDrawDataElement(' +
                YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.order_index +
                ')'
            );
          }
        } //if(YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null)
      },

      // ============  wbss kernel drawContext addText =================

      createTextDrawDataElement: function (
        font_pos,
        font_text,
        font_textsize,
        font_type,
        onSuccess,
        onError
      ) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          '=======createTextDrawDataElement======='
        );

        if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
          respError.msg = 'not in room.';
          if (onError != null) {
            onError(respError);
          }
          return false;
        }

        if (
          !(YTX_WBSS_KERNEL.drawContext.drawToolStatus =
            YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL && ///< 字体
            YTX_WBSS_KERNEL.drawContext.drawShapeType == YTX_WBSS_API._shapeType.FONT)
        ) {
          var respError = {};
          respError.code = YTX_WBSS_KERNEL._errcode._DRAW_STATUS_ERROR;
          respError.msg = 'draw status is error.';
          if (onError != null) {
            onError(respError);
          }
          return false;
        }

        // 获取当前页对象
        var room_id = YTX_WBSS_KERNEL.getCurRoomId();
        var doc_id = YTX_WBSS_KERNEL.getCurDocId();
        var page_index = YTX_WBSS_KERNEL.getCurPageIndex();
        var curPageInfo = YTX_WBSS_KERNEL.getCurrentPageInfo();
        if (
          font_pos != null &&
          font_text != null &&
          font_textsize != null &&
          font_type != null &&
          curPageInfo != null &&
          font_pos.x != null &&
          font_pos.y != null &&
          font_text.length > 0 &&
          font_textsize > 0
        ) {
          // 位置校验
          var canvas_x = font_pos.x;
          var canvas_y = font_pos.y;
          if (
            canvas_x >= curPageInfo.last_draw_space_fromX &&
            canvas_x <= curPageInfo.last_draw_space_fromX + curPageInfo.last_draw_space_width &&
            canvas_y >= curPageInfo.last_draw_space_fromY &&
            canvas_y <= curPageInfo.last_draw_space_fromY + curPageInfo.last_draw_space_height
          ) {
            // 保存缓存坐标
            var screen_coordinate_array = [];
            screen_coordinate_array.push({ x: canvas_x, y: canvas_y });
            var world_coordinate_array = [];
            YTX_WBSS_KERNEL.CANVAS_MOD.screenToWorldCoors(
              world_coordinate_array,
              curPageInfo,
              screen_coordinate_array
            );
            if (world_coordinate_array.length > 0) {
              var coordinate_array = [];
              coordinate_array.push(world_coordinate_array[0].x);
              coordinate_array.push(world_coordinate_array[0].y);

              // 生成DrawID
              var nowTimeStampMS = new Date().getTime();
              var nowTimeStampSecondString = parseInt(nowTimeStampMS / 1000);
              var draw_id =
                room_id.toString() +
                '-' +
                doc_id.toString() +
                '-' +
                page_index.toString() +
                '-' +
                YTX_WBSS_KERNEL.allRoomInfoMap[room_id].docInfoMap[doc_id].pageInfoArray[
                  page_index - 1
                ].drawIDSeedNumber++ +
                '-' +
                YTX_WBSS_KERNEL._userId +
                '-' +
                nowTimeStampSecondString;

              // 创建服务器端draw_data_object对象
              var current_draw_data_object = new Object();
              current_draw_data_object['drawID'] = draw_id;
              current_draw_data_object['docID'] = doc_id;
              current_draw_data_object['pageIndex'] = page_index.toString(); ///< Warn：服务器视此对象为字符串，否正解析失败
              current_draw_data_object['coordinates'] = coordinate_array;
              current_draw_data_object['color'] = YTX_WBSS_KERNEL.drawContext.lineColor;
              current_draw_data_object['lineStyle'] = 'LINE_FULL';
              current_draw_data_object['shapeType'] = YTX_WBSS_KERNEL.drawContext.drawShapeType;
              current_draw_data_object['isFinal'] = true;
              current_draw_data_object['lineSize'] =
                font_textsize > 0 ? font_textsize : YTX_WBSS_KERNEL.drawContext.lineSize;
              current_draw_data_object['isFill'] = false;
              current_draw_data_object['drawAreaWidth'] = Math.round(
                curPageInfo.last_draw_space_width
              );
              current_draw_data_object['drawAreaHeight'] = Math.round(
                curPageInfo.last_draw_space_height
              );
              current_draw_data_object['fontText'] = font_text;
              current_draw_data_object['fontType'] = 'wbss_fangzheng_font.ttf'; // 目前只支持一种字体
              current_draw_data_object['fontSize'] = font_textsize;

              if (YTX_WBSS_KERNEL.drawContext.isEraser) {
                current_draw_data_object.color = -1;
              }
              // 创建对象
              var send_msg_max_fps = 30.0;
              YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject =
                new YTX_WBSS_KERNEL.drawContext.createCurrentDrawDataElementObject(
                  room_id,
                  doc_id,
                  page_index,
                  current_draw_data_object,
                  nowTimeStampMS,
                  send_msg_max_fps
                );
              if (YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null) {
                // 发送渲染消息
                var sendStr = YTX_WBSS_KERNEL._protobuf._buildDrawData(
                  YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject.draw_data_obj
                );
                if (sendStr != null && sendStr.length > 0) {
                  YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);

                  // 返回信息
                  var respSuccess = {};
                  respSuccess.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
                  respSuccess.msg = 'Success.';
                  respSuccess.drawID = draw_id;
                  if (onSuccess != null) {
                    onSuccess(respSuccess);
                  }
                  return true;
                }
              } //if(YTX_WBSS_KERNEL.drawContext.currentDrawDataElementObject != null)
            } //if(world_coordinate_array.length > 0)
          }
        }

        // 返回错误信息
        var resp = {};
        resp.code = YTX_WBSS_KERNEL._errcode._INVALID_PARAM;
        resp.msg = 'not in room.';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'param or status error');
        if (onError != null) {
          onError(resp);
        }
        return false;
      },
    },

    // ============  wbss kernel canvas =================

    canvas_html_handle: null,
    canvas_image_handle: null,
    isRegisterMouserEvent: false,
    CANVAS_MOD: {
      // ============  wbss kernel canvas Mouse Event =================

      //鼠标事件状态
      MOUSE_EVENT_STATUS: {
        MOUSE_EVENT_STATUS_NONE: 0,
        MOUSE_EVENT_STATUS_DOWN: 1,
        MOUSE_EVENT_STATUS_MOVE: 2,
        MOUSE_EVENT_STATUS_UP: 3,
        MOUSE_EVENT_STATUS_LEAVE: 4,
      },
      MOUSE_EVENT_KEY: {
        MOUSE_EVENT_KEY_NONE: 0,
        MOUSE_EVENT_KEY_LEFT: 1, ///< 鼠标左键
        MOUSE_EVENT_KEY_MIDDLE: 2, ///< 鼠标中键
        MOUSE_EVENT_KEY_RIGHT: 3, ///< 鼠标右键
      },

      registerMouseEvent: function () {
        if (YTX_WBSS_KERNEL.isRegisterMouserEvent == false) {
          YTX_WBSS_KERNEL.isRegisterMouserEvent = true;
          YTX_WBSS_KERNEL.canvas_html_handle.addEventListener(
            'mousedown',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseDown,
            false
          );
          YTX_WBSS_KERNEL.canvas_html_handle.addEventListener(
            'mousemove',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseMove,
            false
          );
          YTX_WBSS_KERNEL.canvas_html_handle.addEventListener(
            'mouseup',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseUp,
            false
          );
          YTX_WBSS_KERNEL.canvas_html_handle.addEventListener(
            'mouseleave',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseLeave,
            false
          );
          $(window).resize(YTX_WBSS_KERNEL.updateDrawScreen);
        }
      },

      removeMouseEvent: function () {
        if (YTX_WBSS_KERNEL.isRegisterMouserEvent == true) {
          YTX_WBSS_KERNEL.canvas_html_handle.removeEventListener(
            'mousedown',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseDown,
            false
          );
          YTX_WBSS_KERNEL.canvas_html_handle.removeEventListener(
            'mousemove',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseMove,
            false
          );
          YTX_WBSS_KERNEL.canvas_html_handle.removeEventListener(
            'mouseup',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseUp,
            false
          );
          YTX_WBSS_KERNEL.canvas_html_handle.removeEventListener(
            'mouseleave',
            YTX_WBSS_KERNEL.CANVAS_MOD.doMouseLeave,
            false
          );
          YTX_WBSS_KERNEL.isRegisterMouserEvent = false;
        }
      },

      isRegisterMouseEvent: function () {
        return YTX_WBSS_KERNEL.isRegisterMouserEvent;
      },

      // 鼠标事件处理
      doMouseEventProc: function (mouseEventStatus, event) {
        // 获取当前页对象
        var current_draw_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(false);
        if (current_draw_page_info != null) {
          // fix canvas 没有加载上来，width、height属性问题
          if (
            current_draw_page_info.last_canvas_height == 0 ||
            current_draw_page_info.last_canvas_height == 0
          ) {
            if (YTX_WBSS_KERNEL.canvas_html_handle != null) {
              var canvas_context = YTX_WBSS_KERNEL.canvas_html_handle.getContext('2d');
              if (canvas_context != null) {
                // 参数信息
                var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
                var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
                var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();
                var current_room_info = YTX_WBSS_KERNEL.getCurrentRoomInfo(false);
                var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo(false);

                if (
                  current_room_id != null &&
                  current_doc_id != null &&
                  current_page_index != null &&
                  current_room_info != null &&
                  current_doc_info != null
                ) {
                  // 更新画布布局信息（需要使用白板和文档的比例，适应canvas的大小改变，使用缩放比例）
                  var isChangedDrawSpaceRect = false;
                  isChangedDrawSpaceRect = YTX_WBSS_KERNEL.CANVAS_MOD.updateDrawClientRect(
                    canvas_context,
                    current_room_id,
                    current_doc_id,
                    current_page_index,
                    current_room_info,
                    current_doc_info,
                    current_draw_page_info
                  );
                  if (isChangedDrawSpaceRect) {
                    current_draw_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(false);
                  }
                }
              }
            }
          }

          // 获取mouse在canvas的相对坐标
          var mouse_event_obj = YTX_WBSS_KERNEL.CANVAS_MOD.getPointOnCanvas(
            current_draw_page_info,
            event
          );
          if (mouse_event_obj != null) {
            // 输出日志
            if (YTX_WBSS_KERNEL.isShowDebugMouseEventCoors) {
              YTX_WBSS_KERNEL._log(
                mouse_event_obj.isInCanvasRect
                  ? YTX_WBSS_KERNEL._logLev._DEBUG
                  : YTX_WBSS_KERNEL._logLev._WARN,
                'mouse ' +
                  YTX_WBSS_KERNEL.CANVAS_MOD.getMouseEventStatusNameString(mouseEventStatus) +
                  ' at point( x:' +
                  mouse_event_obj.x +
                  ', y:' +
                  mouse_event_obj.y +
                  ') inRect=' +
                  mouse_event_obj.isInCanvasRect
              );
            }

            // 事件处理
            switch (mouseEventStatus) {
              case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_DOWN:
                {
                  if (
                    mouse_event_obj.buttonKey ==
                    YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_KEY.MOUSE_EVENT_KEY_LEFT
                  ) {
                    if (mouse_event_obj.isInCanvasRect == true) {
                      var room_id = YTX_WBSS_KERNEL.getCurRoomId();
                      var doc_id = YTX_WBSS_KERNEL.getCurDocId();
                      var page_index = YTX_WBSS_KERNEL.getCurPageIndex();
                      YTX_WBSS_KERNEL.drawContext.startCurrentDrawDataElement(
                        room_id,
                        doc_id,
                        page_index,
                        mouse_event_obj
                      );
                    }
                  }
                }
                break;
              case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_MOVE:
                {
                  if (mouse_event_obj.isInCanvasRect == false) {
                    YTX_WBSS_KERNEL.drawContext.endCurrentDrawDataElement(mouse_event_obj); // mouse_event_obj or null
                  } else {
                    YTX_WBSS_KERNEL.drawContext.updateCurrentDrawDataElement(mouse_event_obj);
                  }
                }
                break;
              case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_UP:
                {
                  if (
                    mouse_event_obj.buttonKey ==
                      YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_KEY.MOUSE_EVENT_KEY_NONE ||
                    mouse_event_obj.buttonKey ==
                      YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_KEY.MOUSE_EVENT_KEY_LEFT
                  ) {
                    YTX_WBSS_KERNEL.drawContext.endCurrentDrawDataElement(mouse_event_obj); // mouse_event_obj or null
                  }
                }
                break;
              case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_LEAVE:
                {
                  YTX_WBSS_KERNEL.drawContext.endCurrentDrawDataElement(null);
                }
                break;
            }
          } //if(mouse_event_obj != null)
        } //if (current_draw_page_info != null)
      },

      // 鼠标按下
      doMouseDown: function (event) {
        if (YTX_WBSS_KERNEL.isRegisterMouserEvent == true) {
          YTX_WBSS_KERNEL.CANVAS_MOD.doMouseEventProc(
            YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_DOWN,
            event
          );
        }
      },

      // 鼠标移动
      doMouseMove: function (event) {
        if (YTX_WBSS_KERNEL.isRegisterMouserEvent == true) {
          YTX_WBSS_KERNEL.CANVAS_MOD.doMouseEventProc(
            YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_MOVE,
            event
          );
        }
      },

      // 鼠标弹起
      doMouseUp: function (event) {
        if (YTX_WBSS_KERNEL.isRegisterMouserEvent == true) {
          YTX_WBSS_KERNEL.CANVAS_MOD.doMouseEventProc(
            YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_UP,
            event
          );
        }
      },

      // 鼠标离开
      doMouseLeave: function (event) {
        if (YTX_WBSS_KERNEL.isRegisterMouserEvent == true) {
          YTX_WBSS_KERNEL.CANVAS_MOD.doMouseEventProc(
            YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_LEAVE,
            event
          );
        }
      },

      // 返回鼠标事件名称
      getMouseEventStatusNameString: function (mouseEventStatus) {
        var getMouseEventStatusNameString = '';
        switch (mouseEventStatus) {
          case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_DOWN:
            {
              getMouseEventStatusNameString = 'down';
            }
            break;
          case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_MOVE:
            {
              getMouseEventStatusNameString = 'move';
            }
            break;
          case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_UP:
            {
              getMouseEventStatusNameString = 'up';
            }
            break;
          case YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_STATUS.MOUSE_EVENT_STATUS_LEAVE:
            {
              getMouseEventStatusNameString = 'leave';
            }
            break;
        }
        return getMouseEventStatusNameString;
      },

      // 获取canvas相对坐标 return isInCanvasRect: true is in Rect，false is not in Rect.
      getPointOnCanvas: function (page_info, event) {
        // 需要返回的数据
        var mouse_canvas_fromX = -1;
        var mouse_canvas_fromY = -1;
        var mouse_button_key_value =
          YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_KEY.MOUSE_EVENT_KEY_NONE;
        var local_isInCanvasRect = true;

        // 获取相对坐标信息
        if (event.offsetX != null && event.offsetY != null) {
          mouse_canvas_fromX = event.offsetX;
          mouse_canvas_fromY = event.offsetY;
        } else {
          if (event.layerX != null && event.layerY != null) {
            mouse_canvas_fromX = event.layerX;
            mouse_canvas_fromY = event.layerY;
          } else {
            local_isInCanvasRect = false;
          }
        }

        // 处理坐标限定条件
        var limit_min_formX = 0;
        var limit_max_formX = 0;
        var limit_min_formY = 0;
        var limit_max_formY = 0;
        if (page_info != null) {
          limit_min_formX = page_info.last_draw_space_fromX;
          limit_max_formX = page_info.last_draw_space_fromX + page_info.last_draw_space_width;
          limit_min_formY = page_info.last_draw_space_fromY;
          limit_max_formY = page_info.last_draw_space_fromY + page_info.last_draw_space_height;
        } else {
          if (YTX_WBSS_KERNEL.canvas_html_handle != null) {
            limit_min_formX = 0;
            limit_max_formX = YTX_WBSS_KERNEL.canvas_html_handle.width;
            limit_min_formY = 0;
            limit_max_formY = YTX_WBSS_KERNEL.canvas_html_handle.height;
          } else {
            YTX_WBSS_KERNEL._log(
              YTX_WBSS_KERNEL._logLev._WARN,
              'getPointOnCanvas is unknow limit condition!'
            );
            return null;
          }
        }

        // 过滤错误的，鼠标坐标信息
        if (mouse_canvas_fromX < limit_min_formX) {
          mouse_canvas_fromX = limit_min_formX;
          local_isInCanvasRect = false;
        }
        if (mouse_canvas_fromY < limit_min_formY) {
          mouse_canvas_fromY = limit_min_formY;
          local_isInCanvasRect = false;
        }
        if (mouse_canvas_fromX > limit_max_formX) {
          mouse_canvas_fromX = limit_max_formX;
          local_isInCanvasRect = false;
        }
        if (mouse_canvas_fromY > limit_max_formY) {
          mouse_canvas_fromY = limit_max_formY;
          local_isInCanvasRect = false;
        }

        ///< IE6-8：1 规定鼠标左键 4 规定鼠标中键 2 规定鼠标右键
        ///< IE9+：0 规定鼠标左键 1 规定鼠标中键 2 规定鼠标右键
        ///< chrome：0 规定鼠标左键 1 规定鼠标中键 2 规定鼠标右键
        ///< firefox：0 规定鼠标左键 1 规定鼠标中键 2 规定鼠标右键
        if (event.buttons != null && event.button != null) {
          if (event.buttons > 0) {
            switch (event.button) {
              case 0:
                {
                  mouse_button_key_value =
                    YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_KEY.MOUSE_EVENT_KEY_LEFT;
                }
                break;
              case 1:
                {
                  mouse_button_key_value =
                    YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_KEY.MOUSE_EVENT_KEY_MIDDLE;
                }
                break;
              case 2:
                {
                  mouse_button_key_value =
                    YTX_WBSS_KERNEL.CANVAS_MOD.MOUSE_EVENT_KEY.MOUSE_EVENT_KEY_RIGHT;
                }
                break;
            }
          }
        }

        return {
          x: mouse_canvas_fromX,
          y: mouse_canvas_fromY,
          buttonKey: mouse_button_key_value,
          isInCanvasRect: local_isInCanvasRect,
        };
      },

      // 画布相对坐标转换世界坐标
      screenToWorldCoors: function (dst_coors, page_info, src_coors) {
        for (var i = 0; i < src_coors.length; i++) {
          var dst_coor_x = src_coors[i].x - page_info.last_draw_space_fromX;
          var dst_coor_y = src_coors[i].y - page_info.last_draw_space_fromY;
          dst_coor_x = (2.0 * dst_coor_x) / page_info.last_draw_space_width - 1.0;
          dst_coor_y = 1.0 - (2.0 * dst_coor_y) / page_info.last_draw_space_height;
          dst_coor_x = Math.round(1000000 * dst_coor_x) / 1000000; ///< .toFixed(6) or Math.round 精度控制，主要影响坐标保存信息
          dst_coor_y = Math.round(1000000 * dst_coor_y) / 1000000; ///< .toFixed(6) or Math.round 精度控制，主要影响坐标保存信息
          dst_coors.push({ x: dst_coor_x, y: dst_coor_y });
        }
      },

      // 世界坐标转换画布相对坐标
      worldToScreenCoors: function (dst_coors, page_info, src_coors) {
        for (var i = 0; i < src_coors.length; i++) {
          var dst_coor_x = ((src_coors[i].x + 1.0) * page_info.last_draw_space_width) / 2.0;
          var dst_coor_y = ((1.0 - src_coors[i].y) * page_info.last_draw_space_height) / 2.0;
          dst_coor_x += page_info.last_draw_space_fromX;
          dst_coor_y += page_info.last_draw_space_fromY;
          dst_coor_x = Math.round(1000000 * dst_coor_x) / 1000000; ///< .toFixed(6) or Math.round 精度控制，保存画板最后的整型坐标
          dst_coor_y = Math.round(1000000 * dst_coor_y) / 1000000; ///< .toFixed(6) or Math.round 精度控制，保存画板最后的整型坐标
          dst_coors.push({ x: dst_coor_x, y: dst_coor_y });
        }
      },

      // 打印坐标数组
      printCoordinates: function (tag, coordinates) {
        var strLog = tag;
        strLog += '[';
        for (var i = 0; i < coordinates.length; i++) {
          strLog += '(';
          strLog += +coordinates[i].x;
          strLog += ',';
          strLog += +coordinates[i].y;
          strLog += ')';
        }
        strLog += ']';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._TRACE, strLog);
      },

      // 放大缩小宽度
      getZoomWidth: function (lineWidth, drawAreadWidth, curViewWidth) {
        if (drawAreadWidth <= 0 || curViewWidth <= 0) {
          return lineWidth;
        }
        var w = Math.round(lineWidth * ((1.0 * curViewWidth) / drawAreadWidth));
        if (w < 1) {
          w = 1;
        }
        return lineWidth;
      },

      // 黑色 ColorFormat "rgba(0, 0, 0, 255)"
      ParseColorIntToRgbaString: function (colorInt) {
        var r = (colorInt >> 24) & 0xff;
        var g = (colorInt >> 16) & 0xff;
        var b = (colorInt >> 8) & 0xff;
        var a = ((colorInt >> 0) & 0xff) / 255.0;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      },

      // 黑色 ColorFormat "#000000FF"
      ParseColorIntTo16String: function (colorInt) {
        var r = ((colorInt >> 24) & 0xff).toString('16');
        var g = ((colorInt >> 16) & 0xff).toString('16');
        var b = ((colorInt >> 8) & 0xff).toString('16');
        var a = ((colorInt >> 0) & 0xff).toString('16');
        return (
          '#' +
          YTX_WBSS_KERNEL.CANVAS_MOD.colorChannelHexStringFormat(r) +
          YTX_WBSS_KERNEL.CANVAS_MOD.colorChannelHexStringFormat(g) +
          YTX_WBSS_KERNEL.CANVAS_MOD.colorChannelHexStringFormat(b) +
          YTX_WBSS_KERNEL.CANVAS_MOD.colorChannelHexStringFormat(a)
        );
      },
      colorChannelHexStringFormat: function (colorChannelHexString) {
        return colorChannelHexString.length == 2
          ? colorChannelHexString
          : '0' + colorChannelHexString;
      },

      clearCanvasDrawSpace: function (canvas_context, current_page_info) {
        // 清空画布所有信息
        canvas_context.clearRect(
          0,
          0,
          current_page_info.last_canvas_width,
          current_page_info.last_canvas_height
        );

        // 绘制Canvas可画区域的背景
        if (current_page_info.last_image_width == 0 && current_page_info.last_image_height == 0) {
          canvas_context.fillStyle = YTX_WBSS_KERNEL.drawContext.color_whiteboard_view_bg;
          canvas_context.fillRect(
            current_page_info.last_draw_space_fromX,
            current_page_info.last_draw_space_fromY,
            current_page_info.last_draw_space_width,
            current_page_info.last_draw_space_height
          );
        } else {
          var isDrawBgImgSucces = false;
          var img_filename = current_page_info.getPageFileName();
          if (img_filename != null) {
            var currentImageDataInfo = YTX_WBSS_KERNEL.syncGetLocalDataBaseItem(img_filename);
            if (currentImageDataInfo != null) {
              // 图片背景
              canvas_context.fillStyle = YTX_WBSS_KERNEL.drawContext.color_doc_img_view_bg;
              canvas_context.fillRect(
                current_page_info.last_draw_space_fromX,
                current_page_info.last_draw_space_fromY,
                current_page_info.last_draw_space_width,
                current_page_info.last_draw_space_height
              );
              // 绘制图片
              var canvas_image = YTX_WBSS_KERNEL.canvas_image_handle.getContext('2d');
              canvas_context.clearRect(
                0,
                0,
                current_page_info.last_canvas_width,
                current_page_info.last_canvas_height
              );
              canvas_context.drawImage(
                currentImageDataInfo.image_object,
                0,
                0,
                currentImageDataInfo.image_width,
                currentImageDataInfo.image_height,
                current_page_info.last_draw_space_fromX,
                current_page_info.last_draw_space_fromY,
                current_page_info.last_draw_space_width,
                current_page_info.last_draw_space_height
              );
              canvas_image.drawImage(
                currentImageDataInfo.image_object,
                0,
                0,
                currentImageDataInfo.image_width,
                currentImageDataInfo.image_height,
                current_page_info.last_draw_space_fromX,
                current_page_info.last_draw_space_fromY,
                current_page_info.last_draw_space_width,
                current_page_info.last_draw_space_height
              );
              isDrawBgImgSucces = true;
            } //if(currentImageDataInfo != null)
          }
          if (isDrawBgImgSucces == false) {
            // 背景
            canvas_context.fillStyle = YTX_WBSS_KERNEL.drawContext.color_doc_img_view_bg;
            canvas_context.fillRect(
              current_page_info.last_draw_space_fromX,
              current_page_info.last_draw_space_fromY,
              current_page_info.last_draw_space_width,
              current_page_info.last_draw_space_height
            );
          }
        }

        // 设置canvas边框，要最后绘制
        if (YTX_WBSS_KERNEL.drawContext.canvas_frame_bg_linesize > 0) {
          canvas_context.strokeStyle = YTX_WBSS_KERNEL.drawContext.canvas_frame_bg_color;
          canvas_context.lineWidth = YTX_WBSS_KERNEL.drawContext.canvas_frame_bg_linesize; //设置边框线框
          canvas_context.strokeRect(
            0,
            0,
            current_page_info.last_canvas_width,
            current_page_info.last_canvas_height
          );
        }
      },

      // ============  wbss kernel canvas Draw Screen =================

      // 更新画布布局信息
      updateDrawClientRect: function (
        canvas_context,
        current_room_id,
        current_doc_id,
        current_page_index,
        current_room_info,
        current_doc_info,
        current_page_info
      ) {
        // 获取当前，布局初始化参数
        var canvas_client_rect_info = YTX_WBSS_KERNEL.canvas_html_handle.getBoundingClientRect();
        var current_canvas_width = canvas_client_rect_info.width;
        var current_canvas_height = canvas_client_rect_info.height;
        if (current_canvas_width > 0 && current_canvas_height > 0) {
          if (
            current_canvas_width != YTX_WBSS_KERNEL.canvas_html_handle.width ||
            current_canvas_height != YTX_WBSS_KERNEL.canvas_html_handle.height
          ) {
            // 强制同步width、height大小和Client的width、height大小相同，防止绘图区域被强制放大缩小
            YTX_WBSS_KERNEL.canvas_html_handle.setAttribute('width', current_canvas_width);
            YTX_WBSS_KERNEL.canvas_html_handle.setAttribute('height', current_canvas_height);
          }
        }
        var current_draw_space_ratio = 0;
        var current_draw_space_ifSacle = YTX_WBSS_KERNEL.drawContext.wb_ifSacle;
        if (current_doc_id == 0) {
          current_draw_space_ratio = YTX_WBSS_KERNEL.drawContext.wbRatio;
        } else {
          if (current_page_info.last_image_width > 0 && current_page_info.last_image_height > 0) {
            current_draw_space_ratio =
              (1.0 * current_page_info.last_image_width) / current_page_info.last_image_height;
          }
        }

        //Canvas大小、缩放比例，画布比例有变化时，更新画布布局
        if (
          current_page_info.last_draw_space_ratio != current_draw_space_ratio ||
          current_page_info.last_draw_space_ifSacle != current_draw_space_ifSacle ||
          current_page_info.last_canvas_width != current_canvas_width ||
          current_page_info.last_canvas_height != current_canvas_height
        ) {
          // Show Log
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._DEBUG,
            'updateDrawClientRect doc_id=' +
              current_doc_id +
              ' pageindex=' +
              current_page_index +
              ' width=' +
              current_canvas_width +
              ' height=' +
              current_canvas_height +
              ' ratio=' +
              current_draw_space_ratio +
              ' scale=' +
              current_draw_space_ifSacle
          );

          // 最后保存的canvas信息
          YTX_WBSS_KERNEL.setDrawSpaceInfo(
            current_room_id,
            current_doc_id,
            current_page_index,
            current_canvas_width,
            current_canvas_height,
            current_draw_space_ratio,
            current_draw_space_ifSacle
          );

          return true;
        } else {
          return false;
        }
      },

      // 渲染 return true is draw screen succes
      drawScreen: function () {
        //如果没有登陆默认清空
        if (YTX_WBSS_KERNEL.isLoginInRoomServer == false) {
          if (YTX_WBSS_KERNEL.canvas_html_handle != null) {
            // 获取当前，布局初始化参数
            var canvas_client_rect_info =
              YTX_WBSS_KERNEL.canvas_html_handle.getBoundingClientRect();
            var current_canvas_width = canvas_client_rect_info.width;
            var current_canvas_height = canvas_client_rect_info.height;
            if (current_canvas_width > 0 && current_canvas_height > 0) {
              if (
                current_canvas_width != YTX_WBSS_KERNEL.canvas_html_handle.width ||
                current_canvas_height != YTX_WBSS_KERNEL.canvas_html_handle.height
              ) {
                // 强制同步width、height大小和Client的width、height大小相同，防止绘图区域被强制放大缩小
                YTX_WBSS_KERNEL.canvas_html_handle.setAttribute('width', current_canvas_width);
                YTX_WBSS_KERNEL.canvas_html_handle.setAttribute('height', current_canvas_height);
                YTX_WBSS_KERNEL.canvas_image_handle.setAttribute('width', current_canvas_width);
                YTX_WBSS_KERNEL.canvas_image_handle.setAttribute('height', current_canvas_height);
              }

              // 清空画布所有信息
              var canvas_context = YTX_WBSS_KERNEL.canvas_html_handle.getContext('2d');
              if (canvas_context != null) {
                canvas_context.clearRect(0, 0, current_canvas_width, current_canvas_height);
              }
              canvas_context = null;
            } //if(current_canvas_width > 0 && current_canvas_height > 0)
            return true;
          } //if(YTX_WBSS_KERNEL.canvas_html_handle != null)
          return false;
        }

        // 页面信息
        var current_room_id = YTX_WBSS_KERNEL.getCurRoomId();
        var current_doc_id = YTX_WBSS_KERNEL.getCurDocId();
        var current_page_index = YTX_WBSS_KERNEL.getCurPageIndex();
        var current_room_info = YTX_WBSS_KERNEL.getCurrentRoomInfo(true);
        var current_doc_info = YTX_WBSS_KERNEL.getCurrentDocInfo(true);
        var current_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(true);

        // 获取当前页信息
        if (current_room_info == null || current_doc_info == null || current_page_info == null) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._WARN,
            'drawScreen the room、doc、page info is null'
          );
          return false;
        }

        // 获取CanvasContext
        if (YTX_WBSS_KERNEL.canvas_html_handle == null) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._WARN,
            'drawScreen the canvas_html_handle is null'
          );
          return false;
        }
        var canvas_context = YTX_WBSS_KERNEL.canvas_html_handle.getContext('2d');
        if (canvas_context == null) {
          YTX_WBSS_KERNEL._log(
            YTX_WBSS_KERNEL._logLev._WARN,
            'drawScreen the canvas_context is null'
          );
          return false;
        }

        // 统计信息
        YTX_WBSS_KERNEL.drawContext.drawCountTotalNumber++;

        // 更新画布布局信息（需要使用白板和文档的比例，适应canvas的大小改变，使用缩放比例）
        var isChangedDrawSpaceRect = false;
        isChangedDrawSpaceRect = YTX_WBSS_KERNEL.CANVAS_MOD.updateDrawClientRect(
          canvas_context,
          current_room_id,
          current_doc_id,
          current_page_index,
          current_room_info,
          current_doc_info,
          current_page_info
        );

        // 清除过去数据，刷新界面
        current_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(true);
        YTX_WBSS_KERNEL.CANVAS_MOD.clearCanvasDrawSpace(canvas_context, current_page_info);

        // 设置裁剪
        // canvas_context.save();

        // 激光笔暂存数组
        var laserPenDrawDataElementIndexArray = [];

        // 显示白板
        var draw_element_num = 0;
        for (var i = 0; i < current_page_info.drawDataElementArray.length; i++) {
          // 绘图元素数据
          var draw_data_element = current_page_info.drawDataElementArray[i];

          // 数据过滤
          if (
            draw_data_element == null ||
            draw_data_element._isValid == false ||
            draw_data_element._isUndo == true
          ) {
            continue;
          }

          // 世界坐标转换相对canvas坐标
          var draw_space_in_coordinate_array = [];
          YTX_WBSS_KERNEL.CANVAS_MOD.worldToScreenCoors(
            draw_space_in_coordinate_array,
            current_page_info,
            draw_data_element._coordinate_array
          );

          // 设置线宽
          canvas_context.lineWidth = YTX_WBSS_KERNEL.CANVAS_MOD.getZoomWidth(
            draw_data_element._lineSize,
            draw_data_element._drawAreaWidth,
            current_page_info.last_draw_space_width
          );

          // 获取颜色
          var current_color_hex_string = YTX_WBSS_KERNEL.CANVAS_MOD.ParseColorIntTo16String(
            draw_data_element._element_color_num
          );
          var current_color_rgba_string = YTX_WBSS_KERNEL.CANVAS_MOD.ParseColorIntToRgbaString(
            draw_data_element._element_color_num
          );

          // 线条交会时，原角效果
          if (canvas_context.lineJoin != 'round') {
            canvas_context.lineJoin = 'round';
          }

          // 绘图元素处理
          switch (draw_data_element._shapeType) {
            case YTX_WBSS_API._shapeType.FREELINE:
              {
                var isEraser =
                  draw_data_element._element_color_num == -1 ||
                  draw_data_element._element_color_num == 0;
                if (draw_space_in_coordinate_array.length >= 2) {
                  canvas_context.beginPath();
                  if (current_color_hex_string != null) {
                    canvas_context.strokeStyle = current_color_hex_string;
                  }
                  var cur_x = -1;
                  var cur_y = -1;
                  var last_x = -1;
                  var last_y = -1;
                  for (var j = 0; j < draw_space_in_coordinate_array.length; j++) {
                    var cur_x = draw_space_in_coordinate_array[j].x;
                    var cur_y = draw_space_in_coordinate_array[j].y;
                    if (cur_x != last_x && cur_y != last_y) {
                      ///< 防止重复坐标
                      if (isEraser) {
                        var ctx = YTX_WBSS_KERNEL.canvas_image_handle.getContext('2d');
                        var imgWidth = canvas_context.lineWidth;
                        var imgX = cur_x - imgWidth / 2 < 0 ? 0 : cur_x - imgWidth / 2;
                        var imgY = cur_y - imgWidth / 2 < 0 ? 0 : cur_y - imgWidth / 2;
                        var imgData = ctx.getImageData(imgX, imgY, imgWidth, imgWidth);
                        canvas_context.putImageData(imgData, imgX, imgY);
                      } else {
                        canvas_context.lineTo(cur_x, cur_y);
                      }
                    }
                    last_x = cur_x;
                    last_y = cur_y;
                  } //for (var j = 0; j < draw_space_in_coordinate_array.length; j++)
                  canvas_context.stroke();
                  canvas_context.closePath();

                  draw_element_num++;
                } //if(draw_space_in_coordinate_array.length >= 2)
              }
              break;
            case YTX_WBSS_API._shapeType.LINE:
              {
                if (draw_space_in_coordinate_array.length >= 2) {
                  canvas_context.beginPath();
                  if (current_color_hex_string != null) {
                    canvas_context.strokeStyle = current_color_hex_string;
                  }
                  var cur_x = -1;
                  var cur_y = -1;
                  var last_x = -1;
                  var last_y = -1;
                  for (var j = 0; j < draw_space_in_coordinate_array.length; j++) {
                    var cur_x = draw_space_in_coordinate_array[j].x;
                    var cur_y = draw_space_in_coordinate_array[j].y;
                    if (cur_x != last_x && cur_y != last_y) {
                      ///< 防止重复坐标
                      if (j == 0) {
                        canvas_context.moveTo(cur_x, cur_y);
                      } else {
                        canvas_context.lineTo(cur_x, cur_y);
                      }
                    }
                    last_x = cur_x;
                    last_y = cur_y;
                  } //for (var j = 0; j < draw_space_in_coordinate_array.length; j++)
                  canvas_context.stroke();
                  canvas_context.closePath();

                  draw_element_num++;
                } //if(draw_space_in_coordinate_array.length >= 2)
              }
              break;
            case YTX_WBSS_API._shapeType.RECT:
              {
                if (draw_space_in_coordinate_array.length >= 2) {
                  canvas_context.beginPath();
                  if (draw_data_element._isFill) {
                    ///< 填充颜色
                    if (current_color_hex_string != null) {
                      canvas_context.fillStyle = current_color_hex_string;
                    }
                  } else {
                    ///< 连线颜色
                    if (current_color_hex_string != null) {
                      canvas_context.strokeStyle = current_color_hex_string;
                    }
                  }
                  var x1 = draw_space_in_coordinate_array[0].x;
                  var y1 = draw_space_in_coordinate_array[0].y;
                  var x2 = draw_space_in_coordinate_array[1].x;
                  var y2 = draw_space_in_coordinate_array[1].y;
                  var rect_x = 0;
                  var rect_y = 0;
                  var rect_w = 0;
                  var rect_h = 0;
                  if (x1 >= x2 && y1 >= y2) {
                    rect_x = x2;
                    rect_y = y2;
                    rect_w = x1 - x2;
                    rect_h = y1 - y2;
                  } else {
                    rect_x = x1;
                    rect_y = y1;
                    rect_w = x2 - x1;
                    rect_h = y2 - y1;
                  }
                  if (draw_data_element._isFill) {
                    canvas_context.fillRect(rect_x, rect_y, rect_w, rect_h); ///< 实心填充
                  } else {
                    canvas_context.strokeRect(rect_x, rect_y, rect_w, rect_h); ///< 外形连线
                  }
                  canvas_context.closePath();

                  draw_element_num++;
                } //if(draw_space_in_coordinate_array.length >= 2)
              }
              break;
            case YTX_WBSS_API._shapeType.TRIANGLE:
              {
                if (draw_space_in_coordinate_array.length >= 3) {
                  var pos_c_x =
                    2 * draw_space_in_coordinate_array[0].x - draw_space_in_coordinate_array[1].x;
                  var pos_c_y = draw_space_in_coordinate_array[1].y;
                  canvas_context.beginPath();
                  if (draw_data_element._isFill) {
                    ///< 填充颜色
                    if (current_color_hex_string != null) {
                      canvas_context.fillStyle = current_color_hex_string;
                    }
                  } else {
                    ///< 连线颜色
                    if (current_color_hex_string != null) {
                      canvas_context.strokeStyle = current_color_hex_string;
                    }
                  }
                  canvas_context.moveTo(
                    draw_space_in_coordinate_array[0].x,
                    draw_space_in_coordinate_array[0].y
                  );
                  canvas_context.lineTo(
                    draw_space_in_coordinate_array[1].x,
                    draw_space_in_coordinate_array[1].y
                  );
                  canvas_context.lineTo(pos_c_x, pos_c_y);
                  canvas_context.lineTo(
                    draw_space_in_coordinate_array[0].x,
                    draw_space_in_coordinate_array[0].y
                  );
                  if (draw_data_element._isFill) {
                    canvas_context.fill(); ///< 实心填充
                  } else {
                    canvas_context.stroke(); ///< 外形连线
                  }
                  canvas_context.closePath();

                  draw_element_num++;
                } //if(draw_space_in_coordinate_array.length >= 3)
              }
              break;
            case YTX_WBSS_API._shapeType.CIRCLE:
              {
                if (draw_space_in_coordinate_array.length >= 2) {
                  canvas_context.beginPath();
                  if (draw_data_element._isFill) {
                    ///< 填充颜色
                    if (current_color_hex_string != null) {
                      canvas_context.fillStyle = current_color_hex_string;
                    }
                  } else {
                    ///< 连线颜色
                    if (current_color_hex_string != null) {
                      canvas_context.strokeStyle = current_color_hex_string;
                    }
                  }
                  var circle_center_x =
                    (draw_space_in_coordinate_array[0].x + draw_space_in_coordinate_array[1].x) / 2;
                  var circle_center_y =
                    (draw_space_in_coordinate_array[0].y + draw_space_in_coordinate_array[1].y) / 2;
                  var circle_radius = YTX_WBSS_KERNEL.MathLib.twoPointsDistance(
                    { x: circle_center_x, y: circle_center_y },
                    draw_space_in_coordinate_array[0]
                  );
                  canvas_context.arc(
                    circle_center_x,
                    circle_center_y,
                    circle_radius,
                    0,
                    Math.PI * 2,
                    true
                  ); ///< arc方法参数：圆心X坐标，圆心Y坐标，半径，开始角度（弧度），结束角度弧度，是否按照顺时针画
                  if (draw_data_element._isFill) {
                    canvas_context.fill(); ///< 实心填充
                  } else {
                    canvas_context.stroke(); ///< 外形连线
                  }
                  canvas_context.closePath();

                  draw_element_num++;
                }
              }
              break;
            case YTX_WBSS_API._shapeType.ELLIPSE:
              {
                if (draw_space_in_coordinate_array.length >= 2) {
                  canvas_context.beginPath();
                  if (draw_data_element._isFill) {
                    ///< 填充颜色
                    if (current_color_hex_string != null) {
                      canvas_context.fillStyle = current_color_hex_string;
                    }
                  } else {
                    ///< 连线颜色
                    if (current_color_hex_string != null) {
                      canvas_context.strokeStyle = current_color_hex_string;
                    }
                  }
                  var ellipse_center_x =
                    (draw_space_in_coordinate_array[0].x + draw_space_in_coordinate_array[1].x) / 2;
                  var ellipse_center_y =
                    (draw_space_in_coordinate_array[0].y + draw_space_in_coordinate_array[1].y) / 2;
                  var ellipse_w_radius =
                    Math.abs(
                      draw_space_in_coordinate_array[1].x - draw_space_in_coordinate_array[0].x
                    ) / 2;
                  var ellipse_h_radius =
                    Math.abs(
                      draw_space_in_coordinate_array[1].y - draw_space_in_coordinate_array[0].y
                    ) / 2;
                  canvas_context.ellipse(
                    ellipse_center_x,
                    ellipse_center_y,
                    ellipse_w_radius,
                    ellipse_h_radius,
                    0,
                    0,
                    Math.PI * 2
                  );
                  if (draw_data_element._isFill) {
                    canvas_context.fill(); ///< 实心填充
                  } else {
                    canvas_context.stroke(); ///< 外形连线
                  }
                  canvas_context.closePath();

                  draw_element_num++;
                }
              }
              break;
            case YTX_WBSS_API._shapeType.LASERPEN:
              {
                laserPenDrawDataElementIndexArray.push(i);
              }
              break;
            case YTX_WBSS_API._shapeType.ARROWMARK:
              {
                //缩放
                //canvas_context.translate(draw_space_in_coordinate_array[0].x, draw_space_in_coordinate_array[0].y + 24);
                //canvas_context.scale(current_page_info.last_draw_space_width / draw_data_element._drawAreaWidth, current_page_info.last_draw_space_width / draw_data_element._drawAreaWidth);
              }
              break;
            case YTX_WBSS_API._shapeType.FONT:
              {
                if (draw_space_in_coordinate_array.length >= 1) {
                  canvas_context.beginPath();
                  var canvas_text_linesize = canvas_context.lineWidth;
                  var canvas_text = draw_data_element._textObj['fontText'];
                  var canvas_font = canvas_text_linesize.toString() + 'px Courier New';
                  canvas_context.font = canvas_font;
                  canvas_context.fillStyle = current_color_hex_string;
                  canvas_context.fillText(
                    canvas_text,
                    draw_space_in_coordinate_array[0].x,
                    draw_space_in_coordinate_array[0].y + canvas_text_linesize
                  );
                  canvas_context.closePath();

                  draw_element_num++;
                }
              }
              break;
          } //switch (draw_data_element._shapeType)
        } //for (var i = 0; i < current_page_info.drawDataElementArray.length; i++)

        // 绘制激光笔
        if (laserPenDrawDataElementIndexArray.length > 0) {
          // // 只保留最后激光笔，删除其他激光笔
          // while(laserPenDrawDataElementIndexArray.length > 1){
          //     var draw_data_element_index = laserPenDrawDataElementIndexArray[0];
          //     YTX_WBSS_KERNEL.allRoomInfoMap[current_room_id].docInfoMap[current_doc_id].pageInfoArray[current_page_index-1].drawDataElementArray.splice(draw_data_element_index, 1);
          //     laserPenDrawDataElementIndexArray.splice(0, 1);
          //     for(var i = 0; i < laserPenDrawDataElementIndexArray.length; i++){
          //         var adjust_index = laserPenDrawDataElementIndexArray[i];
          //         adjust_index--;
          //         laserPenDrawDataElementIndexArray[i] = adjust_index;
          //     }
          // }

          // 绘制
          if (laserPenDrawDataElementIndexArray.length > 0) {
            current_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo(true);
            for (var i = 0; i < laserPenDrawDataElementIndexArray.length; i++) {
              var draw_data_element_index = laserPenDrawDataElementIndexArray[i];
              var draw_data_element =
                current_page_info.drawDataElementArray[draw_data_element_index];
              if (draw_data_element != null) {
                // 世界坐标转换相对canvas坐标
                var draw_space_in_coordinate_array = [];
                YTX_WBSS_KERNEL.CANVAS_MOD.worldToScreenCoors(
                  draw_space_in_coordinate_array,
                  current_page_info,
                  draw_data_element._coordinate_array
                );

                // 设置线宽
                canvas_context.lineWidth = YTX_WBSS_KERNEL.CANVAS_MOD.getZoomWidth(
                  draw_data_element._lineSize,
                  draw_data_element._drawAreaWidth,
                  current_page_info.last_draw_space_width
                );

                // 获取颜色
                var current_color_hex_string = YTX_WBSS_KERNEL.CANVAS_MOD.ParseColorIntTo16String(
                  draw_data_element._element_color_num
                );
                var current_color_rgba_string =
                  YTX_WBSS_KERNEL.CANVAS_MOD.ParseColorIntToRgbaString(
                    draw_data_element._element_color_num
                  );

                // 根据坐标点绘制
                if (draw_space_in_coordinate_array.length > 0) {
                  canvas_context.beginPath();
                  // if(draw_data_element._isFill){      ///< 填充颜色
                  if (current_color_hex_string != null) {
                    canvas_context.fillStyle = current_color_hex_string;
                  }
                  // }
                  // else{                               ///< 连线颜色
                  //     if(current_color_hex_string != null){
                  //         canvas_context.strokeStyle = current_color_hex_string;
                  //     }
                  // }
                  var circle_radius = draw_data_element._lineSize;
                  if (circle_radius < 2) {
                    circle_radius = 2;
                  } else if (circle_radius > 10) {
                    circle_radius = 10;
                  }
                  canvas_context.arc(
                    draw_space_in_coordinate_array[0].x,
                    draw_space_in_coordinate_array[0].y,
                    circle_radius,
                    0,
                    Math.PI * 2,
                    true
                  );
                  // if(draw_data_element._isFill){
                  canvas_context.fill(); ///< 实心填充
                  // }else{
                  //     canvas_context.stroke();              ///< 外形连线
                  // }
                  canvas_context.closePath();

                  draw_element_num++;
                }
              } //if(draw_data_element != null)
            } //for(var i = 0; i < laserPenDrawDataElementIndexArray.length; i++)
          } //if(laserPenDrawDataElementIndexArray.length > 0)
        } //if(laserPenDrawDataElementIndexArray.length > 0)

        // 补充绘制Canvas不可画区域的专属背景
        if (current_page_info != null) {
          if (
            current_page_info.last_canvas_width > 0 &&
            current_page_info.last_canvas_height > 0 &&
            current_page_info.last_draw_space_width > 0 &&
            current_page_info.last_draw_space_height &&
            current_page_info.last_canvas_width >= current_page_info.last_draw_space_width &&
            current_page_info.last_canvas_height >= current_page_info.last_draw_space_height
          ) {
            var left_rect_x = 0;
            var left_rect_y = 0;
            var left_rect_w = 0;
            var left_rect_h = 0;
            var right_rect_x = 0;
            var right_rect_y = 0;
            var right_rect_w = 0;
            var right_rect_h = 0;
            if (
              current_page_info.last_canvas_width > current_page_info.last_draw_space_width &&
              current_page_info.last_canvas_height == current_page_info.last_draw_space_height
            ) {
              left_rect_w =
                (current_page_info.last_canvas_width - current_page_info.last_draw_space_width) / 2;
              left_rect_h = current_page_info.last_canvas_height;
              right_rect_x = left_rect_w + current_page_info.last_draw_space_width;
              right_rect_y = 0;
              right_rect_w = left_rect_w;
              right_rect_h = left_rect_h;
            } else if (
              current_page_info.last_canvas_width == current_page_info.last_draw_space_width &&
              current_page_info.last_canvas_height > current_page_info.last_draw_space_height
            ) {
              left_rect_w = current_page_info.last_canvas_width;
              left_rect_h =
                (current_page_info.last_canvas_height - current_page_info.last_draw_space_height) /
                2;
              right_rect_x = 0;
              right_rect_y = left_rect_h + current_page_info.last_draw_space_height;
              right_rect_w = left_rect_w;
              right_rect_h = left_rect_h;
            }

            if ((left_rect_w > 0 && left_rect_h > 0) || (right_rect_w > 0 && right_rect_h > 0)) {
              if (
                current_page_info.last_image_width == 0 &&
                current_page_info.last_image_height == 0
              ) {
                // 白板模式
                canvas_context.fillStyle =
                  YTX_WBSS_KERNEL.drawContext.color_whiteboard_undraw_area_bg;
              } else {
                // 图片模式
                canvas_context.fillStyle = YTX_WBSS_KERNEL.drawContext.color_doc_img_undraw_area_bg;
              }
              if (left_rect_w > 0 && left_rect_h > 0) {
                canvas_context.fillRect(left_rect_x, left_rect_y, left_rect_w, left_rect_h);
              }
              if (right_rect_w > 0 && right_rect_h > 0) {
                canvas_context.fillRect(right_rect_x, right_rect_y, right_rect_w, right_rect_h);
              }
            } //if((left_rect_w > 0 && left_rect_h > 0) || (right_rect_w > 0 && right_rect_h > 0))
          }
        } //if(current_page_info != null)

        // Show Log
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._DEBUG,
          'drawScreen(' +
            YTX_WBSS_KERNEL.drawContext.drawCountTotalNumber +
            ') ClientRectChanged=' +
            isChangedDrawSpaceRect +
            ' ' +
            current_page_info.drawDataElementArray.length +
            '/' +
            draw_element_num
        );

        // 解除裁剪测试
        // canvas_context.restore();

        // 绘制完成
        return true;
      }, //drawScreen: function()

      // 获取屏幕图片 img_type is "image/jpeg" or "image/png" or "image/webp"
      getScreenImage: function (img_type) {
        if (YTX_WBSS_KERNEL.canvas_html_handle != null) {
          if (img_type != null) {
            if (
              !(img_type == 'image/jpeg' || img_type == 'image/png' || img_type == 'image/webp')
            ) {
              img_type = null;
            }
          }
          if (img_type == null) {
            img_type = 'image/png';
          }
          var default_quality = 0.92; ///< from 0.0 to 1.0 is quality
          var img_blob_url = YTX_WBSS_KERNEL.canvas_html_handle.toDataURL(
            'image/jpeg',
            default_quality
          );
          return img_blob_url;
        }
        return null;
      },
    },
    //CANVAS_MOD

    // ============  wbss kernel error code =================

    _errcode: {
      _SUCCESS: 200,
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
      _NOT_SUPPORT_H5: 368511,
      _OBJECT_NOT_EXSIT: 368512,
      _SET_DATABASE_OBJECT_FAILED: 368513,
      _GET_DATABASE_OBJECT_FAILED: 368514,
      _ALREADY_IN_ROOM_ERROR: 368515,
      _DRAW_STATUS_ERROR: 368516,
      _ALREADY_FILE_UPLOAD_ERROR: 368517,
      _UPLOAD_COVERTING_STATUS: 368518,
      _UPLOAD_COVERTING_FAILED: 368519,
      _INDEX_DB_OPEN_ERROR: 368520,
      _INDEX_DB_CLOSE_ERROR: 368521,
      _INDEX_DB_TRANS_ERROR: 368522,
      _INDEX_DB_INDEX_ERROR: 368523,
      _INDEX_DB_GET_ERROR: 368524,
      _INDEX_DB_PUT_ERROR: 368525,
      _INDEX_DB_ADD_ERROR: 368526,
      _INDEX_DB_DELETE_ERROR: 368527,
    },

    _throwError: function (code, msg, onError) {
      var resp = {};
      resp.code = code;
      resp.msg = msg;
      if (onError) onError(resp);
    },

    // ============  wbss kernel proto buffer message type =================

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

    // ============  wbss kernel util =================

    util: {
      getWindowURL: function () {
        var url = window.URL || window.webkitURL || window.mozURL || window.msURL;
        return url;
      },
      getUserMedia: function () {
        var getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
        if (!!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia) {
          getUserMedia = navigator.mediaDevices.getUserMedia;
        } else if (typeof navigator !== 'undefined' && navigator.webkitGetUserMedia) {
          getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
        } else if (typeof navigator !== 'undefined' && navigator.mozGetUserMedia) {
          getUserMedia = navigator.mozGetUserMedia.bind(navigator);
        } else if (typeof navigator !== 'undefined' && navigator.getUserMedia) {
          getUserMedia = navigator.getUserMedia.bind(navigator);
        }
        return getUserMedia;
      },
      getPeerConnection: function () {
        var peerConnection =
          window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection ||
          window.msRTCPeerConnection;
        if (typeof RTCPeerConnection !== 'undefined') {
          peerConnection = RTCPeerConnection;
        } else if (typeof mozRTCPeerConnection !== 'undefined') {
          peerConnection = mozRTCPeerConnection;
        } else if (typeof webkitRTCPeerConnection !== 'undefined') {
          peerConnection = webkitRTCPeerConnection;
        }
        return peerConnection;
      },
      getSessionDescription: function () {
        var sessionDescription =
          window.RTCSessionDescription ||
          window.mozRTCSessionDescription ||
          window.webkitRTCSessionDescription ||
          window.msRTCSessionDescription;
        if (typeof RTCSessionDescription !== 'undefined') {
          sessionDescription = RTCSessionDescription;
        } else if (typeof mozRTCSessionDescription !== 'undefined') {
          sessionDescription = mozRTCSessionDescription;
        } else if (typeof webkitRTCSessionDescription !== 'undefined') {
          sessionDescription = webkitRTCSessionDescription;
        }
        return sessionDescription;
      },
      getBrowerPrefix: function () {
        return 'hidden' in document
          ? null
          : (function () {
              var r = null;
              ['webkit', 'moz', 'ms', 'o'].forEach(function (prefix) {
                if (prefix + 'Hidden' in document) {
                  return (r = prefix);
                }
              });
              return r;
            })();
      },
      checkWindowHidden: function () {
        var prefix = YTX_WBSS_KERNEL.util.getBrowerPrefix();
        if (!prefix) {
          return document['hidden'];
        }
        return document[prefix + 'Hidden'];
      },
      getWindowVisibleState: function () {
        var prefix = YTX_WBSS_KERNEL.util.getBrowerPrefix();
        if (!prefix) {
          return document['visibilityState'];
        }
        return document[prefix + 'VisibilityState'];
      },
      stopMediaStream: function (stream) {
        if (stream.getTracks()) {
          YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, 'stream.getTracks()');
          for (var track in stream.getTracks()) {
            stream.getTracks()[track].stop();
          }
        } else {
          stream.stop();
        }
      },
    },
  };

  window.addEventListener('load', eventWindowLoaded, false);

  window.onbeforeunload = function (event) {
    YTX_WBSS_API.release_WBSS_SDK();
  };

  function eventWindowLoaded() {
    YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, '=====eventWindowLoaded()=====');
  }

  // ============  YTX_WBSS_KERNEL 【End】=================

  // ============  wbss API【Start】=================

  window.YTX_WBSS_API = {
    // ============  wbss API Builder =================

    CreateRoomBuilder: function (roomType, password, memberLimit, roleId, conferenceId) {
      this._roomType = roomType != null ? roomType : 1; ///< 1是临时房间，2是永久房间
      this._password = password;
      this._memberLimit = memberLimit;
      this._appID = '';
      this._roleId = roleId; ///< Master
      this._wbCreateorScale = 0.0; ///< 白板的宽和高比例
      this._wbCreateorDevice = 3; ///< 白板发起者的设备 0 移动端 1 pc端 2 大屏设备 3 web创建
      this._conferenceId = conferenceId; ///< 会议室ID
      this.setRoomType = function (roomType) {
        this._roomType = roomType;
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
      this.setConferenceId = function (conferenceId) {
        this._conferenceId = conferenceId;
      };
      this.getRoomType = function () {
        return this._roomType;
      };
      this.getMemberLimit = function () {
        return this._memberLimit;
      };
      this.getPassword = function () {
        return this._password;
      };
      this.getRoleId = function () {
        return this._roleId;
      };
      this.getConferenceId = function () {
        return this._conferenceId;
      };
    },
    JoinRoomBuilder: function (roomId, password, roleId) {
      this._roomId = roomId;
      this._password = !!password ? password : '';
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
      };
      this.getRoleId = function () {
        return this._roleId;
      };
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
      this._docId = typeof docId == 'number' ? docId : YTX_WBSS_KERNEL.getCurDocId();
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
      this.setDocId = function (docId) {
        this._docId = docId;
      };
      this.getDocId = function () {
        return this._docId;
      };
    },
    RemoveDocBuilder: function (roomId, docId) {
      this._roomId = roomId;
      this._docId = !!docId ? docId : YTX_WBSS_KERNEL.getCurDocId();
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
      this.setDocId = function (docId) {
        this._docId = docId;
      };
      this.getDocId = function () {
        return this._docId;
      };
    },
    GotoPageBuilder: function (roomId, docId, pageIndex) {
      this._roomId = roomId != null ? roomId : YTX_WBSS_KERNEL.currentLoginInRoomID;
      this._docId = !!docId ? docId : YTX_WBSS_KERNEL.getCurDocId();
      this._pageIndex = pageIndex;
      this.setRoomId = function (roomId) {
        this._roomId = roomId;
      };
      this.getRoomId = function () {
        return this._roomId;
      };
      this.setDocId = function (docId) {
        this._docId = docId;
      };
      this.getDocId = function () {
        return this._docId;
      };
      this.setPageIndex = function (pageIndex) {
        this._pageIndex = pageIndex;
      };
      this.getPageIndex = function () {
        return this._pageIndex;
      };
    },
    ColorBuilder: function (r, g, b, a) {
      this._r = r;
      this._g = g;
      this._b = b;
      this._a = a != null ? a : 255;
      this.setR = function (r) {
        this._r = r;
      };
      this.getR = function () {
        return this._r;
      };
      this.setG = function (g) {
        this._g = g;
      };
      this.getG = function () {
        return this._g;
      };
      this.setB = function (b) {
        this._b = b;
      };
      this.getB = function () {
        return this._b;
      };
      this.setA = function (a) {
        this._a = a;
      };
      this.getA = function () {
        return this._a;
      };
    },
    ScaleBuilder: function (scaleMode, ratio) {
      this._scaleMode = !!scaleMode ? scaleMode : 0;
      this._ratio = !!ratio ? ratio : 0.2;
      this.setScaleMode = function (scaleMode) {
        this._scaleMode = scaleMode;
      };
      this.setRatio = function (ratio) {
        this._ratio = ratio;
      };
      this.getScaleMode = function () {
        return this._scaleMode;
      };
      this.getRatio = function () {
        return this._ratio;
      };
    },

    // ============  wbss API Init and Release SDK =================

    ///< 获取白板SDK版本信息
    get_WBSS_SDK_Version_String: function () {
      return YTX_WBSS_KERNEL.WBSS_SDK_VERSION_STRING;
    },

    ///< 初始化白板SDK
    ///< 【userId】注意不能包含-符号，不然影响drawID查询功能
    init_WBSS_SDK: function (userId, authKey, appId, serverIp, canvas) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====init_WBSS_SDK()=====');

      //Check Surport Ability
      var resp = {};
      if (!YTX_WBSS_API.checkWebSurportAbility()) {
        resp.code = YTX_WBSS_KERNEL._errcode._NOT_SUPPORT_H5;
        resp.msg = 'The brower do not support HTML5,please change the brower';
        return resp;
      }

      //Check Param
      if (!userId || !authKey || !appId || !canvas) {
        resp.code = YTX_WBSS_KERNEL._errcode._INVALID_PARAM;
        resp.msg = 'appid is null,please check you param';
        return resp;
      }
      if (serverIp) {
        YTX_WBSS_KERNEL._rest_servers_url[0] = Base64.encode(serverIp);
      }

      // Open Local DataBase
      YTX_WBSS_KERNEL.openLocalDataBase();

      // Save Config
      YTX_WBSS_KERNEL.websocket_isSSLEncrypt = serverIp.indexOf('https') != -1 ? true : false;
      YTX_WBSS_KERNEL._userId = userId;
      YTX_WBSS_KERNEL._authKey = authKey;
      YTX_WBSS_KERNEL._appid = appId;
      YTX_WBSS_KERNEL.canvas_html_handle = canvas;
      let imgCanvas = document.createElement('canvas');
      imgCanvas.width = canvas.width;
      imgCanvas.height = canvas.height;
      YTX_WBSS_KERNEL.canvas_image_handle = imgCanvas;
      canvas.parentNode.insertBefore(imgCanvas, canvas.nextSibling);

      // Resualt
      resp.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
      resp.msg = 'init_WBSS_SDK success';
      return resp;
    },

    ///< 释放白板SDK
    release_WBSS_SDK: function () {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._INFO, '=====release_WBSS_SDK()=====');

      // 退出释放房间资源
      YTX_WBSS_KERNEL.releaseRoomResource();

      // Close Local DataBase
      YTX_WBSS_KERNEL.closeLocalDataBase();
    },

    ///< 检查 Web H5 功能支持
    checkWebSurportAbility: function () {
      if (!!window.WebSocket) {
        YTX_WBSS_KERNEL._isSurportWebSocket = true;
      } else {
        YTX_WBSS_KERNEL._isSurportWebSocket = false;
      }

      var varFileReader = FileReader || window.FileReader;
      if (!varFileReader) {
        YTX_WBSS_KERNEL._isSurportFileReader = false;
      } else {
        YTX_WBSS_KERNEL._isSurportFileReader = true;
      }

      var varCanvas = window.Modernizr.canvas;
      if (!varCanvas) {
        YTX_WBSS_KERNEL._isSurportCanvas = false;
      } else {
        YTX_WBSS_KERNEL._isSurportCanvas = true;
      }

      if (
        YTX_WBSS_KERNEL._isSurportWebSocket &&
        YTX_WBSS_KERNEL._isSurportFileReader &&
        YTX_WBSS_KERNEL._isSurportCanvas
      ) {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._INFO,
          'this brower is support H5 . Version is ' +
            navigator.appVersion +
            '. vendor:' +
            navigator.vendor +
            '. Is online :' +
            navigator.onLine +
            ' version:' +
            YTX_WBSS_KERNEL.WBSS_SDK_VERSION_STRING
        );
        return true;
      } else {
        YTX_WBSS_KERNEL._log(
          YTX_WBSS_KERNEL._logLev._ERROR,
          'sorry, your brower not support H5 isSurportWebSocket=' +
            YTX_WBSS_KERNEL._isSurportWebSocket +
            ' isSurportFileReader=' +
            YTX_WBSS_KERNEL._isSurportFileReader +
            ' isSurportCanvas=' +
            YTX_WBSS_KERNEL._isSurportCanvas
        );
        return false;
      }
    },

    // ============ wbss API Room Manager =================

    createRoom: function (createRoomBuilder, callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====createRoom()=====');

      if (YTX_WBSS_KERNEL.isLoginInRoomServer == true) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._ALREADY_IN_ROOM_ERROR;
        respError.msg = 'you are already in the room. id=' + YTX_WBSS_KERNEL.getCurRoomId();
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
        if (onError != null) {
          onError(respError);
        }
        return null;
      }

      var roomType = createRoomBuilder.getRoomType();
      if (!createRoomBuilder || !roomType || (roomType != 1 && roomType != 2)) {
        var resp = {};
        resp.code = YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM;
        resp.msg = 'param invalid';
        if (onError) onError(resp);
        return null;
      }
      YTX_WBSS_KERNEL._requestRestServer(
        -1,
        function callback_wbss_room_start() {
          //发送创建房间
          var sendReqCreateRoomJsonStr = YTX_WBSS_KERNEL._protobuf._buildCreateRoom(
            createRoomBuilder,
            callback,
            onError
          );
          if (sendReqCreateRoomJsonStr != null && sendReqCreateRoomJsonStr.length > 0) {
            YTX_WBSS_KERNEL.sendWebSocketMsg(sendReqCreateRoomJsonStr);
          }
        },
        onError
      );
    },
    joinRoom: function (joinRoomBuilder, callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====joinRoom()=====');

      if (YTX_WBSS_KERNEL.isLoginInRoomServer == true) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._ALREADY_IN_ROOM_ERROR;
        respError.msg = 'you are already in the room. id=' + YTX_WBSS_KERNEL.getCurRoomId();
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
        if (onError != null) {
          onError(respError);
        }
        return null;
      }

      if (!joinRoomBuilder || !joinRoomBuilder.getRoomId() || !joinRoomBuilder.getPassword()) {
        var resp = {};
        resp.code = YTX_WBSS_KERNEL._errcode._NO_REQUIRED_PARAM;
        resp.msg = 'param invalid';
        if (onError) {
          onError(resp);
        }
        return null;
      }
      YTX_WBSS_KERNEL._requestRestServer(
        joinRoomBuilder.getRoomId(),
        function callback_wbss_room_start() {
          //发送加入房间
          var sendReqJoinRoomJsonStr = YTX_WBSS_KERNEL._protobuf._buildJoinRoom(
            joinRoomBuilder,
            callback,
            onError
          );
          if (sendReqJoinRoomJsonStr != null && sendReqJoinRoomJsonStr.length > 0) {
            YTX_WBSS_KERNEL.sendWebSocketMsg(sendReqJoinRoomJsonStr);
          }
        },
        onError
      );
    },
    deleteRoom: function (deleteRoomBuilder, callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====deleteRoom()=====');

      if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
        respError.msg = 'not in room.';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
        if (onError != null) {
          onError(respError);
        }
        return null;
      }

      var sendStr = YTX_WBSS_KERNEL._protobuf._buildDeleteRoom(
        deleteRoomBuilder,
        callback,
        onError
      );
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);

        // 发送完删除房间，服务器暂时没有任何回复，延时销毁房间信息
        var delete_room_timeout_timer = window.setTimeout(function () {
          // 退出释放房间资源
          YTX_WBSS_KERNEL.releaseRoomResource();

          // 退出房间通知
          var resp = {};
          resp.code = YTX_WBSS_KERNEL._errcode._SUCCESS;
          resp.msg = 'delete room success';
          if (callback) {
            callback(resp);
          }
        }, YTX_WBSS_KERNEL.releaseRoomResourceTimeOutMS);
      }
    },
    leaveRoom: function (leaveRoomBuilder, callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====leaveRoom()=====');

      if (YTX_WBSS_KERNEL.isLoginInRoomServer != true) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
        respError.msg = 'not in room.';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, 'not in room');
        if (onError != null) {
          onError(respError);
        }
        return null;
      }

      var sendJsonStr = YTX_WBSS_KERNEL._protobuf._buildLeaveRoom(
        leaveRoomBuilder,
        callback,
        onError
      );
      console.log('===sendJsonStr===', sendJsonStr, leaveRoomBuilder);
      if (sendJsonStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendJsonStr);
      }
    },

    // ============  wbss API MouseEvent Manager =================

    // return enable is true
    getMouseEventEnable: function () {
      return YTX_WBSS_KERNEL.CANVAS_MOD.isRegisterMouseEvent();
    },

    // return mouse event enable status
    setMouseEventEnable: function (isEnable) {
      if (YTX_WBSS_KERNEL.CANVAS_MOD.isRegisterMouseEvent()) {
        if (isEnable == false) {
          YTX_WBSS_KERNEL.CANVAS_MOD.removeMouseEvent();
        }
      } else {
        if (isEnable == true) {
          YTX_WBSS_KERNEL.CANVAS_MOD.registerMouseEvent();
        }
      }
      return YTX_WBSS_KERNEL.CANVAS_MOD.isRegisterMouseEvent();
    },

    // ============  wbss API Doc Manager =================

    shareDoc: function (shareDocBuilder, callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====shareDoc=====');
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildShareDoc(shareDocBuilder, callback, onError);
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
      }
    },
    removeDoc: function (removeDocBuilder, callback, onError) {
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildRemoveDoc(removeDocBuilder, callback, onError);
      if (!!sendStr) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
      }
    },

    // ============  wbss API Page Manager =================

    clearCurrentPage: function (callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====clearCurrentPage=====');
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildClearCurrentPage(callback, onError);
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
        return true;
      }
      return false;
    },
    getCurrentPagePNG: function (callback, onError) {
      return YTX_WBSS_KERNEL.getDrawScreenImage('image/png', callback, onError);
    },
    getCurrentPageJPEG: function (callback, onError) {
      return YTX_WBSS_KERNEL.getDrawScreenImage('image/jpeg', callback, onError);
    },
    getCurrentPageViewRectFromCanvas: function () {
      var draw_space_rect_info = null;
      if (YTX_WBSS_KERNEL.isLoginInRoomServer) {
        var current_page_info = YTX_WBSS_KERNEL.getCurrentPageInfo();
        if (current_page_info != null) {
          if (
            current_page_info.last_draw_space_width > 0 &&
            current_page_info.last_draw_space_height > 0
          ) {
            draw_space_rect_info = {
              x: current_page_info.last_draw_space_fromX,
              y: current_page_info.last_draw_space_fromY,
              width: current_page_info.last_draw_space_width,
              height: current_page_info.last_draw_space_height,
            };
            return draw_space_rect_info;
          } //if(current_page_info.last_draw_space_width > 0 && current_page_info.last_draw_space_height > 0)
        }
      }
    },
    gotoPage: function (gotoPageBuilder, callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====gotoPage=====');
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildGotoPage(gotoPageBuilder, callback, onError);
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
      }
    },
    gotoNextPage: function (callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====gotoNextPage=====');
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildGotoNextPage(callback, onError);
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
      }
    },
    gotoPrevPage: function (callback, onError) {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====gotoPrevPage=====');
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildGotoPrevPage(callback, onError);
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);
      }
    },
    drawUndo: function (onSuccess, onError) {
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildDraw_Undo_or_wRedo(true, onSuccess, onError);
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);

        // 同步绘图
        YTX_WBSS_KERNEL.updateDrawScreen();
        return true;
      }
      return false;
    },
    drawRedo: function (onSuccess, onError) {
      var sendStr = YTX_WBSS_KERNEL._protobuf._buildDraw_Undo_or_wRedo(false, onSuccess, onError);
      if (sendStr != null) {
        YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr);

        // 同步绘图
        YTX_WBSS_KERNEL.updateDrawScreen();
        return true;
      }
      return false;
    },

    // ============  wbss API Draw Manager =================

    setLineShape: function (shape) {
      YTX_WBSS_KERNEL.drawContext.drawShapeType = shape;
      YTX_WBSS_KERNEL.drawContext.isEraser = false;
      if (
        YTX_WBSS_API._shapeType.FREELINE == YTX_WBSS_KERNEL.drawContext.drawShapeType ||
        YTX_WBSS_API._shapeType.LINE == YTX_WBSS_KERNEL.drawContext.drawShapeType ||
        YTX_WBSS_API._shapeType.TRIANGLE == YTX_WBSS_KERNEL.drawContext.drawShapeType ||
        YTX_WBSS_API._shapeType.RECT == YTX_WBSS_KERNEL.drawContext.drawShapeType ||
        YTX_WBSS_API._shapeType.CIRCLE == YTX_WBSS_KERNEL.drawContext.drawShapeType ||
        YTX_WBSS_API._shapeType.ELLIPSE == YTX_WBSS_KERNEL.drawContext.drawShapeType
      ) {
        YTX_WBSS_KERNEL.drawContext.drawToolStatus =
          YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL;
      } else if (YTX_WBSS_API._shapeType.LASERPEN == YTX_WBSS_KERNEL.drawContext.drawShapeType) {
        YTX_WBSS_KERNEL.drawContext.drawToolStatus =
          YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_LASER_PEN;
      } else if (YTX_WBSS_API._shapeType.FONT == YTX_WBSS_KERNEL.drawContext.drawShapeType) {
        YTX_WBSS_KERNEL.drawContext.drawToolStatus =
          YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL;
      } else if (
        YTX_WBSS_API._shapeType.ERASER_DRAW_ID == YTX_WBSS_KERNEL.drawContext.drawShapeType
      ) {
        YTX_WBSS_KERNEL.drawContext.drawToolStatus =
          YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_ERASER;
      } else if (
        YTX_WBSS_API._shapeType.ERASER_DRAW_LINE == YTX_WBSS_KERNEL.drawContext.drawShapeType
      ) {
        YTX_WBSS_KERNEL.drawContext.drawShapeType = YTX_WBSS_API._shapeType.FREELINE;
        YTX_WBSS_KERNEL.drawContext.drawToolStatus =
          YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_NORMAL;
        YTX_WBSS_KERNEL.drawContext.isEraser = true;
      }
    },

    getLineShape: function () {
      return YTX_WBSS_KERNEL.drawContext.drawShapeType;
    },

    setLineColor: function (ColorBuilder) {
      YTX_WBSS_KERNEL.drawContext.lineColor =
        (ColorBuilder.getR() << 24) |
        (ColorBuilder.getG() << 16) |
        (ColorBuilder.getB() << 8) |
        (ColorBuilder.getA() << 0);
    },
    setLineWidth: function (lineSize) {
      // 限制线宽的大小
      if (lineSize < 1) {
        lineSize = 1;
      }
      if (lineSize > 100) {
        lineSize = 100;
      }

      // 保存线宽的大小
      YTX_WBSS_KERNEL.drawContext.lineSize = lineSize;
    },
    setFillMode: function (isFill) {
      YTX_WBSS_KERNEL.drawContext.isFillMode = isFill;
    },
    getEraser: function () {},

    setDeleteModel: function () {
      YTX_WBSS_KERNEL.drawContext.drawToolStatus =
        YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_DELETE;
    },
    setMoveModel: function () {
      YTX_WBSS_KERNEL.drawContext.drawToolStatus =
        YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_ZOOM;
    },
    setZoomState: function () {
      YTX_WBSS_KERNEL.drawContext.drawToolStatus =
        YTX_WBSS_KERNEL.drawConextToolStatus.DRAW_STATUS_ZOOM;
    },
    scale: function (scaleBuilder, callback, onError) {
      // var sendStr = YTX_WBSS_KERNEL._protobuf._buildScale(scaleBuilder, callback, onError);
      // if (!!sendStr) {
      //     YTX_WBSS_KERNEL.sendWebSocketMsg(sendStr)
      // }
    },
    addText: function (font_pos, font_text, font_textsize, font_type, onSuccess, onError) {
      return YTX_WBSS_KERNEL.drawContext.createTextDrawDataElement(
        font_pos,
        font_text,
        font_textsize,
        font_type,
        onSuccess,
        onError
      );
    },

    setWhiteBoardScale: function (scale) {
      if (scale == 'undefined') return false;
      if (scale <= 0) scale = 0;
      YTX_WBSS_KERNEL.drawContext.wbRatio = scale;
      return true;
    },
    setWhiteBoardIfScale: function () {}, // 暂时废弃

    // 划线类型定义
    _shapeType: {
      NONE: 0,
      FREELINE: 1, ///< 自由线
      LINE: 2, ///< 直线
      RECT: 3, ///< 矩形
      TRIANGLE: 4, ///< 三角形
      CIRCLE: 5, ///< 圆
      ELLIPSE: 6, ///< 椭圆
      DASHLINE: 7, ///< 虚线
      ARROWMARK: 8, ///< 箭头
      ARROWMARK1: 9, ///< 箭头1
      ARROWMARK2: 10, ///< 箭头2
      FONT: 11, ///< 字体
      LASERPEN: 12, ///< 激光笔,sdk内部使用
      TEXTURE: 13, ///< 图片，暂不支持
      END: 14,

      ERASER_DRAW_LINE: 10001, ///< 区域橡皮擦
      ERASER_DRAW_ID: 10002, ///< 元素橡皮擦
    },

    // ============  wbss API download and upload file manager =================

    // 上传文件
    uploadDoc: function (file_object, onSuccess, onError, onProcess) {
      // 房间信息
      var room_id = YTX_WBSS_KERNEL.getCurRoomId();
      if (YTX_WBSS_KERNEL.isLoginInRoomServer != true || room_id == null || room_id <= 0) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
        respError.msg = 'not in room.';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, respError.msg);
        if (onError != null) {
          onError(respError);
        }
        return false;
      }

      return YTX_WBSS_KERNEL.asynUploadFile(
        room_id,
        file_object,
        null,
        null,
        onSuccess,
        onError,
        onProcess
      );
    },

    // 上传文件
    uploadDocURL: function (
      file_url,
      file_url_json_string_extra_data,
      onSuccess,
      onError,
      onProcess
    ) {
      // 房间信息
      var room_id = YTX_WBSS_KERNEL.getCurRoomId();
      if (YTX_WBSS_KERNEL.isLoginInRoomServer != true || room_id == null || room_id <= 0) {
        var respError = {};
        respError.code = YTX_WBSS_KERNEL._errcode._NOT_INROOM_ERROR;
        respError.msg = 'not in room.';
        YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._ERROR, respError.msg);
        if (onError != null) {
          onError(respError);
        }
        return false;
      }

      return YTX_WBSS_KERNEL.asynUploadFile(
        room_id,
        null,
        file_url,
        file_url_json_string_extra_data,
        onSuccess,
        onError,
        onProcess
      );
    },

    // ============  wbss API onListener =================

    // 监听通知注册
    onUploadDocProcessListener: function (callback) {
      YTX_WBSS_KERNEL._onUploadDocProcessListener = callback;
    },
    onDocConvertListener: function (callback) {
      YTX_WBSS_KERNEL._onDocConvertListener = callback;
    },
    onGotoPageListener: function (callback) {
      YTX_WBSS_KERNEL._onGotoPageListener = callback;
    },
    onShareDocListener: function (callback) {
      YTX_WBSS_KERNEL._onShareDocListener = callback;
    },
    onFilePathListener: function (callback) {
      YTX_WBSS_KERNEL._onFilePathListener = callback;
    },
    onConnectStateChangeListener: function (callback) {
      YTX_WBSS_KERNEL.connectStateChange = callback;
    },

    // canvas渲染相关函数
    notifyCanvasEventResize: function () {
      YTX_WBSS_KERNEL.updateDrawScreen();
    },

    // ============  wbss API Total Data =================

    getRecvDataTotalByte: function () {
      return YTX_WBSS_KERNEL.websocket_recvByteDataTotal;
    },

    getSendDataTotalByte: function () {
      return YTX_WBSS_KERNEL.websocket_sendByteDataTotal;
    },

    getDrawScreenTotalNumber: function () {
      return YTX_WBSS_KERNEL.drawContext.drawCountTotalNumber;
    },

    // ============  wbss API Test =================

    testAPI01: function () {
      YTX_WBSS_KERNEL._log(YTX_WBSS_KERNEL._logLev._DEBUG, '=====testAPI01=====');
    },

    // ============  wbss API【End】=================
  };
})();
