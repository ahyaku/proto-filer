'use strict';

import { connect } from 'react-redux';
import Redux from 'redux';
import im from 'immutable';
import PathCur from '../components/path-cur';


const mapStateToProps = (state, props) => {

  //let arr_path_cur = [];
  //for(let e of state.arr_pages){
  //  arr_path_cur.push(e.dir_cur);
  //}
  //return {arr_path_cur, props};

  const id = props.id;
  //const dir_cur = state.arr_pages.get(id).get('dir_cur');
  //console.log('state: ' + state);
  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  const active_pane_id = state.get('active_pane_id');
  return {dir_cur, active_pane_id, props};
}

const PanePathCur = connect(
  mapStateToProps
)(PathCur);

export default PanePathCur;
