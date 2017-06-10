'use strict';

import Redux from 'redux';
import { connect } from 'react-redux';
import Cmd from '../components/cmd';

/* Before */
//const mapStateToProps = (state_fcd, props) => {
//  const state = state_fcd.state_core;
//
//  const id = props.id;
//  const msg_cmd = state.getIn(['arr_pages', id, 'msg_cmd']);
//  const input_mode = state.getIn(['arr_pages', id, 'input_mode']);
//
//  return {msg_cmd: msg_cmd, input_mode: input_mode, state_fcd: state_fcd, id: id};
//  //return {msg_cmd: msg_cmd, input_mode: input_mode, state: state, id: id};
//}

const mapStateToProps = (state_fcd, props) => {
  const id = props.id;
  const state = state_fcd.state_core.get(id);
  const msg_cmd = state.get('msg_cmd');
  const input_mode = state_fcd.input_mode;

  return {
    msg_cmd: msg_cmd,
    input_mode: input_mode,
    state_fcd: state_fcd,
    id: id
  };

  //return {msg_cmd: msg_cmd, input_mode: input_mode, state: state, id: id};
}

const mapDispatchToProps = (dispatch, props) => {
  return {dispatch: dispatch};
}

const PaneCmd = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cmd);

export default PaneCmd;
