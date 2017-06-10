'use strict';

import { ipcRenderer } from 'electron';
import cp from 'child_process';
import { KEY_INPUT_MODE } from '../util/item_type';

import im from 'immutable';

export const updateItemList = (id) => ({
  type: 'UPDATE_ITEM_LIST',
  id
});

export const checkKeyNormal = (state_fcd, e) => {
  return _checkKeyNormal(state_fcd, e);
}

export const _checkKeyNormal = (state_fcd, e) => {
  //console.log(util.format('pane_left: %d, pane_right: %d',
  //                        pane_left.is_focused,
  //                        pane_right.is_focused));

  //console.log('checkKeyNormal <> e.key: ' + e.key);

  switch(e.key){
    case 'j': /* 'j' */
      //this.cursorDown();
      //break;
      return {
        type: 'MOVE_CURSOR_DOWN'
      };
    case 'k': /* 'k' */
      //this.cursorUp();
      //break;
      return {
        type: 'MOVE_CURSOR_UP'
      };
    case 'h': /* 'h' */
      //this.changeDirUpper();
      //break;
      return {
        type: 'CHANGE_DIR_UPPER'
      };
    case 'l': /* 'l' */
      //if(event.ctrlKey == true){
      //  this.updatePane();
      //}else{
      //  this.changeDirLower();
      //}
      //break;
      return {
        type: 'CHANGE_DIR_LOWER'
      };
    case 'Tab': /* 'tab' */
      //this.switchPane();
      //break;
      return {
        type: 'SWITCH_ACTIVE_PANE'
      };
    case ' ': /* 'space' */
      event.preventDefault();
      if(event.shiftKey == true){
        return {
          type: 'TOGGLE_ITEM_SELECT_UP'
        }
      }else{
        return {
          type: 'TOGGLE_ITEM_SELECT_DOWN'
        }
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
    //case 'c': /* 'c' */
    //  //this.copyItems();
    //  //break;           
    //case 'd': /* 'd' */
    //  //this.deleteItems();
    //  //break;           
    //case 'm': /* 'm' */
    //  //break;           
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
        const active_pane_id = state_fcd.active_pane_id;
        const state = state_fcd.state_core.get(active_pane_id);
        const state_new = switchInputModeNarrowDownItems(state, e.key);
        //console.log('SWITCH_INPUT <> msg: ' + state_new.get('msg_cmd'));
        const state_fcd_new = Object.assign(
                                {},
                                state_fcd,
                                {
                                  input_mode: KEY_INPUT_MODE.SEARCH,
                                  state_core: state_fcd.state_core.set(active_pane_id, state_new)
                                }
                              );
        return {
          type: 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS',
          state: state_fcd_new
        };
      }
    case 's':
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
    default:
      /* Do Nothing.. */
      //break;
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

function switchInputModeNarrowDownItems(state, c){
  //console.log('switchInputModeNarrowDownItems() <> input_mode: ' + state.get('input_mode'));
  const msg = state.get('msg_cmd');
  if(msg.length > 0){
    return state;
  }else{
    return state.withMutations(s => s.set('msg_cmd', msg + c)
                                     .set('line_cur', 0));
  }
}


const receiveInput = (state_fcd, c) => (dispatch) => {
  //console.log('receiveinput()!!');
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  const msg = state.get('msg_cmd') + c;
  return dispatch(updatePaneCmd(state_fcd, active_pane_id, msg));
}

const receiveInputBS = (state_fcd) => (dispatch) => {
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  const msg = state.get('msg_cmd');
  return dispatch(updatePaneCmd(state_fcd, active_pane_id, msg.slice(0, msg.length - 1)));
}

const clearInput = (state_fcd) => (dispatch) => {
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  const msg = state.get('msg_cmd');
  return dispatch(updatePaneCmd(state_fcd, active_pane_id, msg.slice(0, 1)));
}

const updatePaneCmd = (state_fcd, id, msg) => {
  //console.log('updatePaneCmd()!!');
  const active_pane_id = state_fcd.active_pane_id;
  const state = state_fcd.state_core.get(active_pane_id);
  const dir = state.getIn(['dirs', 0]);
  const state_new = state.withMutations(s => s.set('msg_cmd', msg)
                                              .setIn(['pages', dir, 'line_cur'], 0));
  const state_fcd_new = Object.assign(
                          {},
                          state_fcd,
                          {
                            state_core: state_fcd.state_core.set(active_pane_id, state_new)
                          }
                        );


  return {
    type: 'UPDATE_PANE_CMD',
    state: state_fcd_new
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


/* Before */
/* ToDo; Need to find better way to set callback only one time.. */
//let is_initialized = false
//export const NarrowDownItems = (state_fcd, id, msg) => (dispatch) => {
//  const state = state_fcd.state_core;
//
//  if(is_initialized === false){
//    ipcRenderer.on('narrow_down_items_cb', (event, ids, msg, input_mode) => {
//      //console.log('ids: ' + ids);
//      //console.log('NarrowDownItems() <> ids.length: ' + ids.length);
//      if(msg.length <= 0){
//        dispatch(switchInputModeNormalWithClear());
//      }else{
//        dispatch({
//          type: 'END_NARROW_DOWN_ITEMS',
//          ids: ids,
//          //msg_cmd: msg,
//          input_mode: input_mode
//        });
//      }
//    });
//    is_initialized = true;
//  }
//
//  const item_names = state.getIn(['arr_item_name_lists', id]);
//  //console.log('item_names.length: ' + item_names.length);
//
//  ipcRenderer.send('narrow_down_items', state.getIn(['arr_item_name_lists', id]), id, msg);
//  //ipcRenderer.send('narrow_down_items', state.get('name_list_left'), id, msg);
//
//  return {
//    type: 'START_NARROW_DOWN_ITEMS'
//  }
//}

/* ToDo; Need to find better way to set callback only one time.. */
let is_initialized = false
export const NarrowDownItems = (state_fcd, id, msg) => (dispatch) => {
  //const state = state_fcd.state_core;
  const state = state_fcd.state_core.get(id);

  if(is_initialized === false){
    ipcRenderer.on('narrow_down_items_cb', (event, ids, msg, input_mode) => {
      //console.log('NarrowDownItems() <> ids: ' + ids);
      //console.log('NarrowDownItems() <> ids.length: ' + ids.length);
      if(msg.length <= 0){
        dispatch(switchInputModeNormalWithClear());
      }else{
        dispatch({
          type: 'END_NARROW_DOWN_ITEMS',
          ids: ids,
          input_mode: input_mode
        });
      }
    });
    is_initialized = true;
  }

  //const item_names = state_fcd.arr_item_name_lists.get(id);

  const item_names = state.get('item_names');
  //console.log('NarrowDownItems <> item_names: ', item_names);
  //console.log('NarrowDownItems <> item_names.length: ' + item_names.length);

  ipcRenderer.send('narrow_down_items', item_names, id, msg);
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

