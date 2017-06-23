'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';

import PanePathCur from '../containers/pane-path-cur';
import PaneCmd from '../containers/pane-cmd';
//import ItemList from '../components/item-list';
import PaneItemList from '../containers/pane-item-list';

const Footer = () => {
  const style = {
    borderLeft: 'solid 1px #FFFFFF',
    borderTop: 'solid 1px #FFFFFF',
    borderRight: 'solid 1px #FFFFFF',
    borderBottom: 'solid 1px #FFFFFF',
    //flex: '0 0 auto'
    //boxSizing: 'border-box'

    display: 'flex',
    flex: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: '16.0px',
    maxHeight: '16.0px',
    boxSizing: 'border-box'

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
    //border: '1px solid #FF0000',
    //overflow: 'auto',
    //overflow: 'hidden',
    //textOverflowX: 'ellipsis'
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
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
    this.style = {
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
      //border: '1px solid #0000FF'
      //border: 'solid 1px #FFFFFF',
      border: 'none',
      boxSizing: 'border-box'
    };


    let style_outer_base = {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      //border: 'none',
      borderLeft: 'solid 1px #FFFFFF',
      //borderBottom: 'solid 1px #FFFFFF',
      boxSizing: 'border-box'
    };
    
    //this.style_outer = style_outer_base;

    if(this.props.id === 0){
      this.style_outer = Object.assign(
        {},
        style_outer_base
      );
    }else{
      this.style_outer = Object.assign(
        {},
        style_outer_base,
        {borderRight: 'solid 1px #FFFFFF'},
      );
    }

  }

  render(){
    const id = this.props.id;

    return (
      <div style={this.style}>
        <PaneCmd id={id} />
        <div style={this.style_outer}>
          <PaneItemList id={id} />
        </div>
      </div>
    );

  }

//  componentDidUpdate(prevProps, prevState){
//    console.log('componentDidUpdate()!!');
//  }
}


//const HeaderTest = () => {
//  return (
//    <div>
//      Header
//    </div>
//  );
//}

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

//const FooterTest = () => {
//  return (
//    <div>
//      Footer
//    </div>
//  );
//}

class App extends React.Component {
  constructor(props){
    super(props);
    this.cbSortItems = this.cbSortItems.bind(this);
  }

  render(){
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
      boxSizing: 'border-box'
    };

    const style_path = {
      borderTop: 'solid 1px #FFFFFF',
      borderLeft: 'solid 1px #FFFFFF',
      borderRight: 'solid 1px #FFFFFF',
      boxSizing: 'border-box'
    };

    /* ORG */
    return (
      <div style={style}>
        <div style={style_path}>
          <PanePathCur id={0} />
          <PanePathCur id={1} />
        </div>
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

  componentDidMount(){
    ipcRenderer.on('sortItems', this.cbSortItems);
  }

  componentWillUnmount(){
    ipcRenderer.removeListener('sortItems', this.cbSortItems);
  }

  cbSortItems(event, sort_type){
    //console.log('cbSortItems <> sort_type: ' + sort_type);
    this.props.dispatch({
      type: 'SORT_ITEM_LIST',
      sort_type: sort_type
    });
  }

}

//const App = () => {
//  const style = {
//    display: 'flex',
//    flex: 'auto',
//    flexDirection: 'column',
//    justifyContent: 'flex-start',
//    //alignItems: 'stretch',
//    //alignContent: 'stretch',
//    background: '#333333',
//    color: '#FFFFFF',
//    width: '100%',
//    height: '100%',
//    boxSizing: 'border-box'
//  };
//
//  const style_path = {
//    borderTop: 'solid 1px #FFFFFF',
//    borderLeft: 'solid 1px #FFFFFF',
//    borderRight: 'solid 1px #FFFFFF',
//    boxSizing: 'border-box'
//  };
//
//  /* ORG */
//  return (
//    <div style={style}>
//      <div style={style_path}>
//        <PanePathCur id={0} />
//        <PanePathCur id={1} />
//      </div>
//      <Body />
//      <Footer />
//    </div>
//  );
//
//  //return (
//  //  <div style={style}>
//  //    <HeaderTest />
//  //    <BodyTest />
//  //    <FooterTest />
//  //  </div>
//  //);
//}

export default connect()(App);
