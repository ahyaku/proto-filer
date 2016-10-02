'use strict';

import React, { PropTypes } from 'react';

//const ItemList = ({item_list, onItemListClick, props}) => {
const ItemList = ({arr_item_list, onItemListClick, props}) => {
  //const item_list = this.props;
  //console.log('ItemList <> props.item_list.id = ' + props.item_list.id);
  //console.log('ItemList <> item_list = ' + item_list);
  //console.log('ItemList <> arr_item_list = ' + arr_item_list);
  //console.log('ItemList <> arr_item_list.id = ' + arr_item_list.id);
  console.log('ItemList <> arr_item_list[0] = ' + arr_item_list[0].eid);
  //console.log('ItemList <> arr_item_list[0].id = ' + arr_item_list[0].id);

  let id = props.item_list.id;
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

  //return (
  //  <div style={style}>
  //    {item_list.items[0].name}
  //  </div>
  //);

  return (
    <div style={style} onClick={() => onItemListClick(item_list)}>
      {item_list.items.map(function(e, i){
        return (
          <div key={i}>
            {e.name}
          </div>
        );
      })}
    </div>
  );

  //return (
  //  <div style={style} onClick={() => onItemListClick(props.item_list)}>
  //    {props.item_list.items.map(function(e, i){
  //      return (
  //        <div key={i}>
  //          {e.name}
  //        </div>
  //      );
  //    })}
  //  </div>
  //);

  //return (
  //  <div style={style}>
  //    {item_list.items.map(function(e, i){
  //      return (
  //        <div style={style_children} key={i}>
  //          {e.name}
  //        </div>
  //      );
  //    })}
  //  </div>
  //);

  //return (
  //  <div style={style} onClick={() => onItemListClick(item_list)}>
  //  </div>
  //);

  //console.log('ItemList <> item_list.id: ' + item_list.id);
  //return (
  //  <div style={style} onClick={() => onItemListClick(item_list)}>
  //    {item_list.id}
  //  </div>
  //);
  
}


//ItemList.propTypes = {
//  item_list: PropTypes.object.isRequired
//};

ItemList.propTypes = {
  arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired)
};

export default ItemList;
