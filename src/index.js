'use strict';

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import App from './components/app';
import { checkKeyNormal } from './actions';

import fs from 'fs';
import ItemListCore from './core/item_list';
import reducer from './reducers'

const item_list = new ItemListCore();
item_list.dir_cur = fs.realpathSync('C:\\');
item_list.updateItems();

const item_list_left = new ItemListCore();
item_list_left.dir_cur = fs.realpathSync('C:\\shortcut');
item_list_left.updateItems();

const item_list_right = new ItemListCore();
item_list_right.dir_cur = fs.realpathSync('C:\\msys64');
item_list_right.updateItems();

let arr_item_list = [];
arr_item_list.push(item_list_left);
arr_item_list.push(item_list_right);

const active_pane_id = 1;

//for(let e of item_list.items){
//  console.log(e.name);
//}

const state_init = {
  arr_item_list: arr_item_list,
  active_pane_id: active_pane_id
}

let store = createStore(reducer, state_init, applyMiddleware(thunk));
//console.log(store.getState());

//let unsubscribe = store.subscribe(() => {
//  console.log(store.getState());
//});

function ListenKeydown(mapEventToAction){

  return function(dispatch){
    function handleEvent(e){
      //console.log('key: ' + e);
      console.log('e.keyCode: ' + e.keyCode);
      console.log('e.key: ' + e.key);
      //console.log('event.shiftKey: ' + event.shiftKey);
      //console.log('event.ctrlKey: ' + event.ctrlKey);
      //console.log('event.target: ' + event.target);
      //console.log('event.target.id: ' + event.target.id);

      dispatch(mapEventToAction(e));
    }

    document.addEventListener('keydown', handleEvent);
    return () => document.removeEventListener('keydown', handleEvent);
  };

}

function mapKeydownToAction(e){
  return checkKeyNormal(e);
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
