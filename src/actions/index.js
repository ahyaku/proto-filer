'use strict';

import { ipcRenderer } from 'electron';
import cp from 'child_process';
import { KEY_INPUT_MODE } from '../core/item_type';

import im from 'immutable';

//export const updateItemList = (item_list) => ({
//  type: 'UPDATE_ITEM_LIST',
//  item_list
//});

export const updateItemList = (id) => ({
  type: 'UPDATE_ITEM_LIST',
  id
});

//export const checkKeyNormal = (dispatch, state, e) => {
export const checkKeyNormal = (state, e) => {
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
    //case 'Space': /* 'space' */
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
    //case 'q': /* 'q' */
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
      return {
        type: 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS',
        //state: state
        state: switchInputModeNarrowDownItems(state, e.key)
      };
      //return {
      //  type: 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS',
      //  c: e.key
      //};
    case 's':
    case 'e':
      return {
        type: 'DEBUG_COUNT_END'
      };
    default:
      /* Do Nothing.. */
      //break;
      return {
        type: 'DO_NOTHING'
      };
  }
}

export const checkKeySearch = (state, e) => (dispatch) => {
  //console.log('e.keyCode: ' + e.keyCode);
  if(event.ctrlKey == true){
    //return _checkKeySearchWithCtrl(e, state);
    return dispatch(_checkKeySearchWithCtrl(state, e));
  }else{
    //return _checkKeySearch(e, state);
    return dispatch(_checkKeySearch(state, e));
  }

}

const _checkKeySearchWithCtrl = (state, e) => (dispatch) => {
  switch(e.key){
    case 'Control':
      //return {
      //  type: 'RECEIVE_INPUT',
      //  //state: receiveInput(state, '')
      //  //state: dispatch(receiveInput(state, ''))
      //  //state: receiveInput(dispatch, state, '')
      //  state: dispatch(receiveInput(dispatch, state, ''))
      //};

      //console.log('HERE!!');
      //dispatch({
      //  type: 'RECEIVE_INPUT',
      //  state: state
      //});
      //return dispatch(receiveInput(dispatch, state, e.key));
      //return receiveInput(dispatch, state, e.key);

      return dispatch(receiveInput(state, ''));
      //return dispatch(receiveInput(state, '')).then((s) => {
      //  dispatch({
      //    type: 'END_NARROW_DOWN_ITEMS',
      //    state: s
      //  });
      //});

      //return receiveInput(dispatch, state, '');

      //return dispatch(receiveInput(dispatch, state, e.key)).then(() => {
      //  console.log('DONE!!');
      //});

      //return {
      //  type: 'RECEIVE_INPUT',
      //  c: ''
      //};
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
      //return {
      //  //type: 'RECEIVE_INPUT_BS',
      //  type: 'RECEIVE_INPUT',
      //  //state: receiveInputBS(state)
      //  state: receiveInputBS(dispatch, state)
      //};

      return dispatch(receiveInputBS(state));
      //return receiveInputBS(dispatch, state);

      //return {
      //  type: 'RECEIVE_INPUT_BS',
      //  c: ''
      //};
    case 'u':
      //return {
      //  //type: 'CLEAR_INPUT',
      //  type: 'RECEIVE_INPUT',
      //  //state: clearInput(state)
      //  state: clearInput(dispatch, state)
      //};

      return dispatch(clearInput(state));
      //return clearInput(dispatch, state);

      //return {
      //  type: 'CLEAR_INPUT',
      //  c: ''
      //};

    case 's':
      console.log('HERE!!');
      return dispatch(TestSendMsg());

    default:
      /* Add input character to msg_cmd. */
      //return {
      //  type: 'RECEIVE_INPUT',
      //  //state: receiveInput(state, e.key)
      //  //state: dispatch(receiveInput(dispatch, state, e.key))
      //  //state: receiveInput(dispatch, state, e.key)
      //  state: dispatch(receiveInput(dispatch, state, e.key))
      //};


      //console.log('HERE!!');
      //dispatch({
      //  type: 'RECEIVE_INPUT',
      //  state: state
      //});

      return dispatch(receiveInput(state, e.key));
      //return dispatch(receiveInput(state, e.key)).then((s) => {
      //  dispatch({
      //    type: 'END_NARROW_DOWN_ITEMS',
      //    state: s
      //  });
      //});

      //return receiveInput(dispatch, state, e.key);

      //return dispatch(receiveInput(dispatch, state, e.key)).then(() => {
      //  console.log('DONE!!');
      //});

      //return {
      //  type: 'RECEIVE_INPUT',
      //  c: e.key,
      //  event: event
      //};
  }
}

const _checkKeySearch = (state, e) => (dispatch) => {
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
      //return {
      //  type: 'RECEIVE_INPUT',
      //  //state: receiveInput(state, e.key)
      //  //state: dispatch(receiveInput(state, e.key))
      //  //state: receiveInput(dispatch, state, e.key)
      //  state: dispatch(receiveInput(dispatch, state, e.key))
      //};

      //console.log('HERE!!');
      //dispatch({
      //  type: 'RECEIVE_INPUT',
      //  state: state
      //});

      return dispatch(receiveInput(state, e.key));
      //return dispatch(receiveInput(state, e.key)).then((s) => {
      //  dispatch({
      //    type: 'END_NARROW_DOWN_ITEMS',
      //    state: s
      //  });
      //});

      //return receiveInput(dispatch, state, e.key);

      //return dispatch(receiveInput(dispatch, state, e.key)).then(() => {
      //  console.log('DONE!!');
      //});



      //return {
      //  type: 'RECEIVE_INPUT',
      //  c: e.key
      //};
    case 'Tab':
    case 'Shift':
    case 'Control':
    case 'Alt':
      /* Do Nothing.. */
      //return {
      //  type: 'RECEIVE_INPUT',
      //  //state: receiveInput(state, '')
      //  //state: dispatch(receiveInput(state, ''))
      //  //state: receiveInput(dispatch, state, '')
      //  state: dispatch(receiveInput(dispatch, state, ''))
      //};

      //console.log('HERE!!');
      //dispatch({
      //  type: 'RECEIVE_INPUT',
      //  state: state
      //});

      return dispatch(receiveInput(state, ''));
      //return dispatch(receiveInput(state, '')).then((s) => {
      //  dispatch({
      //    type: 'END_NARROW_DOWN_ITEMS',
      //    state: s
      //  });
      //});

      //return receiveInput(dispatch, state, '');

      //return dispatch(receiveInput(dispatch, state, e.key)).then(() => {
      //  console.log('DONE!!');
      //});



      //return {
      //  type: 'RECEIVE_INPUT',
      //  c: '',
      //  event: event
      //};
    case 'Backspace':
      //return {
      //  //type: 'RECEIVE_INPUT_BS',
      //  type: 'RECEIVE_INPUT',
      //  //state: receiveInputBS(state)
      //  state: receiveInputBS(dispatch, state)
      //};

      return dispatch(receiveInputBS(state));
      //return receiveInputBS(dispatch, state);

      //return {
      //  type: 'RECEIVE_INPUT_BS',
      //  c: ''
      //};
    default:
      event.preventDefault();
      /* Add input character to msg_cmd. */
      //return {
      //  type: 'RECEIVE_INPUT',
      //  //state: receiveInput(state, e.key)
      //  //state: dispatch(receiveInput(state, e.key))
      //  //state: receiveInput(dispatch, state, e.key)
      //  state: dispatch(receiveInput(dispatch, state, e.key))
      //};
      
      //console.log('HERE!!');

      //dispatch({
      //  type: 'RECEIVE_INPUT',
      //  state: state
      //});

      return dispatch(receiveInput(state, e.key));
      //return dispatch(receiveInput(state, e.key)).then((s) => {
      //  dispatch({
      //    type: 'END_NARROW_DOWN_ITEMS',
      //    state: s
      //  });
      //});

      //return receiveInput(dispatch, state, e.key);

      //return dispatch(receiveInput(dispatch, state, e.key)).then(() => {
      //  console.log('DONE!!');
      //});

      //return {
      //  type: 'RECEIVE_INPUT',
      //  c: e.key,
      //  event: event
      //};
  }
}


function switchInputModeNarrowDownItems(state, c){
  //console.log('switchInputModeNarrowDownItems() <> input_mode: ' + state.get('input_mode'));

  const id = state.get('active_pane_id');
  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
  //const state_new = state.set('input_mode', KEY_INPUT_MODE.SEARCH);
  if(msg.length > 0){
    //return state_new;
    return state.set('input_mode', KEY_INPUT_MODE.SEARCH);

  }else{
    //console.log('msg.length == 0');
    const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + c;

    //return NarrowDownItems(state_new, id, msg);

    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
    return state.withMutations(s => s.set('input_mode', KEY_INPUT_MODE.SEARCH)
                                     .setIn(['arr_pages', id, 'msg_cmd'], msg)
                                     .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
                                     .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));
  }
}

/* ORG @ 2017.01.08 */
//function switchInputModeNarrowDownItems(state, c){
//  //console.log('switchInputModeNarrowDownItems() <> input_mode: ' + state.get('input_mode'));
//
//  const id = state.get('active_pane_id');
//  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
//  //const state_new = state.set('input_mode', KEY_INPUT_MODE.SEARCH);
//  if(msg.length > 0){
//    //return state_new;
//    return state.set('input_mode', KEY_INPUT_MODE.SEARCH);
//
//  }else{
//    //console.log('msg.length == 0');
//    const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + c;
//
//    //return NarrowDownItems(state_new, id, msg);
//
//    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//    const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
//    return state.withMutations(s => s.set('input_mode', KEY_INPUT_MODE.SEARCH)
//                                     .setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                     .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                     .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));
//  }
//}

//const receiveInput = (state, c) => (dispatch) => {
//  const id = state.get('active_pane_id');
//  const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + c;
//  dispatch(updatePaneCmd(state, id, msg));
//  dispatch(startNarrowDownItems(state, id, msg));
//
//  return new Promise(function(resolve, reject){
//    resolve(
//      NarrowDownItemsCoreRet(state, id, msg)
//    );
//  });
//}

//const receiveInput = (state, c) => (dispatch) => {
//  const id = state.get('active_pane_id');
//  const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + c;
//  dispatch(NarrowDownItems(state, id, msg));
//  return dispatch(updatePaneCmd(state, id, msg));
//}

const receiveInput = (state, c) => (dispatch) => {
  //console.log('receiveinput()!!');
  const id = state.get('active_pane_id');
  const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + c;
  return dispatch(updatePaneCmd(state, id, msg));
}

const receiveInputBS = (state) => (dispatch) => {
  const id = state.get('active_pane_id');
  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
  return dispatch(updatePaneCmd(state, id, msg.slice(0, msg.length - 1)));
}

const clearInput = (state) => (dispatch) => {
  const id = state.get('active_pane_id');
  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
  return dispatch(updatePaneCmd(state, id, msg.slice(0, 1)));
}

const updatePaneCmd = (state, id, msg) => {
  //console.log('updatePaneCmd()!!');
  return {
    type: 'UPDATE_PANE_CMD',
    state: state.setIn(['arr_pages', id, 'msg_cmd'], msg)
  }
}


//const c = cp.fork('./proc-narrow-items.js');
//
//const NarrowDownItems = (state, id, msg) => (dispatch) => {
//  //console.log('NarrowDownItems() !!');
//
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  console.log('NarrowDownItems <> dir_cur: ' + dir_cur);
//  //console.log('state: ' + state);
//
//  c.on('narrow_down_items', () => {
//    dispatch({
//      type: 'END_NARROW_DOWN_ITEMS',
//      state: state
//    });
//  });
//
//  console.log('HERE??');
//  c.send({
//    hello: 'world'
//  });
//
//  return dispatch(updatePaneCmd(state, id, msg));
//
//}

//const NarrowDownItems = (state, id, msg) => (dispatch) => {
//  //console.log('NarrowDownItems() !!');
//
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  console.log('NarrowDownItems <> dir_cur: ' + dir_cur);
//  //console.log('state: ' + state);
//
//  c.on('narrow_down_items', (state) => {
//    dispatch({
//      type: 'END_NARROW_DOWN_ITEMS',
//      state: state
//    });
//  });
//
//  c.send({
//    state: state,
//    id: id,
//    msg: msg
//  });
//
//  return dispatch(updatePaneCmd(state, id, msg));
//
//}

/* TEST @ 2017.01.07 */
//const NarrowDownItems = (state, id, msg) => (dispatch) => {
//  //console.log('NarrowDownItems() !!');
//
//  //const state_tmp = state;
//  //ipcRenderer.once('narrow_down_items_cb', (event, ss) => {
//  //  //const ss = im.fromJS(state_ret);
//  //  console.log('narrow_down_items_cb');
//  //  dispatch({
//  //    type: 'END_NARROW_DOWN_ITEMS',
//  //    state: state
//  //    //state: im.fromJS(state_ret)
//  //  });
//  //});
//
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  //console.log('NarrowDownItems <> dir_cur: ' + dir_cur);
//  //console.log('state: ' + state);
//
//  const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
//  //console.log('items: ' + items);
//
//  /* toJS() conversion is slow.. */
//  ipcRenderer.send('narrow_down_items', state.toJS(), id, msg);
//  //ipcRenderer.send('narrow_down_items', state, id, msg);
//
//  return updatePaneCmd(state, id, msg);
//  //return dispatch(updatePaneCmd(state, id, msg));
//
//  //return{
//  //  type: 'END_NARROW_DOWN_ITEMS',
//  //  state: state
//  //};
//
//}

/* TEST @ 2017.01.05 */
//const NarrowDownItems = (state, id, msg) => (dispatch) => {
//  //console.log('NarrowDownItems() !!');
//
//  const state_tmp = state;
//  ipcRenderer.once('narrow_down_items_cb', (event, ss) => {
//    //const ss = im.fromJS(state_ret);
//    dispatch({
//      type: 'END_NARROW_DOWN_ITEMS',
//      state: state
//      //state: im.fromJS(state_ret)
//    });
//  });
//
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  //console.log('NarrowDownItems <> dir_cur: ' + dir_cur);
//  //console.log('state: ' + state);
//
//  const items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
//  //console.log('items: ' + items);
//
//  ipcRenderer.send('narrow_down_items', state.toJS(), id, msg);
//  //ipcRenderer.send('narrow_down_items', state, id, msg);
//
//  return updatePaneCmd(state, id, msg);
//  //return dispatch(updatePaneCmd(state, id, msg));
//}


/* ToDo; Need to find better way to set callback only one time.. */
let is_initialized = false
export const NarrowDownItems = (state, id, msg) => (dispatch) => {
  //console.log('NarrowDownItems() !!');

  if(is_initialized === false){
    ipcRenderer.on('narrow_down_items_cb', (event, ids, msg, input_mode) => {
      //console.log('ids: ' + ids);
      //console.log('NarrowDownItems() <> ids.length: ' + ids.length);
      if(msg.length <= 0){
        dispatch(switchInputModeNormalWithClear());
      }else{
        dispatch({
          type: 'END_NARROW_DOWN_ITEMS',
          ids: ids,
          //msg_cmd: msg,
          input_mode: input_mode
        });
      }
    });
    is_initialized = true;
  }

  const item_names = state.getIn(['arr_item_name_lists', id]);
  //console.log('item_names.length: ' + item_names.length);

  ipcRenderer.send('narrow_down_items', state.getIn(['arr_item_name_lists', id]), id, msg);
  //ipcRenderer.send('narrow_down_items', state.get('name_list_left'), id, msg);

  return {
    type: 'START_NARROW_DOWN_ITEMS'
  }
  //return updatePaneCmd(state, id, msg);

  //return dispatch(updatePaneCmd(state, id, msg));
}

//const NarrowDownItems = (state, id, msg) => (dispatch) => {
//  //console.log('NarrowDownItems() !!');
//  return dispatch(NarrowDownItemsCore(state, id, msg));
//}


/* ORG */
//export const NarrowDownItems = (state, id, msg) => (dispatch) => {
////const NarrowDownItems = (state, id, msg) => (dispatch) => {
//  //console.log('NarrowDownItems() !!');
//
//  return NarrowDownItemsCore(state, id, msg).then((ss) => {
//    dispatch(
//      {
//        type: 'END_NARROW_DOWN_ITEMS',
//        state: ss
//      }
//    );
//  });
//}

const startNarrowDownItems = (state, id, msg) => {
  //console.log('startNarrowDownItems()!!');
  return {
    type: 'START_NARROW_DOWN_ITEMS',
    //state: state.setIn(['arr_pages', id, 'msg_cmd'], msg)
  }
}

const endNarrowDownItems = (s) => {
  return {
    type: 'END_NARROW_DOWN_ITEMS',
    state: s
  }
}

const switchInputModeNormalWithClear = () => {
  return {
    type: 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR',
    c: ''
  }
}

//const requestUpdateItemsMatch = (e) => {
//  return {
//    type: 'UPDATE_ITEMS_MATCH'
//  }
//}

const NarrowDownItemsCoreRet = (state, id, msg) => {
  //console.log('NarrowDownItemsCore()!!');

  if(msg.length <= 0){
    return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                     .set('input_mode', KEY_INPUT_MODE.NORMAL))
  }

  const pattern = msg.slice(1, msg.length);
  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  let items;

  if(pattern.length > 0){
    //console.log('pattern.length > 0');
    const reg = new RegExp(pattern);

    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
                       .filter((e, i) => {
                         if(reg.test(e.name)){
                           return e;
                         }
                       });

  }else{
    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
  }

  //console.log('NarrowDownItemsCore() END!!');
  return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0))

}

const NarrowDownItemsCore = (state, id, msg) => {
  //console.log('NarrowDownItemsCore()!!');

  return new Promise(function(resolve, reject){
  //return new Promise( (resolve, reject) => {
    if(msg.length <= 0){
      resolve(
        state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                  .set('input_mode', KEY_INPUT_MODE.NORMAL))
      );
    }

    const pattern = msg.slice(1, msg.length);
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    let items;

    if(pattern.length > 0){
      //console.log('pattern.length > 0');
      const reg = new RegExp(pattern);

      items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
                         .filter((e, i) => {
                           if(reg.test(e.name)){
                             return e;
                           }
                         });

    }else{
      items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
    }

    //console.log('NarrowDownItemsCore() END!!');
    resolve(
      state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
                                .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
                                .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0))
    );

  });
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

