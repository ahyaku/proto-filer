'use strict';

import { combineReducers } from 'redux';
import CombinedItemList from './combined-item-list';
//import * as CombinedItemList from './combined-item-list';

//const itemList = combineReducers({
//  CombinedItemList : CombinedItemList
//});

//const itemList = combineReducers(CombinedItemList);

//const itemList = combineReducers({
//  CombinedItemList
//});

function itemList(state, action){

  //return {
  //  CombinedItemList : CombinedItemList(state, action)
  //}

  let state_ret = CombinedItemList(state, action);

  //return {
  //  CombinedItemList : state_ret
  //}

  return state_ret;
}


export default itemList;


//'use strict';
//
//import fs from 'fs';
//import ItemListCore from '../core/item_list';
//
//const itemList = (state, action) => {
//  console.log('itemList() <> state: ' + state);
//  console.log('itemList() <> state.arr_item_list: ' + state.arr_item_list);
//  switch(action.type){
//    case 'UPDATE_ITEM_LIST':
//      console.log('reducer: UPDATE_ITEM_LIST!! id: ' + action.id + ', state.arr_item_list[0].id: ' + state.arr_item_list[0].id);
//
//      //if(action.id === 0){
//      //  let new_list = Object.assign({}, state.item_list);
//      //  //new_list.items = Object.assign({}, state.item_list.items);
//      //  //new_list.items = [].concat(state.item_list.items);
//      //  new_list.items = state.item_list.items.concat();
//      //  for (let i = 0; i < new_list.items.length; i++){
//      //    new_list.items[i].name = 'hoge!!';
//      //  }
//      //  //for (let i = 0; i < state.item_list.items.length; i++){
//      //  //  console.log(state.item_list.items[i].name);
//      //  //}
//      //  return {item_list: new_list};
//      //}else{
//      //  return state;
//      //}
//
//      //let arr_item_list = state.arr_item_list.concat();
//      //for(let i=0; i<state.arr_item_list.length; i++){
//      //  arr_item_list[i].items = i === action.item_list.id
//      //                             ? action.item_list.items.concat()
//      //                             : state.arr_item_list[i].items.concat();
//      //}
//
//      //let arr_item_list = state.arr_item_list.concat();
//      //for(let i=0; i<arr_item_list.length; i++){
//      //  arr_item_list[i].items = state.arr_item_list[i].items.concat();
//      //  if(i === action.item_list.id){
//      //    for(let j=0; j<arr_item_list[i].items.length; j++){
//      //      arr_item_list[i].items[j].name = 'hoge!!';
//      //    }
//      //  }
//      //}
//
//      let arr_item_list = state.arr_item_list.concat();
//      for(let i=0; i<arr_item_list.length; i++){
//        if(i === action.id){
//          arr_item_list[i] = new ItemListCore(i, 'LEFT');
//          arr_item_list[i].dir_cur = fs.realpathSync('C:\\');
//          arr_item_list[i].updateItems();
//
//        }else{
//          arr_item_list[i].items = state.arr_item_list[i].items.concat();
//        }
//      }
//
//      return {arr_item_list: arr_item_list};
//
//    default:
//      console.log('reducer: default <> state.arr_item_list[0].id: ' + state.arr_item_list[0].id);
//      //for (let e of state.item_list.items){
//      //  console.log(e.name);
//      //}
//      return state;
//  }
//}
//
//export default itemList;

