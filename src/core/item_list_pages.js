'use strict';

const electron = require('electron');
const ipc_renderer = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
const util = require('util');

import im from 'immutable';
import ItemList from './item_list';


const DISK_DRIVE = 'Disk Drives';

let STATE_SEARCH_FILTER = {
  NONE      : 0,
  FILTERING : 1,
  FILTERED  : 2,
};

const ItemListPagesRecord = im.Record({
  pages: im.Map(),
  msg_cmd: '',
  dir_cur: null
});

class ItemListPages extends ItemListPagesRecord{
  constructor(props){
    super(props);
  }

  isDirRegistered(dir_cur){
    //console.log('isDirRegistered() Start!!');
    const ret = this.get('pages')
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

  changeDrive(drive_list){
    const items = new ItemList()
                      .set('dir_cur', DISK_DRIVE)
                      .updateItemsAsDiskDrive(drive_list);

    return this.withMutations(s => s.set('dir_cur', DISK_DRIVE)
                                    .setIn(['pages', DISK_DRIVE], items));

  }


  updatePageCur(_dir_cur){
    const dir_cur = fs.realpathSync(_dir_cur);
    //console.log('updatePageCur <> dir_cur: ' + dir_cur + ', _dir_cur: ' + _dir_cur);

    if( this.isDirRegistered(dir_cur) ){
      const items = this.getIn(['pages', dir_cur, 'items']);
      //console.log('updatePageCur <> isDirRegistered()');
      //console.log('updatePageCur() <> items[0].name: ' + items.getIn([0, 'name']));
      return this.withMutations(s => s.setIn(['pages', dir_cur, 'items_match'], items)
                                      .set('dir_cur', dir_cur));
    //}else{
    //  console.log('updatePageCur <> !isDirRegistered()');
    }

    const items = new ItemList()
                      .set('dir_cur', dir_cur)
                      .updateItems();

    return this.withMutations(s => s.set('dir_cur', dir_cur)
                                    .setIn(['pages', dir_cur], items));

  }

  changeDirUpper(){
    const dir_cur = path.parse(this.get('dir_cur')).dir; 
    return this.updatePageCur(dir_cur);
  }

  changeDirLower(){
    if(this.get('pages').size <= 0){
      return this;
    }

    const dir_cur = this.get('dir_cur');
    const items = this.getIn(['pages', dir_cur]);
    const line_cur = items.get('line_cur');
    const item_name = items.getIn(['items_match', line_cur, 'name']);

    //console.log('item_name: ' + item_name);
    if(typeof item_name === 'undefined'){
      return this;
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
      return this.updatePageCur(path_new);
    }else{
      return this;
    }
  }

}

module.exports = ItemListPages;
