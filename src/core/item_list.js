'use strict';

let electron = require('electron');
let ipc_renderer = electron.ipcRenderer;

let fs = require('fs');
let path = require('path');
let util = require('util')

import im from 'immutable';
import Item from './item';
import {ITEM_TYPE_KIND} from './item_type';

const ItemListPaneRecord = im.Record({
  dir_cur: null,
  items_selected: {},
  reg_pat: '',
  line_cur: 0,
  items: null,
  items_match: null
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
    //console.log('call updateItems()!!');
    let dir_cur = this.get('dir_cur')
    let es = ipc_renderer.sendSync('fs.readdirSync', dir_cur);
    /* If file access of fs.readdirSync is denied, es == null */
    if(es == null){
      console.log('ERROR <> es is null!!');
      return null;
    }

    let c = 0;
    //const items = im.Seq(im.Range(0, es.length))
    //                .map((e, i) => {
    //                  //console.log('c: ' + c + ', dir_cur: ' + dir_cur + ', es[' + i + ']: ' + es[i]);
    //                  let is_dir = ipc_renderer.sendSync('fs.isDirectory', path.join(dir_cur, es[i]));
    //                  //fs.stat();
    //                  console.log('i: ' + i + ', e: ' + e);
    //                  c++;
    //                  return new Item({name: es[i], is_dir: is_dir}).init();
    //                });

    //const items = im.List(im.Range(0, es.length))
    const items = im.Seq(im.Range(0, es.length))
                    .map((e, i) => {
                      //console.log('c: ' + c + ', dir_cur: ' + dir_cur + ', es[' + i + ']: ' + es[i]);
                      const fpath = path.join(dir_cur, es[i]);
                      const ret = ipc_renderer.sendSync('fs.isDirectory', fpath);
                      if(ret['err'] === 0){
                        const fsize = ret['is_dir'] === true
                                        ? 'DIR'
                                        : ret['fsize'];
                        //console.log('mtime: ' + ret['mtime']);
                        const date = ret['mtime'].slice(2, 10);
                        const time = ret['mtime'].slice(11, 19);
                        //console.log('date: ' + ret['mtime'].slice(2, 10));
                        //console.log('time: ' + ret['mtime'].slice(11, 19));
                        return new Item({id: i,
                                         name: es[i],
                                         is_dir: ret['is_dir'],
                                         fsize: fsize,
                                         date: date,
                                         time: time}).init();
                      }else{
                        return new Item({name: es[i]}).init();
                      }
                      //fs.stat();
                      //console.log('i: ' + i + ', e: ' + e);
                      c++;
                    });

    //const ret = this.set('items', items);

    const ret = this.withMutations(s => s.set('items', items)
                                         .set('items_match', items));

    return ret;
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

function getItemTypeKind(ext, is_dir){
  //console.log('call getItemTypeKind()!!');
  if(is_dir){
    return ITEM_TYPE_KIND.DIR;
  }

  const opt = {sensitivity: 'base'};

  if(ext.localeCompare('txt', 'en', opt) == 0){
    return ITEM_TYPE_KIND.TEXT;
  }else if(ext.localeCompare('exe', 'en', opt) == 0){
    return ITEM_TYPE_KIND.EXE;
  }else if( (ext.localeCompare('lib', 'en', opt) == 0) ||
            (ext.localeCompare('dll', 'en', opt) == 0) ||
            (ext.localeCompare('a',   'en', opt) == 0) ||
            (ext.localeCompare('so',  'en', opt) == 0) ){
    return ITEM_TYPE_KIND.BIN;
  }else if( (ext.localeCompare('jpg',  'en', opt) == 0) ||
            (ext.localeCompare('jpeg', 'en', opt) == 0) ||
            (ext.localeCompare('png',  'en', opt) == 0) ||
            (ext.localeCompare('gif',  'en', opt) == 0) ||
            (ext.localeCompare('bmp',  'en', opt) == 0) ){
    return ITEM_TYPE_KIND.IMAGE;
  }else if( (ext.localeCompare('mp4',  'en', opt) == 0) ||
            (ext.localeCompare('avi',  'en', opt) == 0) ||
            (ext.localeCompare('mpeg', 'en', opt) == 0) ){
    return ITEM_TYPE_KIND.MOVIE;
  }else if(ext.localeCompare('mp3', 'en', opt) == 0){
    return ITEM_TYPE_KIND.SOUND;
  }else if( (ext.localeCompare('zip', 'en', opt) == 0) ||
            (ext.localeCompare('rar', 'en', opt) == 0) ){
    return ITEM_TYPE_KIND.ARCHIVE;
  }else{
    return ITEM_TYPE_KIND.OTHER;
  }
}

module.exports = ItemListPane;
