'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';

const mapStateToProps = (state, props) => ({
  item_list: state.item_list
});

//const mapDispatchToProps = (dispatch, props) => ({
//  onItemListClick: () => {
//    dispatch(updateItemList());
//  }
//});

const mapDispatchToProps = ({
  onItemListClick: updateItemList
});

const PaneItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList);

export default PaneItemList;
