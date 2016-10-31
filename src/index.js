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

//const pages_left = new ItemListPages();
//pages_left.updatePageCur('C:\\');
//const pages_right = new ItemListPages();
//pages_right.updatePageCur('C:\\msys64');
//let arr_pages = [];
//arr_pages.push(pages_left);
//arr_pages.push(pages_right);

const pages_left = new ItemListPages().updatePageCur('C:\\msys64');
const pages_right = new ItemListPages().updatePageCur('C:\\Go');
const arr_pages = im.List.of(pages_left, pages_right);
//console.log('arr_pages: ' + arr_pages);

const active_pane_id = 0;

const state_init = {
  arr_pages: arr_pages,
  active_pane_id: active_pane_id,
  action_type: 'NONE',
  input_mode: KEY_INPUT_MODE.NORMAL,
  msg_cmd: ''
}
//console.log('state_init.arr_pages: ' + state_init.arr_pages);

let store = createStore(reducer, state_init, applyMiddleware(thunk));

function ListenKeydown(mapEventToAction){

  return function(dispatch, getState){
    function handleEvent(e){
      //console.log('key: ' + e);
      //console.log('e.keyCode: ' + e.keyCode);
      //console.log('e.key: ' + e.key);
      //console.log('event.shiftKey: ' + event.shiftKey);
      //console.log('event.ctrlKey: ' + event.ctrlKey);
      //console.log('event.target: ' + event.target);
      //console.log('event.target.id: ' + event.target.id);

      dispatch(mapEventToAction(e, getState));
    }

    document.addEventListener('keydown', handleEvent);
    return () => document.removeEventListener('keydown', handleEvent);
  };

}

function mapKeydownToAction(e, getState){
  //console.log('mapKeydownToAction <> getState().action_type: ' + getState().action_type);
  switch(getState().input_mode){
    case KEY_INPUT_MODE.NORMAL:
      return checkKeyNormal(e);
    case KEY_INPUT_MODE.SEARCH:
      return checkKeySearch(e);
  }
}

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
