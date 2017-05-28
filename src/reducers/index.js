'use strict';

import { combineReducers } from 'redux';
import CombinedItemList from './combined-item-list';

import CombinedCmd from './combined-cmd';
//import { KEY_INPUT_MODE } from '../core/item_type';
import { KEY_INPUT_MODE } from '../util/item_type';

function itemList(state_fcd, action){
  const state = state_fcd.state_core;
  let state_fcd_ret;
  switch(state.get('input_mode')){
    case KEY_INPUT_MODE.NORMAL:
      state_fcd_ret = CombinedItemList(state_fcd, action);
      state_fcd_ret = CombinedCmd(state_fcd_ret, action);
      break;
    case KEY_INPUT_MODE.SEARCH:
      state_fcd_ret = CombinedCmd(state_fcd, action);
      state_fcd_ret = CombinedItemList(state_fcd_ret, action);
      break;
    default:
      /* Do Nothing.. */
      break;
  }
  return state_fcd_ret;
}

//function itemList(state, action){
//  let state_ret;
//  switch(state.get('input_mode')){
//    case KEY_INPUT_MODE.NORMAL:
//      state_ret = CombinedItemList(state, action);
//      state_ret = CombinedCmd(state_ret, action);
//      break;
//    case KEY_INPUT_MODE.SEARCH:
//      state_ret = CombinedCmd(state, action);
//      state_ret = CombinedItemList(state_ret, action);
//      break;
//    default:
//      /* Do Nothing.. */
//      break;
//  }
//
//  return state_ret;
//}


export default itemList;
