'use strict';
const electron = require('electron');
const remote = electron.remote;
const ipc_renderer = electron.ipcRenderer;
const events = require('events');
const event_emitter = events.EventEmitter;

let procYes;
let procNo;
let mode;
let items_selected;
let ee;

function init(){
  let msgs = [];
  let e = document.getElementById('window');
  e.addEventListener('keydown', onKeyDown);

  [mode, items_selected] = ipc_renderer.sendSync('check_mode');

  switch(mode){
    case 'delete':
      console.log('delete!!');
      console.log('mode = ' + mode);
      procYes = function(){
        ipc_renderer.sendSync('delete');
        closePopup();
      }
      procNo = closePopup;
      let arr = Object.keys(items_selected);
      if( arr.length > 1){
        msgs[0] = 'Delete ' + arr.length + ' items?';
      }else{
        msgs[0] = 'Delete this item?';
        msgs[1] = arr[0];
      }
      break;
    case 'quit':
      console.log('quit!!');
      console.log('mode = ' + mode);
      procYes = function(){
        closeMainWindow();
        //closePopup();
      };
      procNo = closePopup;
      msgs[0] = 'Quit ProtoFiler?';
      break;
    default:
      console.log('default!!');
      /* Do Nothing.. */
      break;
  }

  /* Show messages on the popup window. */
  {
    let node_id = document.getElementById('message');
    let node_frg = document.createDocumentFragment();

    /* Delete the older message. */
    node_id.textContent = null;

    for(let e of msgs){
      let node = document.createElement('div');
      node.appendChild( document.createTextNode(e) );
      node.setAttribute('flex', '0 0 auto;');
      node.setAttribute('style', 'color:#FFFFFF;');
      node_frg.appendChild(node);
    }
    node_id.appendChild(node_frg);
  }

  ee = new event_emitter;
  ee.on('test', function(arg){
    console.log('Are you known???: ' + arg);
  });

}

//function onKeyDown(e){
//  console.log('confirm <> key: ' + e);
//  console.log('confirm <> key_code: ' + e.keyCode);
//  console.log('confirm <> tc = ' + tc);
//
//  switch(e.keyCode){
//    case 89: /* 'y' */
//      console.log('YYYYYYYYY');
//      procYes();
//      break;
//    case 78: /* 'n' */
//      console.log('NNNNNNNNN');
//      procNo();
//      break;
//  }
//}

function onKeyDown(e){
  console.log('confirm <> key: ' + e);
  console.log('confirm <> key_code: ' + e.keyCode);
  console.log('mode = ' + mode);

  switch(e.keyCode){
    case 89: /* 'y' */
      console.log('YYYYYYYYY');
      //ee.emit('test', 'Yes!!');
      procYes();
      break;
    case 78: /* 'n' */
      console.log('NNNNNNNNN');
      //ee.emit('test', 'No!!');
      procNo();
      break;
  }
}

function closeMainWindow(){
  ipc_renderer.sendSync('closeMainWindow');
}

function closePopup(){
  //let w = remote.getCurrentWindow();
  //w.close();
  ipc_renderer.sendSync('closePopup');
}

init();
