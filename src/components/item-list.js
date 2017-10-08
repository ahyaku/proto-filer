'use strict';

import { ipcRenderer } from 'electron';
import { List, AutoSizer} from 'react-virtualized';
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import util from 'util';
import im from 'immutable';
//import {ITEM_TYPE_KIND} from '../core/item_type';
import { ITEM_TYPE_KIND } from '../util/item_type';
import ViewItem from './view-item';
import PaneViewItem from '../containers/pane-view-item';
import { KEY_INPUT_MODE } from '../util/item_type';
import { RES } from '../../res/res';

const LIST_MAX = 10000;
const FONT_SIZE = '13px';
const LINE_DISP_MARGIN = 1;
//const OFFSET_DELTA = 5;
//const OFFSET_DELTA = 0;

class ItemList extends React.Component {

  constructor(props){
    super(props);
    this._style_list = {
      //background: '#333333',
      //color: '#FFFFFF',
      background: '#333333FF',
      color: '#FFFFFFFF',
      display: 'flex',
      flex: 'auto',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      //textOverflowX: 'ellipsis',
      //overflowX: 'ellipsis',
      overflowX: 'hidden',
      overflowY: 'scroll',
      //borderLeft: 'solid 1px #FFFFFF',
      //borderRight: 'solid 1px #FFFFFF',
      //borderBottom: 'solid 1px #FFFFFF',
      boxSizing: 'border-box',
    }

    this._arr_pos = [];
    for(let i=0; i<2; i++){
      this._arr_pos[i] = [];
    }

    this.count = 0;
    this.names = null;
    //this.im_items = null;

    //this.dir_cur = null;
    this.id_map_nrw = null

    this.line_top = 0;
    this.line_bottom = 0;
    this.line_disp_num = 0;

    this._rowRenderer = this._rowRenderer.bind(this);
    this._onRowsRendered = this._onRowsRendered.bind(this);

    this.state = {
      scroll_align: 'auto',
      scroll_to_index: 0
      //line_top: 0,
      //line_bottom: 0
    }
    
    //this.mynode = findDOMNode(this);
    //console.log('this.node: ', this.mynode);
  }
  
//  componentWillUnmount(){
//    this.unsubscribe();
//  }

  render(){
    //console.log('ItemList <> render()');
    const rowRenderer = this._rowRenderer;
    const onRowsRendered = this._onRowsRendered;
    const id = this.props.id;
    const dir_cur = this.props.dir;
    const page = this.props.page;
    const id_map_nrw = page.get('id_map_nrw');
    const active_pane_id = this.props.active_pane_id;

    this.id_map_nrw = id_map_nrw;

    //console.log('ItemList() <> this.id_map_nrw: ' + this.id_map_nrw);

    if(this.id_map_nrw.size <= 0){
      return (
        <div ref="item_list" style={this._style_list}>
        </div>
      );
    }

    const im_items = this._getItemsByMap(page);
    const is_selected = this._getIsSelectedByMap(page);
    //console.log('item-list <> is_selected: ', is_selected);

//    if(id === active_pane_id){
//      console.log('item-list <> ', page.getIn(['items', dir_cur, 1, 'name']));
//      console.log('item-list <> im_items: ', im_items);
//      console.log('item-list <> im_items.get(0): ', im_items.get(0));
//    }

    //if(this.props.id === 0){
    //  console.log('ItemList <> pane_id: ' + this.props.id + ', line_cur: ' + this.props.line_cur);
    //}

    //console.log('item-list render <> this.scroll_to_index: ' + this.scroll_to_index);
    //const scroll_to_index = this.props.action_type === 'DIR_CUR_IS_UPDATED'
    //                          ? this.scroll_to_index
    //                          : this.props.line_cur;

    //let scroll_to_index;
    //if( this.props.action_type === 'DIR_CUR_IS_UPDATED' ){
    //  scroll_to_index = this.scroll_to_index;
    //}else{
    //  scroll_to_index = this.props.line_cur;
    //}

    //console.log('item-list render <> scroll_to_index: ' + scroll_to_index + ', this.scroll_to_index: ' + this.scrill_to_index);
    //console.log('item-list render <> this.state.scroll_to_index: ' + this.state.scroll_to_index);

    //const onRowsRendered = ({overscanStartIndex, overscanStopIndex, startIndex, stopIndex}) => {
    //  //console.log('item-list render <> ostart: ' + overscanStartIndex + ', ostop: ' + overscanStopIndex + ', start: ' + startIndex + ', stop: ' + stopIndex);
    //  this.scroll_to_index = stopIndex - 1;
    //  //this.setState();
    //  //this.setState({scroll_to_index: stopIndex - 1});
    //}

    return React.createElement(
      AutoSizer,
      {
        ref: 'AutoSizer'
      },
      ({height, width}) => {
        //console.log('height: ' + height + ', width: ' + width + ', item_num: ' + im_items.size);
        return React.createElement(
          List,
          {
            width: width,
            height: height,
            rowCount: this.id_map_nrw.size,
            rowHeight: RES.ITEM.HEIGHT,
            scrollToAlignment: this.state.scroll_align,
            scrollToIndex: this.state.scroll_to_index/* this.props.line_cur */,
            line_cur: this.props.line_cur/* this.props.line_cur */,
            im_items: im_items,
            is_selected: is_selected,
            id: id,
            active_pane_id: active_pane_id,
            dir_cur: dir_cur,
            id_map_nrw: id_map_nrw,
            //is_dir_changed: is_dir_changed,
            //ref: 'ListClass',
            ref: 'List',
            style: {overflowY: 'scroll'},
            rowRenderer: rowRenderer,
            onRowsRendered: onRowsRendered,
            action_type: this.props.action_type
          }
        );
      }
    );

  }

  _rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style,        // Style object to be applied to row (to position it)
    parent
  }) {
    //console.log('_rowRenderer');
    let style_cell;
    let style_cell_base = Object.assign(
      {},
      style,
      {
        //color: '#FFFFFF',
        //background: '#333333FF',
        color: 'rgba(255,255,255,1)',
        background: 'rgba(51,51,51,1)',
        //textDecoration: 'underline solid 1px red',
        //textDecoration: 'underline',
        //textDecorationColor: 'red',
        //textDecorationColor: '#FF0000FF',

        //color: '#FFFFFF',
        //background: '#333333',

        //textDecoration: 'underline #FFFFFF',
        //outline: 'solid 1px #FF0000',
        //verticalAlign: 'bottom',
        //borderCollapse: 'separate',
        boxSizing: 'border-box',
        fontSize: FONT_SIZE,
        verticalAlign: 'top'
      }
    )

    //console.log('_rowRenderer <> im_items_cur: ', parent.props.im_items.getIn([5, 'name']));

    if(index == parent.props.line_cur){
      //console.log('key: ' + key + ', index: ' + index + ', p_cpos: ' + parent.props.line_cur + ', line_cur: ' + this.props.line_cur);
      //console.log('pane_id: ' + this.props.id + ', line_cur: ' + this.props.line_cur);
      const zindex = parent.props.im_items.size;
      style_cell = Object.assign(
                     {},
                     style_cell_base,
                     {
                        //borderTop: 'solid 1px #333333',
                        //borderLeft: 'solid 1px #333333',
                        //borderRight: 'solid 1px #333333',
                        //borderBottom: 'solid 2px #333333',
                        borderTop:    'solid 1px rgba(51,51,51,1)',
                        borderLeft:   'solid 1px rgba(51,51,51,1)',
                        borderRight:  'solid 1px rgba(51,51,51,1)',
                        borderBottom: 'solid 1px rgba(51,51,51,1)',
                        opacity: 1,
                        //zIndex: '1',
                        zIndex: zindex,
                     }
                   );
    }else{
      const zindex = parent.props.im_items.size - index - 1;
      style_cell = Object.assign(
                     {},
                     style_cell_base,
                     {
                        //borderTop: 'solid 1px #333333',
                        //borderLeft: 'solid 1px #333333',
                        //borderRight: 'solid 1px #333333',
                        //borderBottom: 'solid 2px #333333',
                        borderTop:    'solid 1px rgba(51,51,51,1)',
                        borderLeft:   'solid 1px rgba(51,51,51,1)',
                        borderRight:  'solid 1px rgba(51,51,51,1)',
                        borderBottom: 'solid 1px rgba(51,51,51,1)',
                        opacity: 1,
                        //zIndex: '0',
                        zIndex: index,
                     }
                   );
    }

    //console.log('this.im_items: ', parent.props.im_items.get(index));
    //console.log('this.im_items: ', parent.props.im_items.getIn([index, 'name']));
    //console.log('items: ', parent.props.items[index]);
    //console.log('items: ', parent.props.items.get(index));

    //console.log('item-list _rowRenderer <> is_selected: ', parent.props.is_selected);

    return (
      <ViewItem 
        style={style_cell}
        key={key}
        c={index}
        id={this.props.id}
        items={parent.props.im_items}
        is_selected={parent.props.is_selected}
        dir_cur={parent.props.dir_cur}
        line_cur={parent.props.line_cur}
        active_pane_id={parent.props.active_pane_id}
        id_map_nrw={parent.props.id_map_nrw}
        //is_dir_changed={parent.props.is_dir_changed}
        index={index}
        />
    );

  }

  _onRowsRendered({overscanStartIndex, overscanStopIndex, startIndex, stopIndex}){
    //console.log('item-list render <> ostart: ' + overscanStartIndex + ', ostop: ' + overscanStopIndex + ', start: ' + startIndex + ', stop: ' + stopIndex);
    this.state.scroll_to_index = stopIndex;
    this.line_top = startIndex;
    this.line_bottom = stopIndex;
    const line_disp_num_new = stopIndex - startIndex + 1;

    //console.log('item-list onrows <> line [top, cur, bottom] = [' + startIndex + ', ' + this.state.scroll_to_index + ', ' + stopIndex + ']');
    //console.log('item-list onrows <> line [top, cur, bottom] = [' + this.line_top + ', ' + this.props.line_cur + ', ' + this.line_bottom + '], num: ' + this.line_disp_num);

    //console.log('item-list onrows(' + this.props.id + ') <> line [top, cur, bottom] = [' + this.line_top + ', ' + this.props.line_cur + ', ' + this.line_bottom + '], num: ' + this.line_disp_num);

    //{
    //  let height_win_new = 0;
    //  if(this.line_disp_num === line_disp_num_new){
    //    this.line_disp_num = line_disp_num_new;
    //    height_win_new = RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * this.line_disp_num + RES.INFO.HEIGHT;
    //  }else if(this.line_disp_num < line_disp_num_new){
    //    this.line_disp_num = line_disp_num_new;
    //    height_win_new = Math.ceil(RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * this.line_disp_num + RES.INFO.HEIGHT);
    //  }else{
    //    this.line_disp_num = line_disp_num_new;
    //    height_win_new = Math.floor(RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * this.line_disp_num + RES.INFO.HEIGHT);
    //  }
    //  //console.log('ItemList componentDidUpdate(' + this.props.id + ') <> this.line_disp_num: ' + this.line_disp_num + ', height_sum: ' + height_sum);
    //  ipcRenderer.send('update_window_size', height_win_new);
    //}

    this.line_disp_num = line_disp_num_new;

  }

  _getItemsByMap(page){
    //console.log('getItemsByMap <> id_map_nrw: ', page.get('id_map_nrw'));
    //console.log('getItemsByMap <> items: ', page.get('items'));
    
    const items = page.get('id_map_nrw').map(
                    (e, i) => {
                      //console.log('getItemsByMap <> items[' + i + '].name: ' + page.getIn(['items', e, 'name']));
                      return page.getIn(['items', e]);
                    }
                  );

    //console.log('getItemsByMap <> items.size: ', items.size);

    return items;
  }

  _getIsSelectedByMap(page){
    //console.log('getItemsByMap <> id_map_nrw: ', page.get('id_map_nrw'));
    //console.log('getItemsByMap <> items: ', page.get('items'));
    
    const is_selected = page.get('id_map_nrw').map(
                          (e, i) => {
                            //console.log('getItemsByMap <> items[' + i + '].name: ' + page.getIn(['items', e, 'name']));
                            return page.getIn(['is_selected', e]);
                          }
                        );

    //console.log('getItemsByMap <> items.size: ', items.size);

    return is_selected;
  }

  componentWillReceiveProps(nextProps){
    //console.log('componentWillReceiveProps()');

    let scroll_to_index = 0;
    let scroll_align = 'auto';
    //console.log('action_type: ' + nextProps.action_type);
    switch(nextProps.action_type){
      case 'DIR_CUR_IS_UPDATED':
        scroll_to_index = this.state.scroll_to_index;
        break;
      case 'MOVE_CURSOR_UP':
        if( (nextProps.line_cur === 0) ||
            (nextProps.line_cur === this.id_map_nrw.size - 1) ){
          scroll_to_index = nextProps.line_cur;
        }else{
          scroll_to_index = nextProps.line_cur - LINE_DISP_MARGIN;
        }
        break;
      case 'MOVE_CURSOR_DOWN':
        if( (nextProps.line_cur === 0) ||
            (nextProps.line_cur === this.id_map_nrw.size - 1) ){
          scroll_to_index = nextProps.line_cur;
        }else{
          scroll_to_index = nextProps.line_cur + LINE_DISP_MARGIN;
        }
        break;
      case 'UPDATE_FOR_PAGE_UP':
        if(nextProps.line_cur === this.props.line_cur){
          return;
        }else{
          scroll_align = 'end';
          scroll_to_index = this.line_top;
        }
        break;
      case 'UPDATE_FOR_PAGE_DOWN':
        if(nextProps.line_cur === this.props.line_cur){
          return;
        }else{
          scroll_align = 'start';
          scroll_to_index = this.line_bottom;
        }
        break;
      case 'UPDATE_FOR_MOVE_CURSOR_TO_TOP':
        scroll_align = 'start';
        scroll_to_index = this.line_top;
        break;
      case 'UPDATE_FOR_MOVE_CURSOR_TO_BOTTOM':
        scroll_align = 'end';
        scroll_to_index = this.line_bottom;
        break;
      case 'CHANGE_DIR_UPPER':
      case 'CHANGE_DIR_LOWER':
        scroll_align = 'center';
        scroll_to_index = nextProps.line_cur;
        break;
      default:
        scroll_to_index = nextProps.line_cur;
        break;
    }

    //console.log('item-list will <> nextProps.line_cur: '+ nextProps.line_cur + ', scroll_to_index: ' + scroll_to_index);

    //console.log('item-list will <> line [top, cur, bottom] = [' + this.state.line_top + ', ' + nextProps.line_cur + ', ' + this.state.line_bottom + ']');


    this.setState({
      scroll_align: scroll_align,
      scroll_to_index: scroll_to_index
    });

  }

  shouldComponentUpdate(nextState, nextProps){
    //const node = findDOMNode(this);
    //console.log('ItemList <> node: ', node);
    //console.log('ItemList <> node: ', node.getBoundingClientRect());
    //console.log('ItemList <> node: ', node.offsetTop);
    //console.log('ItemList <> node: ', node.scrollTop);
    return true;
  }

  componentDidUpdate(prevState, prevProps){

    //console.log('ItemList componentDidUpdate()');
    if(typeof this.refs.AutoSizer !== 'undefined'){
      this.refs.AutoSizer.refs.List.forceUpdateGrid();
    }
    //console.log('item-list <> componentDidUpdate() input_mode: ' + this.props.input_mode);
    if( this.props.active_pane_id === this.props.id ){
      switch( this.props.action_type ){
        case 'PAGE_UP':
          {
            const line_next = this.line_top - this.line_disp_num + 1 + (this.props.line_cur - this.line_top);
            this.props.updatePageWithCursorJump( this.props.action_type, Math.max(line_next, 0) );
          }
          break;
        case 'PAGE_DOWN':
          {
            const line_next = this.line_bottom + (this.props.line_cur - this.line_top);
            this.props.updatePageWithCursorJump( this.props.action_type, Math.min(line_next, this.id_map_nrw.size - 1) );
          }
          break;
        case 'MOVE_CURSOR_TO_TOP':
          this.props.updatePageWithCursorJump( this.props.action_type, this.line_top + LINE_DISP_MARGIN );
          break;
        case 'MOVE_CURSOR_TO_BOTTOM':
          this.props.updatePageWithCursorJump( this.props.action_type, this.line_bottom - LINE_DISP_MARGIN );
          break;
        default:
          /* Do Nothing.. */
          break;
      }

      if( this.props.input_mode ===  KEY_INPUT_MODE.POPUP ){
        const node = findDOMNode(this);
        const rect = node.getBoundingClientRect();
        //const node_root = this.props.cbGetNodeRoot();
        //console.log('rect [left, top] = [' + rect.left + ', ' + rect.top + ']');
        //console.log('refs: ', this.refs);
        this.props.dispPopUpForSort(rect.left, rect.top);
      }
    }


    //if(typeof this.refs.AutoSizer !== 'undefined'){
    //  let ref = findDOMNode(this.refs.AutoSizer.refs.List);
    //  let offset_top = ref.offsetTop;
    //  let client_width = ref.clientWidth;
    //  let client_height = ref.clientHeight;
    //  let scroll_top = ref.scrollTop;
    //  let scroll_width = ref.scrollWidth;
    //  let scroll_height = ref.scrollHeight;

    //  //let line_disp_top = scroll_top / RES.ITEM.HEIGHT;
    //  let line_disp_top = Math.ceil(scroll_top / RES.ITEM.HEIGHT);
    //  let line_disp_bottom = (scroll_top + client_height) / RES.ITEM.HEIGHT;
    //  //let line_disp_bottom = Math.floor( (scroll_top + client_height) / RES.ITEM.HEIGHT ) - 1;
    //  let line_disp_num = line_disp_bottom - line_disp_top + 1;

    //  //console.log('ItemList componentDidUpdate <> client [offset_top, w, h] = [' + offset_top +  ', ' + client_width + ', ' + client_height + ']');
    //  //console.log('ItemList componentDidUpdate <> scroll [scroll_top, w, h ,line_disp_top, line_cur, line_disp_bottom] = [' + scroll_top +  ', ' + scroll_width + ', ' + scroll_height + ', ' + line_disp_top + ', ' + this.props.line_cur + ', ' + line_disp_bottom + ']');
    //  
    //  if(this.props.action_type === 'IS_CHANGED_MAIN_WINDOW_SIZE'){
    //    const num_item_disp = Math.floor( client_height / RES.ITEM.HEIGHT );
    //    const offset_height = ref.offsetHeight;
    //    //console.log('ItemList componentDidUpdate <> client_height( ' + client_height +  ') / H(' + RES.ITEM.HEIGHT + ') = ' + client_height / RES.ITEM.HEIGHT);
    //    //console.log('ItemList componentDidUpdate <> client_height: ' + client_height +  ', num(' + num_item_disp + ')* h: ' + num_item_disp * RES.ITEM.HEIGHT);
    //    //console.log('ItemList componentDidUpdate <> offset_height: ' + offset_height);

    //    //{
    //    //  const ref_this = findDOMNode(this);
    //    //  const client_height_this = ref_this.clientHeight;
    //    //  console.log('ItemList componentDidUpdate <> client_height_this: ' + client_height_this);
    //    //}

    //    const height_sum = RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * num_item_disp + RES.INFO.HEIGHT;
    //    //console.log('ItemList componentDidUpdate(' + this.props.id + ') <> num_item_disp: ' + num_item_disp + ', this.line_disp_num: ' + this.line_disp_num +  ', height_sum: ' + height_sum);

    //    const height_delta = client_height - num_item_disp * RES.ITEM.HEIGHT;
    //    this.props.updateInfoPaneHeight(height_delta);
    //  }
    //}


    //if( (prevProps.line_cur === 0) &&
    //    (this.props.line_cur === (this.props.rowCount - 1)) ){
    //  this.scrollToPosition(offset + OFFSET_DELTA);
    //}else if( (prevProps.line_cur === (this.props.rowCount - 1)) &&
    //          (this.props.line_cur === 0) ){
    //}else if(this.props.line_cur > prevProps.line_cur){
    //  if(offset > prevState.offset){
    //    this.scrollToPosition(offset + OFFSET_DELTA);
    //  }
    //}else if(this.props.line_cur < prevProps.line_cur){
    //}else{
    //}
    //this.state.offset = offset;

  }

}

//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
