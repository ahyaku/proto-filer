'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';

import PaneItemList from '../containers/pane-item-list';
import PanePathCur from '../containers/pane-path-cur';
import PathCmd from '../containers/pane-cmd';

//import ItemList from '../components/item-list';

const Footer = () => {
  const style = {
    border: 'solid 1px #0000FF',
    //flex: '0 0 auto'
    //boxSizing: 'border-box'
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
    flex: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //alignItems: 'stretch',
    //alignContent: 'stretch',
    border: '1px solid #00FF00',
    //overflow: 'auto',
    //overflow: 'hidden',
    //textOverflowX: 'ellipsis'
    width: '100%',
    height: '100%'
  };

  return (
    <div style={style}>
      <CmdAndItemList id={0} />
      <CmdAndItemList id={1} />
    </div>
  );
}

class CmdAndItemList extends React.Component {
  constructor(props){
    super(props);
    //console.log('CmdAndItemList <> item_list.id: ' + this.props.item_list.id);
  }

  render(){
    const id = this.props.id;
    const style = {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      //alignItems: 'stretch',
      //alignContent: 'stretch',
      width: '50%',
      height: '100%',
      ////overflowX: 'hidden',
      //textOverflowX: 'ellipsis',
      ////overflowY: 'auto'
      //overflowY: 'hidden'
      border: '1px solid #0000FF'
    };

    //console.log('CmdAndItemList render() <> id: ' + id);

    return (
      <div style={style}>
        <PathCmd id={id} />
        <PaneItemList id={id} />
      </div>
    );

    //return (
    //  <div style={style}>
    //    <PathCmd id={id} />
    //    <ItemList />
    //  </div>
    //);
  }

  componentDidUpdate(prevProps, prevState){
    console.log('componentDidUpdate()!!');
  }
}


//const HeaderTest = () => {
//  return (
//    <div>
//      Header
//    </div>
//  );
//}
//
//const BodyTest = () => {
//  const style = {
//    overflow: 'hidden',
//    border: '1px solid #00FFFF',
//    display: 'flex',
//    flexDirection: 'row',
//    justifyContent: 'flex-start',
//    alignItems: 'stretch',
//    alignContent: 'stretch',
//    flex: '1'
//  };
//
//  return (
//    <div style={style}>
//      Are
//      <br/><br/>
//      You
//      <br/><br/>
//      Knwon?
//      <br/><br/>
//    </div>
//  );
//}
//
//const FooterTest = () => {
//  return (
//    <div>
//      Footer
//    </div>
//  );
//}

const App = () => {
  const style = {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    //alignItems: 'stretch',
    //alignContent: 'stretch',
    background: '#333333',
    color: '#FFFFFF',
    width: '100%',
    height: '100%',
  };

  return (
    <div style={style}>
      <PanePathCur id={0} />
      <PanePathCur id={1} />
      <Body />
      <Footer />
    </div>
  );

  //return (
  //  <div style={style}>
  //    <HeaderTest />
  //    <BodyTest />
  //    <FooterTest />
  //  </div>
  //);
}

export default App;
