'use strict';

import { connect } from 'react-redux';
import im from 'immutable';
import { renderIcon } from '../actions'
import ItemList from '../components/item-list';
import { KEY_INPUT_MODE } from '../util/item_type';
//import { DISK_DRIVE, BOOKMARK, HISTORY } from '../util/item_list';

const mapStateToProps = (state, props) => {
  const active_pane_id = state.active_pane_id;
  const dir_cur = state.state_core.getIn([props.id, 'dirs', 0]);
  const page = state.state_core.getIn([props.id, 'pages', dir_cur]);
  const line_cur = state.state_core.getIn([props.id, 'pages', dir_cur, 'line_cur']);
  const icons = page.get('icons');

  //const dir = _getDirCur(state, props.id);
  //const page = _getPage(state, props.id);
  //const line_cur = state.state_core.getIn([props.id, 'pages', dir, 'line_cur']);

  //const {dir, page, line_cur} = _getContext(state, props.id);

  //console.log('pane-item-list <> pane_id: ' + props.id + ', line_cur: ' + line_cur);

  //if(props.id === active_pane_id){
  //  //console.log('pane-item-list <> id: ' + props.id + ', dir: ' + dir);
  //  console.log('pane-item-list <> line_cur: ' + line_cur);
  //}

  return {
    active_pane_id: active_pane_id,
    dir_cur: dir_cur,
    page: page,
    id: props.id,
    line_cur: line_cur,
    input_mode: state.input_mode,
    icons: icons,
    action_type: state.action_type
  };
}

//const _getContext = (state, id) => {
//  console.log('action_type: ' + state.action_type);
//
//  if(state.active_pane_id !== id){
//    return _getContextCore(state, id);
//  }
//
//  switch(state.action_type){
//    case 'OPEN_BOOKMARK':
//      console.log('BOOKMARK!!');
//      //return state.pages_sc.get(BOOKMARK);
//      return {
//        dir: BOOKMARK,
//        page: state.pages_sc.get(BOOKMARK),
//        line_cur: 0
//      };
//    case 'CHANGE_DRIVE':
//    case 'OPEN_HISTORY':
//    default:
//      {
//        return _getContextCore(state, id);
//      }
//  }
//}
//
//const _getContextCore = (state, id) => {
//  const dir = state.state_core.getIn([id, 'dirs', 0]);
//  const line_cur = state.state_core.getIn([id, 'pages', dir, 'line_cur']);
//  return {
//    dir: dir,
//    page: state.state_core.getIn([id, 'pages', dir]),
//    line_cur: line_cur
//  };
//}
//
//const _getPage = (state, id) => {
//  console.log('action_type: ' + state.action_type);
//  switch(state.action_type){
//    case 'OPEN_BOOKMARK':
//      console.log('BOOKMARK!!');
//      return state.pages_sc.get(BOOKMARK);
//    case 'CHANGE_DRIVE':
//    case 'OPEN_HISTORY':
//    default:
//      {
//        const dir = state.state_core.getIn([id, 'dirs', 0]);
//        return state.state_core.getIn([id, 'pages', dir]);
//      }
//  }
//}
//
//const _getDirCur = (state, id) => {
//  switch(state.action_type){
//    case 'OPEN_BOOKMARK':
//      return BOOKMARK;
//    case 'CHANGE_DRIVE':
//      return DISK_DRIVE;
//    case 'OPEN_HISTORY':
//      return HISTORY;
//    default:
//      return state.state_core.getIn([id, 'dirs', 0]);
//  }
//}

const mapDispatchToProps = (dispatch, props) => ({
  dispPopUpForSort: (left, top) => {
    dispatch({
      type: 'DISP_POPUP_FOR_SORT_ITEM_LIST',
      left: left,
      top: top
    });
  },
  dispPopUpForRename: (left, top, item_name, dir_cur, id_target) => {
    //console.log('dispPopUpForRename <> item_name: ' + item_name + ', dir_cur: ' + dir_cur);
    dispatch({
      type: 'DISP_POPUP_FOR_RENAME_ITEM',
      left: left,
      top: top,
      item_name: item_name,
      dir_cur: dir_cur,
      id_target: id_target
    });
  },
  updatePageWithCursorJump: (pre_action, line_new) => {
    dispatch({
      type: 'UPDATE_FOR_' + pre_action,
      line_new: line_new,
    });
  },
  renderIconFcd: (id) => {
    //console.log('pane-item-list renderIconFcd() <> id: ' + id);
    dispatch(renderIcon(id));
  },
  //updateInfoPaneHeight: (height_delta) => {
  //  dispatch({
  //    type: 'UPDATE_INFO_PANE_HEIGHT',
  //    height_delta: height_delta
  //  });
  //},
  //updateWindowHeight: (height_win) => {
  //  dispatch({
  //    type: 'UPDATE_INFO_PANE_HEIGHT',
  //    height_win: height_win
  //  });
  //},
  props
});

const PaneItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList);

//const PaneItemList = connect(
//  mapStateToProps
//)(ItemList);

export default PaneItemList;
