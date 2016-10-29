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

  //let id = props.id;
  //let arr_item_list = state.arr_item_list;
  //let item_list = arr_item_list[id];
  //console.log('mapStateToProps <> item_list.dir_cur: ' + item_list.dir_cur);
  //item_list.items = arr_item_list[id].items;
  //return {item_list: item_list, active_pane_id: state.active_pane_id, line_cur: item_list.line_cur};

  let id = props.id;
  let item_list = state.arr_pages[id].page_cur;
  //console.log('mapStateToProps <> item_list.dir_cur: ' + item_list.dir_cur);
  //state.arr_pages[id].filterItems('');

  //const msg_cmd = state.arr_pages[id].msg_cmd;
  //const pattern = msg_cmd.slice(1, msg_cmd.length);
  //state.arr_pages[id].filterItems(pattern);
  item_list.items = state.arr_pages[id].items;
  //if(id == 0){
  //  console.log('pane-item-list <> id: ' + id);
  //  console.log('pane-item-list <> msg_cmd: ' + msg_cmd);
  //  console.log('-------------------------------------');
  //  for(let e of item_list.items){
  //    console.log('e.name: ' + e.name);
  //  }
  //  console.log('-------------------------------------');
  //}

  //console.log('map <> state.is_dir_changed: ' + state.is_dir_changed);
  return {item_list: item_list, 
          active_pane_id: state.active_pane_id,
          line_cur: item_list.line_cur,
          action_type: state.action_type};

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
