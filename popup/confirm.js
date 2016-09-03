'use strict';
const electron = require('electron');
const remote = electron.remote;
const ipc_renderer = electron.ipcRenderer;
const events = require('events');
const event_emitter = events.EventEmitter;

let procYes;
let procNo;
let mode;
let question;
let ee;

function init(){
  let e = document.getElementById('window');
  e.addEventListener('keydown', onKeyDown);

  [mode, question] = ipc_renderer.sendSync('check_mode');

  switch(mode){
    case 'delete':
      console.log('delete!!');
      console.log('mode = ' + mode);
      console.log('question = ' + question);
      procYes = function(){
        ipc_renderer.sendSync('delete');
        closePopup();
      }
      procNo = closePopup;
      break;
    case 'quit':
      console.log('quit!!');
      console.log('mode = ' + mode);
      console.log('question = ' + question);
      procYes = function(){
        closeMainWindow();
        //closePopup();
      };
      procNo = closePopup;
      break;
    default:
      console.log('default!!');
      /* Do Nothing.. */
      break;
  }

  let node_id = document.getElementById('question');
  node_id.innerHTML = question;

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
