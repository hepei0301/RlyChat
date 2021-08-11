import React, { ReactNode, useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
import ResizeMoveDialog from '@/components/ResizeMoveDialog';
import './index.less';

let fix = false;

interface BoundsPropos {
  bounds?: string;
  contactsList?: [any];
  userInfo: { userId: string | number; userName: string };
}

export default function IM({ bounds }: BoundsPropos) {
  const [position, setPosition] = useState({ x: -10000, y: -10000 });
  const [size, setSize] = useState({ width: 900, height: 600 });
  const [move, setMove] = useState(false);

  fix = !(position.x === -10000 && position.y === -10000);

  const message = JSON.parse(
    JSON.stringify({
      userId: '15071046271',
      userName: '一个测试的姓2名',
      type: 'login',
    })
  );

  const close = () => {
    setPosition({ x: -10000, y: -10000 });
    setSize({ width: 900, height: 600 });
  };

  const open = () => {
    setPosition({
      x: Math.ceil((document.documentElement.clientWidth - 900) / 2),
      y: Math.ceil((document.documentElement.clientHeight - 600) / 2),
    });
    setSize({ width: 900, height: 600 });
  };

  useEffect(() => {
    // return EventSendMessage.on((res) => {
    //   if (position.x < 0 && position.y < 0) {
    //     open();
    //   }
    //   document.getElementById('chat').contentWindow.postMessage({ ...res });
    // });
  }, [position, size]);

  useEffect(() => {
    window.addEventListener('message', (res) => {
      const data = (res && res.data) || { type: '', name: '' };
      const noti = (des) => {
        if (fix) return;
        notification.destroy();
        notification.info({
          message: des,
          placement: 'bottomRight',
          bottom: 0,
          duration: 30,
          btn: (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                open();
                notification.destroy();
              }}>
              打开对话框
            </Button>
          ),
        });
      };

      switch (data.type) {
        case 'audio':
          noti(`${data.name}发送语音通话过来`);
          break;
        case 'message':
          noti(`${data.name}发送信息过来`);
          break;
        case 'video':
          noti(`${data.name}发送视频通话过来`);
          break;
        case 'group':
          noti(`${data.name}发送消息过来`);
          break;
        case 'cancel':
          notification.destroy();
          break;
      }
    });
  }, []);

  return (
    <ResizeMoveDialog
      position={{ x: 200, y: 10 }}
      limitSize={{ width: 400, height: 300 }}
      maxSize={{ width: 900, height: 600 }}
      size={{ width: 900, height: 600 }}
      bounds={bounds}>
      <Iframe
        url="im/index.html"
        width={'100%'}
        height={'100%'}
        allow="geolocation;microphone;camera;midi;encrypted-media"
        id="RlyChat-Im"
        onLoad={() => {
          (window as any).ChatLogin.init(() => {
            const obj = message;
            const contentWindow = (document.getElementById('RlyChat-Im') as any).contentWindow;
            console.log(222, contentWindow)
            if (contentWindow) {
                console.log('一个测试的内容', contentWindow)
              contentWindow.IM.loginCallBack(obj.userId, obj.userName);
              contentWindow.postMessage({ userId: '15071046271', userName: '一个测试的姓2名', type: 'login' });
            }
          });
        }}
      />
    </ResizeMoveDialog>
  );
}
