'use strict';

process.env.NODE_ENV = 'production';

import { remote, ipcRenderer } from 'electron';

let procYes;
let procNo;
let items_selected;

const init = () => {
  let msgs = [];
  let e = document.getElementById('window');
  e.addEventListener('keydown', onKeyDown);

  console.log('quit!!');
  procYes = function(){
    closeMainWindow();
  };
  procNo = closePopup;
  msgs[0] = 'Quit ProtoFiler?';
  showMsgConfirm(msgs);
}


const showMsgConfirm = (qmsgs) => {
  showMsgQuestion(qmsgs);
  showMsgYesNo();
}

const showMsgQuestion = (qmsgs) => {
  /* Show messages on the popup window. */
  let node_id = document.getElementById('msg_body');
  let node_frg = document.createDocumentFragment();

  /* Delete the older message. */
  node_id.textContent = null;

  for(let e of qmsgs){
    let node = document.createElement('div');
    node.appendChild( document.createTextNode(e) );
    node.setAttribute('flex', '0 0 auto;');
    node.setAttribute('style', 'color:#FFFFFF;');
    node_frg.appendChild(node);
  }
  node_id.appendChild(node_frg);
}

const showMsgYesNo = () => {
  /* Show messages on the popup window. */
  let node_id = document.getElementById('yesno');
  let node_frg = document.createDocumentFragment();
  let node = document.createElement('div');
  let msg = "(Y)es / (N)o";

  /* Delete the older message. */
  node_id.textContent = null;

  node.appendChild( document.createTextNode(msg) );
  node.setAttribute('flex', '0 0 auto;');
  node.setAttribute('style', 'color:#00FF00;');
  node_frg.appendChild(node);

  node_id.appendChild(node_frg);
}



function onKeyDown(e){
  console.log('confirm <> key: ' + e);
  console.log('confirm <> key_code: ' + e.keyCode);
  checkKeyQuit(e);
}

const checkKeyQuit = (e) => {
  switch(e.keyCode){
    case 89: /* 'y' */
      console.log('YYYYYYYYY');
      procYes();
      break;
    case 78: /* 'n' */
      console.log('NNNNNNNNN');
      procNo('quit');
      break;
  }
}

const closeMainWindow = () => {
  ipcRenderer.sendSync('closeMainWindow');
}

const closePopup = (ptype) => {
  ipcRenderer.sendSync('closePopup', ptype);
}

init();
