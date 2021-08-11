import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';
import _ from 'lodash';
import { CloseOutlined } from '@ant-design/icons';
import RowFlex from '@/components/RowFlex';
import './ResizeMoveDialog.less';

interface ResizeMoveDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  bounds?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  titleClassName?: string;
  dialogClassName?: string;
  limitSize?: { width: number; height: number };
  close?: () => void;
}

export default function ResizeMoveDialog(props: ResizeMoveDialogProps) {
  const { title, position, children, titleClassName, dialogClassName, limitSize, size, close, maxSize } = props;
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);

  const titleStyle = classNames('dialogTitle', titleClassName);
  const dialogStyle = classNames('dialogResizeMoveBox', dialogClassName);

  const closeDialog = () => {
    close && close();
    setCurrentPosition({ x: -10000, y: -10000 });
    setCurrentSize(size);
  };

  useEffect(() => {
    _.isEqual(currentPosition, { x: -10000, y: -10000 }) && setCurrentPosition(position);
  }, [position]);

  return (
    <Rnd
      className={dialogStyle}
      minWidth={_.get(limitSize, 'width', 220)}
      minHeight={_.get(limitSize, 'height', 130)}
      maxWidth={_.get(maxSize, 'width', 220)}
      maxHeight={_.get(maxSize, 'height', 130)}
      //   bounds={'#root'}
      dragHandleClassName={'dialogTitle'}
      size={{
        width: _.get(currentSize, 'width', 500),
        height: _.get(currentSize, 'height', 700),
      }}
      position={{
        x: _.get(currentPosition, 'x', -10000),
        y: _.get(currentPosition, 'y', -10000),
      }}
      onDragStop={(e, d) => {
        setCurrentPosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setCurrentSize({ width: _.parseInt(ref.style.width), height: _.parseInt(ref.style.height) });
        setCurrentPosition(position);
      }}>
      <div className="resizeContent">{children}</div>
    </Rnd>
  );
}
