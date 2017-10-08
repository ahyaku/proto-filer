'use strict';

import { connect } from 'react-redux';
import Redux from 'redux';
import im from 'immutable';
import Info from '../components/info';


const mapStateToProps = (state_fcd, props) => {
  //console.log('pane-info <> state_fcd: ', state_fcd);

  //const state = state_fcd.state_core;
  //const id = props.id;
  //const dir_cur = state.getIn([id, 'dirs', 0]);
  //const active_pane_id = state_fcd.active_pane_id;

  const win_ctxt = state_fcd.win_ctxt;
  const height_delta = win_ctxt.get('height_delta');
  const action_type = state_fcd.action_type;

  return {height_delta, action_type};
}

//const mapStateToProps = (state, props) => {
//  const id = props.id;
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  const active_pane_id = state.get('active_pane_id');
//  return {dir_cur, active_pane_id, props};
//}

const PaneInfo = connect(
  mapStateToProps
)(Info);

export default PaneInfo;

