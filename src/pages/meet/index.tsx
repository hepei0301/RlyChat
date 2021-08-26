import React, { ReactNode, useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
import ResizeMoveDialog from '@/components/ResizeMoveDialog';
import { useScript } from '../../utils/useScript';
import './index.less';
export interface RlyPropos {
  bounds?: string;
  contactsList?: [any];
  userInfo?: { userId: string; userName: string };
  size?: { width: number; height: number };
  limitSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export default function Meet({ bounds, size, maxSize, limitSize }: RlyPropos) {
  const [toggle, setToggle] = useState(false);
  const [init, setInit] = useState(false);

  const close = () => {
    setToggle(false);
  };

  const open = () => {
    setToggle(true);
  };

  useEffect(() => {
    const handle = (res: any) => {
      const data = (res && res.data) || { type: '', name: '' };
      if (toggle) return;
      notification.destroy();
      notification.info({
        message: data.des,
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
    useScript().then((res) => {
      setInit(res);
    });
  }, []);

  return !init ? null : (
    <>
      <Button style={{ position: 'absolute', top: 50, left: 20 }} onClick={open}>
        答案开meet
      </Button>
      <ResizeMoveDialog
        limitSize={limitSize || { width: 400, height: 200 }}
        size={size || { width: 1100, height: 780 }}
        close={close}
        bounds={bounds || 'body'}
        toggle={toggle}>
        <Iframe
          url="meet/index.html"
          width={'100%'}
          height={'100%'}
          allow="geolocation;microphone;camera;midi;encrypted-media"
          id="RlyChat-Meet"
          onLoad={() => {
            (window as any).ChatLogin.init(() => {
              const contentWindow = (document.getElementById('RlyChat-Meet') as any).contentWindow;
              contentWindow.postMessage({ userId: '15071046271', userName: '一个测试的姓' });
            });
          }}
        />
      </ResizeMoveDialog>
    </>
  );
}
