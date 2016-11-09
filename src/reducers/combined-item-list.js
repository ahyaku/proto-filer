'use strict';

import fs from 'fs';
import im from 'immutable';
import ItemListCore from '../core/item_list';
import { KEY_INPUT_MODE } from '../core/item_type';

function CombinedItemList(state, action){
  switch(action.type){
  //  case 'MOVE_CURSOR_UP':
  //    {
  //      let arr_pages = state.arr_pages;
  //      for(let i=0; i<arr_pages.length; i++){
  //        arr_pages[i].page_cur.items = state.arr_pages[i].page_cur.items;
  //      }
  //      const idx = state.active_pane_id;
  //      arr_pages[idx].page_cur.line_cur = arr_pages[idx].page_cur.line_cur - 1;
  //      return Object.assign({}, state,
  //                           {arr_pages: arr_pages},
  //                           {action_type: action.type});
  //    }
    case 'MOVE_CURSOR_DOWN':
      {
        console.log('1-------------------------');
        const idx = state.get('active_pane_id');
        console.log('2-------------------------');
        const path_cur = state.getIn(['arr_pages', idx, 'path_cur']);
        console.log('3-------------------------');
        const line_cur = state.getIn(['arr_pages', idx, 'pages', path_cur, 'line_cur']);
        console.log('4-------------------------');
        const len = state.getIn(['arr_pages', idx, 'pages', path_cur, 'items']).size;
        console.log('5-------------------------');

        //return state;

        return state.updateIn(['arr_pages', idx, 'pages', path_cur, 'line_cur'],
                              (v) => {
                                const vv = v + 1;
                                if(vv < 0){
                                  return len - 1;
                                }else if(vv >= len){
                                  return 0;
                                }else{
                                  return vv;
                                }
                              });

        //return state.updateIn(['arr_pages', idx, 'pages', path_cur, 'line_cur'],
        //                      (v) => {
        //                        return 2;
        //                      });

        //return state.updateIn(['arr_pages', idx, 'pages', path_cur, 'line_cur'],
        //                      (v) => {
        //                        return 1;
        //                      });

        //return state.setIn(['arr_pages', idx, 'pages', path_cur, 'line_cur'], 2);
      }
      //{
      //  let arr_pages = state.arr_pages;
      //  for(let i=0; i<arr_pages.length; i++){
      //    arr_pages[i].page_cur.items = state.arr_pages[i].page_cur.items;
      //  }
      //  const idx = state.active_pane_id;
      //  arr_pages[idx].page_cur.line_cur = arr_pages[idx].page_cur.line_cur + 1;
      //  return Object.assign({}, state,
      //                       {arr_pages: arr_pages},
      //                       {action_type: action.type});
      //}

  //  case 'CHANGE_DIR_UPPER':
  //    {
  //      const idx = state.active_pane_id;
  //      let state_new = Object.assign({}, state);
  //      state_new.arr_pages[idx].changeDirUpper();
  //      state_new.action_type = action.type;
  //      return state_new;
  //    }
  //  case 'CHANGE_DIR_LOWER':
  //    {
  //      const idx = state.active_pane_id;
  //      let state_new = Object.assign({}, state);
  //      state_new.arr_pages[idx].changeDirLower();
  //      state_new.action_type = action.type;
  //      return state_new;
  //    }
  //  case 'SWITCH_ACTIVE_PANE':
  //    let active_pane_id;
  //    switch(state.active_pane_id){
  //      case 0:
  //        return Object.assign({}, state,
  //                             {active_pane_id: 1},
  //                             {action_type: action.type});
  //      case 1:
  //        return Object.assign({}, state,
  //                             {active_pane_id: 0},
  //                             {action_type: action.type});
  //      default:
  //        /* Do Nothing.. */
  //        console.log('ERROR!! Incorrect Value \'active_pane_id\'!!');
  //        return Object.assign({}, state,
  //                             {action_type: action.type});
  //    }

  //  case 'SWITCH_INPUT_MODE_NORMAL':
  //    return Object.assign({}, state, {input_mode: KEY_INPUT_MODE.NORMAL});
  //  case 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS':
  //    return Object.assign({}, state,
  //                         {input_mode: KEY_INPUT_MODE.SEARCH});
  //  case 'RECEIVE_INPUT':
  //    const idx = state.active_pane_id;

  //    const msg_cmd = state.arr_pages[idx].msg_cmd;
  //    const pattern = msg_cmd.slice(1, msg_cmd.length);

  //    const im_state = im.fromJS(state);
  //    const reg = new RegExp(pattern);

  //    const tmp = { arr_pages: [{name: 'name0', age: 0}, {name: 'name1', age: 1}, {name: 'name2', age: 2}], other: "other_hoge"  };
  //    const im_tmp = im.fromJS(tmp);
  //    const t = im_tmp.getIn(['arr_pages', 0]);
  //    console.log('t: ' + t);

  //    console.log('test: ' + state.arr_pages[idx].test);
  //    const im_items_org = im_state.getIn(['arr_pages', idx]);
  //    console.log('im_items_org: ' + im_items_org);

  //    const im_items = im.List(im.List(im_state.get('arr_pages')).get(idx).items);

  //    const im_filtered = im_items.filter(function(e){
  //      return (e.name.search(reg) > -1);
  //    });
  //    const filtered = im_filtered.toJS();
  //    console.log('-------------------------------------');
  //    for(let e of filtered){
  //      console.log('e.name: ' + e.name);
  //    }
  //    console.log('-------------------------------------');

  //    const items = im_items.toJS();

  //    const state_new = im_state.toJS();

  //    return state_new;

    default:
      return state;
  }

}

export default CombinedItemList;
