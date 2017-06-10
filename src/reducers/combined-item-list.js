'use strict';
import fs from 'fs';
import im from 'immutable';
import { ipcRenderer } from 'electron'
//import ItemListCore from '../core/item_list';
//import { KEY_INPUT_MODE } from '../core/item_type';
import { changeDirUpper, changeDirLower, updatePageCur, changeDrive, getDirIndex } from '../util/item_list_pages';
import { KEY_INPUT_MODE, ITEM_TYPE_KIND } from '../util/item_type';


//function CombinedItemList(state, action){
function CombinedItemList(state_fcd, action){
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  switch(action.type){
    case 'MOVE_CURSOR_UP':
      {
        //return moveCursor(state_fcd, -1);
        const state_core_new = state_fcd.state_core.set(active_pane_id, moveCursor(state, -1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new
                 }
               );
        //return moveCursor(state, -1);
      }
    case 'MOVE_CURSOR_DOWN':
      {
        //console.log('HERE!!');
        //return state_fcd;
        //return moveCursor(state_fcd, 1);
        const state_core_new = state_fcd.state_core.set(active_pane_id, moveCursor(state, 1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new
                 }
               );
        //return moveCursor(state, 1);
      }
    case 'CHANGE_DRIVE':
      {
        const idx = state_fcd.active_pane_id;
        const state = state_fcd.state_core.get(idx);
        const state_new = changeDrive(state, action.dlist);
        //const dir_cur = state_new.get('dir_cur');
        const dir = state_new.getIn(['dirs', 0]);
        const im_items = state_new.getIn(['pages', dir, 'items']);
        //const item_name_list = updateItemNameListCore(dir_cur, im_items);
        //const item_name_list = updateItemNameListCore(im_items);

        const ret = Object.assign(
                      {},
                      state_fcd,
                      { 
                        state_core: state_fcd.state_core.set(idx, state_new),
                      }
                    );

        return ret;
      }
    case 'CHANGE_DIR_UPPER':
      {
        const idx = state_fcd.active_pane_id;
        const state = state_fcd.state_core.get(idx);
        const state_new = changeDirUpper(state);
        const dir = state_new.getIn(['dirs', 0]);
        const page = state_new.getIn(['pages', dir]);
        const im_items = page.get('items');

        //const item_name_list = updateItemNameListCore(im_items);

        const ret = Object.assign(
                      {},
                      state_fcd,
                      { 
                        state_core: state_fcd.state_core.set(idx, state_new),
                      }
                    );

        return ret;
      }
    case 'CHANGE_DIR_LOWER':
      {
        const idx = state_fcd.active_pane_id;
        const state = state_fcd.state_core.get(idx);
        const state_new = changeDirLower(state);
        if(state === state_new){
          return state_fcd;
        }

        const dir = state_new.getIn(['dirs', 0]);
        const page = state_new.getIn(['pages', dir]);
        const im_items = page.get('items');

        //const item_name_list = updateItemNameListCore(im_items);

        const ret = Object.assign(
                      {},
                      state_fcd,
                      { 
                        state_core: state_fcd.state_core.set(idx, state_new),
                        //arr_item_name_lists: state_fcd.arr_item_name_lists.set(idx, item_name_list)
                      }
                    );

        return ret;
      }
    case 'SWITCH_ACTIVE_PANE':
      switch(state_fcd.active_pane_id){
      //const state = state_fcd.state_core;
      //switch(state.get('active_pane_id')){
        case 0:
          return Object.assign(
                   {},
                   state_fcd,
                   { active_pane_id: 1 }
                 );
          //return Object.assign(
          //         {},
          //         state_fcd,
          //         { state_core: state.set('active_pane_id', 1) }
          //       );
        case 1:
          return Object.assign(
                   {},
                   state_fcd,
                   { active_pane_id: 0 }
                 );
          //return Object.assign(
          //         {},
          //         state_fcd,
          //         { state_core: state.set('active_pane_id', 0) }
          //       );
        default:
          /* Do Nothing.. */
          console.log('ERROR!! Incorrect Value \'active_pane_id\'!!');
          return state_fcd;
      }

      //switch(state.get('active_pane_id')){
      //  case 0:
      //    return state.set('active_pane_id', 1);
      //  case 1:
      //    return state.set('active_pane_id', 0);
      //  default:
      //    /* Do Nothing.. */
      //    console.log('ERROR!! Incorrect Value \'active_pane_id\'!!');
      //    return state;
      //}

    case 'SYNC_DIR_CUR_TO_OTHER':
      {
        //console.log('SYNC_DIR_CUR_TO_OTHER');
        const idx_cur = state_fcd.active_pane_id;
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        const state_mdf = state_fcd.state_core.get(idx_cur);
        const state_ref = state_fcd.state_core.get(idx_other);
        const state_new = syncDir(state_mdf, state_ref);

        const dir = state_new.getIn(['dirs', 0]);
        //console.log('SYNC_DIR <> dir_new: ' + dir);
        const page = state_new.getIn(['pages', dir]);
        //console.log('SYNC_DIR <> page.getIn(items, 1, name): ' + page.getIn(['items', 1, 'name']));
        const im_items = page.get('items');

        //const item_name_list = updateItemNameListCore(im_items);

        const ret = Object.assign(
                      {},
                      state_fcd,
                      { 
                        state_core: state_fcd.state_core.set(idx_cur, state_new),
                      }
                    );

        return ret;
      }

    case 'SYNC_DIR_OTHER_TO_CUR':
      {
        //console.log('SYNC_DIR_OTHER_TO_CUR');
        const idx_cur = state_fcd.active_pane_id;
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        const state_mdf = state_fcd.state_core.get(idx_other);
        const state_ref = state_fcd.state_core.get(idx_cur);

        const state_new = syncDir(state_mdf, state_ref);

        const dir = state_new.getIn(['dirs', 0]);
        const page = state_new.getIn(['pages', dir]);
        const im_items = page.get('items');

        //const item_name_list = updateItemNameListCore(im_items);

        const ret = Object.assign(
                      {},
                      state_fcd,
                      { 
                        state_core: state_fcd.state_core.set(idx_other, state_new),
                      }
                    );

        return ret;
      }

    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      {
        return state_fcd;
        //return state;
      }
    case 'DISP_POPUP_FOR_QUIT':
      {
        dispPopUp('quit', null);
        return state_fcd;
      }
    case 'CLOSE_MAIN_WINDOW':
      {
        closeMainWindow();
        return state_fcd;
      }
    case 'TOGGLE_ITEM_SELECT_UP':
      {
        const state_tmp = toggleItemSelect(state);
        const state_core_new = state_fcd.state_core.set(active_pane_id, moveCursor(state_tmp, -1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new
                 }
               );
      }
    case 'TOGGLE_ITEM_SELECT_DOWN':
      {
        const state_tmp = toggleItemSelect(state);
        const state_core_new = state_fcd.state_core.set(active_pane_id, moveCursor(state_tmp, 1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new
                 }
               );
      }
    case 'TEST_SEND_MSG':
      console.log('TEST_SEND_MSG');
      return state_fcd;
      //return state;
    case 'TEST_RECEIVE_MSG':
      console.log('TEST_RECEIVE_MSG <> ret_msg: ' + action.ret_msg);
      return state_fcd;
      //return state;
    default:
      return state_fcd;
      //return state;
  }

}

/* Before */
//function moveCursor(state_fcd, delta){
//  const state = state_fcd.state_core;
//  const idx = state_fcd.active_pane_id;
//  //const idx = state.get('active_pane_id');
//  const dir_cur = state.getIn(['arr_pages', idx, 'dir_cur']);
//  const len = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'items_match']).count();
//
//  const line_cur = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur']);
//
//  const item_list = state.getIn(['arr_pages', idx, 'pages', dir_cur]);
//  const item = item_list.getIn(['items', line_cur]);
//
//  let vv = line_cur + delta;
//  if(vv < 0){
//    //console.log('are');
//    vv = len - 1;
//  }else if(vv >= len){
//    //console.log('you');
//    vv =  0;
//  }
//
//  //console.log('line_cur: ' + line_cur + ', vv: ' + vv);
//  //console.log('org arr_line_cur[' + idx + ']: ' + state.get('arr_line_cur')[idx]);
//
//  const arr_line_cur_prev = state_fcd.arr_line_cur;
//  //const arr_line_cur_prev = state.get('arr_line_cur');
//
//  const arr_line_cur = [
//    ...arr_line_cur_prev.slice(0, idx),
//    vv,
//    ...arr_line_cur_prev.slice(idx+1),
//  ];
//
//  const state_core_new = state.setIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur'], vv);
//  const ret = Object.assign(
//                {},
//                state_fcd,
//                { 
//                  state_core: state_core_new,
//                  arr_line_cur: arr_line_cur
//                }
//              );
//  
//
//  //const ret = state.withMutations((s) => s.setIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur'], vv)
//  //                                        .set('arr_line_cur', arr_line_cur));
//
//  return ret;
//}

function moveCursor(state, delta){
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  //const len = page.get('items').size;
  const len = page.get('id_map').size;
  const line_cur = page.get('line_cur');

  let vv = line_cur + delta;
  if(vv < 0){
    vv = len - 1;
  }else if(vv >= len){
    vv =  0;
  }
  //console.log('moveCursor() <> vv: ' + vv + ', line_cur: ' + line_cur);

  return state.setIn(['pages', dir, 'line_cur'], vv);
}

function syncDir(state_mdf, state_ref){
  //console.log('syncDir');

  const dirs = state_mdf.get('dirs');
  //const dir_mdf = dirs.get(0);
  //const page_mdf = state_mdf.getIn(['pages', dir_mdf]);
  const pages_mdf = state_mdf.get('pages');
  const dir_ref = state_ref.getIn(['dirs', 0]);
  //const page_ref = state_ref.getIn(['pages', dir_ref]);
  const items_ref = state_ref.getIn(['pages', dir_ref, 'items']);
  let dirs_new;

  const idx_dir = getDirIndex( dirs, dir_ref );
  if( idx_dir !== -1 ){
    dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                        .unshift(dir_ref));
  }else{
    dirs_new = dirs.unshift(dir_ref);
  }

  const page_mdf_new = im.Map({
                               'items': items_ref,
                               'line_cur': 0,
                               'id_map': im.List(im.Range(0, items_ref.size)),
                               'selected_items': im.List.of()
                             });

  return state_mdf.withMutations(s => s.set('dirs', dirs_new)
                                       .set('pages', pages_mdf.set(dir_ref, page_mdf_new))
         );
}

/* Before */
//export const updateItemNameList = (state_fcd, id) => {
//  console.log('combined-item-list <> updateItemNameList()');
//  const state = state_fcd.state_core;
//
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
//
//  return updateItemNameListCore(dir_cur, items);
//}
//
//const updateItemNameListCore = (dir_cur, items) => {
//  let array = [];
//  //console.log('items: ' + items.get(3));
//  for(let i=0; i<items.size; i++){
//    array.push(items.getIn([i, 'name']));
//    //console.log('array[' + i + ']: ' + array[i]);
//  }
//  return array;
//}

//export const updateItemNameList = (state_core) => {
//  console.log('combined-item-list <> updateItemNameList()');
//  //const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  const dir_cur = state_core.getIn(['dirs', 0]);
//  const page = state_core.getIn(['pages', dir_cur]);
//  //const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
//  //const items = state.getIn(['arr_pages', id, 'items', dir_cur]);
//  const items = page.get('items');
//
//  return updateItemNameListCore(items);
//}
//
//const updateItemNameListCore = (items) => {
//  let array = [];
//  //console.log('items: ' + items.get(3));
//  for(let i=0; i<items.size; i++){
//    array.push(items.getIn([i, 'name']));
//    //console.log('array[' + i + ']: ' + array[i]);
//  }
//  return array;
//}

//const _getItemsWithMap = (pages) => {
//  const dir_cur = pages.get('dir_cur');
//  const items = pages.getIn(['id_maps', dir_cur]).map(
//                  (e, i) => {
//                    return pages.getIn(['items', dir_cur, e]);
//                  }
//                );
//  return items;
//}



const dispPopUp = (mode, params) => {
  const ret = ipcRenderer.sendSync('popup', mode, params);
  return;
}

const closeMainWindow = () => {
  const ret = ipcRenderer.sendSync('closeMainWindow');
  return;
}

/* Before */
//const toggleItemSelect = (state_fcd) => {
//  //return state_fcd;
//
//  //return Object.assign(
//  //  {},
//  //  state_fcd
//  //);
//
//  const state = state_fcd.state_core;
//  const active_pane_id = state_fcd.active_pane_id;
//  const dir_cur = state.getIn(['arr_pages', active_pane_id, 'dir_cur']);
//  //console.log('dir_cur: ' + dir_cur);
//  const item_list = state.getIn(['arr_pages', active_pane_id, 'pages', dir_cur]);
//  const line_cur = item_list.get('line_cur');
//
//  //console.log('line_cur: ' + line_cur);
//
//  //const item = item_list.get('items').find(
//  //  (e) => e.get('id') === line_cur
//  //);
//
//  //console.log('item_list.get(items): ', item_list.get('items'));
//  //console.log('item_list.getIn(items): ', item_list.getIn(['items', 0]));
//  const item = item_list.getIn(['items', line_cur]);
//  const item_new = item.set('selected', !item.get('selected'));
//  //console.log('selected new: ' + item_new.get('selected') + ', old: ' + item.get('selected'));
//
//  const item_match = item_list.getIn(['items_match', line_cur]);
//  const item_match_new = item_match.set('selected', !item_match.get('selected'));
//
//  //return state.setIn(['arr_pages', active_pane_id, dir_cur, 'items', line_cur], item_new);
//  //const item_check = state.getIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur]);
//  //console.log('item_check: ', item_check.get('selected'));
//  //const state_new = state.setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur], item_new);
//  //console.log('items: ', item_list.getIn(['items', line_cur]));
//  //console.log('item: ', item);
//  //console.log('line_cur: ' + line_cur);
//  //console.log('hoge');
//
////  const state_new = state.setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur], item_new);
//
//  const state_new = state.withMutations((s) => s.setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur], item_new)
//                                                .setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items_match', line_cur], item_match_new)
//                                       );
//
//  return Object.assign(
//    {},
//    state_fcd,
//    {
//      state_core: state_new
//    }
//  );
//
//}


const toggleItemSelect = (state) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const line_cur = page.get('line_cur');
  const items = page.get('items');
  const id_map = page.get('id_map');
  const id = id_map.get(line_cur);
  const item = items.get(id);
  const item_new = item.set('selected', !item.get('selected'));

  //const page_new = page.setIn(['items', id], item_new);
  return state.setIn(['pages', dir, 'items', id], item_new);
}

export default CombinedItemList;
