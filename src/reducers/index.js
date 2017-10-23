'use strict';

import fs from 'fs';
import im from 'immutable';
import path from 'path';
import { ipcRenderer } from 'electron'
import { changeDirUpper, changeDirLower, updatePageCur, changeDrive, getDirIndex, showBookmark, showHistory, loadPage } from '../util/item_list_pages';
import { KEY_INPUT_MODE, ITEM_TYPE_KIND /*, SORT_TYPE */ } from '../util/item_type';
import { sortItemsInState, sortItemsInPage } from '../util/item_list';
import { initAsItem } from '../util/item';

const rootReducer = (state_fcd, action) => {
  //console.log('reducer <> state_fcd.input_mode: ', state_fcd.input_mode);
  //console.log('reducer <> state_fcd.state_core: ', state_fcd.state_core);

  const id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(id);

  //console.log('reducer <> action_type: ' + action.type);
  switch(action.type){
    case 'OPEN_ITEM':
      {
        return openItem(state_fcd, action.type);
      }
    case 'MOVE_CURSOR_UP':
      {
        const state_core_new = state_fcd.state_core.set(id, moveCursor(state, -1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new,
                   action_type: action.type
                 }
               );
      }
    case 'MOVE_CURSOR_DOWN':
      {
        const state_core_new = state_fcd.state_core.set(id, moveCursor(state, 1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new,
                   action_type: action.type
                 }
               );
      }
    case 'MOVE_CURSOR_TO_HEAD':
      {
        const state_core_new = state_fcd.state_core.set(id, moveCursorToHead(state));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new,
                   action_type: action.type
                 }
               );
      }
    case 'MOVE_CURSOR_TO_TAIL':
      {
        const state_core_new = state_fcd.state_core.set(id, moveCursorToTail(state));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new,
                   action_type: action.type
                 }
               );
      }
    case 'PAGE_UP':
    case 'PAGE_DOWN':
    case 'MOVE_CURSOR_TO_TOP':
    case 'MOVE_CURSOR_TO_BOTTOM':
      {
        //console.log('reducer <> PAGE_DOWN_START');
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   action_type: action.type
                 }
               );
      }
    case 'UPDATE_FOR_PAGE_UP':
    case 'UPDATE_FOR_PAGE_DOWN':
    case 'UPDATE_FOR_MOVE_CURSOR_TO_TOP':
    case 'UPDATE_FOR_MOVE_CURSOR_TO_BOTTOM':
      {
        const state_new = moveCursorToIndex(state, action.line_new);
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
    case 'OPEN_BOOKMARK':
      /* ORG */
      {
        const state_new = showBookmark(state, action.dlist);
        const dir = state_new.getIn(['dirs', 0]);
        const im_items = state_new.getIn(['pages', dir, 'items']);
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
      /* MDF */
      //{
      //  return Object.assign(
      //           {},
      //           state_fcd,
      //           { 
      //             pages_sc: showBookmark(state_fcd.pages_sc),
      //             action_type: action.type
      //           }
      //         );
      //}
    case 'OPEN_HISTORY':
      {
        const state_new = showHistory(state);
        const dir = state_new.getIn(['dirs', 0]);
        const im_items = state_new.getIn(['pages', dir, 'items']);
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
    case 'CHANGE_DRIVE':
      {
        const state_new = changeDrive(state, action.dlist);
        const dir = state_new.getIn(['dirs', 0]);
        const im_items = state_new.getIn(['pages', dir, 'items']);
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
    case 'CHANGE_DIR_UPPER':
      /* ORG */
      //{
      //  const state_new = changeDirUpper(state);
      //  const dir = state_new.getIn(['dirs', 0]);
      //  return Object.assign(
      //           {},
      //           state_fcd,
      //           { 
      //             state_core: state_fcd.state_core.set(id, state_new),
      //           }
      //         );
      //}

      /* MDF */
      {
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(action.id, action.state_new),
                   action_type: action.type
                 }
               );
      }
    case 'CHANGE_DIR_LOWER':
      /* ORG */
      //{
      //  const state_new = changeDirLower(state);
      //  if(state === state_new){
      //    return state_fcd;
      //  }

      //  const dir = state_new.getIn(['dirs', 0]);
      //  const page = state_new.getIn(['pages', dir]);
      //  const im_items = page.get('items');
      //  return Object.assign(
      //           {},
      //           state_fcd,
      //           { 
      //             state_core: state_fcd.state_core.set(id, state_new),
      //           }
      //         );
      //}

      /* MDF */
      {
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(action.id, action.state_new),
                   action_type: action.type
                 }
               );
      }
    case 'SWITCH_ACTIVE_PANE':
      switch(id){
        case 0:
          return Object.assign(
                   {},
                   state_fcd,
                   { 
                     active_pane_id: 1,
                     action_type: action.type
                   }
                 );
        case 1:
          return Object.assign(
                   {},
                   state_fcd,
                   { 
                     active_pane_id: 0,
                     action_type: action.type
                   }
                 );
        default:
          /* Do Nothing.. */
          console.log('ERROR!! Incorrect Value \'active_pane_id\'!!');
          return state_fcd;
      }

    case 'SYNC_DIR_CUR_TO_OTHER':
      {
        //console.log('SYNC_DIR_CUR_TO_OTHER');
        const idx_cur = id;
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        return syncDirFcd(state_fcd, idx_cur, idx_other, action.type);
      }

    case 'SYNC_DIR_OTHER_TO_CUR':
      {
        //console.log('SYNC_DIR_OTHER_TO_CUR');
        const idx_cur = id;
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        return syncDirFcd(state_fcd, idx_other, idx_cur, action.type);
      }

    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      {
        const state_new = switchInputModeNarrowDownItems(state, action.key);
        //console.log('SWITCH_INPUT <> msg: ' + state_new.get('msg_cmd'));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   input_mode: KEY_INPUT_MODE.SEARCH,
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_MSG':
      {
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   input_mode: KEY_INPUT_MODE.NORMAL,
                   action_type: action.type
                 }
               );
      }
    case 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR':
      {
        const dir = state.getIn(['dirs', 0]);
        const items = state.getIn(['pages', dir, 'items']);
        const id_map = im.List(im.Range(0, items.size));
        const page = state.getIn(['pages', dir])
                          .withMutations(s => s.set('id_map', id_map)
                                               .set('id_map_nrw', id_map));
        const sort_type = state.get('sort_type');
        const page_new = sortItemsInPage(page, sort_type);
        const state_new = state.withMutations(s => s.set('msg_cmd', '')
                                                    .setIn(['pages', dir], page_new));

        //console.log('SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR <> id_map.size: ' + id_map.size);
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(id, state_new),
                   input_mode: KEY_INPUT_MODE.NORMAL,
                   action_type: action.type
                 }
               );
      }
    case 'DISP_POPUP_FOR_QUIT':
      {
        dispPopUp('quit', null);
        //return state_fcd;
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   action_type: action.type
                 }
               );
      }
    case 'CLOSE_MAIN_WINDOW':
      {
        closeMainWindow();
        //return state_fcd;
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   action_type: action.type
                 }
               );
      }
    case 'TOGGLE_ITEM_SELECT_UP':
      {
        const state_tmp = toggleItemSelect(state);
        const state_core_new = state_fcd.state_core.set(id, moveCursor(state_tmp, -1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new,
                   action_type: action.type
                 }
               );
      }
    case 'TOGGLE_ITEM_SELECT_DOWN':
      {
        const state_tmp = toggleItemSelect(state);
        const state_core_new = state_fcd.state_core.set(id, moveCursor(state_tmp, 1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new,
                   action_type: action.type
                 }
               );
      }
    case 'END_NARROW_DOWN_ITEMS':
      {
        const dir_cur = state.getIn(['dirs', 0]);
        const items = state.getIn(['pages', dir_cur, 'items']);
        const id_map_nrw = state.getIn(['pages', dir_cur, 'id_map'])
                                .filter((e) => {
                                   return action.is_matched[e];
                                 });
        const is_matched = im.List(im.Range(0, items.size))
                             .map( (e, i) => {
                                return action.is_matched[i];
                              });
        const page = state.getIn(['pages', dir_cur])
                          .withMutations(s => s.set('id_map_nrw', id_map_nrw)
                                               .set('is_matched', is_matched));
        const sort_type = state.get('sort_type');
        const page_new = sortItemsInPage(page, sort_type);
        const state_new = state.setIn(['pages', dir_cur], page_new);
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
    case 'UPDATE_PANE_CMD':
      //console.log('UPDATE_PANE_CMD');
      {
        const dir = state.getIn(['dirs', 0]);
        const state_new = state.withMutations(s => s.set('msg_cmd', action.msg_cmd)
                                                    .setIn(['pages', dir, 'line_cur'], 0));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
    case 'WILL_DISP_POPUP_FOR_SORT_ITEM_LIST':
      {
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   input_mode: KEY_INPUT_MODE.POPUP_SORT,
                   action_type: action.type
                 }
               );
      }
    case 'DISP_POPUP_FOR_SORT_ITEM_LIST':
      {
        //console.log('DISP_POPUP_FOR_SORT_ITEM_LIST <> left: ' + action.left + ', top: ' + action.top);
        dispPopUp('sort', {left: action.left, top: action.top});
        //return state_fcd;
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   action_type: action.type
                 }
               );
      }
    //case 'CLOSE_POPUP_FOR_SORT_ITEM_LIST':
    //  {
    //    return Object.assign(
    //             {},
    //             state_fcd,
    //             { input_mode: KEY_INPUT_MODE.NORMAL }
    //           );
    //  }
    case 'SORT_ITEM_LIST':
      {
        const state_new = sortItemsInState(state, action.sort_type);
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new),
                   input_mode: KEY_INPUT_MODE.NORMAL,
                   action_type: action.type
                 }
               );
      }
    case 'WILL_DISP_POPUP_FOR_RENAME_ITEM':
      {
        //console.log('WILL_DISP_POPUP_FOR_RENAME_ITEM');
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   input_mode: KEY_INPUT_MODE.POPUP_RENAME,
                   action_type: action.type
                 }
               );
      }
    case 'DISP_POPUP_FOR_RENAME_ITEM':
      {
        //console.log('DISP_POPUP_FOR_RENAME_ITEM');
        dispPopUp('rename', 
                  {
                    left: action.left,
                    top: action.top,
                    item_name: action.item_name,
                    dir_cur: action.dir_cur,
                    id_target: action.id_target
                  });
        //return state_fcd;
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   action_type: action.type
                 }
               );

      }
    case 'RENAME_ITEM':
      {
        const item_new = initAsItem(action.id_target, action.item_name_mdf, action.dir_cur);
        const item = state.getIn(['pages', action.dir_cur, 'items', action.id_target, 'name']);
        //console.log('RENAME_ITEM <> name(new): ' + item_new.get('name'));
        const state_new = state.setIn(['pages', action.dir_cur, 'items', action.id_target], item_new);

        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new),
                   input_mode: KEY_INPUT_MODE.NORMAL,
                   action_type: action.type
                 }
               );
      }
    case 'IS_CLOSED_POPUP':
      {
        if(state_fcd.input_mode === KEY_INPUT_MODE.POPUP_RENAME){
          console.log('reducer <> IS_CLOSED_POPUP input_mode: POPUP_RENAME');
        }

        return Object.assign(
                 {},
                 state_fcd,
                 {
                   input_mode: KEY_INPUT_MODE.NORMAL,
                   action_type: action.type
                 }
               );
      }
    case 'COPY_ITEMS':
      {
        return handleItems(state_fcd, 'copy', action.type);
      }
    case 'MOVE_ITEMS':
      {
        return handleItems(state_fcd, 'move', action.type);
      }
    case 'DELETE_ITEMS':
      {
        return deleteItems(state_fcd, action.type);
      }
    case 'DIR_CUR_IS_UPDATED':
      {
        const id = action.id;
        const state = state_fcd.state_core.get(id);

        const dir_cur = state.getIn(['dirs', 0]);
        //console.log('DIR_CUR_IS_UPDATED <> dir_cur: ', dir_cur);

        const state_tmp = loadPage(state, dir_cur, state.getIn(['pages', dir_cur, 'line_cur']));
        const sort_type = state_tmp.get('sort_type');
        const page_tmp = state_tmp.getIn(['pages', state_tmp.getIn(['dirs', 0])]);
        const page_new = sortItemsInPage(page_tmp, sort_type);
        const state_new = state_tmp.setIn(['pages', dir_cur], page_new);

        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new),
                   action_type: action.type
                 }
               );
      }
    //case 'IS_CHANGED_MAIN_WINDOW_SIZE':
    //  {
    //    return Object.assign(
    //             {},
    //             state_fcd,
    //             {
    //               action_type: action.type
    //             }
    //           );

    //  }
    //case 'UPDATE_INFO_PANE_HEIGHT':
    //  {
    //    const win_ctxt = state_fcd.win_ctxt;
    //    const win_ctxt_new = win_ctxt.set('height_win', action.height_win);
    //    return Object.assign(
    //             {},
    //             state_fcd,
    //             {
    //               action_type: action.type,
    //               win_ctxt: win_ctxt_new
    //             }
    //           );
    //  }
    //case 'IS_DRAG_END':
    //  {
    //    console.log('IS_DRAG_END!!');
    //    return state_fcd;
    //  }
    case 'TEST_SEND_MSG':
      console.log('TEST_SEND_MSG');
      return state_fcd;
    case 'TEST_RECEIVE_MSG':
      console.log('TEST_RECEIVE_MSG <> ret_msg: ' + action.ret_msg);
      return state_fcd;
    default:
      //return state_fcd;
      return Object.assign(
               {},
               state_fcd,
               {
                 action_type: ''
               }
             );
  }

}

const handleItems = (state_fcd, operation, action_type) => {
  const id_cur = state_fcd.active_pane_id;
  const id_other = (id_cur + 1) % 2;
  //console.log('id_cur: ' + id_cur + ', id_other: ' + id_other);
  const state_core = state_fcd.state_core;
  const state_cur = state_core.get(id_cur);
  const state_other = state_core.get(id_other);

  

  const path_cur = state_cur.getIn(['dirs', 0]);
  const path_other = state_other.getIn(['dirs', 0]);

  //console.log('path_cur: ' + path_cur);
  const pages_cur = state_cur.getIn(['pages', path_cur]);
  const ids_selected = pages_cur.get('is_selected');
  //console.log('ids_selected: ' + ids_selected);
  const items = pages_cur.get('items');

  let names_selected = [];
  //console.log('size: ' + ids_selected.size);
  for(let i=0; i<ids_selected.size; i++){
    if(ids_selected.get(i) === true){
      names_selected.push(items.getIn([i, 'name']));
    }
  }
  //console.log('names_selected: ', names_selected);

  const ret = ipcRenderer.sendSync(operation, path_other, path_cur, names_selected);

  const state_core_new = state_core.withMutations(s => s.set(id_cur, updatePage(state_cur))
                                                        .set(id_other, updatePage(state_other)));
  return Object.assign(
    {},
    state_fcd,
    {
      state_core: state_core_new,
      action_type: action_type
    }
  );
}

const deleteItems = (state_fcd, action_type) => {
  const id_cur = state_fcd.active_pane_id;
  //console.log('id_cur: ' + id_cur + ', id_other: ' + id_other);
  const state_core = state_fcd.state_core;
  const state_cur = state_core.get(id_cur);
  const path_cur = state_cur.getIn(['dirs', 0]);

  //console.log('path_cur: ' + path_cur);
  const pages_cur = state_cur.getIn(['pages', path_cur]);
  const ids_selected = pages_cur.get('is_selected');
  //console.log('ids_selected: ' + ids_selected);
  const items = pages_cur.get('items');

  let names_selected = [];
  //console.log('size: ' + ids_selected.size);
  for(let i=0; i<ids_selected.size; i++){
    if(ids_selected.get(i) === true){
      names_selected.push(items.getIn([i, 'name']));
    }
  }
  //console.log('names_selected: ', names_selected);

  const ret = ipcRenderer.sendSync('trash', path_cur, names_selected);

  const state_core_new = state_core.set(id_cur, updatePage(state_cur));
                                                        
  return Object.assign(
    {},
    state_fcd,
    {
      state_core: state_core_new,
      action_type: action_type
    }
  );
}

const openItem = (state_fcd, action_type) => {
  const id_cur = state_fcd.active_pane_id;
  const state_core = state_fcd.state_core;
  const state_cur = state_core.get(id_cur);
  const path_cur = state_cur.getIn(['dirs', 0]);

  const page_cur = state_cur.getIn(['pages', path_cur]);
  const line_cur = page_cur.get('line_cur');
  const id_map_nrw = page_cur.get('id_map_nrw');
  const item_name = page_cur.getIn(['items', id_map_nrw.get(line_cur), 'name']);
  console.log('item_name: ' + item_name);

  let item_names = [];
  item_names.push(item_name);

  //const ids_selected = page_cur.get('is_selected');
  //const items = page_cur.get('items');
  //let names_selected = [];
  //for(let i=0; i<ids_selected.size; i++){
  //  if(ids_selected.get(i) === true){
  //    names_selected.push(items.getIn([i, 'name']));
  //  }
  //}

  const ret = ipcRenderer.sendSync('open_item', path_cur, item_names);
  //return state_fcd;
  return Object.assign(
           {},
           state_fcd,
           {
             action_type: action_type
           }
         );
}

const updatePage = (state) => {
  //console.log('HERE!!');
  const dir = state.getIn(['dirs', 0]); 
  //console.log('dir: ' + dir);
  return updatePageCur(state, dir, false);

}

const moveCursor = (state, delta) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const len = page.get('id_map_nrw').size;
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

const moveCursorToIndex = (state, index) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const len = page.get('id_map_nrw').size;
  const line_cur = page.get('line_cur');

  const vv = index < 0
               ? 0
               : index < len
                   ? index
                   : len - 1;

  //console.log('moveCursorToIndex <> line_cur: ' + line_cur + ', index: ' + index);
  return state.setIn(['pages', dir, 'line_cur'], vv);
}

const moveCursorToHead = (state) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  return state.setIn(['pages', dir, 'line_cur'], 0);
}

const moveCursorToTail = (state) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const len = page.get('id_map_nrw').size;
  return state.setIn(['pages', dir, 'line_cur'], len - 1);
}

const dispPopUp = (mode, params) => {
  const ret = ipcRenderer.sendSync('popup', mode, params);
  return;
}

const closeMainWindow = () => {
  const ret = ipcRenderer.sendSync('closeMainWindow');
  return;
}

const toggleItemSelect = (state) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const line_cur = page.get('line_cur');
  const id_map_nrw = page.get('id_map_nrw');
  const id = id_map_nrw.get(line_cur);
  const items = page.get('items');

  if(items.getIn([id, 'name']) === '..'){
    return state;
  }else{
    const is_selected = page.get('is_selected');
    const is_selected_new = is_selected.set(id, !is_selected.get(id));

    return state.setIn(['pages', dir, 'is_selected'], is_selected_new);
  }
}

const syncDirFcd = (state_fcd, idx_mdf, idx_ref) => {
  const state_mdf = state_fcd.state_core.get(idx_mdf);
  const state_ref = state_fcd.state_core.get(idx_ref);
  const state_new = syncDir(state_mdf, state_ref);

  const dir = state_new.getIn(['dirs', 0]);
  //console.log('SYNC_DIR <> dir_new: ' + dir);
  const page = state_new.getIn(['pages', dir]);
  //console.log('SYNC_DIR <> page.getIn(items, 1, name): ' + page.getIn(['items', 1, 'name']));
  const im_items = page.get('items');

  const ret = Object.assign(
                {},
                state_fcd,
                { 
                  state_core: state_fcd.state_core.set(idx_mdf, state_new),
                }
              );

  return ret;
}

const syncDir = (state_mdf, state_ref) => {
  //console.log('syncDir');

  const dirs = state_mdf.get('dirs');
  const pages_mdf = state_mdf.get('pages');
  const dir_ref = state_ref.getIn(['dirs', 0]);
  const items_ref = state_ref.getIn(['pages', dir_ref, 'items']);
  let dirs_new;

  const idx_dir = getDirIndex( dirs, dir_ref );
  if( idx_dir !== -1 ){
    dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                        .unshift(dir_ref));
  }else{
    dirs_new = dirs.unshift(dir_ref);
  }

  const is_matched = im.List(im.Range(0, items_ref.size))
                        .map((e, i) => {
                          return true;
                        });

  const is_selected = im.List(im.Range(0, items_ref.size))
                        .map((e, i) => {
                          return false;
                        });

  const id_map = im.List(im.Range(0, items_ref.size));
  const page_mdf_new = im.Map({
                               'items': items_ref,
                               'line_cur': 0,
                               'id_map': id_map,
                               'id_map_nrw': id_map,
                               'is_matched': is_matched,
                               'is_selected': is_selected
                             });

  return state_mdf.withMutations(s => s.set('dirs', dirs_new)
                                       .set('pages', pages_mdf.set(dir_ref, page_mdf_new))
         );
}



const switchInputModeNarrowDownItems = (state, c) => {
  const msg = state.get('msg_cmd');
  if(msg.length > 0){
    return state;
  }else{
    return state.set('msg_cmd', msg + c);
  }
}

export default rootReducer;
