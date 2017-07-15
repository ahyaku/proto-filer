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
import fs from 'fs';
import { ipcRenderer } from 'electron';
import cp from 'child_process';

import App from './components/app';
import { checkKeyNormal, checkKeySearch } from './actions';
import { updatePageCur } from './util/item_list_pages';
import reducer from './reducers';
import { KEY_INPUT_MODE } from './util/item_type';
//import { updateItemNameList } from './reducers/combined-item-list';

process.env.NODE_ENV = 'production';

const state_core_left = updatePageCur(null, 'C:\\msys64', true);
//const pages_left = updatePageCur(null, 'C:\\tmp\\many_items', true);
const state_core_right = updatePageCur(null, 'C:\\Go', true);
//const pages_left = updatePageCur(null, 'C:\\Go', true);
//const pages_right = updatePageCur(null, 'C:\\tmp\\many_items', true);

const state_core = im.List.of(state_core_left, state_core_right);
//console.log('index <> state_core: ', state_core);

const state_init = {
  state_core: state_core,
  active_pane_id: 0,
  input_mode: KEY_INPUT_MODE.NORMAL,
  msg_cmd: ''
};

let store = createStore(reducer, state_init, applyMiddleware(thunk));

function ListenKeydown(mapEventToAction){
  return function(dispatch, getState){
    function handleEvent(e){
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
    }

    document.addEventListener('keydown', handleEvent);
    return () => document.removeEventListener('keydown', handleEvent);
  };

}

function mapKeydownToAction(getState, e){
  //console.log('mapKeydownToAction <> getState().action_type: ' + getState().action_type);
  return function(dispatch){
    const state_fcd = getState();
    const state = state_fcd.state_core;

    //const state = getState();

    //switch(state.get('input_mode')){
    switch(state_fcd.input_mode){
      case KEY_INPUT_MODE.NORMAL:
        //console.log('HERE??');
        return dispatch(checkKeyNormal(state_fcd, e));
        //return dispatch(checkKeyNormal(state, e));
      case KEY_INPUT_MODE.SEARCH:
        return dispatch(checkKeySearch(state_fcd, e));
        //return dispatch(checkKeySearch(state, e));
    }
  }
}

const unlistenKeydown = store.dispatch(ListenKeydown(mapKeydownToAction));

//ipcRenderer.on('test_message_reply', (event, ret_msg) => {
//  console.log('ret_msg: ' + ret_msg);
//});
//ipcRenderer.send('test_message', 'Here it!!');

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
