'use strict';

import { connect } from 'react-redux';
import Redux from 'redux';
import im from 'immutable';
import PathCur from '../components/path-cur';


const mapStateToProps = (state_fcd, props) => {
  const state = state_fcd.state_core;
  const id = props.id;
  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  const active_pane_id = state_fcd.active_pane_id;
  //const active_pane_id = state.get('active_pane_id');
  return {dir_cur, active_pane_id, props};
}

//const mapStateToProps = (state, props) => {
//  const id = props.id;
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  const active_pane_id = state.get('active_pane_id');
//  return {dir_cur, active_pane_id, props};
//}

const PanePathCur = connect(
  mapStateToProps
)(PathCur);

export default PanePathCur;
