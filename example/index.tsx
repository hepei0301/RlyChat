import React from 'react';
import ReactDOM from 'react-dom';
import { IM } from '../src';
import 'antd/dist/antd.css';

function App() {
  return <IM />
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
