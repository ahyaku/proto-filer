'use strict';

import Redux from 'redux';
import { connect } from 'react-redux';
import Cmd from '../components/cmd';

const mapStateToProps = (state, props) => {
  const id = props.id;
  const msg_cmd = state.getIn(['arr_pages', id, 'msg_cmd']);
  const input_mode = state.getIn(['arr_pages', id, 'input_mode']);
  //console.log('msg_cmd: ' + msg_cmd);
  //console.log('pane-cmd.js <> props.id = ' + props.id);

  return {msg_cmd: msg_cmd, input_mode: input_mode, state: state, id: id};
  //return {msg_cmd, input_mode, state};
  //return {msg_cmd: msg_cmd, input_mode: input_mode};
}

const mapDispatchToProps = (dispatch, props) => {
  return {dispatch: dispatch};
}

const PaneCmd = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cmd);

export default PaneCmd;
