'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';
import im from 'immutable';

const mapStateToProps = (state, props) => {
  const active_pane_id = state.active_pane_id;
  const dir = state.state_core.getIn([props.id, 'dirs', 0]);
  const page = state.state_core.getIn([props.id, 'pages', dir]);
  const line_cur = state.state_core.getIn([props.id, 'pages', dir, 'line_cur']);
  //console.log('pane-item-list <> pane_id: ' + props.id + ', line_cur: ' + line_cur);

//  if(props.id === active_pane_id){
//    console.log('pane-item-list <> id: ' + props.id + ', dir: ' + dir);
//  }

  return {
    active_pane_id: active_pane_id,
    dir: dir,
    page: page,
    id: props.id,
    line_cur: line_cur,
    input_mode: state.input_mode
  };
}

const mapDispatchToProps = (dispatch, props) => ({
  dispPopUpForSort: (left, top) => {
    dispatch({
      type: 'DISP_POPUP_FOR_SORT_ITEM_LIST',
      left: left,
      top: top
    });
  },
  props
});

const PaneItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList);

//const PaneItemList = connect(
//  mapStateToProps
//)(ItemList);

export default PaneItemList;
