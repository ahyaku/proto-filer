'use strict';

const electron = require('electron');
const ipc_renderer = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
//const $ = require('jquery');
const util = require('util');

//const item_list = require('./item_list');

import im from 'immutable';
import ItemList from './item_list';


let STATE_SEARCH_FILTER = {
  NONE      : 0,
  FILTERING : 1,
  FILTERED  : 2,
};

const ItemListPagesRecord = im.Record({
  //pages: im.List.of(),
  pages: im.Map(),
  msg_cmd: '',
  path_cur: null
});

class ItemListPages extends ItemListPagesRecord{
  constructor(props){
    super(props);
  }

  updatePageCur(path){
    //if(!ipc_renderer.sendSync('fs.isDirectory', init_path)){
    //  console.log('updatePageCur() <> NOT Directory!!');
    //  this._items = this._page_cur.items;
    //  return this._page_cur;
    //}

    //if(init_path in this._pages){
    //  this._page_cur = this._pages[init_path];
    //  this._page_cur.updateItems();
    //}else{
    //  let page = new item_list();
    //  page.dir_cur = fs.realpathSync(init_path);
    //  if(!page.updateItems()){
    //    return;
    //  }

    //  this._pages[init_path] = page;
    //  this._page_cur = this._pages[init_path];
    //}

    //this._items = this._page_cur.items;

    //if(this.get('pages').findKey(path)){
    //  //console.log('true');
    //}else{
    //  //console.log('false');
    //}

    //const ret = this.get('pages')
    //                .findKey((k)=>{
    //                  console.log('k: ' + k);
    //                  console.log('path: ' + path);
    //                  return k == path;
    //                });

    const ret = this.get('pages')
                    .findKey((item_list)=>{
                      //console.log('item_list.get(dir_cur): ' + item_list.get('dir_cur'));
                      //console.log('path: ' + path);
                      return (item_list.get('dir_cur') === path);
                    },
                    null);

    //console.log('ret: ' + ret);
    //console.log('--------------------------------------------------');

    if(typeof ret !== "undefined"){
      console.log('HERE!!');
      return this.set('path_cur', path);
    }

    const items = new ItemList()
                      .set('dir_cur', path)
                      .updateItems();

    return this.set('pages', this.pages.set(path, items))
               .set('path_cur', path);
  }

}

//class ItemListPages{
//  constructor(){
//    this._pages = {};
//    this._msg_cmd = '';
//
//    this._test = {are: 'ARE', you: 'YOU', known: 'KNOWN'};
//  }
//
//  get test(){
//    return this._test;
//  }
//
//  set msg_cmd(msg_cmd){
//    this._msg_cmd = msg_cmd;
//  }
//  get msg_cmd(){
//    return this._msg_cmd;
//  }
//
//  get dir_cur(){
//    return this._page_cur.dir_cur;
//  }
//
//  filterItems(pattern){
//    if(pattern == ''){
//      return this._page_cur.items;
//    }else{
//      let reg = new RegExp(pattern);
//      return this._page_cur.items.filter(function(e){
//        return e.name.match(reg);
//      });
//    }
//  }
//
//  set items(items){
//    this._items = items;
//  }
//
//  get items(){
//    return this._items;
//  }
//  get line_cur(){
//    return this._page_cur.line_cur;
//  }
//  get items_selected(){
//    return this._page_cur.items_selected;
//  }
//  get item_name_cur(){
//    return this._page_cur.item_name_cur;
//  }
//
//  get path_parent(){
//    return path.parse(this._page_cur.dir_cur).dir;
//  }
//
//  get path_item_cur(){
//    let lined_item = this._page_cur.items[this._page_cur.line_cur].name;
//    return path.join(this._page_cur.dir_cur, lined_item);
//  }
//
//  get page_cur(){
//    return this._page_cur;
//  }
//
//  updatePageCur(init_path){
//    if(!ipc_renderer.sendSync('fs.isDirectory', init_path)){
//      console.log('updatePageCur() <> NOT Directory!!');
//      this._items = this._page_cur.items;
//      return this._page_cur;
//    }
//
//    if(init_path in this._pages){
//      this._page_cur = this._pages[init_path];
//      this._page_cur.updateItems();
//    }else{
//      let page = new item_list();
//      page.dir_cur = fs.realpathSync(init_path);
//      if(!page.updateItems()){
//        return;
//      }
//
//      this._pages[init_path] = page;
//      this._page_cur = this._pages[init_path];
//    }
//
//    this._items = this._page_cur.items;
//  }
//
//  changeDirUpper(){
//    let init_path = path.parse(this._page_cur.dir_cur).dir; 
//    this.updatePageCur(init_path, true);
//  }
//
//  changeDirLower(){
//    if(this._page_cur.items.length <= 0){
//      return;
//    }
//
//    let lined_item = this._page_cur.items[this._page_cur.line_cur].name;
//    let init_path = path.join(this._page_cur.dir_cur, lined_item);
//
//    if(ipc_renderer.sendSync('fs.isDirectory', init_path)){
//      this.updatePageCur(init_path, true);
//
//    }
//  }
//
//  cursorUp(){
//    this._page_cur.cursorUp();
//  }
//
//  cursorDown(){
//    this._page_cur.cursorDown();
//  }
//
//  drawCursor(cn){
//    this._page_cur.drawCursor(cn);
//  }
//
//  scrollPane(e, cn){
//    this._page_cur.scrallPane(e, cn);
//  }
//
//  toggleUp(){
//    this._page_cur.toggleUp();
//  }
//
//  toggleDown(){
//    this._page_cur.toggleDown();
//  }
//
//  toggleItemSelect(){
//    this._page_cur.toggleItemSelect();
//  }
//
//  updatePane(){
//    this._page_cur.updatePane();
//  }
//}

module.exports = ItemListPages;
