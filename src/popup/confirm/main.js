'use strict';
process.env.NODE_ENV = 'production';
import { remote, ipcRenderer } from 'electron';

let items_selected;

const init = () => {
  let msgs = [];
  let e = document.getElementById('window');
  e.addEventListener('keydown', onKeyDown);

  console.log('quit!!');
  msgs[0] = '';
  showMsgConfirm(msgs);
}

const showMsgConfirm = (qmsgs) => {
  showMsgYesNo();
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

const onKeyDown = (e) => {
  console.log('confirm <> key: ' + e);
  console.log('confirm <> key_code: ' + e.keyCode);
  checkKeyQuit(e);
}

const checkKeyQuit = (e) => {
  switch(e.keyCode){
    case 89: /* 'y' */
      console.log('YYYYYYYYY');
      sendOverwriteFlag(true);
      break;
    case 78: /* 'n' */
      console.log('NNNNNNNNN');
      sendOverwriteFlag(false);
      break;
  }
}

const sendOverwriteFlag = (flag) => {
  ipcRenderer.send('receiveOverwriteFlag', flag);
}

const showMsgItemName = (item_name) => {
  /* Show messages on the popup window. */
  let node_id = document.getElementById('msg_body');
  let node_frg = document.createDocumentFragment();
  let node = document.createElement('div');
  let msg = item_name;

  /* Delete the older message. */
  node_id.textContent = null;

  node.appendChild( document.createTextNode(msg) );
  node.setAttribute('flex', '0 0 auto;');
  node.setAttribute('style', 'color:#00FF00;');
  node_frg.appendChild(node);

  node_id.appendChild(node_frg);
}

init();
ipcRenderer.on('transferItemName', (event, {item_name}) => {
  console.log('transferItemName() <> item_name: ' + item_name);
  showMsgItemName(item_name);
  ipcRenderer.send('showConfWindow');
})
