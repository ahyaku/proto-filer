'use strict';

import fs from 'fs';
import im from 'immutable';
import { ipcRenderer } from 'electron'
import { changeDirUpper, changeDirLower, updatePageCur, changeDrive, getDirIndex } from '../util/item_list_pages';
import { KEY_INPUT_MODE, ITEM_TYPE_KIND, SORT_TYPE } from '../util/item_type';

const rootReducer = (state_fcd, action) => {
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
    case 'WILL_DISP_POPUP_FOR_SORT_ITEM_LIST':
      {
        return Object.assign(
                 {},
                 state_fcd,
                 { input_mode: KEY_INPUT_MODE.POPUP }
               );
      }
    case 'DISP_POPUP_FOR_SORT_ITEM_LIST':
      {
        //console.log('DISP_POPUP_FOR_SORT_ITEM_LIST <> left: ' + action.left + ', top: ' + action.top);
        dispPopUp('sort', {left: action.left, top: action.top});
        return state_fcd;

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
        //const dir = state.getIn(['dirs', 0]);
        //const state_new = state.withMutations(s => s.set('msg_cmd', action.msg_cmd)
        //                                            .setIn(['pages', dir, 'line_cur'], 0));

        const state_new = sortItemList(state, action.sort_type);
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   state_core: state_fcd.state_core.set(id, state_new),
                   input_mode: KEY_INPUT_MODE.NORMAL
                 }
               );
      }
    case 'CLOSE_POPUP_FOR_SORT_ITEM_LIST':
      {
        return Object.assign(
                 {},
                 state_fcd,
                 {
                   input_mode: KEY_INPUT_MODE.NORMAL
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

const sortItemList = (state, sort_type) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const id_map = page.get('id_map');
  const items = page.get('items');
  let id_map_new;

  //console.log('Before <> id_map: ' + id_map);
  switch(sort_type){
    //case 'name_asc':
    case SORT_TYPE.NAME_ASC:
      //id_map_new = sortByName(items, id_map, true);
      id_map_new = sort(items, id_map, filterName, true);
      break;
    //case 'name_des':
    case SORT_TYPE.NAME_DES:
      //id_map_new = sortByName(items, id_map, false);
      id_map_new = sort(items, id_map, filterName, false);
      break;
    case SORT_TYPE.TIME_ASC:
      //id_map_new = sortByName(items, id_map, true);
      id_map_new = sort(items, id_map, filterTime, true);
      break;
    //case 'name_des':
    case SORT_TYPE.TIME_DES:
      //id_map_new = sortByName(items, id_map, false);
      id_map_new = sort(items, id_map, filterTime, false);
      break;
    case SORT_TYPE.EXT_ASC:
      //id_map_new = sortByName(items, id_map, true);
      id_map_new = sort(items, id_map, filterExt, true);
      break;
    //case 'name_des':
    case SORT_TYPE.EXT_DES:
      //id_map_new = sortByName(items, id_map, false);
      id_map_new = sort(items, id_map, filterExt, false);
      break;
    case SORT_TYPE.SIZE_ASC:
      //id_map_new = sortByName(items, id_map, true);
      id_map_new = sort(items, id_map, filterSize, true);
      break;
    //case 'name_des':
    case SORT_TYPE.SIZE_DES:
      //id_map_new = sortByName(items, id_map, false);
      id_map_new = sort(items, id_map, filterSize, false);
      break;
    case SORT_TYPE.CANCEL:
      id_map_new = id_map;
      break;
    default:
      /* Do Nothing.. */
      console.log('Sort Error!!');
      break;
  }
  //console.log('After <> id_map: ' + id_map_new);

  //console.log('sortItemList() <> id_map: ' + id_map);

  return state.setIn(['pages', dir, 'id_map'], id_map_new);
}

const sort = (items, id_map, filter, is_asc) => {
  const id_head = id_map.get(0);
  const id_tail = id_map.get(id_map.size - 1);

  const coef = is_asc === true
               ? 1
               : -1;

  let id_parent;
  let id_map_sort;

  /* Parent Directory '..' always must be the head or tail of the item list. */
  if( items.getIn([id_head, 'basename']) === '..'){
    id_map_sort = id_map.slice(1, id_map.size);
    id_parent = id_head;
  }else if( items.getIn([id_tail, 'basename']) === '..' ){
    id_map_sort = id_map.slice(0, id_map.size - 1);
    id_parent = id_tail;
  }else{
    id_map_sort = id_map;
    id_parent = -1;
  }

  //const id_map_sorted = id_map_sort.sort(
  //  (a, b) => {
  //    return coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']));
  //  });

  const id_map_sorted = filter(items, id_map_sort, coef);

  if(id_parent === -1){
    return id_map_sorted;
  }else{
    if(is_asc === true){
      return id_map_sorted.unshift(id_parent);
    }else if(is_asc === false){
      return id_map_sorted.push(id_parent);
    }else{
      console.log('Sort Error!!');
    }
  }
}

const filterName = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      return coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']));
    });
}

const filterTime = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      const ret_date = coef * items.getIn([a, 'date']).localeCompare(items.getIn([b, 'date']));
      const ret_time = ret_date === 0
                         ? coef * items.getIn([a, 'time']).localeCompare(items.getIn([b, 'time']))
                         : ret_date;
      const ret = ret_time === 0
                    ? coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
                    : ret_time;
      return ret;
    });
}

const filterSize = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      const sa = items.getIn([a, 'fsize'])
      const sb = items.getIn([b, 'fsize'])

      if( (typeof sa === 'string') && (typeof sb === 'string') ){
        if( ( (sa === 'DIR') && (sb === 'DIR') ) ||
            ( (sa === '???') && (sb === '???') ) ){
          return coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
        }else if( sa === 'DIR' ){
          return -coef;
        }else if( sb === 'DIR' ){
          return coef;
        }else{
          console.log('filterSize Error!!');
        }
      }else if( typeof sa === 'string' ){
        return -coef;
      }else if( typeof sb === 'string' ){
        return coef;
      }else{
        return sa === sb
                  ? coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
                  : sa < sb
                       ? -coef
                       : coef
      }
    });
}

const filterExt = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      //return coef * items.getIn([a, 'ext']).localeCompare(items.getIn([b, 'ext']));
      const ret_size = coef * items.getIn([a, 'ext']).localeCompare(items.getIn([b, 'ext']));
      const ret = ret_size === 0
                  ? coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
                  : ret_size;
      return ret;
    });
}

const moveCursor = (state, delta) => {
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
  const id_map = page.get('id_map');
  const id = id_map.get(line_cur);

  const is_selected = page.get('is_selected');
  const is_selected_new = is_selected.set(id, !is_selected.get(id));

  return state.setIn(['pages', dir, 'is_selected'], is_selected_new);
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

  const is_selected = im.List(im.Range(0, items_ref.size))
                        .map((e, i) => {
                          return false;
                        });

  const page_mdf_new = im.Map({
                               'items': items_ref,
                               'line_cur': 0,
                               'id_map': im.List(im.Range(0, items_ref.size)),
                               'is_selected': is_selected
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
