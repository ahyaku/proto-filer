'use strict';

const electron = require('electron');
const ipc_renderer = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
const util = require('util');

import im from 'immutable';
import { updateItemsAsDiskDrive, updateItems, DISK_DRIVE } from './item_list';


//let STATE_SEARCH_FILTER = {
//  NONE      : 0,
//  FILTERING : 1,
//  FILTERED  : 2,
//};
//
//const ItemListPagesRecord = im.Record({
//  pages: im.Map(),
//  msg_cmd: '',
//  dir_cur: null
//});
//
//class ItemListPages extends ItemListPagesRecord{
//  constructor(props){
//    super(props);
//  }
//
//}


function isDirRegistered(pages_fcd_src, dir_cur){
  //console.log('isDirRegistered() Start!!');
  const ret = pages_fcd_src.get('pages')
                  .findKey((page)=>{
                    return (page.get('dir_cur') === dir_cur);
                  },
                  null);

  if(typeof ret === "undefined"){
    //console.log('isDirRegistered() false');
    return false;
  }else{
    //console.log('isDirRegistered() true');
    return true;
  }
}

export function changeDrive(pages_fcd_src, drive_list){
  //const items = new ItemList()
  //                  .set('dir_cur', DISK_DRIVE)
  //                  .updateItemsAsDiskDrive(drive_list);

  //return this.withMutations(s => s.set('dir_cur', DISK_DRIVE)
  //                                .setIn(['pages', DISK_DRIVE], items));


  const items = updateItemsAsDiskDrive(drive_list);
  console.log('changeDrive <> items: ', items.getIn(['items', 0]));
  return pages_fcd_src.withMutations( s => s.set('dir_cur', DISK_DRIVE)
                                            .setIn(['pages', DISK_DRIVE], items));
}


export function updatePageCur(pages_fcd_src, _dir_cur){
  const dir_cur = fs.realpathSync(_dir_cur);
  //console.log('updatePageCur <> dir_cur: ' + dir_cur + ', _dir_cur: ' + _dir_cur);

//  if( this.isDirRegistered(dir_cur) ){
//    const items = this.getIn(['pages', dir_cur, 'items']);
//    //console.log('updatePageCur <> isDirRegistered()');
//    //console.log('updatePageCur() <> items[0].name: ' + items.getIn([0, 'name']));
//    return this.withMutations(s => s.setIn(['pages', dir_cur, 'items_match'], items)
//                                    .set('dir_cur', dir_cur));
//  //}else{
//  //  console.log('updatePageCur <> !isDirRegistered()');
//  }
//
//  const items = updateItems(dir_cur);
//
//  return this.withMutations(s => s.set('dir_cur', dir_cur)
//                                  .setIn(['pages', dir_cur], items));

  //console.log('updatePageCur <> pages_fcd_src: ', pages_fcd_src);

  if(pages_fcd_src === null){
    const items = updateItems(dir_cur);
    return im.Map({ 'dir_cur': dir_cur }).setIn(['pages', dir_cur], items);
  }else if( isDirRegistered(pages_fcd_src, dir_cur) ){
    const items = pages_fcd_src.getIn(['pages', dir_cur, 'items']);
    //console.log('updatePageCur <> isDirRegistered()');
    //console.log('updatePageCur() <> items[0].name: ' + items.getIn([0, 'name']));
    return pages_fcd_src.withMutations(s => s.setIn(['pages', dir_cur, 'items_match'], items)
                                             .set('dir_cur', dir_cur));
  //}else{
  //  console.log('updatePageCur <> !isDirRegistered()');
  }else{
    const items = updateItems(dir_cur);
    return pages_fcd_src.withMutations(s => s.set('dir_cur', dir_cur)
                                             .setIn(['pages', dir_cur], items));
  }


}

export function changeDirUpper(pages_fcd_src){
  const dir_cur = path.parse(pages_fcd_src.get('dir_cur')).dir; 
  return updatePageCur(pages_fcd_src, dir_cur);
}

export function changeDirLower(pages_fcd_src){
  if(pages_fcd_src.get('pages').size <= 0){
    return pages_fcd_src;
  }

  const dir_cur = pages_fcd_src.get('dir_cur');
  const items = pages_fcd_src.getIn(['pages', dir_cur]);
  const line_cur = items.get('line_cur');
  const item_name = items.getIn(['items_match', line_cur, 'name']);

  //console.log('item_name: ' + item_name);
  if(typeof item_name === 'undefined'){
    return pages_fcd_src;
  }

  let path_new;
  switch(dir_cur){
    case DISK_DRIVE:
      path_new = item_name;
      break;
    default:
      path_new = path.join(dir_cur, item_name);
      break;
  }

  const ret = ipc_renderer.sendSync('fs.isDirectory', path_new)
  if(ret['is_dir']){
    return updatePageCur(pages_fcd_src, path_new);
  }else{
    return pages_fcd_src;
  }
}



//module.exports = ItemListPages;
