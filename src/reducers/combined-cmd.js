'use strict';

import React from 'react';
import { KEY_INPUT_MODE } from '../core/item_type';

function CombinedCmd(state, action){

  //let idx = state.active_pane_id;
  //let msg_cmd = state.arr_pages[idx].msg_cmd;
  //let state_new = Object.assign({}, state);
  //let msg_cmd_new;
  //switch(action.type){
  //  case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
  //    if(msg_cmd.length <= 1){
  //      state_new.arr_pages[idx].msg_cmd = '/';
  //    }
  //    return state_new;
  //  case 'SWITCH_INPUT_MODE_NORMAL':
  //    state_new.input_mode = KEY_INPUT_MODE.NORMAL;
  //    if( (action.is_clear_cmd == true) ||
  //        (msg_cmd.length <= 1)         ){
  //      state_new.arr_pages[idx].msg_cmd = '';
  //    }
  //    return state_new;
  //  case 'RECEIVE_INPUT':

  //    if(event.ctrlKey == true){
  //      msg_cmd_new = getNewMsgCmdWithCtrl(msg_cmd, action.c);
  //    }else{
  //      msg_cmd_new = getNewMsgCmd(msg_cmd, action.c);
  //    }

  //    if(msg_cmd_new.length <= 0){
  //      state_new.input_mode = KEY_INPUT_MODE.NORMAL;
  //      state_new.arr_pages[idx].msg_cmd = '';
  //    }else{
  //      state_new.arr_pages[idx].msg_cmd = msg_cmd_new;
  //    }
  //    //console.log('combinedd-cmd <> msg_cmd_new: ' + msg_cmd_new);
  //    return state_new;
  //  default:
  //    return Object.assign({}, state);
  //}

  return state;
}

const getNewMsgCmd = (msg_cmd, c) => {
  switch(c){
    case 'Backspace':
      return msg_cmd.slice(0, msg_cmd.length - 1);
    case 'Control':
    case 'Alt':
    case 'Tab':
      return msg_cmd;
    default:
      return msg_cmd + c;
  }
}

const getNewMsgCmdWithCtrl = (msg_cmd, c) => {
  switch(c){
    case 'h':
      return msg_cmd.slice(0, msg_cmd.length - 1);
    case 'u':
      return '/';
    case 'Control':
      return msg_cmd;
    default:
      return msg_cmd + c;
  }
}

export default CombinedCmd;
