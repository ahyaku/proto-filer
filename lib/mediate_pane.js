'use strict';

let electron = require('electron');
let ipc_renderer = electron.ipcRenderer;

let fs = require('fs');
let path = require('path');
let util = require('util');
const shell = electron.shell;
const remote = electron.remote;

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

let item_list_pane = require('./item_list_pane');
let pane_left;
let pane_right;

let ACTIVE_PANE_IS = {
  LEFT    : 0,
  RIGHT   : 1,
};

let CURSOR_MOVE_STATES = {
  STAY  : 0,
  UP    : 1,
  DOWN  : 2,
};

let POPUP_STATES = {
  CLOSED  : 0,
  ACTIVE    : 1,
};


let pane_state;
let pane_active;
let pane_other;

let popup_state;

let menu;
let menu_item;
let click_pos;

class MediatePane{
  //constructor(id_left, id_right, id_dir_cur_left, id_dir_cur_right){
  constructor(id_left, id_right, id_dir_cur_left, id_dir_cur_right,
              init_path_left, init_path_right){

    pane_left = new item_list_pane(id_left);
    pane_right = new item_list_pane(id_right);

    pane_left.dir_cur = fs.realpathSync(init_path_left);
    pane_left.id_dir_cur = id_dir_cur_left;
    //pane_left.line_cur = 0;
    pane_left.enabled = false;
    pane_left.mediator = this;
    pane_left.drawItems();
    pane_left.drawCursor(0);

    pane_right.dir_cur = fs.realpathSync(init_path_right);
    pane_right.id_dir_cur = id_dir_cur_right;
    //pane_right.line_cur = 0;
    pane_right.enabled = true;
    pane_right.mediator = this;
    pane_right.drawItems();
    pane_right.drawCursor(0);

    pane_state = ACTIVE_PANE_IS.RIGHT;
    pane_active = pane_right;
    pane_other = pane_left;
    //pane_active.drawCursor(0);

    //console.log('init: pane_left.dir = ' + pane_left.dir_cur);
    //console.log('init: pane_right.dir = ' + pane_right.dir_cur);

    popup_state = POPUP_STATES.CLOSED;
    ipc_renderer.on('popupClosed', (event, state) => {
      popup_state = state;
      console.log('state = ' + popup_state);
    });

    menu = new Menu();
    menu_item = new MenuItem({
      label: 'hoge',
      click: () => {
        remote.getCurrentWindow().webContents.inspectElement(click_pos.x, click_pos.y)
      }

    });

    menu.append(menu_item);

    window.addEventListener('contextmenu', (e) => {
      console.log(util.format('Right Click!!, [x, y] = [%d, %d]', e.x, e.y));
      //e.preventDefault();
      click_pos = {x: e.x, y: e.y};
      menu.popup(remote.getCurrentWindow(), null);
      //menu.popup(remote.getCurrentWindow().webContents.inspectElement();
      //menu.popup('are you known?');
    }, false);

    ipc_renderer.on('updatePane', (event) => {
      this.updatePane();
    });
  }

  cursorUp(){
    pane_active.drawCursor(pane_active.line_cur-1);
  }

  cursorDown(){
    pane_active.drawCursor(pane_active.line_cur+1);
    console.log('dir_cur: ' + pane_active.dir_cur);
    console.log('item_name_cur: ' + pane_active.item_name_cur);
  }

  switchPane(){
    switch(pane_state){
      case ACTIVE_PANE_IS.LEFT:
        pane_state = ACTIVE_PANE_IS.RIGHT;
        pane_active = pane_right;
        pane_other = pane_left;
        break;
      case ACTIVE_PANE_IS.RIGHT:
        pane_state = ACTIVE_PANE_IS.LEFT;
        pane_active = pane_left;
        pane_other = pane_right;
        break;
      default:
        /* Do Nothing.. */
        break;
    }
    pane_active.enabled = true;
    pane_other.enabled = false;
    pane_active.drawCursor(pane_active.line_cur);
    pane_other.drawCursor(pane_other.line_cur);
  }

  changeDirUpper(){
    //console.log('cur: pane_active.dir_cur = ' + pane_active.dir_cur);
    pane_active.dir_cur = path.parse(pane_active.dir_cur).dir;
    //console.log('new: pane_active.dir_cur = ' + pane_active.dir_cur);
    pane_active.drawItems();
    pane_active.drawCursor(0);
    pane_active.emptySelectedItems();
  }

  changeDirLower(){
    if(pane_active._items.length <= 0){
      return;
    }
    let lined_item = pane_active.items[pane_active.line_cur].name;
    let p = path.join(pane_active.dir_cur, lined_item);
    //console.log('cur: pane_active.dir_cur = ' + pane_active.dir_cur);
    //console.log('lined item: ' + lined_item);
    if(fs.statSync(p).isDirectory){
      pane_active.dir_cur = p;
      //console.log('target dir: ' + p);
      pane_active.drawItems();
      pane_active.drawCursor(0);
    }
    pane_active.emptySelectedItems();
  }

  toggleUp(){
    pane_active.toggleItemSelect();
    pane_active.drawCursor(pane_active.line_cur-1);
  }

  toggleDown(){
    pane_active.toggleItemSelect();
    pane_active.drawCursor(pane_active.line_cur+1);
  }

  syncPaneCur2Other(){
    this._syncPane(pane_active, pane_other);
  }
  syncPaneOther2Cur(){
    this._syncPane(pane_other, pane_active);
  }
  _syncPane(lhs, rhs){
    lhs.dir_cur = rhs.dir_cur;
    lhs.drawItems();
    lhs.drawCursor(0);
  }

  copyItems(){
    let item_src = path.join(pane_active.dir_cur, pane_active.item_name_cur);
    let item_dst = path.join(pane_other.dir_cur, pane_active.item_name_cur);
    //let item_dst = pane_other.dir_cur;

    //console.log('dir active: ' + pane_active.dir_cur);
    //console.log('dir other : ' + pane_other.dir_cur);
    //console.log('item_name_cur: ' + pane_active.item_name_cur);

    console.log('item_src: ' + item_src);
    console.log('item_dst: ' + item_dst);
    
    ipc_renderer.sendSync('copy', item_dst, item_src);
    pane_other.drawItems();
    pane_other.drawCursor(0);
  }

  deleteItems(){
    if(Object.keys(pane_active.items_selected).length > 0){
      console.log('renderer <> dir_cur: ' + pane_active.dir_cur);
      let params = {
        'dir_cur': pane_active.dir_cur,
        'items_selected': pane_active.items_selected,
      };
      ipc_renderer.sendSync('popup', 'delete', params);
    }
  }

  closeMainWindow(){
    if(popup_state == POPUP_STATES.CLOSED){
      popup_state = POPUP_STATES.ACTIVE;
      ipc_renderer.sendSync('popup', 'quit', null);
    }
  }

  openItem(){
    let item_src = path.join(pane_active.dir_cur, pane_active.item_name_cur);
    shell.openItem(item_src);
  }

  showContextMenu(){
    //console.log('Are you known?');
    //remote.getCurrentWindow().inspectElement(0, 0);
    remote.getCurrentWindow().webContents.inspectElement(200, 200);
  }

  updatePane(){
    pane_active.drawItems();
    pane_active.drawCursor(0);
  }

  stateChanged(){
    console.log('hogeeeeeeeee!!');
  }
}

module.exports = MediatePane;
