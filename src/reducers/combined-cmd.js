'use strict';

import React from 'react';
import { KEY_INPUT_MODE } from '../core/item_type';

function CombinedCmd(state, action){

  //let idx = state.active_pane_id;
  //let msg_cmd = state.arr_pages[idx].msg_cmd;
  //let state_new = Object.assign({}, state);
  //let msg_cmd_new;
  switch(action.type){
    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      {
        const id = state.get('active_pane_id');
        const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
        if(msg.length > 0){
          return state;
        }else{
          return state.setIn(['arr_pages', id, 'msg_cmd'], msg + action.c);
        }
      }
    case 'RECEIVE_INPUT':
      {
        const id = state.get('active_pane_id');
        const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + action.c;
        return state.setIn(['arr_pages', id, 'msg_cmd'], msg);
      }

  //  case 'SWITCH_INPUT_MODE_NORMAL':
  //    state_new.input_mode = KEY_INPUT_MODE.NORMAL;
  //    if( (action.is_clear_cmd == true) ||
  //        (msg_cmd.length <= 1)         ){
  //      state_new.arr_pages[idx].msg_cmd = '';
  //    }
  //    return state_new;
    //case 'RECEIVE_INPUT':

    //  if(event.ctrlKey == true){
    //    msg_cmd_new = getNewMsgCmdWithCtrl(msg_cmd, action.c);
    //  }else{
    //    msg_cmd_new = getNewMsgCmd(msg_cmd, action.c);
    //  }

    //  if(msg_cmd_new.length <= 0){
    //    state_new.input_mode = KEY_INPUT_MODE.NORMAL;
    //    state_new.arr_pages[idx].msg_cmd = '';
    //  }else{
    //    state_new.arr_pages[idx].msg_cmd = msg_cmd_new;
    //  }
    //  //console.log('combinedd-cmd <> msg_cmd_new: ' + msg_cmd_new);
    //  return state_new;
    case 'RECEIVE_INPUT_BS':
      {
        const id = state.get('active_pane_id');
        //console.log('m: ' + state.getIn(['arr_pages', id, 'msg_cmd']));
        //console.log('action.msg_cmd: ' + action.c);
        const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
        //console.log('msg_cmd: ' + msg);
        return state.setIn(['arr_pages', id, 'msg_cmd'], msg.slice(0, msg.length - 1));
      }
    case 'CLEAR_INPUT':
      {
        const id = state.get('active_pane_id');
        const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
        return state.setIn(['arr_pages', id, 'msg_cmd'], msg.slice(0, 1));
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_MSG':
      {
        //const id = state.get('active_pane_id');
        return state.set('input_mode', KEY_INPUT_MODE.NORMAL);
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR':
      {
        const id = state.get('active_pane_id');
        return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                         .set('input_mode', KEY_INPUT_MODE.NORMAL)
                                  );
      }
    default:
      return state;
      //return Object.assign({}, state);
  }

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
