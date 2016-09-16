'use strict';

const electron = require('electron');
const ipc_renderer = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
const $ = require('jquery');
const util = require('util');

const item_list = require('./item_list');
const PaneCmd = require('./pane_cmd');

let STATE_SEARCH_FILTER = {
  NONE      : 0,
  FILTERING : 1,
  FILTERED  : 2,
};

class ItemListPages{
  constructor(id_pane, id_dir_cur, id_pane_cmd, is_focused, mediator){
    this._pages = {};
    this._id_pane = id_pane;
    this._id_dir_cur = id_dir_cur;
    this._is_focused = is_focused;
    this._mediator = mediator;

    //process.stdin.setRawMode(true);

    this._pane_cmd = new PaneCmd(id_pane_cmd);
    this._pane_cmd.updatePane();
    this._pane_cmd.blur();

    this._state_sf = STATE_SEARCH_FILTER.NONE;
    this._jid = '#' + id_pane_cmd;
    //this._id_pane_cmd = id_pane_cmd;

    //let cb_keyup = this._getCBKeyUp(this._page_cur, this._jid);
    //$(this._jid).on('keyup', cb_keyup);

    //let ptn_keydown;

    //$(this._jid).on('keydown', (e) => {
    //  console.log('keydown!!!!');
    //  return true;
    //});

    $(this._jid).on('keypress', (e) => {
      let val = $(this._jid).val();
      console.log('keypress!!!! val: ' + val);

      /* Ignore the first '/' input by cancelling 'keyup' event when filtering is resumed. */
      if(this._state_sf == STATE_SEARCH_FILTER.FILTERED){
        this._state_sf = STATE_SEARCH_FILTER.FILTERING;
        return false;
      }
      return true;
    });

    $(this._jid).on('keyup', (e) => {
      let val = $(this._jid).val();
      console.log('keyup!!!! val: ' + val);

      if(val.length < 1){
        this.endIsearch();
        this._mediator.updateKeyMode();
      }
      this._page_cur.updatePaneWithRegExp(val.slice(1, val.length));
      return true;
    });

  }

  _getCBKeyUp(page_cur, jid){
    return function(e){
      let val = $(jid).val();
      console.log('cb_keyup <> val: ' + val);
      console.log('cb_keyup <> jid: ' + jid);
      page_cur.updatePaneWithRegExp(val.slice(1, val.length));
    }
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

  get is_focused(){
    return this._is_focused;
  }

  updatePageCur(init_path){
    if(!fs.statSync(init_path).isDirectory()){
      console.log('updatePageCur() <> NOT Directory!!');
      return this._page_cur;
    }

    //console.log('updatePageCur() <> init_path: ' + init_path);
    if(init_path in this._pages){
      //console.log('updatePageCur() <> stored page!! id_pane: ' + this._id_pane);
      this._page_cur = this._pages[init_path];
      this._page_cur.is_focused = this._is_focused;
      this._page_cur.drawItems();
      this._page_cur.drawCursor(this._page_cur.line_cur);
    }else{
      //console.log('updatePageCur() <> new page!! id_pane: ' + this._id_pane);
      this._pages[init_path] = new item_list(this._id_pane);
      this._page_cur = this._pages[init_path];

      this._page_cur.dir_cur = fs.realpathSync(init_path);
      this._page_cur.id_dir_cur = this._id_dir_cur;
      this._page_cur.is_focused = this._is_focused;
      console.log(util.format('updatePageCur <> %s: %d',
                              this._id_pane,
                              this._is_focused));

      this._page_cur.mediator = this._mediator;
      this._page_cur.drawItems();
      this._page_cur.drawCursor(0);
    }

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

  cursorUp(){
    this._page_cur.cursorUp();
  }

  cursorDown(){
    this._page_cur.cursorDown();
  }

  switchPane(is_focused){
    this._is_focused = is_focused;
    this._page_cur.switchPane(is_focused);
    console.log(util.format('switchPane <> %s: %d',
                            this._id_pane,
                            this._is_focused));

  }

  drawCursor(cn){
    this._page_cur.drawCursor(cn);
  }

  scrollPane(e, cn){
    this._page_cur.scrallPane(e, cn);
  }

  toggleItemSelect(){
    this._page_cur.toggleItemSelect();
  }

  updatePane(){
    this._page_cur.updatePane();
  }

  startIsearch(){
    this._pane_cmd.focus();

    let val = $(this._jid).val();
    //if(val.length > 0){
    //  $(this._jid).val(val.slice(0, (val.length - 1)));
    //}

    //this._id_pane_cmd.readOnly = true;
    switch(this._state_sf){
      case STATE_SEARCH_FILTER.NONE:
        break;
      case STATE_SEARCH_FILTER.FILTERING:
        break;
      case STATE_SEARCH_FILTER.FILTERED:
        break;
      default:
        /* Do Nothing.. */
        break;
    }
    console.log('startIsearch <> val: ' + val);
  }

  endIsearch(){
    let val = $(this._jid).val();
    if(val.length <= 1){
      $(this._jid).val('');
      this._state_sf = STATE_SEARCH_FILTER.NONE;
    }else{
      this._state_sf = STATE_SEARCH_FILTER.FILTERED;
    }
    //console.log('endIsearch <> state_sf: ' + this._state_sf);
    this._pane_cmd.blur();
    document.getElementById(this._id_pane).focus();
  }

}

module.exports = ItemListPages;
