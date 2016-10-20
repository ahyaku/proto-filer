'use strict';

import Redux from 'redux';
import { connect } from 'react-redux';
import Cmd from '../components/cmd';

const mapStateToProps = (state, props) => {
  const msg_cmd = state.arr_pages[props.id].msg_cmd;
  //console.log('mapStateToProps <> query: ' + msg_cmd.slice(1, msg_cmd.length));
  return {msg_cmd: msg_cmd, input_mode: state.input_mode};
}

const PaneCmd = connect(
  mapStateToProps
)(Cmd);

export default PaneCmd;
