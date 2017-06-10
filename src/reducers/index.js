'use strict';

import fs from 'fs';
import im from 'immutable';
import { ipcRenderer } from 'electron'
import { changeDirUpper, changeDirLower, updatePageCur, changeDrive, getDirIndex } from '../util/item_list_pages';
import { KEY_INPUT_MODE, ITEM_TYPE_KIND } from '../util/item_type';

function rootReducer(state_fcd, action){
  //console.log('reducer <> state_fcd.input_mode: ', state_fcd.input_mode);
  //console.log('reducer <> state_fcd.state_core: ', state_fcd.state_core);

  const id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(id);

  switch(action.type){
    case 'MOVE_CURSOR_UP':
      {
        const state_core_new = state_fcd.state_core.set(id, moveCursor(state, -1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new
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
                   state_core: state_core_new
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
                 }
               );
      }
    case 'CHANGE_DIR_UPPER':
      {
        const state_new = changeDirUpper(state);
        const dir = state_new.getIn(['dirs', 0]);
        const page = state_new.getIn(['pages', dir]);
        const im_items = page.get('items');
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(id, state_new),
                 }
               );
      }
    case 'CHANGE_DIR_LOWER':
      {
        const state_new = changeDirLower(state);
        if(state === state_new){
          return state_fcd;
        }

        const dir = state_new.getIn(['dirs', 0]);
        const page = state_new.getIn(['pages', dir]);
        const im_items = page.get('items');
        return Object.assign(
                 {},
                 state_fcd,
                 { 
                   state_core: state_fcd.state_core.set(id, state_new),
                 }
               );
      }
    case 'SWITCH_ACTIVE_PANE':
      switch(id){
        case 0:
          return Object.assign(
                   {},
                   state_fcd,
                   { active_pane_id: 1 }
                 );
        case 1:
          return Object.assign(
                   {},
                   state_fcd,
                   { active_pane_id: 0 }
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
        return syncDirFcd(state_fcd, idx_cur, idx_other);
      }

    case 'SYNC_DIR_OTHER_TO_CUR':
      {
        //console.log('SYNC_DIR_OTHER_TO_CUR');
        const idx_cur = id;
        const idx_other = idx_cur === 1
                          ? 0
                          : 1;
        return syncDirFcd(state_fcd, idx_other, idx_cur);
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
                   state_core: state_fcd.state_core.set(id, state_new)
                 }
               );
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
        const state_core_new = state_fcd.state_core.set(id, moveCursor(state_tmp, -1));
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
        const state_core_new = state_fcd.state_core.set(id, moveCursor(state_tmp, 1));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_core_new
                 }
               );
      }
    case 'END_NARROW_DOWN_ITEMS':
      {
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
      {
        const dir = state.getIn(['dirs', 0]);
        const state_new = state.withMutations(s => s.set('msg_cmd', action.msg_cmd)
                                                    .setIn(['pages', dir, 'line_cur'], 0));
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new)
                 }
               );
      }
    case 'TEST_SEND_MSG':
      console.log('TEST_SEND_MSG');
      return state_fcd;
    case 'TEST_RECEIVE_MSG':
      console.log('TEST_RECEIVE_MSG <> ret_msg: ' + action.ret_msg);
      return state_fcd;
    default:
      return state_fcd;
  }

}


function moveCursor(state, delta){
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
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
  const items = page.get('items');
  const id_map = page.get('id_map');
  const id = id_map.get(line_cur);
  const item = items.get(id);
  const item_new = item.set('selected', !item.get('selected'));

  return state.setIn(['pages', dir, 'items', id], item_new);
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



const switchInputModeNarrowDownItems = (state, c) => {
  //console.log('switchInputModeNarrowDownItems() <> input_mode: ' + state.get('input_mode'));
  const msg = state.get('msg_cmd');
  if(msg.length > 0){
    return state;
  }else{
    return state.withMutations(s => s.set('msg_cmd', msg + c)
                                     .set('line_cur', 0));
  }
}

export default rootReducer;
