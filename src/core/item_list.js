'use strict';

let electron = require('electron');
let ipc_renderer = electron.ipcRenderer;

let fs = require('fs');
let path = require('path');
let util = require('util')

import im from 'immutable';
import Item from './item';


const ItemListPaneRecord = im.Record({
  dir_cur: null,
  items_selected: {},
  reg_pat: '',
  line_cur: 0,
  items: null
});

class ItemListPane extends ItemListPaneRecord{
  constructor(props){
    super(props);
  }

  //setDirCur(dir_cur){
  //  return this.set('dir_cur', dir_cur);
  //}
  //getDirCur(){
  //  return this.get('dir_cur');
  //}


  updateItems(){
    let dir_cur = this.get('dir_cur')
    let es = ipc_renderer.sendSync('fs.readdirSync', dir_cur);
    /* If file access of fs.readdirSync is denied, es == null */
    if(es == null){
      console.log('ERROR <> es is null!!');
      return null;
    }

    //console.log('es.length: ' + es.length);
    //es.map((e, i) => {
    //  console.log(i + ' name: ' + e);
    //});

    //let items = new Array();
    //es.map(function(e){
    //  const item = new Item();
    //  item.name = e;
    //  item.is_dir = ipc_renderer.sendSync('fs.isDirectory', path.join(dir_cur, e));
    //  items.push(item);
    //});
    //this._items = items;
    //this._inum_filterd = this._items.length;

    //const items = im.Range(0, es.length)
    //                    .map(i => new Item().setName(es[i]));
    
    const items = im.Range(0, es.length)
                    .map((i) => {
                      let is_dir = ipc_renderer.sendSync('fs.isDirectory', path.join(dir_cur, es[i]));
                      return new Item({name: es[i], is_dir: is_dir});
                    });
    
    //let item_list_js = items.toJS();
    //item_list_js.map((e, i) => {
    //  console.log(i + ' name(' + e.is_dir + '): ' + e.name);
    //});

    //items.forEach((e) => {
    //  console.log('name: ' + e.get('name'));
    //  return e;
    //});

    //console.log('hoge: ' + items);

    //return items;

    return this.set('items', items);
  }
  
}

//class ItemListPane{
//  constructor(){
//    this._items_selected = {};
//    this._reg_pat = '';
//    this._line_cur = 0;
//    this._scroll_top = 0;
//  }
//  set dir_cur(dir_cur){
//    if(!fs.statSync(dir_cur).isDirectory()){
//      util.format('ERROR!!: $s is NOT directory', dir_cur);
//      return null;
//    }
//    this._dir_cur = dir_cur;
//  }
//  get dir_cur(){
//    return this._dir_cur;
//  }
//  set line_cur(line_cur){
//    this._line_cur = line_cur;
//    if( line_cur < 0 ){
//      this._line_cur = this._items.length - 1;
//    }else if( line_cur >= this._items.length ){
//      this._line_cur = 0;
//    }else{
//      this._line_cur = line_cur;
//    }
//  }
//
//  get line_cur(){
//    return this._line_cur;
//  }
//  set is_focused(is_focused){
//    this._is_focused = is_focused;
//  }
//  get is_focused(){
//    return this._is_focused;
//  }
//
//  updateItems(){
//    let dir_cur = this._dir_cur;
//    let es = ipc_renderer.sendSync('fs.readdirSync', dir_cur);
//    /* If file access of fs.readdirSync is denied, es == null */
//    if(es == null){
//      console.log('ERROR <> es is null!!');
//      return false;
//    }
//
//    let items = new Array();
//    es.map(function(e){
//      let item = new Item();
//      item.name = e;
//      item.is_dir = ipc_renderer.sendSync('fs.isDirectory', path.join(dir_cur, e));
//      items.push(item);
//    });
//    this._items = items;
//    this._inum_filterd = this._items.length;
//
//    return true;
//  }
//
//  set items(items){
//    this._items = items;
//  }
//  get items(){
//    return this._items;
//  }
//
//  set mediator(mediator){
//    this._mediator = mediator;
//  }
//  get mediator(){
//    return this._mediator;
//  }
//  get items_selected(){
//    return this._items_selected;
//  }
//  set scroll_top(scroll_top){
//    this._scroll_top;
//  }
//  get scroll_top(){
//    return this._scroll_top;
//  }
//
//  cursorUp(){
//    this.drawCursor(this._line_cur-1);
//  }
//
//  cursorDown(){
//    this.drawCursor(this._line_cur+1);
//  }
//
//  switchPane(is_focused){
//    this._is_focused = is_focused;
//    this.drawCursor(this._line_cur);
//    this.drawDirCur();
//  }
//
//  drawCursor(cn){
//    if(this._inum_filterd <= 0){
//      return;
//    }
//
//    let e = document.getElementById(this._eid).childNodes;
//    let cc = (this._line_cur < this._inum_filterd) ? this._line_cur : this._inum_filterd-1;
//    if( cn < 0 ){
//      cn = this._inum_filterd - 1;
//    }else if( cn >= this._inum_filterd ){
//      cn = 0;
//    }
//
//    e[cc].style.borderBottomColor = '#000000';
//    e[cc].style.zIndex = '0';
//    if(this._is_focused == true){
//      e[cn].style.borderBottomColor = '#00FF00';
//      e[cn].style.zIndex = '1';
//      this.scrollPane(e, cn);
//    }
//    this._line_cur = cn;
//  }
//
//  toggleUp(){
//    this.toggleItemSelect();
//    this.drawCursor(this._line_cur-1);
//
//  }
//
//  toggleDown(){
//    this.toggleItemSelect();
//    this.drawCursor(this._line_cur+1);
//  }
//
//  updatePane(){
//    this.drawItems();
//    this.drawCursor(0);
//  }
//
//  updatePaneWithRegExp(pattern){
//    this._reg_pat = pattern;
//    this.drawItems();
//    this.drawCursor(0);
//  }
//
//
//  paneStateChanged(){
//    this._mediator.stateChanged();
//  }
//
//  emptySelectedItems(){
//    for(let key in this._items_selected){
//      delete this._items_selected[key];
//    }
//  }
//
//}

module.exports = ItemListPane;
