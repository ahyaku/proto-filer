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
    //console.log('ItemView <> getState(): ' + this.props.store);

    this._style_base = {
      zIndex: '0',
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

  //render(){
  //  console.log('ViewItem <> render()');
  //  //console.time('render');
  //  let style;
  //  const line_cur = this.props.line_cur;
  //  //console.log('rener() <> line_cur: ' + line_cur);
  //  const id = this.props.id;
  //  const active_pane_id = this.props.active_pane_id;

  //  const state = this.props.store.getState();
  //  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
  //  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
  //  const items = item_list.get('items_match');
  //  //const item = items.get(this.props.c);
  //  const item = this.props.item;
  //  //const item2 = this.props.item;
  //  //console.log('item2: ' + item2);

  //  //const item = this.props.item;

  //  //if(items.size <= 0){
  //  //  return (
  //  //    <div>
  //  //    </div>
  //  //  );
  //  //}

  //  this.didupdate = true;

  //  style = this._styles[item.get('kind')];
  //  if(this.props.c === line_cur){
  //    style = Object.assign({}, style, {zIndex: '1'});

  //    if(id === active_pane_id){
  //      style['borderBottom'] = 'solid 1px #00FF00';
  //    }
  //  }
  //  //console.timeEnd('render');

  //  //console.log('name: ' + item.get('basename'));
  //  return (
  //    <div>
  //      <div style={style}>
  //        <Basename basename={item.get('basename')} />
  //        <Props ext={item.get('ext')}
  //               size={item.get('size')}
  //               date={item.get('date')}
  //               time={item.get('time')} />
  //      </div>
  //    </div>
  //  );
  //}

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

    //const state = this.props.store.getState().state_core;
    //const state = this.props.store.getState();

    //const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    //const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
    //const items = item_list.get('items_match');
    //const item = items.get(this.props.c);

    //const item = this.props.item;

    const item = this.cbGetItem(items, index);
    //console.log('ViewItem <> render() item: ', item);
    //console.log('ViewItem <> render() item.name: ' + item.get('name'));

    //const item = this.props.item.toJS();

    //const item = this.props.im_item;

    ///console.log('item: ', this.props.item);
    //console.log('item.name: ' + this.props.item.name);

    //console.log('item: ' + item);

    //if(items.size <= 0){
    //  return (
    //    <div>
    //    </div>
    //  );
    //}

    this.didupdate = true;

    //style = this._styles[item.kind];

    //style = this._styles[item.get('kind')];

    style = Object.assign(
                           {},
                           this.props.style,
                           this._styles[item.get('kind')]
                         );

    if(this.props.c === line_cur){
      style = Object.assign({}, style, {zIndex: '1'});

      /* ToDo: Need to judge the currently acive pane. */
      if(id === active_pane_id){
        style['borderBottom'] = 'solid 1px #00FF00';
      }
    }
    //console.timeEnd('render');

    //console.log('name: ' + item.get('basename'));

//    return (
//      <div>
//        <div style={style}>
//          hoge
//        </div>
//      </div>
//    );

//    return (
//      <div>
//        <div style={style}>
//          {item}
//        </div>
//      </div>
//    );

//    return (
//      <div>
//        <div style={style}>
//          <Basename basename={item} />
//        </div>
//      </div>
//    );

//    return (
//      <div>
//        <div style={style}>
//          <Basename basename={item.get('basename')} />
//        </div>
//      </div>
//    );

//    return (
//      <div>
//        <div style={style}>
//          <Basename basename={item.basename} />
//          <Props ext={item.ext}
//                 fsize={item.fsize}
//                 date={item.date}
//                 time={item.time} />
//        </div>
//      </div>
//    );

    return (
      <div style={style}>
        <Basename basename={item.get('basename')} />
        <Props ext={item.get('ext')}
               fsize={item.get('fsize')}
               date={item.get('date')}
               time={item.get('time')} />
      </div>
    );

//    return (
//      <div>
//        <div style={style}>
//          <Basename basename={item.get('basename')} />
//          <Props ext={item.get('ext')}
//                 fsize={item.get('fsize')}
//                 date={item.get('date')}
//                 time={item.get('time')} />
//        </div>
//      </div>
//    );

  }


  shouldComponentUpdate(nextProps, nextState){
    //console.log('VideItem <> shouldComponentUpdate()');
    //console.log('line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);

    if(this.props.is_dir_changed === true){
      return true;
    }

    //if(this.props.c === 0){
    //  const state = this.props.store.getState();
    //  //const state = this.props.state;
    //  const id = this.props.id;
    //  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);

    //  const state_next = nextProps.store.getState();
    //  //const state_next = nextProps.state;
    //  const id_next = nextProps.id;
    //  const dir_cur_next = state_next.getIn(['arr_pages', id_next, 'dir_cur']);

    //  console.log('view-item.js <> dir_cur: ' + dir_cur + ', dir_cur_next: ' + dir_cur_next);

    //  const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
    //  const items = item_list.get('items_match');
    //  const item = items.get(this.props.c);
    //  const name = item.get('name');
    //  console.log('name: ' + name);

    //}

    //{
    //  const jret = (this.props.im_items !== nextProps.im_items);
    //}

    //console.log('view-item.js <> this.props.dir_cur: ' + this.props.dir_cur + ', nextProps.dir_cur: ' + nextProps.dir_cur);

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

    /* Render only current line and previous line items. */
    if( this.props.c === this.props.line_cur ||
        this.props.c === nextProps.line_cur  ){
        //console.log('name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      return true;
    }else{
      return false;
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
      //console.timeEnd('componentDidUpdate1');

      switch(this.props.action_type){
        case 'CHANGE_DIR_UPPER':
        case 'CHANGE_DIR_LOWER':
          ref_item_list.scrollTop = this._arr_pos[id][dir_cur];
          return;
        default:
          {
            //console.time('componentDidUpdate2');
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

      //console.time('componentDidUpdate3');
      if(this.didupdate === true){
        this.didupdate = false;
        this.setState(this.props);
      }
      //console.timeEnd('componentDidUpdate3');
      
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
