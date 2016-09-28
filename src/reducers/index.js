'use strict';

//import ItemListCore from '../../lib/item_list';

const itemList = (state, action) => {
  switch(action.type){
    case 'UPDATE_ITEM_LIST':
      console.log('reducer: UPDATE_ITEM_LIST!!');

      let new_list = Object.assign({}, state.item_list);
      //new_list.items = Object.assign({}, state.item_list.items);
      //new_list.items = [].concat(state.item_list.items);
      new_list.items = state.item_list.items.concat();
      for (let i = 0; i < new_list.items.length; i++){
        new_list.items[i].name = 'hoge!!';
      }
      //for (let i = 0; i < state.item_list.items.length; i++){
      //  console.log(state.item_list.items[i].name);
      //}
      return {item_list: new_list};

    default:
      console.log('reducer: default');
      console.log('state.item_list.id: ' + state.item_list.id);
      //for (let e of state.item_list.items){
      //  console.log(e.name);
      //}
      return state;
  }
}

export default itemList;
