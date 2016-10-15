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
  switch(e.keyCode){
    case 74: /* 'j' */
      //this.cursorDown();
      //break;
      return {
        type: 'MOVE_CURSOR_DOWN'
      };
    case 75: /* 'k' */
      //this.cursorUp();
      //break;
      return {
        type: 'MOVE_CURSOR_UP'
      };
    case 72: /* 'h' */
      //this.changeDirUpper();
      //break;
      return {
        type: 'CHANGE_DIR_UPPER'
      };
    case 76: /* 'l' */
      //if(event.ctrlKey == true){
      //  this.updatePane();
      //}else{
      //  this.changeDirLower();
      //}
      //break;
      return {
        type: 'CHANGE_DIR_LOWER'
      };
    case 9: /* 'tab' */
      //this.switchPane();
      //break;
      return {
        type: 'SWITCH_ACTIVE_PANE'
      };
    case 32: /* 'space' */
      //if(event.shiftKey == true){
      //  this.toggleUp();
      //}else{
      //  this.toggleDown();
      //}
      //break;
    case 79: /* 'o' */
      //if(event.shiftKey == true){
      //  this.syncPaneOther2Cur();
      //}else{
      //  this.syncPaneCur2Other();
      //}
      //break;           
    case 67: /* 'c' */
      //this.copyItems();
      //break;           
    case 68: /* 'd' */
      //this.deleteItems();
      //break;           
    case 77: /* 'm' */
      //break;           
    case 81: /* 'q' */
      //this.closeMainWindow();
      //break;           
    case 188: /* ',' */
      //this.showContextMenu();
      //break;           
    case 13: /* 'enter' */
      //this.openItem();
      //break;           
    case 191: /* '/' */
      //key_input_mode = KEY_INPUT_MODE.SEARCH;
      //this.startIsearch();
      //break;
      return {
        type: 'SWITCH_INPUT_MODE_NARROW_DOWN_ITEMS'
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
  switch(e.keyCode){
    case 27:  /* 'ESC' */
      //key_input_mode = KEY_INPUT_MODE.NORMAL;
      //this.endIsearch();
      //break;
      return {
        type: 'SWITCH_INPUT_MODE_NORMAL',
        c: ''
      };
    case 219: /* '[' */
      //if(event.ctrlKey == true){
      //  console.log('key: endIsearch!!');
      //  key_input_mode = KEY_INPUT_MODE.NORMAL;
      //  this.endIsearch();
      //}
      //break;
      if(event.ctrlKey == true){
        return {
          type: 'SWITCH_INPUT_MODE_NORMAL',
          c: ''
        };
      }
      console.log('action <> e.key: ' + e.key);
      return {
        type: 'RECEIVE_INPUT',
        c: e.key
      };
    case 9:  /* 'tab' */
    case 13: /* 'enter */
      e.preventDefault();
      //break;
    default:
      /* Do Nothing.. */
      //break;
      console.log('action <> e.key: ' + e.key);
      return {
        type: 'RECEIVE_INPUT',
        c: e.key
      };
  }
}


