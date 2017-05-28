'use strict';

import React from 'react';
import im from 'immutable';
//import { KEY_INPUT_MODE } from '../core/item_type';
import { KEY_INPUT_MODE } from '../util/item_type';

//function CombinedCmd(state, action){
function CombinedCmd(state_fcd, action){
  const state = state_fcd.state_core;

  switch(action.type){
    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      {
        //console.log('SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS');
        return action.state;
      }
    case 'RECEIVE_INPUT':
      {
        return state_fcd;
        //return state;
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
                 { state_core: state.set('input_mode', KEY_INPUT_MODE.NORMAL) }
               );

        //return state.set('input_mode', KEY_INPUT_MODE.NORMAL);
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR':
      {
        //console.log('CLEAR!!');
        const id = state_fcd.active_pane_id;
        //const id = state.get('active_pane_id');
        const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
        const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);

        const state_core_new = state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                                         .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
                                                         .set('input_mode', KEY_INPUT_MODE.NORMAL)
                                                   );
        return Object.assign(
                 {},
                 state_fcd,
                 { state_core: state_core_new }
               );

        //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
        //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
        //                                 .set('input_mode', KEY_INPUT_MODE.NORMAL)
        //                          );
      }
    case 'CHANGE_DIR_UPPER':
    case 'CHANGE_DIR_LOWER':
      {
        const id = state_fcd.active_pane_id;
        //const id = state.get('active_pane_id');

        const state_core_new = state.setIn(['arr_pages', id, 'msg_cmd'], '');
        return Object.assign(
                 {},
                 state_fcd,
                 { state_core: state_core_new }
               );

        //return state.setIn(['arr_pages', id, 'msg_cmd'], '');
      }
    case 'START_NARROW_DOWN_ITEMS':
      //console.log('START_NARROW_DOWN_ITEMS');
      return state_fcd;
      //return state;
    case 'END_NARROW_DOWN_ITEMS':
      const id = state_fcd.active_pane_id;
      const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
      const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);

      const ids = action.ids;
      //console.log('--------------------------------------------');
      const items_match = im.Seq(im.Range(0, ids.length))
                            .map((e, i) => {
                              //console.log('ids[' + i + ']: ' + ids[i] + ', name: ' + items.getIn([ids[i], 'name']));
                              return items.get(ids[i]);
                            });
      //console.log('items_match: ' + items_match);

      const state_core_new = state.withMutations((s) => s.setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items_match)
                                                         .set('input_mode', action.input_mode));
      return Object.assign(
               {},
               state_fcd,
               { state_core: state_core_new }
             );


      //return state.withMutations((s) => s.setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items_match)
      //                                   .set('input_mode', action.input_mode));

    case 'UPDATE_PANE_CMD':
      //console.log('UPDATE_PANE_CMD');
      return action.state;
    default:
      return state_fcd;
      //return state;
  }

  return state_fcd;
  //return state;
}

////function NarrowDownItemsCore(state, id, msg){
//function NarrowDownItemsCore(state_fcd, id, msg){
//  const state = state_fcd.state_core;
//
//  return new Promise(function(resolve, reject){
//    if(msg.length <= 0){
//      //console.log('HERE!!');
//
//      const state_core_new = state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//                                                       .set('input_mode', KEY_INPUT_MODE.NORMAL))
//      resolve(
//        Object.assign(
//          {},
//          state_fcd,
//          { state_core: state_core_new }
//        )
//      );
//
//      //resolve(
//      //  state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//      //                            .set('input_mode', KEY_INPUT_MODE.NORMAL))
//      //);
//    }
//    //console.log('HERE2!!');
//
//    const pattern = msg.slice(1, msg.length);
//    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//    let items;
//
//    if(pattern.length > 0){
//      //console.log('pattern.length > 0');
//      const reg = new RegExp(pattern);
//
//      items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
//                         .filter((e, i) => {
//                           if(reg.test(e.name)){
//                             return e;
//                           }
//                         });
//
//    }else{
//      items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
//    }
//
//    {
//      const state_core_new = state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                  .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                  .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0)
//                                  .setIn(['arr_item_list', id], 0))
//
//      resolve(
//        Object.assign(
//          {},
//          state_fcd,
//          { state_core: state_core_new }
//        )
//      );
//    }
//
//    //resolve(
//    //  state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//    //                            .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//    //                            .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0)
//    //                            .setIn(['arr_item_list', id], 0))
//    //);
//
//  });
//
//}
//
////function NarrowDownItems(state, id, msg){
//function NarrowDownItems(state_fcd, id, msg){
//  const state = state_fcd.state_core;
//
//  if(msg.length <= 0){
//
//    const state_core_new = state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//                                                     .set('input_mode', KEY_INPUT_MODE.NORMAL));
//
//    return Object.assign(
//             {},
//             state_fcd,
//             { state_core: state_core_new }
//           );
//
//    //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//    //                                 .set('input_mode', KEY_INPUT_MODE.NORMAL));
//  }
//
//  const pattern = msg.slice(1, msg.length);
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  let items;
//
//  console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);
//
//  if(pattern.length > 0){
//    //console.log('pattern.length > 0');
//    const reg = new RegExp(pattern);
//
//    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
//                       .filter((e, i) => {
//                         if(reg.test(e.name)){
//                           return e;
//                         }
//                       });
//
//  }else{
//    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
//  }
//
//  const arr_line_cur_prv = state.get('arr_line_cur');
//  const arr_line_cur = [
//    ...arr_lien_cur_prv(0, id),
//    0,
//    ...arr_lien_cur_prv(id+1)
//  ];
//
//  const state_core_new = state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));
//
//  return Object.assign(
//           {},
//           state_fcd,
//           {
//             state_core: state_core_new,
//             arr_line_cur: arr_line_cur
//           }
//         );
//
//  //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//  //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//  //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0)
//  //                                 .set('arr_line_cur', arr_line_cur));
//}

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
