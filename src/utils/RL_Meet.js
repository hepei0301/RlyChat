(function () {
  function RL_MT() {
    this.confId = null;
    this.appid = null;
    this.userId = null;
    this.callId = null;
    this.called = null;
    this.caller = null;
    this.version = '1.2.0.9';
    this.requestUrl = '';
  }

  RL_MT.prototype = {
    processBuilder: function (obj, tar) {
      Object.keys(obj).forEach((tr) => {
        tar['set' + tr.substr(0, 1).toUpperCase() + tr.substr(1)] = function (v) {
          obj[tr] = v;
        };
        tar['get' + tr.substr(0, 1).toUpperCase() + tr.substr(1)] = function () {
          return obj[tr];
        };
      });
      tar['getParams'] = function () {
        return obj;
      };
    },
    init: function (appid, userId) {
      this.appid = appid ? appid : this.appid;
      this.userId = userId;
      this.meetingLsn = function () {};
      RL_Media.onMeetingMsgListener(this.MeetingMsgListener);
      RL_Chat.onMsgReceiveListener(this.processNotice);
    },
    getFormatDate: function (now, delay) {
      now = now ? new Date(now) : new Date();
      nowDate = now.getTime() + (delay ? delay * 1000 * 60 : 0); //预约会议推迟15分钟
      nowDate = new Date(nowDate);
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
      var date = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
      var hour = nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours();
      var minute = nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : nowDate.getMinutes();
      var seconds = nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : nowDate.getSeconds();
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + seconds;
    },
    processNotice(obj) {
      if (obj.msgType === 50) {
        //邀请通知？
        try {
          if (obj.msgContent) {
            const content = JSON.parse(obj.msgContent);
            if (content && content.noteType && RL_MEET.inviteJoinMeetResp) {
              RL_MEET.inviteJoinMeetResp(obj);
            }
          }
        } catch (e) {
          // 消息内容不是IMjson格式
          console.log(e);
        }
      } else {
        //普通IM消息推送
        if (RL_MEET.msgListener) RL_MEET.msgListener(obj);
      }
    },
    msgListener: function () {},
    inviteJoinMeetResp: function () {},

    InviteJoinMeetListener: function (callback) {
      if (callback instanceof Function) this.inviteJoinMeetResp = callback;
      else {
        this.inviteJoinMeetResp = function () {};
      }
    },
    IMMsgListener: function (callback) {
      if (callback instanceof Function) this.msgListener = callback;
      else {
        this.msgListener = function () {};
      }
    },

    MeetingMsgListener: function (obj) {
      console.log('MeetingMsgListener', obj);
      console.log('meetingLsn', RL_MEET.meetingLsn);
      if (!obj) return;
      let state = obj.state;
      if (state == 1) {
        RL_MEET.callId = obj.callId;
        RL_MEET.called = obj.called;
        RL_MEET.caller = obj.caller;
        // 发起呼叫中
      } else if (state == 2) {
        // 服务端已收到请求
      } else if (state == 3) {
        //服务端已经处理请求
      } else if (state == 4) {
        //取消呼叫  有异常
        RL_MEET.meetingLsn(obj);
      } else if (state == 16) {
        //会议连接已经建立
        RL_MEET.meetingLsn(obj);
      } else {
        console.log('some one else ? ++', obj);
      }
    },
    MeetingListener: function (callback) {
      this.meetingLsn = callback;
    },
    JoinMeetRoom: function (JoinMeetRoomBuilder, callback, onError) {
      this.confId = JoinMeetRoomBuilder.getConfId();
      let joinType = JoinMeetRoomBuilder.getJoinType();
      let params = JoinMeetRoomBuilder.getParams();
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder(
          '/REST/Conference/Member/Join?source=SDK',
          Object.assign(
            {
              appId: this.appid,
              userId: this.userId,
              confId: this.confId,
            },
            params
          )
        ),
        (e) => {
          let resp = JSON.parse(e.result);
          console.log('ConferenceMsg', resp);
          if (resp.statusCode != '000000') {
            onError(resp);
            return;
          } else {
            this.confId = JoinMeetRoomBuilder.getConfId();
            if (resp.conf.creator.indexOf('$') > -1) {
              resp.conf.creator = resp.conf.creator.substr(resp.conf.creator.indexOf('$') + 1, resp.conf.creator.length);
            }
          }
          // joinType若为2，则需要请求媒体权限;
          // 上层设置方式: joinMeetRoomBuilder.setJoinType(2);
          if (joinType == 2) {
            let connectMediaBuilder = new RL_Media.ConnectMediaBuilder();
            connectMediaBuilder.setCallType(1);
            connectMediaBuilder.setCalled(resp.conf.confId);
            RL_Media.ConnectMedia(
              connectMediaBuilder,
              function (e) {
                console.log('ConnectMedia====', resp, e);
                callback(resp, e);
              },
              function (err) {
                onError(err);
              }
            );
          } else {
            callback(resp, e);
          }
        },
        onError
      );
    },
    JoinMeetRoomBuilder: function (confId, userName, password, roleId, inviter, inviterIdType, phoneNumber, joinState, terminalUA, joinType) {
      let obj = {
        confId,
        userName,
        password,
        roleId,
        inviter,
        inviterIdType,
        phoneNumber,
        joinState,
        terminalUA,
        joinType,
      };
      RL_MEET.processBuilder(obj, this);
    },
    StartWhiteboardSharing: function (StartWhiteboardSharingBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/MediaControl/StartWhiteboardSharing?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          wbInfo: StartWhiteboardSharingBuilder.getWbInfo(),
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode != '000000') {
            onError(resp);
            return;
          } else {
            callback(resp);
          }
        },
        onError
      );
    },
    StartWhiteboardSharingBuilder: function (wbInfo) {
      this._wbInfo = wbInfo;
      this.setWbInfo = function (wbInfo) {
        this._wbInfo = wbInfo;
      };
      this.getWbInfo = function () {
        return this._wbInfo;
      };
    },
    StopWhiteboardSharing: function (StopWhiteboardSharingBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/MediaControl/StopWhiteboardSharing?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          // "wbInfo": StopWhiteboardSharingBuilder.getWbInfo()
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode != '000000') {
            onError(resp);
            return;
          } else {
            callback(resp);
          }
        },
        onError
      );
    },
    StopWhiteboardSharingBuilder: function (wbInfo) {
      this._wbInfo = wbInfo;
      this.setWbInfo = function (wbInfo) {
        this._wbInfo = wbInfo;
      };
      this.getWbInfo = function () {
        return this._wbInfo;
      };
    },

    // 更新会议
    ConferenceUpdate: function (ConferenceUpdateBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Update?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: ConferenceUpdateBuilder.getConfId() || this.confId,
          confTopic: ConferenceUpdateBuilder.getConfTopic(),
          confName: ConferenceUpdateBuilder.getConfName(),
          password: ConferenceUpdateBuilder.getPassword(),
          maxMember: ConferenceUpdateBuilder.getMaxMember(),
          startTime: ConferenceUpdateBuilder.getStartTime(),
          duration: ConferenceUpdateBuilder.getDuration(),
          members: ConferenceUpdateBuilder.getMembers(),
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode != '000000') {
            onError(resp);
            return;
          } else {
            callback(resp);
          }
        },
        onError
      );
    },
    GetOperationRecord: function (GetOperationRecordBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/Conference/GetOperationRecord?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: GetOperationRecordBuilder.getConfId(),
          isHistoryConf: 1,
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode != '000000') {
            onError(resp);
            return;
          } else {
            callback(resp);
          }
        },
        onError
      );
    },
    GetOperationRecordBuilder: function (appId, userId, confId, isHistory) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._isHistory = isHistory;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setIsHistory = function (isHistory) {
        this._isHistory = isHistory;
      };
      this.getIsHistory = function () {
        return this._isHistory;
      };
    },
    ConferenceUpdateBuilder: function (confId, confTopic, confName, password, maxMember, startTime, duration, members) {
      this._confTopic = confTopic;
      this._confId = confId;
      this._confName = confName;
      this._password = password;
      this._maxMember = maxMember;
      this._startTime = startTime;
      this._duration = duration;
      this._members = members;
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setConfTopic = function (confTopic) {
        this._confTopic = confTopic;
      };
      this.getConfTopic = function () {
        return this._confTopic;
      };
      this.setConfName = function (confName) {
        this._confName = confName;
      };
      this.getConfName = function () {
        return this._confName;
      };
      this.setPassword = function (password) {
        this._password = password;
      };
      this.getPassword = function () {
        return this._password;
      };
      this.setMaxMember = function (maxMember) {
        this._maxMember = maxMember;
      };
      this.getMaxMember = function () {
        return this._maxMember;
      };
      this.setStartTime = function (startTime) {
        this._startTime = startTime;
      };
      this.getStartTime = function () {
        return this._startTime;
      };
      this.setDuration = function (duration) {
        this._duration = duration;
      };
      this.getDuration = function () {
        return this._duration;
      };
      this.setMembers = function (members) {
        this._members = members;
      };
      this.getMembers = function () {
        return this._members;
      };
    },
    RoomList: function (RoomListBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Room/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          memberIdType: RoomListBuilder.getMemberIdType(),
          confRoomType: RoomListBuilder.getConfRoomType(),
          // "confRoomIds": RoomListBuilder.getConfRoomIds(),
          memberId: RoomListBuilder.getMemberId(),
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode != '000000') {
            onError(resp);
            return;
          } else {
            callback(resp);
          }
        },
        onError
      );
    },
    RoomListBuilder: function (memberIdType, confRoomType, confRoomIds, memberId) {
      this._memberIdType = memberIdType;
      this._memberId = memberId;
      this._confRoomType = confRoomType;
      this._confRoomIds = confRoomIds;

      this.setMemberIdType = function (memberIdType) {
        this._memberIdType = memberIdType;
      };
      this.getMemberIdType = function () {
        return this._memberIdType;
      };
      this.setMemberId = function (memberId) {
        this._memberId = memberId;
      };
      this.getMemberId = function () {
        return this._memberId;
      };
      this.setConfRoomType = function (confRoomType) {
        this._confRoomType = confRoomType;
      };
      this.getConfRoomType = function () {
        return this._confRoomType;
      };
      this.setConfRoomIds = function (confRoomIds) {
        this._confRoomIds = confRoomIds;
      };
      this.getConfRoomIds = function () {
        return this._confRoomIds;
      };
    },
    GetMeetMemberList: function (callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          callback(resp);
        },
        onError
      );
    },

    // 获取当前语音激励者;
    GetMeetVoiceMax: function (confId, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Impel/Member/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: confId,
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          callback(resp);
        },
        onError
      );
    },

    GetMeetMemberList2: function (confId, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: confId,
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          callback(resp);
        },
        onError
      );
    },

    GetMeetMemberListBuilder: function (appId, userId, confId, pageNo, pageSize, contentType) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._pageNo = pageNo;
      this._pageSize = pageSize;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setPageNo = function (pageNo) {
        this._pageNo = pageNo;
      };
      this.getPageNo = function () {
        return this._pageNo;
      };
      this.setPageSize = function (pageSize) {
        this._pageSize = pageSize;
      };
      this.getPageSize = function () {
        return this._pageSize;
      };
    },

    GetMeetInfo: function (GetMeetInfoBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Info?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: GetMeetInfoBuilder.getConfId() || this.confId,
          historyConf: GetMeetInfoBuilder.getHistoryConf(),
        }),
        callback,
        onError
      );
    },

    GetMeetInfoBuilder: function (confId, historyConf) {
      this._confId = confId;
      this._historyConf = historyConf;
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setHistoryConf = (historyConf) => {
        this._historyConf = historyConf;
      };
      this.getHistoryConf = () => {
        return this._historyConf;
      };
    },

    SetLayout: function (SetLayoutBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/SetConfLayout?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: SetLayoutBuilder.getConfId() || this.confId,
          LayoutIdx: SetLayoutBuilder.getLayoutIdx(),
          LayoutPos: SetLayoutBuilder.getLayoutPos(),
          MainVenue: SetLayoutBuilder.getMainVenue(),
          deviceType: SetLayoutBuilder.getDeviceType(),
        }),
        callback,
        onError
      );
    },

    SetLayoutBuilder: function (appId, userId, confId, layoutIdx, layoutPos, mainVenue, deviceType) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._layoutIdx = layoutIdx;
      this._layoutPos = layoutPos;
      this._mainVenue = mainVenue;
      this._deviceType = deviceType;

      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setLayoutIdx = (layoutIdx) => {
        this._layoutIdx = layoutIdx;
      };
      this.getLayoutIdx = () => {
        return this._layoutIdx;
      };
      this.setLayoutPos = (layoutPos) => {
        this._layoutPos = layoutPos;
      };
      this.getLayoutPos = () => {
        return this._layoutPos;
      };
      this.setMainVenue = (mainVenue) => {
        this._mainVenue = mainVenue;
      };
      this.getMainVenue = () => {
        return this._mainVenue;
      };
      this.setDeviceType = (deviceType) => {
        this._deviceType = deviceType;
      };
      this.getDeviceType = () => {
        return this._deviceType;
      };
    },

    CreateMeet: function (CreateMeetBuilder, callback, onError) {
      let _this = this;
      this.confId = CreateMeetBuilder.getConfRoomId();
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Create?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confName: CreateMeetBuilder.getConfName(),
          contentType: CreateMeetBuilder.getContentType(),
          confType: CreateMeetBuilder.getConfType(),
          password: CreateMeetBuilder.getPassword(),
          maxMember: CreateMeetBuilder.getMaxMember(),
          voiceMode: CreateMeetBuilder.getVoiceMode(),
          autoClose: CreateMeetBuilder.getAutoClose(),
          mediaType: CreateMeetBuilder.getMediaType(),
          reserveEnable: CreateMeetBuilder.getReserveEnable(),
          startTime: CreateMeetBuilder.getStartTime(),
          duration: CreateMeetBuilder.getDuration(),
          sendReserveNote: CreateMeetBuilder.getSendReserveNote(),
          sendInvitation: CreateMeetBuilder.getSendInvitation(),
          remindBeforeStart: CreateMeetBuilder.getRemindBeforeStart(),
          remindBeforeEnd: CreateMeetBuilder.getRemindBeforeEnd(),
          members: CreateMeetBuilder.getMembers(),
          confTopic: CreateMeetBuilder.getConfTopic(),
          confRoomId: CreateMeetBuilder.getConfRoomId(),
          joinState: CreateMeetBuilder.getJoinState(),
          chatInConf: 0,
          appData: CreateMeetBuilder.getAppData(),
          autoRecord: CreateMeetBuilder.getAutoRecord(),
          recordAction: CreateMeetBuilder.getRecordAction(),
        }),
        function (e) {
          let result = JSON.parse(e.result);
          if (result.statusCode == '000000') {
            _this.confId = result.confId;
            callback(result);
          } else {
            onError(result);
          }
        },
        onError
      );
    },
    CreateMeetBuilder: function (
      appId,
      userId,
      confName,
      contentType,
      confType,
      password,
      maxMember,
      voiceMode = 3,
      autoClose,
      mediaType,
      reserveEnable,
      startTime,
      duration,
      sendReserveNote,
      sendInvitation,
      remindBeforeStart,
      remindBeforeEnd,
      members,
      confTopic,
      confRoomId,
      joinState,
      chatInConf,
      appData,
      autoRecord,
      recordAction
    ) {
      this._appId = appId;
      this._userId = userId;
      this._confName = confName;
      this._confType = confType;
      this._contentType = contentType;
      this._password = password;
      this._maxMember = maxMember;
      this._voiceMode = voiceMode;
      this._autoClose = autoClose;
      this._mediaType = mediaType;
      this._reserveEnable = reserveEnable;
      this._startTime = startTime;
      this._duration = duration;
      this._sendReserveNote = sendReserveNote;
      this._sendInvitation = sendInvitation;
      this._remindBeforeStart = remindBeforeStart;
      this._remindBeforeEnd = remindBeforeEnd;
      this._members = members;
      this._confTopic = confTopic;
      this._confRoomId = confRoomId;
      this._joinState = joinState;
      this._chatInConf = chatInConf;
      this._appData = appData;
      this._autoRecord = autoRecord;
      this._recordAction = recordAction;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfName = function (confName) {
        this._confName = confName;
      };
      this.getConfName = function () {
        return this._confName;
      };
      this.setContentType = function (contentType) {
        this._contentType = contentType;
      };
      this.getContentType = function () {
        return this._contentType;
      };
      this.setConfType = function (confType) {
        this._confType = confType;
      };
      this.getConfType = function () {
        return this._confType;
      };
      this.setPassword = function (password) {
        this._password = password;
      };
      this.getPassword = function () {
        return this._password;
      };
      this.setMaxMember = function (maxMember) {
        this._maxMember = maxMember;
      };
      this.getMaxMember = function () {
        return this._maxMember;
      };
      this.setVoiceMode = function (voiceMode) {
        this._voiceMode = voiceMode;
      };
      this.getVoiceMode = function () {
        return this._voiceMode;
      };
      this.setAutoClose = function (autoClose) {
        this._autoClose = autoClose;
      };
      this.getAutoClose = function () {
        return this._autoClose;
      };
      this.setMediaType = function (mediaType) {
        this._mediaType = mediaType;
      };
      this.getMediaType = function () {
        return this._mediaType;
      };
      this.setReserveEnable = function (reserveEnable) {
        this._reserveEnable = reserveEnable;
      };
      this.getReserveEnable = function () {
        return this._reserveEnable;
      };
      this.setStartTime = function (startTime) {
        this._startTime = startTime;
      };
      this.getStartTime = function () {
        return this._startTime;
      };
      this.setDuration = function (duration) {
        this._duration = duration;
      };
      this.getDuration = function () {
        return this._duration;
      };
      this.setSendReserveNote = function (sendReserveNote) {
        this._sendReserveNote = sendReserveNote;
      };
      this.getSendReserveNote = function () {
        return this._sendReserveNote;
      };
      this.setSendInvitation = function (sendInvitation) {
        this._sendInvitation = sendInvitation;
      };
      this.getSendInvitation = function () {
        return this._sendInvitation;
      };
      this.setRemindBeforeStart = function (remindBeforeStart) {
        this._remindBeforeStart = remindBeforeStart;
      };
      this.getRemindBeforeStart = function () {
        return this._remindBeforeStart;
      };
      this.setRemindBeforeEnd = function (remindBeforeEnd) {
        this._remindBeforeEnd = remindBeforeEnd;
      };
      this.getRemindBeforeEnd = function () {
        return this._remindBeforeEnd;
      };
      this.setMembers = function (members) {
        this._members = members;
      };
      this.getMembers = function () {
        return this._members;
      };
      this.setConfTopic = function (confTopic) {
        this._confTopic = confTopic;
      };
      this.getConfTopic = function () {
        return this._confTopic;
      };
      this.setConfRoomId = function (confRoomId) {
        this._confRoomId = confRoomId;
      };
      this.getConfRoomId = function () {
        return this._confRoomId;
      };
      this.setJoinState = function (joinState) {
        this._joinState = joinState;
      };
      this.getJoinState = function () {
        return this._joinState;
      };
      this.setChatInConf = function (chatInConf) {
        this._chatInConf = chatInConf;
      };
      this.getChatInConf = function () {
        return this._chatInConf;
      };
      this.setAppData = function (appData) {
        this._appData = appData;
      };
      this.getAppData = function () {
        return this._appData;
      };
      this.setAutoRecord = function (autoRecord) {
        this._autoRecord = autoRecord;
      };
      this.getAutoRecord = function () {
        return this._autoRecord;
      };
      this.setRecordAction = function (recordAction) {
        this._recordAction = recordAction;
      };
      this.getRecordAction = function () {
        return this._recordAction;
      };
    },
    GetOrderMeetList: function (GetOrderMeetListBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          searchByMember: GetOrderMeetListBuilder.getSearchByMember(),
          memberId: GetOrderMeetListBuilder.getMemberId(),
          memberIdType: GetOrderMeetListBuilder.getMemberIdType(),
          confType: GetOrderMeetListBuilder.getConfType(),
          stateInProcess: GetOrderMeetListBuilder.getStateInProcess(),
          reserveEnable: GetOrderMeetListBuilder.getReserveEnable(),
          mediaType: GetOrderMeetListBuilder.getMediaType(),
          createTimeBegin: GetOrderMeetListBuilder.getCreateTimeBegin(),
          createTimeEnd: GetOrderMeetListBuilder.getCreateTimeEnd(),
          pageNo: GetOrderMeetListBuilder.getPageNo(),
          pageSize: GetOrderMeetListBuilder.getPageSize(),
          contentType: GetOrderMeetListBuilder.getContentType(),
        }),
        function (e) {
          const resp = JSON.parse(e.result);
          if (resp.statusCode == '000000') {
            callback(resp);
          } else {
            onError(resp);
          }
        },
        onError
      );
    },
    GetOrderMeetListBuilder: function (
      appId,
      userId,
      searchByMember,
      memberId,
      memberIdType,
      confType,
      stateInProcess,
      reserveEnable,
      mediaType,
      createTimeBegin,
      createTimeEnd,
      pageNo,
      pageSize,
      contentType
    ) {
      this._appId = appId;
      this._userId = userId;
      this._searchByMember = searchByMember;
      this._memberId = memberId;
      this._memberIdType = memberIdType;
      this._confType = confType;
      this._stateInProcess = stateInProcess;
      this._reserveEnable = reserveEnable;
      this._mediaType = mediaType;
      this._createTimeBegin = createTimeBegin;
      this._createTimeEnd = createTimeEnd;
      this._pageNo = pageNo;
      this._pageSize = pageSize;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setSearchByMember = function (searchByMember) {
        this._searchByMember = searchByMember;
      };
      this.getSearchByMember = function () {
        return this._searchByMember;
      };
      this.setMemberId = function (memberId) {
        this._memberId = memberId;
      };
      this.getMemberId = function () {
        return this._memberId;
      };
      this.setMemberIdType = function (memberIdType) {
        this._memberIdType = memberIdType;
      };
      this.getMemberIdType = function () {
        return this._memberIdType;
      };
      this.setConfType = function (confType) {
        this._confType = confType;
      };
      this.getConfType = function () {
        return this._confType;
      };
      this.setStateInProcess = function (stateInProcess) {
        this._stateInProcess = stateInProcess;
      };
      this.getStateInProcess = function () {
        return this._stateInProcess;
      };
      this.setReserveEnable = function (reserveEnable) {
        this._reserveEnable = reserveEnable;
      };
      this.getReserveEnable = function () {
        return this._reserveEnable;
      };
      this.setMediaType = function (mediaType) {
        this._mediaType = mediaType;
      };
      this.getMediaType = function () {
        return this._mediaType;
      };
      this.setCreateTimeBegin = function (createTimeBegin) {
        this._createTimeBegin = createTimeBegin;
      };
      this.getCreateTimeBegin = function () {
        return this._createTimeBegin;
      };
      this.setCreateTimeEnd = function (createTimeEnd) {
        this._createTimeEnd = createTimeEnd;
      };
      this.getCreateTimeEnd = function () {
        return this._createTimeEnd;
      };
      this.setPageNo = function (pageNo) {
        this._pageNo = pageNo;
      };
      this.getPageNo = function () {
        return this._pageNo;
      };
      this.setPageSize = function (pageSize) {
        this._pageSize = pageSize;
      };
      this.getPageSize = function () {
        return this._pageSize;
      };
      this.setContentType = function (contentType) {
        this._contentType = contentType;
      };
      this.getContentType = function () {
        return this._contentType;
      };
    },
    GetHistoryRoom: function (GetHistoryRoomBuilder, success, error) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/History/Search?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: GetHistoryRoomBuilder.getConfId(),
          searchByMember: GetHistoryRoomBuilder.getSearchByMember(),
          memberId: GetHistoryRoomBuilder.getMemberId(),
          memberIdType: GetHistoryRoomBuilder.getMemberIdType(),
          confType: GetHistoryRoomBuilder.getConfType(),
          stateInProcess: GetHistoryRoomBuilder.getStateInProcess(),
          reserveEnable: GetHistoryRoomBuilder.getReserveEnable(),
          mediaType: GetHistoryRoomBuilder.getMediaType(),
          startTimeBegin: GetHistoryRoomBuilder.getStartTimeBegin(),
          startTimeEnd: GetHistoryRoomBuilder.getStartTimeEnd(),
          pageNo: GetHistoryRoomBuilder.getPageNo(),
          pageSize: GetHistoryRoomBuilder.getPageSize(),
        }),
        success,
        error
      );
    },
    GetHistoryRoomBuilder: function (
      confId,
      searchByMember,
      memberId,
      memberIdType,
      confType,
      stateInProcess,
      reserveEnable,
      mediaType,
      startTimeBegin,
      startTimeEnd,
      pageNo,
      pageSize
    ) {
      this._confId = confId;
      this._searchByMember = searchByMember;
      this._memberId = memberId;
      this._memberIdType = memberIdType;
      this._confType = confType;
      this._stateInProcess = stateInProcess;
      this._reserveEnable = reserveEnable;
      this._mediaType = mediaType;
      this._startTimeBegin = startTimeBegin;
      this._startTimeEnd = startTimeEnd;
      this._pageNo = pageNo;
      this._pageSize = pageSize;
      this.setConfId = (confId) => {
        this._confId = confId;
      };
      this.getConfId = () => {
        return this._confId;
      };
      this.setSearchByMember = (searchByMember) => {
        this._searchByMember = searchByMember;
      };
      this.getSearchByMember = () => {
        return this._searchByMember;
      };
      this.setMemberId = (memberId) => {
        this._memberId = memberId;
      };
      this.getMemberId = () => {
        return this._memberId;
      };
      this.setMemberIdType = (memberIdType) => {
        this._memberIdType = memberIdType;
      };
      this.getMemberIdType = () => {
        return this._memberIdType;
      };
      this.setConfType = (confType) => {
        this._confType = confType;
      };
      this.getConfType = () => {
        return this._confType;
      };
      this.setStateInProcess = (stateInProcess) => {
        this._stateInProcess = stateInProcess;
      };
      this.getStateInProcess = () => {
        return this._stateInProcess;
      };
      this.setReserveEnable = (reserveEnable) => {
        this._reserveEnable = reserveEnable;
      };
      this.getReserveEnable = () => {
        return this._reserveEnable;
      };
      this.setMediaType = (mediaType) => {
        this._mediaType = mediaType;
      };
      this.getMediaType = () => {
        return this._mediaType;
      };
      this.setStartTimeBegin = (startTimeBegin) => {
        this._startTimeBegin = startTimeBegin;
      };
      this.getStartTimeBegin = () => {
        return this._startTimeBegin;
      };
      this.setStartTimeEnd = (startTimeEnd) => {
        this._startTimeEnd = startTimeEnd;
      };
      this.getStartTimeEnd = () => {
        return this._startTimeEnd;
      };
      this.setPageNo = (pageNo) => {
        this._pageNo = pageNo;
      };
      this.getPageNo = () => {
        return this._pageNo;
      };
      this.getPageSize = () => {
        return this._pageSize;
      };
    },

    //发布语音
    StartPublishVoice: function (StartPublishVoiceBuilder, callback, onError) {
      RL_Media.deployVideoVoice(true, 'audio');
      let exclusively; //StartPublishVoiceBuilder instanceof Function &&
      if (onError === undefined) {
        onError = callback;
        callback = StartPublishVoiceBuilder;
      } else {
        exclusively = StartPublishVoiceBuilder.getExclusively();
      }

      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/MediaControl/StartPublishVoice?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          exclusively: exclusively,
        }),
        callback,
        onError
      );
    },
    StartPublishVoiceBuilder: function (exclusively) {
      this._exclusively = exclusively;
      this.setExclusively = function (exclusively) {
        this._exclusively = exclusively;
      };
      this.getExclusively = function () {
        return this._exclusively;
      };
    },

    StopPublishVoice: function (StopPublishVoiceBuilder, callback, onError) {
      RL_Media.deployVideoVoice(false, 'audio');
      let exclusively;
      if (
        //StopPublishVoiceBuilder instanceof Function &&
        onError === undefined
      ) {
        onError = callback;
        callback = StopPublishVoiceBuilder;
      } else {
        exclusively = StopPublishVoiceBuilder.getExclusively();
      }
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/MediaControl/StopPublishVoice?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          exclusively: exclusively,
        }),
        callback,
        onError
      );
    },
    StopPublishVoiceBuilder: function (exclusively) {
      this._exclusively = exclusively;
      this.setExclusively = function (exclusively) {
        this._exclusively = exclusively;
      };
      this.getExclusively = function () {
        return this._exclusively;
      };
    },

    StartPublishVideo: function (callback, onError) {
      RL_Media.deployVideoVoice(true, 'video');
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/MediaControl/StartPublishVideo?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode == '000000') {
            callback(resp);
          } else {
            onError(resp);
          }
        },
        onError
      );
    },
    StopPublishVideo: function (callback, onError) {
      RL_Media.deployVideoVoice(false, 'video');
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/MediaControl/StopPublishVideo?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode == '000000') {
            callback(resp);
          } else {
            onError(resp);
          }
        },
        onError
      );
    },

    InviteMember: function (InviteMemberBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/Invite?source=SDK', {
          appId: this.appId,
          userId: this.userId,
          confId: InviteMemberBuilder.getConfId() || this.confId,
          callImmediately: InviteMemberBuilder.getCallImmediately(),
          inviteMembers: InviteMemberBuilder.getInviteMembers(),
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode === '000000') {
            callback(resp);
          } else {
            onError(resp);
          }
        },
        onError
      );
    },
    InviteMemberBuilder: function (confId, callImmediately, inviteMembers) {
      this._confId = confId;
      this._callImmediately = callImmediately;
      this._inviteMembers = inviteMembers;
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setCallImmediately = function (callImmediately) {
        this._callImmediately = callImmediately;
      };
      this.getCallImmediately = function () {
        return this._callImmediately;
      };
      this.setInviteMembers = function (inviteMembers) {
        this._inviteMembers = inviteMembers;
      };
      this.getInviteMembers = function () {
        return this._inviteMembers;
      };
      console.log('confId=======================', this._confId);
      console.log('inviteMembers====================', this._ConnectMedia_inviteMembers);
    },
    MediaControl: function (MediaControlBuilder, callback, onError) {
      //媒体控制 参数参考会议成员媒体控制
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/MediaControl?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          allMember: MediaControlBuilder.getAllMember(),
          unchangable: MediaControlBuilder.getUnchangable(),
          members: MediaControlBuilder.getMembers(),
          action: MediaControlBuilder.getAction(),
          appData: MediaControlBuilder.getAppData(),
        }),
        callback,
        onError
      );
    },
    //confId allMember unchangable action
    MediaControlBuilder: function (appId, userId, confId, allMember, unchangable, members, action, deviceType, appData) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._allMember = allMember;
      this._unchangable = unchangable;
      this._members = members;
      this._deviceType = deviceType;
      this._action = action;
      this._appData = appData;
      this.setDeviceType = function (deviceType) {
        this._deviceType = deviceType;
      };
      this.getDeviceType = function () {
        return this._deviceType;
      };
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setAllMember = function (allMember) {
        this._allMember = allMember;
      };
      this.getAllMember = function () {
        return this._allMember;
      };
      this.setUnchangable = function (unchangable) {
        this._unchangable = unchangable;
      };
      this.getUnchangable = function () {
        return this._unchangable;
      };
      this.setMembers = function (members) {
        this._members = members;
      };
      this.getMembers = function () {
        return this._members;
      };
      this.setAction = function (action) {
        this._action = action;
      };
      this.getAction = function () {
        return this._action;
      };
      this.setAppData = function (appData) {
        this._appData = appData;
      };
      this.getAppData = function () {
        return this._appData;
      };
    },

    UpdateMeetMemberNick: function (UpdateMeetMemberNickBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/Update?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: UpdateMeetMemberNickBuilder.getConfId(),
          memberId: UpdateMeetMemberNickBuilder.getConfId(),
          idType: UpdateMeetMemberNickBuilder.getConfId(),
          appData: UpdateMeetMemberNickBuilder.getAppData(),
          userName: UpdateMeetMemberNickBuilder.getConfId(),
        }),
        callback,
        onError
      );
    },
    UpdateMeetMemberNickBuilder: function (appId, userId, confId, memberId, idType, userName, appData) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._memberId = memberId;
      this._idType = idType;
      this._userName = userName;
      this._appData = appData;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setMemberId = function (memberId) {
        this._memberId = memberId;
      };
      this.getMemberId = function () {
        return this._memberId;
      };
      this.setIdType = function (idType) {
        this._idType = idType;
      };
      this.getIdType = function () {
        return this._idType;
      };
      this.setUserName = function (userName) {
        this._userName = userName;
      };
      this.getUserName = function () {
        return this._userName;
      };
      this.setAppData = function (appData) {
        this._appData = appData;
      };
      this.getAppData = function () {
        return this._appData;
      };
    },

    KickMeetMember: function (KickMeetMemberBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/Kickout?source=SDK', {
          appId: this.appId,
          userId: this.userId,
          confId: KickMeetMemberBuilder.getConfId() || this.confId,
          kickMembers: KickMeetMemberBuilder.getKickMembers(),
        }),
        callback,
        onError
      );
    },
    KickMeetMemberBuilder: function (confId, kickMembers) {
      this._confId = confId;
      this._kickMembers = kickMembers;
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setKickMembers = function (kickMembers) {
        this._kickMembers = kickMembers;
      };
      this.getKickMembers = function () {
        return this._kickMembers;
      };
    },
    RejectInvitation: function (RejectInvitation, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/RejectInvitation?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: RejectInvitation.getConfId(),
          cause: RejectInvitation.getCause(),
        }),
        callback,
        onError
      );
    },
    RejectInvitationBuilder: function (appId, userId, confId, cause) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._cause = cause;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setCause = function (cause) {
        this._cause = cause;
      };
      this.getCause = function () {
        return this._cause;
      };

      this.setRejectInvitationMembers = function (RejectInvitationMembers) {
        this._RejectInvitationMembers = RejectInvitationMembers;
      };
      this.getRejectInvitationMembers = function () {
        return this._RejectInvitationMembers;
      };
    },
    AcceptInvitation: function (AcceptInvitationBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/AcceptInvitation?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: AcceptInvitationBuilder.getConfId(),
          cause: AcceptInvitationBuilder.getCause(),
        }),
        callback,
        onError
      );
    },
    AcceptInvitationBuilder: function (appId, userId, confId, cause) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._cause = cause;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setCause = function (cause) {
        this._cause = cause;
      };
      this.getCause = function () {
        return this._cause;
      };
    },
    leaveMeeting: function (callback, onError) {
      // debugger
      // if (!this.callId){
      //   return
      // }
      // debugger
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/Quit?source=SDK', {
          // "appId": this.appid,
          // "userId": this.userId,
          confId: this.confId,
        }),
        callback,
        onError
      );
      RL_Media.DisconnectMedia(
        function (e) {
          console.log(e, 'quit meeting ');
        },
        function (err) {
          console.log(err);
        }
      );

      this.callId = null;
      this.called = null;
      this.caller = null;
    },
    disconnectMedia(callback, onError) {
      RL_Media.DisconnectMedia(
        (e) => {
          console.log(e, 'quit meeting ');
          callback && callback(e);
        },
        (err) => {
          console.log('失败====', err);
          onError && onError(err);
        }
      );
      this.callId = null;
      this.called = null;
      this.caller = null;
    },
    prolongMeetTime: function (tryMinDuration, tryMaxDuration, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/ExtendDuration?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          tryMinDuration: tryMinDuration,
          tryMaxDuration: tryMaxDuration,
        }),
        function (e) {
          if (e.result) {
            let result = JSON.parse(e.result);
            if (result.statusCode === '000000') {
              callback(result);
            } else {
              onError(result);
            }
          }
        },
        onError
      );
    },
    DeleteMeeting: function (confId, callback, onError) {
      if (confId instanceof Function) {
        onError = callback;
        callback = confId;
      } else if (confId) {
        this.confId = confId;
      }
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Delete?source=SDK', {
          confId: this.confId,
        }),
        callback,
        onError
      );
      RL_Media.DisconnectMedia(
        function (e) {
          console.log(e, 'quit meeting ');
        },
        function (err) {
          console.log(err);
        }
      );

      this.callId = null;
      this.called = null;
      this.caller = null;
    },
    TransferModerator: function (TransferModeratorBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/TransferModerator?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: TransferModeratorBuilder.getConfId(),
          members: TransferModeratorBuilder.getMembers(),
        }),
        callback,
        onError
      );
    },
    TransferModeratorBuilder: function (appId, userId, confId, members) {
      this._appId = appId;
      this._userId = userId;
      this._confId = confId;
      this._members = members;
      this.setAppId = function (appId) {
        this._appId = appId;
      };
      this.getAppId = function () {
        return this._appId;
      };
      this.setUserId = function (userId) {
        this._userId = userId;
      };
      this.getUserId = function () {
        return this._userId;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setMembers = function (members) {
        this._members = members;
      };
      this.getMembers = function () {
        return this._members;
      };
    },

    GetAbstract: function (GetAbstractBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Abstract/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          historyConf: GetAbstractBuilder.getHistoryConf(),
          pageNo: GetAbstractBuilder.getPageNo(),
          pageSize: GetAbstractBuilder.getPageSize(),
        }),
        function (e) {
          if (e.result) {
            let result = JSON.parse(e.result);
            if (result.statusCode === '000000') {
              callback(result);
            } else {
              onError(result);
            }
          }
        },
        onError
      );
    },
    GetAbstractBuilder: function (historyConf, pageNo, pageSize) {
      this._historyConf = historyConf;
      this._pageNo = pageNo;
      this._pageSize = pageSize;
      this.setHistoryConf = function (historyConf) {
        this._historyConf = historyConf;
      };
      this.getHistoryConf = function () {
        return this._historyConf;
      };
      this.setPageNo = function (pageNo) {
        this._pageNo = pageNo;
      };
      this.getPageNo = function () {
        return this._pageNo;
      };
      this.setPageSize = function (pageSize) {
        this._pageSize = pageSize;
      };
      this.getPageSize = function () {
        return this._pageSize;
      };
    },

    UpdateAbstract: function (UpdateAbstractBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Abstract/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          historyConf: UpdateAbstractBuilder.getHistoryConf(),
          abstractData: UpdateAbstractBuilder.getAbstractData(),
          abstractType: UpdateAbstractBuilder.getAbstractType(),
        }),
        callback,
        onError
      );
    },
    UpdateAbstractBuilder: function (historyConf, abstractData, abstractType) {
      this._historyConf = historyConf;
      this._abstractData = abstractData;
      this._abstractType = abstractType;
      this.setHistoryConf = function (historyConf) {
        this._historyConf = historyConf;
      };
      this.getHistoryConf = function () {
        return this._historyConf;
      };
      this.setAbstractData = function (abstractData) {
        this._abstractData = abstractData;
      };
      this.getAbstractData = function () {
        return this._abstractData;
      };
      this.setAbstractType = function (abstractType) {
        this._abstractType = abstractType;
      };
      this.getAbstractType = function () {
        return this._abstractType;
      };
    },
    disconnectMember: function (memberList, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/Disconnect?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          members: memberList,
        }),
        callback,
        onError
      );
    },

    /**
     * 0：锁定 1：解锁  2：锁定“发起白板操作” 3：解锁 4：锁定“白板标注” 5：解锁
     *
     * **/
    LockMeet: function (LockMeetBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/LockUnlock?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: this.confId,
          action: LockMeetBuilder.getAction(),
        }),
        callback,
        onError
      );
    },
    LockMeetBuilder: function (action) {
      this._action = action;
      this.setAction = function (action) {
        this._action = action;
      };
      this.getAction = function (action) {
        return this._action;
      };
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
    },
    GetMeetingMemberInfoBuilder: function (confId, memberId, idType) {
      this._confId = confId;
      this._memberId = memberId;
      this._idType = idType;
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setMemberId = function (memberId) {
        this._memberId = memberId;
      };
      this.getMemberId = function () {
        return this._memberId;
      };
      this.setIdType = function (idType) {
        this._idType = idType;
      };
      this.getIdType = function () {
        return this._idType;
      };
    },
    UpdateSummary(data, success, error) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder(
          '/REST/Conference/Abstract/Update?source=SDK',
          Object.assign(
            {
              userId: this.userId,
              appId: this.appid,

              // confId: UpdateSummaryBuilder.getConfId(),
              // abstractType: UpdateSummaryBuilder.getAbstractType(),
              // historyConf: UpdateSummaryBuilder.getHistoryConf(),
              // abstractData: UpdateSummaryBuilder.getAbstractData()
            },
            data
          )
        ),
        success,
        error
      );
    },
    GetSummaryList(data, success, error) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder(
          '/REST/Conference/Abstract/List?source=SDK',
          Object.assign(
            {
              appId: this.appid,
              userId: this.userId,
              // confId: GetSummaryListBuilder.getConfId(),
              // historyConf: GetSummaryListBuilder.getHistoryConf(),
              // pageNo: GetSummaryListBuilder.getPageNo(),
              // pageSize: GetSummaryListBuilder.getPageSize(),
              // querySelf: GetSummaryListBuilder.getQuerySelf()
            },
            data
          )
        ),
        success,
        error
      );
    },
    DeleteAbstract(data, success, error) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder(
          '/REST/Conference/Abstract/Delete?source=SDK',
          Object.assign(
            {
              appId: this.appid,
              userId: this.userId,
            },
            data
          )
        ),
        success,
        error
      );
    },
    GetMeetingMemberInfo: function (GetMeetingMemberInfoBuilder, callback, onerror) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Member/Info?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: GetMeetingMemberInfoBuilder.getConfId() || this.confId,
          memberId: GetMeetingMemberInfoBuilder.getMemberId(),
          idType: GetMeetingMemberInfoBuilder.getIdType(),
        }),
        callback,
        onError
      );
    },
    SetConfLayout: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/SetConfLayout?source=SDK', {
          LayoutIdx: data.LayoutIdx,
          MainVenue: data.MainVenue,
          confId: data.confId,
        }),
        callback,
        onError
      );
    },
    // 开始会议录制
    RecordStart: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Record/Start?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          recordType: data.recordType, //目前只支持flv,aac,h264,mp4
          outputPath: data.outputPath,
          outputFilename: data.outputFilename,
          model: data.model,
          members: data.members,
          layoutIdx: data.layoutIdx || '-1',
          resolutionIdx: data.resolutionIdx || '2',
          rtmpPushUrl: data.rtmpPushUrl || '',
        }),
        callback,
        onError
      );
    },
    // 暂停会议录制
    RecordPasue: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Record/Pasue?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          sessionId: data.sessionId,
        }),
        callback,
        onError
      );
    },
    // 恢复会议录制
    RecordResume: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Record/Resume?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          sessionId: data.sessionId,
        }),
        callback,
        onError
      );
    },
    // 停止会议录制
    RecordStop: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Record/Stop?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          sessionId: data.sessionId,
        }),
        callback,
        onError
      );
    },
    // 会议录制成员切换
    RecordSwitchMember: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Record/SwitchMember?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          sessionId: data.sessionId,
          model: data.model,
          members: data.members,
          layoutIdx: data.layoutIdx,
        }),
        callback,
        onError
      );
    },
    // 获取会议录制文件列表
    RecordGetFileList: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Record/GetFileList?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          sessionId: data.sessionId,
          historyConf: data.historyConf,
        }),
        callback,
        onError
      );
    },
    // 获取会议录制会话列表
    RecordGetSessions: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/Record/GetSessions?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          historyConf: data.historyConf,
          filename: data.filename,
        }),
        callback,
        onError
      );
    },
    // 删除会议录制文件
    /*
    @historyConf 必选 0:当前会议 1:历史会议
    @filename 必选 录像文件名，需要带扩展名
    @prefix 可选 文件路径匹配值， 如果带该参数，只有录像存放路径中，有prefix的值，才删除，否则，不删除，为空时，删除会议下所有filename的文件
  */
    RecordDelete: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder(
          '/REST/Conference/Record/Delete?source=SDK',
          Object.assign(
            {
              appId: this.appid,
              userId: this.userId,
              confId: this.confId,
            },
            data
          )
        ),
        callback,
        onError
      );
    },
    // 更新历史会议议题
    historyConfTopicUpdate: function (HistoryConfTopicBuilder, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/REST/Conference/History/Update?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: HistoryConfTopicBuilder.getConfId() || this.confId,
          confTopic: HistoryConfTopicBuilder.getConfTopic(),
        }),
        function (e) {
          let resp = JSON.parse(e.result);
          if (resp.statusCode != '000000') {
            onError(resp);
            return;
          } else {
            callback(resp);
          }
        },
        onError
      );
    },
    HistoryConfTopicBuilder: function (confId, confTopic) {
      this._confTopic = confTopic;
      this._confId = confId;
      this.setConfId = function (confId) {
        this._confId = confId;
      };
      this.getConfId = function () {
        return this._confId;
      };
      this.setConfTopic = function (confTopic) {
        this._confTopic = confTopic;
      };
      this.getConfTopic = function () {
        return this._confTopic;
      };
    },
    GetRecordFileList: function (data, callback, onError) {
      RL_Media.ConferenceMsg(
        new RL_Media.ConferenceMsgBuilder('/Conference/Record/List?source=SDK', {
          appId: this.appid,
          userId: this.userId,
          confId: data.confId || this.confId,
          historyConf: data.historyConf,
        }),
        callback,
        onError
      );
    },
  };
  window.RL_MEET = new RL_MT();
})();
(function () {
  if (typeof define === 'function') {
    define(function () {
      return RL_MEET;
    });
  } else if (typeof module !== 'undefined' && module !== null) {
    module.exports = RL_MEET;
  }
})();
