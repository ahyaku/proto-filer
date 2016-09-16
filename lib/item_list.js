'use strict';

let electron = require('electron');
let ipc_renderer = electron.ipcRenderer;

let fs = require('fs');
let path = require('path');
let util = require('util')
let Item = require('./item')

class ItemListPane{
  constructor(id){
    this._id = id;
    this._dir_prev = null;
    this._items_selected = {};
    this._reg_pat = '';
  }
  set id(id){
    this._id = id;
  }
  get id(){
    return this._id;
  }
  set dir_cur(dir_cur){
    if(!fs.statSync(dir_cur).isDirectory()){
      util.format('ERROR!!: $s is NOT directory', dir_cur);
      return null;
    }
    this._dir_prev = this._dir_cur;
    this._dir_cur = dir_cur;
    //this._dir_cur_full = fs.realpathSync(dir_cur)
  }
  get dir_cur(){
    return this._dir_cur;
  }
//  get dir_cur_full(){
//    return this._dir_cur_full;
//  }

  get item_name_cur(){
    let e = document.getElementById(this._id).childNodes;
    let cc = this._line_cur;

    return e[cc].textContent;
  }

  set id_dir_cur(id_dir_cur){
    this._id_dir_cur = id_dir_cur;
  }
  get id_dir_cur(){
    return this._id_dir_cur;
  }

  //set line_cur(line_cur){
  //  //this._line_prv = this._line_cur;
  //  this._line_cur = line_cur;
  //  //if( line_cur < 0 ){
  //  //  this._line_cur = this._items.length - 1;
  //  //}else if( line_cur >= this._items.length ){
  //  //  this._line_cur = 0;
  //  //}else{
  //  //  this._line_cur = line_cur;
  //  //}
  //}

  get line_cur(){
    return this._line_cur;
  }
  set is_focused(is_focused){
    this._is_focused = is_focused;
    this.drawDirCur();
  }
  get is_focused(){
    return this._is_focused;
  }

  drawItems(){
    this.updateItems();
    this._drawItems();
    this.drawDirCur();
  }

  updateItems(){
    let items = new Array();
    let dir_cur = this._dir_cur;
    //let es = fs.readdirSync(dir_cur);
    let es = ipc_renderer.sendSync('fs.readdirSync', dir_cur);
    if(es == null){
      console.log('ERROR <> es is null!!');
      this._dir_cur = this._dir_prev;
      return;
    }

    es.map(function(e){
      let item = new Item();
      item.name = e;
      //item.is_dir = fs.statSync(path.join(dir_cur, e)).isDirectory();
      item.is_dir = ipc_renderer.sendSync('fs.isDirectory', path.join(dir_cur, e));
      items.push(item);
    });
    this._items = items;
    this._inum_filterd = this._items.length;

    //this._items = fs.readdirSync(this._dir_cur);
  }
  get items(){
    return this._items;
  }

  set mediator(mediator){
    this._mediator = mediator;
  }
  get mediator(){
    return this._mediator;
  }
  get items_selected(){
    return this._items_selected;
  }

  _drawItems(){
    let node_id = document.getElementById(this._id);
    let node_frg = document.createDocumentFragment();

    /* Delete the older item list displayed so far. */
    node_id.textContent = null;
    //while(node_id.firstChild) node_id.removeChild(node_id.firstChild);

    /* DEBUG */
    /*
    let i = 0;
    while(node_id.firstChild){
      console.log(i++ + ": node_id.firstChild.innerHTML = " + node_id.firstChild.innerHTML );
      node_id.removeChild(node_id.firstChild);
    }
    */

    //for(let e of this._items){
    //  let node = document.createElement('div');
    //  node.appendChild( document.createTextNode(e.name) );
    //  if(e.is_dir){
    //    node.setAttribute('style', 'color:#FFFFFF;');
    //  }else{
    //    node.setAttribute('style', 'color:#00FF00;');
    //  }
    //  node.style.borderBottomWidth = '2px';
    //  node.style.borderBottomStyle = 'solid';
    //  node.style.borderBottomColor = '#000000';
    //  node_frg.appendChild(node);
    //}

    let reg = new RegExp(this._reg_pat);
    let list = this._items.filter(function(e){
      //console.log(e.name);
      return e.name.match(reg);
    });

    for(let e of list){
      let node = document.createElement('div');
      node.appendChild( document.createTextNode(e.name) );
      if(e.is_dir){
        node.setAttribute('style', 'color:#FFFFFF;');
      }else{
        node.setAttribute('style', 'color:#00FF00;');
      }
      node.style.borderBottomWidth = '2px';
      node.style.borderBottomStyle = 'solid';
      node.style.borderBottomColor = '#000000';
      node_frg.appendChild(node);
    };

    this._inum_filterd = list.length;

    node_id.appendChild(node_frg);
  }

  drawDirCur(){
    let node_id = document.getElementById(this._id_dir_cur);
    if(this._is_focused){
      node_id.setAttribute('style', 'color:#FFFFFF;');
    }else{
      node_id.setAttribute('style', 'color:#CCCCCC;');
    }
    node_id.innerHTML = this._dir_cur;
  }

  cursorUp(){
    this.drawCursor(this._line_cur-1);
  }

  cursorDown(){
    this.drawCursor(this._line_cur+1);
  }

  switchPane(is_focused){
    this._is_focused = is_focused;
    this.drawCursor(this._line_cur);
  }

  drawCursor(cn){
    if(this._inum_filterd <= 0){
      return;
    }

    //let cn = this._line_cur;

    let e = document.getElementById(this._id).childNodes;
    //let cc = (this._line_cur < this._items.length) ? this._line_cur : this._items.length-1;
    let cc = (this._line_cur < this._inum_filterd) ? this._line_cur : this._inum_filterd-1;
    if( cn < 0 ){
      cn = this._inum_filterd - 1;
    }else if( cn >= this._inum_filterd ){
      cn = 0;
    }

    //console.log('line_cur = ' + this._line_cur + ' items.length = ' + this._items.length);
    //console.log(this._id + ': items = ' + this._items);

    //console.log('cc = ' + cc);
    //e[cc].style.borderBottomStyle = 'none';
    //console.log('cc = ' + cc);
    //console.log('e[cc] = ' + e[cc]);

    e[cc].style.borderBottomColor = '#000000';
    //e[cc].style.zIndex = '-1';
    if(this._is_focused == true){
      e[cn].style.borderBottomColor = '#00FF00';
      //e[cn].style.zIndex = '1';
      //e[cn].style.cssText += 'border-width: 2px;';
      //let rect = e[cn].getBoundingClientRect();
      //let rect_pane = pane.getBoundingClientRect();

      this.scrollPane(e, cn);
    }
    this._line_cur = cn;
  }

  scrollPane(e, cn){
    let pane = document.getElementById(this._id);

    //console.log('----------------------------------------------');
    //console.log('pane.scrollTop: ' + pane.scrollTop);
    //console.log('pane.offsetTop: ' + pane.offsetTop);
    //console.log('e[cn].offsetTop: ' + e[cn].offsetTop);
    //console.log(util.format('[pane.scrollWidth, pane.scrollHeight] = [%d, %d]'
    //                                             , pane.scrollWidth
    //                                             , pane.scrollHeight));
    //console.log(util.format('[pane.clientWidth, pane.clientHeight] = [%d, %d]'
    //                                             , pane.clientWidth
    //                                             , pane.clientHeight));

    let line_pos = e[cn].offsetTop + e[cn].clientHeight;
    let scrollTop_abs = pane.scrollTop + pane.offsetTop;
    let scrollBottom_abs = scrollTop_abs + pane.clientHeight;

    if(e[cn].offsetTop < scrollTop_abs){
      scrollTop_abs = e[cn].offsetTop;
      pane.scrollTop = scrollTop_abs - pane.offsetTop; 
    }else if(line_pos > scrollBottom_abs){
      scrollTop_abs = line_pos - pane.clientHeight;
      pane.scrollTop = scrollTop_abs - pane.offsetTop; 
    }
  }

  toggleItemSelect(){
    let e = document.getElementById(this._id).childNodes;
    let cn = this._line_cur;
    //let prop;

    //console.log('toggle: ' + this._items[cn].selected);
    this._items[cn].selected = !this._items[cn].selected;
    //console.log('toggle: ' + this._items[cn].selected);

    //console.log('style.cssText <> ' + e[cn].style.cssText);

    //let color = window.getComputedStyle(e[cn]).getPropertyValue('color');
    //console.log('color <> ' + color);

    //e[cn].style.borderBottomWidth = '2px';
    //e[cn].style.borderBottomStyle = 'solid';

    if(this._items[cn].selected == true){
      //prop = 'color: ' + color + '; background-color: rgba(0, 0, 255, 1);';
      e[cn].style.cssText += 'background: rgba(0, 0, 255, 1);';
      //e[cn].style.borderBottomColor = '#0000FF';
      this._items_selected[this._items[cn].name] = this._items[cn];
      //this._items_selected.push('hoge');
      //console.log('_items: ' + this._items[cn].name);
    }else{
      //prop = 'color: ' + color + '; background-color: rgba(0, 0, 0, 1);';
      e[cn].style.cssText += 'background: rgba(0, 0, 0, 1);';
      //e[cn].style.borderBottomColor = '#000000';
      delete this._items_selected[this._items[cn].name];
    }
    //e[cn].style.cssText += 'min-width: 0;';

    //e[cn].style.borderBottomWidth = '2px';
    //e[cn].style.borderBottomStyle = 'solid';
    //e[cn].style.borderBottomColor = '#000000';
    //e[cn].style.cssText += 'margin: 0px 0px -4px; padding: 0px 0px;';
    //e[cn].style.zIndex = '0';

    /* For DEBUG */
    console.log('--------------------------------');
    let count = 0;
    for(let key in this._items_selected){
      console.log('count: ' + count++ + ', key: ' + key + ', item: ' + this._items_selected[key].name);
    }
    console.log('--------------------------------');

    //console.log('style.cssText <> ' + e[cn].style.cssText);
    //e[cn].setAttribute('style', prop);

  }

  toggleUp(){
    //document.activeElement.blur();
    this.toggleItemSelect();
    this.drawCursor(this._line_cur-1);

  }

  toggleDown(){
    //document.activeElement.blur();
    this.toggleItemSelect();
    this.drawCursor(this._line_cur+1);
  }

  updatePane(){
    this.drawItems();
    this.drawCursor(0);
  }

  updatePaneWithRegExp(pattern){
    this._reg_pat = pattern;
    this.drawItems();
    this.drawCursor(0);
  }


  paneStateChanged(){
    this._mediator.stateChanged();
  }

  emptySelectedItems(){
    for(let key in this._items_selected){
      delete this._items_selected[key];
    }
  }

}

module.exports = ItemListPane;
