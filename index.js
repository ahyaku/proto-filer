'use strict';

//let ipc = require('ipc');
//let {ipcRenderer} = require('electron');
let fs = require('fs');
let path = require('path');

let electron = require('electron');
let remote = electron.remote;
let file_util = remote.require('./lib/file_util');
let async = require('async');
let MediatePane = require('./lib/mediate_pane');

let mediate_pane;

function init(){
  let e = document.getElementById('window');
//  let e_head = document.getElementById('path_cur');

  mediate_pane = new MediatePane('items_left', 
                                 'items_right',
                                 'dir_cur_left',
                                 'dir_cur_right',
                                 'C:\\Go',
                                 'C:\\tmp\\test');

  //mediate_pane = new MediatePane('items_left', 
  //                               'items_right',
  //                               'dir_cur_left',
  //                               'dir_cur_right',
  //                               'C:\\Go',
  //                               'C:\\Go');

  mediate_pane.update;
  e.addEventListener('keydown', onKeyDown);

//  e_head.innerHTML = pane_left.dir_cur_full;
 
  let ret = electron.ipcRenderer.sendSync('synchronous-message', 'ping');
  //console.log('ret = ' + ret);

//  console.log(electron.ipcRenderer.sendSync('synchronous-message', 'ping'));
}

function onKeyDown(e){
  //console.log('key: ' + e);
  //console.log('key_code: ' + e.keyCode);
  //console.log('event.shiftKey: ' + event.shiftKey);
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
    default:
      /* Do Nothing.. */
      break;
  }
}

init();
