'use strict';

import { connect } from 'react-redux';
import { updateItemList } from '../actions'
import ItemList from '../components/item-list';
//import ItemListPages from '../core/item_list_pages';
import im from 'immutable';

const mapStateToProps = (state, props) => {
  //let id = props.id;
  //let item_list = state.arr_pages[id].page_cur;
  //item_list.items = state.arr_pages[id].items;

  //return {item_list: item_list, 
  //        active_pane_id: state.active_pane_id,
  //        line_cur: item_list.line_cur,
  //        action_type: state.action_type};

  //const pages = new ItemListPages().updatePageCur('C:\\msys64');
  //console.log('len1: ' + pages.get('pages').size);
  //const item_list2 = pages
  //                    .get('pages')
  //                    .get(pages .get('path_cur'));
  //return {item_list: item_list2, 
  //        active_pane_id: state.active_pane_id,
  //        line_cur: item_list.line_cur,
  //        action_type: state.action_type};


  //const pages_left = new ItemListPages().updatePageCur('C:\\msys64');
  //const pages_right = new ItemListPages().updatePageCur('C:\\Go');
  //const arr_pages = im.List.of(pages_left, pages_right);
  //console.log('pane-item-list <> arr_pages: ' + arr_pages);

  //console.log('state.arr_pages: ' + state.arr_pages);
  const id = props.id;
  const path_cur = state.getIn(['arr_pages', id, 'path_cur']);
  const item_list = state.getIn(['arr_pages', id, 'pages', path_cur]);

  return {item_list: item_list, 
          active_pane_id: state.get('active_pane_id'),
          line_cur: 0,
          action_type: state.get('action_type')};

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
