'use strict';

import { connect } from 'react-redux';
import Redux from 'redux';
import PathCur from '../components/path-cur';

const mapStateToProps = (state, props) => {

  let arr_path_cur = [];
  //for(let e of state.arr_item_list){
  //  arr_path_cur.push(e.dir_cur);
  //}
  for(let e of state.arr_pages){
    arr_path_cur.push(e.dir_cur);
  }
  return {arr_path_cur, props};
}

const PanePathCur = connect(
  mapStateToProps
)(PathCur);

export default PanePathCur;
