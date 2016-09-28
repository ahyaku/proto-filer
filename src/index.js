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
import ItemListCore from '../lib/item_list';
import reducer from './reducers'

const item_list = new ItemListCore('dummy');
item_list.dir_cur = fs.realpathSync('C:\\');
item_list.updateItems();

//for(let e of item_list.items){
//  console.log(e.name);
//}


let store = createStore(reducer, {item_list: item_list} );
//let store = createStore(reducer);
//let store = createStore(hoge, {items: "ITEMS_INITIALIZED"} );
console.log(store.getState());

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
