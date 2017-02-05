'use strict';


import { connect } from 'react-redux';
import Redux from 'redux';
import im from 'immutable';
import ViewItem from '../components/view-item';


const mapStateToProps = (state, props) => {
  const id = props.id;
  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
  //console.log('pane-vie-item <> c: ' + props.c);
  const im_items = item_list.get('items_match');
  //const item = im_items.get(props.c);
  //im_items.forEach((e, i) => {
  //  console.log('pane-view-item <> e: ' + e.get('name'));
  //});
  const line_cur = item_list.get('line_cur');
  const item_id = props.id;

  //console.log('pane-view-item <> dir_cur: ' + dir_cur);

  //return {};

  //console.log('pane-view-item');

  return { style: props.style,
           key: props.key,
           im_items: im_items,
           c: props.c,
           line_cur: line_cur,
           ref: props.ref,
           active_pane_id: state.get('active_pane_id'),
           store: props.store,
           id: props.id
  };

}

const PaneViewItem = connect(
  mapStateToProps
)(ViewItem);

export default PaneViewItem;
