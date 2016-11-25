'use strict';

import React from 'react';
import { KEY_INPUT_MODE } from '../core/item_type';

//const Cmd = ({msg_cmd}) => {
const Cmd = ({msg_cmd, input_mode}) => {
  const style = {
    //minHeight: '20px',
    //height: '20px',
    border: '1px solid #FFFFFF',
    //overflowX: 'hidden',
    //overflowY: 'hidden'
  };

  //console.log('msg_cmd: ' + msg_cmd);

  return (
    <div style={style}>
      {msg_cmd}
    </div>
  );
}

export default Cmd;

