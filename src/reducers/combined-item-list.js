'use strict';

import fs from 'fs';
import ItemListCore from '../core/item_list';
import { KEY_INPUT_MODE } from '../core/item_type';

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
      {
        let arr_pages = state.arr_pages;
        for(let i=0; i<arr_pages.length; i++){
          arr_pages[i].page_cur.items = state.arr_pages[i].page_cur.items;
        }
        const idx = state.active_pane_id;
        arr_pages[idx].page_cur.line_cur = arr_pages[idx].page_cur.line_cur - 1;
        return Object.assign({}, state,
                             {arr_pages: arr_pages},
                             {action_type: action.type});
      }

    case 'MOVE_CURSOR_DOWN':
      {
        let arr_pages = state.arr_pages;
        for(let i=0; i<arr_pages.length; i++){
          arr_pages[i].page_cur.items = state.arr_pages[i].page_cur.items;
        }
        const idx = state.active_pane_id;
        arr_pages[idx].page_cur.line_cur = arr_pages[idx].page_cur.line_cur + 1;
        return Object.assign({}, state,
                             {arr_pages: arr_pages},
                             {action_type: action.type});
      }

    case 'CHANGE_DIR_UPPER':
      {
        const idx = state.active_pane_id;
        let state_new = Object.assign({}, state);
        state_new.arr_pages[idx].changeDirUpper();
        state_new.action_type = action.type;
        return state_new;
      }
    case 'CHANGE_DIR_LOWER':
      {
        const idx = state.active_pane_id;
        let state_new = Object.assign({}, state);
        state_new.arr_pages[idx].changeDirLower();
        state_new.action_type = action.type;
        return state_new;
      }
    case 'SWITCH_ACTIVE_PANE':
      let active_pane_id;
      switch(state.active_pane_id){
        case 0:
          return Object.assign({}, state,
                               {active_pane_id: 1},
                               {action_type: action.type});
        case 1:
          return Object.assign({}, state,
                               {active_pane_id: 0},
                               {action_type: action.type});
        default:
          /* Do Nothing.. */
          console.log('ERROR!! Incorrect Value \'active_pane_id\'!!');
          return Object.assign({}, state,
                               {action_type: action.type});
      }

    case 'SWITCH_INPUT_MODE_NORMAL':
      //console.log('SWITCH_INPUT_MODE_NORMAL');
      return Object.assign({}, state, {input_mode: KEY_INPUT_MODE.NORMAL});
    case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
      //console.log('SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS');
      //console.log('combined-item-list <> action.c: ' + action.c);
      return Object.assign({}, state,
                           {input_mode: KEY_INPUT_MODE.SEARCH});

    default:
      //console.log('reducer: default <> state.arr_item_list[0].id: ' + state.arr_item_list[0].id);
      //for (let e of state.item_list.items){
      //  console.log(e.name);
      //}
      return state;
  }
}

export default CombinedItemList;
