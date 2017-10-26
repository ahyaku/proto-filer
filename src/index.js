'use strict';

import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

//console.log('root: ' + );

installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension: ${name}`))
  .catch((err) => console.log(`An error occurred: `, err));

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import im from 'immutable';
import { ipcRenderer } from 'electron';
import chokidar from 'chokidar';
//import cp from 'child_process';

import App from './components/app';
import { checkKeyNormal, checkKeySearch, dirWatcher_initialize } from './actions';
import { createStateCore } from './util/item_list_pages';
import reducer from './reducers';
import { KEY_INPUT_MODE } from './util/item_type';

process.env.NODE_ENV = 'production';

const state_core_left = createStateCore(null, 'C:\\tmp\\test');
const state_core_right = createStateCore(null, 'C:\\tmp\\many_items');

const state_core = im.List.of(state_core_left, state_core_right);
//console.log('index <> state_core: ', state_core);

const win_ctxt = im.Map({
  'height_win': 0.0,
  'height_delta': 0.0
});

const state_init = {
  state_core: state_core,
  active_pane_id: 0,
  input_mode: KEY_INPUT_MODE.NORMAL,
  //pages_sc: im.Map(),
  msg_cmd: '',
  action_type: '',
  win_ctxt: win_ctxt
};

let store = createStore(reducer, state_init, applyMiddleware(thunk));

const ListenKeydown = (mapEventToAction) => {

  return (dispatch, getState) => {

    const handleEvent = (e) => {
      //console.log('handleEvent()!! <> e.key: ' + e.key);
      //console.log('key: ' + e);
      //console.log('e.keyCode: ' + e.keyCode);
      //console.log('e.key: ' + e.key);
      //console.log('event.shiftKey: ' + event.shiftKey);
      //console.log('event.ctrlKey: ' + event.ctrlKey);
      //console.log('event.target: ' + event.target);
      //console.log('event.target.id: ' + event.target.id);

      //dispatch(mapEventToAction(e, getState));
      //dispatch(mapEventToAction(dispatch, getState, e));
      dispatch(mapEventToAction(getState, e));
    } /* handleEvent */

    document.addEventListener('keydown', handleEvent);
    return () => document.removeEventListener('keydown', handleEvent);

  };

}

/* ORG */
const mapKeydownToAction = (getState, e) => {
  //console.log('mapKeydownToAction <> getState().action_type: ' + getState().action_type);
  return (dispatch) => {
    const state_fcd = getState();
    const state = state_fcd.state_core;

    //const state = getState();

    //switch(state.get('input_mode')){
    switch(state_fcd.input_mode){
      case KEY_INPUT_MODE.NORMAL:
        //console.log('HERE??');
        return dispatch(checkKeyNormal(state_fcd, e));
        //return checkKeyNormal(state_fcd, e);
        //return dispatch(checkKeyNormal(state, e));
      case KEY_INPUT_MODE.SEARCH:
        return dispatch(checkKeySearch(state_fcd, e));
        //return checkKeySearch(state_fcd, e);
        //return dispatch(checkKeySearch(state, e));
    }
  }
}


/* MDF */
//let key_str = '';
//let timer = null;
//const KEY_INPUT_INTERVAL = 100;
//
//const mapKeydownToAction = (getState, e) => {
//  //console.log('mapKeydownToAction <> getState().action_type: ' + getState().action_type);
//  return (dispatch) => {
//    const state_fcd = getState();
//    const state = state_fcd.state_core;
//
//    //const state = getState();
//
//    //switch(state.get('input_mode')){
//    switch(state_fcd.input_mode){
//      case KEY_INPUT_MODE.NORMAL:
//        //console.log('HERE??');
//        //dispatch(checkKeyNormal(state_fcd, e));
//
//        //dispatch(checkKeyNormal(state_fcd, e, key_str));
//
//        key_str += e.key;
//        if(timer !== null){
//          clearTimeout(timer);
//        }
//        timer = setTimeout(() => {
//            dispatch(checkKeyNormal(state_fcd, e, key_str));
//            key_str = '';
//            timer = null;
//          },
//          KEY_INPUT_INTERVAL
//        );
//        break;
//        //return checkKeyNormal(state_fcd, e);
//        //return dispatch(checkKeyNormal(state, e));
//      case KEY_INPUT_MODE.SEARCH:
//        dispatch(checkKeySearch(state_fcd, e));
//        break;
//        //return checkKeySearch(state_fcd, e);
//        //return dispatch(checkKeySearch(state, e));
//    }
//  }
//}

const unlistenKeydown = store.dispatch(ListenKeydown(mapKeydownToAction));


//const createMouseDragEndReceiver = () => {
//
//  return (dispatch, getState) => {
//
//    const handleEvent = (e) => {
//      console.log('handleEvent()!! <> ');
//      //console.log('key: ' + e);
//      //console.log('e.keyCode: ' + e.keyCode);
//      //console.log('e.key: ' + e.key);
//      //console.log('event.shiftKey: ' + event.shiftKey);
//      //console.log('event.ctrlKey: ' + event.ctrlKey);
//      //console.log('event.target: ' + event.target);
//      //console.log('event.target.id: ' + event.target.id);
//
//      //dispatch(mapEventToAction(getState, e));
//      dispatch({
//        type: 'IS_DRAG_END'
//      });
//    } /* handleEvent */
//
//    console.log('HERE!!');
//    //document.addEventListener('dragend', handleEvent);
//    //return () => document.removeEventListener('dragend', handleEvent);
//
//    document.addEventListener('click', handleEvent);
//    return () => document.removeEventListener('click', handleEvent);
//
//  };
//
//}
//store.dispatch(createMouseDragEndReceiver());


//document.addEventListener('drag', () => {
//  console.log('drag!!');
//});
//
//document.addEventListener('dragend', () => {
//  console.log('dragend!!');
//});
//
//document.addEventListener('mousedown', () => {
//  console.log('mousedown!!');
//});
//
//document.addEventListener('mouseup', () => {
//  console.log('mouseup!!');
//});


const createMainWindowSizeReceiver = () => {
  //console.log('createMainWindowSizeReceiver');
  return (dispatch) => {
    const receiveMainWindowSizeCB = (event, win_height) => {
      console.log('receiveMainWindowSizeCB <> ch: ' + win_height);
      dispatch({
        type: 'IS_CHANGED_MAIN_WINDOW_SIZE',
        win_height: win_height
      });
    };
    ipcRenderer.on('is_changed_main_window_size', receiveMainWindowSizeCB);
    return () => ipcRenderer.removeListener('is_changed_main_window_size', receiveMainWindowSizeCB);
  };
}
store.dispatch(createMainWindowSizeReceiver());

//const receiveMainWindowSizeCB = (event) => {
//  console.log('receiveMainWindowSizeCB');
//  dispatch({
//    type: 'IS_CHANGED_MAIN_WINDOW_SIZE'
//  });
//};
//ipcRenderer.on('is_changed_main_window_size', receiveMainWindowSizeCB);

//ipcRenderer.on('test_message_reply', (event, ret_msg) => {
//  console.log('ret_msg: ' + ret_msg);
//});
//ipcRenderer.send('test_message', 'Here it!!');

store.dispatch(dirWatcher_initialize(state_core_left.get('dir_watcher'), 0));
store.dispatch(dirWatcher_initialize(state_core_right.get('dir_watcher'), 1)); 

const style = {
  overflowY: 'hidden'
};

render(
  <Provider store={store}>
    <App style={style} />
  </Provider>,
  document.getElementById('root')
);

//const c = cp.fork('proc-narrow-items.js');
////const c = cp.fork('hogeeeee');
//c.on('message', (m) => {
//  console.log('narrow_down_items_cb!! <> m: ' + m);
//});
//
//function test(){
//  console.log('HERE??');
//  //const ret = c.send({
//  //  channel: 'message',
//  //  arg: 'world'
//  //});
//  const ret = c.send({
//    hello: 'world'
//  });
//  console.log('ret: ' + ret);
//}
//
//test();

////const worker = new Worker("./webworker.js");
//const worker = new Worker("./src/webworker.js");
//worker.onmessage = (e) => {
//  console.log('worker.onmessage: ' + e.data);
//}
//worker.postMessage('Hello');
