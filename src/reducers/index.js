'use strict';

const itemList = (state, action) => {
  switch(action.type){
    case 'UPDATE_ITEM_LIST':
      console.log('reducer: UPDATE_ITEM_LIST!!');
      return {
        item_list: action.item_list
      };
      //return {item_list: Object.assign({}, action.item_list)};
      //return {item_list: ...action.item_list};
      //return {item_list: {...action.item_list}};
      //return state;
    default:
      console.log('reducer: default');
      return state;
  }
}

export default itemList;
