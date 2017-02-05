'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {ITEM_TYPE_KIND} from '../core/item_type';

class ViewItem extends React.Component {
  constructor(props){
    console.log('ViewItem constructor()');
    super(props);
    //console.log('ItemView <> getState(): ' + this.props.store);
    const id = this.props.id;
    const store = this.props.store;
    const state = this.props.store.getState();
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);


    this._style_base = {
      zIndex: '0',
      borderBottom: 'solid 1px #333333',
      margin: '-3px 0px 0px',
      padding: '0px 0px',
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start'
      //overflowX: 'hidden',
      //whiteSpace: 'nowrap',
      //textOverflowX: 'ellipsis'
      //textOverflowX: 'hidden'
      //boxSizing: 'border-box'
      //textOverflowX: 'hidden'
      //textOverflowX: 'ellipsis'
      //overflowX: 'ellipsis'
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
  }

  render(){
    let style;
    const line_cur = this.props.line_cur;
    const id = this.props.id;
    const active_pane_id = this.props.active_pane_id;

    const state = this.props.store.getState();
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    const item_list = state.getIn(['arr_pages', id, 'pages', dir_cur]);
    const items = item_list.get('items_match');
    const item = items.get(this.props.c);

    if(items.size <= 0){
      return (
        <div>
        </div>
      );
    }

    this.didupdate = true;

    style = this._styles[item.get('kind')];
    if(this.props.c === line_cur){
      style = Object.assign({}, style, {zIndex: '1'});

      if(id === active_pane_id){
        style['borderBottom'] = 'solid 1px #00FF00';
      }
    }

    return (
      <div>
        <div style={style}>
          <Basename basename={item.get('basename')} />
          <Props ext={item.get('ext')}
                 size={item.get('size')}
                 date={item.get('date')}
                 time={item.get('time')} />
        </div>
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState){
    //console.log('line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);

    if(this.props.c === 0){
      const state = this.props.store.getState();
      const id = this.props.id;
      const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);

      const state_next = nextProps.store.getState();
      const id_next = nextProps.id;
      const dir_cur_next = state_next.getIn(['arr_pages', id_next, 'dir_cur']);

      //console.log('view-item.js <> dir_cur: ' + dir_cur + ', dir_cur_next: ' + dir_cur_next);
    }

    /* Directory is changed. */
    if(this.props.im_items !== nextProps.im_items){
      //console.log('now <> name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      //console.log('next <> name: ' + nextProps.name + ', line_cur: ' + nextProps.line_cur + ', c: ' + nextProps.c);
      
      //if(this.props.c === 0){
      //  this.props.cbForceUpdate();
      //}
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
      overflowX: 'hidden'
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
    const style_size = {
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

    return (
      <div style={style}>
        <PropElem elem={this.props.ext}  style_elem={style_ext}/>
        <PropElem elem={this.props.size} style_elem={style_size}/>
        <PropElem elem={this.props.date} style_elem={style_date}/>
        <PropElem elem={this.props.time} style_elem={style_time}/>
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
