'use strict';

import React, { PropTypes } from 'react';

const ItemList = ({item_list, onItemListClick}) => {
  //const item_list = this.props;
  const style = {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    border: '1px solid #FFFFFF',
    //height: '100vh'
    height: '100%'
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
  item_list: PropTypes.object.isRequired
};

export default ItemList;
