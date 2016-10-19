'use strict';

import React from 'react';
import { KEY_INPUT_MODE } from '../core/item_type';

//const CombinedCmd = (state, action) => {
function CombinedCmd(state, action){
//function CombinedCmd(state, action, c){
  //return Object.assign({}, state);

  console.log('action.event: ' + action.event);
  switch(action.type){
    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      console.log('CombinedCmd <> HERE!!');
      return Object.assign({}, state,
                           {msg_cmd: '/'});
    case 'SWITCH_INPUT_MODE_NORMAL':
      return Object.assign({}, state,
                           {input_mode: KEY_INPUT_MODE.NORMAL});
    case 'RECEIVE_INPUT':

      //let msg_cmd += action.c;
      let msg_cmd;
       
      const c = action.c;
      switch(c){
        case 'Backspace':
          msg_cmd = state.msg_cmd.slice(0, state.msg_cmd.length - 1);
          break;
        case 'h':
          if(event.ctrlKey == true){
            msg_cmd = state.msg_cmd.slice(0, state.msg_cmd.length - 1);
          }else{
            msg_cmd = state.msg_cmd + c;
          }
          break;
        case 'Control':
          msg_cmd = state.msg_cmd;
          break;
        default:
          msg_cmd = state.msg_cmd + c;
          break;
      }
      console.log('CombinedCmd <> msg_cmd: ' + msg_cmd);
      let state_new = Object.assign({}, state, {msg_cmd: msg_cmd});
      //let state_new = Object.assign({}, state);
      return state_new;
    default:
      //console.log('c: ' + c);
      return Object.assign({}, state);
  }
}

export default CombinedCmd;
