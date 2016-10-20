'use strict';

//export const updateItemList = (item_list) => ({
//  type: 'UPDATE_ITEM_LIST',
//  item_list
//});

export const updateItemList = (id) => ({
  type: 'UPDATE_ITEM_LIST',
  id
});

export const checkKeyNormal = (e) => {
  //console.log(util.format('pane_left: %d, pane_right: %d',
  //                        pane_left.is_focused,
  //                        pane_right.is_focused));

  //console.log('checkKeyNormal <> e.key: ' + e.key);
  switch(e.key){
    case 'j': /* 'j' */
      //this.cursorDown();
      //break;
      return {
        type: 'MOVE_CURSOR_DOWN'
      };
    case 'k': /* 'k' */
      //this.cursorUp();
      //break;
      return {
        type: 'MOVE_CURSOR_UP'
      };
    case 'h': /* 'h' */
      //this.changeDirUpper();
      //break;
      return {
        type: 'CHANGE_DIR_UPPER'
      };
    case 'l': /* 'l' */
      //if(event.ctrlKey == true){
      //  this.updatePane();
      //}else{
      //  this.changeDirLower();
      //}
      //break;
      return {
        type: 'CHANGE_DIR_LOWER'
      };
    case 'Tab': /* 'tab' */
      //this.switchPane();
      //break;
      return {
        type: 'SWITCH_ACTIVE_PANE'
      };
    //case 'Space': /* 'space' */
    //  //if(event.shiftKey == true){
    //  //  this.toggleUp();
    //  //}else{
    //  //  this.toggleDown();
    //  //}
    //  //break;
    //case 'o': /* 'o' */
    //  //if(event.shiftKey == true){
    //  //  this.syncPaneOther2Cur();
    //  //}else{
    //  //  this.syncPaneCur2Other();
    //  //}
    //  //break;           
    //case 'c': /* 'c' */
    //  //this.copyItems();
    //  //break;           
    //case 'd': /* 'd' */
    //  //this.deleteItems();
    //  //break;           
    //case 'm': /* 'm' */
    //  //break;           
    //case 'q': /* 'q' */
    //  //this.closeMainWindow();
    //  //break;           
    //case '.': /* ',' */
    //  //this.showContextMenu();
    //  //break;           
    //case 'Enter':
    //  console.log('HERE!!');
    //  //this.openItem();
    //  //break;           
    //  break;
    case '/': /* '/' */
      //key_input_mode = KEY_INPUT_MODE.SEARCH;
      //this.startIsearch();
      //break;
      return {
        type: 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS',
        c: e.key
      };
    default:
      /* Do Nothing.. */
      //break;
      return {
        type: 'DO_NOTHING'
      };
  }
}

export const checkKeySearch = (e) => {
  //console.log('e.keyCode: ' + e.keyCode);
  if(event.ctrlKey == true){
    return _checkKeySearchWithCtrl(e);
  }else{
    return _checkKeySearch(e);
  }
}

const _checkKeySearchWithCtrl = (e) => {
  switch(e.key){
    case '[':
      return {
        type: 'SWITCH_INPUT_MODE_NORMAL',
        is_clear_cmd: true
      };
    default:
      return {
        type: 'RECEIVE_INPUT',
        c: e.key,
        event: event
      };
  }
}

const _checkKeySearch = (e) => {
  switch(e.key){
    case 'Escape':
      return {
        type: 'SWITCH_INPUT_MODE_NORMAL',
        is_clear_cmd: true
      };
    case 'Enter':
      return {
        type: 'SWITCH_INPUT_MODE_NORMAL',
        is_clear_cmd: false
      };
    case '[':
      return {
        type: 'RECEIVE_INPUT',
        c: e.key
      };
    case 'Tab':
    default:
      /* Do Nothing.. */
      return {
        type: 'RECEIVE_INPUT',
        c: e.key,
        event: event
      };
  }
}

