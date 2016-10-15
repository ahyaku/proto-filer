'use strict';

import React from 'react';
import { KEY_INPUT_MODE } from '../core/item_type';

//const CombinedCmd = (state, action) => {
function CombinedCmd(state, action){
//function CombinedCmd(state, action, c){
  //return Object.assign({}, state);
  switch(action.type){
    case 'SWITCH_INPUT_MODE_NORMAL':
      return Object.assign({}, state,
                           {input_mode: KEY_INPUT_MODE.NORMAL});
    default:
      //console.log('c: ' + c);
      return Object.assign({}, state);
  }
}

export default CombinedCmd;
