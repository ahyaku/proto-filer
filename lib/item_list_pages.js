'use strict';

const electron = require('electron');
const ipc_renderer = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
const keypress = require('keypress');

const item_list = require('./item_list');

class ItemListPages{
  constructor(id_pane, id_dir_cur, mediator){
    this._pages = {};
    this._id_pane = id_pane;
    this._id_dir_cur = id_dir_cur;
    this._mediator;
    //keypress(process.stdin);
  }

  get dir_cur(){
    return this._page_cur.dir_cur;
  }
  get items(){
    return this._page_cur.items;
  }
  get line_cur(){
    return this._page_cur.line_cur;
  }
  get id(){
    return this._page_cur.id;
  }
  get id_dir_cur(){
    return this._page_cur.id_dir_cur;
  }
  get items_selected(){
    return this._page_cur.items_selected;
  }
  get item_name_cur(){
    return this._page_cur.item_name_cur;
  }

  get path_parent(){
    return path.parse(this._page_cur.dir_cur).dir;
  }

  get path_item_cur(){
    let lined_item = this._page_cur.items[this._page_cur.line_cur].name;
    return path.join(this._page_cur.dir_cur, lined_item);
  }

  changeDirUpper(){
    //console.log('changeDirUpper(): dir_cur: ' + pane_active.dir_cur);
    //console.log('changeDirUpper(): init_path: ' + init_path);

    let init_path = path.parse(this._page_cur.dir_cur).dir; 
    this.updatePageCur(init_path, true);
  }

  changeDirLower(){
    if(this._page_cur.items.length <= 0){
      return;
    }

    let lined_item = this._page_cur.items[this._page_cur.line_cur].name;
    let init_path = path.join(this._page_cur.dir_cur, lined_item);

    if(fs.statSync(init_path).isDirectory){
      this.updatePageCur(init_path, true);

    }

  }

  updatePageCur(init_path, enabled){
    if(!fs.statSync(init_path).isDirectory()){
      console.log('updatePageCur() <> NOT Directory!!');
      return this._page_cur;
    }

    //console.log('updatePageCur() <> init_path: ' + init_path);
    if(init_path in this._pages){
      //console.log('updatePageCur() <> stored page!! id_pane: ' + this._id_pane);
      this._page_cur = this._pages[init_path];
      this._page_cur.drawItems();
      this._page_cur.drawCursor(this._page_cur.line_cur);
    }else{
      //console.log('updatePageCur() <> new page!! id_pane: ' + this._id_pane);
      this._pages[init_path] = new item_list(this._id_pane);
      this._page_cur = this._pages[init_path];

      this._page_cur.dir_cur = fs.realpathSync(init_path);
      this._page_cur.id_dir_cur = this._id_dir_cur;
      this._page_cur.enabled = enabled;
      this._page_cur.mediator = this._mediator;
      this._page_cur.drawItems();
      this._page_cur.drawCursor(0);
    }
  }

  cursorUp(){
    this._page_cur.cursorUp();
  }

  cursorDown(){
    this._page_cur.cursorDown();
  }

  switchPane(enabled){
    this._page_cur.switchPane(enabled);
  }

  drawCursor(cn){
    this._page_cur.drawCursor(cn);
  }

  scrollPane(e, cn){
    this._page_cur.scrallPane(e, cn);
  }

  toggleItemSelect(){
    this._page.cur.toggleItemSelect();
  }

  isearch(){
    //process.stdin.on('keypress', function(ch, key){
    //  console.log('keypress key: ' + key);
    //  if(key && key.ctrl && key.name == 'c'){
    //    process.stdin.pause();
    //  }
    //});
    //process.stdin.setRawMode(true);
    //process.stdin.resume();
  }

}

module.exports = ItemListPages;
