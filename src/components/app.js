'use strict';

import React from 'react';

const Header = () => {
  const style = {
    border: '1px solid #FF0000'
  };
  return (
    <div style={style}>
      Header
    </div>
  );
}

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
      <ItemList />
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

const ItemList = () => {
  const style = {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    border: '1px solid #FFFFFF',
    //height: '100vh'
    height: '100%'
  };
  return (
    <div style={style}>
      ItemList
    </div>
  );
}


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
      <Header />
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
