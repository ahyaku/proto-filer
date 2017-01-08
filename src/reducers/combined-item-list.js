'use strict';

import fs from 'fs';
import im from 'immutable';
import ItemListCore from '../core/item_list';
import { KEY_INPUT_MODE } from '../core/item_type';

function CombinedItemList(state, action){
  switch(action.type){
    case 'MOVE_CURSOR_UP':
      {
        return moveCursor(state, -1);
      }
    case 'MOVE_CURSOR_DOWN':
      {
        return moveCursor(state, 1);
      }
    case 'CHANGE_DIR_UPPER':
      {
        const idx = state.get('active_pane_id');
        const pages = state.getIn(['arr_pages', idx]).changeDirUpper();

        const dir_cur = pages.get('dir_cur');
        const items = pages.getIn(['pages', dir_cur, 'items']);
        //console.log('items: ' + items);
        const item_name_list = updateItemNameListCore(dir_cur, items);
        const ret = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
                                                .setIn(['arr_item_name_lists', idx], item_name_list));

        //const ret = state.setIn(['arr_pages', idx], pages);

        return ret;
      }
    case 'CHANGE_DIR_LOWER':
      {
        const idx = state.get('active_pane_id');
        const pages = state.getIn(['arr_pages', idx]).changeDirLower();

        const dir_cur = pages.get('dir_cur');
        const items = pages.getIn(['pages', dir_cur, 'items']);
        //console.log('items: ' + items);
        const item_name_list = updateItemNameListCore(dir_cur, items);
        const ret = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
                                                .setIn(['arr_item_name_lists', idx], item_name_list));

        //const ret = state.setIn(['arr_pages', idx], pages);

        return ret;
      }
    case 'SWITCH_ACTIVE_PANE':
      switch(state.get('active_pane_id')){
        case 0:
          return state.set('active_pane_id', 1);
        case 1:
          return state.set('active_pane_id', 0);
        default:
          /* Do Nothing.. */
          console.log('ERROR!! Incorrect Value \'active_pane_id\'!!');
          return state;
      }
    case 'SYNC_DIR_CUR_TO_OTHER':
      {
        console.log('SYNC_DIR_CUR_TO_OTHER');
        const idx_cur = state.get('active_pane_id');
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        return syncDir(state, idx_other, idx_cur);
      }

    case 'SYNC_DIR_OTHER_TO_CUR':
      {
        console.log('SYNC_DIR_OTHER_TO_CUR');
        const idx_cur = state.get('active_pane_id');
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        return syncDir(state, idx_cur, idx_other);
      }

    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      {
        //console.log('CHANGE!!');
        //return state.set('input_mode', KEY_INPUT_MODE.SEARCH);
        return state;
      }

  //  case 'SWITCH_INPUT_MODE_NORMAL':
  //    return Object.assign({}, state, {input_mode: KEY_INPUT_MODE.NORMAL});
  //  case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
  //    return Object.assign({}, state,
  //                         {input_mode: KEY_INPUT_MODE.SEARCH});
  //  case 'RECEIVE_INPUT':
  //    const idx = state.active_pane_id;

  //    const msg_cmd = state.arr_pages[idx].msg_cmd;
  //    const pattern = msg_cmd.slice(1, msg_cmd.length);

  //    const im_state = im.fromJS(state);
  //    const reg = new RegExp(pattern);

  //    const tmp = { arr_pages: [{name: 'name0', age: 0}, {name: 'name1', age: 1}, {name: 'name2', age: 2}], other: "other_hoge"  };
  //    const im_tmp = im.fromJS(tmp);
  //    const t = im_tmp.getIn(['arr_pages', 0]);
  //    console.log('t: ' + t);

  //    console.log('test: ' + state.arr_pages[idx].test);
  //    const im_items_org = im_state.getIn(['arr_pages', idx]);
  //    console.log('im_items_org: ' + im_items_org);

  //    const im_items = im.List(im.List(im_state.get('arr_pages')).get(idx).items);

  //    const im_filtered = im_items.filter(function(e){
  //      return (e.name.search(reg) > -1);
  //    });
  //    const filtered = im_filtered.toJS();
  //    console.log('-------------------------------------');
  //    for(let e of filtered){
  //      console.log('e.name: ' + e.name);
  //    }
  //    console.log('-------------------------------------');

  //    const items = im_items.toJS();

  //    const state_new = im_state.toJS();

  //    return state_new;

    case 'TEST_SEND_MSG':
      console.log('TEST_SEND_MSG');
      return state;
    case 'TEST_RECEIVE_MSG':
      console.log('TEST_RECEIVE_MSG <> ret_msg: ' + action.ret_msg);
      return state;
    default:
      return state;
  }

}

function moveCursor(state, delta){
  const idx = state.get('active_pane_id');
  const dir_cur = state.getIn(['arr_pages', idx, 'dir_cur']);
  const line_cur = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur']);
  //const len_items = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'items']).count();
  //console.log('len_items : ' + len_items);
  const len = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'items_match']).count();
  //console.log('len: ' + len);
  //const items = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'items']);
  //console.log('items: ' + items);
  //const items_match = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'items_match']);
  //console.log('items_match: ' + items_match);

  //return state;

  const ret = state.updateIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur'],
                      (v) => {
                        const vv = v + delta;
                        if(vv < 0){
                          //console.log('are');
                          return len - 1;
                        }else if(vv >= len){
                          //console.log('you');
                          return 0;
                        }else{
                          //console.log('known?');
                          return vv;
                        }
                      });

  //console.log('6-------------------------');

  return ret;
}

function syncDir(state, idx_dst, idx_src){
  const dir_dst = state.getIn(['arr_pages', idx_dst, 'dir_cur']);
  //console.log('idx_other: ' + idx_other);
  //console.log('dir_other: ' + dir_other);
  const pages = state.getIn(['arr_pages', idx_src]).updatePageCur(dir_dst);
  //const ret = state.setIn(['arr_pages', idx_src], arr_pages);

  const items = pages.getIn(['pages', dir_dst, 'items']);
  //console.log('items: ' + items);
  const item_name_list = updateItemNameListCore(dir_dst, items);

  const ret = state.withMutations((s) => s.setIn(['arr_pages', idx_src], pages)
                                          .setIn(['arr_item_name_lists', idx_src], item_name_list));
  //const ret = state.setIn(['arr_pages', idx_src], pages);

  return ret;
}

export const updateItemNameList = (state, id) => {
  //console.log('updateItemNameList()!!');
  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  //console.log('dir_cur: ' + dir_cur);
  const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
  //console.log('items: ' + items);
  //console.log('items.size: ' + items.size);

  return updateItemNameListCore(dir_cur, items);

  //let array = [];
  //for(let i=0; i<items.size; i++){
  //  array.push(items.getIn([i, 'name']));
  //}
  //return array;
}

const updateItemNameListCore = (dir_cur, items) => {
  let array = [];
  //console.log('items: ' + items.get(3));
  for(let i=0; i<items.size; i++){
    array.push(items.getIn([i, 'name']));
    //console.log('array[' + i + ']: ' + array[i]);
  }
  return array;
}


//function syncDir(state, idx_dst, idx_src){
//  const dir_dst = state.getIn(['arr_pages', idx_dst, 'dir_cur']);
//  //console.log('idx_other: ' + idx_other);
//  //console.log('dir_other: ' + dir_other);
//  const arr_pages = state.getIn(['arr_pages', idx_src]).updatePageCur(dir_dst);
//  const ret = state.setIn(['arr_pages', idx_src], arr_pages);
//  return ret;
//}


//export const updateItemNameList = (state, id) => {
//  //console.log('updateItemNameList()!!');
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  //console.log('dir_cur: ' + dir_cur);
//  const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
//  //console.log('items: ' + items);
//  //console.log('items.size: ' + items.size);
//  let array = [];
//  //console.log('items: ' + items.get(3));
//  for(let i=0; i<items.size; i++){
//    array.push(items.getIn([i, 'name']));
//    //console.log('array[' + i + ']: ' + array[i]);
//  }
//  if(id === 0){
//    return state.set('name_list_left', array);
//  }else if(id === 1){
//    return state.set('name_list_right', array);
//  }else{
//    console.log('ERROR!!!');
//  }
//}

//function changeDir(path){
//  const idx = state.get('active_pane_id');
//  const arr_pages = state.getIn(['arr_pages', idx])
//                         .updatePageCur(path);
//
//  const ret = state.updateIn(['arr_pages', idx], arr_pages);
//  return ret;
//}

export default CombinedItemList;
