'use strict';

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import App from './components/app';
import { checkKeyNormal } from './actions';

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

let store = createStore(reducer, state_init, applyMiddleware(thunk));
//let store = createStore(reducer);
//let store = createStore(hoge, {items: "ITEMS_INITIALIZED"} );
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

      //switch(e.keyCode){
      //  case 65: /* 'a' */
      //    console.log('Press a'); 
      //    break;
      //  case 66: /* 'b' */
      //    console.log('Press b'); 
      //    break;
      //  default:
      //    //mediate_pane.checkKey(e);
      //    break;
      //}

      dispatch(mapEventToAction(e));
    }

    document.addEventListener('keydown', handleEvent);
    return () => document.removeEventListener('keydown', handleEvent);
  };

  //return function(){
  //  console.log('foo');
  //  //return function(){return 'bar'};
  //  return () => {return 'bar'};
  //  //return () => document.removeEventListener('keydown', handleEvent);
  //}
}

function mapKeydownToAction(e){

  //return {
  //  type: 'KEY_DOWN',
  //  e
  //};

  return checkKeyNormal(e);

}

//store.dispatch(ListenKeydown);
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
