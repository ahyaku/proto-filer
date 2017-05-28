'use strict';

import { connect } from 'react-redux';
import Redux from 'redux';
import im from 'immutable';
import ViewItem from '../components/view-item';

const mapStateToProps = (init_state_fcd, init_props) => {
  return (state_fcd) => {
    const state_core = state_fcd.state_core;
    console.log();
    return {
      active_pane_id: state_fcd.active_pane_id,
      line_cur: state_fcd.arr_line_cur[init_props.id],
      item: state_fcd.arr_items[init_props.id][init_props.c],
      //im_item: state.getIn(['arr_im_items', init_props.id, init_props.c]) // NOTE!!: This line makes the performance slow!!
    }
  };

  //return (state_fcd) => ({
  //         active_pane_id: state_fcd.active_pane_id,
  //         line_cur: state_fcd.arr_line_cur[init_props.id],
  //         item: state_fcd.arr_items[init_props.id][init_props.c],
  //         //im_item: state.getIn(['arr_im_items', init_props.id, init_props.c]) // NOTE!!: This line makes the performance slow!!
  //})
}

//const mapStateToProps = (init_state_fcd, init_props) => (state_fcd) => {
//  const state = state_fcd.state_core;
//
//  const id = init_props.id;
//
//  const line_cur = state_fcd.arr_line_cur[id];
//  //const line_cur = state.get('arr_line_cur')[id];
//
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  return { style: init_props.style,
//           key: init_props.key,
//           c: init_props.c,
//           line_cur: line_cur,
//           active_pane_id: state.get('active_pane_id'),
//           store: init_props.store,
//           id: init_props.id,
//           is_dir_changed: init_props.is_dir_changed,
//           //im_item: state.getIn(['arr_im_items', id, init_props.c]) // NOTE!!: This line makes the performance slow!!
//  };
//}

//const mapStateToProps = (init_state, init_props) => (state) => {
//  const id = init_props.id;
//  const line_cur = state.get('arr_line_cur')[id];
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  return { style: init_props.style,
//           key: init_props.key,
//           c: init_props.c,
//           line_cur: line_cur,
//           active_pane_id: state.get('active_pane_id'),
//           store: init_props.store,
//           id: init_props.id,
//           is_dir_changed: init_props.is_dir_changed,
//           //im_item: state.getIn(['arr_im_items', id, init_props.c]) // NOTE!!: This line makes the performance slow!!
//  };
//}

//const mapStateToProps = (init_state, init_props) => (state) => {
//  //if(init_props.is_dir_changed === true){
//  //  console.log('pane-vie-item.js <> is_dir_changed!!');
//  //}
//  //console.time('mapStateToProps');
//  const id = init_props.id;
//  const line_cur = state.getIn(['arr_line_cur', id]);
//  //console.log('c: ' + init_props.c + ', line_cur: ' + line_cur);
// 
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//
//  //if( (init_props.is_dir_changed !== true) &&
//  //    (line_cur !== init_props.c)){
//
//  //    return { dir_cur: dir_cur };
//  //}
//
//  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
//  //console.log('pane-vie-item <> c: ' + init_props.c);
//  const im_items = item_list.get('items_match');
//  //const item = im_items.get(init_props.c);
//  //im_items.forEach((e, i) => {
//  //  console.log('pane-view-item <> e: ' + e.get('name'));
//  //});
//
//  //const line_cur = item_list.get('line_cur');
//  const item_id = init_props.id;
//
//  //console.log('pane-view-item <> dir_cur: ' + dir_cur);
//
//  //return {};
//
//  //console.log('pane-view-item');
//
//  //console.timeEnd('mapStateToProps');
//
//  return { style: init_props.style,
//           key: init_props.key,
//           im_items: im_items,
//           dir_cur: dir_cur,
//           c: init_props.c,
//           line_cur: line_cur,
//           ref: init_props.ref,
//           active_pane_id: state.get('active_pane_id'),
//           store: init_props.store,
//           id: init_props.id,
//           is_dir_changed: init_props.is_dir_changed
//  };
//
//}

//const mapStateToProps = (state, props) => {
//  if(props.is_dir_changed === true){
//    console.log('pane-view-item.js <> is_dir_changed!!');
//  }
//  const id = props.id;
//  const line_cur = state.getIn(['arr_line_cur', id]);
//  //console.log('c: ' + props.c + ', line_cur: ' + line_cur);
// 
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//
//  //if( (props.is_dir_changed !== true) &&
//  //    (line_cur !== props.c)){
//
//  //    return { dir_cur: dir_cur };
//  //}
//
//  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
//  //console.log('pane-vie-item <> c: ' + props.c);
//  const im_items = item_list.get('items_match');
//  //const item = im_items.get(props.c);
//  //im_items.forEach((e, i) => {
//  //  console.log('pane-view-item <> e: ' + e.get('name'));
//  //});
//
//  //const line_cur = item_list.get('line_cur');
//  const item_id = props.id;
//
//  //console.log('pane-view-item <> dir_cur: ' + dir_cur);
//
//  //return {};
//
//  //console.log('pane-view-item');
//
//  return { style: props.style,
//           key: props.key,
//           im_items: im_items,
//           dir_cur: dir_cur,
//           c: props.c,
//           line_cur: line_cur,
//           ref: props.ref,
//           active_pane_id: state.get('active_pane_id'),
//           store: props.store,
//           id: props.id,
//           is_dir_changed: props.is_dir_changed
//  };
//
//}

/* ORG */
//const mapStateToProps = (state, props) => {
//  const id = props.id;
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
//  //console.log('pane-vie-item <> c: ' + props.c);
//  const im_items = item_list.get('items_match');
//  //const item = im_items.get(props.c);
//  //im_items.forEach((e, i) => {
//  //  console.log('pane-view-item <> e: ' + e.get('name'));
//  //});
//  const line_cur = item_list.get('line_cur');
//  const item_id = props.id;
//
//  //console.log('pane-view-item <> dir_cur: ' + dir_cur);
//
//  //return {};
//
//  //console.log('pane-view-item');
//
//  return { style: props.style,
//           key: props.key,
//           im_items: im_items,
//           c: props.c,
//           line_cur: line_cur,
//           ref: props.ref,
//           active_pane_id: state.get('active_pane_id'),
//           store: props.store,
//           id: props.id
//  };
//
//}

const PaneViewItem = connect(
  mapStateToProps
)(ViewItem);

export default PaneViewItem;
