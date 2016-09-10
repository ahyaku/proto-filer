'use strict';

const electron = require('electron');
const ipc_renderer = electron.ipcRenderer;
const fs = require('fs');
const keypress = require('keypress');

const item_list = require('./item_list');

class ItemListPages{
  constructor(id_pane, id_dir_cur){
    this._pages = {};
    this._id_pane = id_pane;
    this._id_dir_cur = id_dir_cur;
    //keypress(process.stdin);
  }

  updatePageCur(init_path, enabled, mediator){

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
      this._page_cur.mediator = mediator;
      this._page_cur.drawItems();
      this._page_cur.drawCursor(0);
    }

    return this._page_cur;
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
