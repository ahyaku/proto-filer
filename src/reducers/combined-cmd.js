'use strict';

import React from 'react';
import im from 'immutable';
import { KEY_INPUT_MODE } from '../core/item_type';

function CombinedCmd(state, action){
  //console.log('CombineCmd() Start!! action.type: ' + action.type);

  //let idx = state.active_pane_id;
  //let msg_cmd = state.arr_pages[idx].msg_cmd;
  //let state_new = Object.assign({}, state);
  //let msg_cmd_new;
  switch(action.type){
    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      {
        //console.log('SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS');
        return action.state;
      }
    case 'RECEIVE_INPUT':
      {
        return state;
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
        return state.set('input_mode', KEY_INPUT_MODE.NORMAL);
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR':
      {
        //console.log('CLEAR!!');
        const id = state.get('active_pane_id');
        const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
        const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
        return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                         .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
                                         .set('input_mode', KEY_INPUT_MODE.NORMAL)
                                  );
      }
    case 'CHANGE_DIR_UPPER':
    case 'CHANGE_DIR_LOWER':
      {
        const id = state.get('active_pane_id');
        return state.setIn(['arr_pages', id, 'msg_cmd'], '');
      }
    case 'START_NARROW_DOWN_ITEMS':
      //console.log('START_NARROW_DOWN_ITEMS');
      return state;
    case 'END_NARROW_DOWN_ITEMS':
      //console.log('END_NARROW_DOWN_ITEMS');
      const id = state.get('active_pane_id');
      //console.log('id: ' + id);
      const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
      //console.log('dir_cur: ' + dir_cur);
      const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);

      const ids = action.ids;
      //console.log('--------------------------------------------');
      const items_match = im.Seq(im.Range(0, ids.length))
                            .map((e, i) => {
                              //console.log('ids[' + i + ']: ' + ids[i] + ', name: ' + items.getIn([ids[i], 'name']));
                              return items.get(ids[i]);
                            });
      //console.log('items_match: ' + items_match);

      return state.withMutations((s) => s.setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items_match)
                                         .set('input_mode', action.input_mode));

    case 'UPDATE_PANE_CMD':
      //console.log('UPDATE_PANE_CMD');
      return action.state;
    default:
      return state;
  }

  return state;
}

//const requestUpdateItemsMatch = (e) => {
//  return {
//    action: 'UPDATE_ITEMS_MATCH'
//  }
//}

//function NarrowDownItems(state, id, msg){
//  let state_new;
//  dispatch(requestUpdateItemsMatch);
//  NarrowDownItemsCore(state, id, msg).then(function(s){
//    state_new = s;
//    const dir_cur = s.getIn(['arr_pages', id, 'dir_cur']);
//    console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);
//    return s;
//  }).catch(function(e){
//    console.log('NarrowDownItems() <> error!! e: ' + e);
//  });
//  //console.log('NEW NarrowDownItems()');
//  //const dir_cur = state_new.getIn(['arr_pages', id, 'dir_cur']);
//  //console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);
//
//  //return state_new;
//}

//function NarrowDownItemsPromise(state, id, msg){
//  return new Promise(NarrowDownItemsCore(state, id, msg));
//}

function NarrowDownItemsCore(state, id, msg){
  //return state.setIn(['arr_pages', id, 'msg_cmd'], msg + c);

  return new Promise(function(resolve, reject){
  //return new Promise( (resolve, reject) => {
    if(msg.length <= 0){
      //console.log('HERE!!');
      resolve(
        state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                  .set('input_mode', KEY_INPUT_MODE.NORMAL))
      );
      //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
      //                                 .set('input_mode', KEY_INPUT_MODE.NORMAL));
    }
    //console.log('HERE2!!');

    const pattern = msg.slice(1, msg.length);
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    let items;

    if(pattern.length > 0){
      //console.log('pattern.length > 0');
      const reg = new RegExp(pattern);

      items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
                         .filter((e, i) => {
                           if(reg.test(e.name)){
                             return e;
                           }
                         });

    }else{
      items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
    }

    resolve(
      state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
                                .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
                                .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0))
    );
  });

  //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
  //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
  //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));

}

function NarrowDownItems(state, id, msg){
  //return state.setIn(['arr_pages', id, 'msg_cmd'], msg + c);

  if(msg.length <= 0){
    return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                     .set('input_mode', KEY_INPUT_MODE.NORMAL));
  }

  const pattern = msg.slice(1, msg.length);
  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  let items;

  console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);

  if(pattern.length > 0){
    //console.log('pattern.length > 0');
    const reg = new RegExp(pattern);

    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
                       .filter((e, i) => {
                         if(reg.test(e.name)){
                           return e;
                         }
                       });

  }else{
    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
  }

  return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));

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
