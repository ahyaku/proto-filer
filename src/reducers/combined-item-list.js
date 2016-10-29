'use strict';

import fs from 'fs';
import im from 'immutable';
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
    case 'RECEIVE_INPUT':
      const idx = state.active_pane_id;

      //let state_new = Object.assign({}, state);

      //let state_new = Object.assign({}, state,
      //      {arr_pages: state.arr_pages.map((e)=>{
      //        return e;
      //      })}
      //    );

      //let state_new = Object.assign({}, state,
      //      {arr_pages: state.arr_pages.map((pages)=>{
      //        return pages.map((e, i, arr)=>{
      //          return e;
      //        });
      //      })}
      //    );

      //let tmp = Immutable.fromJS(state);
      //let state_new = tmp.toJS();

      //var arr = [0, 1, 2, 3, 4];
      //var numbers = im.array(arr);
      //console.log('array0: ' + arr);
      //console.log('array0: ' + numbers);

      //const im_arr_emp = im.array();
      //const im_arr = im_arr_emp.assoc([0, 1, 2, 3]);
      //console.log('im_arr: ' + im_arr);

      //const im_state = im.object(state);
      //let state_new = im_state.mutable();

      const msg_cmd = state.arr_pages[idx].msg_cmd;
      const pattern = msg_cmd.slice(1, msg_cmd.length);
      //state_new.arr_pages[idx].filterItems(pattern);

      //const im_items = im.object(state.arr_pages[idx].items);
      //let reg = new RegExp(pattern);
      //return this._page_cur.items.filter(function(e){
      //  //console.log(e.name);
      //  return e.name.match(reg);
      //});


      //state_new.arr_pages[idx].items = im_items.mutable();



      //state_new.arr_pages[idx].items = state_new.arr_pages[idx].filterItems(pattern);
      const im_state = im.fromJS(state);
      //console.log('im_state: ' + im_state.get('arr_pages').get(idx));
      //console.log('im_state: ' + im_state.get('arr_pages').get(idx).items);
      const reg = new RegExp(pattern);
      //const filtered = im_state.get('arr_pages').get(idx).items.filter(function(e){
      //  return e;
      //  //return (e.get('name').search(reg) > -1);
      //});
      //const filtered = im_state.get('arr_pages').get(idx).items;

      //console.log('filtered: ' + filtered);
      //console.log('filtered: ' + filtered.size);
      //console.log('filtered: ' + filtered.toJS());

      const tmp = { arr_pages: [{name: 'name0', age: 0}, {name: 'name1', age: 1}, {name: 'name2', age: 2}], other: "other_hoge"  };
      const im_tmp = im.fromJS(tmp);
      const t = im_tmp.getIn(['arr_pages', 0]);
      console.log('t: ' + t);

      //const im_items_org = im_state.getIn(['arr_pages', idx]).items;
      //const im_items_org = im_state.getIn(['arr_pages', idx, 'page_cur']);
      //const im_items_org = im_state.getIn(['arr_pages', idx]).items;
      //const im_items_org = im_state.getIn(['arr_pages', idx, 'pages']);
      //const im_items_org = im_state.getIn(['arr_pages', idx, 'msg_cmd']);
      console.log('test: ' + state.arr_pages[idx].test);
      //console.log('test: ' + state.arr_pages[idx].test['are']);
      //const im_items_org = im_state.getIn(['arr_pages', idx]);
      const im_items_org = im_state.getIn(['arr_pages', idx]);
      //const im_items_org = im_state.getIn(['arr_pages', idx, 'test']);
      console.log('im_items_org: ' + im_items_org);

      const im_items = im.List(im.List(im_state.get('arr_pages')).get(idx).items);
      //const im_items = im.List(im_state.get('arr_pages').toList().get(idx).items);
      //const im_items = im.fromJS(state.arr_pages[idx].items).toList();

      //console.log('im_items.size: ' + im_items.size);
      //console.log('im_items: ' + im_items);

      //const im_hoge = im_state.get('arr_pages').toList().get(idx).items.toList();
        //.get(idx).items.toList().filter(function(e){
      //console.log('im_hoge; ' + im_hoge);
      //const im_filtered = im_state.get('arr_pages').toList().get(idx).items.toList().filter(function(e){
      const im_filtered = im_items.filter(function(e){
        //return e;
        //return (e.get('name').search(reg) > -1);
        return (e.name.search(reg) > -1);
      });
      //console.log('filtered: ' + filtered);
      const filtered = im_filtered.toJS();
      console.log('-------------------------------------');
      for(let e of filtered){
        console.log('e.name: ' + e.name);
      }
      console.log('-------------------------------------');

      //const im_state_new = 

      const items = im_items.toJS();
      //console.log('im_items: ' + im_items[0].name);
      //for(let e of items){
      //  console.log('e.name: ' + e.name);
      //}

      const state_new = im_state.toJS();
      //const state_new = Object.assgn({}, im_state.toJS(), {})


      //const rec = im.Record({id: 0, description: 'hoge'});



      //for(let key in state_new.arr_pages[idx].items){
      //  state_new.arr_pages[idx].items[key].name = 'hoge';
      //}
      //item_list.items = state.arr_pages[id].items;
      //if(idx == 0){
        //console.log('pane-item-list <> idx: ' + idx);
        //console.log('pane-item-list <> msg_cmd: ' + msg_cmd);
        //console.log('-------------------------------------');
        //for(let e of state_new.arr_pages[idx].items){
        //  console.log('e.name: ' + e.name);
        //}
        //console.log('-------------------------------------');
      //}

      return state_new;

    default:
      //console.log('reducer: default <> state.arr_item_list[0].id: ' + state.arr_item_list[0].id);
      //for (let e of state.item_list.items){
      //  console.log(e.name);
      //}
      return state;
  }
}

export default CombinedItemList;
