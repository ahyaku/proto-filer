'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import util from 'util';
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
  }

  render(){
    let item_list = this.props.item_list;
    let active_pane_id = this.props.active_pane_id;
    let id = this.props.id;

    //if(item_list.items.length <= 0){
    //  return (
    //    <div>
    //    </div>
    //  );
    //}
    //
    //let idx = item_list.line_cur;
    //if(idx >= item_list.items.length){
    //  console.log('ERROR!! <> idx >= item_list.items.length');
    //  idx = item_list.items.length - 1;
    //}
    //let items_head = item_list.items.slice(0, idx);
    //let item_cur = item_list.items[idx];
    //let items_tail = item_list.items.slice(idx+1, item_list.length);

    //this._style_item_cur = Object.assign({}, this._styles[item_cur.kind], {zIndex: '1'});
    //if(id === active_pane_id){
    //  this._style_item_cur['borderBottom'] = 'solid 1px #00FF00';
    //}else{
    //  this._style_item_cur['borderBottom'] = 'solid 1px #333333';
    //}


    //const items_init = new ItemListPaneIm().set('dir_cur', 'C:\\Go');
    //const items_up = items_init.set('dir_cur', 'C:\\msys64');
    //console.log('items_init.getDirCur(): ' + items_init.get('dir_cur'));
    //console.log('items_up.getDirCur(): ' + items_up.get('dir_cur'));
    //const items_last = items_up.updateItems();
    //return (
    //  <div >
    //    {items_last.map((e, i) => {
    //      return (
    //        <div key = {i}>
    //          {e.get('name')}
    //        </div>
    //      );
    //    })}
    //  </div>
    //);

    //const pages = new ItemListPages().updatePageCur('C:\\msys64');
    //console.log('len1: ' + pages.get('pages').size);
    //return (
    //  <div >
    //    {pages.get('pages')
    //          .get(pages .get('path_cur'))
    //          .get('items')
    //          .map((e, i) => {
    //            return (
    //              <div key = {i}>
    //                {e.get('name')}
    //              </div>
    //            );
    //    })}
    //  </div>
    //);

    //const pages = new ItemListPages().updatePageCur('C:\\msys64');
    //console.log('len1: ' + pages.get('pages').size);
    //const pages_tmp = pages.updatePageCur('C:\\');
    //console.log('len2: ' + pages_tmp.get('pages').size);
    //const pages_new = pages_tmp.updatePageCur('C:\\msys64');
    //console.log('len3: ' + pages_new.get('pages').size);
    //return (
    //  <div >
    //    {pages_new.get('pages')
    //          .get(pages_new .get('path_cur'))
    //          .get('items')
    //          .map((e, i) => {
    //            return (
    //              <div key = {i}>
    //                {e.get('name')}
    //              </div>
    //            );
    //    })}
    //  </div>
    //);

    //return (
    //  <div >
    //    {item_list
    //       .get('items')
    //       .map((e, i) => {
    //         return (
    //           <div key={i} style={this._styles[e.get('kind')]}>
    //             {e.get('name')}
    //           </div>
    //         );
    //    })}
    //  </div>
    //);

    const idx = item_list.get('line_cur');
    //console.log('idx: ' + idx);
    const items = item_list.get('items');
    const items_head = items.slice(0, idx);
    const item_cur = items.get(idx);
    const items_tail = (idx+1 < items.size)
                       ? items.slice(idx+1, items.size)
                       : []; 

    //console.log('items_head.size: ' + items_head.size);
    //console.log('item_cur.get(name): ' + item_cur.get('name'));

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
             return (
               <div key={i} style={this._styles[e.get('kind')]}>
                 {e.get('name')}
               </div>
             );
        })}
        <div style={this._style_item_cur} ref="item_cur">
          {item_cur.get('name')}
        </div>
        {items_tail
           .map((e, i) => {
             return (
               <div key={i} style={this._styles[e.get('kind')]}>
                 {e.get('name')}
               </div>
             );
        })}
      </div>
    );

  }

  //render(){
  //  let item_list = this.props.item_list;
  //  let active_pane_id = this.props.active_pane_id;
  //  let id = this.props.id;

  //  //console.log('------------------------------');
  //  //for(let e of item_list.items){
  //  //  console.log('e.name: ' + e.name);
  //  //}
  //  //console.log('------------------------------');
  //  if(item_list.items.length <= 0){
  //    return (
  //      <div>
  //      </div>
  //    );
  //  }

  //  let idx = item_list.line_cur;
  //  if(idx >= item_list.items.length){
  //    console.log('ERROR!! <> idx >= item_list.items.length');
  //    idx = item_list.items.length - 1;
  //  }
  //  let items_head = item_list.items.slice(0, idx);
  //  let item_cur = item_list.items[idx];
  //  let items_tail = item_list.items.slice(idx+1, item_list.length);

  //  this._style_item_cur = Object.assign({}, this._styles[item_cur.kind], {zIndex: '1'});
  //  if(id === active_pane_id){
  //    this._style_item_cur['borderBottom'] = 'solid 1px #00FF00';
  //  }else{
  //    this._style_item_cur['borderBottom'] = 'solid 1px #333333';
  //  }


  //  return (
  //    <div style={this._style} ref="item_list">
  //      {items_head.map((e, i) => {
  //        return (
  //          <div key={i} style={this._styles[e.kind]}>
  //            {e.name}
  //          </div>
  //        );
  //      })}
  //      <div style={this._style_item_cur} ref="item_cur">
  //        {item_cur.name}
  //      </div>
  //      {items_tail.map((e, i) => {
  //        return (
  //          <div key={i} style={this._styles[e.kind]}>
  //            {e.name}
  //          </div>
  //        );
  //      })}
  //    </div>
  //  );

  //}

  componentDidUpdate(){
    //console.log('Are you known???');
    //ReactDOM.findDOMNode(this.refs.target).scrollIntoView();

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
