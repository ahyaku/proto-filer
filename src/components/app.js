'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import PaneItemList from '../containers/pane-item-list';
import Header from './path-cur';

import fs from 'fs';
import ItemListCore from '../../lib/item_list';

const item_list_left = new ItemListCore('LEFT');
item_list_left.dir_cur = fs.realpathSync('C:\\');
item_list_left.updateItems();

const item_list_right = new ItemListCore('RIGHT');
item_list_right.dir_cur = fs.realpathSync('C:\\Hamana20051010gdi');
item_list_right.updateItems();

//import fs from 'fs';
//import itemList from '../../lib/item_list';
//
//const item_list = new itemList('dummy');
//item_list.dir_cur = fs.realpathSync('C:\\');
//item_list.updateItems();
//
//for(let e of item_list.items){
//  console.log(e.name);
//}

const Footer = () => {
  const style = {
    border: '1px solid #0000FF'
  };
  return (
    <div style={style}>
      Footer
    </div>
  );
}

const Body = () => {
  const style = {
    border: '1px solid #00FF00',
    display: 'flex',
    flex: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    //flexWrap: 'nowrap',
    //height: '0px',
    width: '100%',
    minHight: '100%'
  };
  return (
    <div style={style}>
      <CmdAndItemList item_list={item_list_left} />
      <CmdAndItemList item_list={item_list_right} />
    </div>
  );
}

//const CmdAndItemList = () => {
const CmdAndItemList = function() {
  //const item_list = this.props.item_list;
  const style = {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width: '100%',
    minHeight: '100%'
  };
  //return (
  //  <div style={style}>
  //    <Cmd />
  //    <PaneItemList item_list={item_list}/>
  //  </div>
  //);
  return (
    <div style={style}>
      <Cmd />
      <PaneItemList  />
    </div>
  );
  //return (
  //  <div style={style}>
  //    <Cmd />
  //    <PaneItemList item_list={item_list} />
  //  </div>
  //);
}

const Cmd = () => {
  const style = {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    border: '1px solid #FFFFFF'
  };
  return (
    <div style={style}>
      Cmd
    </div>
  );
}

Header.defaultProps = {path_cur: 'HOGE'};

const App = () => {
  const style = {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    background: '#333333',
    color: '#FFFFFF',
    width: '100%',
    minHeight: '100%'
    //width: '100vw',
    //height: '100vh'
  };
  return (
    <div style={style}>
      <Header path_cur={"Left"} />
      <Header path_cur={"Right"} />
      <Body />
      <Footer />
    </div>
  );
}

//      <Header path_cur={'hoge'} />

export default App;
