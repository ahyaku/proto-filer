'use strict';

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import im from 'immutable';

import App from './components/app';
import { checkKeyNormal, checkKeySearch } from './actions';

import fs from 'fs';
import ItemListPages from './core/item_list_pages';
import reducer from './reducers';
import {KEY_INPUT_MODE} from './core/item_type';

process.env.NODE_ENV = 'production';

const pages_left = new ItemListPages().updatePageCur('C:\\msys64');
//const pages_left = new ItemListPages().updatePageCur('C:\\shortcut');
//const pages_left = new ItemListPages().updatePageCur('C:\\test');
const pages_right = new ItemListPages().updatePageCur('C:\\Go');
//const pages_right = new ItemListPages().updatePageCur('C:\\test');
const arr_pages = im.List.of(pages_left, pages_right);
//console.log('arr_pages: ' + arr_pages);

const active_pane_id = 0;

//const state_init = {
//  arr_pages: arr_pages,
//  active_pane_id: active_pane_id,
//  action_type: 'NONE',
//  input_mode: KEY_INPUT_MODE.NORMAL,
//  msg_cmd: ''
//}

//const state_init = im.Record({
const state_init = im.Map({
  arr_pages: arr_pages,
  active_pane_id: 0,
  action_type: 'NONE',
  input_mode: KEY_INPUT_MODE.NORMAL,
  msg_cmd: ''
});

let store = createStore(reducer, state_init, applyMiddleware(thunk));

function ListenKeydown(mapEventToAction){
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

  return function(dispatch, getState){
    function handleEvent(e){
      console.log('handleEvent()!! <> e.key: ' + e.key);
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
    const state = getState();
    switch(state.get('input_mode')){
      case KEY_INPUT_MODE.NORMAL:
        return dispatch(checkKeyNormal(state, e));
      case KEY_INPUT_MODE.SEARCH:
        return dispatch(checkKeySearch(state, e));
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

const style = {
  overflowY: 'hidden'
};

render(
  <Provider store={store}>
    <App style={style}/>
  </Provider>,
  document.getElementById('root')
);
