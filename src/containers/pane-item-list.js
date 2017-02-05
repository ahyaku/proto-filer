'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';
//import ItemListPages from '../core/item_list_pages';
import im from 'immutable';

const mapStateToProps = (state, props) => {
  //console.log('pane-item-list <> getState(): ' + this.props.store.getState());
  const id = props.id;
  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
  //console.log('8-------------------------');
  
  return {store: props.store};

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
