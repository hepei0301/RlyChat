import React, { useEffect, useState } from 'react';
import { notification, Button } from 'antd';
// eslint-disable-next-line import/no-unresolved
import Iframe from 'react-iframe';
// eslint-disable-next-line import/extensions
import ResizeMoveDialog from '../../components/ResizeMoveDialog';
import { EventOpenIm, ImProps, EventToggleHorn, ToggleHornProp } from '../../event';
import '../../utils/chatLogin.js';
export interface RlyPropos {
    bounds?: string;
    contactsList?: any;
    size?: { width: number; height: number };
    limitSize?: { width: number; height: number };
    maxSize?: { width: number; height: number };
    userInfo?: { userId: string; userName: string };
    id: string;
}
const info = {
    message: '信息通信',
    audio: '语音通话',
    video: '视频通话',
};

function IM({ bounds, size, maxSize, limitSize, userInfo }: RlyPropos) {
    const [toggle, setToggle] = useState(false);

    const close = () => {
        setToggle(false);
        (document.getElementById('RlyChat-Im') as any).contentWindow.postMessage({ type: 'closeDev' });
    };

    const open = () => {
        setToggle(true);
    };

    useEffect(() => {
        const handle = (res: any) => {
            const data = (res && res.data) || { type: '', name: '' };
            if (toggle || data.type === 'meet' || !data.name || !data.type) return;
            notification.destroy();
            notification.info({
                message: `您接收到一则${info[data.type]}`,
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
        EventOpenIm.on((res: ImProps) => {
            (document.getElementById('RlyChat-Im') as any).contentWindow.postMessage({ ...res });
            open();
        });
        EventToggleHorn.on((res: ImProps) => {
            (document.getElementById('RlyChat-Im') as any).contentWindow.postMessage({ ...res });
        });
    }, []);

    return (
        <ResizeMoveDialog
            limitSize={limitSize || { width: 300, height: 300 }}
            maxSize={maxSize || { width: 900, height: 600 }}
            size={size || { width: 900, height: 600 }}
            close={close}
            bounds={bounds || 'body'}
            id="RLY-IM"
            showCloseIcon={true}
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
                            { id: 'aa11300', name: 'hepeu' },
                            { id: 'bb11', name: '何佩' },
                        ]);
                    });
                }}
            />
        </ResizeMoveDialog>
    );
}

export default React.memo(IM);

export const openIM = (res: ImProps) => {
    EventOpenIm.emit(res);
};

export const toggleHorn = (res: ToggleHornProp) => {
    EventToggleHorn.emit(res);
};