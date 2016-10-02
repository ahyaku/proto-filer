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

}

ItemList.propTypes = {
  arr_item_list: PropTypes.arrayOf(PropTypes.object.isRequired)
};

export default ItemList;
