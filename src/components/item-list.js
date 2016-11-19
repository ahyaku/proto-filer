'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import util from 'util';
import im from 'immutable';
import {ITEM_TYPE_KIND} from '../core/item_type';

//import ItemIm from '../core/item_im';
//import ItemListPaneIm from '../core/item_list';
//import ItemListPages from '../core/item_list_pages';

//const item_init = new ItemIm();
//const item_update = item_init.setName('hoge');
//console.log('item_init.getName(): ' + item_init.getName());
//console.log('item_update.getName(): ' + item_update.getName());

/* [NOTE]
 *     Not sure the reason why but without argument 'line_cur',
 *     this function is NOT called when keydown occurs.
 *     To call this function, some value or status change must be detected
 *     but some change in the array is NOT detected???
 * */
const ItemList = ({item_list, active_pane_id, line_cur, action_type, onItemListClick, props}) => {

  return (
    <ItemListView item_list={item_list} active_pane_id={active_pane_id} action_type={action_type} id={props.id} />
  );
}

class ItemListView extends React.Component {
  constructor(props){
    super(props);
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
    //console.log('len: ' + len);
    for(let i=0; i<len; i++){
      this._styles.push(Object.assign({}, this._style_base));
    }

    this._styles[ITEM_TYPE_KIND.DIR]['color']  = '#FF80FF';
    this._styles[ITEM_TYPE_KIND.TEXT]['color'] = '#FFFFFF';

    this._arr_pos = [];
    for(let i=0; i<2; i++){
      this._arr_pos[i] = [];
    }

    this.count = 0;
    //this.items_head = 0;
    this.names = null;
    this.items = null;
    this.im_items = null;
  }

  render(){
    let item_list = this.props.item_list;
    let active_pane_id = this.props.active_pane_id;
    let id = this.props.id;

    if(this.im_items !== item_list.get('items')){
      //console.log('foo');
      this.im_items = item_list.get('items');
      this.items = this.im_items.toArray();
    }else{
      //console.log('bar');
    }

    //if(this.items === null){
    //  console.log('names === null');
    //  this.items = item_list.get('items').toArray();
    //  //for(let e of this.names){
    //  //  console.log('name: ' + e);
    //  //}
    //  //console.log('this.items.length: ' + this.items.length);
    //}else{
    //  console.log('names !== null');
    //}

    const idx = item_list.get('line_cur');

    //const items = item_list.get('items');
    //const items_head = items.slice(0, idx);
    //const item_cur = items.get(idx);
    //const items_tail = (idx+1 < items.size)
    //                   ? items.slice(idx+1, items.size)
    //                   : []; 

    const items_head = this.items.slice(0, idx);
    const item_cur = this.items[idx];
    const items_tail = (idx+1 < this.items.length)
                       ? this.items.slice(idx+1, this.items.length)
                       : [];

    this._style_item_cur = Object.assign({}, this._styles[item_cur.get('kind')], {zIndex: '1'});
    if(id === active_pane_id){
      this._style_item_cur['borderBottom'] = 'solid 1px #00FF00';
    }else{
      this._style_item_cur['borderBottom'] = 'solid 1px #333333';
    }

    return (
      <div ref="item_list">
        {items_head
           .map((e, i) => {
             //console.log('16-------------------------');
             return (
               <div key={i} style={this._styles[e['kind']]}>
                 {e['name']}
               </div>
             );
        })}
        <div style={this._style_item_cur} ref="item_cur">
          {item_cur['name']}
        </div>
        {items_tail
           .map((e, i) => {
             //console.log('17-------------------------');
             return (
               <div key={i} style={this._styles[e['kind']]}>
                 {e['name']}
               </div>
             );
        })}
      </div>
    );

    //console.log('15-------------------------');
    //return (
    //  <div ref="item_list">
    //    {items_head
    //       .map((e, i) => {
    //         //console.log('16-------------------------');
    //         return (
    //           <div key={i} style={this._styles[e.get('kind')]}>
    //             {e.get('name')}
    //           </div>
    //         );
    //    })}
    //    <div style={this._style_item_cur} ref="item_cur">
    //      {item_cur.get('name')}
    //    </div>
    //    {items_tail
    //       .map((e, i) => {
    //         //console.log('17-------------------------');
    //         return (
    //           <div key={i} style={this._styles[e.get('kind')]}>
    //             {e.get('name')}
    //           </div>
    //         );
    //    })}
    //  </div>
    //);

  }

  shouldComponentUpdate(nextProps, nextState){
    //console.log('16-------------------------');
    const same_il = im.is(this.props.item_list, nextProps.item_list);
    const same_pid = im.is(this.props.active_pane_id, nextProps.active_pane_id);
    const same_at = im.is(this.props.action_type, nextProps.action_type);
    //if(same_il){
    //  console.log('same_il: true');
    //}else{
    //  console.log('same_il: false');
    //}
    //if(same_pid){
    //  console.log('same_pid: true');
    //}else{
    //  console.log('same_pid: false');
    //}
    //if(same_at){
    //  console.log('same_at: true');
    //}else{
    //  console.log('same_at: false');
    //}
    if( !im.is(this.props.item_list, nextProps.item_list) ||
        !im.is(this.props.active_pane_id, nextProps.active_pane_id) ||
        !im.is(this.props.action_type, nextProps.action_type) ){
      //console.log('true!!');
      return true;
    }
    //console.log('false!!');
    return false;
  }

  componentDidUpdate(){
    //console.log('Are you known???');
    //ReactDOM.findDOMNode(this.refs.target).scrollIntoView();

    //console.log('17-------------------------');
    let scrollTop;

    let ref_item_list = ReactDOM.findDOMNode(this.refs.item_list);
    let ref_item_cur = ReactDOM.findDOMNode(this.refs.item_cur);

    if(ref_item_cur == null){
      return;
    }

    let id = this.props.id;
    let dir_cur = this.props.item_list.dir_cur;

    //console.log('this.props.item_list.dir_cur: ' + this.props.item_list.dir_cur);
    //console.log('this.props.item_list.line_cur: ' + this.props.item_list.line_cur);
    //console.log('this.props.action_type: ' + this.props.action_type);

    switch(this.props.action_type){
      case 'CHANGE_DIR_UPPER':
      case 'CHANGE_DIR_LOWER':
        ref_item_list.scrollTop = this._arr_pos[id][dir_cur];
        return;
      default:
        {
          let line_pos = ref_item_cur.offsetTop + ref_item_cur.clientHeight;
          let scrollTop_abs = ref_item_list.scrollTop + ref_item_list.offsetTop;
          let scrollBottom_abs = scrollTop_abs + ref_item_list.clientHeight;
          let delta = 5;

          if(ref_item_cur.offsetTop < scrollTop_abs){
            scrollTop_abs = ref_item_cur.offsetTop;
            scrollTop = scrollTop_abs - ref_item_list.offsetTop; 
            ref_item_list.scrollTop = scrollTop;
          }else if(line_pos > scrollBottom_abs){
            scrollTop_abs = line_pos - ref_item_list.clientHeight;
            scrollTop = scrollTop_abs - ref_item_list.offsetTop + delta; 
            ref_item_list.scrollTop = scrollTop;
          }else{
            scrollTop = ref_item_list.scrollTop;
          }
          this._arr_pos[id][dir_cur] = scrollTop;
        }
        return;
    }
  }

}


//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
