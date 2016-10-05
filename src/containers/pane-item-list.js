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
  //console.log("state.item_list.id: " + state.item_list.id);
  //if(state.item_list.id === 'init'){
  //  console.log('IS init!!');
  //}else{
  //  console.log('IS NOT init!!');
  //}
  //return {item_list: props.item_list};


  //console.log('mapStateToProp <> state: ' + state);
  //console.log('mapStateToProp <> state.arr_item_list: ' + state.arr_item_list);
  //console.log('mapStateToProp <> state.arr_item_list[0].dir_cur: ' + state.arr_item_list[0].dir_cur);
  //console.log('mapStateToProp <> state.arr_item_list[1].dir_cur: ' + state.arr_item_list[1].dir_cur);

  let arr_item_list = state.arr_item_list.concat();
  arr_item_list[0].items  = state.arr_item_list[0].items.concat();
  arr_item_list[1].items  = state.arr_item_list[1].items.concat();

  return {arr_item_list: arr_item_list};

  //{
  //  let new_list = Object.assign({}, state.item_list);
  //  //new_list.items = Object.assign({}, state.item_list.items);
  //  //new_list.items = [].concat(state.item_list.items);
  //  new_list.items = state.item_list.items.concat();
  //  for (let i = 0; i < new_list.items.length; i++){
  //    new_list.items[i].name = 'hoge!!';
  //  }
  //  //for (let i = 0; i < state.item_list.items.length; i++){
  //  //  console.log(state.item_list.items[i].name);
  //  //}
  //  return {item_list: new_list};
  //}



  //return {item_list: state.item_list};
  //item_list: props.item_list
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
