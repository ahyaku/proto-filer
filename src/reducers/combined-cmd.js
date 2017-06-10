'use strict';

import React from 'react';
import im from 'immutable';
//import { KEY_INPUT_MODE } from '../core/item_type';
import { KEY_INPUT_MODE } from '../util/item_type';

function CombinedCmd(state_fcd, action){

  switch(action.type){
    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      {
        //console.log('SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS');
        return action.state;
      }
    case 'RECEIVE_INPUT':
      {
        return state_fcd;
      }
    case 'RECEIVE_INPUT_BS':
      {
        return action.state;
      }
    case 'CLEAR_INPUT':
      {
        return action.state;
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_MSG':
      {
        return Object.assign(
                 {},
                 state_fcd,
                 { input_mode: KEY_INPUT_MODE.NORMAL }
               );
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR':
      {
        const id = state_fcd.active_pane_id;
        const state = state_fcd.state_core.get(id);
        const dir = state.getIn(['dirs', 0]);
        const page = state.getIn(['pages', dir]);
        const id_map = im.List(im.Range(0, page.get('items').size));
        const page_new = page.set('id_map', id_map);
        const state_new = state.withMutations(s => s.set('msg_cmd', '')
                                                    .setIn(['pages', dir], page_new));

        //console.log('SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR <> id_map.size: ' + id_map.size);
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(id, state_new),
                   input_mode: KEY_INPUT_MODE.NORMAL
                 }
               );
      }

    case 'CHANGE_DIR_UPPER':
    case 'CHANGE_DIR_LOWER':
      {
        const id = state_fcd.active_pane_id;

        const state = state_fcd.state_core.get(id);
        const state_new = state.set('msg_cmd', '');
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new)
                 }
               );
      }
    case 'START_NARROW_DOWN_ITEMS':
      //console.log('START_NARROW_DOWN_ITEMS');
      return state_fcd;
    case 'END_NARROW_DOWN_ITEMS':
      {
        const id = state_fcd.active_pane_id;
        const state = state_fcd.state_core.get(id);

        const dir_cur = state.getIn(['dirs', 0]);
        const page = state.getIn(['pages', dir_cur]);

        const page_new = page.set('id_map', im.List(action.ids));
        const state_new = state.setIn(['pages', dir_cur], page_new);
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new)
                 }
               );

      }

    case 'UPDATE_PANE_CMD':
      //console.log('UPDATE_PANE_CMD');
      return action.state;
    default:
      //{
      //  const active_pane_id = state_fcd.active_pane_id;
      //  const state = state_fcd.state_core.get(active_pane_id);
      //  const dir = state.getIn(['dirs', 0]);
      //  const page = state.getIn(['pages', dir]);
      //  const line_cur = page.get('line_cur');
      //  console.log('combined-cmd <> line_cur: ' + line_cur);
      //}
      return state_fcd;
  }
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
