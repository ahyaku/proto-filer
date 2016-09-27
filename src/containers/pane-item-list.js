'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';

const mapStateToProps = (state, props) => ({
  item_list: state.item_list
  //item_list: props.item_list
});

//const mapStateToProps = (state, props) => {
//  //item_list: state.item_list
//  console.log("props.item_list: " + props.item_list);
//  //console.log("props.item_list.id: " + props.item_list.id);
//  //for (let e of props.item_list.items){
//  //  console.log("mapStateToProps: " + e.name);
//  //}
//  return {item_list: props.item_list};
//};

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
