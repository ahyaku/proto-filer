'use strict';

import { connect } from 'react-redux';
import ItemList from '../components/item-list';


const mapStateToProps = (state, props) => ({
  //item_list: state.item_list
  item_list: props.item_list
});

const PaneItemList = connect(
  mapStateToProps
)(ItemList);

export default PaneItemList;
