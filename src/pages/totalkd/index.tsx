import React, { useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Rnd } from 'react-rnd';
import audioIcon from './u12842.png';
import ingIcon from './u12846.png';
import { EventToggleTotalkd, EventChannelId } from '../../event';
import './index.less';

export interface TotalkdProps {
  bounds?: string;
  address?: string;
  port?: number;
  channelId?: string | number;
}

export default function Totalkd({ bounds, address = '39.98.70.217', port = 9660, channelId = '1001' }: TotalkdProps) {
  const [toggle, setToggle] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ x: -10000, y: -10000 });
  const [speak, setSpeak] = useState(false);

  const size = {
    width: 320,
    height: 300,
  };

  const open = () => {
    setToggle(true);
  };

  useEffect(() => {
    const iframe: any = document.getElementById('totalkdIframe');
    if (speak) {
      iframe.contentWindow.postMessage(
        {
          type: 'mouseDownPtt',
        },
        '*'
      );
    } else {
      iframe.contentWindow.postMessage(
        {
          type: 'mouseUpPtt',
        },
        '*'
      );
    }
  }, [speak]);

  useEffect(() => {
    if (toggle) {
      setCurrentPosition({
        x: Math.ceil((document.documentElement.clientWidth - _.get(size, 'width', 0)) / 2),
        y: Math.ceil((document.documentElement.clientHeight - _.get(size, 'height', 0)) / 2),
      });
    } else {
      setCurrentPosition({ x: -10000, y: -10000 });
    }
  }, [toggle]);

  useEffect(() => {
    const iframe: any = document.getElementById('totalkdIframe');
    return EventChannelId.on((channelId: string) => {
      iframe.contentWindow.postMessage(
        {
          type: 'clickEnterChannel',
          channelId: channelId,
        },
        '*'
      );
      open();
    });
  }, []);

  useEffect(() => {
    const iframe: any = document.getElementById('totalkdIframe');
    return EventToggleTotalkd.on((res: boolean) => {
      if (res) {
        iframe.contentWindow.postMessage(
          {
            type: 'mouseDownPtt',
          },
          '*'
        );
      } else {
        iframe.contentWindow.postMessage(
          {
            type: 'mouseUpPtt',
          },
          '*'
        );
      }
    });
  }, []);

  const onLoad = () => {
    const iframe: any = document.getElementById('totalkdIframe');
    console.warn(333, address, port);
    iframe.contentWindow.postMessage(
      {
        type: 'login',
        config: {
          address,
          port,
        },
      },
      '*'
    );
  };

  return (
    <>
      <iframe
        id="totalkdIframe"
        className="totalkd-iframe"
        src={`https://${address}:${port}`}
        allow="microphone;camera;midi;encrypted-media;autoplay"
        onLoad={onLoad}></iframe>
      <Rnd
        id="rly-totalkd"
        className="dialogResizeMoveTotalkd"
        bounds={bounds ? bounds : '#root'}
        size={size}
        dragHandleClassName={'head'}
        position={{
          x: _.get(currentPosition, 'x', -10000),
          y: _.get(currentPosition, 'y', -10000),
        }}
        onDragStop={(e, d) => {
          setCurrentPosition({ x: d.x, y: d.y });
        }}>
        <header className="head">
          <span>对讲机语音通话</span>
          <CloseOutlined onClick={() => setToggle(false)} />
        </header>
        <div className="content">
          <div className="audio" onMouseDown={() => setSpeak(true)} onMouseUp={() => setSpeak(false)}>
            <img src={speak ? ingIcon : audioIcon} />
            <span>{speak ? '正在讲话' : '按住讲话'}</span>
          </div>
        </div>
      </Rnd>
    </>
  );
}

export const setChannelId = (res: string) => {
  EventChannelId.emit(res);
};

export const openTotalkd = (res: boolean) => {
  EventToggleTotalkd.emit(res);
};

export const closeTotalkd = (res: boolean) => {
  EventToggleTotalkd.emit(res);
};
