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

import App from './components/app';
import { checkKeyNormal, checkKeySearch } from './actions';

import fs from 'fs';
//import ItemListPages from './core/item_list_pages';
import { updatePageCur } from './util/item_list_pages';
import reducer from './reducers';
//import {KEY_INPUT_MODE} from './core/item_type';
import {KEY_INPUT_MODE} from './util/item_type';

import { ipcRenderer } from 'electron';
import cp from 'child_process';
//import electron from electron;

import { updateItemNameList } from './reducers/combined-item-list';

process.env.NODE_ENV = 'production';


//const pages_left = new ItemListPages().updatePageCur('C:\\msys64');
//const pages_right = new ItemListPages().updatePageCur('C:\\Go');

const pages_left = updatePageCur(null, 'C:\\msys64', true);
//const pages_left = updatePageCur(null, 'C:\\tmp\\many_items', true);
const pages_right = updatePageCur(null, 'C:\\Go', true);
//const pages_left = updatePageCur(null, 'C:\\Go', true);
//const pages_right = updatePageCur(null, 'C:\\tmp\\many_items', true);
const arr_pages = im.List.of(pages_left, pages_right);
//console.log('arr_pages: ' + arr_pages);

const dir_cur_left = pages_left.get('dir_cur');
const dir_cur_right = pages_right.get('dir_cur');
const im_items_left = pages_left.getIn(['pages', dir_cur_left, 'items_match']);
const im_items_right = pages_right.getIn(['pages', dir_cur_right, 'items_match']);
const arr_im_items = im.List.of(im_items_left, im_items_right);
const items_left = im_items_left.toJS();
const items_right = im_items_right.toJS();
const arr_items = [items_left, items_right];
//const arr_items = im.List.of(items_left, items_right);

//console.log('items_left[2]: ' + items_left[2]['time']);

//const name_list_left = [
//  'dev',
//  'etc',
//  'home',
//  'mingw32',
//  'mingw64',
//  'opt',
//  'tmp',
//  'usr',
//  'var',
//  'autorebase.bat',
//  'autorebasebase1st.bat',
//  'components.xml',
//  'dir',
//  'InstallationLog.txt',
//  'maintenancetool.dat',
//  'maintenancetool.exe',
//  'maintenancetool.ini',
//  'msys2.ico',
//  'msys2_shell.cmd',
//  'network.xml',
//  'test'
//]

//const name_list_left = [
//  'autorebase.bat',
//  'autorebasebase1st.bat'
//]




const state_core = im.Map({
  arr_pages: arr_pages,
  //active_pane_id: 0,
  action_type: 'NONE',
  input_mode: KEY_INPUT_MODE.NORMAL,
  msg_cmd: '',
  arr_item_name_lists: im.List.of(),
  //arr_line_cur: im.List.of(),
  //arr_line_cur: {0: 84, 1: 0},
  //arr_line_cur: [0, 0],
  arr_im_items: arr_im_items,
  //arr_items: arr_items
});

const state_init = {
  state_core: state_core,
  arr_line_cur: [0, 0],
  arr_items: arr_items,
  active_pane_id: 0
};

//const state_init = im.Map({
//  arr_pages: arr_pages,
//  active_pane_id: 0,
//  action_type: 'NONE',
//  input_mode: KEY_INPUT_MODE.NORMAL,
//  msg_cmd: '',
//  arr_item_name_lists: im.List.of(),
//  //arr_line_cur: im.List.of(),
//  //arr_line_cur: {0: 84, 1: 0},
//  arr_line_cur: [0, 0],
//  arr_im_items: arr_im_items,
//  arr_items: arr_items
//});

//const hoge = Object.assign({}, state_init.get('arr_line_cur'), {0: 91});
//console.log('hoge[0]: ' + hoge[0]);

//const arr_init = [0, 1, 2, 3];
//const idx = 1;
//const arr_new = [
//  ...arr_init.slice(0, idx),
//  100,
//  ...arr_init.slice(idx+1)
//];
//console.log('arr_new: ' + arr_new);

//const list_tmp = state_init.get('name_list_left');
//console.log('list_tmp: ' + list_tmp);

//const state_tmp00 = updateItemNameList(state_init, 0);
//const state_tmp01 = updateItemNameList(state_tmp00, 1);
//console.log('arr_item_name_lists[0]: ' + state_tmp01.getIn(['arr_item_name_lists', 0]));
//console.log('arr_item_name_lists[1]: ' + state_tmp01.getIn(['arr_item_name_lists', 1]));

const item_name_list_left = updateItemNameList(state_init, 0);
const item_name_list_right = updateItemNameList(state_init, 1);

//console.log('index <> item_name_list_left: ', item_name_list_left);

const state_core2 = state_init.state_core.withMutations((s) => s.setIn(['arr_item_name_lists', 0], item_name_list_left)
                                                                .setIn(['arr_item_name_lists', 1], item_name_list_right));


const state_init2 = Object.assign(
                      {},
                      state_init,
                      { state_core: state_core2 }
                    );

//const items = state_init2.arr_items[0];
//console.log('items[4].name: ' + items[4].name);


//const state_init2 = state_init.withMutations((s) => s.setIn(['arr_item_name_lists', 0], item_name_list_left)
//                                                     .setIn(['arr_item_name_lists', 1], item_name_list_right));


let store = createStore(reducer, state_init2, applyMiddleware(thunk));

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
  //switch(getState().input_mode){
  return function(dispatch){
    const state_fcd = getState();
    const state = state_fcd.state_core;

    //const state = getState();

    switch(state.get('input_mode')){
      case KEY_INPUT_MODE.NORMAL:
        return dispatch(checkKeyNormal(state_fcd, e));
        //return dispatch(checkKeyNormal(state, e));
      case KEY_INPUT_MODE.SEARCH:
        return dispatch(checkKeySearch(state_fcd, e));
        //return dispatch(checkKeySearch(state, e));
    }
  }
}

//function ListenKeydown(mapEventToAction){
//  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//
//  return function(dispatch, getState){
//    function handleEvent(e){
//      console.log('handleEvent()!!');
//      //console.log('key: ' + e);
//      //console.log('e.keyCode: ' + e.keyCode);
//      //console.log('e.key: ' + e.key);
//      //console.log('event.shiftKey: ' + event.shiftKey);
//      //console.log('event.ctrlKey: ' + event.ctrlKey);
//      //console.log('event.target: ' + event.target);
//      //console.log('event.target.id: ' + event.target.id);
//
//      //dispatch(mapEventToAction(e, getState));
//      dispatch(mapEventToAction(dispatch, getState, e));
//    }
//
//    document.addEventListener('keydown', handleEvent);
//    return () => document.removeEventListener('keydown', handleEvent);
//  };
//
//}
//
//function mapKeydownToAction(dispatch, getState, e){
//  //console.log('mapKeydownToAction <> getState().action_type: ' + getState().action_type);
//  //switch(getState().input_mode){
//  const state = getState();
//  switch(state.get('input_mode')){
//    case KEY_INPUT_MODE.NORMAL:
//      return checkKeyNormal(dispatch, state, e);
//    case KEY_INPUT_MODE.SEARCH:
//      return checkKeySearch(dispatch, state, e);
//  }
//}

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
    <App style={style} store={store}/>
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
