import React, { useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
import { Rnd } from 'react-rnd';
import './index.less';

let fix = false;

export default function Meet() {
  const [position, setPosition] = useState({ x: -10000, y: -10000 });
  const [size, setSize] = useState({ width: 1000, height: 780 });
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
    setSize({ width: 1000, height: 780 });
  };

  const open = () => {
    setPosition({
      x: Math.ceil((document.documentElement.clientWidth - 1000) / 2),
      y: Math.ceil((document.documentElement.clientHeight - 780) / 2),
    });
    setSize({ width: 1000, height: 780 });
  };

  useEffect(() => {}, [position, size]);

  useEffect(() => {
    window.addEventListener('message', (res) => {
      const data = (res && res.data) || { type: '', des: '' };
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
        case 'meet':
          noti(`${data.des}`);
          break;
      }
    });
  }, []);

  return (
    <Rnd
      className="MeetMDialog"
      minWidth={400}
      minHeight={200}
      bounds={'.cesium-widget'}
      dragHandleClassName={'Meetbounds'}
      size={size}
      position={position}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({ width: ref.style.width, height: ref.style.height });
      }}
      onDragStart={() => {
        setMove(true);
      }}
      onDragStop={(e, d) => {
        setMove(false);
        setPosition({ x: d.x, y: d.y });
      }}>
      <div className="Meetevent" style={{ pointerEvents: !move ? 'none' : 'auto' }} />
      <div className="Meetbounds" />
      <img src={close_press} className="close" onClick={close} />
      <Iframe
        src="meet/index.html"
        width={'100%'}
        height={'100%'}
        allow="geolocation;microphone;camera;midi;encrypted-media"
        id="meetIframe"
        onLoad={() => {}}
      />
    </Rnd>
  );
}
