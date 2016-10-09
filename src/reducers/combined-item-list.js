'use strict';

import fs from 'fs';
import ItemListCore from '../core/item_list';

//const item_list = new ItemListCore(-1, 'INIT');
//item_list.dir_cur = fs.realpathSync('C:\\');
//item_list.updateItems();
//
//let arr_item_list = [];
//arr_item_list.push(item_list);

function CombinedItemList(state, action){
//const CombinedItemList = (state={}, action) => {
  switch(action.type){
    //case 'UPDATE_ITEM_LIST':
    //  console.log('reducer: UPDATE_ITEM_LIST!! id: ' + action.id + ', state.arr_item_list[0].id: ' + state.arr_item_list[0].id);

    //  //if(action.id === 0){
    //  //  let new_list = Object.assign({}, state.item_list);
    //  //  //new_list.items = Object.assign({}, state.item_list.items);
    //  //  //new_list.items = [].concat(state.item_list.items);
    //  //  new_list.items = state.item_list.items.concat();
    //  //  for (let i = 0; i < new_list.items.length; i++){
    //  //    new_list.items[i].name = 'hoge!!';
    //  //  }
    //  //  //for (let i = 0; i < state.item_list.items.length; i++){
    //  //  //  console.log(state.item_list.items[i].name);
    //  //  //}
    //  //  return {item_list: new_list};
    //  //}else{
    //  //  return state;
    //  //}

    //  //let arr_item_list = state.arr_item_list.concat();
    //  //for(let i=0; i<state.arr_item_list.length; i++){
    //  //  arr_item_list[i].items = i === action.item_list.id
    //  //                             ? action.item_list.items.concat()
    //  //                             : state.arr_item_list[i].items.concat();
    //  //}

    //  //let arr_item_list = state.arr_item_list.concat();
    //  //for(let i=0; i<arr_item_list.length; i++){
    //  //  arr_item_list[i].items = state.arr_item_list[i].items.concat();
    //  //  if(i === action.item_list.id){
    //  //    for(let j=0; j<arr_item_list[i].items.length; j++){
    //  //      arr_item_list[i].items[j].name = 'hoge!!';
    //  //    }
    //  //  }
    //  //}

    //  let arr_item_list = state.arr_item_list.concat();
    //  for(let i=0; i<arr_item_list.length; i++){
    //    if(i === action.id){
    //      arr_item_list[i] = new ItemListCore(i, 'LEFT');
    //      arr_item_list[i].dir_cur = fs.realpathSync('C:\\');
    //      arr_item_list[i].updateItems();

    //    }else{
    //      arr_item_list[i].items = state.arr_item_list[i].items.concat();
    //    }
    //  }

    //  return {arr_item_list: arr_item_list};

    case 'MOVE_CURSOR_UP':
      console.log('MOVE_CURSOR_UP!!');
      //{
      //  let arr_item_list_cur = state.arr_item_list;
      //  let arr_item_list = arr_item_list_cur;
      //  for(let i=0; i<arr_item_list.length; i++){
      //    arr_item_list[i].items = arr_item_list_cur[i].items;
      //  }
      //  const idx = state.active_pane_id;
      //  arr_item_list[idx].line_cur = arr_item_list_cur[idx].line_cur - 1;
      //  return Object.assign({}, state, {arr_item_list: arr_item_list});
      //}

      {
        let arr_pages = state.arr_pages;
        for(let i=0; i<arr_pages.length; i++){
          arr_pages[i].page_cur.items = state.arr_pages[i].page_cur.items;
        }
        const idx = state.active_pane_id;
        arr_pages[idx].page_cur.line_cur = arr_pages[idx].page_cur.line_cur - 1;
        return Object.assign({}, state, {arr_pages: arr_pages});
      }

    case 'MOVE_CURSOR_DOWN':
      console.log('MOVE_CURSOR_DOWN!!');
      //{
      //  let arr_item_list_cur = state.arr_item_list;
      //  let arr_item_list = arr_item_list_cur
      //  for(let i=0; i<arr_item_list.length; i++){
      //    arr_item_list[i].items = arr_item_list_cur[i].items
      //  }
      //  const idx = state.active_pane_id;
      //  arr_item_list[idx].line_cur = arr_item_list_cur[idx].line_cur + 1;
      //  return Object.assign({}, state, {arr_item_list: arr_item_list});
      //}

      {
        let arr_pages = state.arr_pages;
        for(let i=0; i<arr_pages.length; i++){
          arr_pages[i].page_cur.items = state.arr_pages[i].page_cur.items;
        }
        const idx = state.active_pane_id;
        arr_pages[idx].page_cur.line_cur = arr_pages[idx].page_cur.line_cur + 1;
        return Object.assign({}, state, {arr_pages: arr_pages});
      }

    default:
      //console.log('reducer: default <> state.arr_item_list[0].id: ' + state.arr_item_list[0].id);
      //for (let e of state.item_list.items){
      //  console.log(e.name);
      //}
      return state;
  }

  //return state;
}

export default CombinedItemList;
