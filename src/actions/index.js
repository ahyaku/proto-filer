'use strict';

import { ipcRenderer, remote } from 'electron';
import im from 'immutable';
import cp from 'child_process';
import chokidar from 'chokidar';
import path from 'path';
import { KEY_INPUT_MODE } from '../util/item_type';
import { changeDirUpper, changeDirLower } from '../util/item_list_pages';
import { ITEM_TYPE_KIND } from '../util/item_type';

const PATH_ICON_ROOT = path.resolve(remote.app.getAppPath(), 'assets/icons');
const PATH_ICON_FOLDER = path.resolve(PATH_ICON_ROOT, 'icon_0101_1033.ico');
const PATH_ICON_BIN = path.resolve(PATH_ICON_ROOT, 'icon_0077_1033.ico');

export const updateItemList = (id) => ({
  type: 'UPDATE_ITEM_LIST',
  id
});

/* ORG */
export const checkKeyNormal = (state_fcd, e) => {
  return _checkKeyNormal(state_fcd, e);
}

/* MDF */
//export const checkKeyNormal = (state_fcd, e, key_str) => {
//  return _checkKeyNormal(state_fcd, e, key_str);
//}

export const _checkKeyNormal = (state_fcd, e) => {
//export const _checkKeyNormal = (state_fcd, e, key_str) => {
  //console.log(util.format('pane_left: %d, pane_right: %d',
  //                        pane_left.is_focused,
  //                        pane_right.is_focused));

  //console.log('checkKeyNormal <> e.key: ' + e.key + ', e.keyCode: ' + e.keyCode + ', shift: ' + event.shiftKey);

  //console.log('_checkKeyNormal <> key_str: ' + key_str);

  switch(e.key){
    case 'Enter':
      return {
        type: 'OPEN_ITEM'
      };
    case 'f': /* 'f' */
      event.preventDefault();
      if(event.ctrlKey === true){
        return {
          type: 'PAGE_DOWN'
        };
      }else{
        return {
          type: 'DO_NOTHING'
        };
      }
    case 'b': /* 'b' */
      event.preventDefault();
      if(event.ctrlKey == true){
        return {
          type: 'PAGE_UP'
        };
      }else{
        return {
          type: 'DO_NOTHING'
        };
      }
    case 'c': /* 'c' */
      return {
        type: 'COPY_ITEMS'
      }
    case 'j': /* 'j' */
      event.preventDefault();
      if(event.ctrlKey == true){
        //console.log('HERE!');
        return {
          type: 'OPEN_BOOKMARK'
        }
      }else{
        return {
          type: 'MOVE_CURSOR_DOWN'
        };
      }
    case 'k': /* 'k' */
      return {
        type: 'MOVE_CURSOR_UP'
      };
    case 'g': /* 'g' */
      return {
        type: 'MOVE_CURSOR_TO_HEAD'
      };
    case 'G': /* 'G' */
      return {
        type: 'MOVE_CURSOR_TO_TAIL'
      };
    case 'h': /* 'h' */
      event.preventDefault();
      if(event.ctrlKey){
        return {
          type: 'OPEN_HISTORY'
        };
      }else{
        return changeDir('CHANGE_DIR_UPPER');
      }
    case 'H': /* 'H' */
      return {
        type: 'MOVE_CURSOR_TO_TOP'
      };
    case 'l': /* 'l' */
      return changeDir('CHANGE_DIR_LOWER');
    case 'L': /* 'L' */
      return {
        type: 'MOVE_CURSOR_TO_BOTTOM'
      };
    case 'm': /* 'm' */
      return {
        type: 'MOVE_ITEMS'
      }
    case 'Tab': /* 'tab' */
      return {
        type: 'SWITCH_ACTIVE_PANE'
      };
    case ' ': /* 'space' */
      event.preventDefault();
      if(event.shiftKey == true){
        return {
          type: 'TOGGLE_ITEM_SELECT_UP'
        };
      }else{
        return {
          type: 'TOGGLE_ITEM_SELECT_DOWN'
        };
      }

    //  //if(event.shiftKey == true){
    //  //  this.toggleUp();
    //  //}else{
    //  //  this.toggleDown();
    //  //}
    //  //break;
    case 'o': /* 'o' */
      return {
        type: 'SYNC_DIR_CUR_TO_OTHER'
      };
    case 'O': /* 'O' */
      return {
        type: 'SYNC_DIR_OTHER_TO_CUR'
      };
    case 'd': /* 'd' */
      return {
        type: 'DELETE_ITEMS'
      };
    case 'q': /* 'q' */
      return {
        type: 'DISP_POPUP_FOR_QUIT'
        //type: 'CLOSE_MAIN_WINDOW'
      };
    //  //this.closeMainWindow();
    //  //break;           
    //case '.': /* ',' */
    //  //this.showContextMenu();
    //  //break;           
    //case 'Enter':
    //  console.log('HERE!!');
    //  //this.openItem();
    //  //break;           
    //  break;
    case '/': /* '/' */
      {
        return {
          type: 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS',
          key: e.key
        };
      }
    case 's': /* 's' */
    case 'S': /* 'S' */
      event.preventDefault();
      return {
        type: 'WILL_DISP_POPUP_FOR_SORT_ITEM_LIST'
      };
      //return {
      //  type: 'DISP_POPUP_FOR_SORT_ITEM_LIST'
      //}
    case 'r': /* 'r' */
      event.preventDefault();
      return {
        type: 'WILL_DISP_POPUP_FOR_RENAME_ITEM'
      };
    case 'n': /* 'n' */
      event.preventDefault();
      return {
        type: 'WILL_DISP_POPUP_FOR_CREATE_FILE'
      };
    case 'N': /* 'N' */
      event.preventDefault();
      return {
        type: 'WILL_DISP_POPUP_FOR_CREATE_DIR'
      };
    case 'e':
      return {
        type: 'DEBUG_COUNT_END'
      };
    case '\\':
      //console.log('\\');
      let ret = ipcRenderer.sendSync('get_disk_drive_list');
      //console.log('CHANGE_DRIVE <> ret: ', ret);
      return {
        type: 'CHANGE_DRIVE',
        dlist: ret
      };
    //case 'gg':
    //  console.log('gg');
    //  return {
    //    type: 'DO_NOTHING'
    //  };
    default:
      /* Do Nothing.. */
      return {
        type: 'DO_NOTHING'
      };
  }
}

//export const _checkKeyNormalwithCtrl = (state, e) => {
//  //console.log(util.format('pane_left: %d, pane_right: %d',
//  //                        pane_left.is_focused,
//  //                        pane_right.is_focused));
//
//  //console.log('checkKeyNormal <> e.key: ' + e.key);
//  switch(e.key){
//    case 'l': /* 'l' */
//      return {
//        type: 'MOVE_CURSOR_DOWN'
//      };
//    default:
//      /* Do Nothing.. */
//      return {
//        type: 'DO_NOTHING'
//      };
//  }
//}

export const checkKeySearch = (state_fcd, e) => (dispatch) => {
  //console.log('e.keyCode: ' + e.keyCode);
  if(event.ctrlKey == true){
    return dispatch(_checkKeySearchWithCtrl(state_fcd, e));
  }else{
    return dispatch(_checkKeySearch(state_fcd, e));
  }
}

//export const checkKeySearch = (state, e) => (dispatch) => {
//  //console.log('e.keyCode: ' + e.keyCode);
//  if(event.ctrlKey == true){
//    return dispatch(_checkKeySearchWithCtrl(state, e));
//  }else{
//    return dispatch(_checkKeySearch(state, e));
//  }
//}

//const _checkKeySearchWithCtrl = (state, e) => (dispatch) => {
const _checkKeySearchWithCtrl = (state_fcd, e) => (dispatch) => {

  switch(e.key){
    case 'Control':
      return dispatch(receiveInput(state_fcd, ''));
    case 'm':
      event.preventDefault();
      return dispatch(
        {
          type: 'SWITCH_INPUT_MODE_NORMAL_WITH_MSG',
          c: ''
        }
      );
    case '[':
      return dispatch(switchInputModeNormalWithClear());
    case 'h':
      return dispatch(receiveInputBS(state_fcd));
    case 'u':
      return dispatch(clearInput(state_fcd));
    case 's':
      console.log('HERE!!');
      return dispatch(TestSendMsg());

    default:
      return dispatch(receiveInput(state_fcd, e.key));
  }
}

const _checkKeySearch = (state_fcd, e) => (dispatch) => {

  //console.log('e.key: ' + e.key);
  switch(e.key){
    case 'Escape':
      return dispatch(
        {
          type: 'SWITCH_INPUT_MODE_NORMAL',
          //is_clear_cmd: true
        }
      );
    case 'Enter':
      return dispatch(
        {
          type: 'SWITCH_INPUT_MODE_NORMAL_WITH_MSG',
          c: ''
          //is_clear_cmd: false
        }
      );
    case '[':
      return dispatch(receiveInput(state_fcd, e.key));

    case 'Tab':
    case 'Shift':
    case 'Control':
    case 'Alt':
      /* Do Nothing.. */
      return dispatch(receiveInput(state_fcd, ''));

    case 'Backspace':
      return dispatch(receiveInputBS(state_fcd));

    default:
      event.preventDefault();
      return dispatch(receiveInput(state_fcd, e.key));
  }

}

const receiveInput = (state_fcd, c) => (dispatch) => {
  //console.log('receiveinput()!!');
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  const msg = state.get('msg_cmd') + c;
  return dispatch(updatePaneCmd(msg));
}

const receiveInputBS = (state_fcd) => (dispatch) => {
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  const msg = state.get('msg_cmd');
  return dispatch(updatePaneCmd(msg.slice(0, msg.length - 1)));
}

const clearInput = (state_fcd) => (dispatch) => {
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  const msg = state.get('msg_cmd');
  return dispatch(updatePaneCmd(msg.slice(0, 1)));
}

const updatePaneCmd = (msg) => {
  return {
    type: 'UPDATE_PANE_CMD',
    msg_cmd: msg
  }
}


///* ORG (START) @ 2017.02.26 */
//const receiveInput = (state, c) => (dispatch) => {
//  //console.log('receiveinput()!!');
//  const id = state.get('active_pane_id');
//  const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + c;
//  return dispatch(updatePaneCmd(state, id, msg));
//}
//
//const receiveInputBS = (state) => (dispatch) => {
//  const id = state.get('active_pane_id');
//  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
//  return dispatch(updatePaneCmd(state, id, msg.slice(0, msg.length - 1)));
//}
//
//const clearInput = (state) => (dispatch) => {
//  const id = state.get('active_pane_id');
//  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
//  return dispatch(updatePaneCmd(state, id, msg.slice(0, 1)));
//}
//
//const updatePaneCmd = (state, id, msg) => {
//  //console.log('updatePaneCmd()!!');
//  return {
//    type: 'UPDATE_PANE_CMD',
//    state: state.setIn(['arr_pages', id, 'msg_cmd'], msg)
//  }
//}
///* ORG (END) @ 2017.02.26 */

/* ToDo; Need to find better way to set callback only one time.. */
let is_initialized = false
export const NarrowDownItems = (state_fcd, id, msg) => (dispatch) => {
  //const state = state_fcd.state_core;
  const state = state_fcd.state_core.get(id);
  const dir = state.getIn(['dirs', 0]);

  if(is_initialized === false){
    ipcRenderer.on('narrow_down_items_cb', (event, is_matched, msg, input_mode) => {
      //console.log('NarrowDownItems() <> is_matched: ' + is_matched);
      //console.log('NarrowDownItems() <> is_matched.length: ' + is_matched.length);
      if(msg.length <= 0){
        dispatch(switchInputModeNormalWithClear());
      }else{
        dispatch({
          type: 'END_NARROW_DOWN_ITEMS',
          is_matched: is_matched,
          input_mode: input_mode
        });
      }
    });

    is_initialized = true;
  }

  //const item_names = state_fcd.arr_item_name_lists.get(id);

  //const item_names = state.get('item_names');
  //console.log('NarrowDownItems <> item_names: ', item_names);
  //console.log('NarrowDownItems <> item_names.length: ' + item_names.length);

  ipcRenderer.send('narrow_down_items', state.get('item_names'), msg);
  //ipcRenderer.send('narrow_down_items', state.get('name_list_left'), id, msg);

  return {
    type: 'START_NARROW_DOWN_ITEMS'
  }
}

////const startNarrowDownItems = (state, id, msg) => {
//const startNarrowDownItems = (state_fcd, id, msg) => {
//  //console.log('startNarrowDownItems()!!');
//  return {
//    type: 'START_NARROW_DOWN_ITEMS',
//    //state: state.setIn(['arr_pages', id, 'msg_cmd'], msg)
//  }
//}

//const endNarrowDownItems = (s) => {
//  return {
//    type: 'END_NARROW_DOWN_ITEMS',
//    state: s
//  }
//}

const switchInputModeNormalWithClear = () => {
  //console.log('switchInputModeNormalWithClear()');
  return {
    type: 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR',
    c: ''
  }
}

//const NarrowDownItemsCoreRet = (state, id, msg) => {
//  if(msg.length <= 0){
//    return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//                                     .set('input_mode', KEY_INPUT_MODE.NORMAL))
//  }
//
//  const pattern = msg.slice(1, msg.length);
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  let items;
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
//  //const arr_line_cur = Object.assign({}, state.get('arr_line_cur'), {id: 0});
//  const arr_line_cur_prv = state.get('arr_line_cur');
//  const arr_line_cur = [
//    ...arr_line_cur_prv.slice(0, id),
//    0,
//    ...arr_line_cur_prv.slice(id+1)
//  ];
//
//  return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0)
//                                   .set('arr_line_cur', arr_line_cur))
//
//}

//const NarrowDownItemsCore = (state, id, msg) => {
//  return new Promise(function(resolve, reject){
//  //return new Promise( (resolve, reject) => {
//    if(msg.length <= 0){
//      resolve(
//        state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//                                  .set('input_mode', KEY_INPUT_MODE.NORMAL))
//      );
//    }
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
//    //const arr_line_cur = Object.assign({}, state.get('arr_line_cur'), {id: 0});
//    const arr_line_cur_prv = state.get('arr_line_cur');
//    const arr_line_cur = [
//      ...arr_line_cur_prv.slice(0, id),
//      0,
//      ...arr_line_cur_prv.slice(id+1)
//    ];
//
//    resolve(
//      state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0)
//                                .set('arr_line_cur', arr_line_cur))
//    );
//  });
//}

const changeDir = (type) => (dispatch, getState) => {
  const state_fcd = getState();
  const id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(id);

  let state_new = null;
  switch(type){
    case 'CHANGE_DIR_UPPER':
      state_new = changeDirUpper(state);
      break;
    case 'CHANGE_DIR_LOWER':
      state_new = changeDirLower(state);
      break;
  }

  if(state === state_new){
    return dispatch({
      type: type,
      state_new: state,
      id: id
    });
  }

  {
    dirWatcher_close(state_new.get('dir_watcher'));
    const dir_watcher = dirWatcher(state_new.getIn(['dirs', 0]));
    dispatch(dirWatcher_initialize(dir_watcher, id));
    dispatch({
      type: type,
      state_new: state_new.set('dir_watcher', dir_watcher),
      id: id
    });
  }

  dispatch(renderIcon(id));
}

export const dirWatcher = (dir_target) => {
  //console.log('createDirWatcher() <> dir_target: ' + dir_target);
  const watcher = chokidar.watch(dir_target,
                                 {
                                   ignoreInitial: true,
                                   depth: 0
                                 });

  return im.Map({
           watcher: watcher,
           is_active: true
         });
}

const INTERVAL_WATCH = 1000;
export const dirWatcher_initialize = (dir_watcher, id) => {
  let timer = null;

  return (dispatch, getState) => {
    const watcher = dir_watcher.get('watcher');

    /* Do not use 'all' because it leads to 'unlinkdir' of 'C:/' when dir_cur is changed to 'C:/'
     * Not sure the reason why..
     *
     */
    //watcher.on('all', (event, item_path) => {
    //  console.log('watcher: ', event, item_path);
    watcher.on('raw', (event, item_path, details) => {

      if(timer !== null){
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        //console.log('watcher: ', event, item_path, details + ', id: ' + id);
        //console.log('watchedPath List: ', watcher.getWatched());

        //const state = getState().state_core.get(id);
        //const is_active = state.getIn(['dir_watcher', 'is_active']);
        //console.log('watcher is active? [1] : ' + is_active);

        timer = null;
        dispatch({
          type: 'DIR_CUR_IS_UPDATED',
          id: id
        });
        //console.log('dir_cur: ' + dir_cur + ', getWatched: ', watcher.getWatched());
      },
      INTERVAL_WATCH);

    });

    //console.log('dir_cur: ' + dir_cur + ', getWatched: ', watcher.getWatched());
  }
}

export const dirWatcher_setActivationMode = (dir_watcher, mode) => {
  if(dir_watcher === null){
    console.log('ERROR!! @dirWatcher_setActivationMode()');
    return null;
  }
  if( (mode !== true)  ||
      (mode !== false) ){
    console.log('ERROR!! @dirWatcher_setActivationMode()');
    return null;
  }
  return dir_watcher.set('is_active', mode);
}

export const dirWatcher_close = (dir_watcher) => {
  if(dir_watcher === null){
    console.log('ERROR!! @dirWatcher_close()');
    return;
  }
  dir_watcher.get('watcher').close();
}

export const renderIcon = (id) => {

  return (dispatch, getState) => {
    const state_fcd = getState();
    const state = state_fcd.state_core.get(id);
    const dir = state.getIn(['dirs', 0]);
    const page = state.getIn(['pages', dir]);
    const items = page.get('items');

    switch(process.platform){
      case 'win32':
        /* remove 1st element as the parent directory '..' */
        getIconsWin32(dispatch, id, dir, im.List.of(null), items.shift());
        break;
      default:
        /* remove 1st element as the parent directory '..' */
        getIcons(dispatch, id, dir, im.List.of(null), items.shift());
        break;
    }

  }

}

/* 
 * Workaround for Windows OS environment.
 * electron's getFileIcon() API seems not to work correctly for folders and binary files. */
const getIconsWin32 = (dispatch, id, dir, icons, items) => {

  const _getIcons = (_icons, _items) => {

    if(_items.size > 0){

      let path_icon;
      switch(_items.getIn([0, 'kind'])){
        case ITEM_TYPE_KIND.DIR:
          path_icon = PATH_ICON_FOLDER;
          break;
        case ITEM_TYPE_KIND.BIN:
          path_icon = PATH_ICON_BIN;
          break;
        default:
          path_icon = path.resolve(path.join(dir, _items.getIn([0, 'name'])));
          break;
      }

      remote.app.getFileIcon(path_icon, {size: 'small'}, function (err, icon) {
        if(err !== null){
          console.log('ERROR!! @getFileIcon: ', err);
        }
        _getIcons(_icons.push(icon), _items.shift());
      });

    }else{
      //console.log('dispatch RENDER_ICON <> icons.size: ' + icons.size + ', dir: ' + dir);
      dispatch({
        type: 'RENDER_ICON',
        icons: _icons,
        id: id
      });
    }

  }

  /* remove 1st element as the parent directory '..' */
  _getIcons(icons, items);

}

const getIcons = (dispatch, id, dir, icons, items) => {

  const _getIcons = (_icons, _items) => {

    if(_items.size > 0){
      const name = _items.getIn([0, 'name']);

      /* ORG */
      remote.app.getFileIcon(path.resolve(path.join(dir, name)), {size: 'small'}, function (err, icon) {
        if(err !== null){
          console.log('ERROR!! @getFileIcon: ', err);
        }
        _getIcons(_icons.push(icon), _items.shift());
      });

      /* MDF */
      //if( _items.getIn([0, 'ext']) === '' ){
      //  _getIcons(_icons.push(null), _items.shift());
      //}else{
      //  app.getFileIcon(path.resolve(path.join(dir, name)), {size: 'small'}, function (err, icon) {
      //    _getIcons(_icons.push(icon), _items.shift());
      //  });
      //}

    }else{
      //console.log('dispatch RENDER_ICON <> icons.size: ' + icons.size + ', dir: ' + dir);
      dispatch({
        type: 'RENDER_ICON',
        icons: _icons,
        id: id
      });
    }

  }

  /* remove 1st element as the parent directory '..' */
  _getIcons(icons, items);

}




const TestSendMsg = () => (dispatch) => {
  console.log('TestSendMsg');

  ipcRenderer.once('test_message_reply', (event, ret_msg) => {
    //console.log('ret_msg: ' + ret_msg);
    dispatch({
      type: 'TEST_RECEIVE_MSG',
      ret_msg: ret_msg
    });
  });

  ipcRenderer.send('test_message', 'Here it!!');
  //ipcRenderer.send('test_message', 'Here it!!', 'hoge');
  return dispatch({
    type: 'TEST_SEND_MSG'
  });
}

