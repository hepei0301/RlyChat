import React, { ReactNode, useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
import IM from './im/index';
import Meet from './meet/index';
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
      <IM />
      {/* <Meet /> */}
    </div>
  );
}
