'use strict';

import React from 'react';
import PaneItemList from '../containers/pane-item-list';
import Header from './path-cur';

import fs from 'fs';
import itemList from '../../lib/item_list';


const item_list = new itemList('dummy');
item_list.dir_cur = fs.realpathSync('C:\\Go');
item_list.updateItems();

for(let e of item_list.items){
  console.log(e.name);
}

const HeaderOld = () => {
  const style = {
    //border: '1px solid #FF0000'
  };
  return (
    <div style={style}>
      HeaderOld
    </div>
  );
}

//class Header extends React.Component {
//  constructor(props) {
//    super(props);
//    console.log('Header Instantiation!!!');
//  }
//
//  render() {
//    const style = {
//      //border: '1px solid #FF0000'
//    };
//    return (
//      <div style={style}>
//        Header
//      </div>
//    );
//  }
//}

//let HeaderLeft = new Header('hoge');
//let HeaderLeft = Header;

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
      <CmdAndItemList />
      <CmdAndItemList />
    </div>
  );
}

const CmdAndItemList = () => {
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
  return (
    <div style={style}>
      <Cmd />
      <PaneItemList item_list={item_list}/>
    </div>
  );
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
  //return (
  //  <div style={style}>
  //    <HeaderOld />
  //    <HeaderOld />
  //    <Body />
  //    <Footer />
  //  </div>
  //);
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
