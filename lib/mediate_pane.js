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
const PaneCmd = require('./pane_cmd');

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

let pane_cmd_left;
let pane_cmd_right;

class MediatePane{
  constructor(id_left, id_right, id_dir_cur_left, id_dir_cur_right,
              id_pane_cmd_left, id_pane_cmd_right,
              init_path_left, init_path_right){

    pages_left = new ItemListPages(id_left, id_dir_cur_left);
    pages_right = new ItemListPages(id_right, id_dir_cur_right);

    pane_left = pages_left.updatePageCur(init_path_left, false, this);
    pane_right = pages_right.updatePageCur(init_path_right, true, this);

    pane_state = ACTIVE_PANE_IS.RIGHT;
    pane_active = pane_right;
    pane_other = pane_left;

    popup_state = POPUP_STATES.CLOSED;
    ipc_renderer.on('popupClosed', (event, state) => {
      popup_state = state;
      console.log('state = ' + popup_state);
    });

    pane_cmd_left = new PaneCmd(id_pane_cmd_left);
    pane_cmd_right = new PaneCmd(id_pane_cmd_right);

    pane_cmd_left.updatePane();
    pane_cmd_right.updatePane();

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
    pane_active.enabled = true;
    pane_other.enabled = false;
    pane_active.drawCursor(pane_active.line_cur);
    pane_other.drawCursor(pane_other.line_cur);
  }

  changeDirUpper(){
    let init_path = path.parse(pane_active.dir_cur).dir;
    this.changeDir(init_path);
  }

  changeDirLower(){
    if(pane_active._items.length <= 0){
      return;
    }
    let lined_item = pane_active.items[pane_active.line_cur].name;
    let init_path = path.join(pane_active.dir_cur, lined_item);

    if(fs.statSync(init_path).isDirectory){
      this.changeDir(init_path);
    }

  }

  changeDir(init_path){
    let id = pane_active.id;
    let id_dir_cur = pane_active.id_dir_cur;

    let count = 0;
    switch(pane_state){
      case ACTIVE_PANE_IS.LEFT:
        pane_left = pages_left.updatePageCur(init_path, true, this);
        pane_active = pane_left;
        //console.log('--------------------');
        //console.log('pane_left');
        //console.log('--------------------');
        //for(let key in pane_left){
        //  console.log(count + ' key: ' + key);
        //  count++;
        //}
        //console.log('--------------------');
        break;
      case ACTIVE_PANE_IS.RIGHT:
        pane_right = pages_right.updatePageCur(init_path, true, this);
        pane_active = pane_right;
        //console.log('--------------------');
        //console.log('pane_right');
        //console.log('--------------------');
        //for(let key in pane_right){
        //  console.log(count + ' key: ' + key);
        //  count++;
        //}
        //console.log('--------------------');
        break;
      default:
        /* Do Nothing.. */
        break;
    }
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
