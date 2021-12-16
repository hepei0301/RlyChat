import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import _ from 'lodash';
import { RlyPropos } from '../pages/im';
import close_press from '../assets/close_press.png';
import './ResizeMoveDialog.less';

interface ResizeMoveDialogProps extends RlyPropos, React.HTMLAttributes<HTMLDivElement> {
  close?: () => void;
  toggle: boolean;
  id: string;
  showCloseIcon?: boolean;
}

function ResizeMoveDialog(props: ResizeMoveDialogProps) {
  const { limitSize, size, close, maxSize, bounds, children, toggle, id, showCloseIcon } = props;
  const [currentPosition, setCurrentPosition] = useState({ x: -10000, y: -10000 });
  const [currentSize, setCurrentSize] = useState(size);
  const [mouseState, setMouseState] = useState(false);

  useEffect(
    () => {
      if (toggle) {
        setCurrentPosition({
          x: Math.ceil((document.documentElement.clientWidth - _.get(size, 'width', 0)) / 2),
          y: Math.ceil((document.documentElement.clientHeight - _.get(size, 'height', 0)) / 2)
        });
      } else {
        setCurrentPosition({ x: -10000, y: -10000 });
        setCurrentSize(size);
      }
    },
    [toggle]
  );

  const closeDialog = () => {
    close && close();
  };

  return (
    <Rnd
      id={id}
      className="dialogResizeMoveBoxRLY"
      minWidth={_.get(limitSize, 'width', 120)}
      minHeight={_.get(limitSize, 'height', 30)}
      maxWidth={_.get(maxSize, 'width', 2000)}
      maxHeight={_.get(maxSize, 'height', 3000)}
      bounds={bounds ? bounds : '#root'}
      dragHandleClassName={'dialogTitle'}
      size={{
        width: _.get(currentSize, 'width', 500),
        height: _.get(currentSize, 'height', 700)
      }}
      position={{
        x: _.get(currentPosition, 'x', -10000),
        y: _.get(currentPosition, 'y', -10000)
      }}
      onDragStart={() => {
        setMouseState(true);
      }}
      onDragStop={(e, d) => {
        setMouseState(false);
        setCurrentPosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setCurrentSize({
          width: _.parseInt(ref.style.width),
          height: _.parseInt(ref.style.height)
        });
        setCurrentPosition(position);
      }}
    >
      <div className="dialogTitle" />
      <img
        src={close_press}
        className="close"
        onClick={closeDialog}
        style={{ display: showCloseIcon ? 'block' : 'none' }}
      />
      <div className="resizeContent" style={{ pointerEvents: mouseState ? 'none' : 'auto' }}>
        {children}
      </div>
    </Rnd>
  );
}

export default React.memo(ResizeMoveDialog);
