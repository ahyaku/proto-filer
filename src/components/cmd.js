'use strict';

import React from 'react';

const Cmd = ({msg_cmd}) => {
  const style = {
    minHeight: '20px',
    height: '20px',
    border: '1px solid #FFFFFF',
    overflowX: 'hidden',
    overflowY: 'hidden'
  };

  //console.log('msg_cmd: ' + msg_cmd);

  return (
    <div style={style}>
      {msg_cmd}
    </div>
  );
}

export default Cmd;

