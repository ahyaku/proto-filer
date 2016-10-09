'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';

//const mapStateToProps = (state, props) => ({
//  item_list: state.item_list
//  //item_list: props.item_list
//});

const mapStateToProps = (state, props) => {
//const mapStateToProps = function(state, props){

  let id = props.id;
  //console.log('id = ' + id);
  let arr_item_list = state.arr_item_list.concat();
  let item_list = arr_item_list[id];
  console.log('mapStateToProps <> item_list.dir_cur: ' + item_list.dir_cur);
  item_list.items = arr_item_list[id].items.concat();
  return {item_list: item_list, active_pane_id: state.active_pane_id, line_cur: item_list.line_cur};
}

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

const mapDispatchToProps = (dispatch, props) => ({
  onItemListClick: () => {
    dispatch(updateItemList(props.id));
  },
  props
});

//const mapDispatchToProps = ({
//  onItemListClick: updateItemList
//});

//const mapDispatchToProps = () => {
//  return (
//    onItemListClick: () => {
//      updateItemList
//    }
//  );
//}

const PaneItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList);

export default PaneItemList;
