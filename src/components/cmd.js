'use strict';

import React from 'react';
//import { KEY_INPUT_MODE } from '../core/item_type';
//import { KEY_INPUT_MODE } from '../util/item_type';
import { NarrowDownItems } from '../actions/index';
import { RES } from '../../res/res';

class Cmd extends React.Component{
  constructor(props){
    super(props);
    this.count = 0;
    let style_base = {
      //minHeight: '20px',
      //height: '20px',
      borderTop: '1px solid #FFFFFF',
      borderLeft: '1px solid #FFFFFF',
      borderBottom: '1px solid #FFFFFF',
      //margin: '0px, 0px 0px',
      //padding: '0px, 0px 0px',
      minHeight: RES.CMD.HEIGHT + 'px',
      maxHeight: RES.CMD.HEIGHT + 'px',
      //minHeight: '16px',
      //maxHeight: '16px',
      //overflowX: 'hidden',
      //overflowY: 'hidden'

      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      fontSize: '14px'
    };

    if(this.props.id === 0){
      this.style = Object.assign(
        {},
        style_base,
      );
    }else{
      this.style = Object.assign(
        {},
        style_base,
        {borderRight: '1px solid #FFFFFF'}
      );
    }

  }

  render(){
    const msg_cmd = this.props.msg_cmd;
    return (
      <div style={this.style}>
        {msg_cmd}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState){
    //console.log('CmdView <> componentDidUpdate()');

    const { dispatch } = this.props;

    const id = this.props.id;
    const state_fcd = this.props.state_fcd;
    //const active_pane_id = state_fcd.active_pane_id;
    const msg_cmd = state_fcd.state_core.getIn([id, 'msg_cmd']);
    const msg_cmd_prev = prevProps.state_fcd.state_core.getIn([id, 'msg_cmd']);


    //const msg_cmd = state.getIn(['arr_pages', id, 'msg_cmd']);
    //const msg_cmd_prev = prevProps.state_fcd.state_core.getIn(['arr_pages', id, 'msg_cmd']);

    if( msg_cmd === msg_cmd_prev ){
      return;
    }

    dispatch(NarrowDownItems(state_fcd, id, msg_cmd));

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

