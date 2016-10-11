'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import util from 'util';
import ITEM_TYPE_KIND from '../core/item_type';

/* [NOTE]
 *     Not sure the reason why but without argument 'line_cur',
 *     this function is NOT called when keydown occurs.
 *     To call this function, some value or status change must be detected
 *     but some change in the array is NOT detected???
 * */
const ItemList = ({item_list, active_pane_id, onItemListClick, props, line_cur}) => {
  return (
    <ItemListView item_list={item_list} active_pane_id={active_pane_id} id={props.id} />
  );
}

class ItemListView extends React.Component {
  constructor(props){
    super(props);
    //console.log('Here it!!');

    this._style = {
      //display: 'flex',
      flex: '1',
      //flexDirection: 'column',
      //justifyContent: 'flex-start',
      //alignItems: 'flex-start',
      //alignContent: 'flex-start',
      //border: '1px solid #FFFFFF',
      ////minHeight: '0px',
      //minHeight: '0vh',
      ////height: '50vh',
      ////height: '50%',
      //height: '100%',
      overflowX: 'hidden',
      overflowY: 'scroll',
      //position: 'absolute'
    };

    //  zIndex: '1',
    //  borderBottom: 'solid 1px #333333',

    this._style_base = {
      zIndex: '0',
      borderBottom: 'solid 1px #333333',
      margin: '-3px 0px 0px',
      padding: '0px 0px',
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflowX: 'ellipsis'
      //textOverflowX: 'hidden'
      //boxSizing: 'border-box'
    }

    this._styles = [];
    const len = Object.keys(ITEM_TYPE_KIND).length;
    console.log('len: ' + len);
    for(let i=0; i<len; i++){
      this._styles.push(Object.assign({}, this._style_base));
    }

    this._styles[ITEM_TYPE_KIND.DIR]['color']  = '#FF80FF';
    this._styles[ITEM_TYPE_KIND.TEXT]['color'] = '#FFFFFF';

  }

  render(){
    let item_list = this.props.item_list;
    let active_pane_id = this.props.active_pane_id;
    let id = this.props.id;

//    let style_item_cur = {
//      zIndex: '1',
//      margin: '-3px 0px 0px',
//      padding: '0px 0px',
//      overflowX: 'hidden',
//      whiteSpace: 'nowrap',
//      textOverflowX: 'ellipsis'
//      //textOverflowX: 'hidden'
//      //boxSizing: 'border-box'
//    }
//
//    if(id === active_pane_id){
//      style_item_cur['borderBottom'] = 'solid 1px #00FF00';
//    }else{
//      style_item_cur['borderBottom'] = 'solid 1px #333333';
//    }
//
//    const style_item_other = {
//      borderBottom: 'solid 1px #333333',
//      //boxShadow: '0 0 0 2px #333333',
//      zIndex: '0',
//      margin: '-3px 0px 0px',
//      padding: '0px 0px',
//      overflowX: 'hidden',
//      whiteSpace: 'nowrap',
//      textOverflowX: 'ellipsis'
//      //textOverflowX: 'hidden'
//      //boxSizing: 'border-box'
//    };

    //console.log('------------------------------');
    //for(let e of item_list.items){
    //  console.log(e.name);
    //}
    //console.log('------------------------------');
    if(item_list.items.length <= 0){
      return (
        <div>
        </div>
      );
    }

    let idx = item_list.line_cur;
    //console.log('item_list.line_cur = ' + item_list.line_cur);
    if(idx >= item_list.items.length){
      console.log('ERROR!! <> idx >= item_list.items.length');
      idx = item_list.items.length - 1;
    }
    let items_head = item_list.items.slice(0, idx);
    let item_cur = item_list.items[idx];
    let items_tail = item_list.items.slice(idx+1, item_list.length);

    //this._style_item_cur = Object.assign({}, this._style_base, {zIndex: '1'});
    this._style_item_cur = Object.assign({}, this._styles[item_cur.kind], {zIndex: '1'});
    //console.log('item_cur.name: ' + item_cur.name + ', item_cur.ext: ' + item_cur.ext + ', item_cur.kind: ' + item_cur.kind);
    //this._style_item_cur = Object.assign({}, this._styles[0], {zIndex: '1'});
    if(id === active_pane_id){
      this._style_item_cur['borderBottom'] = 'solid 1px #00FF00';
    }else{
      this._style_item_cur['borderBottom'] = 'solid 1px #333333';
    }


    return (
      <div style={this._style} ref="item_list">
        {items_head.map((e, i) => {
          return (
            <div key={i} style={this._styles[e.kind]}>
              {e.name}
            </div>
          );
        })}
        <div style={this._style_item_cur} ref="item_cur">
          {item_cur.name}
        </div>
        {items_tail.map((e, i) => {
          return (
            <div key={i} style={this._styles[e.kind]}>
              {e.name}
            </div>
          );
        })}
      </div>
    );

    //return (
    //  <div style={this._style} ref="item_list">
    //    {items_head.map((e, i) => {
    //      return (
    //        <div key={i} style={this._style_base}>
    //          {e.name}
    //        </div>
    //      );
    //    })}
    //    <div style={this._style_item_cur} ref="item_cur">
    //      {item_cur.name}
    //    </div>
    //    {items_tail.map((e, i) => {
    //      return (
    //        <div key={i} style={this._style_base}>
    //          {e.name}
    //        </div>
    //      );
    //    })}
    //  </div>
    //);
  }

  componentDidUpdate(){
    //console.log('Are you known???');
    //ReactDOM.findDOMNode(this.refs.target).scrollIntoView();

    let ref_item_list = ReactDOM.findDOMNode(this.refs.item_list);
    let ref_item_cur = ReactDOM.findDOMNode(this.refs.item_cur);

    if(ref_item_cur == null){
      return;
    }

    let line_pos = ref_item_cur.offsetTop + ref_item_cur.clientHeight;

    let scrollTop_abs = ref_item_list.scrollTop + ref_item_list.offsetTop;
    let scrollBottom_abs = scrollTop_abs + ref_item_list.clientHeight;

    let delta = 5;

    if(ref_item_cur.offsetTop < scrollTop_abs){
      scrollTop_abs = ref_item_cur.offsetTop;
      ref_item_list.scrollTop = scrollTop_abs - ref_item_list.offsetTop; 
    }else if(line_pos > scrollBottom_abs){
      scrollTop_abs = line_pos - ref_item_list.clientHeight;
      ref_item_list.scrollTop = scrollTop_abs - ref_item_list.offsetTop + delta; 
    }
  }
}


//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
