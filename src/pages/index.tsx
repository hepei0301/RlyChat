import React, { ReactNode, useEffect, useState } from 'react';
import { notification, Button } from 'antd';
import Iframe from 'react-iframe';
import IM from './im/index';
import Meet from './meet/index';
import _ from 'lodash';
import './index.less';
interface indexProps {
  type?: 'IM' | 'Meet';
  userId: string;
  userName: string;
}
export default function IndexPage({ type = 'IM', userId = '13700000000', userName = '姓名' }: indexProps) {
  return (
    <div>
      <IM />
      <Meet />
    </div>
  );
}
