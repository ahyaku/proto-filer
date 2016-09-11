'use strict';

const electron = require('electron');
const ipc_renderer = electron.ipcRenderer;

const fs = require('fs');
const path = require('path');
const util = require('util');
const shell = electron.shell;
const remote = electron.remote;

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const ItemList = require('./item_list');
const ItemListPages = require('./item_list_pages');
//const PaneCmd = require('./pane_cmd');

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
let pages_left;
let pages_right;

class MediatePane{
  constructor(id_left, id_right, id_dir_cur_left, id_dir_cur_right,
              id_pane_cmd_left, id_pane_cmd_right,
              init_path_left, init_path_right){

    pane_left = new ItemListPages(id_left, id_dir_cur_left, id_pane_cmd_left, this);
    pane_right = new ItemListPages(id_right, id_dir_cur_right, id_pane_cmd_right, this);

    pane_left.updatePageCur(init_path_left, false);
    pane_right.updatePageCur(init_path_right, true);

    pane_state = ACTIVE_PANE_IS.RIGHT;
    pane_active = pane_right;
    pane_other = pane_left;

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
    //document.activeElement.blur();
    pane_active.cursorUp();
  }

  cursorDown(){
    //document.activeElement.blur();
    pane_active.cursorDown();
    //console.log('dir_cur: ' + pane_active.dir_cur);
    //console.log('item_name_cur: ' + pane_active.item_name_cur);
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
    pane_active.switchPane(true);
    pane_other.switchPane(false);

    //document.activeElement.blur();
  }

  changeDirUpper(){
    pane_active.changeDirUpper();
  }

  changeDirLower(){
    pane_active.changeDirLower();
  }


  toggleUp(){
    pane_active.toggleUp();
  }

  toggleDown(){
    pane_active.toggleDown();
  }

  syncPaneCur2Other(){
    this._syncPane(pane_active, pane_other);
  }
  syncPaneOther2Cur(){
    this._syncPane(pane_other, pane_active);
  }
  _syncPane(lhs, rhs){
    lhs.dir_cur = rhs.dir_cur;
    lhs.updatePane();
  }

  copyItems(){
    let item_src = path.join(pane_active.dir_cur, pane_active.item_name_cur);
    let item_dst = path.join(pane_other.dir_cur, pane_active.item_name_cur);

    //console.log('dir active: ' + pane_active.dir_cur);
    //console.log('dir other : ' + pane_other.dir_cur);
    //console.log('item_name_cur: ' + pane_active.item_name_cur);

    console.log('item_src: ' + item_src);
    console.log('item_dst: ' + item_dst);
    
    ipc_renderer.sendSync('copy', item_dst, item_src);
    pane_other.updatePane();
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
    pane_active.updatePane();
  }

  stateChanged(){
    console.log('hogeeeeeeeee!!');
  }

  isearch(){
    pane_active.isearch();
  }

}

module.exports = MediatePane;
