'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';

import PaneItemList from '../containers/pane-item-list';
import PanePathCur from '../containers/pane-path-cur';
import PathCmd from '../containers/pane-cmd';

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

  //const style1 = {
  //  border: 'solid 10px #FF0000',
  //  zIndex: '0',
  //  //margin: '0px 0px -10px',
  //  //margin: '-10px 0px 0px',
  //  //flex: '0 0 auto'
  //  //boxSizing: 'border-box'
  //};
  //const style2 = {
  //  border: 'solid 10px #00FF00',
  //  //zIndex: '1',
  //  //margin: '0px 0px -10px',
  //  //flex: '0 0 auto'
  //  boxSizing: 'border-box'
  //};
  //return (
  //  <div style={style}>
  //    <div style={style1}>
  //      Foo
  //    </div>
  //    <div style={style2}>
  //      Bar
  //    </div>
  //  </div>
  //);

}

const Body = () => {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flex: '1',
    border: '1px solid #00FF00',
    overflow: 'auto',
    textOverflowX: 'ellipsis'
  };

  return (
    <div style={style}>
      <CmdAndItemList id={0} />
      <CmdAndItemList id={1} />
    </div>
  );

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

  //let arr = [];
  //for(let i=0; i<20; i++){
  //  arr.push("hoge");
  //}
  //console.log(arr);
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

  //const style_sub = {
  //  //flex: '1',
  //  flex: '1 0 auto',
  //  overflow: 'auto'
  //};
  //return (
  //  <div style={style}>
  //    <div style={style_sub}>
  //      are
  //      <br /><br />
  //      you
  //      <br /><br />
  //      known?
  //      <br /><br />
  //      ???
  //    </div>
  //  </div>
  //);
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
      flex: '1',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      width: '50%',
      height: '100%',
      //overflowX: 'hidden',
      textOverflowX: 'ellipsis',
      overflowY: 'auto'
    };

    //console.log('CmdAndItemList render() <> id: ' + id);
    return (
      <div style={style}>
        <PathCmd id={id} />
        <PaneItemList id={id} />
      </div>
    );
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flex: '1',
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
