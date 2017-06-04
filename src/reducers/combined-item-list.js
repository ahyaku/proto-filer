'use strict';
import fs from 'fs';
import im from 'immutable';
import { ipcRenderer } from 'electron'
//import ItemListCore from '../core/item_list';
//import { KEY_INPUT_MODE } from '../core/item_type';
import { changeDirUpper, changeDirLower, updatePageCur, changeDrive } from '../util/item_list_pages';
import { KEY_INPUT_MODE, ITEM_TYPE_KIND } from '../util/item_type';


//function CombinedItemList(state, action){
function CombinedItemList(state_fcd, action){
  switch(action.type){
    case 'MOVE_CURSOR_UP':
      {
        return moveCursor(state_fcd, -1);
        //return moveCursor(state, -1);
      }
    case 'MOVE_CURSOR_DOWN':
      {
        return moveCursor(state_fcd, 1);
        //return moveCursor(state, 1);
      }
    case 'CHANGE_DRIVE':
      {
        const state = state_fcd.state_core;

        const idx = state_fcd.active_pane_id;
        const pages = changeDrive(state.getIn(['arr_pages', idx]), action.dlist);
        const dir_cur = pages.get('dir_cur');
        const im_items = pages.getIn(['pages', dir_cur, 'items']);
        const item_name_list = updateItemNameListCore(dir_cur, im_items);

        const items = im_items.toJS();

        const arr_items_prev = state_fcd.arr_items;
        const arr_items = [
          ...arr_items_prev.slice(0, idx),
          items,
          ...arr_items_prev.slice(idx+1)
        ];

        const state_core_new = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
                                                           .setIn(['arr_item_name_lists', idx], item_name_list)
                                                           .setIn(['arr_im_items', idx], im_items));

        const ret = Object.assign(
                      {},
                      state_fcd,
                      { 
                        state_core: state_core_new,
                        arr_items: arr_items
                      }
                    );

        //const ret = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
        //                                        .setIn(['arr_item_name_lists', idx], item_name_list)
        //                                        .setIn(['arr_im_items', idx], im_items)
        //                                        .setIn(['arr_items', idx], items));

        return ret;
      }
    case 'CHANGE_DIR_UPPER':
      {
        const state = state_fcd.state_core;
        const idx = state_fcd.active_pane_id;
        //const idx = state.get('active_pane_id');
        //const pages = state.getIn(['arr_pages', idx]).changeDirUpper();
        const pages = changeDirUpper(state.getIn(['arr_pages', idx]));

        const dir_cur = pages.get('dir_cur');
        //console.log('CHANGE_DIR_UPPER <> dir_cur: ' + dir_cur);
        const im_items = pages.getIn(['pages', dir_cur, 'items']);
        //console.log('items: ' + items);
        const item_name_list = updateItemNameListCore(dir_cur, im_items);

        const line_cur = pages.getIn(['pages', dir_cur, 'line_cur']);
        //console.log('CHANGE_DIR_UPPER <> line_cur: ' + line_cur);

        const items = im_items.toJS();

        const arr_line_cur_prev = state_fcd.arr_line_cur;
        //const arr_line_cur_prev = state.arr_line_cur;
        const arr_line_cur = [
          ...arr_line_cur_prev.slice(0, idx),
          line_cur,
          ...arr_line_cur_prev.slice(idx+1),
        ];

        const arr_items_prev = state_fcd.arr_items;
        const arr_items = [
          ...arr_items_prev.slice(0, idx),
          items,
          ...arr_items_prev.slice(idx+1)
        ];

        const state_core_new = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
                                                           .setIn(['arr_item_name_lists', idx], item_name_list)
                                                           .setIn(['arr_im_items', idx], im_items));

        const ret = Object.assign(
                      {},
                      state_fcd,
                      { 
                        state_core: state_core_new,
                        arr_line_cur: arr_line_cur,
                        arr_items: arr_items
                      }
                    );

        //const arr_line_cur_prev = state.get('arr_line_cur');
        //const arr_line_cur = [
        //  ...arr_line_cur_prev.slice(0, idx),
        //  line_cur,
        //  ...arr_line_cur_prev.slice(idx+1),
        //];
        //
        //const ret = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
        //                                        .setIn(['arr_item_name_lists', idx], item_name_list)
        //                                        .set('arr_line_cur', arr_line_cur)
        //                                        .setIn(['arr_im_items', idx], im_items)
        //                                        .setIn(['arr_items', idx], items));

        return ret;
      }
    case 'CHANGE_DIR_LOWER':
      {
        const state = state_fcd.state_core;
        const idx = state_fcd.active_pane_id;
        //const idx = state.get('active_pane_id');
        //const pages = state.getIn(['arr_pages', idx]).changeDirLower();

        const pages_old = state.getIn(['arr_pages', idx]);
        const pages = changeDirLower(pages_old);
        if(pages === pages_old){
          return state_fcd;
        }

        const dir_cur = pages.get('dir_cur');
        //console.log('CHANGE_DIR_LOWER <> dir_cur: ' + dir_cur);
        const im_items = pages.getIn(['pages', dir_cur, 'items']);
        //console.log('items: ' + items);
        const item_name_list = updateItemNameListCore(dir_cur, im_items);

        const line_cur = pages.getIn(['pages', dir_cur, 'line_cur']);

        const items = im_items.toJS();

        const arr_line_cur_prev = state_fcd.arr_line_cur;
        //const arr_line_cur_prev = state.get('arr_line_cur');

        const arr_line_cur = [
          ...arr_line_cur_prev.slice(0, idx),
          line_cur,
          ...arr_line_cur_prev.slice(idx+1),
        ];

        const arr_items_prev = state_fcd.arr_items;
        const arr_items = [
          ...arr_items_prev.slice(0, idx),
          items,
          ...arr_items_prev.slice(idx+1)
        ];
        
        const state_core_new = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
                                                           .setIn(['arr_item_name_lists', idx], item_name_list)
                                                           .setIn(['arr_im_items', idx], im_items));

        const ret = Object.assign(
                      {},
                      state_fcd,
                      {
                        state_core: state_core_new,
                        arr_line_cur: arr_line_cur,
                        arr_items: arr_items
                      }
                    );


        //const arr_line_cur_prev = state.get('arr_line_cur');
        //const arr_line_cur = [
        //  ...arr_line_cur_prev.slice(0, idx),
        //  line_cur,
        //  ...arr_line_cur_prev.slice(idx+1),
        //];
        //
        //const ret = state.withMutations((s) => s.setIn(['arr_pages', idx], pages)
        //                                        .setIn(['arr_item_name_lists', idx], item_name_list)
        //                                        .set('arr_line_cur', arr_line_cur)
        //                                        .setIn(['arr_im_items', idx], im_items)
        //                                        .setIn(['arr_items', idx], items));

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
        console.log('SYNC_DIR_CUR_TO_OTHER');
        const idx_cur = state_fcd.active_pane_id;
        //const state = state_fcd.state_core;
        //const idx_cur = state.get('active_pane_id');
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        return syncDir(state_fcd, idx_cur, idx_other);
        //return syncDir(state, idx_cur, idx_other);
      }

    case 'SYNC_DIR_OTHER_TO_CUR':
      {
        console.log('SYNC_DIR_OTHER_TO_CUR');
        const idx_cur = state_fcd.active_pane_id;
        //const state = state_fcd.state_core;
        //const idx_cur = state.get('active_pane_id');
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        return syncDir(state_fcd, idx_other, idx_cur);
        //return syncDir(state, idx_other, idx_cur);
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
        const state_fcd_tmp = toggleItemSelect(state_fcd)
        return moveCursor( state_fcd_tmp, -1);
      }
    case 'TOGGLE_ITEM_SELECT_DOWN':
      {
        const state_fcd_tmp = toggleItemSelect(state_fcd)
        return moveCursor( state_fcd_tmp, 1);
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

function moveCursor(state_fcd, delta){
  const state = state_fcd.state_core;
  const idx = state_fcd.active_pane_id;
  //const idx = state.get('active_pane_id');
  const dir_cur = state.getIn(['arr_pages', idx, 'dir_cur']);
  const len = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'items_match']).count();

  const line_cur = state.getIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur']);

  const item_list = state.getIn(['arr_pages', idx, 'pages', dir_cur]);
  const item = item_list.getIn(['items', line_cur]);

  let vv = line_cur + delta;
  if(vv < 0){
    //console.log('are');
    vv = len - 1;
  }else if(vv >= len){
    //console.log('you');
    vv =  0;
  }

  //console.log('line_cur: ' + line_cur + ', vv: ' + vv);
  //console.log('org arr_line_cur[' + idx + ']: ' + state.get('arr_line_cur')[idx]);

  const arr_line_cur_prev = state_fcd.arr_line_cur;
  //const arr_line_cur_prev = state.get('arr_line_cur');

  const arr_line_cur = [
    ...arr_line_cur_prev.slice(0, idx),
    vv,
    ...arr_line_cur_prev.slice(idx+1),
  ];

  const state_core_new = state.setIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur'], vv);
  const ret = Object.assign(
                {},
                state_fcd,
                { 
                  state_core: state_core_new,
                  arr_line_cur: arr_line_cur
                }
              );
  

  //const ret = state.withMutations((s) => s.setIn(['arr_pages', idx, 'pages', dir_cur, 'line_cur'], vv)
  //                                        .set('arr_line_cur', arr_line_cur));

  return ret;
}

//function syncDir(state, idx_mdf, idx_ref){
function syncDir(state_fcd, idx_mdf, idx_ref){
  console.log('syncDir');
  const state = state_fcd.state_core;

  const dir_ref = state.getIn(['arr_pages', idx_ref, 'dir_cur']);
  //console.log('idx_other: ' + idx_other);
  //console.log('dir_other: ' + dir_other);
  //const pages = state.getIn(['arr_pages', idx_mdf]).updatePageCur(dir_ref);
  const pages = updatePageCur(state.getIn(['arr_pages', idx_mdf]), dir_ref, true);
  //const ret = state.setIn(['arr_pages', idx_src], arr_pages);

  const im_items = pages.getIn(['pages', dir_ref, 'items']);
  //console.log('items: ' + items);
  const item_name_list = updateItemNameListCore(dir_ref, im_items);

  const items = im_items.toJS();

  const arr_items_prev = state_fcd.arr_items;
  const arr_items = [
                      ...arr_items_prev.slice(0, idx_mdf),
                      items,
                      ...arr_items_prev.slice(idx_mdf+1)
                    ];
  const arr_line_prev = state_fcd.arr_line_cur;
  const arr_line_cur = [
                         ...arr_line_prev.slice(0, idx_mdf),
                         0,
                         ...arr_line_prev.slice(idx_mdf+1)
                       ];
  const state_core_new = state.withMutations((s) => s.setIn(['arr_pages', idx_mdf], pages)
                                                     .setIn(['arr_item_name_lists', idx_mdf], item_name_list)
                                                     .setIn(['arr_im_items', idx_mdf], im_items));
  const ret = Object.assign(
                {},
                state_fcd,
                { 
                  state_core: state_core_new,
                  arr_items: arr_items,
                  arr_line_cur: arr_line_cur
                },
              );

  //const ret = state.withMutations((s) => s.setIn(['arr_pages', idx_mdf], pages)
  //                                        .setIn(['arr_item_name_lists', idx_mdf], item_name_list)
  //                                        .setIn(['arr_im_items', idx_mdf], im_items)
  //                                        .setIn(['arr_items', idx_mdf], items));

  return ret;
}

//export const updateItemNameList = (state, id) => {
export const updateItemNameList = (state_fcd, id) => {
  const state = state_fcd.state_core;

  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);

  return updateItemNameListCore(dir_cur, items);
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

const dispPopUp = (mode, params) => {
  const ret = ipcRenderer.sendSync('popup', mode, params);
  return;
}

const closeMainWindow = () => {
  const ret = ipcRenderer.sendSync('closeMainWindow');
  return;
}

const toggleItemSelect = (state_fcd) => {
  //return state_fcd;

  //return Object.assign(
  //  {},
  //  state_fcd
  //);

  const state = state_fcd.state_core;
  const active_pane_id = state_fcd.active_pane_id;
  const dir_cur = state.getIn(['arr_pages', active_pane_id, 'dir_cur']);
  //console.log('dir_cur: ' + dir_cur);
  const item_list = state.getIn(['arr_pages', active_pane_id, 'pages', dir_cur]);
  const line_cur = item_list.get('line_cur');

  //console.log('line_cur: ' + line_cur);

  //const item = item_list.get('items').find(
  //  (e) => e.get('id') === line_cur
  //);

  //console.log('item_list.get(items): ', item_list.get('items'));
  //console.log('item_list.getIn(items): ', item_list.getIn(['items', 0]));
  const item = item_list.getIn(['items', line_cur]);
  const item_new = item.set('selected', !item.get('selected'));
  //console.log('selected new: ' + item_new.get('selected') + ', old: ' + item.get('selected'));

  const item_match = item_list.getIn(['items_match', line_cur]);
  const item_match_new = item_match.set('selected', !item_match.get('selected'));

  //return state.setIn(['arr_pages', active_pane_id, dir_cur, 'items', line_cur], item_new);
  //const item_check = state.getIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur]);
  //console.log('item_check: ', item_check.get('selected'));
  //const state_new = state.setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur], item_new);
  //console.log('items: ', item_list.getIn(['items', line_cur]));
  //console.log('item: ', item);
  //console.log('line_cur: ' + line_cur);
  //console.log('hoge');

//  const state_new = state.setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur], item_new);

  const state_new = state.withMutations((s) => s.setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items', line_cur], item_new)
                                                .setIn(['arr_pages', active_pane_id, 'pages', dir_cur, 'items_match', line_cur], item_match_new)
                                       );

  return Object.assign(
    {},
    state_fcd,
    {
      state_core: state_new
    }
  );

}

export default CombinedItemList;
