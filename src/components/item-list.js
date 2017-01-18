'use strict';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import util from 'util';
import im from 'immutable';
import {ITEM_TYPE_KIND} from '../core/item_type';

const ItemList = ({item_list, active_pane_id, line_cur, action_type, onItemListClick, props}) => {

  return (
    <ItemListView item_list={item_list} active_pane_id={active_pane_id} action_type={action_type} id={props.id} />
  );
}

class ItemListView extends React.Component {
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
    //console.log('len: ' + len);
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

    this.count = 0;
    //this.items_head = 0;
    this.names = null;
    this.items = null;
    this.im_items = null;
    this.dir_cur = null;

    //this.im_item_list = null;
    //this.active_pane_id = null;
    //this.sction_type = null;
    //this.id = null;

    this.didupdate = true;
  }

  render(){
    //console.time('time_whole');
    //console.time('ItemListView');
    let item_list = this.props.item_list;
    let active_pane_id = this.props.active_pane_id;
    let id = this.props.id;


    //this.im_item_list = item_list
    //this.active_pane_id = active
    //this.action_type = action_type;
    //this.id = id;

    this.didupdate = true;

    const idx = item_list.get('line_cur');

    if(this.im_items !== item_list.get('items_match')){
      this.im_items = item_list.get('items_match');
      this.items = this.im_items.toArray();
      this.dir_cur = item_list.get('dir_cur');
    }

    //if(this.im_items !== item_list.get('items')){
    //  this.im_items = item_list.get('items');
    //  this.items = this.im_items.toArray();
    //  this.dir_cur = item_list.get('dir_cur');
    //}

    //console.log('ItemListView <> items.length: ' + this.items.length);

    if(this.items.length <= 0){
      //console.log('HERE!!');
      return (
        <div ref="item_list" style={this._style_list}>
        </div>
      );
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


    //const items = item_list.get('items');
    //const items_head = items.slice(0, idx);
    //const item_cur = items.get(idx);
    //const items_tail = (idx+1 < items.size)
    //                   ? items.slice(idx+1, items.size)
    //                   : []; 

    //const items_head = this.items.slice(0, idx);
    //const item_cur = this.items[idx];
    //const items_tail = (idx+1 < this.items.length)
    //                   ? this.items.slice(idx+1, this.items.length)
    //                   : [];

    //console.log('this.items.length: ' + this.items.length + ', idx: ' + idx);
    //console.log('this.items[idx]: ' + this.items[idx]);
    //console.log('this.items[idx].get(kind): ' + this.items[idx].get('kind'));
    const item_cur = this.items[idx];
    //console.log('item_cur.get(kind): ' + item_cur.get('kind'));
    this._style_item_cur = Object.assign({}, this._styles[item_cur.get('kind')], {zIndex: '1'});
    if(id === active_pane_id){
      this._style_item_cur['borderBottom'] = 'solid 1px #00FF00';
    }else{
      this._style_item_cur['borderBottom'] = 'solid 1px #333333';
    }

    //return (
    //  <div ref="item_list">
    //    {items_head
    //       .map((e, i) => {
    //         //console.log('16-------------------------');
    //         return (
    //           <div key={i} style={this._styles[e['kind']]}>
    //             {e['name']}
    //           </div>
    //         );
    //    })}
    //    <div style={this._style_item_cur} ref="item_cur">
    //      {item_cur['name']}
    //    </div>
    //    {items_tail
    //       .map((e, i) => {
    //         //console.log('17-------------------------');
    //         return (
    //           <div key={i} style={this._styles[e['kind']]}>
    //             {e['name']}
    //           </div>
    //         );
    //    })}
    //  </div>
    //);

               //<div key={i} style={this._styles[e['kind']]}>
               //  {e['name']}
               //</div>
               //<ItemView key={i}, name={e['name']}, style={this._styles[e['kind']]} />

    //console.log('idx: ' + idx);

    const style_item_line = {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    };

    console.time('map_whole');
    this.items
      .map((e, i) => {
        //console.log('items_head <> i: ' + i);
        //console.log('16-------------------------');
        const style_each_item = i === idx 
                        ? this._style_item_cur
                        : this._styles[e['kind']];
        const ref_item = i === idx 
                           ? "item_cur"
                           : "";
        //const ref_item = "item_cur"
        //console.log('name: ' + e['name'] + ', basename: ' + e['basename']);
      });
    console.timeEnd('map_whole');


    //console.timeEnd('ItemListView');
    return (
      <div ref="item_list" style={this._style_list}>
        {this.items
           .map((e, i) => {
             //console.log('items_head <> i: ' + i);
             //console.log('16-------------------------');
             //console.time('map');
             const style_each_item = i === idx 
                             ? this._style_item_cur
                             : this._styles[e['kind']];
             const ref_item = i === idx 
                                ? "item_cur"
                                : "";
             //const ref_item = "item_cur"
             //console.log('name: ' + e['name'] + ', basename: ' + e['basename']);
             //console.timeEnd('map');
             return (
               <ItemView style={style_item_line}
                         key={i}
                         im_items={this.im_items}
                         c={i}
                         line_cur={idx}
                         style_each_item={style_each_item}
                         ref={ref_item}
                         name={e['basename']}
                         ext={e['ext']}
                         size={e['fsize']}
                         date={e['date']}
                         time={e['time']} />
             );
        })}
      </div>
    );

  }

  //shouldComponentUpdate(nextProps, nextState){
  //  if(nextProps.active_pane_id === nextProps.id){
  //    return true;
  //  }
  //  return false;
  //}

  //shouldComponentUpdate(nextProps, nextState){
  //  //console.log('16-------------------------');
  //  const same_il = im.is(this.props.item_list, nextProps.item_list);
  //  const same_pid = im.is(this.props.active_pane_id, nextProps.active_pane_id);
  //  const same_at = im.is(this.props.action_type, nextProps.action_type);
  //  //if(same_il){
  //  //  console.log('same_il: true');
  //  //}else{
  //  //  console.log('same_il: false');
  //  //}
  //  //if(same_pid){
  //  //  console.log('same_pid: true');
  //  //}else{
  //  //  console.log('same_pid: false');
  //  //}
  //  //if(same_at){
  //  //  console.log('same_at: true');
  //  //}else{
  //  //  console.log('same_at: false');
  //  //}
  //  if( !im.is(this.props.item_list, nextProps.item_list) ||
  //      !im.is(this.props.active_pane_id, nextProps.active_pane_id) ||
  //      !im.is(this.props.action_type, nextProps.action_type) ){
  //    //console.log('true!!');
  //    return true;
  //  }
  //  //console.log('false!!');
  //  return false;
  //}

  componentDidUpdate(prevProps, prevState){
    //console.log('[width, height] = [' + this.state.width + ', ' + this.state.height + ']');
    //console.log('win [width, height] = [' + window.innerWidth + ', ' + window.innerHeight + ']');
    //console.log('doc [width, height] = [' + this.document.width + ', ' + this.document.height + ']');

    //console.log('dir_cur: ' + this.dir_cur);

    //console.log('Are you known???');
    //ReactDOM.findDOMNode(this.refs.target).scrollIntoView();

    //console.log('active_pane_id: ' + this.props.active_pane_id);
    //console.log('didupdate: ' + this.didupdate);

    //console.time('timer');
    let scrollTop;

    let ref_item_list = ReactDOM.findDOMNode(this.refs.item_list);
    let ref_item_cur = ReactDOM.findDOMNode(this.refs.item_cur);

    if(ref_item_cur == null){
      return;
    }

    let id = this.props.id;
    //let dir_cur = this.props.item_list.dir_cur;
    let dir_cur = this.dir_cur;
    //console.log('this.props.item_list.dir_cur: ' + this.props.item_list.dir_cur);
    //console.log('this.props.item_list.line_cur: ' + this.props.item_list.line_cur);
    //console.log('this.props.action_type: ' + this.props.action_type);

    switch(this.props.action_type){
      case 'CHANGE_DIR_UPPER':
      case 'CHANGE_DIR_LOWER':
        ref_item_list.scrollTop = this._arr_pos[id][dir_cur];
        //console.timeEnd('timer');
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

        //console.timeEnd('timer');
        return;
    }

    if(this.didupdate === true){
      //console.log('DIDUPDATE!!');
      this.didupdate = false;
      this.setState(this.props);
      //this.setState({
      //  item_list: this.props.item_list,
      //  active_pane_id: this.props.active_pane_id,
      //  action_type: this.props.action_type,
      //  id: this.props.id
      //});
    }
  }

}

class ItemView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    //console.log('name: ' + this.props.name);
    return (
      <div>
        <div style={this.props.style_each_item}>
          <Name name={this.props.name} />
          <Props ext={this.props.ext}
                 size={this.props.size}
                 date={this.props.date}
                 time={this.props.time} />
        </div>
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState){
    /* Directory is changed. */
    if(this.props.im_items !== nextProps.im_items){
      //console.log('HERE!!');
      //console.log('!!true this <> name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      //console.log('!!true next <> name: ' + nextProps.name + ', line_cur: ' + nextProps.line_cur + ', c: ' + nextProps.c);
      return true
    }
    /* Render only current line and previous line items. */
    if( this.props.c === this.props.line_cur ||
        this.props.c === nextProps.line_cur  ){
      //console.log('??true this <> name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      //console.log('??true next <> name: ' + nextProps.name + ', line_cur: ' + nextProps.line_cur + ', c: ' + nextProps.c);
      return true;
    }else{
      //console.log('false this <> name: ' + this.props.name + ', line_cur: ' + this.props.line_cur + ', c: ' + this.props.c);
      //console.log('false next <> name: ' + nextProps.name + ', line_cur: ' + nextProps.line_cur + ', c: ' + nextProps.c);
      return false;
    }
  }

  //componentDidMount(){
  //  this.props.scrollIntoView(ReactDOM.findDOMNode(this));
  //}
  //componentDidUpdate(){
  //  this.props.scrollIntoView(ReactDOM.findDOMNode(this));
  //}
}

class Name extends React.Component{
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

    //console.log('name: ' + this.props.name);
    return (
      <div style={style}>
        {this.props.name}
      </div>
    );
  }
}

class Props extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    //console.time('Props');
    const style = {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    };

    //const margin_left_ext = '0px';
    //const margin_left_size = '15px';
    //const margin_left_date = '5px';
    //const margin_left_time = '5px';

    //return (
    //  <div style={style}>
    //    <PropElem elem={this.props.ext} margin_left={margin_left_ext}/>
    //    <PropElem elem={this.props.size} margin_left={margin_left_size}/>
    //    <PropElem elem={this.props.date} margin_left={margin_left_date}/>
    //    <PropElem elem={this.props.time} margin_left={margin_left_time}/>
    //  </div>
    //);


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

    //console.timeEnd('Props');
    //console.timeEnd('time_whole');
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
    //const style={
    //  marginLeft: this.props.margin_left
    //}

    //return (
    //  <div style={style}>
    //    {this.props.elem}
    //  </div>
    //);

    return (
      <div style={this.props.style_elem}>
        {this.props.elem}
      </div>
    );
  }
}


//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
