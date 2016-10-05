'use strict';

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/app';

//const hoge = () => {
//  return {items: 'hoge'}
//}

import fs from 'fs';
import ItemListCore from './core/item_list';
import reducer from './reducers'

const item_list = new ItemListCore(-1, 'INIT');
item_list.dir_cur = fs.realpathSync('C:\\');
item_list.updateItems();

const item_list_left = new ItemListCore(-1, 'INIT_LEFT');
item_list_left.dir_cur = fs.realpathSync('C:\\shortcut');
item_list_left.updateItems();

const item_list_right = new ItemListCore(-1, 'INIT_RIGHT');
item_list_right.dir_cur = fs.realpathSync('C:\\msys64');
item_list_right.updateItems();

let arr_item_list = [];
arr_item_list.push(item_list_left);
arr_item_list.push(item_list_right);

//for(let e of item_list.items){
//  console.log(e.name);
//}

//const state_init = {
//  item_list: item_list
//}

const state_init = {
  arr_item_list: arr_item_list
}

let store = createStore(reducer, state_init);
//let store = createStore(reducer);
//let store = createStore(hoge, {items: "ITEMS_INITIALIZED"} );
//console.log(store.getState());

//let unsubscribe = store.subscribe(() => {
//  console.log(store.getState());
//});

const style = {
  overflowY: 'hidden'
};

render(
  <Provider store={store}>
    <App style={style}/>
  </Provider>,
  document.getElementById('root')
);
