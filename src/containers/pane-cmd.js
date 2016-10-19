'use strict';

import Redux from 'redux';
import { connect } from 'react-redux';
import Cmd from '../components/cmd';

const mapStateToProps = (state, props) => {
  //return props;
  console.log('mapStateToProps <> query: ' + state.msg_cmd.slice(1, state.msg_cmd.length));
  //return {msg_cmd: state.msg_cmd.slice(1, state.msg_cmd.length)};
  return {msg_cmd: state.msg_cmd};
}


const PaneCmd = connect(
  mapStateToProps
)(Cmd);

export default PaneCmd;
