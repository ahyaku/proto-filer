'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';
import im from 'immutable';

const mapStateToProps = (state, props) => {
//  const id = props.id;
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
  
  const state_core = props.store.getState().state_core;
  //const state = this.props.store.getState();
  const id = props.id;
  const dir_cur = state_core.getIn(['arr_pages', id, 'dir_cur']);
  const item_list = state_core.getIn(['arr_pages', id, 'pages', dir_cur]);
  //const active_pane_id = state_core.get('active_pane_id');
  const idx = item_list.get('line_cur');
  //console.log('pane-item-list <> idx: ' + idx);

  const active_pane_id = state.active_pane_id;
  const line_cur = state.arr_line_cur[props.id];


//  return {store: props.store};

  return {
    store: props.store,
    active_pane_id: active_pane_id,
    line_cur: line_cur
  };

  //return {item_list: item_list, 
  //        active_pane_id: state.get('active_pane_id'),
  //        line_cur: 0,
  //        action_type: state.get('action_type'),
  //        store: props.store};

}

const mapDispatchToProps = (dispatch, props) => ({
  onItemListClick: () => {
    dispatch(updateItemList(props.id));
  },
  props
});

const PaneItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList);

export default PaneItemList;
