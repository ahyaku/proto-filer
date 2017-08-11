'use strict';

import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import im from 'immutable';
import { updateItemsAsDiskDrive, DISK_DRIVE } from './item_list';
import { initAsItem, initAsDiskDrive } from './item';
import { SORT_TYPE } from './item_type';
import { sortItemsCore } from './item_list';


export function getDirIndex(dirs, dir_cur){
  const ret = dirs.findIndex((dir)=>{
                    return (dir === dir_cur);
                  },
                  null);

  return ret;
}

export function changeDrive(state, drive_list){
  const dirs = state.get('dirs');
  const idx_dir = getDirIndex(dirs, DISK_DRIVE);
  let dirs_new;
  if( idx_dir !== -1 ){
    dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                        .unshift(DISK_DRIVE));
  }else{
    dirs_new = dirs.unshift(DISK_DRIVE);
  }

  //console.log('changeDrive <> drive_list.length: ' + drive_list.length);
  
  const items = im.List(im.Range(0, drive_list.length))
                  .map((e, i) => {
                    return initAsDiskDrive(i, drive_list[i]);
                  });

  const is_selected = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return false;
                        });

  const page = im.Map({
                 'items': items,
                 'line_cur': 0,
                 'id_map': im.List(im.Range(0, items.size)),
                 'is_selected': is_selected
               });
  return state.withMutations(s => s.setIn(['pages', DISK_DRIVE], page)
                                   .set('dirs', dirs_new));
}



/* Need to rename this function. */
export function updatePageCur(state, _dir_cur, line_cur_zero){
  const dir_cur = fs.realpathSync(_dir_cur);
  //console.log('updatePageCur <> dir_cur: ' + dir_cur + ', _dir_cur: ' + _dir_cur);

  if(state === null){

    const items = _updateItems(dir_cur);
    //console.log('updatePageCur <> items.getIn(1, name) ' + items.getIn([1, 'name']));

    const is_selected = im.List(im.Range(0, items.size))
                          .map((e, i) => {
                            return false;
                          });

    const page = im.Map({
                   'items': items,
                   'line_cur': 0,
                   'id_map': im.List(im.Range(0, items.size)),
                   'is_selected': is_selected
                 });

    return im.Map({
             'dirs': im.List.of(dir_cur),
             'pages': im.Map({[dir_cur]: page}),
             'item_names': _updateItemNames(items),
             'msg_cmd': '',
             'sort_type': SORT_TYPE.NAME_ASC
           });

  }else{

    //const sort_type = state.get("sort_type");
    const dirs = state.get('dirs');
    const idx_dir = getDirIndex(dirs, dir_cur);

    if( idx_dir === 0 ){ /* "dir_cur" is the current directory. */

      return _loadPage(state, dir_cur); /* reload page to reflesh the displayed item lists as the latest one. */

    }else if( idx_dir !== -1 ){ /* "dir_cur" is not the current directory but already registered in "dirs" */

      const sort_type = state.get("sort_type");
      const dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                                .unshift(dir_cur));

      const page = state.getIn(['pages', dirs_new.get(0)]);
      const items = page.get('items');

      const is_selected = im.List(im.Range(0, items.size))
                            .map((e, i) => {
                              return false;
                            });


      let page_new;
      if(line_cur_zero === true){
        //page_new = page.withMutations(s => s.set('id_map', im.List(im.Range(0, items.size)))
        //                                    .set('is_selected', is_selected)
        //                                    .set('line_cur', 0));
        page_new = page.withMutations(s => s.set('id_map', sortItemsCore( im.List(im.Range(0, items.size)), items, sort_type ))
                                            .set('is_selected', is_selected)
                                            .set('line_cur', 0));
      }else{
        //page_new = page.withMutations(s => s.set('id_map', im.List(im.Range(0, items.size)))
        //                                    .set('is_selected', is_selected));
        page_new = page.withMutations(s => s.set('id_map', sortItemsCore( im.List(im.Range(0, items.size)), items, sort_type ))
                                            .set('is_selected', is_selected));

      }

      const item_names = _updateItemNames(items);
      return state.withMutations(s => s.set('dirs', dirs_new)
                                       .setIn(['pages', dir_cur], page_new)
                                       .set('item_names', item_names)
                                       .set('msg_cmd', ''));

    }else{ /* "dir_cur" is not yet registered in "dirs" */

      return _loadPage(state, dir_cur).set('dirs', dirs.unshift(dir_cur));

    }

  }
}

export function changeDirUpper(state){
  const dir_cur = state.getIn(['dirs', 0]); 
  const name = path.basename(dir_cur);
  const dir_new = path.parse(dir_cur).dir; 

  /* If 'dir_cur' is the root directory, do not change the current directory. */
  if(dir_cur === dir_new){
    return state;
  }

  //console.log('dir_new: ' + dir_new);
  //console.log('name: ' + name);

  const state_new = updatePageCur(state, dir_new, false);
  return _moveLineByName(state_new, name);
}

const _moveLineByName = (state, name) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const items = page.get('items');
  const line_cur = page.get('id_map').findKey(
                     (e) => {
                       return items.getIn([e, 'name']) === name;
                     }
                   );
  //console.log('line_cur: ' + line_cur);

  return state.setIn(['pages', dir, 'line_cur'], line_cur);
}

export function changeDirLower(state){
  //if(state.get('pages').size <= 0){
  //  return state;
  //}

  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const line_cur = page.get('line_cur');
  const id_map = page.get('id_map');
  const item_name = page.getIn(['items', id_map.get(line_cur), 'name']);

  //console.log('item_name: ' + item_name);
  if(typeof item_name === 'undefined'){
    return state;
  }

  let dir_new;
  switch(dir){
    case DISK_DRIVE:
      dir_new = item_name;
      break;
    default:
      dir_new = path.join(dir, item_name);
      break;
  }

  const ret = ipcRenderer.sendSync('fs.isDirectory', dir_new)
  if(ret['is_dir']){
    return updatePageCur(state, dir_new, false);
  }else{
    return state;
  }
}

const _updateItems = (dir_cur) => {
  let es = ['..'];
  let es_tail = ipcRenderer.sendSync('fs.readdirSync', dir_cur);
  Array.prototype.push.apply(es, es_tail);

  /* If file access of fs.readdirSync is denied, es == null */
  if(es == null){
    console.log('ERROR <> es is null!!');
    return null;
  }

//  const items = im.Seq(im.Range(0, es.length))
//                  .map((e, i) => {
//                    return initAsItem(i, es[i], dir_cur);
//                  });


  const items = im.List(im.Range(0, es.length))
                  .map((e, i) => {
                    return initAsItem(i, es[i], dir_cur);
                  });

  return items;
}

const _updateItemNames = (items) => {
  let array = [];
  //console.log('items: ' + items.get(3));
  for(let i=0; i<items.size; i++){
    array.push(items.getIn([i, 'name']));
    //console.log('array[' + i + ']: ' + array[i]);
  }
  return array;
}

const _loadPage = (state, dir_cur) => {
  const sort_type = state.get("sort_type");
  const items = _updateItems(dir_cur);
  const is_selected = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return false;
                        });

  const page = im.Map({
                 'items': items,
                 'line_cur': 0,
                 'id_map': sortItemsCore( im.List(im.Range(0, items.size)), items, sort_type ),
                 'is_selected': is_selected
               });

  const item_names = _updateItemNames(items);

  return state.withMutations(s => s.setIn(['pages', dir_cur], page)
                                   .set('item_names', item_names)
                                   .set('msg_cmd', ''));


}


