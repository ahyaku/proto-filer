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
    //minHeight: '0px',
    minHeight: '0vh',
    //height: '50vh',
    //height: '50%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
    //position: 'absolute'
  };

  const style_children = {
    //display: 'flex',
    //flex: 'auto',
    //flexDirection: 'column',
    //justifyContent: 'flex-start',
    //alignItems: 'stretch',
    //alignContent: 'stretch',
    //height: '100vh',
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
          <div style={style_children} key={i}>
            {e.name}
          </div>
        );
      })}
    </div>
  );

  //console.log('ItemList <> item_list.id: ' + item_list.id);
  //return (
  //  <div style={style} onClick={() => onItemListClick(item_list)}>
  //    {item_list.id}
  //  </div>
  //);
  
}


ItemList.propTypes = {
  item_list: PropTypes.object.isRequired
};

export default ItemList;
