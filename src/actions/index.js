'use strict';
import { KEY_INPUT_MODE } from '../core/item_type';

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
      return {
        type: 'DEBUG_COUNT_START'
      };
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
  console.log('e.keyCode: ' + e.keyCode);
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
      return dispatch(
        {
          type: 'SWITCH_INPUT_MODE_NORMAL_WITH_CLEAR',
          c: ''
          //is_clear_cmd: true
        }
      );
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

const receiveInput = (state, c) => (dispatch) => {
  const id = state.get('active_pane_id');
  const msg = state.getIn(['arr_pages', id, 'msg_cmd']) + c;
  dispatch(updatePaneCmd(state, id, msg));
  dispatch(startNarrowDownItems(state, id, msg));
  return dispatch(NarrowDownItems(state, id, msg));
}

const receiveInputBS = (state) => (dispatch) => {
  const id = state.get('active_pane_id');
  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
  dispatch(updatePaneCmd(state, id, msg));
  dispatch(startNarrowDownItems(state, id, msg));
  return dispatch(NarrowDownItems(state, id, msg.slice(0, msg.length - 1)));

}

const clearInput = (state) => (dispatch) => {
  const id = state.get('active_pane_id');
  const msg = state.getIn(['arr_pages', id, 'msg_cmd']);
  dispatch(updatePaneCmd(state, id, msg));
  dispatch(startNarrowDownItems(state, id, msg));
  return dispatch(NarrowDownItems(state, id, msg.slice(0, 1)));
}

//function updatePaneCmd(state, id, msg){
const updatePaneCmd = (state, id, msg) => {
  //console.log('updatePaneCmd()!!');
  return {
    type: 'UPDATE_PANE_CMD',
    state: state.setIn(['arr_pages', id, 'msg_cmd'], msg)
  }
}

const NarrowDownItems = (state, id, msg) => (dispatch) => {
  //console.log('NarrowDownItems() !!');

  return NarrowDownItemsCore(state, id, msg).then((ss) => {
    //return {
    //  type: 'END_NARROW_DOWN_ITEMS',
    //  state: ss
    //}

    //console.log('then!!');
    dispatch(
      {
        type: 'END_NARROW_DOWN_ITEMS',
        state: ss
      }
    );
  });

}

/* ORG with Promise */
//const NarrowDownItems = (arg_dispatch, state, id, msg) => {
//  //console.log('NarrowDownItems() !!');
//  arg_dispatch(startNarrowDownItems(state, id, msg));
//
//  return function(dispatch){
//    //console.log('HERE!!');
//    NarrowDownItemsCore(state, id, msg).then(function(s){
//      //state_new = s;
//      const dir_cur = s.getIn(['arr_pages', id, 'dir_cur']);
//      //console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);
//      //return s;
//      dispatch(endNarrowDownItems(s));
//    }).catch(function(e){
//      //console.log('NarrowDownItems() <> error!! e: ' + e);
//      dispatch({type: 'DO_NOTHING'});
//    });
//  };
//
//  //return NarrowDownItemsCore(state, id, msg).then(function(s){
//  //  //state_new = s;
//  //  const dir_cur = s.getIn(['arr_pages', id, 'dir_cur']);
//  //  console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);
//  //  //return s;
//  //  dispatch(endNarrowDownItems(s));
//  //}).catch(function(e){
//  //  console.log('NarrowDownItems() <> error!! e: ' + e);
//  //});
//
//  //console.log('NEW NarrowDownItems()');
//  //const dir_cur = state_new.getIn(['arr_pages', id, 'dir_cur']);
//  //console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);
//
//  //return state_new;
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

//const requestUpdateItemsMatch = (e) => {
//  return {
//    type: 'UPDATE_ITEMS_MATCH'
//  }
//}

const NarrowDownItemsCore = (state, id, msg) => {
  //return state.setIn(['arr_pages', id, 'msg_cmd'], msg + c);

  //console.log('NarrowDownItemsCore()!!');

  //return new Promise(function(resolve, reject){
  //    resolve(state);
  //});

  return new Promise(function(resolve, reject){
  //return new Promise( (resolve, reject) => {
    if(msg.length <= 0){
      //console.log('HERE!!');
      resolve(
        state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
                                  .set('input_mode', KEY_INPUT_MODE.NORMAL))
      );

      //resolve(
      //  {
      //    type: 'END_NARROW_DOWN_ITEMS',
      //    state: state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
      //                                     .set('input_mode', KEY_INPUT_MODE.NORMAL))
      //  }
      //);

      //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
      //                                 .set('input_mode', KEY_INPUT_MODE.NORMAL));

      //return {
      //  type: 'END_NARROW_DOWN_ITEMS',
      //  //type: 'RECEIVE_INPUT',
      //  state: state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
      //                                   .set('input_mode', KEY_INPUT_MODE.NORMAL))
      //};

    }
    //console.log('HERE2!!');

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

    //resolve(
    //  {
    //    type: 'END_NARROW_DOWN_ITEMS',
    //    state: state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
    //                                     .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
    //                                     .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0))
    //  }
    //);

    //return {
    //  type: 'END_NARROW_DOWN_ITEMS',
    //  //type: 'RECEIVE_INPUT',
    //  state: state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
    //                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
    //                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0)
    //                            )
    //};

    //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
    //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
    //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0)
    //                          );

  });

}

/* ORG with Promise */
//const NarrowDownItemsCore = (state, id, msg) => {
//  //return state.setIn(['arr_pages', id, 'msg_cmd'], msg + c);
//
//  console.log('NarrowDownItemsCore()!!');
//  //return new Promise(function(resolve, reject){
//  //    resolve(state);
//  //});
//
//  return new Promise(function(resolve, reject){
//  //return new Promise( (resolve, reject) => {
//    if(msg.length <= 0){
//      //console.log('HERE!!');
//      resolve(
//        state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//                                  .set('input_mode', KEY_INPUT_MODE.NORMAL))
//      );
//      //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//      //                                 .set('input_mode', KEY_INPUT_MODE.NORMAL));
//    }
//    //console.log('HERE2!!');
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
//    resolve(
//      state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0))
//    );
//  });
//
//  //return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//  //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//  //                                 .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));
//
//}


//function NarrowDownItems(state, id, msg){
//  //return state.setIn(['arr_pages', id, 'msg_cmd'], msg + c);
//
//  if(msg.length <= 0){
//    return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//                                     .set('input_mode', KEY_INPUT_MODE.NORMAL));
//  }
//
//  const pattern = msg.slice(1, msg.length);
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  let items;
//
//  console.log('NarrowDownItems() <> dir_cur: ' + dir_cur);
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
//  return state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                   .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));
//
//}

