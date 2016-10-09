'use strict';

import React, { PropTypes } from 'react';

/* [NOTE]
 *     Not sure the reason why but without argument 'line_cur',
 *     this function is NOT called when keydown occurs.
 *     To call this function, some value or status change must be detected
 *     but some change in the array is NOT detected???
 * */
const ItemList = ({item_list, active_pane_id, onItemListClick, props, line_cur}) => {
  //console.log('HEREEEEEEEEEEEEEEEEEEEEEEEE');
  let id = props.id;

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

  let style_item_cur;
  if(id === active_pane_id){
    style_item_cur = {
      borderBottom: 'solid 2px #00FF00'
    };
  }else{
    style_item_cur = {
      borderBottom: 'solid 2px #333333'
    };
  }

  const style_item_other = {
    borderBottom: 'solid 2px #333333'
  };

  let idx = item_list.line_cur;
  console.log('item_list.line_cur = ' + item_list.line_cur);
  if(idx >= item_list.items.length){
    console.log('ERROR!! <> idx >= item_list.items.length');
    idx = item_list.items.length - 1;
  }
  let items_head = item_list.items.slice(0, idx);
  let item_cur = item_list.items[idx];
  let items_tail = item_list.items.slice(idx+1, item_list.length);

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

}

//ItemList.propTypes = {
//  //arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//  item_list: PropTypes.object.isRequired,
//  active_pane_id: PropTypes.number.isRequired
//};

export default ItemList;
