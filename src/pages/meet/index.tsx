import React, { useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
// eslint-disable-next-line import/no-unresolved
import ResizeMoveDialog from '../../components/ResizeMoveDialog';
import { EventOpenMeet, MeetProps, EventCloseMeet } from '../../event';
import '../../utils/chatLogin.js';
import './index.less';

export interface RlyPropos {
  bounds?: string;
  contactsList?: [any];
  userInfo?: { userId: string; userName: string };
  size?: { width: number; height: number };
  limitSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  id: string;
}

function Meet({ bounds, size, maxSize, limitSize, userInfo }: RlyPropos) {
  const [toggle, setToggle] = useState(false);
  const [showCloseIcon, setShowCloseIcon] = useState(true);

  const close = () => {
    setToggle(false);
  };

  const open = () => {
    setToggle(true);
  };

  useEffect(
    () => {
      const handle = (res: any) => {
        const data = (res && res.data) || { type: '', des: '' };
        if (data.type === 'meeting') {
          setShowCloseIcon(data.value);
        }
        if (toggle || data.type !== 'meet') return;
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
              }}
            >
              打开对话框
            </Button>
          )
        });
      };
      window.addEventListener('message', handle);

      return () => window.removeEventListener('message', handle);
    },
    [toggle]
  );

  useEffect(() => {
    EventOpenMeet.on((res: MeetProps) => {
        (document.getElementById('RlyChat-Meet') as any).contentWindow.postMessage({ ...res });
        open();
    });
    EventCloseMeet.on(() => {
        close();
    });
  }, []);

  return (
    <ResizeMoveDialog
      limitSize={limitSize || { width: 400, height: 200 }}
      size={size || { width: 1150, height: 780 }}
      close={close}
      bounds={bounds || 'body'}
      toggle={toggle}
      id="RLY-MEET"
      showCloseIcon={showCloseIcon}
    >
      <Iframe
        url="meet/index.html"
        width="100%"
        height="100%"
        allow="geolocation;microphone;camera;midi;encrypted-media"
        id="RlyChat-Meet"
        onLoad={() => {
          (window as any).ChatLogin.init(() => {
            const contentWindow = (document.getElementById('RlyChat-Meet') as any).contentWindow;
            contentWindow.postMessage(userInfo);
          });
        }}
      />
    </ResizeMoveDialog>
  );
}

export default React.memo(Meet);

export const openMeet = (res: MeetProps) => {
  EventOpenMeet.emit(res);
};

export const closeMeet = () => {
    EventCloseMeet.emit();
};

