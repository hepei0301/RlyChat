function MediaMeet() {
  this.status = 0;
  //  this._appid = "ff8080815dbc080c015dbc0f88dd0001";
  // this._appToken = '0c7f757cc763462ba99f3bf2b9aae6f0';
  this._appid = "ff8080815dbc080c015dbc9d7cd40003"; //公司的账号  17环境
  this._appToken = "7f4fa6d320ab49739183af1d498adb6b"; //公司的秘钥
  this.g_confId = "";
  this.login_type = 1;
  this.user_account = null;
  this.callId = null;
  this.called = null;
  this.caller = null;
  //lll
  this.flag = false;
  this.YHuserId = null;
  this.YHappId = null;
  this.YHconfId = null;
  this.serverIp = null;
  this.lvsServer = null;
  this.fileSig = null;
  this.meetingServer = null;
  this.ClientSecretKey = null;
  this.invitedAttendees = []; //全局受邀参会
  this.meetingInvitedAttendees = []; //全局新增参会
  //111
}

MediaMeet.prototype = {
  //lll 预约会议需要的默认时间
  getFormatDate: function(now) {
    now = now || new Date();
    nowDate = now.getTime() + 1000 * 60 * 15; //预约会议推迟15分钟
    nowDate = new Date(nowDate);
    var year = nowDate.getFullYear();
    var month =
      nowDate.getMonth() + 1 < 10
        ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
    var date =
      nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour =
      nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute =
      nowDate.getMinutes() < 10
        ? "0" + nowDate.getMinutes()
        : nowDate.getMinutes();
    var seconds =
      nowDate.getSeconds() < 10
        ? "0" + nowDate.getSeconds()
        : nowDate.getSeconds();
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      seconds
    );
  },
  //创建会议
  createMeet: function(data, immediately) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath("/REST/Conference/Create?source=SDK");
    conferenceMsgBuilder.setContent({
      mediaType: 1,
      confName: data.confName,
      reserveEnable: data.reserveEnable
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        daa = JSON.parse(e.result);
        console.log(daa, "创建会议信息");
        console.log(globalRouting);
        globalRouting.$router.push({
          path: "/startMeeting",
          query: {
            immediately: immediately,
            dataObj: daa
          }
        });
        //创建会议给个标志
        var confId = daa.confId;
        sessionStorage.setItem("meetingID", confId);
      },
      function(err) {
        alert("error");
        console.log(err);
      }
    );
  },
  //SDK登录
  Login: function(value, callback) {
    this.getSig(value, "", callback);
  },
  getTimeStamp: function() {
    let now = new Date();
    return (
      now.getFullYear() +
      "" +
      (now.getMonth() + 1 >= 10
        ? "" + (now.getMonth() + 1)
        : "0" + (now.getMonth() + 1)) +
      (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) +
      (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) +
      (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) +
      (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds())
    );
  },
  getSig: function(account_number, pwd, callback) {
    var pass = pwd ? pwd : "";
    var timestamp = this.getTimeStamp();
    if (this.flag) {
      this.privateLogin(
        account_number,
        timestamp,
        function(obj) {
          this.EV_login(account_number, pass, obj.sig, timestamp, callback);
        },
        function(obj) {
          console.log("错误码：" + obj.code + "; 错误描述：" + obj.msg);
        }
      );
    } else {
      //仅用于本地测试，官方不推荐这种方式应用在生产环境
      //没有服务器获取sig值时，可以使用如下代码获取sig
      var sig = hex_md5(
        this._appid + account_number + timestamp + this._appToken
      );
      console.log("本地计算sig：" + sig);
      this.EV_login(account_number, pass, sig, timestamp, callback);
    }
  },
  EV_login: function(user_account, pwd, sig, timestamp, callback) {
    console.log("EV_login");
    var loginBuilder = new RL_YTX.LoginBuilder();
    loginBuilder.setType(this.login_type);
    loginBuilder.setUserName(user_account);
    if (1 == this.login_type) {
      //1是自定义账号，2是voip账号
      loginBuilder.setSig(sig);
    } else {
      loginBuilder.setPwd(pwd);
    }
    loginBuilder.setTimestamp(timestamp);
    RL_YTX.login(
      loginBuilder,
      function(obj) {
        Meet.user_account = user_account;
        Meet.is_online = true;
        console.log("EV_login succ...");

        // var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
        // conferenceMsgBuilder.setPath("/REST/Conference/AppSetting/Get?source=SDK");
        // conferenceMsgBuilder.setContent(
        //   {"appId":RL_MEET.appId,"userId":RL_MEET.userId}
        // );
        // RL_YTX.ConferenceMsg(conferenceMsgBuilder,function (e) {
        //   var resp = JSON.parse(e.result);
        //   console.log(resp,"AppSetting resp");
        //   if(resp.statusCode=="000000"){
        //
        //
        //   }
        // },function (err) {
        //   console.log(err)
        // });

        // RL_YTX.onConferenceNotifyLinstener(
        //     // Meet.conferenceNotifyLinstener
        // Meet.conferenceMsgLinstener
        // );
        // 注册群组通知事件监听
        RL_YTX.onNoticeReceiveListener(function(obj) {});
        // 服务器连接状态变更时的监听
        // RL_YTX.onConnectStateChangeLisenter(function(obj) {
        //     // obj.code;//变更状态 1 断开连接 2 重练中 3 重练成功 4 被踢下线 5 断开连接，需重新登录
        //     // 断线需要人工重连
        //     if(1 == obj.code) {
        //         console.log('onConnectStateChangeLisenter obj.code:' + obj.msg);
        //     } else if(2 == obj.code) {
        //         console.log('网络状况不佳，正在试图重连服务器');
        //     } else if(3 == obj.code) {
        //         console.log('连接成功', console.log.TYPE_OK);
        //     } else if(4 == obj.code) {
        //       //被踢  登出
        //         console.log(obj.msg);
        //     } else if(5 == obj.code) {
        //         console.log('网络状况不佳，正在试图重连服务器');
        //         this.getSig(this.user_account);
        //     } else {
        //         console.log('onConnectStateChangeLisenter obj.code:' + obj.msg);
        //     }
        // });
        if (callback) callback();
        //Meet.QueryMeetList();
      },
      function(obj) {
        console.log("错误码： " + obj.code + "; 错误描述：" + obj.msg);
      }
    );
  },
  privateLogin: function(user_account, timestamp, callback, onError) {
    console.log("privateLogin");
    var data = {
      appid: this._appid,
      username: user_account,
      timestamp: timestamp
    };
    var url = this._3rdServer + "genSig";
    $.ajax({
      type: "POST",
      url: url,
      dataType: "jsonp",
      data: data,
      contentType: "application/x-www-form-urlencoded",
      jsonp: "cb",
      success: function(result) {
        if (result.code != "000000") {
          var resp = {};
          resp.code = result.code;
          resp.msg = "Get SIG fail from 3rd server!...";
          onError(resp);
          return;
        } else {
          var resp = {};
          resp.code = result.code;
          resp.sig = result.sig;
          callback(resp);
          return;
        }
      },
      error: function(e) {
        var resp = {};
        console.log(e);
        resp.msg = "Get SIG fail from 3rd server!";
        onError(resp);
      },
      timeout: 5000
    });
  },
  init: function() {},
  //会议提示通知
  conferenceNotifyLinstener: function(msg) {
    console.log(msg, ": conference notice ");
    // if(msg.msgType === 50){
    //     // aa();
    //     var msgContent= JSON.parse(msg.msgContent);
    //     console.log(msgContent,'msgContent');
    //     var creator = msgContent.creator;
    //     if(msgContent.noteType === 6){
    //         if(youconfId!="" && youconfId != msgContent.confId){
    //             alert("您有一个新的会议邀请，但是您当前正在会议中");
    //             return false;
    //         }
    //         Meet.validateConference(msgContent.confId);
    //     }
    // }
  },
  //会议提示通知后操作
  validateConference: function(confId) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath("/REST/Conference/Info?source=SDK");
    conferenceMsgBuilder.setContent({ confId: confId });

    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        console.log(e);
        var result = JSON.parse(e.result);
        var statusCode = result.statusCode;
        if ("000000" == statusCode) {
          tips = result;
          $(".conference-reminding").show();
        }
      },
      function(err) {
        console.log(err);
      }
    );
  },
  //成员操作通知
  conferenceMsgLinstener: function(obj) {
    var resp = JSON.parse(obj["2"]);
    console.log("conferenceMsgLinstener", resp);
    /*console.log(resp,'监听通知')
        listen = resp;
        allMembers = resp.members;
        console.log(allMembersList,'allmemberList');
        console.log("-----------------------conferenceNotify---------------------------");
        console.log(resp);
        console.log(listen,'listen');
        //踢出成员
        if(resp.noteType==4){
            for(var i=0;i<memberJoin.length;i++){
                //循环kickedMembers...
                for(var k=0;k<resp.kickedMembers.length;k++){
                    if(resp.kickedMembers[k].memberId===memberJoin[i].memberId && memberJoin[i].videoSource!=undefined){
                        console.log('谁被踢出了会议')
                        $(".message").append("<li style='list-style: none;background: #ccc'><span>"+memberJoin[i].userName+"</span>被踢出会议</li>");
                        //后面加上释放视频流..
                        $('#'+resp.kickedMembers[k].memberId).parent().remove();
                        Meet.ReleaseMemberSource(resp.kickedMembers[k].memberId);
                        memberJoin.splice(i,1);
                        allMembersList.splice(i,1);
                        setTimeout(function(){
                            $('.message li').remove();
                        },2000);
                    }
                }
            }
        }
        //成员加入(邀请加入以及主动加入)
        if (resp.noteType==2) {
            for(var i=0;i<resp.members.length;i++){
                console.log('成员加入----------------------')
                console.log(resp.members[i],'membersmembers');
                console.log(resp.members[i].inviter,'membersmembers');
                Jion = true;
                allMembersList.push(resp.members[i]);
                if(!resp.members[i].inviter){
                    console.log(memberJoin.length)
                    if(memberJoin.length==0){
                        console.log('是不是进到这个里面了')
                        $(".message").append("<li style='list-style: none;background: #ccc'><span>"+resp.members[i].userName+"</span>加入会议</li>");
                        memberJoin.push(resp.members[i]);
                        setTimeout(function(){
                            $('.message li').remove();
                        },2000);
                    }else {
                        console.log(memberJoin,'看看memeberJoin')
                        for(var k=0;k<memberJoin.length;k++){
                            console.log(resp.members[i].memberId!=memberJoin[k].memberId)
                            console.log(resp.members[i])
                            if(resp.members[i].memberId!=memberJoin[k].memberId && resp.members[i].videoSource!=undefined){
                                console.log(memberJoin[k],'kkkkiokioik')
                                $(".message").append("<li style='list-style: none;background: #ccc'><span>"+resp.members[i].userName+"</span>加入会议</li>");
                                memberJoin.push(resp.members[i]);
                                setTimeout(function(){
                                    $('.message li').remove();
                                },2000);

                                //请求视频流放在infoMemberList里面执行
                                Meet.infoMemberList(youconfId,resp.members[i].memberId);
                            }else {
                                console.log('发生错误!有的位置是空的.')
                            }
                        }
                    }
                }else{
                    //判断状态  确定显示内容(图标)
                    Meet.memberListDisplay(resp.members[i]);
                }
                //请求视频流...应该是在成员确认加入后再请求视频流?
                setTimeout(function(){
                    $('.message li').hide();
                },2000);
            }
        } else if (resp.noteType==3) {//成员离开
            console.log(resp,'ewrqteryertu')
            for(var i=0;i<memberJoin.length;i++){
                if(resp.memberId===memberJoin[i].memberId){
                    Jion = false;
                    $(".message").append("<li style='list-style: none;background: #ccc'><span>"+memberJoin[i].userName+"</span>离开会议</li>");

                    //将离开会议的成员移除参会中的列表
                    memberJoin.splice(i,1);
                    console.log(memberJoin,'看一下新数组')
                    allMembersList.splice(i,1);
                    setTimeout(function(){
                        $('.message li').remove();
                    },2000);
                    //后面加上释放视频流..
                    $('#'+resp.memberId).parent().remove();
                    Meet.ReleaseMemberSource(resp.memberId);
                }
                console.log(memberJoin[i],'membersnoteType=3');
            }
        }else if (resp.noteType==5) {//更新成员信息
            console.log(resp,'noteType===5')
            Meet.memberListDisplay(resp.members);
        }else if (resp.noteType==7) {//更新成员信息
            Jion==true
            if(resp.action===56){//拒绝邀请
                console.log(resp.members,'respresp')
                for(var k=0;k<resp.members.length;k++){
                    for(var i=0;i<allMembersList.length;i++){
                        if(memberUnjoin.length==0){
                            if(allMembersList[i].memberId === resp.members[k].memberId){
                                memberUnjoin.push(allMembersList[i]);
                            }
                        }else {
                            for(var x in memberUnjoin){
                                if(allMembersList[i].memberId === resp.members[k].memberId && memberUnjoin[x].memberId != resp.members[k].memberId){
                                    memberUnjoin.push(allMembersList[i]);
                                }
                            }
                        }
                    }
                }
            }else if (resp.action===57){//接受邀请
                Meet.memberListDisplay(resp.members);
            }
            console.log(resp,'noteType===7')
        }else {
            console.log("will not process for this noteType=" + resp.noteType);
            console.log(resp,'其他的内容')
        }*/
  },
  //成员状态
  memberListDisplay: function(members) {
    console.log(members, "membersaaswdsadasdwe");
    var arr = [members];
    for (var i = 0; i < members.length; i++) {
      //首先判断媒体是否在线->
      console.log(members[i], "members[i].state & UserStateMediaOnline");
      if (
        (members[i].state & UserStateMediaOnline) == UserStateMediaOnline &&
        UserStateAcceptInvite == (members[i].state & UserStateAcceptInvite)
      ) {
        console.log("判断媒体在线");
        if (memberJoin.length < 6) {
          for (var k = 0; k < memberJoin.length; k++) {
            console.log(memberJoin, "xiangkankan");
            console.log(memberJoin[k]);
            if (
              members[i].memberId != memberJoin[k].memberId &&
              members[i].videoSource != memberJoin[k].videoSource &&
              members[i].videoSource != undefined &&
              members[i].userName != undefined
            ) {
              $(".message").append(
                "<li style='list-style: none;background: #ccc'><span>" +
                  members[i].userName +
                  "</span>加入会议</li>"
              );
              memberJoin.push(members[i]);
              window.b = document.createElement("video");
              window.c = document.createElement("li");
              //                            window.b.controls = true;暂时不需要
              window.b.autoplay = true;
              window.b.id = members[i].memberId;
              window.b.style.width = "100%";
              window.b.style.height = "100%";
              window.c.style.width = "315px";
              window.c.style.height = "250px";
              window.c.style.float = "left";
              //                            window.c.style.minWidth = '326px';//测试写成固定值
              window.c.style.display = "inline-block";
              window.c.style.background = "#8187b0";
              window.b.style.objectFit = "fill";
              window.c.appendChild(b);
              $(".startmeeting-wrap").append(c);
              //请求视频流放在infoMemberList里面执行
              Meet.infoMemberList(youconfId, members[i].memberId);
            }
          }
        } else {
          alert("对不起,已经超过邀请成员上限!");
        }
        console.log(
          arr[i].state & UserStateMediaOnline,
          "members[i].state & UserStateMediaOnline"
        );
        if (arr[i].state & (UserStateAllowSpeak == UserStateAllowSpeak)) {
          //成员可讲话将静音标识置为true
          joinMic = true;
          console.log("---------------成员可以讲话-------------");
        } else {
          //成员不可讲话将静音标识置为false
          joinMic = false;
          console.log("---------------成员不可以讲话-------------");
        }
      } else if (
        (members[i].state & UserStateRejectInvite) ==
        UserStateRejectInvite
      ) {
        //是否拒绝邀请
        memberUnjoin.push(members[i]);
        //挂断之后应该有什么操作
      } else if (
        (members[i].state & UserStateBeCalling) ==
        UserStateBeCalling
      ) {
        //正在接通
        //挂断之后应该有什么操作
      } else {
      }
    }
  },
  //加入会议
  JoinMeet: function(confId, userName) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath("/REST/Conference/Member/Join?source=SDK");
    conferenceMsgBuilder.setContent({ confId: confId, userName: userName });
    RL_YTX.ConferenceMsg(conferenceMsgBuilder, function(e) {
      var resp = JSON.parse(e.result);
      if (resp.statusCode == "000000") {
        console.log(resp);
        console.log("用户加入会议成功");
        Meet.starVoice(resp.conf.confId);
      } else {
        alert(resp.statusMsg);
      }
    });
  },
  //媒体相关（静音、视频。。。）
  unMute: function(confId, action) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath(
      "/REST/Conference/Member/MediaControl?source=SDK"
    );
    conferenceMsgBuilder.setContent({
      confId: confId,
      allMember: 1,
      unchangable: 1,
      action: action
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        //创建会议给个标志
        console.log("----------------全体静音--------------------");
        console.log(result);
        if (result.statusCode == "000000") {
          $(".mute").attr("disabled", null);
          $(".mute").addClass("mute1");
          $(".mute").addClass("mute2");
          $(".mute").css("border", "1px solid #405aff");

          $(".un-mute").css("border", "1px solid #aaaaaa");
          $(".un-mute").attr("disabled", "disabled");
          $(".un-mute").removeClass("mute1");
          $(".un-mute").removeClass("mute2");
        }
        console.log("----------------------全体静音--------------");
      },
      function(err) {
        console.log(err);
      }
    );
  },
  //全体静音
  mute: function(confId, action) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath(
      "/REST/Conference/Member/MediaControl?source=SDK"
    );
    conferenceMsgBuilder.setContent({
      confId: confId,
      allMember: 1,
      unchangable: 1,
      action: action
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        //创建会议给个标志
        console.log("----------------全体静音--------------------");
        console.log(result);
        if (result.statusCode == "000000") {
          $(".mute").attr("disabled", "disabled");
          $(".mute").removeClass("mute1");
          $(".mute").removeClass("mute2");
          $(".mute").css("border", "1px solid #aaaaaa");

          $(".un-mute").css("border", "1px solid #405aff");
          $(".un-mute").attr("disabled", null);
          $(".un-mute").addClass("mute1");
          $(".un-mute").addClass("mute2");
        }
        console.log("----------------------全体静音--------------");
      },
      function(err) {
        console.log(err);
      }
    );
  },
  //麦克风静音
  MicMute: function(confId, action) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath(
      "/REST/Conference/Member/MediaControl?source=SDK"
    );
    conferenceMsgBuilder.setContent({
      confId: confId,
      action: action
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        //创建会议给个标志
        console.log("----------------麦克风会中点击事件--------------------");
        console.log(result);
        console.log("----------------------麦克风会中点击事件--------------");
      },
      function(err) {
        console.log(err);
      }
    );
  },
  //摄像头
  CameraMute: function(confId, action) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath(
      "/REST/Conference/Member/MediaControl?source=SDK"
    );
    conferenceMsgBuilder.setContent({
      confId: confId,
      action: action
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        //创建会议给个标志
        console.log("----------------静音会议成员--------------------");
        console.log(result);
        console.log("----------------------静音会议成员--------------");
      },
      function(err) {
        console.log(err);
      }
    );
  },
  //声音
  VoiceMute: function(confId, action) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath(
      "/REST/Conference/Member/MediaControl?source=SDK"
    );
    conferenceMsgBuilder.setContent({
      confId: confId,
      action: action
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        console.log("----------------静音会议成员--------------------");
        console.log(result);
        console.log("----------------------静音会议成员--------------");
      },
      function(err) {
        console.log(err);
      }
    );
  },
  //成员信息更新（改名）
  updateName: function(confId, memberId, memberIdType, username) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath("/REST/Conference/Member/Update?source=SDK");
    conferenceMsgBuilder.setContent({
      confId: confId,
      memberId: memberId,
      idType: memberIdType,
      userName: username
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        console.log("----------------更新会议成员信息--------------------");
        console.log(result, "修改姓名操作");
        console.log("----------------------更新会议成员信息--------------");
        //infoMemberList(confId);
      },
      function(err) {
        alert("error");
        console.log(err);
      }
    );
  },
  //点击移除操作
  deletePerson: function(confId, member) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath("/REST/Conference/Member/Kickout?source=SDK");
    conferenceMsgBuilder.setContent({
      confId: confId,
      kickMembers: member
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        //创建会议给个标志
        console.log("----------------移除会议成员--------------------");
        console.log(result);
        console.log("----------------------移除会议成员--------------");
      },
      function(err) {
        alert("error");
        console.log(err);
      }
    );
  },
  //静音按钮单个
  quiet: function(confId, member) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath(
      "/REST/Conference/Member/MediaControl?source=SDK"
    );
    conferenceMsgBuilder.setContent({
      confId: confId,
      allmember: 0,
      unchanggeable: 0,
      members: member,
      action: 2
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        //创建会议给个标志
        console.log("----------------静音会议成员--------------------");
        console.log(result);
        console.log("----------------------静音会议成员--------------");
      },
      function(err) {
        alert("error");
        console.log(err);
      }
    );
  },
  //关闭视频单个
  closeVideo: function(confId, member) {
    var conferenceMsgBuilder = new RL_YTX.ConferenceMsgBuilder();
    conferenceMsgBuilder.setPath(
      "/REST/Conference/Member/MediaControl?source=SDK"
    );
    conferenceMsgBuilder.setContent({
      confId: tconfId,
      allmember: 0,
      unchanggeable: 0,
      members: member,
      action: action
    });
    RL_YTX.ConferenceMsg(
      conferenceMsgBuilder,
      function(e) {
        var result = JSON.parse(e.result);
        //创建会议给个标志
        console.log("----------------静音会议成员--------------------");
        console.log(result);
        window.clearInterval(timer1);
        console.log("----------------------静音会议成员--------------");
      },
      function(err) {
        alert("error");
        console.log(err);
      }
    );
  },
  //页面跳转至开会页面时，在组件完成之前调用
  jiru: function(routeData) {
    if (
      routeData.immediately == true &&
      routeData.dataObj.statusCode == "000000"
    ) {
      RL_YTX.setMeetingLocalView(null, a);
      let connectMediaBuilder = new RL_YTX.ConnectMediaBuilder();
      connectMediaBuilder.setCallType(1);
      connectMediaBuilder.setCalled(that.meetingID);
      RL_YTX.ConnectMedia(
        connectMediaBuilder,
        function(e) {
          //计入成功
          console.log("计入成功了");
        },
        function(err) {
          console.log(err);
          alert(err); //将错误信息抛出来
        }
      );
      Meet.JoinMeet(confId);
    }
  }
};

var Meet = new MediaMeet();
Meet.init();
