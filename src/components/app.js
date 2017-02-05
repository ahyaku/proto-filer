'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';

import PanePathCur from '../containers/pane-path-cur';
import PaneCmd from '../containers/pane-cmd';
import ItemList from '../components/item-list';

const Footer = () => {
  const style = {
    borderLeft: 'solid 1px #FFFFFF',
    borderRight: 'solid 1px #FFFFFF',
    borderBottom: 'solid 1px #FFFFFF'
    //flex: '0 0 auto'
    //boxSizing: 'border-box'
  };
  return (
    <div style={style}>
      Footer
    </div>
  );
}

const Body = ({store}) => {
  const style = {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //alignItems: 'stretch',
    //alignContent: 'stretch',
    //border: '1px solid #FFFFFF',
    //overflow: 'auto',
    //overflow: 'hidden',
    //textOverflowX: 'ellipsis'
    width: '100%',
    height: '100%'
  };

  return (
    <div style={style}>
      <CmdAndItemList id={0} store={store} />
      <CmdAndItemList id={1} store={store} />
    </div>
  );
}

class CmdAndItemList extends React.Component {
  constructor(props){
    super(props);
    //console.log('CmdAndItemList <> store: ' + this.props.store);
    //console.log('CmdAndItemList <> item_list.id: ' + this.props.item_list.id);

    //ItemList.fForceUpdate();
    //const ilist = new ItemList();
    //ilist.fForceUpdate();
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
      //border: '1px solid #0000FF'
    };

    const state = this.props.store.getState();
    const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
    console.log('app <> dir_cur: ' + dir_cur);

    //return (
    //  <div style={style}>
    //    <PaneCmd id={id} />
    //    <ItemList store={this.props.store} id={id} dir_cur={dir_cur} />
    //  </div>
    //);

    return (
      <div style={style}>
        <PaneCmd id={id} />
        <ItemList store={this.props.store} id={id}  />
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

const App = ({store}) => {
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

  const style_path = {
    borderTop: 'solid 1px #FFFFFF',
    borderLeft: 'solid 1px #FFFFFF',
    borderRight: 'solid 1px #FFFFFF'
  };

  return (
    <div style={style}>
      <div style={style_path}>
        <PanePathCur id={0} />
        <PanePathCur id={1} />
      </div>
      <Body store={store} />
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
