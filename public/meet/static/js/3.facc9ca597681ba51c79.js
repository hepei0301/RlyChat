webpackJsonp([3],{

/***/ "EV7L":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "Ec0G":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "ItLW":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "feWf":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/babel-runtime/core-js/json/stringify.js
var stringify = __webpack_require__("mvHQ");
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__("Dd8w");
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./node_modules/vuex/dist/vuex.esm.js
var vuex_esm = __webpack_require__("NYxO");

// EXTERNAL MODULE: ./src/utils/util.js
var util = __webpack_require__("oFuF");

// EXTERNAL MODULE: ./src/store/index.js + 5 modules
var store = __webpack_require__("IcnI");

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__("bOdI");
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// CONCATENATED MODULE: ./src/sdkBridge/V3Meeting.js


var _V3_Meeting;


var V3_Meeting = (_V3_Meeting = {
    // 会议状态整理
    dataFormate: function dataFormate(data) {
        if (data.memberId) {
            if (data.memberId.indexOf("@") > -1) {
                data.memberId = data.memberId.split("@")[0];
            }
            if (data.state & 0x000100 || data.state & 0x000001) {
                // 媒体在线 应用在线
                console.log(data.memberId, "媒体在线");
                data["Mstate"] = 4;
            } else if (data.state & 0x000200) {
                //用户拒绝邀请
                if (data.cause == "107408") {
                    //107408 呼叫超时 （voip场景）,107603 被叫拒接 （voip场景）, 107781 用户拒接 （落地呼叫场景）,107775 无人接听 （落地呼叫场景）
                    data["Mstate"] = 6; //呼叫超时
                } else {
                    data["Mstate"] = 1; // 已拒绝
                }
                console.log(data.memberId, "已拒绝");
            } else if (data.state & 0x000400) {
                console.log(data.memberId, "正在接通");
                data["Mstate"] = 2; // 正在接通
            } else if (data.state & 0x00040000) {
                //媒体超时
                console.log(data.memberId, "媒体超时");
                if (data.memberId === store["a" /* default */].state.user_account) {
                    console.log('媒体超时, 退出会议');
                    this.$message.error(rxVue.$t('last.mediaTimeout'));
                    this.leaveMeeting();
                }
            } else if (data.state & 0x000800) {
                console.log(data.memberId, "已经挂断");
                data["Mstate"] = 3; // 已经挂断
            }
            // if ([7, 8, 9].indexOf(data.roleId) == -1) { // 7 遥控端创建者,8 遥控端主持人,9 遥控端成员
            //   data["state"] = 0;
            // }
        }
        return data;
    },

    // 创建会议
    createMeeting: function createMeeting(params, succFunc, errFunc) {
        var createMeetbuilder = new RL_MEET.CreateMeetBuilder();
        createMeetbuilder.setConfName(params.confName);
        createMeetbuilder.setConfRoomId(params.confRoomId);
        createMeetbuilder.setChatInConf(0); //九宫格会议传值为0,不会发送创建群组和退出群组的通知
        createMeetbuilder.setConfType(params.confType);
        createMeetbuilder.setVoiceMode(2);
        createMeetbuilder.setMembers(params.members);
        createMeetbuilder.setAutoClose(0);
        createMeetbuilder.setMaxMember(9);
        createMeetbuilder.setReserveEnable(params.reserveEnable);
        createMeetbuilder.setAppData(params.appData);
        RL_MEET.CreateMeet(createMeetbuilder, function (res) {
            console.log(res, '创建会议');
            succFunc && succFunc(res);
        }, function (err) {
            errFunc && errFunc(err);
        });
    },

    // 邀请人员入会
    inviteMember: function inviteMember(params, succFunc, errFunc) {
        var inviteMemberBuilder = new RL_MEET.InviteMemberBuilder();
        inviteMemberBuilder.setInviteMembers(params.memberslist);
        inviteMemberBuilder.setConfId(params.confId);
        inviteMemberBuilder.setCallImmediately(1);
        RL_MEET.InviteMember(inviteMemberBuilder, function (res) {
            console.info(res, "邀请成功");
            succFunc && succFunc(res);
        }, function (err) {
            console.log(err, "邀请失败");
            errFunc && errFunc(err);
        });
    },

    // 根据人员id拉取视频流
    cancelVideo: function cancelVideo(obj, succFunc, errFunc) {
        var cancelVideoBuilder = new RL_Media.cancelVideoBuilder();
        cancelVideoBuilder.setMediaInfo(obj.mediaInfo);
        cancelVideoBuilder.setCallId(RL_MEET.callId);
        cancelVideoBuilder.setCalled(obj.mediaInfo.confId);
        cancelVideoBuilder.setUserName(obj.userName);
        cancelVideoBuilder.setMemberId(obj.memberId);
        RL_Media.cancelVideo(cancelVideoBuilder, function (res) {
            console.log(res);
            succFunc && succFunc(res);
        }, function (err) {
            console.log(err);
            errFunc && errFunc(err);
        });
    },

    // 根据confid获取会议信息
    getMeetInfo: function getMeetInfo(confId, succFunc, errFunc) {
        var GetMeetInfoBuilder = new RL_MEET.GetMeetInfoBuilder();
        GetMeetInfoBuilder.setConfId(confId);
        RL_MEET.GetMeetInfo(GetMeetInfoBuilder, function (res) {
            succFunc && succFunc(res);
        }, function (err) {
            errFunc && errFunc(err);
        });
    },

    // 获取参会人员列表
    getMeetMemberList: function getMeetMemberList(succFunc, errFunc) {
        RL_MEET.GetMeetMemberList(function (res) {
            succFunc && succFunc(res);
        }, function (err) {
            errFunc && errFunc(err);
        });
    },

    // 加入会议
    joinMeetRoom: function joinMeetRoom(params, succFunc, errFunc) {
        var joinMeetRoomBuilder = new RL_MEET.JoinMeetRoomBuilder();
        joinMeetRoomBuilder.setConfId(params.confId);
        joinMeetRoomBuilder.setUserName(params.userName);
        joinMeetRoomBuilder.setJoinType(params.joinType);
        RL_MEET.JoinMeetRoom(joinMeetRoomBuilder, function (res, stream) {
            succFunc && succFunc(res, stream);
        }, function (err) {
            errFunc && errFunc(err);
        });
    },

    // 开启声音
    startPublishVoice: function startPublishVoice() {
        RL_MEET.StartPublishVoice(function (res) {
            console.log(res, "StartPublishvoice success");
        }, function (err) {
            console.error(err, "StartPublishvoice error");
        });
    },

    // 关闭声音
    stopPublishVoice: function stopPublishVoice() {
        RL_MEET.StopPublishVoice(function (res) {
            console.log(res, "StopPublishVoice success");
        }, function (err) {
            console.error(err, "StopPublishVoice error");
        });
    },

    // 开启视频
    startPublishVideo: function startPublishVideo() {
        RL_MEET.StartPublishVideo(function (res) {
            console.log(res, "StartPublishVideo success");
        }, function (err) {
            console.error(err, "StartPublishVideo error");
        });
    },

    // 关闭视频
    stopPublishVideo: function stopPublishVideo() {
        RL_MEET.StopPublishVideo(function (res) {
            console.log(res, "StopPublishVideo success");
        }, function (err) {
            console.error(err, "StopPublishVideo error");
        });
    },

    // 离开会议
    leaveMeeting: function leaveMeeting(succFunc, errFunc) {
        RL_MEET.leaveMeeting(function (res) {
            succFunc && succFunc(res);
        }, function (err) {
            errFunc && errFunc(err);
        });
    },

    //删除会议
    DeleteMeeting: function DeleteMeeting(confId, succFunc, errFunc) {
        RL_MEET.DeleteMeeting(confId, function (res) {
            succFunc && succFunc(res);
        }, function (err) {
            errFunc && errFunc(err);
        });
    }
}, defineProperty_default()(_V3_Meeting, "getMeetMemberList", function getMeetMemberList(succFunc, errFunc) {
    RL_MEET.GetMeetMemberList(function (res) {
        succFunc && succFunc(res);
    }, function (err) {
        errFunc && errFunc(err);
    });
}), defineProperty_default()(_V3_Meeting, "rejectInvitation", function rejectInvitation(confId, succFunc, errFunc) {
    var rejectInvitationBuilder = new RL_MEET.RejectInvitationBuilder();
    rejectInvitationBuilder.setConfId(confId);
    rejectInvitationBuilder.setCause("107603");
    RL_MEET.RejectInvitation(rejectInvitationBuilder, function (res) {
        console.info(res, "拒绝邀请成功");
        succFunc && succFunc(res);
    }, function (err) {
        console.log(err, "拒绝邀请失败");
        errFunc && errFunc(err);
    });
}), _V3_Meeting);
/* harmony default export */ var V3Meeting = (V3_Meeting);
// CONCATENATED MODULE: ./src/sdkBridge/sdkCallbacks.js





var Sdk_Callbacks = {
  onConnectStateChangeCallback: function onConnectStateChangeCallback(vm, msg) {
    console.log('onConnectStateChangeCallback:', msg);
    if (msg.code == 1) {
      vm.$message.error(vm.$t('modelMessage.disconnectAndReLogin'));
    } else if (msg.code == 2) {
      vm.$message.error(vm.$t('modelMessage.reconnect'));
    } else if (msg.code == 3) {
      vm.$message.success(vm.$t('modelMessage.reconnectionSuccessful'));
    } else if (msg.code == 4) {
      vm.$message.error(vm.$t('modelMessage.kickedOff'));
      vm.$bus.emit('getMeetingState', function (res) {
        if (!!res) V3Meeting.leaveMeeting(); // 离开会议
      });
      vm.$router.push('/');
      setTimeout(function () {
        location.reload();
      }, 1000);
    } else if (msg.code == 5) {
      vm.$message.error(vm.$t('modelMessage.disconnectAndReLogin'));
      if (msg.errCode && msg.errCode == "550004") {
        this.repeatLoginCertification(store["a" /* default */].state.user_account, 1, function () {
          console.log(vm.$t('modelMessage.unresponsiveLogin'));
        });
        return;
      }
      vm.$bus.emit('getMeetingState', function (res) {
        if (!!res) V3Meeting.leaveMeeting(); // 离开会议
      });
      vm.$router.push('/');
      setTimeout(function () {
        location.reload();
      }, 1000);
    }
  },
  repeatLoginCertification: function repeatLoginCertification(userInfo, loginType, callback) {
    var timestamp = util["a" /* default */].generateTimeNumber();
    //没有服务器获取sig值时，可以使用如下代码获取sig
    var sig = hex_md5(userInfo.appid + userInfo.account + timestamp + userInfo.apptoken);
    var param = {
      userName: userInfo.account,
      type: loginType,
      sig: sig,
      timestamp: timestamp
    };
    RL_YTX_NEW.login(param, function (obj) {
      console.log("RL_YTX_NEW repeatLoginCertification:", obj);
      callback && callback(obj);
    }, function (err) {
      console.error('完整认证登录失败。错误码:' + (err.msg || err.code));
    });
  },
  onMsgReceiveCallback: function onMsgReceiveCallback(vm, res) {
    console.log('onMsgReceiveCallback/handleMsg:', res);
    if (Array.isArray(res)) {
      res.forEach(function (item) {
        vm.$bus.emit('handleMsg', item);
      });
    } else {
      vm.$bus.emit('handleMsg', res);
    }
  },
  onMsgNotifyReceiveCallback: function onMsgNotifyReceiveCallback(vm, msg) {
    console.log('onMsgNotifyReceiveCallback:', msg);
    var msgType = msg.msgType;
    // msgType 21阅后即焚 24消息已读 25消息撤回
    vm.$bus.emit('handleMsg', msg);
  },
  onGroupNoticeReceiveCallback: function onGroupNoticeReceiveCallback(vm, msgs) {
    console.log('onGroupNoticeReceiveCallback:', msgs);
    msgs = msgs instanceof Array ? msgs : [msgs];
    var filterMsg = [];

    var _loop = function _loop(i) {
      var msg = msgs[i];
      var peopleArray = [];
      if (msg.memberList) {
        msg.memberList.forEach(function (item) {
          var index = item.member.lastIndexOf("#");
          var obj = {};
          obj.nickName = item.nickName;
          obj.account = item.member.substring(index + 1, item.member.length);
          peopleArray.push(obj);
        });
      }
      var owner = msg.adminName ? msg.adminName : msg.admin;
      var auditType = msg.auditType;
      // 过滤因创建头像、群开关等操作造成的脏数据推送，直接丢弃
      if (msg.ext) {
        try {
          var ext = JSON.parse(msg.ext);
          if (!ext.groupDeclared && ext.groupPhoto) {
            return 'continue';
          }
        } catch (e) {
          console.log("消息解析失败：", msg);
          if (msg.ext && !/groupDeclared/.test(msg.ext) && /groupPhoto/.test(msg.ext)) {
            return 'continue';
          }
        }
      }
      // auditType注释
      // 1申请加入群组，
      // 2邀请加入群组，
      // 3直接加入群组，
      // 4群主通知解散群组，
      // 5退出群组，
      // 6被踢出群组，
      // 7确认申请加入，
      // 8确认邀请结果(拒绝），
      // 10管理员修改群组信息，
      // 11用户修改群组成员名片
      // 12,
      // 13 设置/取消管理员
      // 14扫码进群
      // 17 新增成员被禁言通知
      // 18 新增全员禁言通知
      // 19 群成员解除禁言通知
      // 20 解除全员禁言通知
      // 21 新增创建会议通知
      // 22 新增会议成员加入通知
      // 23 新增会议成员退出通知
      // 24 新增会议结束通知
      var str = '';
      peopleArray.forEach(function (item, i) {
        if (item.account == store["a" /* default */].state.user_account) {
          str += '\u4F60';
        } else {
          if (i == peopleArray.length - 1) {
            str += '<a class="group_prompt" data-account="' + item.account + '">' + item.nickName + '</a>';
          } else {
            str += '<a class="group_prompt" data-account="' + item.account + '">' + item.nickName + '</a>\u3001';
          }
        }
      });
      switch (auditType) {
        case '1':
          msg.msgContent = '<a class="group_prompt" data-account="' + msg.admin + '">' + msg.adminNickName + '</a>' + rxVue.$t('last.groupInviteTip') + '<a class="group_prompt" data-account="' + msg.member + '">' + msg.nickName + '</a>' + rxVue.$t('last.inviteWaite');
          break;
        case '2':
          msg.msgContent = '<a class="group_prompt" data-account="' + msg.member + '">' + msg.nickName + '</a>' + rxVue.$t('last.inviteJoinGroup');
          break;
        case '3':
          msg.msgContent = '<a class="group_prompt" data-account="' + msg.member + '">' + msg.nickName + '</a>' + rxVue.$t('last.inInviteJoinGroup');
          break;
        case '4':
          msg.msgContent = rxVue.$t('last.groupDimiss');
          break;
        case '5':
          if (msg.member != vm.user_account) {
            msg.msgContent = '<a class="group_prompt" data-account="' + msg.member + '">' + msg.memberName + '</a>' + rxVue.$t('last.exitGroup');
          }
          break;
        case '6':
          if (msg.member != vm.user_account) {
            //判断当前被移除人员是否是自己
            // 判断谁操作的删除
            msg.msgContent = '<a class="group_prompt" data-account="' + msg.member + '">' + msg.memberName + '</a>' + rxVue.$t('last.kickGroup');
          } else {
            // 待确认 是否需要在常用聊天列表中删除此项
            msg.msgContent = rxVue.$t('last.kickGroupSelf');
          }
          break;
        case '7':
          msg.msgContent = '<a class="group_prompt" data-account="' + msg.admin + '">' + msg.adminNickName + '</a>' + rxVue.$t('last.groupInviteSuccess') + '<a class="group_prompt" data-account="' + msg.member + '">' + msg.nickName + '</a>' + rxVue.$t('last.joinG');
          break;
        case '8':
          // msg.msgContent = str + '加入了群组'
          break;
        case '10':
          if (msg.ext.indexOf('isManage') > -1) {
            //仅群主及管理员可管理该群
            var isManage = JSON.parse(msg.ext).isManage;
            if (isManage == 1) {
              //关闭
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupClose') + rxVue.$t('last.groupManageSet'));
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupOpen') + rxVue.$t('last.groupManageSet'));
            }
          } else if (msg.ext.indexOf('isAtAll') > -1) {
            //仅群主和管理员可@所有人
            var isAtAll = JSON.parse(msg.ext).isAtAll;
            if (isAtAll == 1) {
              //关闭
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupClose') + rxVue.$t('last.groupManageAite'));
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupOpen') + rxVue.$t('last.groupManageAite'));
            }
          } else if (msg.ext.indexOf('inviteOperation') > -1) {
            //仅群主和管理员可邀请人
            var inviteOperation = JSON.parse(msg.ext).inviteOperation;
            if (inviteOperation == 1) {
              //关闭
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupClose') + rxVue.$t('last.groupManageInvite'));
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupOpen') + rxVue.$t('last.groupManageInvite'));
            }
          } else if (msg.ext.indexOf('checkAdminFlag') > -1) {
            //入群需群主和管理员同意
            var checkAdminFlag = JSON.parse(msg.ext).checkAdminFlag;
            if (checkAdminFlag == 1) {
              //开启
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupOpen') + rxVue.$t('last.groupInviteConfirm'));
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupClose') + rxVue.$t('last.groupInviteConfirm'));
            }
          } else if (msg.ext.indexOf('qrCodeJoinFlag') > -1) {
            //二维码分享入群邀请
            var qrCodeJoinFlag = JSON.parse(msg.ext).qrCodeJoinFlag;
            if (qrCodeJoinFlag == 1) {
              //开启
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupOpen') + rxVue.$t('last.groupCodeInvite'));
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupClose') + rxVue.$t('last.groupCodeInvite'));
            }
          } else if (msg.ext.indexOf('linkJoinFlag') > -1) {
            //链接分享入群邀请
            var linkJoinFlag = JSON.parse(msg.ext).linkJoinFlag;
            if (linkJoinFlag == 1) {
              //开启
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupOpen') + rxVue.$t('last.groupLinkinvite'));
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + (rxVue.$t('last.groupClose') + rxVue.$t('last.groupLinkinvite'));
            }
          } else if (msg.ext.indexOf('groupDeclared') > -1) {
            //修改群公告
            if (msg.admin == vm.user_account || msg.member == vm.user_account) {
              msg.msgContent = rxVue.$t('connect.you') + rxVue.$t('last.groupDeclared');
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + rxVue.$t('last.groupDeclared');
            }
          } else {
            if (msg.admin == vm.user_account) {
              //修改群名称
              msg.msgContent = rxVue.$t('connect.you') + rxVue.$t('last.editGroupName');
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a>' + rxVue.$t('last.editGroupName');
            }
          }
          break;
        case '11':
          break;
        case '13':
          var role = JSON.parse(msg.ext).role;
          if (role == '2') {
            if (msg.member == vm.user_account) {
              msg.msgContent = rxVue.$t('connect.you') + rxVue.$t('last.setGroupManage');
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + msg.member + '">' + msg.memberName + '</a>' + rxVue.$t('last.setGroupManage');
            }
          } else if (role == '3') {
            if (msg.member == vm.user_account) {
              msg.msgContent = rxVue.$t('connect.you') + rxVue.$t('last.setGroupMember');
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + msg.member + '">' + msg.memberName + '</a>' + rxVue.$t('last.setGroupMember');
            }
          } else {
            if (msg.member == vm.user_account) {
              msg.msgContent = rxVue.$t('connect.you') + rxVue.$t('last.setGroupOwner');
            } else {
              msg.msgContent = '<a class="group_prompt" data-account="' + msg.member + '">' + msg.memberName + '</a>' + rxVue.$t('last.setGroupOwner');
            }
          }
          break;
        case '14':
          // 待确认 判断当前操作人员是否是自己
          if (msg.admin == store["a" /* default */].state.user_account || msg.msgDomain && msg.msgDomain.admin == store["a" /* default */].state.user_account) {
            msg.msgContent = rxVue.$t('connect.you') + rxVue.$t('last.groupInviteTip') + str + rxVue.$t('last.beenInvite');
          } else {
            msg.msgContent = '<a class="group_prompt" data-account="' + msg.admin + '">' + msg.adminNickName + '</a>' + rxVue.$t('last.groupInviteTip') + ' ' + str + rxVue.$t('last.beenInvite');
          }
          break;
        case '18':
          //新增全员禁言通知
          // msg.msgContent = `群禁言已开启`;
          msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + rxVue.$t('last.groupMute');
          break;
        case '20':
          // msg.msgContent = `群禁言已关闭`;
          msg.msgContent = '<a class="group_prompt" data-account="' + (msg.admin || msg.member) + '">' + (msg.adminName || msg.nickName) + '</a> ' + rxVue.$t('last.groupUnMute');
          break;
        case '21':
          if (msg.memberList.length && msg.memberList[0].member == store["a" /* default */].state.user_account) {
            msg.msgContent = rxVue.$t('connect.you') + rxVue.$t('last.groupMediaCall');
          } else {
            msg.msgContent = '<a class="group_prompt" data-account="' + msg.memberList[0].member + '">' + msg.memberList[0].nickName + '</a> ' + rxVue.$t('last.groupMediaCall');
          }
          break;
        case '24':
          msg.msgContent = rxVue.$t('last.groupMediaCallClose');
          break;
      }
      filterMsg.push(extends_default()({
        senderNickName: store["a" /* default */].state.user_account,
        msgSender: store["a" /* default */].state.user_account,
        msgReceiver: msg.groupId,
        msgDateCreated: new Date().getTime()
      }, msg));
      console.log(filterMsg);
    };

    for (var i = 0; i < msgs.length; i++) {
      var _ret = _loop(i);

      if (_ret === 'continue') continue;
    }
    filterMsg.length && vm.$bus.emit('handleMsg', filterMsg);
  },
  onCallMsgCallback: function onCallMsgCallback(vm, msg) {
    console.log('onCallMsgCallback:', msg);
    vm.$bus.emit('dealCallMsg', msg);
  },
  onLineStateNotifyListenerCallback: function onLineStateNotifyListenerCallback(vm, msg) {
    console.log('onLineStateNotifyListenerCallback:', msg);
    if (msg && msg.length) {
      msg.forEach(function (v) {
        // vm.$bus.emit('setConnectorOnlineStatus', /#/.test(v['1']) ? v['1'].split('#')[1] : v['1'], v['2'] == '1' ? '1' : '0')
        vm.$bus.emit('setConnectorOnlineStatus', v);
      });
    }
  },
  InviteJoinMeetListenerCallback: function InviteJoinMeetListenerCallback(vm, msg) {
    console.log('InviteJoinMeetListenerCallback:会议通知', msg);
    vm.$bus.emit('inviteJoinMeet', msg);
  },
  MeetingListenerCallback: function MeetingListenerCallback(vm, msg) {
    console.log('MeetingListenerCallback:', msg);
    vm.$bus.emit('meetlistener', msg);
  },
  onConferenceNotifyLinstenerCallback: function onConferenceNotifyLinstenerCallback(vm, msg) {
    console.log('onConferenceNotifyLinstenerCallback:im通知', msg);
    vm.$bus.emit('onConferenceNotify', msg);
  }
};

/* harmony default export */ var sdkCallbacks = (Sdk_Callbacks);
// CONCATENATED MODULE: ./src/sdkBridge/listeners.js
/*
* sdk各类消息监听功能封装
* onConnectStateChange 用户状态监听
* onMsgReceive 接收消息监听
* onMsgNotifyReceive 消息阅后即焚、撤回、已读监听
* onGroupNoticeReceive 群组通知消息监听
* onCallMsg 音视频请求监听
* */

var IM_Sdk_Listeners = {
  onConnectStateChange: function onConnectStateChange(vm) {
    window.parent.RL_YTX_NEW.onConnectStateChangeLisenter(function (obj) {
      return sdkCallbacks.onConnectStateChangeCallback(vm, obj);
    });
  },
  onMsgReceive: function onMsgReceive(vm) {
    window.parent.RL_Chat.onMsgReceiveListener(function (msg) {
      return sdkCallbacks.onMsgReceiveCallback(vm, msg);
    });
  },
  onMsgNotifyReceive: function onMsgNotifyReceive(vm) {
    window.parent.RL_Chat.onMsgNotifyReceiveListener(function (msg) {
      return sdkCallbacks.onMsgNotifyReceiveCallback(vm, msg);
    });
  },
  onGroupNoticeReceive: function onGroupNoticeReceive(vm) {
    window.parent.RL_Chat.onNoticeReceiveListener(function (notice) {
      return sdkCallbacks.onGroupNoticeReceiveCallback(vm, notice);
    });
  },
  onCallMsg: function onCallMsg(vm) {
    window.parent.RL_Media.onCallMsgListener(function (msg) {
      return sdkCallbacks.onCallMsgCallback(vm, msg);
    });
  },
  onLineStateNotifyListener: function onLineStateNotifyListener(vm) {
    window.parent.RL_Chat.OnLineStateNotifyListener(function (notice) {
      return sdkCallbacks.onLineStateNotifyListenerCallback(vm, notice);
    });
  },
  InviteJoinMeetListener: function InviteJoinMeetListener(vm) {
    window.parent.RL_MEET.InviteJoinMeetListener(function (notice) {
      return sdkCallbacks.InviteJoinMeetListenerCallback(vm, notice);
    });
  },
  MeetingListener: function MeetingListener(vm) {
    window.parent.RL_MEET.MeetingListener(function (notice) {
      return sdkCallbacks.MeetingListenerCallback(vm, notice);
    });
  },
  onConferenceNotifyLinstener: function onConferenceNotifyLinstener(vm) {
    window.parent.RL_Media.onConferenceNotifyLinstener(function (notice) {
      return sdkCallbacks.onConferenceNotifyLinstenerCallback(vm, notice);
    });
  }
};

/* harmony default export */ var listeners = (IM_Sdk_Listeners);
// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__("Gu7T");
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/components/model/addPerson.vue

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var addPerson = ({
    name: 'addPerson',
    props: {
        closeAddModal: Function,
        selected: Array,
        len: Number,
        disabled: Boolean,
        callback: Function
    },
    data: function data() {

        return {
            person: {
                account: ''
            },
            personList: [],
            personRules: {
                account: [{
                    required: true,
                    message: "请输入账号",
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 20,
                    message: '请输入6-20个字符的账号',
                    trigger: 'blur'
                }]
            }
        };
    },

    methods: {
        addPerson: function addPerson() {
            var _this = this;

            if (this.personList.length == this.len) {
                this.$message.warning('添加人数超过最大限制^_^');
                return false;
            }
            this.$refs["personRef"].validate(function (valid) {
                if (valid) {
                    var account = _this.person.account;

                    var index = _this.personList.filter(function (item) {
                        return item.account === account;
                    });
                    if (index.length > 0) {
                        _this.$message.warning('当前账号已添加^_^');
                        return false;
                    }
                    _this.personList.push({ account: account, username: account });
                    _this.person.account = "";
                }
            });
        },
        deletePer: function deletePer(account) {
            var _this2 = this;

            this.personList.forEach(function (item, index) {
                if (item.account == account) {
                    _this2.personList.splice(index, 1);
                }
            });
        }
    },
    mounted: function mounted() {
        var _this3 = this;

        this.selected.forEach(function (item) {
            item.disabled = _this3.disabled;
        });
        this.personList = [].concat(toConsumableArray_default()(this.personList), toConsumableArray_default()(this.selected));
    }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-01126423","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/components/model/addPerson.vue
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"addPerson"},[_c('p',{staticClass:"title"},[_vm._v("添加人员\n        "),_c('span',{staticClass:"iconfont icon-popup_closex1 closeModal",on:{"click":function($event){$event.stopPropagation();return _vm.closeAddModal(false)}}})]),_vm._v(" "),_c('div',{staticClass:"container"},[_c('el-form',{ref:"personRef",attrs:{"model":_vm.person,"rules":_vm.personRules}},[_c('el-form-item',{attrs:{"prop":"account"}},[_c('el-input',{staticClass:"input-with-select",attrs:{"disabled":_vm.personList.length == _vm.len,"placeholder":"请输入被邀请者账号"},model:{value:(_vm.person.account),callback:function ($$v) {_vm.$set(_vm.person, "account", (typeof $$v === 'string'? $$v.trim(): $$v))},expression:"person.account"}},[_c('el-button',{staticClass:"rx_btn",attrs:{"slot":"append"},on:{"click":function($event){$event.stopPropagation();return _vm.addPerson($event)}},slot:"append"},[_vm._v("添加")])],1)],1)],1),_vm._v(" "),_c('ul',{staticClass:"list"},[_vm._l((_vm.personList),function(item){return [_c('li',{key:item.account},[_vm._v("\n                    "+_vm._s(item.account)+"\n                    "),(!item.disabled)?_c('span',{staticClass:"delete",on:{"click":function($event){$event.stopPropagation();return _vm.deletePer(item.account)}}},[_vm._v("x")]):_vm._e()])]})],2),_vm._v(" "),_c('div',{staticClass:"btn-group"},[_c('span',{staticClass:"rx_cancel cancel",on:{"click":function($event){$event.stopPropagation();return _vm.closeAddModal(false)}}},[_vm._v(_vm._s(_vm.$t('btn.cancel')))]),_vm._v(" "),_c('span',{staticClass:"rx_btn confirm",on:{"click":function($event){$event.stopPropagation();return _vm.callback(_vm.personList)}}},[_vm._v(_vm._s(_vm.$t('btn.determine')))])])],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ var model_addPerson = (esExports);
// CONCATENATED MODULE: ./src/components/model/addPerson.vue
function injectStyle (ssrContext) {
  __webpack_require__("Ec0G")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-01126423"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  addPerson,
  model_addPerson,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ var components_model_addPerson = (Component.exports);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/components/meeting/inviteModel.vue
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var inviteModel = ({
  name: "inviteModel",
  data: function data() {
    return {
      hangOnText: this.$t('last.accept'),
      hasMeeting: false
    };
  },

  props: {
    inviteMsg: Object
  },
  methods: {
    hangOn: function hangOn() {
      var _this = this;
      //先挂断，再接听
      _this.$bus.emit('leaveAllMeet', true); //挂断会议
      setTimeout(function () {
        _this.$router.push({
          path: '/yuntongxun/meeting',
          query: { confId: _this.inviteMsg.msgContent.confId }
        });
        _this.$bus.emit('inviteModelBool', false);
      }, 500);
    },
    meetInviteHangup: function meetInviteHangup() {
      this.rejectInvitation(this.inviteMsg.msgContent.confId, function (res) {}, function (err) {});
      this.$bus.emit('inviteModelBool', false);
    },

    // 拒绝邀请
    rejectInvitation: function rejectInvitation(confId, succFunc, errFunc) {
      var rejectInvitationBuilder = new RL_MEET.RejectInvitationBuilder();
      rejectInvitationBuilder.setConfId(confId);
      rejectInvitationBuilder.setCause("107603");
      RL_MEET.RejectInvitation(rejectInvitationBuilder, function (res) {
        console.info(res, "拒绝邀请成功");
        succFunc && succFunc(res);
      }, function (err) {
        console.log(err, "拒绝邀请失败");
        errFunc && errFunc(err);
      });
    }
  }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-1d23129c","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/components/meeting/inviteModel.vue
var inviteModel_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container"},[_c('div',{staticClass:"main"},[_c('p',{staticClass:"title"},[_c('span',{staticClass:"time"},[_vm._v(_vm._s(_vm.inviteMsg.msgContent&& _vm.inviteMsg.msgContent.inviterName)+_vm._s(_vm.$t('last.meetInvite'))+_vm._s(_vm.inviteMsg.msgContent&& _vm.inviteMsg.msgContent.confName))]),_vm._v(" "),_c('span',{staticClass:"btn"},[_c('i',{on:{"click":_vm.meetInviteHangup}},[_vm._v("×")])])]),_vm._v(" "),_c('div',{staticClass:"btnGroup"},[_c('span',{staticClass:"rx_cancel cancel",on:{"click":_vm.meetInviteHangup}},[_vm._v(_vm._s(_vm.$t('btn.refuse')))]),_vm._v(" "),_c('span',{staticClass:"rx_btn confirm",on:{"click":_vm.hangOn}},[_vm._v(_vm._s(_vm.hangOnText))])])])])}
var inviteModel_staticRenderFns = []
var inviteModel_esExports = { render: inviteModel_render, staticRenderFns: inviteModel_staticRenderFns }
/* harmony default export */ var meeting_inviteModel = (inviteModel_esExports);
// CONCATENATED MODULE: ./src/components/meeting/inviteModel.vue
function inviteModel_injectStyle (ssrContext) {
  __webpack_require__("EV7L")
}
var inviteModel_normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var inviteModel___vue_template_functional__ = false
/* styles */
var inviteModel___vue_styles__ = inviteModel_injectStyle
/* scopeId */
var inviteModel___vue_scopeId__ = "data-v-1d23129c"
/* moduleIdentifier (server only) */
var inviteModel___vue_module_identifier__ = null
var inviteModel_Component = inviteModel_normalizeComponent(
  inviteModel,
  meeting_inviteModel,
  inviteModel___vue_template_functional__,
  inviteModel___vue_styles__,
  inviteModel___vue_scopeId__,
  inviteModel___vue_module_identifier__
)

/* harmony default export */ var components_meeting_inviteModel = (inviteModel_Component.exports);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/components/yuntongxun/yuntongxun.vue


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ var yuntongxun = ({
  name: 'yuntongxun',
  data: function data() {
    return {
      toggleFlag: true,
      addPersonFlag: false,
      selected: [],
      len: 0,
      disabled: false,
      v3InviteModel: false,
      inviteMsg: {},
      parentModel: null
    };
  },

  components: {
    addPerson: components_model_addPerson,
    inviteModel: components_meeting_inviteModel
  },
  computed: extends_default()({}, Object(vuex_esm["d" /* mapState */])(['LoginServe']), Object(vuex_esm["b" /* mapGetters */])(['user_account'])),
  created: function created() {
    var self = this;
    var account = self.user_account;
    if (!account) {
      var LoginServe = window.sessionStorage.getItem('LoginServe');
      if (!!LoginServe) {
        LoginServe = LoginServe && typeof LoginServe === 'string' ? JSON.parse(LoginServe) : LoginServe;
        self.SetLoginServe(LoginServe);
        account = LoginServe.UserId;
      } else {
        self.$router.replace('/');
      }
    }
    // if (account) {
    //   self.sdkInit((obj) => {
    //     console.log('初始化sdk及sdk登录', obj)
    //     self.SET_USERACCOUNT(account)
    //     // 用户状态监听
    //     IM_Sdk_Listeners.onConnectStateChange(self)
    //     // 接收消息监听
    //     IM_Sdk_Listeners.onMsgReceive(self)
    //     if (self.$route.query && self.$route.query.confId) {
    //       self.$bus.emit('initMeeting')
    //     } else {
    //       self.$bus.emit('updateMeetingList')
    //     }
    //   })
    // }
    if (self.LoginServe.Profile.init) {
      this.setIMNickname({ userName: '一个姓名' });
      // 初始化聊天会话sdk
      self.SET_USERACCOUNT(account);
      // 用户状态监听
      listeners.onConnectStateChange(self);
      // 接收消息监听
      listeners.onMsgReceive(self);
      if (self.$route.query && self.$route.query.confId) {
        self.$bus.emit('initMeeting');
      } else {
        self.$bus.emit('updateMeetingList');
      }
      // v3初始化
      RL_MEET.init(window.AppId, this.LoginServe.Profile.NickName);
    }
    self.setFontSize(100);
  },

  methods: extends_default()({}, Object(vuex_esm["c" /* mapMutations */])(['SetLoginServe', 'SET_USERACCOUNT']), {
    switchAccount: function switchAccount() {
      var _this2 = this;

      RL_YTX_NEW.logout(function (_) {
        sessionStorage.setItem('LoginServe', '');
        _this2.$router.replace('/');
      }, function (err) {
        _this2.$message.error(_this.$t('modelMessage.exitFailedCode') + err.code);
      });
    },
    handleMsg: function handleMsg(data) {
      console.log('handleMsg================================', data);
      var _this = this;
      if (data.msgType == 50) {
        data.msgContent = _this.RX_Util.analyticBuilderDomain(data.msgContent);
        console.log('会议通知=============', data);
        if (data.msgContent.confId && this.$route.query && this.$route.query.confId) {
          //  判断是否是当前会议的通知
          var obj = extends_default()({}, data, {
            msgContent: stringify_default()(data.msgContent)
          });
          _this.$bus.emit('transferListenerData', 'MeetNotice_IM', obj);
          return;
        }
        if (data.msgContent.noteType == 6) {
          _this.getMeetInfo(data, function (defaultRes) {
            var indexMember = defaultRes.members.filter(function (item) {
              return item.memberId == _this.user_account;
            });
            if (indexMember.length > 0) {
              // 判断是否正在呼叫中
              if (indexMember[0].state & 0x000400) {
                _this.$bus.emit('inviteModelBool', true, data);
              }
            }
          });
        } else if (data.msgContent.noteType == 7) {
          if (data.msgContent.action == 56 && data.msgContent.invitee == _this.user_account) {
            if (data.msgContent.members.length && data.msgContent.members[0].deviceType !== '21') {
              //会议被其他端拒绝
              _this.$message.info(_this.$t('last.callOtherCancel'));
            }
            _this.$bus.emit('inviteModelBool', false);
          } else if (data.msgContent.action == 153 && data.msgContent.invitee == _this.user_account) {
            _this.$message.info(_this.$t('last.inviteTimeout'));
            _this.$bus.emit('inviteModelBool', false);
          }
        }
      }
    },
    getMeetInfo: function getMeetInfo(data, defaultMeetingCallback) {
      var _this = this;
      var GetMeetInfoBuilder = new RL_MEET.GetMeetInfoBuilder();
      GetMeetInfoBuilder.setConfId(data.msgContent.confId);
      RL_MEET.GetMeetInfo(GetMeetInfoBuilder, function (resp) {
        console.log('会议信息', resp);
        resp = JSON.parse(resp.result);
        if (resp.statusCode == '000000') {
          defaultMeetingCallback && defaultMeetingCallback(resp);
        } else {
          _this.$message({
            message: '获取会议信息失败',
            type: 'warning'
          });
        }
      }, function (err) {
        _this.$message({
          message: err,
          type: 'warning'
        });
      });
    },
    sdkInit: function sdkInit(cb) {
      var _this = this;
      var account = this.LoginServe.UserId;
      var resp = RL_YTX_NEW.init({
        appId: window.AppId,
        serverIp: window._ws,
        isV3: true
      });
      if (resp.code != 200) {
        alert('SDK初始化错误');
        return;
      } else if (174001 == resp.code) {
        alert('您的浏览器暂不支持,推荐使用谷歌浏览器^.^');
        return;
      } else if (174002 == resp.code) {
        alert('您和服务器断开连接x_x');
        return;
      }
      if ($.inArray(174004, resp.unsupport) > -1 || $.inArray(174009, resp.usupport) > -1) {
        alert('调用设备失败或浏览器不支持BLOB到URL转换');
      } else if ($.inArray(174007, resp.unsupport) > -1) {
        alert('浏览器不支持发送附件');
      } else if ($.inArray(174008, resp.unsupport) > -1) {
        alert('浏览器不支持音视频操作');
      }
      console.log('初始化OK~');
      var timestamp = util["a" /* default */].generateTimeNumber();
      var sig = hex_md5(window.AppId + account + timestamp + window.AppToken);
      var sdkLoginParam = {
        userName: account,
        type: 1,
        sig: sig,
        timestamp: timestamp,
        compId: 1
      };
      _this.sdkLogin(sdkLoginParam, cb);
    },
    sdkLogin: function sdkLogin(param, cb) {
      var _this3 = this;

      // 初始化聊天会话sdk
      console.log('1.RL_YTX_NEW chatInit...');
      RL_YTX_NEW.chatInit({
        fileServerIp: window.fileServerIp,
        lvsServer: window.lvsServer
      });
      console.log('2.RL_YTX_NEW setConfig...');
      console.log('3.RL_YTX_NEW login...');
      RL_YTX_NEW.login(param, function (obj) {
        console.log('RL_YTX_NEW login:', obj);
        RL_Chat = window.RL_Chat;
        _this3.setIMNickname(param);
        cb && cb(obj);
      }, function (err) {
        console.error('im登录失败。错误码:' + (err.msg || err.code));
      });
      // v3初始化
      RL_MEET.init(window.AppId, this.LoginServe.Profile.NickName);
    },
    setIMNickname: function setIMNickname(userInfo) {
      RL_Chat.uploadPersonInfo({
        nickName: userInfo.userName
      }, function (obj) {
        //设置成功
        console.log('聊天用户设置成功', obj);
      }, function (err) {
        console.log(err);
      });
    },
    toggleHeader: function toggleHeader(bool) {
      this.toggleFlag = bool;
    },
    addModelFlag: function addModelFlag(bool, len, data, callback, disabled) {
      console.log('addModelFlag', data);
      this.addPersonFlag = bool;
      this.selected = data;
      this.len = len;
      this.disabled = disabled;
      this.callback = callback;
    },
    inviteModelBool: function inviteModelBool(bool, data) {
      this.v3InviteModel = bool;
      this.inviteMsg = data;
    }
  }),
  mounted: function mounted() {
    this.RX_Util.registerBusEvents({
      toggleHeader: this.toggleHeader,
      addPerson: this.addModelFlag,
      inviteModelBool: this.inviteModelBool,
      handleMsg: this.handleMsg
    }, this);
  },
  updated: function updated() {
    var that = this;
    var parentModel = this.$root.parentModel;
    console.log('*************************', that.v3InviteModel, parentModel, that.inviteMsg);
    if (that.v3InviteModel && parentModel) {
      var msgContent = that.inviteMsg.msgContent;
      if (msgContent) {
        parentModel.source.postMessage({
          type: 'meet',
          des: msgContent.inviterName + '邀请您参加' + msgContent.confName
        }, parentModel.origin);
      }
    }
  }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-58ce77f9","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/components/yuntongxun/yuntongxun.vue
var yuntongxun_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"bg"},[_c('div',{staticClass:"con"},[(_vm.toggleFlag)?_c('div',{staticClass:"selfInfo"},[_c('dl',[_c('dt',{staticClass:"headimg"},[_c('span',{staticClass:"img",style:({ backgroundImage: _vm.getcolor(_vm.LoginServe.UserId) })},[_vm._v(_vm._s(_vm.LoginServe.Profile.NickName))])]),_vm._v(" "),_c('dd',{staticClass:"userName"},[_vm._v(_vm._s(_vm.LoginServe.Profile.NickName))])]),_vm._v(" "),_c('div',{staticClass:"confirmBtn",on:{"click":function($event){$event.stopPropagation();return _vm.switchAccount($event)}}},[_vm._v("退出登录")])]):_vm._e(),_vm._v(" "),_c('keep-alive',[_c('router-view',{ref:"headerChild"})],1)],1),_vm._v(" "),(_vm.addPersonFlag)?_c('div',{staticClass:"shadow"},[_c('add-person',{attrs:{"len":_vm.len,"closeAddModal":_vm.addModelFlag,"selected":_vm.selected,"callback":_vm.callback,"disabled":_vm.disabled}})],1):_vm._e(),_vm._v(" "),(_vm.v3InviteModel)?_c('div',{staticClass:"shadow v3InviteModel"},[_c('invite-model',{attrs:{"inviteMsg":_vm.inviteMsg}})],1):_vm._e()])}
var yuntongxun_staticRenderFns = []
var yuntongxun_esExports = { render: yuntongxun_render, staticRenderFns: yuntongxun_staticRenderFns }
/* harmony default export */ var yuntongxun_yuntongxun = (yuntongxun_esExports);
// CONCATENATED MODULE: ./src/components/yuntongxun/yuntongxun.vue
function yuntongxun_injectStyle (ssrContext) {
  __webpack_require__("ItLW")
}
var yuntongxun_normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var yuntongxun___vue_template_functional__ = false
/* styles */
var yuntongxun___vue_styles__ = yuntongxun_injectStyle
/* scopeId */
var yuntongxun___vue_scopeId__ = "data-v-58ce77f9"
/* moduleIdentifier (server only) */
var yuntongxun___vue_module_identifier__ = null
var yuntongxun_Component = yuntongxun_normalizeComponent(
  yuntongxun,
  yuntongxun_yuntongxun,
  yuntongxun___vue_template_functional__,
  yuntongxun___vue_styles__,
  yuntongxun___vue_scopeId__,
  yuntongxun___vue_module_identifier__
)

/* harmony default export */ var components_yuntongxun_yuntongxun = __webpack_exports__["default"] = (yuntongxun_Component.exports);


/***/ })

});
//# sourceMappingURL=3.facc9ca597681ba51c79.js.map