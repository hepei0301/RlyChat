import React, { ReactNode, useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
import IM, { openIM } from './im/index';
import Meet, { openMeet } from './meet/index';
import _ from 'lodash';
import './index.less';

interface contactsProps {
  id: string | number;
  name: string;
}
interface RlyChatProps {
  userId: string;
  userName: string;
  contacts?: Array<contactsProps>;
}

export default function RlyChat({ userId = '13700000000', userName = '默认昵称' }: RlyChatProps) {
  return (
    <div>
      <Button style={{ position: 'absolute', top: 50, left: 20 }} onClick={openMeet}>
        答案开meet23
      </Button>
      <Button style={{ position: 'absolute', top: 10, left: 20 }} onClick={openIM}>
        答案开im122
      </Button>
      <IM userInfo={{ userId: '13700000000', userName: '默认昵称' }} contactsList={[]} />
      <Meet userInfo={{ userId: '13700000000', userName: '默认昵称' }} />
    </div>
  );
}
