'use strict';

import { ipcRenderer } from 'electron';
const fs = require('fs');
const path = require('path');
const util = require('util');

import im from 'immutable';
import { updateItemsAsDiskDrive, updateItems, DISK_DRIVE } from './item_list';


import { initAsItem, initAsDiskDrive } from './item';

/* Before */
//function isDirRegistered(pages_fcd_src, dir_cur){
//  //console.log('isDirRegistered() Start!!');
//  const ret = pages_fcd_src.get('pages')
//                  .findKey((page)=>{
//                    return (page.get('dir_cur') === dir_cur);
//                  },
//                  null);
//
//  if(typeof ret === "undefined"){
//    //console.log('isDirRegistered() false');
//    return false;
//  }else{
//    //console.log('isDirRegistered() true');
//    return true;
//  }
//}

export function getDirIndex(dirs, dir_cur){
  //console.log('isDirRegistered() Start!!');
  const ret = dirs.findIndex((dir)=>{
                    return (dir === dir_cur);
                  },
                  null);

  return ret;

//  if(typeof ret === "undefined"){
//    //console.log('isDirRegistered() false');
//    return false;
//  }else{
//    //console.log('isDirRegistered() true');
//    return true;
//  }

}

//export function changeDrive(pages_fcd_src, drive_list){
//  const items = updateItemsAsDiskDrive(drive_list);
//  console.log('changeDrive <> items: ', items.getIn(['items', 0]));
//  return pages_fcd_src.withMutations( s => s.set('dir_cur', DISK_DRIVE)
//                                            .setIn(['pages', DISK_DRIVE], items));
//}

/* Before */
//export function changeDrive(state, drive_list){
//
//  const dirs = state.get('dirs');
//  const dir_cur = dirs.get(0);
//  const items = updateItemsAsDiskDrive(drive_list);
//  //const page = state.getIn(['pages', dir_cur]);
//
//  const idx_dir = getDirIndex(dirs, dir_cur);
//  const dirs_new = dirs.withMutations(s => s.delete(idx_dir)
//                                            .unshift(dir_cur));
//
//  console.log('changeDrive <> items: ', items.getIn(['items', 0]));
//  return state.withMutations( s => s.set('dir_cur', DISK_DRIVE)
//                                    .setIn(['pages', DISK_DRIVE], items));
//}



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

  const page = im.Map({
                 'items': items,
                 'line_cur': 0,
                 'id_map': im.List(im.Range(0, items.size)),
                 'selected_items': im.List.of()
               });
  //return state.setIn(['pages', DISK_DRIVE], page);
  return state.withMutations(s => s.setIn(['pages', DISK_DRIVE], page)
                                   .set('dirs', dirs_new));
}



/* Need to rename this function. */
export function updatePageCur(state, _dir_cur, line_cur_zero){
  const dir_cur = fs.realpathSync(_dir_cur);
  //console.log('updatePageCur <> dir_cur: ' + dir_cur + ', _dir_cur: ' + _dir_cur);
  //const msg_cmd = '';

  if(state === null){

    const items = _updateItems(dir_cur);
    //console.log('updatePageCur <> items.getIn(1, name) ' + items.getIn([1, 'name']));

    //return im.Map({
    //         'dir_cur': dir_cur,
    //         'items': im.Map({[dir_cur]: items}),
    //         'items_selected': im.Map({[dir_cur]: items}), 
    //         'line_cur': im.Map({[dir_cur]: 0}),
    //         'id_maps': im.Map({[dir_cur]: im.List(im.Range(0, items.size))})
    //       });


    const page = im.Map({
                   'items': items,
                   'line_cur': 0,
                   'id_map': im.List(im.Range(0, items.size)),
                   'selected_items': im.List.of()
                 });

    return im.Map({
             'dirs': im.List.of(dir_cur),
             'pages': im.Map({[dir_cur]: page}),
             'msg_cmd': ''
           });

  }else{
    const dirs = state.get('dirs');
    const idx_dir = getDirIndex(dirs, dir_cur);
    if( idx_dir !== -1 ){
      //const dirs_new = dirs.delete(idx_dir).shift(dirs.get(idx_dir))
      const dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                                .unshift(dir_cur));

      if(line_cur_zero === true){
        //return pages_fcd_src.withMutations(s => s.set('dir_cur', dir_cur)
        //                                         .setIn(['line_cur', dir_cur], 0));
        const page = state.getIn(['pages', dirs_new[0]]);
        return state.withMutations(s => s.set('dirs', dirs_new)
                                                 .setIn(['pages', dir_cur], 0));
      }else{
        //return pages_fcd_src.set('dir_cur', dir_cur);
        return state.set('dirs', dirs_new);
      }

    }else{

      const items = _updateItems(dir_cur);
      const dirs_new = dirs.unshift(dir_cur);

      //return pages_fcd_src.withMutations(s => s.set('dir_cur', dir_cur)
      //                                         .setIn(['items', dir_cur], items)
      //                                         .setIn(['id_maps', dir_cur], im.List(im.Range(0, items.size))));


      const page = im.Map({
                     'items': items,
                     'line_cur': 0,
                     'id_map': im.List(im.Range(0, items.size)),
                     'selected_items': im.List.of()
                   });

      return state.withMutations(s => s.set('dirs', dirs_new)
                                       .setIn(['pages', dir_cur], page));

    }

  }
    
}

/* Before */
//export function changeDirUpper(pages_fcd_src){
//  const dir_cur = path.parse(pages_fcd_src.get('dir_cur')).dir; 
//  return updatePageCur(pages_fcd_src, dir_cur, false);
//}

export function changeDirUpper(state){
  const dir = path.parse(state.getIn(['dirs', 0])).dir; 
  //console.log('changeDirUpper() <> dir: ' + dir);
  return updatePageCur(state, dir, false);
}

/* Before */
//export function changeDirLower(pages_fcd_src){
//  if(pages_fcd_src.get('pages').size <= 0){
//    return pages_fcd_src;
//  }
//
//  const dir_cur = pages_fcd_src.get('dir_cur');
//  const items = pages_fcd_src.getIn(['pages', dir_cur]);
//  const line_cur = items.get('line_cur');
//  const item_name = items.getIn(['items_match', line_cur, 'name']);
//
//  //console.log('item_name: ' + item_name);
//  if(typeof item_name === 'undefined'){
//    return pages_fcd_src;
//  }
//
//  let path_new;
//  switch(dir_cur){
//    case DISK_DRIVE:
//      path_new = item_name;
//      break;
//    default:
//      path_new = path.join(dir_cur, item_name);
//      break;
//  }
//
//  const ret = ipcRenderer.sendSync('fs.isDirectory', path_new)
//  if(ret['is_dir']){
//    return updatePageCur(pages_fcd_src, path_new, false);
//  }else{
//    return pages_fcd_src;
//  }
//}

export function changeDirLower(state){
  //if(state.get('pages').size <= 0){
  //  return state;
  //}

//  const dir_cur = state.get('dir_cur');
//  const line_cur = state.getIn(['line_cur', dir_cur]);
//  const id_map = state.get('id_maps', dir_cur);
//  const item_name = state.getIn(['items', dir_cur, id_map.get(line_cur)]);

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
