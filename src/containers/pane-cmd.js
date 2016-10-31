'use strict';

import Redux from 'redux';
import { connect } from 'react-redux';
import Cmd from '../components/cmd';

const mapStateToProps = (state, props) => {
  //const msg_cmd = state.arr_pages[props.id].msg_cmd;
  //return {msg_cmd: msg_cmd, input_mode: state.input_mode};

  /* Dummy */
  return {msg_cmd: 'hoge', input_mode: 'fuga'};
}

const PaneCmd = connect(
  mapStateToProps
)(Cmd);

export default PaneCmd;
