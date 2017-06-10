'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
//import { findDOMNode } from 'react-dom';
//import { List } from 'react-virtualized';

//import {ITEM_TYPE_KIND} from '../core/item_type';
import {ITEM_TYPE_KIND} from '../util/item_type';


//class ViewItem extends React.Component {
//  constructor(props){
//    super(props);
//  }
//
//  render(){
//    console.log('render');
//    return (
//      <div>
//        hoge
//      </div>
//    );
//  }
//
//}

//class ViewItem extends List {
class ViewItem extends React.Component {
  constructor(props){
    //console.log('ViewItem constructor()');
    super(props);

    this._style_base = {
      //zIndex: '0',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'solid 1px #333333',
      //margin: '-3px 0px 0px',
      //padding: '0px 0px',
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start',

      //height: '20px' 

      //overflowX: 'hidden',
      //whiteSpace: 'nowrap',
      //textOverflowX: 'ellipsis'
      //textOverflowX: 'hidden'
      //boxSizing: 'border-box'
      //textOverflowX: 'hidden'
      //textOverflowX: 'ellipsis'
      //overflowX: 'ellipsis'
      boxSizing: 'border-box'
    }

    this._styles = [];
    const len = Object.keys(ITEM_TYPE_KIND).length;
    for(let i=0; i<len; i++){
      this._styles.push(Object.assign({}, this._style_base));
    }

    this._styles[ITEM_TYPE_KIND.DIR]['color']  = '#FF80FF';
    this._styles[ITEM_TYPE_KIND.TEXT]['color'] = '#FFFFFF';
    this._styles[ITEM_TYPE_KIND.EXE]['color'] = '#FFA500';

    this._arr_pos = [];
    for(let i=0; i<2; i++){
      this._arr_pos[i] = [];
    }

    this.cbGetItem = this.cbGetItem.bind(this);
  }

  cbGetItem(items, index){
    //console.log('cbGetItem <> items.size: ' + items.size + ', dir_cur: ' + items.get('dir_cur'));
    return items.get(index);
  }

  render(){
    //console.log('ViewItem <> render()');
    //console.log('ViewItem <> index: ' + this.props.index);
    //console.time('render');

    const items = this.props.items;
    const index = this.props.index;

    /* When current directory is changed from the one which has larger number of items
     * to the one which has smaller number of items,
     * this will happen before commponentDidUpdate() in the caller of this class updates
     * the item.size to the latest one (= larger number of items).
     * */
    if( index >= items.size ){
      return (
        <div></div>
      );
    }


    let style;
    const line_cur = this.props.line_cur;
    //console.log('rener() <> line_cur: ' + line_cur);
    const id = this.props.id;
    const active_pane_id = this.props.active_pane_id;
    const item = this.cbGetItem(items, index);

    //if(items.size <= 0){
    //  return (
    //    <div>
    //    </div>
    //  );
    //}

    this.didupdate = true;

    //style = this._styles[item.kind];
    //style = this._styles[item.get('kind')];

    const background = item.get('selected') === true
                         ? '#0000FF'
                         : '#333333';
    style = Object.assign(
                           {},
                           this.props.style,
                           this._styles[item.get('kind')],
                           {
                             background: background
                           }
                         );

    if(this.props.c === line_cur){
      //style = Object.assign({}, style, {zIndex: '1'});

      /* ToDo: Need to judge the currently acive pane. */
      if(id === active_pane_id){
        //style['borderBottom'] = 'solid 1px #00FF00';
        style['borderBottom'] = 'solid 1px rgba(0,255,0,1)';
      }
    }

    //console.log('view-item <> c: ' + this.props.c + ', name: ' + item.get('name') + ', selected: ' + item.get('selected'));
    return (
      <div style={style}>
        <Basename basename={item.get('basename')} />
        <Props ext={item.get('ext')}
               fsize={item.get('fsize')}
               date={item.get('date')}
               time={item.get('time')} />
      </div>
    );

  }


  shouldComponentUpdate(nextProps, nextState){
    /* Displayed items are changed by Narrow Down. */
    if(this.props.id_map !== nextProps.id_map){
      return true;
    }

    /* Directory is changed. */
    if(this.props.dir_cur !== nextProps.dir_cur){
      //console.log('shouldComponentUpdate() <> this.props.dir_cur: ' + this.props.dir_cur + ', nextProps.dir_cur: ' + nextProps.dir_cur);
    //if(this.props.im_items !== nextProps.im_items){
      //console.log('now <> name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      //console.log('next <> name: ' + nextProps.name + ', line_cur: ' + nextProps.line_cur + ', c: ' + nextProps.c);
      
      //if(this.props.c === 0){
      //  this.props.cbForceUpdate();
      //}
      //this.props.cbForceUpdate();
      return true;
    }

    const id = this.props.c;
    /* Render only current line and previous line items. */
    if( id === this.props.line_cur ||
        id === nextProps.line_cur  ){
        //console.log('name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      return true;
    }else{
      const item = this.cbGetItem(this.props.items, id);
      const item_next = this.cbGetItem(nextProps.items, id);

      /* react-virtualized skips re-rendering of items when cursor moves
       * from the last item to the first few items with 'toggle-down' (for performance?) 
       * This causes the issue that 'selected' attribute is changed but item background color is not updated.
       * Following if case is necessary to avoid this issue.
       * */
      if( item.get('selected') !== item_next.get('selected')){
        return true;
      }else{
        return false;
      }
    }

  }

  componentDidUpdate(prevProps, prevState){

    if(this.props.c === this.props.line_cur){
      //console.time('componentDidUpdate1');
      let scrollTop;

      let ref_item_list = ReactDOM.findDOMNode(this).parentNode;
      //console.log('ref_item_list: ' + ref_item_list);
      let ref_item_cur = ReactDOM.findDOMNode(this);

      if(ref_item_cur == null){
        return;
      }

      let id = this.props.id;
      let dir_cur = this.props.dir_cur;

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

            //console.log('list <> offsetTop: ' + ref_item_list.offsetTop + ', clientHeight: ' + ref_item_list.clientHeight + ', scrollHeight: ' + ref_item_list.scrollHeight);
            //console.log('line <> offsetTop: ' + ref_item_cur.offsetTop + ', clientHeight: ' + ref_item_cur.clientHeight + ', scrollHeight: ' + ref_item_cur.scrollHeight);
            //console.log('scrollTop_abs: ' + scrollTop_abs + ', scrollBottom_abs: ' + scrollBottom_abs + ', line_pos: ' + line_pos);

            if(ref_item_cur.offsetTop < scrollTop_abs){
              //console.log('scroll: under');
              scrollTop_abs = ref_item_cur.offsetTop;
              scrollTop = scrollTop_abs - ref_item_list.offsetTop; 
              ref_item_list.scrollTop = scrollTop;
            }else if(line_pos > scrollBottom_abs){
              //console.log('scroll: over');
              scrollTop_abs = line_pos - ref_item_list.clientHeight;
              scrollTop = scrollTop_abs - ref_item_list.offsetTop + delta; 
              ref_item_list.scrollTop = scrollTop;
            }else{
              //console.log('scroll: between');
              scrollTop = ref_item_list.scrollTop;
            }
            this._arr_pos[id][dir_cur] = scrollTop;
            //console.timeEnd('componentDidUpdate2');
          }

          return;
      }

      if(this.didupdate === true){
        this.didupdate = false;
        this.setState(this.props);
      }
    }

  }

}

class Basename extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const style = {
      marginRight: 'auto',
      minWidth: '120px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflowX: 'hidden',
      overflowY: 'hidden'
    };

    return (
      <div style={style}>
        {this.props.basename}
      </div>
    );
  }
}

class Props extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const style = {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    };

    const style_ext = {
      marginLeft: '0px',
      width: '30px',
      textAlign: 'left'
    };
    const style_fsize = {
      marginLeft: '15px',
      width: '80px',
      textAlign: 'right'
    };
    const style_date = {
      marginLeft: '5px',
      width: '60px',
      textAlign: 'right'
    };
    const style_time = {
      marginLeft: '5px',
      width: '60px',
      textAlign: 'right'
    };

    //console.log('size: ' + this.props.size);
    return (
      <div style={style}>
        <PropElem elem={this.props.ext}   style_elem={style_ext}/>
        <PropElem elem={this.props.fsize} style_elem={style_fsize}/>
        <PropElem elem={this.props.date}  style_elem={style_date}/>
        <PropElem elem={this.props.time}  style_elem={style_time}/>
      </div>
    );

  }
}

class PropElem extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div style={this.props.style_elem}>
        {this.props.elem}
      </div>
    );
  }
}

export default ViewItem;
