'use strict';

import { connect } from 'react-redux';
import Redux from 'redux';
import im from 'immutable';
import ViewItem from '../components/view-item';

////const mapStateToProps = (init_state, init_props) => {
////const mapStateToProps = (init_state, init_props) => {
//const mapStateToProps = (init_state, init_props) => (state) => {
////const mapStateToProps = (_, props) => {
//  const id = init_props.id;
//  const dir_cur = init_state.getIn(['arr_pages', id, 'dir_cur']);
//  const item_list = init_state.getIn(['arr_pages', id, 'pages', dir_cur]);
//  const im_items = item_list.get('items_match');
//  //const line_cur = item_list.get('line_cur');
//  const item_id = init_props.id;
//
//  const style = init_props.style;
//  const key = init_props.key;
//  const c = init_props.c;
//  const ref = init_props.ref;
//  const store = init_props.store;
//  const active_pane_id = init_state.get('active_pane_id');
//  
//  const line_cur = init_props.line_cur;
//
//  //return (state, props) => {
//  //return (state) => {
//  //return () => {
//  //return (_, props) => {
//    //const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//    //const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
//    ////console.log('pane-vie-item <> c: ' + props.c);
//    //const im_items = item_list.get('items_match');
//    ////im_items.forEach((e, i) => {
//    ////  console.log('pane-view-item <> e: ' + e.get('name'));
//    ////});
//    //const line_cur = item_list.get('line_cur');
//    ////const item_id = props.id;
//
//    //const line_cur = props.line_cur;
//    //console.log('props: ' + props);
//    console.log('line_cur: ' + line_cur);
//    //console.log('HERE!!');
//  
//    //console.log('c: ' + c);
//    return { style: style,
//             key: key,
//             im_items: im_items,
//             c: c,
//             line_cur: line_cur,
//             //line_cur: props.line_cur,
//             ref: ref,
//             active_pane_id: active_pane_id,
//             //store: store,
//             state: state,
//             id: id
//    };
//  //};
//}

const mapStateToProps = (state, props) => {
  const id = props.id;
  //const line_cur = state.getIn(['arr_line_cur', id]);
  //console.log('c: ' + props.c + ', line_cur: ' + line_cur);

  //if( (props.is_dir_changed !== true) &&
  //    (line_cur !== props.c)){

  //    return { style: props.style,
  //             key: props.key,
  //             im_items: null,
  //             c: props.c,
  //             line_cur: line_cur,
  //             ref: props.ref,
  //             active_pane_id: null,
  //             store: props.store,
  //             id: props.id
  //    };

  //}

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
           id: props.id,
           is_dir_changed: props.is_dir_changed
  };

}

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
