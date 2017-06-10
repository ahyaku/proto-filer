'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';
import im from 'immutable';

/* Before */
//const mapStateToProps = (state, props) => {
//  const state_core = props.store.getState().state_core;
//  const id = props.id;
//  const dir_cur = state_core.getIn(['arr_pages', id, 'dir_cur']);
//  const item_list = state_core.getIn(['arr_pages', id, 'pages', dir_cur]);
//  const idx = item_list.get('line_cur');
//
//  const active_pane_id = state.active_pane_id;
//  const line_cur = state.arr_line_cur[props.id];
//
//  return {
//    store: props.store,
//    active_pane_id: active_pane_id,
//    line_cur: line_cur
//  };
//}

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
    line_cur: line_cur
  };
}

const mapDispatchToProps = (dispatch, props) => ({
  onItemListClick: () => {
    dispatch(updateItemList(props.id));
  },
  props
});

//const PaneItemList = connect(
//  mapStateToProps,
//  mapDispatchToProps
//)(ItemList);

const PaneItemList = connect(
  mapStateToProps
)(ItemList);

export default PaneItemList;
