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

const arr = im.Range(10, 20);
//console.log('arr: ' + arr);

const arr1 = arr.map((e, i) => {
                            return (e + 100);
                        });
arr1.forEach((e, i) => {console.log(e);});

const arr2 = arr.flatMap((e, i) => {
  return ["one"];
  //if(e == 10){
  //  return im.Seq(["one"]);
  //}else{
  //  return im.Seq([]);
  //}
});
console.log('arr2: ' + arr2.get(0));

const arr3 = arr.flatMap((e, i) => {
  return ["one"];
  //if(e == 10){
  //  return ["one"];
  //}else{
  //  return [];
  //}
});
console.log('arr3: ' + arr3.get(0));

const arr4 = arr.map((e, i) => {
    return ["one"];
});
console.log('arr4: ' + arr4.get(0));

//const rec = im.Record({a: 0, b: 1, c: 2});
//const rec2 = rec.map((e, i) => {
//  return im.Seq([]);
//});
//const rec2 = rec.flatMap((e, i) => {
//  return im.Seq([]);
//});
//console.log(rec2);


//const pages_left = new ItemListPages();
//pages_left.updatePageCur('C:\\');
//const pages_right = new ItemListPages();
//pages_right.updatePageCur('C:\\msys64');
//let arr_pages = [];
//arr_pages.push(pages_left);
//arr_pages.push(pages_right);


//const TestItemRecord = im.Record({
//  name: null,
//  id: null,
//  stat: 0
//});
//
//class TestItem extends TestItemRecord{
//  constructor(props){
//    super(props);
//    console.log("Test <> id: " + this.id);
//  }
//
//  init(){
//    console.log("Test <> init()");
//    return this.set('stat', 1);
//    //return this;
//  }
//}
//
//const test = im.Seq(im.Range(0, 10))
//               .map((i) => {
//                 return new TestItem({name: "hoge", id: i}).init('set', 1);
//               });
//
//console.log('test: ' + test);
//const ret = test.map((e, i) => {
//                  console.log('id: ' + e.get('id'));
//                  //e.set('id', e.get('id') + 10);
//                  //e.id + 10;
//                  e.set('stat', 2);
//                  //return ret;
//                });
//
//console.log('ret: ' + ret);


//for(let i=0; i<10; i++){
//  console.log(ret.get(i).get('id'));
//}

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

const hoge = im.Record({
  arr_pages: arr_pages,
  active_pane_id: 0,
  action_type: 'NONE',
  input_mode: KEY_INPUT_MODE.NORMAL,
  msg_cmd: ''
});

//const hoge = im.Map({
//  arr_pages: arr_pages,
//  active_pane_id: active_pane_id,
//  action_type: 'NONE',
//  input_mode: KEY_INPUT_MODE.NORMAL,
//  msg_cmd: ''
//});
//
//console.log('hoge: ' + hoge.getIn(['action_type']));
//const path_cur = hoge.getIn(['arr_pages', 1, 'path_cur']);
//console.log('path_cur = ' + path_cur);

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
  //switch(getState().input_mode){
  switch(getState().get('input_mode')){
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
