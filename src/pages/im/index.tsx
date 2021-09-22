import React, { useRef, useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
import ResizeMoveDialog from '../../components/ResizeMoveDialog';
import { EventOpenIm, ImProps } from '../../event';
import '../../utils/base64.min.js';
import '../../utils/MD5.min.js';
import '../../utils/jquery-3.1.0.min.js';
import '../../utils/ytx-web-im7.2.2.5.js';
import '../../utils/ytx-web-av3.js';
import '../../utils/adapter.js';
import '../../utils/config.js';
import '../../utils/RL_Meet.js';
import '../../utils/chatLogin.js';
export interface RlyPropos {
  bounds?: string;
  contactsList?: any;
  size?: { width: number; height: number };
  limitSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  userInfo?: { userId: string; userName: string };
}
const info = {
  message: '信息',
  audio: '语音通话',
  video: '视频通话',
};

export default function IM({ bounds, size, maxSize, limitSize, userInfo }: RlyPropos) {
  const [toggle, setToggle] = useState(false);
  const [init, setInit] = useState(true);

  const close = () => {
    setToggle(false);
  };

  const open = () => {
    setToggle(true);
  };

  useEffect(() => {
    const handle = (res: any) => {
      const data = (res && res.data) || { type: '', name: '' };
      if (toggle || data.type === 'meet') return;
      notification.destroy();
      notification.info({
        message: `${data.name}发送${info[data.type]}过来`,
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
    window.addEventListener('message', handle);

    return () => window.removeEventListener('message', handle);
  }, [toggle]);

  useEffect(() => {
    return EventOpenIm.on((res: ImProps) => {
      console.log(333, res);
      (document.getElementById('RlyChat-Im') as any).contentWindow.postMessage({ ...res });
      open();
    });
  }, [toggle]);

  return !init ? null : (
    <ResizeMoveDialog
      limitSize={limitSize || { width: 300, height: 300 }}
      maxSize={maxSize || { width: 900, height: 600 }}
      size={size || { width: 900, height: 600 }}
      close={close}
      bounds={bounds || 'body'}
      toggle={toggle}>
      <Iframe
        url={'im/index.html'}
        width={'100%'}
        height={'100%'}
        allow="geolocation;microphone;camera;midi;encrypted-media"
        id="RlyChat-Im"
        onLoad={() => {
          (window as any).ChatLogin.init(() => {
            const contentWindow = (document.getElementById('RlyChat-Im') as any).contentWindow;
            contentWindow.IM.loginCallBack(userInfo?.userId, userInfo?.userName, [
              { id: 15071046271, name: '我是一个名字' },
              { id: 'aa11', name: 'hepeu' },
              { id: 'bb11', name: '何佩' },
            ]);
          });
        }}
      />
    </ResizeMoveDialog>
  );
}

export const openIM = (res: ImProps) => {
  EventOpenIm.emit(res);
};
