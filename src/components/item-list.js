'use strict';

import React, { PropTypes } from 'react';

const ItemList = ({arr_item_list, onItemListClick, props}) => {
  let id = props.id;
  let item_list = arr_item_list[id];

  const style = {
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

  const style_item_cur = {
    borderBottom: 'solid 2px #00FF00'
  };

  const style_item_other = {
    borderBottom: 'solid 2px #333333'
  };

  //return (
  //  <div style={style}>
  //    {item_list.items[0].name}
  //  </div>
  //);

  //return (
  //  <div style={style} onClick={() => onItemListClick(item_list)}>
  //    {item_list.items.map(function(e, i){
  //      return (
  //        <div key={i} style={style_item_other}>
  //          {e.name}
  //        </div>
  //      );
  //    })}
  //  </div>
  //);

  //let idx = 7;
  let idx = item_list.line_cur;
  if(idx >= item_list.items.length){
    console.log('ERROR!! <> idx >= item_list.items.length');
    idx = item_list.items.length - 1;
  }
  let items_head = item_list.items.slice(0, idx);
  let item_cur = item_list.items[idx];
  //let item_cur = item_list.items.slice(idx, idx+1);
  let items_tail = item_list.items.slice(idx+1, item_list.length);
  //console.log('items_head: ' + items_head);
  //console.log('item_cur: ' + item_cur);
  //console.log('item_cur.length: ' + item_cur.length);
  //for(let e of item_cur){
  //  console.log('item_cur e.name: ' + e.name);
  //}
  //console.log('item_list.items[idx]: ' + item_list.items[idx]);
  //for(let e of items_head){
  //  //console.log(e.name);
  //}


  return (
    <div style={style}>
      {items_head.map(function(e, i){
        return (
          <div key={i} style={style_item_other}>
            {e.name}
          </div>
        );
      })}
      <div style={style_item_cur}>
        {item_cur.name}
      </div>
      {items_tail.map(function(e, i){
        return (
          <div key={i} style={style_item_other}>
            {e.name}
          </div>
        );
      })}
    </div>
  );

  //return (
  //  <div style={style}>
  //    {items_head.map(function(e, i){
  //      return (
  //        <div key={i} style={style_item_other}>
  //          {e.name}
  //        </div>
  //      );
  //    })}
  //    {items_head.map(function(e, i){
  //      return (
  //        <div key={i} style={style_item_other}>
  //          {e.name}
  //        </div>
  //      );
  //    })}
  //  </div>
  //);

}

ItemList.propTypes = {
  arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired)
};

export default ItemList;
