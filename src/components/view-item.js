'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
//import { findDOMNode } from 'react-dom';
//import { List } from 'react-virtualized';

//import {ITEM_TYPE_KIND} from '../core/item_type';
import {ITEM_TYPE_KIND} from '../util/item_type';
import { RES } from '../../res/res';


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

    this._cbGetIsSelected = this._cbGetIsSelected.bind(this);
  }

  _cbGetIsSelected(is_selected, index){
    return is_selected.get(index);
  }

  render(){
    //console.log('ViewItem <> render()');
    //console.log('ViewItem <> index: ' + this.props.index);
    //console.time('render');

    //const items = this.props.items;
    //const index = this.props.index;

    /* When current directory is changed from the one which has larger number of items
     * to the one which has smaller number of items,
     * this will happen before commponentDidUpdate() in the caller of this class updates
     * the item.size to the latest one (= larger number of items).
     * */
    //if( index >= items.size ){
    ////if( index >= this.props.items_size ){
    //  return (
    //    <div></div>
    //  );
    //}


    const item = this.props.item;
    this.didupdate = true;

    const background = this._cbGetIsSelected(this.props.is_selected, this.props.c) === true
                         ? '#0000FF'
                         : '#333333';
    const style = Object.assign(
                                 {},
                                 this.props.style,
                                 this._styles[item.get('kind')],
                                 {
                                   background: background
                                 }
                               );

    if(this.props.c === this.props.line_cur){
      //console.log('view-item <> render(), name: ' + item.get('name'));

      /* ToDo: Need to judge the currently acive pane. */
      if(this.props.id_list_pane === this.props.active_pane_id){
        style['borderBottom'] = 'solid 1px rgba(0,255,0,1)';
      }
    }

    //console.log('view-item <> c: ' + this.props.c + ', name: ' + item.get('name') + ', selected: ' + item.get('selected'));

    return (
      <div style={style}>
        <Icon icon={this.props.icon} action_type={this.props.action_type} />
        <Basename basename={item.get('basename')} />
        <Props ext={item.get('ext')}
               fsize={item.get('fsize')}
               date={item.get('date')}
               time={item.get('time')} />
      </div>
    );


  }


  shouldComponentUpdate(nextProps, nextState){
    //console.log('view-item <> action_type: ' + this.props.action_type);

    //if(nextProps.id === 0){
    //  console.log('view-item <> action_type: ' + nextProps.action_type + ', icon: ' + nextProps.icon);
    //}

    if( nextProps.action_type === 'RENDER_ICON' ){
      return true;
    }

    if( (nextProps.action_type === 'RENAME_ITEM')             &&
        (nextProps.id_list_pane === nextProps.active_pane_id) &&
        (nextProps.c === nextProps.line_cur)                  ){
      //console.log('HERE!!!!!!!! action_type: ' + nextProps.action_type + ', name: ' + nextProps.item.get('name') + ', c: ' + nextProps.c + ', line_cur: ' + nextProps.line_cur);
      return true;
    }

    /* Displayed items are changed by Narrow Down. */
    if(this.props.id_map_nrw !== nextProps.id_map_nrw){
      return true;
    }

    /* Directory is changed. */
    if(this.props.dir_cur !== nextProps.dir_cur){
      //console.log('shouldComponentUpdate() <> this.props.dir_cur: ' + this.props.dir_cur + ', nextProps.dir_cur: ' + nextProps.dir_cur);
    //if(this.props.im_items !== nextProps.im_items){
      //console.log('now <> name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      //console.log('next <> name: ' + nextProps.name + ', line_cur: ' + nextProps.line_cur + ', c: ' + nextProps.c);
      return true;
    }

    const id = this.props.c;
    /* Render only current line and previous line items. */
    if( id === this.props.line_cur ||
        id === nextProps.line_cur  ){

      if( this.props.active_pane_id !== nextProps.active_pane_id){
        return true;
      }else if(this.props.line_cur === nextProps.line_cur){
        /* Not sure the reason why but this happens with line_cur change.
         * react-virtualized list does this??
         * */
        return false;
      }

      //console.log('view-item should <> c: ' + this.props.c + ', line_cur: ' + this.props.line_cur + ', nextProps.line_cur: ' + nextProps.line_cur);

      return true;

    }else{

      const is_selected = this._cbGetIsSelected(this.props.is_selected, id);
      const is_selected_next = this._cbGetIsSelected(nextProps.is_selected, id);

      /* react-virtualized skips re-rendering of items when cursor moves
       * from the last item to the first few items with 'toggle-down' (for performance?) 
       * This causes the issue that 'selected' attribute is changed but item background color is not updated.
       * Following if case is necessary to avoid this issue.
       * */
      //if( item.get('selected') !== item_next.get('selected')){
      if( is_selected !== is_selected_next ){
        return true;
      }else{
        return false;
      }

    }

  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.c === this.props.line_cur){
      const node = ReactDOM.findDOMNode(this);
      const offsetTop = node.offsetTop;
      const clientHeight = node.clientHeight;
    }

    return;
  }

}

class Basename extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const style = {
      marginLeft: '2px',
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

class Icon extends React.Component{
  constructor(props){
    super(props);

    this.style = {
      display: 'flex',
      flex: '0 1 auto',
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: RES.ITEM.HEIGHT,
      height: RES.ITEM.HEIGHT,
      minWidth: RES.ITEM.HEIGHT,
      minHeight: RES.ITEM.HEIGHT,
      justifyContent: 'center',
    }
    this.style_img = {
      flex: 'auto',
      height: '100%',
      width: '100%',
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    //console.log('view-item <> action_type: ' + this.props.action_type);
    //if( nextProps.action_type === 'RENDER_ICON' ){
    //  //console.log('Icon <> action_type: ' + nextProps.action_type + ', icon: ' + nextProps.icon);
    //  return true;
    //}
    return true;
  }


  render(){
    const icon = this.props.icon;

    if( (icon === null)               || 
        (typeof icon === 'undefined') ){
      return (
        <div style={this.style} />);
    }else{
      return (
        <div style={this.style}>
          <img style={this.style_img} src={icon.toDataURL()} />
        </div>
      );
    }

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
      textAlign: 'left',
      textOverflow: 'ellipsis',
      overflowX: 'hidden',
      overflowY: 'hidden'
    };
    const style_fsize = {
      marginLeft: '15px',
      width: '80px',
      textAlign: 'right',
      textOverflow: 'ellipsis',
      overflowX: 'hidden',
      overflowY: 'hidden'
    };
    const style_date = {
      marginLeft: '5px',
      width: '60px',
      textAlign: 'right',
      textOverflow: 'ellipsis',
      overflowX: 'hidden',
      overflowY: 'hidden'
    };
    const style_time = {
      marginLeft: '5px',
      width: '60px',
      textAlign: 'right',
      textOverflow: 'ellipsis',
      overflowX: 'hidden',
      overflowY: 'hidden'
    };

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
