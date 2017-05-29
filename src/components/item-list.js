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
    this.dir_cur = null;

    this.is_dir_changed = false;

    //console.log('ItemList constructor()');
    const store = this.props.store;

    this.unsubscribe = store.subscribe(() => {
      const store = this.props.store;
      const state = store.getState().state_core;
      //const state = store.getState();
      const id = this.props.id;
      const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
      const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
      const active_pane_id = this.props.active_pane_id;
      //const active_pane_id = state.get('active_pane_id');

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
    let rowRenderer = this._rowRenderer;

    const state = this.props.store.getState().state_core;
    //const state = this.props.store.getState();
    const id = this.props.id;
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
    const active_pane_id = this.props.active_pane_id;
    //const active_pane_id = state.get('active_pane_id');
    const idx = item_list.get('line_cur');
    //console.log('idx: ' + idx);

    if(this.im_items !== item_list.get('items_match')){
      this.im_items = item_list.get('items_match');
      //this.items = this.im_items.toArray();
      this.dir_cur = item_list.get('dir_cur');
      this.is_dir_changed = true;
    }else{
      this.is_dir_changed = false;
    }

    //console.log('items len: ' + this.items.length + ', im_items len: ' + this.im_items.size);

    if(this.im_items.size <= 0){
      return (
        <div ref="item_list" style={this._style_list}>
        </div>
      );
    }

    //const style_item_line = {
    //  display: 'flex',
    //  flex: 'auto',
    //  flexDirection: 'row',
    //  justifyContent: 'flex-start'
    //};

    //const cbForceUpdate = () => {
    //  this.setState();
    //  //this.forceUpdate();
    //};

    //console.log('item-list <> this.dir_cur: ' + this.dir_cur);

    //console.log('start map!!----------------------');
    //console.log('item-list <> Before map <> id: ' + id + ', is_dir_changed: ' + this.is_dir_changed);

    const items = state.getIn(['arr_item_name_lists', id]);
    //const items = state.getIn(['arr_item_name_lists', id]).toJS();


    const rref = 'item_list';

    //this.is_dir_changed = false;
    //console.log('item-list <> After map <> id: ' + id + ', is_dir_changed: ' + this.is_dir_changed);


    /* ORG */
//    const ret = <div ref={rref} style={this._style_list}>
//      {this.im_items
//        .map((e, i) => {
//          //const item = items[i];
//          //const basename = item['basename'];
//          //console.log('basename: ' + item);
//          //console.log('name: ' + e.get('basename'));
//          //console.log('size: ' + e.get('size'));
//          //console.log('e: ', e);
//          //console.log('im_items: ', this.im_items.get(i));
//          return (
//            <ViewItem c={i}
//                      id={id}
//                      item={e}
//                      //item={items[i]}
//                      dir_cur={this.dir_cur}
//                      line_cur={this.props.line_cur}
//                      active_pane_id={this.props.active_pane_id}
//                      />
//          );
//      })}
//    </div>

    /* ORG */
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
            //height: height + ROW_HEIGHT,
            rowCount: this.im_items.size,
            //rowCount: gitem_list.length,
            rowHeight: ROW_HEIGHT,
            scrollToAlignment: 'auto',
            scrollToIndex: this.props.line_cur/* this.props.cursor_pos */,
            cursor_pos: this.props.line_cur/* this.props.cursor_pos */,
            im_items: this.im_items,
            //items: items,
            id: id,
            active_pane_id: active_pane_id,
            dir_cur: dir_cur,
            is_dir_changed: this.is_dir_changed,
            ref: 'ListClass',
            rowRenderer: rowRenderer,
          }
        );
      }
    );

//        return React.createElement(
//          ListClass,
//          {
//            width: 311,
//            height: 464,
//            //height: height + ROW_HEIGHT,
//            rowCount: this.im_items.size,
//            //rowCount: gitem_list.length,
//            rowHeight: ROW_HEIGHT,
//            scrollToAlignment: 'auto',
//            scrollToIndex: this.props.line_cur/* this.props.cursor_pos */,
//            cursor_pos: this.props.line_cur/* this.props.cursor_pos */,
//            im_items: this.im_items,
//            //items: items,
//            id: id,
//            active_pane_id: active_pane_id,
//            dir_cur: dir_cur,
//            is_dir_changed: this.is_dir_changed,
//            ref: 'ListClass',
//            rowRenderer: rowRenderer,
//          }
//        );


  }

  _rowRenderer ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style,        // Style object to be applied to row (to position it)
    parent
  }) {
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
         boxSizing: 'border-box'
      }
    )

    //console.log('_rowRenderer <> im_items_cur: ', parent.props.im_items.getIn([5, 'name']));

//    let style_cell_base = {
//      color: '#FFFFFF',
//      background: '#333333',
//      verticalAlign: 'bottom',
//      borderCollapse: 'separate',
//      boxSizing: 'border-box'
//    }

    if(index == parent.props.cursor_pos){
      //console.log('key: ' + key + ', index: ' + index + ', p_cpos: ' + parent.props.cursor_pos + ', line_cur: ' + this.props.line_cur);
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
        //item={parent.props.im_items.get(index)}
        //item={parent.props.im_items}
        //item={parent.props.items[index]}
        //item={parent.props.items.get(index)}
        items={parent.props.im_items}
        dir_cur={this.dir_cur}
        line_cur={parent.props.cursor_pos}
        active_pane_id={this.props.active_pane_id}
        is_dir_changed={parent.props.is_dir_changed}
        index={index}
        />
    );

//    const style_outer = {
//      display: 'flex',
//      flex: 'auto',
//      flexDirection: 'column',
//      justifyContent: 'flex-start',
//      width: '100%',
//      height: '100%'
//    };
//
//    return (
//      <div style={style_outer}>
//        <ViewItem 
//          key={key}
//          c={index}
//          id={this.props.id}
//          //item={parent.props.im_items.get(index)}
//          //item={parent.props.im_items}
//          //item={parent.props.items[index]}
//          //item={parent.props.items.get(index)}
//          items={parent.props.im_items}
//          dir_cur={this.dir_cur}
//          line_cur={this.props.line_cur}
//          active_pane_id={this.props.active_pane_id}
//          index={index}
//          />
//      </div>
//    );

//    return (
//      <div
//        key={key}
//        style={style_cell}>
//        {parent.props.items[index]}
//      </div>
//    );

//    return (
//      <div
//        key={key}
//        style={style_cell}>
//        {parent.props.im_items.getIn([index, 'basename'])}
//      </div>
//    );

//    return (
//      <div
//        key={key}
//        style={style_cell}>
//        {gitem_list[index]}
//      </div>
//    );

  }


}


class ListClass extends List {
  constructor(props){
    super(props);
    this.state = {
      offset: 0,
    }
  }

//  shouldComponentUpdate(nextProps, nextState){
//    console.log('ListClass shouldComponentUpdate <> size_cur: ' + this.props.im_items.size + ', size_next: ' + nextProps.im_items.size);
//    console.log('ListClass shouldComponentUpdate <> this.props.cursor_pos: ' + this.props.cursor_pos + ', nextProps.cursor_pos: ' + nextProps.cursor_pos);
//
//    if( this.props.dir_cur === nextProps.dir_cur ){
//      return true;
//    }
//    /* Render only current line and previous line items. */
//    if( this.props.index === this.props.cursor_pos ||
//        this.props.index === nextProps.cursor_pos  ){
//      console.log('ListClass shouldComponentUpdate <> nextProps.cursor_pos: ' + nextProps.cursor_pos);
//        //console.log('name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
//      return true;
//    }else{
//      return false;
//    }
//
//    return true;
//  }

  componentDidUpdate(prevProps, prevState){
    //console.log('ListClass componentDidUpdate <> this.props: ', this.props);
    //console.log('ListClass componentDidUpdate <> cursor_pos: ' + this.props.cursor_pos);
    //console.log('ListClass componentDidUpdate <> prevProps.cursor_pos: ' + prevProps.cursor_pos);
    //console.log('ListClass componentDidUpdate <> size_cur: ' + this.props.im_items.size + ', size_prv: ' + prevProps.im_items.size);
    let offset = this.getOffsetForRow('auto', this.props.cursor_pos);

    this.forceUpdateGrid();

    const id = this.props.id;
    //const state_cur = this.props.store.getState().state_core;
    //const dir_cur = state_cur.getIn(['arr_pages', id, 'dir_cur']);
    //const state_prv = prevProps.store.getState().state_core;
    //const dir_prv = state_prv.getIn(['arr_pages', id, 'dir_cur']);
    const dir_cur = this.props.dir_cur;
    const dir_prv = prevProps.dir_cur;
    //console.log('ListClass componentDidUpdate <> dir_cur: ' + dir_cur + ', dir_prv: ' + dir_prv);

    //if(dir_cur !== dir_prv){
    //  console.log('dir IS Changed!!');
    //  console.log('ListClass componentDidUpdate <> im_items_cur: ', this.props.im_items.getIn([5, 'name']));
    //  console.log('ListClass componentDidUpdate <> im_items_prv: ', prevProps.im_items.getIn([5, 'name']));
    //}else{
    //  console.log('dir is NOT Changed!!');
    //}

    //switch(this.props.action_type){
    //  case 'CHANGE_DIR_UPPER':
    //  case 'CHANGE_DIR_LOWER':
    //    return;
    //  default:
    //    break;
    //}


    //console.log('ListClass componentDidUpdate <> offset: ' + offset +  ', prevState.offset: ' + prevState.offset);

    let ref = findDOMNode(this);
    let offset_top = ref.offsetTop;
    let client_height = ref.clientHeight;
    let client_width = ref.clientWidth;

    //console.log('ListClass componentDidUpdate <> offset_top: ' + offset_top + ', client_height: ' + client_height + ', client_width: ' + client_width);
    //console.log('ListClass componentDidUpdate <> rowCount: ' + this.props.rowCount);
    //console.log('ListClass componentDidUpdate <> id: ' + this.props.id + ', active_pane_id: ' + this.props.active_pane_id);

    if( (prevProps.cursor_pos === 0) &&
        (this.props.cursor_pos === (this.props.rowCount - 1)) ){
      this.scrollToPosition(offset + OFFSET_DELTA);
    }else if( (prevProps.cursor_pos === (this.props.rowCount - 1)) &&
              (this.props.cursor_pos === 0) ){
    }else if(this.props.cursor_pos > prevProps.cursor_pos){
      if(offset > prevState.offset){
        this.scrollToPosition(offset + OFFSET_DELTA);
      }
    }else if(this.props.cursor_pos < prevProps.cursor_pos){
    }else{
    }

    this.state.offset = offset;

    //this.scrollToPosition(0);

    return true;
  }

}



//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
