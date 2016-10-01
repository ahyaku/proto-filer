'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import PaneItemList from '../containers/pane-item-list';
import PathCur from './path-cur';

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
    border: '1px solid #0000FF',
    flex: '0 0 auto'
    //overflowX: 'hidden',
    //minHeight: '20px'
  };
  return (
    <div style={style}>
      Footer
    </div>
  );
}

const Body = () => {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    //flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    //flex: '1',
    flex: '1 0 auto',
    //flexWrap: 'nowrap',
    border: '1px solid #00FF00',
    //height: '0px',
    //width: '100%',
    //minHeight: '100%',
    //overflowX: 'auto',
    //overflowY: 'auto',
    overflow: 'auto'
    //position: 'absolute'
  };
  //return (
  //  <div style={style}>
  //    <CmdAndItemList item_list={item_list_left} />
  //    <CmdAndItemList item_list={item_list_right} />
  //  </div>
  //);
  //return (
  //  <div style={style}>
  //    <CmdAndItemList item_list={item_list_left} />
  //  </div>
  //);

  //return (
  //  <div style={style}>
  //    <PaneItemList item_list={item_list_left} />
  //  </div>
  //);

  let arr = [];
  for(let i=0; i<20; i++){
    arr.push("hoge");
  }
  console.log(arr);
  //return (
  //  <div style={style}>
  //    {arr.map(function(e, i){
  //      return(
  //        <div key={i}>
  //          {e}
  //        </div>
  //      );
  //    })}
  //  </div>
  //);
  const style_sub = {
    //flex: '1',
    flex: '1 0 auto',
    overflow: 'auto'
  };
  return (
    <div style={style}>
      <div style={style_sub}>
        are
        <br /><br />
        you
        <br /><br />
        known?
        <br /><br />
        ???
      </div>
    </div>
  );
}

////const CmdAndItemList = () => {
//const CmdAndItemList = function() {
//  const item_list = this.props.item_list;
//  const style = {
//    display: 'flex',
//    flex: 'auto',
//    flexDirection: 'column',
//    justifyContent: 'flex-start',
//    alignItems: 'stretch',
//    alignContent: 'stretch',
//    width: '100%',
//    minHeight: '100%'
//  };
//  //return (
//  //  <div style={style}>
//  //    <Cmd />
//  //    <PaneItemList item_list={item_list}/>
//  //  </div>
//  //);
//
//  return (
//    <div style={style}>
//      <Cmd />
//      <PaneItemList  />
//    </div>
//  );
//
//  //return (
//  //  <div style={style}>
//  //    <Cmd />
//  //    <PaneItemList item_list={item_list} />
//  //  </div>
//  //);
//}

class CmdAndItemList extends React.Component {
  constructor(props){
    super(props);
    //console.log('CmdAndItemList <> item_list.id: ' + this.props.item_list.id);
  }

  //return (
  //  <div style={style}>
  //    <Cmd />
  //    <PaneItemList item_list={item_list}/>
  //  </div>
  //);

  render(){
    const item_list = this.props.item_list;
    const style = {
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      width: '50%',
      minHeight: '100%',
      //minHeight: '0px',
      //height: '100%',
      overflowX: 'hidden',
      overflowY: 'auto'
    };

    //return (
    //  <div style={style}>
    //    <Cmd />
    //    <PaneItemList />
    //  </div>
    //);

    console.log('CmdAndItemList render() <> item_list.id: ' + item_list.id);
    //return (
    //  <div style={style}>
    //    <Cmd />
    //    <PaneItemList item_list={item_list} />
    //  </div>
    //);
    return (
      <div style={style}>
        <PaneItemList item_list={item_list} />
      </div>
    );

  }

  //render: function(){
  //  let item_list = this.props.item_list;
  //  return (
  //    <div style={style}>
  //      <Cmd />
  //      <PaneItemList item_list={item_list} />
  //    </div>
  //  );
  //}

}


const Cmd = () => {
  const style = {
    //display: 'flex',
    //flex: 'auto',
    //flexDirection: 'row',
    //justifyContent: 'flex-start',
    //alignItems: 'flex-start',
    //alignContent: 'flex-start',
    //flexBasis: '20px',
    minHeight: '20px',
    height: '20px',
    border: '1px solid #FFFFFF',
    overflowX: 'hidden',
    overflowY: 'hidden'
  };
  return (
    <div style={style}>
      Cmd
    </div>
  );
}

PathCur.defaultProps = {path_cur: 'HOGE'};

const App = () => {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    //flex: '1',
    background: '#333333',
    color: '#FFFFFF',
    width: '100%',
    minHeight: '100%',
    //width: '100vw',
    //height: '100vh'
    //overflowX: 'hidden',
    //overflowY: 'hidden'
  };

  return (
    <div style={style}>
      <PathCur path_cur={"Left"} />
      <PathCur path_cur={"Right"} />
      <Body />
      <Footer />
    </div>
  );
}

//      <Header path_cur={'hoge'} />

export default App;
