
  if (typeof (hex_md5) == "undefined") {
    document.write('<script src="https://app.cloopen.com/im50/MD5.min.js" type="text/javascript" charset="utf-8"></script>')
  }
  if (typeof (Base64) == "undefined") {
    document.write('<script src="https://app.cloopen.com/im50/base64.min.js" type="text/javascript" charset="utf-8"></script>')
  }
  if (typeof (pako) == "undefined") {
    document.write('<script src="https://app.cloopen.com/im50/pako.js" type="text/javascript" charset="utf-8"></script>')
  }
  if (typeof (AMR) == "undefined") {
    document.write('<script src="https://app.cloopen.com/im50/amrnb.js" type="text/javascript" charset="utf-8"></script>')
  }

//=======================================Meeting==============================//
  var ParKey = {};
  ParKey.MessageType = "1";
  ParKey.MessageContent = "2";
  ParKey.Method = "1";
  ParKey.CallId = "2";
  ParKey.IsVoipCall = "3";
  ParKey.Called = "5";
  ParKey.Caller = "7";
  ParKey.Sdp = "17";
  ParKey.Seq = "25";
  ParKey.ClientNo = "3";
  ParKey.CallRouteId = "9";
  ParKey.Cause = "10";
  ParKey.UserData = "13";
  ParKey.CustomData = "14";
  ParKey.ToThird = "23";

  var ParValue = {};
  ParValue.Call = 127;
  ParValue.Conference = 140;

  var ParMethod = {};
  ParMethod.Invite = 1;
  ParMethod.Ring = 2;
  ParMethod.Answer = 4;
  ParMethod.ACK = 6;
  ParMethod.Bye = 7;
  ParMethod.Cancel = 8;
  ParMethod.Refuse = 10;
  ParMethod.Trying = 13;
  ParMethod.SubscribeMediaRequest = 38;
  ParMethod.SubscribeMediaResponse = 39;
  ParMethod.UnSubscribeMediaRequest = 40;
  ParMethod.UnSubscribeMediaResponse = 41;
  ParMethod.PublishMediaRequest = 42;
  ParMethod.PublishMediaResponse = 43;
  ParMethod.UnPublishMediaRequest = 44;
  ParMethod.UnPublishMediaResponse = 45;
  
  var YTX_Protobuf = {};

  YTX_Protobuf.CallEventDataInner = function(){
    this.CallEventDataInner = {};
    this.setMethod = function(method){
      this.CallEventDataInner[ParKey.Method] = method;
    };
    this.setIsVoipCall = function(isVoipCall){
      this.CallEventDataInner[ParKey.IsVoipCall] = isVoipCall;
    };
    this.setCallId = function(id){
      this.CallEventDataInner[ParKey.CallId] = id;
    };
    this.setCalled = function(called){
      this.CallEventDataInner[ParKey.Called] = called;
    };
    this.setCaller = function(caller){
      this.CallEventDataInner[ParKey.Caller] = caller;
    };
    this.setSdp = function(sdp){
      this.CallEventDataInner[ParKey.Sdp] = sdp;
    };
    this.setSeq = function(seq){
      this.CallEventDataInner[ParKey.Seq] = seq;
    };
    this.setCause = function(cause){
      this.CallEventDataInner[ParKey.Cause] = cause;
    };
    this.setUserData = function(data){
      this.CallEventDataInner[ParKey.UserData] = data;
    };
    this.setCustomData = function(customData){
      this.CallEventDataInner[ParKey.CustomData] = customData;
    };
    this.setToThird = function(toThird){
      this.CallEventDataInner[ParKey.ToThird] = toThird;
    };
  };

  YTX_Protobuf.callMessage = function(){
    this[ParKey.MessageType] = ParValue.Call;
    this[ParKey.MessageContent] = new YTX_Protobuf.CallEventDataInner();
    
    this.setMethod = function(method){
      this[ParKey.MessageContent].setMethod(method);
    };
    this.setIsvoipCall = function(isvoip){
      this[ParKey.MessageContent].setIsVoipCall(isvoip);
    };
    this.setCallId = function(id){
      this[ParKey.MessageContent].setCallId(id);
    };
    this.setCalled = function(called){
      this[ParKey.MessageContent].setCalled(called);
    };
    this.setCaller = function(caller){
      this[ParKey.MessageContent].setCaller(caller);
    };
    this.setSdp = function(sdp){
      this[ParKey.MessageContent].setSdp(sdp);
    };
    this.setCause = function(cause){
      this[ParKey.MessageContent].setCause(cause);
    };
    this.setUserData = function(data){
      this[ParKey.MessageContent].setUserData(data);
    };
    this.setCustomData = function(customData){
      this[ParKey.MessageContent].setCustomData(customData);
    };
    this.setSeq = function(seq){
      this[ParKey.MessageContent].setSeq(seq);
    };
    this.setToThird = function(toThird){
      this[ParKey.MessageContent].setToThird(toThird);
    };
    this.setClientNo = function(clientNo){
      this[ParKey.ClientNo] = clientNo;
    };
    this.setCallrouteId = function(id){
      this[ParKey.CallRouteId] = id;
    };
    this.encode = function(){
      var result = {};
      result["MsgLite"] = this;
      return JSON.stringify(result);
    };
  }

  YTX_Protobuf.publishMediaRequest = function(){
    this[ParKey.MessageType] = ParValue.Call;
    this[ParKey.MessageContent] = new YTX_Protobuf.CallEventDataInner();
    this[ParKey.MessageContent].setMethod(ParMethod.PublishMediaRequest);

    this.setCallId = function(id){
      this[ParKey.MessageContent].setCallId(id);
    };
    this.setCalled = function(called){
      this[ParKey.MessageContent].setCalled(called);
    };
    this.setCaller = function(caller){
      this[ParKey.MessageContent].setCaller(caller);
    };
    this.setCustomData = function(customData){
      this[ParKey.MessageContent].setCustomData(customData);
    };
    this.setSeq = function(seq){
      this[ParKey.MessageContent].setSeq(seq);
    };
    this.setClientNo = function(clientNo){
      this[ParKey.ClientNo] = clientNo;
    };
    this.setCallrouteId = function(id){
      this[ParKey.CallRouteId] = id;
    };
    this.encode = function(){
      var result = {};
      result["MsgLite"] = this;
      return JSON.stringify(result);
    };
  };

  YTX_Protobuf.unPublishMediaRequest = function(){
    this[ParKey.MessageType] = ParValue.Call;
    this[ParKey.MessageContent] = new YTX_Protobuf.CallEventDataInner();
    this[ParKey.MessageContent].setMethod(ParMethod.UnPublishMediaRequest);

    this.setCallId = function(id){
      this[ParKey.MessageContent].setCallId(id);
    };
    this.setCalled = function(called){
      this[ParKey.MessageContent].setCalled(called);
    };
    this.setCaller = function(caller){
      this[ParKey.MessageContent].setCaller(caller);
    };
    this.setCustomData = function(customData){
      this[ParKey.MessageContent].setCustomData(customData);
    };
    this.setSeq = function(seq){
      this[ParKey.MessageContent].setSeq(seq);
    };
    this.setClientNo = function(clientNo){
      this[ParKey.ClientNo] = clientNo;
    };
    this.setCallrouteId = function(id){
      this[ParKey.CallRouteId] = id;
    };
    this.encode = function(){
      var result = {};
      result["MsgLite"] = this;
      return JSON.stringify(result);
    };
  };
  
  var CState = {};
  CState.Disconnected = 1;
  CState.Connecting = 2;
  CState.Alerting = 3;
  CState.Connected = 4;
  CState.Disconnecting = 5;
  CState.ScreenSharing = 6;
  CState.CancelScreenSharing = 7;
  CState.Updating = 8;

  var COperation = {};
  COperation.Calling = 1;
  COperation.Meeting = 2;

  var MType = {};
  MType.None = -1;
  MType.Audio = 0;
  MType.Video = 1;
  MType.Screen = 2;
  MType.OnlyVideo = 3;

  var CDirection = {};
  CDirection.Offer = 0;
  CDirection.Answer = 1;

  var CStatusCode = {};
  CStatusCode.NoDevice = 120001;
  CStatusCode.BrowserNotSupport = 120002;

  var SDPParser = {};
  SDPParser.disableVideo = function(sdp){
    let resultSdp = "";
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.indexOf("m=video") >= 0){
        let port = line.split(" ")[1];
        line = line.replace("m=video " + port, "m=video 0");
      }
      if(line.length > 2){
        resultSdp += line;
      }
    }
    return resultSdp;
  };

  SDPParser.getVideoPort = function(sdp){
    let port = 0;
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.indexOf("m=video") >= 0){
        port = line.split(" ")[1];
      }
    }
    return port;
  };

  /////////////////////////////////////////////////
  SDPParser.addBundle = function(sdp, bundle){
    let resultSdp = "";
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.length <= 2){
        continue;
      }
      if(line.indexOf("a=group:BUNDLE") >= 0){
        line = line.split("\r\n")[0] + " " + bundle + "\r\n";
      }
      resultSdp += line;
    }
    return resultSdp;
  }

  SDPParser.getDirection = function(mediaLines){
    let lines = mediaLines.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if(line.indexOf("a=sendrecv") >= 0 
      || line.indexOf("a=recvonly") >= 0
      || line.indexOf("a=sendonly") >= 0
      || line.indexOf("a=inactive") >= 0){
        return line.split("=")[1];
      }
    }
  }

  SDPParser.removeExtmap = function(sdp){
    let result = "";
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.length <= 2){
        continue;
      }
      if(line.indexOf("a=extmap:") >= 0){
        continue;
      }
      result += line;
    }
    return result;
  };

  SDPParser.removePayloadType = function(sdp, removePt){
    let result = "";
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.length <= 2){
        continue;
      }
      if(line.indexOf("m=video") >= 0){
        line = line.replace(" " + removePt, "");
      }
      if(line.indexOf("a=rtpmap:" + removePt) >= 0
      || line.indexOf("a=rtcp-fb:" + removePt) >= 0
      || line.indexOf("a=fmtp:" + removePt) >= 0){
        continue;
      }
      result += line;
    }
    return result;
  };

  SDPParser.removeH264PacketMode0 = function(sdp){
    let result = sdp;
    let removePtArray = [];
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if(line.indexOf("packetization-mode=0") >= 0){
        let removePt = line.split(" ")[0].split(":")[1];
        result = SDPParser.removePayloadType(result, removePt);
        removePtArray.push(removePt);
      }
    }
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      for(let j = 0; j < removePtArray.length; j++){
        if(line.indexOf(" apt=" + removePtArray[j]) >= 0){
          let depentPt = line.split(" ")[0].split(":")[1];
          result = SDPParser.removePayloadType(result, depentPt);
        }
      }
    }
    return result;
  };

  SDPParser.rewriteAudioCodec = function(sdp){
    let result = "";
    let cursor = "session";
    let lines = sdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.length <= 2){
        continue;
      }
      if(line.indexOf("m=audio") >= 0){
        cursor = "audio";
        line = "m=audio 9 UDP/TLS/RTP/SAVPF 111 126" + "\r\n";
        line += "a=rtpmap:111 opus/48000/2" + "\r\n";
        line += "a=rtcp-fb:111 transport-cc" + "\r\n";
        line += "a=fmtp:111 minptime=10;useinbandfec=1" + "\r\n";
        line += "a=rtpmap:126 telephone-event/8000" + "\r\n";
        result += line;
        continue;
      }
      if(line.indexOf("m=video") >= 0){
        cursor = "video";
      }
      if(cursor == "audio"){
        if(line.indexOf("a=rtpmap:") >= 0
        || line.indexOf("a=rtcp-fb:") >= 0
        || line.indexOf("a=fmtp:") >= 0){
          continue;
        }
      }
      
      result += line;
    }
    return result;
  }
  ////////////////////////////////////////

  YTX_Call_Flag = {};
  YTX_Call_Flag.None = 0;
  YTX_Call_Flag.LandPhone = 1;
  YTX_Call_Flag.Polycom = 2;
  YTX_Call_Flag.Cisco = 3;
  ////////////////////////////////////////////////////////////

  var YTX_Meeting = {};
  YTX_Meeting.Version = "3.5.4";
  //need reset
  YTX_Meeting.processing =false;
  YTX_Meeting.requestQueue = new Array();
  YTX_Meeting.confId = "";
  YTX_Meeting.caller = "";
  YTX_Meeting.called = "";
  YTX_Meeting.callId = "";
  YTX_Meeting.userData = "";
  YTX_Meeting.callRouteId = "";
  YTX_Meeting.mediaType = MType.Audio;
  YTX_Meeting.operation = COperation.Calling;
  YTX_Meeting.direction = CDirection.Offer;
  YTX_Meeting.callFlag = YTX_Call_Flag.None;

  YTX_Meeting.recvInviteSdp = ""; //as called
  YTX_Meeting.recvAnswerSdp = ""; //as calling

  YTX_Meeting.selfSsrc = "";
  YTX_Meeting.antiSsrc = "";
  YTX_Meeting.antiVideoCodec = "";

  YTX_Meeting.clientNo = 100;
  YTX_Meeting.makeCallTimerId = 0;
  YTX_Meeting.updateCallTimerId = 0;
  YTX_Meeting.releaseCallTimerId = 0;
  YTX_Meeting.publishMediaTimerId = 0;
  YTX_Meeting.unPublishMediaTimerId = 0;
  YTX_Meeting.connState = CState.Disconnected;
  YTX_Meeting.requestMap = new Map();
  //not need reset
  YTX_Meeting.transport = {};
  YTX_Meeting.onCallEvent = function () {}; // 呼叫事件上报
  YTX_Meeting.confEventListener = function () {};//会议事件上报
  YTX_Meeting.confNotifyLinstener = function () {};//会议通知上报
  YTX_Meeting.onPublishMedia = function () {};;//本地流上报
  YTX_Meeting.makeCallFailCallback = null;
  YTX_Meeting.makeCallSuccessCallback = null;
  YTX_Meeting.updateCallFailCallback = null;
  YTX_Meeting.updateCallSuccessCallback = null;
  YTX_Meeting.releaseCallFailCallback = null;
  YTX_Meeting.releaseCallSuccessCallback = null;
  YTX_Meeting.acceptCallFailCallback = null;
  YTX_Meeting.acceptCallSuccessCallback = null;
  YTX_Meeting.startScreenShareFailcCallback = null;
  YTX_Meeting.startScreenShareSuccessCallback = null;

  YTX_Meeting.reset = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Meeting Reset");
    YTX_Meeting.processing =false;
    YTX_Meeting.requestQueue = [];
    YTX_Meeting.confId = "";
    YTX_Meeting.caller = "";
    YTX_Meeting.called = "";
    YTX_Meeting.callId = "";
    YTX_Meeting.userData = "";
    YTX_Meeting.callRouteId = "";
    YTX_Meeting.mediaType = MType.Audio;
    YTX_Meeting.operation = COperation.Calling;
    YTX_Meeting.direction = CDirection.Offer;
    YTX_Meeting.callFlag = YTX_Call_Flag.None;

    YTX_Meeting.recvInviteSdp = "";
    YTX_Meeting.recvAnswerSdp = "";

    YTX_Meeting.selfSsrc = "";
    YTX_Meeting.antiSsrc = "";
    YTX_Meeting.antiVideoCodec = "";

    YTX_Meeting.clientNo = 100;
    clearTimeout(YTX_Meeting.makeCallTimerId);
    clearTimeout(YTX_Meeting.updateCallTimerId)
    clearTimeout(YTX_Meeting.releaseCallTimerId);
    clearTimeout(YTX_Meeting.publishMediaTimerId);
    clearTimeout(YTX_Meeting.unPublishMediaTimerId);
    YTX_Meeting.connState = CState.Disconnected;
    YTX_Meeting.requestMap.clear();
    YTX_Webrtc.reset();
  };

  YTX_Meeting.addRequest = function(request){
    if(YTX_Meeting.requestQueue.length >= 20){
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] RequestQueue Is Full");
      return;
    }
    YTX_Meeting.requestQueue.push(request);
    if(YTX_Meeting.processing == false){
      YTX_Meeting.processing = true;
      YTX_Meeting.handleRequest();
    }    
  };

  YTX_Meeting.handleRequest = function(){
    let request = YTX_Meeting.requestQueue.shift();
    if(!request){
      YTX_Meeting.processing = false;
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Request Process Finish");
      return;
    }
    switch(request.messageId){
      case YTX_MessageId.UpdateMedia:
        YTX_Meeting.updateMedia(request);
        break;
      case YTX_MessageId.SubscribeMedia:
        YTX_Meeting.subscribeMedia(request);
        break;
      case YTX_MessageId.UnSubscribeMedia:
        YTX_Meeting.unSubscribeMedia(request);
        break;
      case YTX_MessageId.StartScreenShare:
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Handle Start ScreenShare");
        YTX_Meeting.startScreenShare(request.onSuccess, request.onFail);
        break;
      case YTX_MessageId.CancelScreenShare:
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Handle Cancel ScreenShare");
        YTX_Meeting.cancelScreenShare();
        break;
    }
  }; 

  YTX_Meeting.updateMediaSuccess = function(){
    YTX_Meeting.connState = CState.Connected;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] update Media Success");
    if(YTX_Meeting.updateCallSuccessCallback){
      YTX_Meeting.updateCallSuccessCallback();
    }
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.updateMediaFail = function(err){
    YTX_Meeting.connState = CState.Connected;
    console.error(YTX_Meeting.getTimeStamp(), "[Meeting] update Media Failed, errName:", err.name, ", errMessage:", err.message);
    if(YTX_Meeting.updateCallFailCallback){
      YTX_Meeting.updateCallFailCallback(err);
    }
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.subscribeMediaSuccess = function(request){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] subscribe Media Success, userName:", request.userName, ", userId:", request.userId);
    if(request.onSuccess){
      request.onSuccess();
    }
    request = null;
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.subscribeMediaFail = function(request, err){
    console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Subscribe Media Failed, userName:", request.userName, 
            ", userId:", request.userId, "errName:", err.name, ", errMessage:", err.message);
    if(request.onFail){
      request.onFail();
    }
    request = null;
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.unSubscribeMediaSuccess = function(request){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] unSubscribe Media Success, userName:", request.userName, ", userId:", request.userId);
    if(request.onSuccess){
      request.onSuccess();
    }
    request = null;
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.unSubscribeMediaFail = function(request, err){
    console.error(YTX_Meeting.getTimeStamp(), "[Meeting] unSubscribe Media Failed, userName:", request.userName, ", userId:", request.userId,
      "errName:", err.name, ", errMessage:", err.message);
    if(request.onFail){
      request.onFail();
    }
    request = null;
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.startScreenShareFail = function(err){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] start ScreenShare Fail, errName:", err.name, ", errMessage:", err.message);
    YTX_Meeting.connState = CState.Connected;
    YTX_Meeting.startScreenShareFailcCallback(err);
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.startScreenShareSuccess = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] start ScreenShare Success");
    YTX_Meeting.connState = CState.Connected;
    YTX_Meeting.startScreenShareSuccessCallback();
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.cancelScreenShareFail = function(err){
    console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Cancel ScreenShare Failed, errName:", err.name, ", errMessage:", err.message);
    YTX_Meeting.handleRequest();
  };

  YTX_Meeting.cancelScreenShareSuccess = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Cancel ScreenShare Success");
    YTX_Meeting.handleRequest();
  };
/////////////////////////////////////////////////////////////////////////////////////////////

  YTX_Meeting.initWebrtc = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Initialization RL_Media:", YTX_Meeting.Version)
    YTX_Webrtc.initPeerconnection();
    YTX_Webrtc._peerConnection.oniceconnectionstatechange = YTX_Meeting.onIceconnectionstatechange;
  };

  YTX_Meeting.onIceconnectionstatechange = function(event){
    if(!YTX_Webrtc._peerConnection){
      return;
    }
    let state = YTX_Webrtc._peerConnection.iceConnectionState;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Iceconnectionstatechanged:", state);
    if(state == "connected"){
      if(YTX_Meeting.operation == COperation.Calling && YTX_Meeting.mediaType == MType.Video){
        let request = {};
        request.mediaType = "1";
        request.userId = YTX_Meeting.called;
        request.userName = YTX_Meeting.called;
        request.antiSsrc = YTX_Meeting.antiSsrc;
        request.antiEncodeType = YTX_Meeting.antiVideoCodec;
        YTX_Meeting.subscribeMedia(request);
      }
    }
    if(state == "disconnect"){

    }
    if(state == "failed"){
      let obj = {};
      obj["state"] = 17;
      obj["msg"] = "MediaStateFailed";
      YTX_Meeting.confEventListener(obj);
    }
  };

  YTX_Meeting.processCallMessage = function(msgLite){
    let content = msgLite[ParKey.MessageContent];
    if(content){
      let CallEventData = content["CallEventData"];             
      let method = CallEventData[ParKey.Method];
      switch(method){
        case ParMethod.Trying:              
          YTX_Meeting.recv100Trying(content);
          break;
        case ParMethod.Ring:
          YTX_Meeting.recvRing(content);
          break;
        case ParMethod.Refuse:
          YTX_Meeting.recvRefuse(content); 
          break;
        case ParMethod.Answer:
          YTX_Meeting.recv200OK(content);           
          break;
        case ParMethod.Bye:
          YTX_Meeting.recvBye(content);
          break;
        case ParMethod.Invite:
          YTX_Meeting.recvInvite(msgLite);
          break;
        case ParMethod.ACK:
          YTX_Meeting.recvAck(content);
          break;
        case ParMethod.Cancel:
          YTX_Meeting.recvCancel(content);
          break;
        case ParMethod.SubscribeMediaResponse:   
          YTX_Meeting.recvSubscribeMediaResponse(content);
          break;
        case ParMethod.UnSubscribeMediaResponse:
          YTX_Meeting.recvUnSubscribeMediaResponse(content);
          break;
        case ParMethod.PublishMediaResponse:
          YTX_Meeting.recvPublishMediaResponse(content);
          break;
        case ParMethod.UnPublishMediaResponse:
          YTX_Meeting.recvUnPublishMediaResponse(content);
          break;
      } 
    }
    //仅表示服务器接收到了消息
    if(msgLite[3]){}
  };
//////////////////////////////////
  YTX_Meeting.setUserData = function(userData){
    YTX_Meeting.userData = userData;
  };
/////////////////////////Transport////////////////////////////
  YTX_Meeting.sendV1Message = function(message, callback, onError){
    if(!message[ParKey.MessageType]){
      let encodeObj = {};
      encodeObj["MsgLite"] = {};
      encodeObj["MsgLite"][ParKey.MessageType] = ParValue.Conference;
      encodeObj["MsgLite"][ParKey.MessageContent] = {};
      encodeObj["MsgLite"][ParKey.MessageContent]["ConferenceMessage"] = {};
      encodeObj["MsgLite"][ParKey.MessageContent]["ConferenceMessage"]["1"] = message.getPath();
      encodeObj["MsgLite"][ParKey.MessageContent]["ConferenceMessage"]["2"] = Base64.encode(JSON.stringify(message.getContent()));
      
      let result = {};
      result.sendMsg = encodeObj;
      YTX_Meeting.transport.send(result, callback, onError)
      return;
    }
    if(message[ParKey.MessageType] == ParValue.Call){
      let encodeObj = {};
      encodeObj["MsgLite"] = message;

      let result = {};
      result.sendMsg = encodeObj;
      result.callId = YTX_Meeting.callId;
      YTX_Meeting.transport.send(result, callback, onError)
      return;
    }
  };

  YTX_Meeting.sendV3Message = function(message, callback, onError){
    //会议消息,没有太好的区分方法，暂时先以消息类型是否存在来区分
    if(!message[ParKey.MessageType]){
      YTX_Meeting.transport.send({
        sendObj: {
            1: message.getPath(),
            2: Base64.encode(JSON.stringify(message.getContent()))
        },
        MsgLiteObj: {
            1: ParValue.Conference
        },
        msgKey: 'ConferenceMessage'
      }, callback, onError);
      return;
    }
    //呼叫消息
    if(message[ParKey.MessageType] == ParValue.Call){
      YTX_Meeting.transport.send({
        sendObj: message[2].CallEventDataInner,
        MsgLiteObj: {
            1: message[1],
            9: message[9]
        },
        msgKey: 'CallEventDataInner',
        clientData: {
            msgId: YTX_Meeting.callId
        },
      }, function (res) {
        //console.debug(YTX_Meeting.getTimeStamp(), "[Meeting] Send Message Success:", res);
      }, function(err) {
        //console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Send Message Fail:", err);
      });
      return;
    }
  };

  YTX_Meeting.sendMessage = function(message, callback, onError){
    if(!YTX_Meeting.transport.send){
      YTX_Meeting.transport.format = "Format-V3";
      YTX_Meeting.transport.send = ROOT.RL_YTX_NEW.sendMsg;
    }
    //根据format设置不同的传参格式，适配不同的传输层，v1,v3是双方约定的参数格式，没有特殊含义
    if(YTX_Meeting.transport.format == "Format-V1"){
      YTX_Meeting.sendV1Message(message, callback, onError);
    }
    if(YTX_Meeting.transport.format == "Format-V3"){
      YTX_Meeting.sendV3Message(message, callback, onError);
    }
  };
///////////////////////////////////////////////////////////////////////////////
  YTX_Meeting.getTimeStamp = function () {
    let now = new Date();
    let timestamp = "[";
    timestamp += now.getFullYear();
    timestamp += (now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : "0" + (now.getMonth() + 1);
    timestamp += now.getDate() >= 10 ? now.getDate() : "0" + now.getDate();
    timestamp += " ";
    timestamp += now.getHours() >= 10 ? now.getHours() : "0" + now.getHours();
    timestamp += ":";
    timestamp += now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes();
    timestamp += ":";
    timestamp += now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds();
    timestamp += ".";
    timestamp += now.getMilliseconds();
    timestamp += "]";
    return timestamp;
  }
  //h264@102@102
  YTX_Meeting.parseVideoCodec = function(recvSdp){
    //let payloadType = recvSdp.split("m=video")[1].split(" ")[3].split("\r\n")[0];
    //let codec = recvSdp.split("a=rtpmap:" + payloadType + " ")[1].split("/")[0];
    //return codec + "@" + payloadType + "@" + payloadType;
    let codec = "";
    let payloadType = -1;    
    let lines = recvSdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if(line.indexOf("m=video") >= 0){
        payloadType = line.split(" ")[3];
      }
      if(line.indexOf("a=rtpmap:" + payloadType) >= 0){
        codec = line.split(" ")[1].split("/")[0];
      }
    }
    return codec + "@" + payloadType + "@" + payloadType;
  };

  YTX_Meeting.parseRecvSdp = function(recvSdp){
    let resultSdp = "";
    let cursor = "";
    let lines = recvSdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.indexOf("m=audio") >= 0){
        cursor = "audio";
      }
      if(line.indexOf("m=video") >= 0){
        cursor = "video";
      }
      if(line.indexOf("self=1")>= 0){
        if(cursor == "audio"){
          YTX_Meeting.selfSsrc = line.split(":")[1].split(" ")[0];
        }
        continue;
      }
      if(line.indexOf("partner=1") >= 0){
        if(cursor == "audio"){
          YTX_Meeting.antiSsrc = line.split(":")[1].split(" ")[0];
        }
        continue;
      }
      if(line.length > 2){
        resultSdp += line;
      }
    }
    return resultSdp;
  };

  YTX_Meeting.checkCallId = function(content){
    let callEventData = content["CallEventData"];     
    let callId = callEventData[ParKey.CallId];
    if(callId != YTX_Meeting.callId){
      console.warn(YTX_Meeting.getTimeStamp(), "[Meeting] Message callid err");
      return false;
    }
    return true;
  };

////////////////callout///////////////////// 
  YTX_Meeting.eventListener = function (event) {
    if(YTX_Meeting.operation == COperation.Calling){
      if(!event.caller){
        event.caller = YTX_Meeting.caller;
      }
      event.called = YTX_Meeting.called;
      event.callId = YTX_Meeting.callId;
      event.userdata = YTX_Meeting.userData;
      event.mediaType = YTX_Meeting.mediaType;
      event.callType = YTX_Meeting.mediaType; //兼容容信
      YTX_Meeting.onCallEvent(event);
    }
  };

  YTX_Meeting.makeCall = function(parameter, onSuccess, onFail){
    if(YTX_Meeting.connState != CState.Disconnected)
    {
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] MakeCall Fail, ConnState:", YTX_Meeting.connState);
      return;
    }
    YTX_Meeting.initWebrtc();
    YTX_Meeting.connState = CState.Connecting;
    YTX_Meeting.makeCallFailCallback = onFail;
    YTX_Meeting.makeCallSuccessCallback = onSuccess;
    if(!parameter.caller || !parameter.called){
      let err = {};
      err.name = "MakeCall fail";
      err.message = "parameter error";
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] MakeCall parameter err, caller:", parameter.caller, ", called:", parameter.called);
      YTX_Meeting.makeCallFail(err);
      return;
    }
    let randomNum = "";
    let timeStamp = new Date().getTime();
    for (var i = 0; i < 6; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }
    YTX_Meeting.callId = timeStamp + randomNum;
    YTX_Meeting.caller = parameter.caller;
    YTX_Meeting.called = parameter.called;
    YTX_Meeting.mediaType = parameter.mediaType;
    if(parameter.callFlag){
      YTX_Meeting.callFlag = parameter.callFlag;
    }
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] MakeCall, caller:", parameter.caller
    , ", called:", parameter.called, ", mediaType:", parameter.mediaType
    , ", callFlag:", parameter.callFlag);
    
    if(YTX_Meeting.mediaType == MType.Audio){
      YTX_Webrtc.getLocalAudioStream()
      .then(function(stream){
        YTX_Meeting.startLocalMedia(stream, MType.Audio);
        YTX_Webrtc.addLocalAudioStream(stream);
        return YTX_Webrtc.createLocalOffer()
      })
      .then(function(sdp){
        YTX_Meeting.sendInvite(sdp);
      })
      .catch(function(err){
        YTX_Meeting.makeCallFail(err);
      })
    }else{
      YTX_Webrtc.getLocalAudioStream()
      .then(function(stream){
        YTX_Meeting.startLocalMedia(stream, MType.Audio);
        YTX_Webrtc.addLocalAudioStream(stream);
        return YTX_Webrtc.getLocalVideoStream()
      })
      .then(function(stream){
        YTX_Meeting.startLocalMedia(stream, MType.Video);
        YTX_Webrtc.addLocalVideoStream(stream);
        return YTX_Webrtc.createLocalOffer()
      })
      .then(function(sdp){
        YTX_Meeting.sendInvite(sdp);
      })
      .catch(function(err){
        YTX_Meeting.makeCallFail(err);
      })
    }
  };
//////////////////////////////////////
  YTX_Meeting.sendInvite = function(sdp) {  
    let clientNo = YTX_Meeting.clientNo++;
    let invite = new YTX_Protobuf.callMessage();
    invite.setMethod(ParMethod.Invite);
    invite.setIsvoipCall(1);
    invite.setCallId(YTX_Meeting.callId);
    invite.setCalled(YTX_Meeting.called);
    invite.setCaller(YTX_Meeting.caller);
    invite.setUserData(YTX_Meeting.userData);
    invite.setSdp(sdp);
    invite.setSeq(clientNo.toString());
    invite.setClientNo(clientNo);
    invite.setCallrouteId(YTX_Meeting.callRouteId);
    if(YTX_Meeting.callFlag){
      if(YTX_Meeting.callFlag == YTX_Call_Flag.LandPhone){
        invite.setToThird("000");
      }else if(YTX_Meeting.callFlag == YTX_Call_Flag.Polycom){
        invite.setToThird("020");
      }else if(YTX_Meeting.callFlag == YTX_Call_Flag.Cisco){
        invite.setToThird("030");
      }
    }

    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send Invite, caller:", YTX_Meeting.caller, ", called:", YTX_Meeting.called, 
        ", callid:", YTX_Meeting.callId, ", clientNo:", clientNo);
    YTX_Meeting.sendMessage(invite);

    if(YTX_Meeting.connState == CState.Connecting){
      YTX_Meeting.makeCallTimerId = setTimeout(function () {
        YTX_Meeting.makeCallNoAnswer();
      }, 35*1000);
      return;
    }
    if(YTX_Meeting.connState == CState.Updating){
      YTX_Meeting.updateCallTimerId = setTimeout(function () {
        let err = {};
        err.name = "UpdateMedia fail";
        err.message = "Server Timeout";
        YTX_Meeting.updateMediaFail(err);
      }, 5*1000);
      return;
    }
  };

  YTX_Meeting.recvRefuse = function(content){
    if(!YTX_Meeting.checkCallId(content)){
      return;
    }
    if(YTX_Meeting.connState == CState.Connecting || YTX_Meeting.connState == CState.Alerting){
      let callEventData = content["CallEventData"]; 
      let cause = callEventData[ParKey.Cause];
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Refuse, cause:", cause);
      YTX_Meeting.sendAck();

      let err = {};
      err.name = "MakeCall fail";
      err.message = "Server Refuse, Cause:" + cause;
      err.reason = "175" + cause;
      YTX_Meeting.makeCallFail(err);
      return;
    }
    if(YTX_Meeting.connState == CState.Updating){
      let callEventData = content["CallEventData"]; 
      let cause = callEventData[ParKey.Cause];
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Refuse, cause:", cause);
      YTX_Meeting.sendAck();

      let err = {};
      err.name = "UpdateMedia fail";
      err.message = "Server Refuse, Cause:" + cause;
      err.reason = "175" + cause;
      YTX_Meeting.updateMediaFail(err);
      return;
    }
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Refuse, currstate:", YTX_Meeting.connState);
  };

  YTX_Meeting.recv100Trying = function(content){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv100Trying");
  };

  YTX_Meeting.recvRing = function(content){
    if(!YTX_Meeting.checkCallId(content)){
      return;
    }
    if(YTX_Meeting.connState == CState.Connecting){
      let callEventData = content["CallEventData"];     
      YTX_Meeting.userData = callEventData[ParKey.UserData];
      YTX_Meeting.connState = CState.Alerting;
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Ring, userData:", YTX_Meeting.userData);
  
      YTX_Meeting.eventListener({
        state: 1,
        msg: "Alerting"
      });
      return;
    }
    if(YTX_Meeting.connState == CState.Updating){
      //nothing
      return;
    }
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Ring, has Alerting, currstate:", YTX_Meeting.connState);
  };

  YTX_Meeting.recv200OK = function(content){
    if(!YTX_Meeting.checkCallId(content)){
      return;
    }
    if(YTX_Meeting.connState == CState.Connecting || YTX_Meeting.connState == CState.Alerting){
      YTX_Meeting.handleAnswer200(content);
      return;
    }
    if(YTX_Meeting.connState == CState.Updating){
      YTX_Meeting.handleUpdate200(content);
      return;
    }
    if(YTX_Meeting.connState == CState.Disconnecting){
      YTX_Meeting.handleBye200(content);
      return;
    }
    console.warn(YTX_Meeting.getTimeStamp(), "[Meeting] Recv 200OK,but ConnState err:", YTX_Meeting.connState);
  };

  YTX_Meeting.handleAnswer200 = function(content){

    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Answer 200OK");
    clearTimeout(YTX_Meeting.makeCallTimerId);
    YTX_Meeting.connState = CState.Connected;    

    let callEventData = content["CallEventData"];
    let userData = callEventData[ParKey.UserData];
    //解析selfssrc，antissrc，删除self=1，partner=1，需要新版callroute支持
    YTX_Meeting.userData = userData;
    YTX_Meeting.recvAnswerSdp = YTX_Meeting.parseRecvSdp(content["CallEventData"][ParKey.Sdp]);
    YTX_Meeting.antiVideoCodec = YTX_Meeting.parseVideoCodec(YTX_Meeting.recvAnswerSdp);
    //兼容旧版本callroute
    if(!YTX_Meeting.selfSsrc){
      YTX_Meeting.selfSsrc = YTX_Meeting.recvAnswerSdp.split("m=audio")[1].split("a=ssrc:")[1].split(" ")[0];
    }
    console.debug(YTX_Meeting.getTimeStamp(), "[Meeting] Parse selfssrc:", YTX_Meeting.selfSsrc, ", antiSsrc:", YTX_Meeting.antiSsrc, ", antiVideoCodec:", YTX_Meeting.antiVideoCodec);
    YTX_Meeting.sendAck();

    YTX_Webrtc.handleAnswer(YTX_Meeting.recvAnswerSdp)
    .then(function(){
      YTX_Meeting.makeCallSuccess();
    })
    .catch(function(err){
      YTX_Meeting.makeCallFail(err);
    })
  };

  YTX_Meeting.handleUpdate200 = function(content){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Update 200OK");
    clearTimeout(YTX_Meeting.updateCallTimerId);
    YTX_Meeting.sendAck();
    YTX_Meeting.updateMediaSuccess();
  };

  YTX_Meeting.handleBye200 = function(content){    
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Bye/Cancel 200OK");
    YTX_Meeting.releaseCallSuccess();
  };
  
  YTX_Meeting.sendAck = function(){
    var clientNo = YTX_Meeting.clientNo++;
    var ack = new YTX_Protobuf.callMessage();
    ack.setMethod(ParMethod.ACK);
    ack.setCallId(YTX_Meeting.callId);
    //根据之前的规则，反向设置
    ack.setCalled(YTX_Meeting.caller);
    ack.setCaller(YTX_Meeting.called);
    ack.setCause("0");
    ack.setUserData(YTX_Meeting.userData);
    ack.setSeq(clientNo.toString());
    ack.setClientNo(clientNo);
    ack.setCallrouteId(YTX_Meeting.callRouteId); 

    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send ACK");
    YTX_Meeting.sendMessage(ack);
    
  };

  YTX_Meeting.recvBye = function(content){
    //会调用reset函数，无需处理重复消息
    if(!YTX_Meeting.checkCallId(content)){
      return;
    }
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Bye");
    YTX_Meeting.eventListener({
      state: 5,
      msg: "Release"
    });
    YTX_Meeting.reset();
  };

  YTX_Meeting.releaseCall = function(onSuccess, onFail){
    YTX_Meeting.releaseCallFailCallback = onFail;
    YTX_Meeting.releaseCallSuccessCallback = onSuccess;

    if(YTX_Meeting.connState == CState.Connecting || YTX_Meeting.connState == CState.Alerting){
      YTX_Meeting.sendCancel();
      return;
    }
    if(YTX_Meeting.connState == CState.Connected){
      YTX_Meeting.sendBye();
      return;
    }
    YTX_Meeting.releaseCallSuccess();
  };

  YTX_Meeting.sendCancel = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send Cancel");
    YTX_Meeting.connState = CState.Disconnecting;

    let clientNo = YTX_Meeting.clientNo++;
    let callMessage = new YTX_Protobuf.callMessage();
    callMessage.setMethod(ParMethod.Cancel);
    callMessage.setCallId(YTX_Meeting.callId);
    callMessage.setCaller(YTX_Meeting.caller);
    callMessage.setCalled(YTX_Meeting.called);
    callMessage.setCause("0");
    callMessage.setUserData(YTX_Meeting.userData);
    callMessage.setSeq(clientNo.toString());
    callMessage.setClientNo(clientNo);
    callMessage.setCallrouteId(YTX_Meeting.callRouteId);
    YTX_Meeting.sendMessage(callMessage);

    YTX_Meeting.releaseCallTimerId = setTimeout(function () {
      let err = {};
      err.name = "ReleaseCall fail";
      err.message = "Server Timerout";
      YTX_Meeting.releaseCallFail(err);
    }, 5*1000);
  };

  YTX_Meeting.sendBye = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send bye");
    YTX_Meeting.connState = CState.Disconnecting;

    let clientNo = YTX_Meeting.clientNo++;
    let callMessage = new YTX_Protobuf.callMessage();
    callMessage.setMethod(ParMethod.Bye);
    callMessage.setCallId(YTX_Meeting.callId);
    callMessage.setCaller(YTX_Meeting.caller);
    callMessage.setCalled(YTX_Meeting.called);
    callMessage.setCause("0");
    callMessage.setUserData(YTX_Meeting.userData);
    callMessage.setSeq(clientNo.toString());
    callMessage.setClientNo(clientNo);
    callMessage.setCallrouteId(YTX_Meeting.callRouteId);
    YTX_Meeting.sendMessage(callMessage);

    YTX_Meeting.releaseCallTimerId = setTimeout(function () {
      let err = {};
      err.name = "ReleaseCall fail";
      err.message = "Server Timerout";
      YTX_Meeting.releaseCallFail(err);
    }, 5*1000);
  };
//////////////////
  YTX_Meeting.makeCallSuccess = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] MakeCall Success");
    YTX_Meeting.makeCallSuccessCallback();
    YTX_Meeting.eventListener({
      state: 3,
      msg: "Answered"
    });
    //兼容容信版本
    let obj = {};
    obj["state"] = 16;
    obj["code"] = 200;
    obj["msg"] = "Meeting connction has established;";
    YTX_Meeting.confEventListener(obj);
  };

  YTX_Meeting.makeCallNoAnswer = function(){
    let err = {};
    err.name = "MakeCall fail";
    err.message = "No Answer";
    console.error(YTX_Meeting.getTimeStamp(), "[Meeting] MakeCall No Answer");
    YTX_Meeting.releaseCall();
    YTX_Meeting.makeCallFailCallback(err);
  };

  YTX_Meeting.makeCallFail = function(err){
    console.error(YTX_Meeting.getTimeStamp(), "[Meeting] MakeCall Fail, errName:", err.name, ", errMessage:", err.message);
    YTX_Meeting.reset();
    YTX_Meeting.makeCallFailCallback(err);
  };
/////////////////////////////////////////////////
  YTX_Meeting.releaseCallSuccess = function(){
    YTX_Meeting.reset();
    if(YTX_Meeting.releaseCallSuccessCallback){
      YTX_Meeting.releaseCallSuccessCallback();
    }
  };

  YTX_Meeting.releaseCallFail = function(err){
    YTX_Meeting.reset();
    if(YTX_Meeting.releaseCallFailCallback){
      YTX_Meeting.releaseCallFailCallback(err);
    }
  };
///////////////////////callin/////////////////////
  YTX_Meeting.recvReInvite = function(msgLite){
    let content = msgLite[ParKey.MessageContent];
    let callEventData = content["CallEventData"];
    let recvSdp = callEventData[ParKey.Sdp];
    let videoPort = SDPParser.getVideoPort(recvSdp);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv ReInvite, videoPort:", videoPort);
   
    if(YTX_Meeting.mediaType == MType.Video && videoPort == 0){
      let sdp = SDPParser.disableVideo(YTX_Webrtc._peerConnection.localDescription.sdp);
      YTX_Meeting.mediaType = MType.Audio;
      YTX_Meeting.send200OK(sdp);
      YTX_Webrtc.closeCamera();

      let event = {};
      event.state = 8;
      event.msg = "MediaUpdate";
      event.caller = YTX_Meeting.caller;
      event.called = YTX_Meeting.called;
      event.mediaType = YTX_Meeting.mediaType;
      YTX_Meeting.eventListener(event);
      return;
    }
    YTX_Meeting.send200OK();
  };

  YTX_Meeting.recvInvite = function(msgLite){
    let content = msgLite[ParKey.MessageContent];
    let callRouteId = msgLite[ParKey.CallRouteId];
    let callEventData = content["CallEventData"];
    let callId = callEventData[ParKey.CallId];
    let caller = callEventData[ParKey.Caller];
    let called = callEventData[ParKey.Called];
    let userData = callEventData[ParKey.UserData];
    let sdp = callEventData[ParKey.Sdp];
    if(YTX_Meeting.connState != CState.Disconnected){
      //可能是重复消息，也可能是新的呼叫      
      if(callId == YTX_Meeting.callId){
        if(YTX_Meeting.connState == CState.Connected){
          YTX_Meeting.recvReInvite(msgLite);
          return;
        }
        console.warn(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Repeat Invite");
        return;
      }
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Invite User Busy");
      let parameter = {};
      parameter.code = "486";
      parameter.callId = callId;
      parameter.caller = caller;
      parameter.called = called;
      parameter.callRouteId = callRouteId;
      YTX_Meeting.sendUserBusy(parameter);
      //上报未接来电事件
      YTX_Meeting.eventListener({
        state: 7,
        msg: "Missed Call",
        called: parameter.called
      });
      return;
    }
    YTX_Meeting.connState = CState.Connecting;
    YTX_Meeting.callRouteId = callRouteId;
    YTX_Meeting.callId = callId;
    YTX_Meeting.caller = caller;
    YTX_Meeting.called = called;
    YTX_Meeting.userData = userData;
    YTX_Meeting.recvInviteSdp = YTX_Meeting.parseRecvSdp(sdp);//解析selfssrc，antissrc
    YTX_Meeting.recvInviteSdp = SDPParser.rewriteAudioCodec(YTX_Meeting.recvInviteSdp);
    YTX_Meeting.recvInviteSdp = YTX_Meeting.recvInviteSdp.replace("a=setup:active", "a=setup:actpass");//临时解决方案
    YTX_Meeting.recvInviteSdp = YTX_Meeting.recvInviteSdp.replace("a=setup:active", "a=setup:actpass");
    if(YTX_Meeting.recvInviteSdp.indexOf("m=video") > 0){
      YTX_Meeting.mediaType = MType.Video;
    }
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Invite, caller:", YTX_Meeting.caller, 
            ", called:", YTX_Meeting.called, ", mediaType:", YTX_Meeting.mediaType, ", callRouteId:", YTX_Meeting.callRouteId);
    console.debug("[Meeting] sdp:", YTX_Meeting.recvInviteSdp);
    YTX_Meeting.sendRing180();

    //上报呼叫事件
    YTX_Meeting.eventListener({
      state: 6,
      msg: "Invite"
    });
  };

  YTX_Meeting.sendUserBusy = function(parameter){
    let clientNo = YTX_Meeting.clientNo++;
    let message = new YTX_Protobuf.callMessage();
    message.setMethod(ParMethod.Refuse);
    message.setCallId(parameter.callId);
    message.setCaller(parameter.caller);
    message.setCalled(parameter.called);
    message.setCause(parameter.code);
    message.setSeq(clientNo.toString());
    message.setClientNo(clientNo);
    message.setCallrouteId(parameter.callRouteId);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send UserBusy, code:", parameter.code);
    YTX_Meeting.sendMessage(message);
  };

  YTX_Meeting.sendRing180 = function(){
    let clientNo = YTX_Meeting.clientNo++;
    let ring = new YTX_Protobuf.callMessage();
    ring.setMethod(ParMethod.Ring);
    ring.setCallId(YTX_Meeting.callId);
    ring.setCaller(YTX_Meeting.caller);
    ring.setCalled(YTX_Meeting.called);
    ring.setCause("0");
    ring.setSeq(clientNo.toString());
    ring.setClientNo(clientNo);
    ring.setCallrouteId(YTX_Meeting.callRouteId);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send 180 ring");
    YTX_Meeting.sendMessage(ring);   
  };

  YTX_Meeting.recvCancel = function(content){
    if(!YTX_Meeting.checkCallId(content)){
      return;
    }
    let callEventData = content["CallEventData"]; 
    let cause = callEventData[ParKey.Cause];
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Cancel, cause:", cause);
    YTX_Meeting.send200OK();
    YTX_Meeting.eventListener({
      state: 5,
      msg: "Release",
      reason: "175" + cause
    });
    YTX_Meeting.reset();
  };
  
  YTX_Meeting.send200OK = function(sdp){
    let clientNo = YTX_Meeting.clientNo++;
    let answer = new YTX_Protobuf.callMessage();
    answer.setMethod(ParMethod.Answer);
    answer.setCallId(YTX_Meeting.callId);
    answer.setCaller(YTX_Meeting.caller);
    answer.setCalled(YTX_Meeting.called);
    if(sdp){
      answer.setSdp(sdp);
    }
    answer.setCause("0");
    answer.setUserData(YTX_Meeting.userData);
    answer.setSeq(clientNo.toString());
    answer.setClientNo(clientNo);
    answer.setCallrouteId(YTX_Meeting.callRouteId);
    
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send 200ok");
    YTX_Meeting.sendMessage(answer);
  };

  YTX_Meeting.rejectCall = function(onSuccess, rejectFail){
    YTX_Meeting.sendRefuse({code: "603"});
    YTX_Meeting.reset();
    onSuccess();
  }

  YTX_Meeting.sendRefuse = function(parameter){
    let clientNo = YTX_Meeting.clientNo++;
    let refuse = new YTX_Protobuf.callMessage();
    refuse.setMethod(ParMethod.Refuse);
    refuse.setCallId(YTX_Meeting.callId);
    refuse.setCaller(YTX_Meeting.caller);
    refuse.setCalled(YTX_Meeting.called);
    if(!parameter.code){
      parameter.code = "480";
    }
    refuse.setCause(parameter.code);
    refuse.setSeq(clientNo.toString());
    refuse.setClientNo(clientNo);
    refuse.setCallrouteId(YTX_Meeting.callRouteId);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send Refuse, code:", parameter.code);
    YTX_Meeting.sendMessage(refuse);   
  };

  YTX_Meeting.recvAck = function(content){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv Ack");
  }

  YTX_Meeting.acceptCall = function(onSuccess, onFail){    
    if(YTX_Meeting.connState != CState.Connecting){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Accept Call status err, connState:", YTX_Meeting.connState);
      return;
    }
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Accept Call");
    YTX_Meeting.initWebrtc();
    YTX_Meeting.connState = CState.Connected;
    YTX_Meeting.direction = CDirection.Answer;
    YTX_Meeting.acceptCallFailCallback = onFail;
    YTX_Meeting.acceptCallSuccessCallback = onSuccess;

    if(YTX_Meeting.mediaType == MType.Audio){
      YTX_Webrtc.getLocalAudioStream()
      .then(function(stream){
        YTX_Meeting.startLocalMedia(stream, MType.Audio);
        YTX_Webrtc.addLocalAudioStream(stream);
        return YTX_Webrtc.handleOffer(YTX_Meeting.recvInviteSdp);
      })
      .then(function(answerSdp){
        YTX_Meeting.sendAnswer(answerSdp);
      })
      .catch(function(err){
        YTX_Meeting.acceptCallFail(err);
      })
    }else{
      YTX_Webrtc.getLocalAudioStream()
      .then(function(stream){
        YTX_Meeting.startLocalMedia(stream, MType.Audio);
        YTX_Webrtc.addLocalAudioStream(stream);
        return YTX_Webrtc.getLocalVideoStream()
      })
      .then(function(stream){
        YTX_Meeting.startLocalMedia(stream, MType.Video);
        YTX_Webrtc.addLocalVideoStream(stream);
        return YTX_Webrtc.handleOffer(YTX_Meeting.recvInviteSdp);
      })
      .then(function(answerSdp){
        YTX_Meeting.sendAnswer(answerSdp);
      })
      .catch(function(err){
        YTX_Meeting.acceptCallFail(err);
      })
    }
  };

  YTX_Meeting.acceptCallEx = function(parameter, onSuccess, onFail){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] acceptCallEx Call, MediaType:", parameter.mediaType);
    if(parameter.mediaType == MType.Audio && YTX_Meeting.mediaType == MType.Video){
      YTX_Meeting.mediaType = MType.Audio;
      YTX_Meeting.recvInviteSdp = SDPParser.disableVideo(YTX_Meeting.recvInviteSdp);
    }
    YTX_Meeting.acceptCall(onSuccess, onFail);
  };

  YTX_Meeting.sendAnswer = function(sdp){
    YTX_Meeting.antiVideoCodec = YTX_Meeting.parseVideoCodec(sdp);

    let clientNo = YTX_Meeting.clientNo++;
    let answer = new YTX_Protobuf.callMessage();
    answer.setMethod(ParMethod.Answer);
    answer.setCallId(YTX_Meeting.callId);
    answer.setCaller(YTX_Meeting.caller);
    answer.setCalled(YTX_Meeting.called);
    answer.setCause("0");
    answer.setUserData(YTX_Meeting.userData);
    answer.setSdp(sdp);
    answer.setSeq(clientNo.toString());
    answer.setClientNo(clientNo);
    answer.setCallrouteId(YTX_Meeting.callRouteId);
    
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send Answer, parsevideocodec:", YTX_Meeting.antiVideoCodec);
    YTX_Meeting.sendMessage(answer);
    YTX_Meeting.acceptCallSuccess();

    //兼容容信旧版本
    YTX_Meeting.eventListener({
      state: 3,
      msg: "Answered"
    });
  };
////////////////////////////////////
  YTX_Meeting.acceptCallSuccess = function(){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] AcceptCall Success");
    YTX_Meeting.acceptCallSuccessCallback();
  };

  YTX_Meeting.acceptCallFail = function(err){
    console.error(YTX_Meeting.getTimeStamp(), "[Meeting] AcceptCall Fail, errName:", err.name, ", errMessage:", err.message);
    YTX_Meeting.sendRefuse({code: "480"});
    YTX_Meeting.reset();
    YTX_Meeting.acceptCallFailCallback(err);
  };
//////////////////////
  YTX_Meeting.startLocalMedia = function(stream, mediaType){
    if(stream){
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Start LocalMedia, mediaType:", mediaType);
      YTX_Meeting.onPublishMedia(stream, mediaType);
    }
  }

  YTX_Meeting.updateMedia = function(request){
    if(YTX_Meeting.connState != CState.Connected){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] update Media Call status err, connState:", YTX_Meeting.connState);
      return;
    }
    let mediaType = request.mediaType;
    YTX_Meeting.updateCallFailCallback = request.onFail;
    YTX_Meeting.updateCallSuccessCallback = request.onSuccess;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] update Media, mediaType:", mediaType);
    if(mediaType == YTX_Meeting.mediaType){
      YTX_Meeting.updateMediaSuccess();
      return;
    }
    let sdp = YTX_Webrtc._peerConnection.localDescription.sdp;
    if(mediaType == MType.Audio){
      YTX_Webrtc.stopLocalVideoStream();
      sdp = SDPParser.disableVideo(sdp);
    }
    if(mediaType == MType.Video){

    }
    YTX_Meeting.sendInvite(sdp);
    };
//////////////////////
  YTX_Meeting.subscribeMedia = function(request){    
    let antissrc = request.antiSsrc;
    let antiEncodeType = request.antiEncodeType;
    let mediaType = request.mediaType;
    let userId = request.userId;
    let userName = request.userName;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send SubscribeMediaRequest, userName:", userName, ", userId", userId, 
        ", selfssrc:", YTX_Meeting.selfSsrc, ", antissrc:", antissrc, ", antiEncodeType:", antiEncodeType, ", mediaType:", mediaType);

    if(!antissrc || !antiEncodeType || !mediaType || !userId || !userName){
      let err = {};
      err.name = "SubscribeMedia Fail";
      err.message = "parameter err";
      YTX_Meeting.subscribeMediaFail(request, err);
      return;
    }
    let customData = {};
    let clientNo = YTX_Meeting.clientNo++;
    let subMesssage = new YTX_Protobuf.callMessage();
    customData.confId = YTX_Meeting.confId;
    customData.antissrc = antissrc;
    customData.resolution = "5";
    customData.mediaType = mediaType;
    customData.antiEncodeType = antiEncodeType;
    customData.selfssrc = YTX_Meeting.selfSsrc;
    customData.mediaSdp = Base64.encode(YTX_Webrtc._peerConnection.localDescription.sdp);
    subMesssage.setMethod(ParMethod.SubscribeMediaRequest);
    subMesssage.setCallId(YTX_Meeting.callId);
    subMesssage.setCaller(YTX_Meeting.caller);
    subMesssage.setCalled(YTX_Meeting.called);
    subMesssage.setCustomData(JSON.stringify(customData));
    subMesssage.setSeq(clientNo.toString());
    subMesssage.setClientNo(clientNo);
    subMesssage.setCallrouteId(YTX_Meeting.callRouteId);
    YTX_Meeting.sendMessage(subMesssage);

    request.clientNo = clientNo;
    request.timerId = setTimeout(function () {
      clearTimeout(request.timerId);
      YTX_Meeting.requestMap.delete(request.clientNo);
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] TimerOut ClearTimerId:", request.timerId, ", Delete ClientNo:", request.clientNo);
      
      let err = {};
      err.userId = userId;
      err.userName = userName;
      err.name = "SubscribeMedia Fail";
      err.message = "Timerout";
      YTX_Meeting.subscribeMediaFail(request, err);
    }, 5*1000);
    YTX_Meeting.requestMap.set(clientNo, request);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] SetTimerId:", request.timerId, ", Insert ClientNo:", request.clientNo);
  };

  YTX_Meeting.recvSubscribeMediaResponse = function(content){
    let callEventData = content["CallEventData"];
    let customData = JSON.parse(callEventData[ParKey.CustomData]);
    let status = customData.status;
    let recvSdp = Base64.decode(customData.mediaSdp);
    let clientNo = Number(callEventData[ParKey.Seq]);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv SubscribeMediaResponse");

    if(!YTX_Meeting.requestMap.has(clientNo)){
      console.warn(YTX_Meeting.getTimeStamp(), "[Meeting] handleSubscribeMediaResponse clientNo not exsit:", clientNo);
      return;
    };
    let request = YTX_Meeting.requestMap.get(clientNo);
    clearTimeout(request.timerId);
    YTX_Meeting.requestMap.delete(request.clientNo);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] ClearTimerId:", request.timerId, ", Delete ClientNo:", request.clientNo);

    if(status != "200"){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Recv SubscribeMediaResponse fail status:", status);
      let err = {};
      err.name = "SubscribeMedia Fail";
      err.message = "Server Error, Status:", status;
      YTX_Meeting.subscribeMediaFail(request, err);
      return;
    }

    YTX_Webrtc.addRemoteStream(request.userName, request.userId, request.mediaType, recvSdp);
    YTX_Webrtc.updateRemoteSdp()
    .then(function(){
      YTX_Meeting.subscribeMediaSuccess(request);
    })
    .catch(function(err){
      YTX_Meeting.subscribeMediaFail(request, err);
    })
  };

  YTX_Meeting.unSubscribeMedia = function(request){
    let antissrc = request.antiSsrc;
    let mediaType = request.mediaType;
    let userId = request.userId;
    let userName = request.userName;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send UnSubscribeMediaRequest, userName:", userName, ", userId:", userId, ", mediaType:", mediaType);
    if(!antissrc || !mediaType || !userId || !userName){
      let err = {};
      err.name = "UnSubscribeMedia Fail";
      err.message = "parameter err";
      YTX_Meeting.unSubscribeMediaFail(request, err);
      return;
    }
    let customData = {};
    let clientNo = YTX_Meeting.clientNo++;
    let unSubMessage = new YTX_Protobuf.callMessage();
    customData.confId = YTX_Meeting.confId;
    customData.antissrc = antissrc;
    customData.mediaType = mediaType;
    customData.selfssrc = YTX_Meeting.selfSsrc;
    unSubMessage.setMethod(ParMethod.UnSubscribeMediaRequest);
    unSubMessage.setCallId(YTX_Meeting.callId);
    unSubMessage.setCalled(YTX_Meeting.called);
    unSubMessage.setCaller(YTX_Meeting.caller);
    unSubMessage.setCustomData(JSON.stringify(customData));
    unSubMessage.setSeq(clientNo.toString());
    unSubMessage.setClientNo(clientNo);
    unSubMessage.setCallrouteId(YTX_Meeting.callRouteId);
    YTX_Meeting.sendMessage(unSubMessage);

    request.clientNo = clientNo;
    request.timerId = setTimeout(function () {
      clearTimeout(request.timerId);
      YTX_Meeting.requestMap.delete(request.clientNo);
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] ClearTimerId:", request.timerId, ", Delete ClientNo:", request.clientNo);
      
      let err = {};
      err.name = "UnSubscribeMedia Fail";
      err.message = "Server Timerout";
      YTX_Meeting.unSubscribeMediaFail(request, err);
    }, 5*1000);
    YTX_Meeting.requestMap.set(clientNo, request);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] SetTimerId:", request.timerId, ", Insert ClientNo:", request.clientNo);
  };

  YTX_Meeting.recvUnSubscribeMediaResponse = function(content){
    var callEventData = content["CallEventData"];
    var clientNo = Number(callEventData[ParKey.Seq]);
    var customData = JSON.parse(callEventData[ParKey.CustomData]);
    var status = customData.status;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv UnSubscribeMediaResponse Success status:", status);

    if(!YTX_Meeting.requestMap.has(clientNo)){
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv UnSubscribeMediaResponse clientNo not exsit:", clientNo);
      return;
    };
    let request = YTX_Meeting.requestMap.get(clientNo);
    clearTimeout(request.timerId);
    YTX_Meeting.requestMap.delete(request.clientNo);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] ClearTimerId:", request.timerId, ", Delete ClientNo:", request.clientNo);

    YTX_Webrtc.deleteRemoteStream(request.userName, request.userId, request.mediaType);
    YTX_Webrtc.updateRemoteSdp()
    .then(function(){
      YTX_Meeting.unSubscribeMediaSuccess(request);
    })
    .catch(function(err){
      YTX_Meeting.unSubscribeMediaFail(request, err);
    })
  };

/////////////////////////////screen share////////////////////////////
  YTX_Meeting.addCancelScreenShareRequest = function(){
    let request = {};
    request.messageId = YTX_MessageId.CancelScreenShare;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add CancelScreenShareRequest");
    YTX_Meeting.addRequest(request)
  };

  YTX_Meeting.startScreenShare = function(onSuccess, onFail){
    YTX_Meeting.startScreenShareFailcCallback = onFail;
    YTX_Meeting.startScreenShareSuccessCallback = onSuccess;

    YTX_Webrtc.addLoaclScreenStream()
    .then(function(stream){
      let track = stream.getTracks()[0];
      track.onended = YTX_Meeting.addCancelScreenShareRequest;
      return YTX_Webrtc.createScreenOffer();
    })
    .then(function(sdp){
      YTX_Meeting.sendPublishMediaRequest(sdp);
    })
    .catch(function(err){
      YTX_Meeting.startScreenShareFail(err);
    })
  };

  YTX_Meeting.sendPublishMediaRequest = function(sdp){
    let customData = {};
    let clientNo = YTX_Meeting.clientNo++;
    let publishMediaRequest = new YTX_Protobuf.publishMediaRequest();
    customData.confId = YTX_Meeting.confId;    
    customData.resolution = "5";
    customData.mediaType = "2";
    customData.selfssrc = YTX_Meeting.selfSsrc;
    customData.mediaSdp = Base64.encode(sdp); 
    publishMediaRequest.setCallId(YTX_Meeting.callId);
    publishMediaRequest.setCalled(YTX_Meeting.called);
    publishMediaRequest.setCaller(YTX_Meeting.caller);
    publishMediaRequest.setCustomData(JSON.stringify(customData));
    publishMediaRequest.setSeq(clientNo.toString());
    publishMediaRequest.setClientNo(clientNo);
    publishMediaRequest.setCallrouteId(YTX_Meeting.callRouteId);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send PublishMediaRequest");
    YTX_Meeting.sendMessage(publishMediaRequest);

    YTX_Meeting.connState = CState.ScreenSharing;
    YTX_Meeting.publishMediaTimerId = setTimeout(function () {
      let err = {};
      err.name = "PublishMedia fail";
      err.message = "Server Timerout";
      YTX_Meeting.startScreenShareFail(err);
    }, 5*1000);
  };

  YTX_Meeting.recvPublishMediaResponse = function(content){
    if(YTX_Meeting.connState != CState.ScreenSharing){
      console.warn(YTX_Meeting.getTimeStamp(), "[Meeting] Recv PublishMediaResponse connState err,state:", YTX_Meeting.connState);
      return;
    }
    clearTimeout(YTX_Meeting.publishMediaTimerId);

    let callEventData = content["CallEventData"];
    let customData = JSON.parse(callEventData[ParKey.CustomData]);    
    let status = customData["status"];
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv PublishMediaResponse, status:", status)
    if(status != "200"){
      err = {};
      err.name = "Server PublishMediaResponse err";
      err.message = "Server Response:" + status;    
      YTX_Meeting.startScreenShareFail(err);
      return;
    }
    YTX_Webrtc.handleScreenAnswer()
    .then(function(){
      YTX_Meeting.startScreenShareSuccess();
    })
    .catch(function(err){
      YTX_Meeting.startScreenShareFail(err);
    })
  };
  
//////////////////////////////////////
  YTX_Meeting.cancelScreenShare = function(){
    let customData = {};
    let clientNo = YTX_Meeting.clientNo++;
    let unPublishMediaRequest = new YTX_Protobuf.unPublishMediaRequest();
    customData.confId = YTX_Meeting.confId;    
    customData.mediaType = "2";
    customData.selfssrc = YTX_Meeting.selfSsrc; 
    unPublishMediaRequest.setCallId(YTX_Meeting.callId);
    unPublishMediaRequest.setCalled(YTX_Meeting.called);
    unPublishMediaRequest.setCaller(YTX_Meeting.caller);
    unPublishMediaRequest.setCustomData(JSON.stringify(customData));
    unPublishMediaRequest.setSeq(clientNo.toString());
    unPublishMediaRequest.setClientNo(clientNo);
    unPublishMediaRequest.setCallrouteId(YTX_Meeting.callRouteId);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Send UnPublishMediaRequest");
    YTX_Meeting.sendMessage(unPublishMediaRequest);

    YTX_Meeting.connState = CState.CancelScreenSharing;
    YTX_Meeting.unPublishMediaTimerId = setTimeout(function () {
      let err = {};
      err.name = "UnPublishMedia fail";
      err.message = "Server Timerout";
      YTX_Meeting.cancelScreenShareFail(err);
    }, 5*1000);
  };

  YTX_Meeting.recvUnPublishMediaResponse = function(content){
    if(YTX_Meeting.connState != CState.CancelScreenSharing){
      console.warn(YTX_Meeting.getTimeStamp(), "[Meeting] Recv UnPublishMediaResponse connState err,state:", YTX_Meeting.connState);
      return;
    }
    clearTimeout(YTX_Meeting.unPublishMediaTimerId);  
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Recv UnPublishMediaResponse");
    YTX_Meeting.cancelScreenShareSuccess();
    
    YTX_Webrtc.stopSreenShare()
    //YTX_Webrtc.cancelScreenShare(YTX_Meeting.cancelScreenShareSuccess, YTX_Meeting.cancelScreenShareFail);
  };

///////////////////////////////////////////////////////////////////////
  YTX_Meeting.setOnTrack = function(callback){
    YTX_Webrtc.setOnTrack(callback);
  };

  YTX_Meeting.closeMicrophone = function(){
    YTX_Webrtc.closeMicrophone();
  };

  YTX_Meeting.openMicrophone = function(){
    YTX_Webrtc.openMicrophone();
  };

  YTX_Meeting.closeCamera = function(){
    YTX_Webrtc.closeCamera();
  };

  YTX_Meeting.openCamera = function(){
    YTX_Webrtc.openCamera();
  };

  YTX_Meeting.closeCameraEx = function(onSuccess, onFail){
    YTX_Webrtc.closeCameraEx(onSuccess, onFail);
  };

  YTX_Meeting.openCameraEx = function(onSuccess, onFail){
    YTX_Webrtc.openCameraEx(onSuccess, onFail);
  };

  YTX_Meeting.getMediaDevice = function(onSuccess, onFail){
    YTX_Webrtc.getMediaDevice(onSuccess, onFail);
  };

  YTX_Meeting.chanegeAudioOutput = function(element, deviceId, onSuccess, onFail){
    YTX_Webrtc.chanegeAudioOutput(element, deviceId, onSuccess, onFail);
  };

  YTX_Meeting.changeAudioInput = function(deviceId, onSuccess, onFail){
    YTX_Webrtc.changeAudioInput(deviceId, onSuccess, onFail);
  };

  YTX_Meeting.changeVideoInput = function(deviceId, onSuccess, onFail){
    YTX_Webrtc.changeVideoInput(deviceId, onSuccess, onFail);
  };

  YTX_Meeting.setAudioOptions = function(options){
    YTX_Webrtc.setAudioOptions(options);
  };

  YTX_Meeting.setVideoOptions = function(options){
    YTX_Webrtc.setVideoOptions(options);
  };

  YTX_Meeting.setScreenOptions = function(options){
    YTX_Webrtc.setScreenOptions(options);
  };

  YTX_Meeting.startMediaMonitor = function(parameter, onReport, onError){
    YTX_Webrtc.startMediaMonitor(parameter, onReport, onError);
  };

  YTX_Meeting.stopMediaMonitor = function(){
    YTX_Webrtc.stopMediaMonitor();
  };

  var YTX_MessageId = {};
  YTX_MessageId.StartScreenShare = 3;
  YTX_MessageId.CancelScreenShare = 4;
  YTX_MessageId.SubscribeMedia = 5;
  YTX_MessageId.UnSubscribeMedia = 6;
  YTX_MessageId.UpdateMedia = 7;
//==================================webrtc=====================================//
  var YTX_MediaStream = function(){
    this.type = "";
    this.mid = -1;
    this.des = "";
    this.as = "";

    this.direction = "";
    this.ssrcLines = "";
    this.streamId = "";

    this.userId = "";
    this.userName = "";
    this.ssrc = "";
    this.mediaType = -1;
  }

  var YTX_Webrtc = {};
  YTX_Webrtc.browserDetails = {};
  YTX_Webrtc.sdpSemantics = "unified-plan"; //"plan-b";
  YTX_Webrtc.bundlePolicy = "max-bundle";
  YTX_Webrtc.onTrackCallBack = null;
  YTX_Webrtc.mediaIndex = 1000;

  YTX_Webrtc.echoCancellation = true;
  YTX_Webrtc.autoGainControl = true;
  YTX_Webrtc.noiseSuppression = true;

  YTX_Webrtc.videoWidth = 640;
  YTX_Webrtc.videoHeight = 480;
  YTX_Webrtc.videoFrameRate = 20;
  YTX_Webrtc.maxAudioRate = 80;
  YTX_Webrtc.maxVideoRate = 800;
  YTX_Webrtc.maxScreenRate = 1400;

  //need reset
  YTX_Webrtc._audioRtpSender = null;
  YTX_Webrtc._videoRtpSender = null;
  YTX_Webrtc._screenShareSender = null;
  YTX_Webrtc._peerConnection = null;

  YTX_Webrtc.remoteSdpSession = "";
  YTX_Webrtc.remoteSdpMedia = [];
  YTX_Webrtc.remoteVideoDes = "";

  YTX_Webrtc.reportScreenSdp = "";
  YTX_Webrtc.screenFlag = false;
  
  YTX_Webrtc.monitorTimerId = 0;
  YTX_Webrtc.monitorMap = new Map();

  YTX_Webrtc.reset = function(){
    if(YTX_Webrtc._audioRtpSender){
      YTX_Webrtc._audioRtpSender.track.stop();
      YTX_Webrtc._audioRtpSender = null;
    }
    if(YTX_Webrtc._videoRtpSender){
      YTX_Webrtc._videoRtpSender.track.stop();
      YTX_Webrtc._videoRtpSender = null;
    }
    if(YTX_Webrtc._screenShareSender){
      YTX_Webrtc._screenShareSender.track.stop();
      YTX_Webrtc._screenShareSender = null;
    }
    if(YTX_Webrtc._peerConnection){
      YTX_Webrtc._peerConnection.close();
      YTX_Webrtc._peerConnection = null;
    }
    YTX_Webrtc.remoteSdpSession = "";
    YTX_Webrtc.remoteSdpMedia = [];
    YTX_Webrtc.remoteVideoDes = "";

    YTX_Webrtc.reportScreenSdp = "";
    YTX_Webrtc.screenFlag = false;
    
    YTX_Webrtc.monitorMap.clear();
  };

  YTX_Webrtc.initPeerconnection = function(){
    let config = {
      sdpSemantics:YTX_Webrtc.sdpSemantics,
      bundlePolicy:YTX_Webrtc.bundlePolicy
    };
    let options = {
      optional: [{
        DtlsSrtpKeyAgreement: true
      }]
    };
    // YTX_Webrtc.browserDetails = adapter.browserDetails;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Initialization Webrtc, browser:", YTX_Webrtc.browserDetails.browser, 
      ", version:", YTX_Webrtc.browserDetails.version);
    YTX_Webrtc._peerConnection = new RTCPeerConnection(config, options);
    YTX_Webrtc._peerConnection.ontrack = YTX_Webrtc.onTrack;
  };  

  YTX_Webrtc.setOnTrack = function(callback){
    YTX_Webrtc.onTrackCallBack = callback;
  };

  YTX_Webrtc.closeCamera = function(){
    if(!YTX_Webrtc._videoRtpSender){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] close Camera, But no device");
      return;
    }
    YTX_Webrtc._videoRtpSender.track.enabled = false;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] close Camera");
  };

  YTX_Webrtc.openCamera = function(){
    if(!YTX_Webrtc._videoRtpSender){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] open Camera, But no device");
      return;
    }
    YTX_Webrtc._videoRtpSender.track.enabled = true;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] open Camera");
  };

  YTX_Webrtc.closeCameraEx = function(onSuccess, onFail){
    if(!YTX_Webrtc._videoRtpSender){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] close CameraEx, But no device");
      onFail();
      return;
    }
    YTX_Webrtc._videoRtpSender.track.stop();
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] close CameraEx Success");
    onSuccess();
  };

  YTX_Webrtc.openCameraEx = function(onSuccess, onFail){
    if(!YTX_Webrtc._videoRtpSender){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] open CameraEx, But no device");
      onFail();
      return;
    }
    if(YTX_Webrtc._videoRtpSender.track.readyState == "live"){
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] open CameraEx, isOpened");
      onSuccess();
      return;
    }
    YTX_Webrtc.getLocalVideoStream()
    .then(function(stream){
      YTX_Webrtc._videoRtpSender.replaceTrack(stream.getVideoTracks()[0]);
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] open CameraEx Success");
      onSuccess(stream);
    })
    .catch(function(err){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] open CameraEx, errName:", err.name, ", errMessage:", err.message);
      onFail(err);
    })
  };

  YTX_Webrtc.closeMicrophone = function(){
    YTX_Webrtc._audioRtpSender.track.enabled = false;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] close Microphone");
  };

  YTX_Webrtc.openMicrophone = function(){
    YTX_Webrtc._audioRtpSender.track.enabled = true;
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] open Microphone");
  };

  YTX_Webrtc.getMediaDevice = function(onSuccess, onFail){
    if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
      let err = {};
      err.name = "getMediaDevice error";
      err.message = "Browser or System does not support";
      err.statusCode = CStatusCode.NoDevice;
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] getMediaDevice fail, Browser or System does not support");
      onFail(err);
      return;
    }
    let filterDevices = [];
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        //console.debug(YTX_Meeting.getTimeStamp(), "[Meeting] getMediaDevice:", JSON.stringify(device));
        if(device.deviceId != "default" && device.deviceId != "communications"){
          filterDevices.push(device);
        }
      });
      onSuccess(filterDevices);
    })
    .catch(function(err) {
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] getMediaDevice fail, errName:", err.name, ", errMessage:", err.message);
      onFail(err);
    });
  };
  
  YTX_Webrtc.chanegeAudioOutput = function(element, deviceId, onSuccess, onFail){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] chanege AudioOutput element:", element, ", deviceId:", deviceId);
    element.setSinkId(deviceId)
    .then(function() {
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] chanege AudioOutput Success");
      onSuccess();
    })
    .catch(function(err) {
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] chanege AudioOutput fail, errName:", err.name, ", errMessage:", err.message);
      onFail(err);
    });
  };

  YTX_Webrtc.changeAudioInput = function(deviceId, onSuccess, onFail){
    var constraints = {
      audio: {deviceId: deviceId},
      video: false
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      YTX_Webrtc._audioRtpSender.track.stop();
      YTX_Webrtc._audioRtpSender.replaceTrack(stream.getAudioTracks()[0]);
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] changeAudioInput success, deviceId:", deviceId); 
      onSuccess();
    })
    .catch(function(err) {   
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] changeAudioInput fail, deviceId:", deviceId, 
        ", errName:", err.name, ", errMessage:", err.message); 
      onFail(err);
    })
  };

  YTX_Webrtc.changeVideoInput = function(deviceId, onSuccess, onFail){
    let constraints = {
      audio: false,
      video: {
        deviceId: deviceId,
        width: { max: YTX_Webrtc.videoWidth },
        height: { max: YTX_Webrtc.videoHeight },
        frameRate: { max: YTX_Webrtc.videoFrameRate }
      }
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      YTX_Webrtc._videoRtpSender.track.stop();
      YTX_Webrtc._videoRtpSender.replaceTrack(stream.getVideoTracks()[0]);
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] changeVideoInput success, deviceId:", deviceId); 
      onSuccess(stream);
    })
    .catch(function(err) {   
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] changeVideoInput fail, deviceId:", deviceId,
      ", errName:", err.name, ", errMessage:", err.message); 
      onFail(err);
    })
  };

  YTX_Webrtc.setAudioOptions = function(options){
    if(typeof options.echoCancellation == boolean){
      YTX_Webrtc.echoCancellation = options.echoCancellation;
    }
    if(typeof options.autoGainControl == boolean){
      YTX_Webrtc.autoGainControl = options.autoGainControl;
    }
    if(typeof options.noiseSuppression == boolean){
      YTX_Webrtc.noiseSuppression = options.noiseSuppression;
    }
  };

  YTX_Webrtc.setVideoOptions = function(options){
    if(options.videoWidth){
      YTX_Webrtc.videoWidth = options.videoWidth;  
    }
    if(options.videoHeight){
      YTX_Webrtc.videoHeight = options.videoHeight;
    }
    if(options.videoFrameRate){
      YTX_Webrtc.videoFrameRate = options.videoFrameRate;
    }
    if(options.maxVideoRate){
      YTX_Webrtc.maxVideoRate = options.maxVideoRate;
    }
  };

  YTX_Webrtc.setScreenOptions = function(options){
    if(options.maxScreenRate){
      YTX_Webrtc.maxScreenRate = options.maxScreenRate;
    }
  }
  //////////////////////////////////////////////////////////////
  YTX_Webrtc.getLocalAudioStream = function(){
    let audioConstraints = {
      autoGainControl:{ideal:YTX_Webrtc.autoGainControl},
      echoCancellation:{ideal:YTX_Webrtc.echoCancellation},
      noiseSuppression:{ideal:YTX_Webrtc.noiseSuppression}
    }
    return new Promise(function(resolve, reject){
        navigator.mediaDevices.getUserMedia({
          audio: audioConstraints
        })
        .then(function(stream) {
          console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Get Local AudioStream Success");
          resolve(stream);
        })
        .catch(function(err) {
          console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Get Local AudioStream Failed, errName:", err.name, ", errMessage:", err.message);
          reject(err);
        });
      })
  };

  YTX_Webrtc.addLocalAudioStream = function(stream){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add Local AudioStream Success");
    YTX_Webrtc._audioRtpSender = YTX_Webrtc._peerConnection.addTrack(stream.getAudioTracks()[0], stream);
  };

  YTX_Webrtc.getLocalVideoStream = function(){
    let videoConstraints = {
      width: { ideal: YTX_Webrtc.videoWidth },
      height: { ideal: YTX_Webrtc.videoHeight },
      frameRate: { ideal: YTX_Webrtc.videoFrameRate }
    }
    return new Promise(function(resolve, reject){
        navigator.mediaDevices.getUserMedia({
          video: videoConstraints
        })
        .then(function(stream) {
          console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Get Local VideoStream Success");
          resolve(stream);
        })
        .catch(function(err) {
          console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Get Local VideoStream Failed, errName:", err.name, ", errMessage:", err.message);
          reject(err);
        })
      })
  };

  YTX_Webrtc.addLocalVideoStream = function(stream){
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add Local VideoStream Success");
    YTX_Webrtc._videoRtpSender = YTX_Webrtc._peerConnection.addTrack(stream.getVideoTracks()[0], stream);
  };

  YTX_Webrtc.stopLocalVideoStream = function(){
    if(!YTX_Webrtc._videoRtpSender || !YTX_Webrtc._videoRtpSender.track){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] stop LocalVideoStream, But no device");
      return;
    }
    YTX_Webrtc._videoRtpSender.track.stop();
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] stop LocalVideoStream Success");
  };

  YTX_Webrtc.startLocalVideoStream = function(onSuccess, onFail){
    if(!YTX_Webrtc._videoRtpSender){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] start LocalVideoStream, But no device");
      onFail();
      return;
    }
    if(YTX_Webrtc._videoRtpSender.track.readyState == "live"){
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] start LocalVideoStream, isOpened");
      onFail();
      return;
    }
    YTX_Webrtc.getLocalVideoStream()
    .then(function(stream){
      YTX_Webrtc._videoRtpSender.replaceTrack(stream.getVideoTracks()[0]);
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] start LocalVideoStream Success");
      onSuccess(stream);
    })
    .catch(function(err){
      console.error(YTX_Meeting.getTimeStamp(), "[Meeting] start LocalVideoStream, errName:", err.name, ", errMessage:", err.message);
      onFail(err);
    })
  };

  YTX_Webrtc.addLoaclScreenStream = function(){
    return new Promise(function(resolve, reject){
      navigator.mediaDevices.getDisplayMedia({
        video: true
      })
      .then(function(stream) {
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add Local ScreenStream Success");
        if(YTX_Webrtc._screenShareSender){
          YTX_Webrtc._screenShareSender.replaceTrack(stream.getVideoTracks()[0]);
        }else{
          YTX_Webrtc._screenShareSender = YTX_Webrtc._peerConnection.addTrack(stream.getVideoTracks()[0], stream);
        }
        resolve(stream);
      })
      .catch(function(err) {
        reject(err);
      });
    })
  };

  YTX_Webrtc.stopSreenShare = function(){
    YTX_Webrtc._screenShareSender.track.stop();
  };

  YTX_Webrtc.parseAnswerSession = function(session){
    let lines = session.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.length <= 2){
        continue;
      }
      if(line.indexOf("a=group:BUNDLE") >= 0){
        line = "a=group:BUNDLE" + "\r\n";
      }
      YTX_Webrtc.remoteSdpSession += line;
    }
  };

  YTX_Webrtc.parseAnswerMedia = function(mediaInfo){
    let type = "audio";
    if(mediaInfo.indexOf("m=video") == 0){
      type = "video";
    }
    let mid = "";
    let direction
    let ssrcLines = "";
    let des = "";
    let lines = mediaInfo.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.length <= 2){
        continue;
      }
      if(line.indexOf("b=AS:") >= 0){
        continue;
      }
      if(line.indexOf("a=mid:") >= 0){
        mid = line.split(":")[1].split("\r\n")[0];
        continue;
      }
      if(line.indexOf("a=sendrecv") >= 0
      || line.indexOf("a=sendonly") >= 0
      || line.indexOf("a=recvonly") >= 0
      || line.indexOf("a=inactive") >= 0){
        direction = line.split("=")[1].split("\r\n")[0];
        if(type == "video"){
          direction = "recvonly";
        }
        continue
      }
      if(line.indexOf("a=ssrc:") >= 0){
        if(type == "video"){
          continue;
        }
        ssrcLines += line;
        ssrcLines += lines[i+1] + "\r\n";
        ssrcLines += lines[i+2] + "\r\n";
        ssrcLines += lines[i+3] + "\r\n";
        i += 3;
        continue;
      }
      des += line;
    }
    let stream = new YTX_MediaStream();
    if(type == "video"){
      YTX_Webrtc.remoteVideoDes = des;
      stream.as = YTX_Webrtc.maxVideoRate;
    }else{
      stream.as = YTX_Webrtc.maxAudioRate;
    }
    stream.type = type;
    stream.mid = mid;
    stream.des = des;

    stream.direction = direction;
    stream.ssrcLines = ssrcLines;
    YTX_Webrtc.remoteSdpMedia.push(stream);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add Remote Video Stream, type:", type, ", mid:", mid, ", direction:", direction);
  };

  YTX_Webrtc.parseAnswerSdp = function(remoteSdp){
    let sections = remoteSdp.split("m=");
    YTX_Webrtc.parseAnswerSession(sections[0]);
    for(let i = 1; i < sections.length; i++){
      YTX_Webrtc.parseAnswerMedia("m=" + sections[i]);
    }
  };

  YTX_Webrtc.addRemoteStream = function(userName, userId, mediaType, remoteSdp){
    let cursor = "";
    let ssrc = 0;
    let ssrcLines = "";
    let lines = remoteSdp.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i] + "\r\n";
      if(line.length <= 2){
        continue;
      }
      if(line.indexOf("m=video ") >= 0){
        cursor = "video";
      }
      if(cursor == "video"){
        if(line.indexOf("a=ssrc:") >= 0){
          ssrc = line.split(":")[1].split(" ")[0];
          ssrcLines += line;
          ssrcLines += lines[i+1] + "\r\n";
          ssrcLines += lines[i+2] + "\r\n";
          ssrcLines += lines[i+3] + "\r\n";
          i += 3;
          break;
        }
      }
    }
    
    for(let i = 0; i < YTX_Webrtc.remoteSdpMedia.length; i++){
      let stream = YTX_Webrtc.remoteSdpMedia[i];
      if(stream.type == "audio"){
        continue;
      }
      if(stream.direction == "inactive"){
        stream.direction = "sendonly";
      }else if(stream.direction == "recvonly"){
        stream.direction = "sendrecv"
      }else{
        continue;
      }
      stream.ssrcLines = ssrcLines;
      stream.streamId = ssrcLines.split("mslabel:")[1].split("\r\n")[0];

      stream.userId = userId;
      stream.userName = userName;
      stream.ssrc = ssrc;
      stream.mediaType = mediaType;
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Update Remote Video Stream, type:", stream.type, 
      ", mid:", stream.mid, ", direction:", stream.direction, 
      ", ssrc:", ssrc, ", userName:", userName, ", userId", userId, ", mediaType:", mediaType);
      return;
    }
    let stream =  new YTX_MediaStream();
    stream.type = "video";
    stream.mid = YTX_Webrtc.mediaIndex;
    stream.des = YTX_Webrtc.remoteVideoDes;

    stream.direction = "sendonly";
    stream.ssrcLines = ssrcLines;
    stream.streamId = ssrcLines.split("mslabel:")[1].split("\r\n")[0];

    stream.userId = userId;
    stream.userName = userName;
    stream.ssrc = ssrc;
    stream.mediaType = mediaType;
    
    YTX_Webrtc.mediaIndex++;
    YTX_Webrtc.remoteSdpMedia.push(stream);
    console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add Remote Video Stream, type:", stream.type, 
      ", mid:", stream.mid, ", direction:", stream.direction, 
      ", ssrc:", ssrc, ", userName:", userName, ", userId", userId, ", mediaType:", mediaType);
  };

  YTX_Webrtc.deleteRemoteStream = function(userName, userId, mediaType){
    for(let i = 0; i < YTX_Webrtc.remoteSdpMedia.length; i++){
      let stream = YTX_Webrtc.remoteSdpMedia[i];
      if(stream.userId == userId && stream.mediaType == mediaType){
        if(stream.direction == "sendonly"){
          stream.direction = "inactive";
        }else if(stream.direction == "sendrecv"){
          stream.direction = "recvonly";
        }else{
          console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Delete RemoteStream Failed, type:", stream.type, 
          ", mid:", stream.mid, ", direction:", stream.direction, 
          ", userName", userName, ", userId", userId, ", mediaType:", mediaType);
        }
        stream.ssrcLines = "";
        stream.streamId = "";

        stream.userId = "";
        stream.userName = "";
        stream.ssrc = "";
        stream.mediaType = -1;
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Delete Remote Video Stream, type:", stream.type, 
        ", mid:", stream.mid, ", direction:", stream.direction, 
        ", userName", userName, ", userId", userId, ", mediaType:", mediaType);
      }
    }
  }

  YTX_Webrtc.packetRemoteSdp = function(){
    let remoteSdp = "";
    remoteSdp += YTX_Webrtc.remoteSdpSession;
    for(let i = 0; i < YTX_Webrtc.remoteSdpMedia.length; i++){
      let stream = YTX_Webrtc.remoteSdpMedia[i];
      remoteSdp += stream.des;
      remoteSdp += "a=mid:" + stream.mid + "\r\n";
      remoteSdp += "a=" + stream.direction + "\r\n";
      if(stream.as){
        remoteSdp += "b=AS:" + stream.as + "\r\n";
      }
      remoteSdp += stream.ssrcLines;
      remoteSdp = SDPParser.addBundle(remoteSdp, stream.mid);
    }
    return remoteSdp;
  };

  YTX_Webrtc.createLocalOffer = function(){
    let localSdp = "";
    return new Promise(function(resolve, reject){
      YTX_Webrtc._peerConnection.createOffer()
      .then(function(offer){
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Create LocalOffer Success, Sdp:", offer.sdp);
        localSdp = offer.sdp;
        localSdp = SDPParser.removeH264PacketMode0(localSdp);
        //localSdp = SDPParser.rewriteAudioCodec(localSdp);
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Filter LocalOffer, Sdp:", localSdp);
        return YTX_Webrtc._peerConnection.setLocalDescription(new RTCSessionDescription({
          type:"offer",
          sdp:localSdp
        }));
      })
      .then(function(){
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] SetLocalDescription Success");
        resolve(localSdp);
      })
      .catch(function(err){
        console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Create LocalOffer Failed, errName:", err.name, ", errMessage:", err.message);
        reject(err);
      })
    })
  };

  YTX_Webrtc.handleAnswer = function(recvSdp){
    return new Promise(function(resolve, reject){
      YTX_Webrtc.parseAnswerSdp(recvSdp);  
      let remoteSdp = YTX_Webrtc.packetRemoteSdp();
      console.debug(YTX_Meeting.getTimeStamp(), "[Meeting] HandleAnswer remoteSdp:", remoteSdp);
      YTX_Webrtc._peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: "answer",
        sdp: remoteSdp
      }))
      .then(function() {
        console.debug(YTX_Meeting.getTimeStamp(), "[Meeting] HandleAnswer SetRemoteDescription Success");
        resolve();
      })
      .catch(function(err) {
        console.error(YTX_Meeting.getTimeStamp(), "[Meeting] HandleAnswer Failed, errname:", err.name, ", errmessage:", err.message);
        reject(err);
      })
    })
  };

  YTX_Webrtc.handleOffer = function(remoteSdp){
    YTX_Webrtc.parseAnswerSdp(remoteSdp);
    let answerSdp = YTX_Webrtc.packetRemoteSdp();
    return new Promise(function(resolve, reject){
      YTX_Webrtc._peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: "offer",
        sdp: remoteSdp
      }))
      .then(function() {
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] handleOffer SetRemoteDescription Success");
        return YTX_Webrtc._peerConnection.createAnswer();
      })
      .then(function(answer) {
        answerSdp = answer.sdp;
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] handleOffer createAnswer Success:", answerSdp);
        return YTX_Webrtc._peerConnection.setLocalDescription(answer);
      })
      .then(function() {
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] handleOffer setLocalDescription Success");
        resolve(answerSdp);
      })
      .catch(function(err) {
        console.error(YTX_Meeting.getTimeStamp(), "[Meeting] handleOffer Failed, errname:", err.name, ", errmessage:", err.message);
        reject(err);
      })
    })
  }

  YTX_Webrtc.updateRemoteSdp = function(){
    return new Promise(function(resolve, reject){
      let remoteSdp = YTX_Webrtc.packetRemoteSdp();
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Update RemoteSdp:", remoteSdp);

      YTX_Webrtc._peerConnection.setRemoteDescription({
        type:"offer",
        sdp:remoteSdp
      })
      .then(function(){
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Update RemoteSdp, SetRemoteDescription Success");
        return YTX_Webrtc._peerConnection.createAnswer();
      })
      .then(function(answer){
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Update RemoteSdp, CreateAnswer Success:", answer.sdp);
        return YTX_Webrtc._peerConnection.setLocalDescription(answer);
      })
      .then(function(){
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Update RemoteSdp, setLocalDescription Success");
        resolve();
      })
      .catch(function(err){
        console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Update RemoteSdp Failed, errName:", err.name, ", errMessage:", err.message);
        reject(err);
      })
    })
  };

  YTX_Webrtc.onTrack = function(event){
    let reportEvt = {};
    reportEvt.stream = event.streams[0];
    if(event.track.kind == "audio"){
      reportEvt.mediaType = MType.Audio;
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] On AudioTrack streamId:", event.streams[0].id);
      YTX_Webrtc.onTrackCallBack(reportEvt);
      return;
    }
    if(event.track.kind == "video"){
      for(let i = 0; i < YTX_Webrtc.remoteSdpMedia.length; i++){
        let stream = YTX_Webrtc.remoteSdpMedia[i];
        if(stream.streamId == event.streams[0].id){
          reportEvt.userId = stream.userId;
          reportEvt.userName = stream.userName;        
          reportEvt.streamId = stream.streamId;
          reportEvt.mediaType = stream.mediaType;
          console.log(YTX_Meeting.getTimeStamp(), "[Meeting] On VideoTrack userName:", reportEvt.userName, ", userId:", reportEvt.userId, 
            ", mediaType:", reportEvt.mediaType, ", streamId:", reportEvt.streamId, ", kind:", event.track.kind);
          YTX_Webrtc.onTrackCallBack(reportEvt);
          return;
        }
      }
      console.warn(YTX_Meeting.getTimeStamp(), "[Meeting] On VideoTrack, Not find user, streamId:", event.streams[0].id);
    }
  }
  ////////////////////////////////////////////////////////////
  YTX_Webrtc.extractScreenSdp = function(srcLocalSdp, dstLocalSdp){
    let screenSdp = "";
    let srcLocalSections = srcLocalSdp.split("m=");
    let dstLocalSections = dstLocalSdp.split("m=");
    if(srcLocalSections.length < dstLocalSections.length){
      screenSdp += dstLocalSections[0];
      screenSdp += "m=" + dstLocalSections[dstLocalSections.length - 1];
    }
    if(srcLocalSections.length == dstLocalSections.length){
      for(let i = 0; i < srcLocalSections.length; i ++){
        let srcLocalMedia = srcLocalSections[i];
        let dstLocalMedia = dstLocalSections[i];
        let srcLocalDirection = SDPParser.getDirection(srcLocalMedia);
        let dstLocalDirection = SDPParser.getDirection(dstLocalMedia);
        if(srcLocalDirection == dstLocalDirection){
          continue;
        }
        screenSdp += dstLocalSections[0];
        screenSdp += "m=" + dstLocalSections[i];
      }
    }
    return screenSdp;
  };

  YTX_Webrtc.updateScreenMedia = function(srcLocalSdp, dstLocalSdp){
    let localSrcSections = srcLocalSdp.split("m=");
    let localDstSections = dstLocalSdp.split("m=");
    if(localSrcSections.length < localDstSections.length){
      let bundles = localDstSections[0].split("a=group:BUNDLE ")[1].split("\r\n")[0].split(" ");
      let stream = new YTX_MediaStream();
      stream.type = "video";
      stream.mid = bundles[bundles.length - 1];
      stream.des = YTX_Webrtc.remoteVideoDes;
      stream.direction = "recvonly";
      stream.as = YTX_Webrtc.maxScreenRate;
      YTX_Webrtc.remoteSdpMedia.push(stream);
      console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add Remote Screen Stream, type:", stream.type, 
      ", mid:", stream.mid, ", direction:", stream.direction);
    }
    if(localSrcSections.length == localDstSections.length){
      for(let i = 0; i < localSrcSections.length; i ++){
        let localSrcDirection = SDPParser.getDirection(localSrcSections[i]);
        let localDstDirection = SDPParser.getDirection(localDstSections[i]);
        if(localSrcDirection == localDstDirection){
          continue;
        }
        let stream = YTX_Webrtc.remoteSdpMedia[i-1];//except session
        if(stream.direction == "inactive"){
          stream.direction = "recvonly";
        }else if(stream.direction == "sendonly"){
          stream.direction = "sendrecv"
        }else{
          console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Update Remote Screen Stream Failed, type:", stream.type, 
          ", mid:", stream.mid, ", direction:", stream.direction);
          return;
        }
        stream.as = YTX_Webrtc.maxScreenRate;
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Update Remote Screen Stream, type:", stream.type, 
        ", mid:", stream.mid, ", direction:", stream.direction);
      }
    }
  };

  YTX_Webrtc.createScreenOffer = function(){
    return new Promise(function(resolve, reject){
      if(YTX_Webrtc.screenFlag){
        resolve(YTX_Webrtc.reportScreenSdp);
        return;
      }
      YTX_Webrtc._peerConnection.createOffer()
      .then(function(offer){
        let localScreenSdp = offer.sdp;
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Create ScreenOffer Success, Sdp:", localScreenSdp);
        localScreenSdp = SDPParser.removeH264PacketMode0(localScreenSdp);
        localScreenSdp = SDPParser.removeExtmap(localScreenSdp);
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Filter ScreenOffer, Sdp:", localScreenSdp);

        YTX_Webrtc.reportScreenSdp = YTX_Webrtc.extractScreenSdp(YTX_Webrtc._peerConnection.localDescription.sdp, localScreenSdp);
        YTX_Webrtc.updateScreenMedia(YTX_Webrtc._peerConnection.localDescription.sdp, localScreenSdp);
        return YTX_Webrtc._peerConnection.setLocalDescription(new RTCSessionDescription({
          type:"offer",
          sdp:localScreenSdp
        }));
      })
      .then(function(){
        console.log(YTX_Meeting.getTimeStamp(), "[Meeting] SetLocalDescription Success");
        resolve(YTX_Webrtc.reportScreenSdp);
      })
      .catch(function(err){
        console.error(YTX_Meeting.getTimeStamp(), "[Meeting] Create ScreenOffer Failed, errName:", err.name, ", errMessage:", err.message);
        reject(err);
      })
    })
  };

  YTX_Webrtc.handleScreenAnswer = function(){
    return new Promise(function(resolve, reject){
      if(YTX_Webrtc.screenFlag){
        resolve();
        return
      }
      YTX_Webrtc.screenFlag = true;
      let remoteSdp = YTX_Webrtc.packetRemoteSdp();
      console.debug(YTX_Meeting.getTimeStamp(), "[Meeting] handleScreenAnswer remoteSdp:", remoteSdp);
      YTX_Webrtc._peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: "answer",
        sdp: remoteSdp
      }))
      .then(function() {
        console.debug(YTX_Meeting.getTimeStamp(), "[Meeting] handleScreenAnswer SetRemoteDescription Success");
        resolve();
      })
      .catch(function(err) {
        console.error(YTX_Meeting.getTimeStamp(), "[Meeting] handleScreenAnswer Failed, errname:", err.name, ", errmessage:", err.message);
        reject(err);
      })
    })
  };

  YTX_Webrtc.getMediaStats = function(){
    return new Promise(function(resolve, reject){
      if(!YTX_Webrtc._peerConnection){
        let err = {};
        err.name = "getStats fail";
        err.message = "peerConnection not init";
        reject(err);
        return;
      }
      let staticsReports = [];
      YTX_Webrtc._peerConnection.getStats()
      .then(function(stats) {
        stats.forEach(report => {  
          //console.log('report type ============= ' + report.type);  
          //console.log('report type  YTX_Meeting.confId ============= ' + YTX_Meeting.confId);
          //console.log('report type  YTX_Meeting.callId ============= ' + YTX_Meeting.callId);
          
          ///  打点相关初始化
          if(report.type == "inbound-rtp" || report.type == "outbound-rtp"){
            var logUpDate = {};
            logUpDate.tags = {};
            logUpDate.values = {};
            logUpDate.tags.direction = report.type;
            logUpDate.tags.confId = YTX_Meeting.confId;
            logUpDate.tags.callId = YTX_Meeting.callId;
            //console.log('report type  mediatype ============= ' + report.mediaType);
          } else if(report.type == "remote-inbound-rtp"){
            var logUpDate = {};
            logUpDate.tags = {};
            logUpDate.values = {};
            logUpDate.tags.direction = report.type;
            logUpDate.tags.confId = YTX_Meeting.confId;
            logUpDate.tags.callId = YTX_Meeting.callId;
            logUpDate.tags.ssrc = report.ssrc.toString();
            logUpDate.values.YtxRtcClientRtt =  report.roundTripTime;
            logUpDate.tags.mediaType = report.mediaType;
            //console.log('report type  mediatype ============= ' + report.mediaType);
            if(window.addDataByType){
              window.addDataByType(logUpDate,2);
            }	
          }
          ///////////////////////////////////////////////////////

          if(report.type == "inbound-rtp"){
            let currReport = {};
            currReport.type = report.type;
            currReport.ssrc = report.ssrc;
            //console.log('report type  report.ssrc ============= ' + report.ssrc);
            currReport.kind = report.kind;
            currReport.mediaType = report.mediaType;
            currReport.timestamp = report.timestamp;
            currReport.packetsLost = report.packetsLost;
            currReport.bytesReceived = report.bytesReceived;
            currReport.packetsReceived = report.packetsReceived;
            currReport.headerBytesReceived = report.headerBytesReceived;

            logUpDate.tags.ssrc = report.ssrc.toString();

            for(let i = 0; i < YTX_Webrtc.remoteSdpMedia; i++){
              let stream = YTX_Webrtc.remoteSdpMedia[i];
              if(stream.ssrc == report.ssrc.toString()){
                currReport.userId = stream.userId;
                currReport.userName = stream.userName;
              }
            }
            if(!YTX_Webrtc.monitorMap.has(report.ssrc)){
              currReport.bytesReceivedRate = 0;
              currReport.packetsReceivedRate = 0;
              currReport.headerBytesReceivedRate = 0;
              if(report.framesDecoded){
                currReport.framesDecodedRate = 0;
              }
            }else{
              lastReport = YTX_Webrtc.monitorMap.get(report.ssrc);
              currReport.bytesReceivedRate = parseInt((currReport.bytesReceived - lastReport.bytesReceived)/(currReport.timestamp - lastReport.timestamp)*8*1000);
              currReport.packetsReceivedRate = parseInt((currReport.packetsReceived - lastReport.packetsReceived)/(currReport.timestamp - lastReport.timestamp)*1000);
              currReport.headerBytesReceivedRate = parseInt((currReport.headerBytesReceived - lastReport.headerBytesReceived)/(currReport.timestamp - lastReport.timestamp)*8*1000);
              if(report.framesDecoded){
                currReport.framesDecoded = report.framesDecoded;
                currReport.framesDecodedRate = parseInt((currReport.framesDecoded - lastReport.framesDecoded)/(currReport.timestamp - lastReport.timestamp)*1000);
              }
            }
            if(report.mediaType == "audio"){
              currReport.jitter = report.jitter;
              currReport.fecPacketsDiscarded = report.fecPacketsDiscarded;
              currReport.fecPacketsReceived = report.fecPacketsReceived;
              //// 打点相关
              logUpDate.tags.mediaType = "audio";
              if(report.type == "inbound-rtp"){
                logUpDate.values.YtxRtcClientJitter = report.jitter;
                logUpDate.values.YtxRtcClientPacketsLost = report.packetsLost;
                logUpDate.values.YtxRtcClientAvgJitterBufferDelay = report.jitterBufferDelay;
                logUpDate.values.YtxRtcClientBytesReceivedRate = currReport.bytesReceivedRate;
                logUpDate.values.YtxRtcClientPacketsReceivedRate = currReport.packetsReceivedRate;
                logUpDate.values.YtxRtcClientFecPacketsDiscarded = currReport.fecPacketsDiscarded;
                logUpDate.values.YtxRtcClientFecPacketsReceived = currReport.fecPacketsReceived;
              }

               //// 打点相关
            }
            if(report.mediaType == "video"){
              currReport.pliCount = report.pliCount;
              currReport.firCount = report.firCount;
              currReport.nackCount = report.nackCount;
              currReport.framesDecoded = report.framesDecoded;
              currReport.keyFramesDecoded = report.keyFramesDecoded;
              currReport.totalDecodeTime = report.totalDecodeTime;
              currReport.totalInterFrameDelay = report.totalInterFrameDelay;
              currReport.totalSquaredInterFrameDelay = report.totalSquaredInterFrameDelay;
              logUpDate.tags.mediaType = "video";
              if(report.type == "inbound-rtp"){
                logUpDate.values.YtxRtcClientJitter = report.jitter;
                logUpDate.values.YtxRtcClientPacketsLost = report.packetsLost;
                logUpDate.values.YtxRtcClientAvgJitterBufferDelay = report.jitterBufferDelay;
                logUpDate.values.YtxRtcClientBytesReceivedRate = currReport.bytesReceivedRate;
                logUpDate.values.YtxRtcClientPacketsReceivedRate = currReport.packetsReceivedRate;
                logUpDate.values.YtxRtcClientFramesReceivedRate = currReport.framesReceived;
                logUpDate.values.YtxRtcClientFramesDecodedRate = currReport.framesDecoded;
                logUpDate.values.YtxRtcClientFrameWidth = currReport.framesDecoded;
                logUpDate.values.YtxRtcClientFramesDecodedRate = currReport.framesDecoded;
                logUpDate.values.YtxRtcClientFrameHeight = currReport.frameHeight;
                logUpDate.values.YtxRtcClientFrameWidth = currReport.frameWidth;
                logUpDate.values.YtxRtcClientFirCount = currReport.firCount;
                logUpDate.values.YtxRtcClientPliCount = currReport.pliCount;
                logUpDate.values.YtxRtcClientNackCount = currReport.nackCount;
                logUpDate.values.YtxRtcClientKeyFramesDecoded = currReport.keyFramesDecoded;
              }

            }
            staticsReports.push(currReport);
            YTX_Webrtc.monitorMap.set(report.ssrc, currReport);
            // 打点收集接口
            if(window.addDataByType){
              window.addDataByType(logUpDate,2);
            }	
          }
        });
        resolve(staticsReports);
      });
    })
  };

  YTX_Webrtc.startMediaMonitor = function(parameter, onReport, onError){
    let interval = parameter.interval;
    if(interval < 1){
      interval = 1;
    }
    YTX_Webrtc.monitorTimerId = setInterval(() => {
      //console.log('states 数据采集');
      YTX_Webrtc.getMediaStats()
      .then(function(report){
        onReport(report);
      })
      .catch(function(err){
        onError(err);
      })
    }, interval * 1000);
  }

  YTX_Webrtc.stopMediaMonitor = function(){
    clearInterval(YTX_Webrtc.monitorTimerId);
    YTX_Webrtc.monitorTimerId = 0;
    YTX_Webrtc.monitorMap.clear();
  }
/*****************************************接入新版本sdk*************************************************/
  var ROOT = {};
  if (typeof global === 'object') {
      ROOT = global;
  } else if (typeof window === "object") {
      ROOT = window
  }
  function RL_Media() {
      this.__proto__ = {
          init: function(optional){
            YTX_Meeting.transport = optional.transport;
          },
          processMsg: function (obj) {   //callroute消息接收
            //console.debug("[Meeting] Recv Message:", JSON.stringify(obj)); 
            YTX_Meeting.processCallMessage(obj);
            return;
          },
          receiveMsgResp: function (obj, request, key) { //conference消息接收
              var callback = request.callback;
              var resp = {};
              resp.code = obj["6"];
              resp.result = Base64.decode(obj["2"]["ConferenceMessageResp"]["1"]);
              callback(resp)
          },
          receiveConferenceNotice: function(obj) { //会议通知
            var cn = _parseConferenceNotice(obj);
            if (YTX_Meeting.confNotifyLinstener) {
              YTX_Meeting.confNotifyLinstener(cn);
            }

            function _parseConferenceNotice (obj) {
              var data = obj["2"];
              if (!data) {
                return {
                  code: obj[6]
                };
              }
              var reData = data["ConferenceNotification"];
              var resp = JSON.parse(reData["2"]);
              return resp;
            }
          },

          getVersion: function(){
            return YTX_Meeting.Version;
          },
          onTrack: function(callback){
            YTX_Meeting.setOnTrack(callback);
          },
          setOnTrack: function(callback){
            YTX_Meeting.setOnTrack(callback);
          },
          onPublishMedia: function(callback){
            YTX_Meeting.onPublishMedia = callback;
          },
          setOnPublishMedia: function(callback){
            YTX_Meeting.onPublishMedia = callback;
          },
          onCallMsgListener: function (callback) {
            YTX_Meeting.onCallEvent = callback;
          },
          setUserData: function(userData){
            YTX_Meeting.setUserData(userData);
          },
          makeCall: function (parameter, onSuccess, onFail) {
            YTX_Meeting.makeCall(parameter, onSuccess, onFail);
          },
          releaseCall: function (onSuccess, onFail) {
            YTX_Meeting.releaseCall(onSuccess, onFail);
          },
          rejectCall: function (onSuccess, onFail) {
            YTX_Meeting.rejectCall(onSuccess, onFail);
          },
          acceptCall: function (onSuccess, onFail) {
            YTX_Meeting.acceptCall(onSuccess, onFail);
          },
          acceptCallEx: function (parameter, onSuccess, onFail) {
            YTX_Meeting.acceptCallEx(parameter, onSuccess, onFail);
          },
          ////////////////////////meeting////////////////////////////////////
          onMeetingMsgListener: function (callback) {
            YTX_Meeting.confEventListener = callback;
          },
          onConferenceNotifyLinstener: function (callback) {
            YTX_Meeting.confNotifyLinstener = callback;
          },
          ////////////////conference/////////////////////
          ConferenceMsgBuilder: function (path, content) {
            this._path = path;
            this._content = content;
            this.setPath = function (path) {
              this._path = path;
            };
            this.setContent = function (content) {
              this._content = content;
            };
            this.getPath = function () {
              return this._path;
            };
            this.getContent = function () {
              return this._content;
            };
          },
          ConferenceMsg: function (conferenceMsgBuilder, callback, onError) {
            YTX_Meeting.sendMessage(conferenceMsgBuilder, callback, onError);
          },
          //////////////////////////////////////////////
          connectMediaEx: function (parameter, callback, onError) {
            var confIg = parameter.called;
            parameter.called = "nconf" + parameter.called;
            YTX_Meeting.operation = COperation.Meeting;
            YTX_Meeting.confId = confIg;
            YTX_Meeting.makeCall(parameter, callback, onError);
          },
          disconnectMedia: function (callback, onError) {
            YTX_Meeting.releaseCall(callback, onError);
          },
          ////////////////////////////////////////////////////
          updateCall: function (parameter, onSuccess, onFail){
            let request = {};
            request.onFail = onFail;
            request.onSuccess = onSuccess;
            request.messageId = YTX_MessageId.UpdateMedia;
            request.mediaType = parameter.mediaType;
            console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add update Call Request, mediaType:", parameter.mediaType);
            YTX_Meeting.addRequest(request)
          },       
          subscribeMedia: function(request, onSuccess, onFail){
            YTX_Meeting.confId = request.confId;
            if(!request.userId){//兼容容视
              request.userId = request.memberId;
            }
            request.onFail = onFail;
            request.onSuccess = onSuccess;
            request.messageId = YTX_MessageId.SubscribeMedia;
            console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add SubscribeMedia, userName:", request.userName, ", userId:", request.userId);
            YTX_Meeting.addRequest(request)
            /////////////////////////////////以下是打点
            let logUpDate = {};
            logUpDate.category = 'SubscribeMedia';
            logUpDate.level = 'info';
            logUpDate.logSource = 'client';
            logUpDate.deviceType = 'h5';
            logUpDate.confId = request.confId;
            logUpDate.userId = request.userId;
            logUpDate.msg = 'SubscribeMedia';
            logUpDate.logType = 'EventLog';
            if(window.addDataByType){
                window.addDataByType(logUpDate,1);
            }
          },
          unsubscribeMedia: function(request, onSuccess, onFail){
            request.onFail = onFail;
            request.onSuccess = onSuccess;
            request.messageId = YTX_MessageId.UnSubscribeMedia;
            console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add UnSubscribeMedia userName:", request.userName, ", userId:", request.userId);
            YTX_Meeting.addRequest(request)
             /////////////////////////////////以下是打点
             let logUpDate = {};
             logUpDate.category = 'UnsubscribeMedia';
             logUpDate.level = 'info';
             logUpDate.logSource = 'client';
             logUpDate.deviceType = 'h5';
             logUpDate.confId = request.confId;
             logUpDate.userId = request.userId;
             logUpDate.msg = 'UnsubscribeMedia';
             logUpDate.logType = 'EventLog';
             if(window.addDataByType){
                 window.addDataByType(logUpDate,1);
             }
          },
          startScreenShare: function (onSuccess, onFail) {
            let request = {};
            request.onFail = onFail;
            request.onSuccess = onSuccess;
            request.messageId = YTX_MessageId.StartScreenShare;
            console.log(YTX_Meeting.getTimeStamp(), "[Meeting] Add ScreenShareRequest");
            YTX_Meeting.addRequest(request)
          },
          ////////////////////////////////////////////////////////
          closeMicrophone: function(){
            YTX_Meeting.closeMicrophone();
          },
          openMicrophone: function(){
            YTX_Meeting.openMicrophone();
          },
          closeCamera: function(){
            YTX_Meeting.closeCamera();
          },
          openCamera: function(){
            YTX_Meeting.openCamera();
          },
          closeCameraEx: function(onSuccess, onFail){
            YTX_Meeting.closeCameraEx(onSuccess, onFail);
          },
          openCameraEx: function(onSuccess, onFail){
            YTX_Meeting.openCameraEx(onSuccess, onFail);
          }, 
          getMediaDevice: function(onSuccess, onFail){
            YTX_Meeting.getMediaDevice(onSuccess, onFail);
          },
          changeAudioOutput: function(element, deviceId, onSuccess, onFail){
            YTX_Meeting.chanegeAudioOutput(element, deviceId, onSuccess, onFail);
          }, 
          changeAudioInput: function(deviceId, onSuccess, onFail){
            YTX_Meeting.changeAudioInput(deviceId, onSuccess, onFail);
          },
          changeVideoInput: function(deviceId, onSuccess, onFail){
            YTX_Meeting.changeVideoInput(deviceId, onSuccess, onFail);
          },
          setAudioOptions: function(options){
            YTX_Meeting.setAudioOptions(options);
          },
          setVideoOptions: function(options){
            YTX_Meeting.setVideoOptions(options);
          },
          setScreenOptions: function(options){
            YTX_Meeting.setScreenOptions(options);
          },
          startMediaMonitor: function(parameter, onReport, onError){
            YTX_Meeting.startMediaMonitor(parameter, onReport, onError);
          },
          stopMediaMonitor:function(){
            YTX_Meeting.stopMediaMonitor();
          }
      }
  }
  ROOT.RL_Media = new RL_Media()
  /*****************************************接入新版本sdk*************************************************/
