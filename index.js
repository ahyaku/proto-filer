'use strict';

//let ipc = require('ipc');
//let {ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');

const electron = require('electron');
const remote = electron.remote;
const async = require('async');
const MediatePane = require('./lib/mediate_pane');

let KEY_INPUT_MODE = {
  NORMAL : 0,
  SEARCH : 1,
};

let mediate_pane;

let e_left;
let e_right;
let e_list;

let key_input_mode;

function init(){
  //let e = document.getElementById('window');
  //e.addEventListener('keydown', onKeyDown);

  e_left = document.getElementById('item_list_left');
  e_right = document.getElementById('item_list_right');
  e_list = document.getElementById('item_list');
  //e_left.addEventListener('keydown', onKeyDown);
  //e_right.addEventListener('keydown', onKeyDown);

  document.addEventListener('keydown', onKeyDown);


  //document.getElementById('pane_cmd_left').blur();
  //document.getElementById('pane_cmd_right').blur();

  mediate_pane = new MediatePane('item_list_left', 
                                 'item_list_right',
                                 'dir_cur_left',
                                 'dir_cur_right',
                                 'pane_cmd_left',
                                 'pane_cmd_right',
                                 'C:\\Go',
                                 'C:\\tmp\\test');

  //mediate_pane = new MediatePane('items_left', 
  //                               'items_right',
  //                               'dir_cur_left',
  //                               'dir_cur_right',
  //                               'C:\\Go',
  //                               'C:\\Go');

  mediate_pane.update;

//  e_head.innerHTML = pane_left.dir_cur_full;
 
  let ret = electron.ipcRenderer.sendSync('synchronous-message', 'ping');
  //console.log('ret = ' + ret);

//  console.log(electron.ipcRenderer.sendSync('synchronous-message', 'ping'));


  key_input_mode = KEY_INPUT_MODE.NORMAL;
}

function onKeyDown(e){
  //e_list.focus();

  //document.getElementById('pane_cmd_left').blur();
  //document.getElementById('pane_cmd_right').blur();

  //console.log("active: " + document.activeElement.id);
  //console.log('key: ' + e);
  console.log('key_code: ' + e.keyCode);
  //console.log('event.shiftKey: ' + event.shiftKey);
  console.log('event.ctrlKey: ' + event.ctrlKey);
  //console.log('event.target: ' + event.target);
  //console.log('event.target.id: ' + event.target.id);
  switch(key_input_mode){
    case KEY_INPUT_MODE.NORMAL:
      checkKeyNormal(e);
      break;
    case KEY_INPUT_MODE.SEARCH:
      break;
    default:
      /* Do Nothing.. */
      break;
  }

}

function checkKeyNormal(e){
  switch(e.keyCode){
    case 72: /* 'h' */
      mediate_pane.changeDirUpper();
      break;
    case 74: /* 'j' */
      mediate_pane.cursorDown();
      break;
    case 75: /* 'k' */
      mediate_pane.cursorUp();
      break;
    case 76: /* 'l' */
      if(event.ctrlKey == true){
        mediate_pane.updatePane();
      }else{
        mediate_pane.changeDirLower();
      }
      break;
    case 9: /* 'tab' */
      //toggleFocus();
      mediate_pane.switchPane();
      //document.activeElement.blur();
      break;
    case 32: /* 'space' */
      //console.log('HERE!!!!');
      if(event.shiftKey == true){
        mediate_pane.toggleUp();
      }else{
        mediate_pane.toggleDown();
      }
      break;
    case 79: /* 'o' */
      if(event.shiftKey == true){
        mediate_pane.syncPaneOther2Cur();
      }else{
        mediate_pane.syncPaneCur2Other();
      }
      break;           
    case 67: /* 'c' */
      mediate_pane.copyItems();
      break;           
    case 68: /* 'd' */
      mediate_pane.deleteItems();
      break;           
    case 77: /* 'm' */
      break;           
    case 81: /* 'q' */
      mediate_pane.closeMainWindow();
      break;           
    case 188: /* ',' */
      mediate_pane.showContextMenu();
      break;           
    case 13: /* 'enter' */
      mediate_pane.openItem();
      break;           
    case 191: /* '/' */
      key_input_mode = KEY_INPUT_MODE.SEARCH;
      mediate_pane.startIsearch();
      break;
    default:
      /* Do Nothing.. */
      break;
  }
}

function checkKeySearch(e){
  switch(e.keyCode){
    case 27:  /* ESC */
      key_input_mode = KEY_INPUT_MODE.NORMAL;
      mediate_pane.endIsearch();
      break;
    case 219: /* '[' */
      if(event.ctrlKey == true){
        key_input_mode = KEY_INPUT_MODE.NORMAL;
        mediate_pane.endIsearch();
      }
      break;
    default:
      /* Do Nothing.. */
      break;
  }
}

init();
