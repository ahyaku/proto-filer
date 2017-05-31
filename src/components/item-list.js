'use strict';

//import 'react-virtualized/styles.css';
import { List, AutoSizer} from 'react-virtualized';
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import util from 'util';
import im from 'immutable';
//import {ITEM_TYPE_KIND} from '../core/item_type';
import {ITEM_TYPE_KIND} from '../util/item_type';
import ViewItem from './view-item';
import PaneViewItem from '../containers/pane-view-item';

const LIST_MAX = 10000;
const ROW_HEIGHT = 16.0;
//const ROW_HEIGHT = 20.0;
const OFFSET_DELTA = 5;
//const OFFSET_DELTA = 0;

let gitem_list = [];

for(let i=0; i<LIST_MAX + 1; i++){
  gitem_list.push(i);
}

gitem_list[LIST_MAX] = '';



class ItemList extends React.Component {

  constructor(props){
    super(props);
    this._style_list = {
      background: '#333333',
      color: '#FFFFFF',
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
    //this.items = null;
    this.im_items = null;
    //this.dir_cur = null;

    this.is_dir_changed = false;

    //console.log('ItemList constructor()');
    const store = this.props.store;

    this.unsubscribe = store.subscribe(() => {
      const store = this.props.store;
      const state = store.getState().state_core;
      const id = this.props.id;
      const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
      const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);

      /* - When directory is changed. 
       * - When no item name is displayed.
       * */
      if(this.im_items !== item_list.get('items_match')){
        //console.log('subscribed function!!');
        this.is_dir_changed = true;
        console.log('subscribed function!! <> is_dir_changed: ' + this.is_dir_changed);
        this.setState();
        //this.forceUpdate();
      }
    });

    this._rowRenderer = this._rowRenderer.bind(this);
  }
  
  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    //console.log('ItemList <> render()');
    const rowRenderer = this._rowRenderer;
    const state = this.props.store.getState().state_core;
    const id = this.props.id;
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
    const active_pane_id = this.props.active_pane_id;
    const idx = item_list.get('line_cur');

    let is_dir_changed;

    if(this.im_items !== item_list.get('items_match')){
      this.im_items = item_list.get('items_match');
      is_dir_changed = true;
    }else{
      is_dir_changed = this.is_dir_changed;
    }
    this.is_dir_changed = false;

    if(this.im_items.size <= 0){
      return (
        <div ref="item_list" style={this._style_list}>
        </div>
      );
    }

    return React.createElement(
      AutoSizer,
      null,
      ({height, width}) => {
        //console.log('height: ' + height + ', width: ' + width + ', item_num: ' + this.im_items.size);
        return React.createElement(
          ListClass,
          {
            width: width,
            height: height,
            rowCount: this.im_items.size,
            rowHeight: ROW_HEIGHT,
            scrollToAlignment: 'auto',
            scrollToIndex: this.props.line_cur/* this.props.line_cur */,
            line_cur: this.props.line_cur/* this.props.line_cur */,
            im_items: this.im_items,
            id: id,
            active_pane_id: active_pane_id,
            dir_cur: dir_cur,
            is_dir_changed: is_dir_changed,
            ref: 'ListClass',
            style: {overflowY: 'scroll'},
            rowRenderer: rowRenderer,
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
        color: '#FFFFFF',
        background: '#333333',
        //outline: 'solid 1px #FF0000',
        //verticalAlign: 'bottom',
        //borderCollapse: 'separate',
        boxSizing: 'border-box',
        fontSize: '14px',
        verticalAlign: 'top'
      }
    )

    //console.log('_rowRenderer <> im_items_cur: ', parent.props.im_items.getIn([5, 'name']));

    if(index == parent.props.line_cur){
      //console.log('key: ' + key + ', index: ' + index + ', p_cpos: ' + parent.props.line_cur + ', line_cur: ' + this.props.line_cur);
      style_cell = Object.assign(
                     {},
                     style_cell_base,
                     {
                        borderTop: 'solid 1px #333333',
                        borderLeft: 'solid 1px #333333',
                        borderRight: 'solid 1px #333333',
                        borderBottom: 'solid 2px #333333',
                        zIndex: '1',
                     }
                   );
    }else{
      style_cell = Object.assign(
                     {},
                     style_cell_base,
                     {
                        borderTop: 'solid 1px #333333',
                        borderLeft: 'solid 1px #333333',
                        borderRight: 'solid 1px #333333',
                        borderBottom: 'solid 2px #333333',
                        zIndex: '0',
                     }
                   );
    }

    //console.log('this.im_items: ', parent.props.im_items.get(index));
    //console.log('items: ', parent.props.items[index]);
    //console.log('items: ', parent.props.items.get(index));

    return (
      <ViewItem 
        style={style_cell}
        key={key}
        c={index}
        id={this.props.id}
        items={parent.props.im_items}
        dir_cur={parent.props.dir_cur}
        line_cur={parent.props.line_cur}
        active_pane_id={parent.props.active_pane_id}
        is_dir_changed={parent.props.is_dir_changed}
        index={index}
        />
    );

  }

}


class ListClass extends List {
  constructor(props){
    super(props);
    this.state = {
      offset: 0,
    }
  }

  componentDidUpdate(prevProps, prevState){
    //console.log('ListClass componentDidUpdate()');

    let offset = this.getOffsetForRow('auto', this.props.line_cur);
    this.forceUpdateGrid();

    //console.log('ListClass componentDidUpdate <> offset: ' + offset +  ', prevState.offset: ' + prevState.offset);

    let ref = findDOMNode(this);
    let offset_top = ref.offsetTop;
    let client_height = ref.clientHeight;
    let client_width = ref.clientWidth;

    if( (prevProps.line_cur === 0) &&
        (this.props.line_cur === (this.props.rowCount - 1)) ){
      this.scrollToPosition(offset + OFFSET_DELTA);
    }else if( (prevProps.line_cur === (this.props.rowCount - 1)) &&
              (this.props.line_cur === 0) ){
    }else if(this.props.line_cur > prevProps.line_cur){
      if(offset > prevState.offset){
        this.scrollToPosition(offset + OFFSET_DELTA);
      }
    }else if(this.props.line_cur < prevProps.line_cur){
    }else{
    }

    this.state.offset = offset;

    return true;
  }

}



//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
