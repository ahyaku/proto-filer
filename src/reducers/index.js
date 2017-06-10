'use strict';

import { combineReducers } from 'redux';
import CombinedItemList from './combined-item-list';

import CombinedCmd from './combined-cmd';
//import { KEY_INPUT_MODE } from '../core/item_type';
import { KEY_INPUT_MODE } from '../util/item_type';

function itemList(state_fcd, action){
  const state = state_fcd.state_core;
  //console.log('reducer <> state_fcd.input_mode: ', state_fcd.input_mode);
  //console.log('reducer <> state_fcd.state_core: ', state_fcd.state_core);
  let state_fcd_ret;
  //switch(state.get('input_mode')){
  switch(state_fcd.input_mode){
    case KEY_INPUT_MODE.NORMAL:
      //console.log('reducer <> NORMAL');
      state_fcd_ret = CombinedItemList(state_fcd, action);
      //console.log('reducer <> after CL state_fcd_ret.state_core: ', state_fcd_ret.state_core);
      state_fcd_ret = CombinedCmd(state_fcd_ret, action);
      //console.log('reducer <> after CC state_fcd_ret.state_core: ', state_fcd_ret.state_core);
      break;
    case KEY_INPUT_MODE.SEARCH:
      //console.log('reducer <> SEARCH');
      state_fcd_ret = CombinedCmd(state_fcd, action);
      state_fcd_ret = CombinedItemList(state_fcd_ret, action);
      break;
    default:
      //console.log('reducer <> default');
      /* Do Nothing.. */
      break;
  }

//  {
//    const active_pane_id = state_fcd_ret.active_pane_id;
//    const state = state_fcd_ret.state_core.get(active_pane_id);
//    const dir = state.getIn(['dirs', 0]);
//    const page = state.getIn(['pages', dir]);
//    const line_cur = page.get('line_cur');
//    console.log('reducer <> line_cur: ' + line_cur);
//  }

//  {
//    const active_pane_id = state_fcd_ret.active_pane_id;
//    console.log('active_pane_id: ' + active_pane_id);
//    for(let i=0; i<2; i++){
//      const state = state_fcd_ret.state_core.get(i);
//      const dir = state.getIn(['dirs', 0]);
//      const page = state.getIn(['pages', dir]);
//      const line_cur = page.get('line_cur');
//      const id_map = page.get('id_map');
//      console.log('reducer <> id: ' + i + ', id_map.size: ' + id_map.size);
//      //console.log('reducer <> id: ' + i + ', line_cur: ' + line_cur);
//      //console.log('reducer <> id: ' + i + ', dir: ' + dir);
//    }
//  }

  return state_fcd_ret;
}


export default itemList;
