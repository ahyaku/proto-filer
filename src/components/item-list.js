'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import util from 'util';
import im from 'immutable';
import {ITEM_TYPE_KIND} from '../core/item_type';
import ViewItem from './view-item';
import PaneViewItem from '../containers/pane-view-item';

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
      borderLeft: 'solid 1px #FFFFFF',
      borderRight: 'solid 1px #FFFFFF',
      borderBottom: 'solid 1px #FFFFFF',
    }

    this._arr_pos = [];
    for(let i=0; i<2; i++){
      this._arr_pos[i] = [];
    }

    this.count = 0;
    this.names = null;
    this.items = null;
    this.im_items = null;
    this.dir_cur = null;

    console.log('ItemList constructor()');
    const store = this.props.store;

    this.unsubscribe = store.subscribe(() => {
      const store = this.props.store;
      const state = store.getState();
      const id = this.props.id;
      const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
      const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
      const active_pane_id = state.get('active_pane_id');

      /* - When directory is changed. 
       * - When no item name is displayed.
       * */
      if(this.im_items !== item_list.get('items_match')){
        //console.log('subscribed function!!');
        this.setState();
        //this.forceUpdate();
      }
    });

  }
  
  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    const state = this.props.store.getState();
    const id = this.props.id;
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
    const active_pane_id = state.get('active_pane_id');
    const idx = item_list.get('line_cur');

    if(this.im_items !== item_list.get('items_match')){
      this.im_items = item_list.get('items_match');
      this.items = this.im_items.toArray();
      this.dir_cur = item_list.get('dir_cur');
    }

    if(this.items.length <= 0){
      return (
        <div ref="item_list" style={this._style_list}>
        </div>
      );
    }

    const style_item_line = {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    };

    //const cbForceUpdate = () => {
    //  this.forceUpdate();
    //};

    //console.log('item-list <> this.dir_cur: ' + this.dir_cur);

    //console.log('start map!!----------------------');
    const rref = 'item_list';
    const ret = <div ref={rref} style={this._style_list}>
        {this.items
           .map((e, i) => {
             //console.log('i: ' + i + ', name: ' + e['basename']);
             //const style_each_item = i === idx 
             //                ? this._style_item_cur
             //                : this._styles[e['kind']];
             const ref_item = i === idx 
                                ? "item_cur"
                                : "";
             return (
               <PaneViewItem style={style_item_line}
                         key={i}
                         c={i}
                         line_cur={idx}
                         ref={ref_item}
                         active_pane_id={active_pane_id}
                         //cbForceUpdate={cbForceUpdate}
                         store={this.props.store}
                         id={id} />
             );
        })}
      </div>

    return (
      ret
    );

  }

  //static fForceUpdate(){
  //  //this.forceUpdate();
  //  console.log('this.count: ' + this.count);
  //}
}


//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
