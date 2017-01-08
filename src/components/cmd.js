'use strict';

import React from 'react';
import { KEY_INPUT_MODE } from '../core/item_type';
import { NarrowDownItems } from '../actions/index.js';

//const Cmd = ({msg_cmd, input_mode}) => {
//  return (
//    <CmdView msg_cmd={msg_cmd}/>
//  );
//}

//const Cmd = ({msg_cmd, input_mode, state}) => {
//  return (
//    <CmdView msg_cmd={msg_cmd} state={state}/>
//  );
//}

const Cmd = ({msg_cmd, input_mode, state, id, dispatch}) => {
  return (
    <CmdView msg_cmd={msg_cmd} state={state} id={id} dispatch={dispatch}/>
  );
}

class CmdView extends React.Component{
  constructor(props){
    super(props);
    this.count = 0;
  }

  render(){
    const msg_cmd = this.props.msg_cmd;
    const style = {
      //minHeight: '20px',
      //height: '20px',
      border: '1px solid #FFFFFF',
      margin: '0px, 0px 0px',
      padding: '0px, 0px 0px',
      minHeight: '20px'
      //overflowX: 'hidden',
      //overflowY: 'hidden'
    };

    //console.log('msg_cmd: ' + msg_cmd);

    return (
      <div style={style}>
        {msg_cmd}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState){
    //console.log('CmdView <> componentDidUpdate()');

    const { dispatch } = this.props;
    const state = this.props.state;
    const id = this.props.id;
    //console.log('cmd.js <> id: ' + id);
    const msg_cmd = state.getIn(['arr_pages', id, 'msg_cmd']);
    const msg_cmd_prev = prevProps.state.getIn(['arr_pages', id, 'msg_cmd']);
    //console.log('msg_cmd: ' + msg_cmd + ', msg_cmd_prev: ' + msg_cmd_prev);

    if( msg_cmd === msg_cmd_prev ){
      return;
    }
    //console.log('id: ' + id + ', msg_cmd: ' + msg_cmd);
    dispatch(NarrowDownItems(state, id, msg_cmd));

    //if(msg_cmd !== msg_cmd_prev){
    //  dispatch(NarrowDownItems(state, id, msg_cmd));
    //}


    //this.props.dispatch(
    //  {
    //    type: 'END_NARROW_DOWN_ITEMS',
    //    state: state
    //  }
    //);

    //setTimeout(
    //  () => {
    //    console.log('count: ' + this.count++);
    //  },
    //  1000
    //);
  }
}

//const Cmd = ({msg_cmd, input_mode}) => {
//  const style = {
//    //minHeight: '20px',
//    //height: '20px',
//    border: '1px solid #FFFFFF',
//    margin: '0px, 0px 0px',
//    padding: '0px, 0px 0px',
//    minHeight: '20px'
//    //overflowX: 'hidden',
//    //overflowY: 'hidden'
//  };
//
//  //console.log('msg_cmd: ' + msg_cmd);
//
//  return (
//    <div style={style}>
//      {msg_cmd}
//    </div>
//  );
//}

export default Cmd;

