'use strict';

//let ipc = require('ipc');
//let {ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');

const electron = require('electron');
const remote = electron.remote;
const app = electron.app;
const async = require('async');

const MediatePane = require('./lib/mediate_pane');

const React = require('react');
const ReactDOM = require('react-dom');

function init(){
  let mediate_pane = new MediatePane('item_list_left', 
                                     'item_list_right',
                                     'dir_cur_left',
                                     'dir_cur_right',
                                     'pane_cmd_left',
                                     'pane_cmd_right',
                                     'C:\\Go',
                                     'C:\\tmp\\test');

  mediate_pane.update;

}

let data = [
  {id: 0, name: "hoge", ext: "exe", date: "2016/09/17 20:05:09"},
  {id: 1, name: "nvim", ext: "vim", date: "2018/04/25 10:25:25"}
];

let ItemList = React.createClass({
  render: function () {
    let data = this.props.data;
    let styleItemList = this.props.styleItemList;
    let styleItem = this.props.styleItem;
    //let style = {
    //  flex: '1',
    //  minWidth: '0'
    //};
    return (
      //<div className="itemList" style={styleItemList}>
      //  {data.map(function(e) {
      //    return <div key={e.id}> {e.name} {e.ext} {e.date} </div>
      //  })}
      //</div>
      <div className="itemList" style={styleItemList}>
        {data.map(function(e) {
          return (
            <div key={e.id} style={styleItem}>
              <div>
                {e.name}
              </div>
              <div>
                {e.ext}
              </div>
              <div>
                {e.date} 
              </div>
            </div>
          );
        })}
      </div>
    );
    //return (
    //  <div className="subDivName">
    //    {this.props.data[1].name}
    //  </div>
    //);
  }
});

let SubDivExt = React.createClass({
  render: function () {
    let _style = {
      color: "#0000FF"
    };
    return (
      <div className="subDivExt" style={_style}>
        Ext!!
      </div>
    );
  }
});

let FooterBody = React.createClass({
  render: function () {
    let style = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch'
    };
    let styleItemList = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flex: '1',
      minWidth: '0'
    };
    let styleItem = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flex: '1',
      minWidth: '0'
    };
    return (
      //<div className="footerBody" style={{color: + '0000FF'}}>
      <div className="footerBody" style={style} >
        <ItemList data={data} styleSub={styleItemList} styleItem={styleItem}/>
      </div>
    );
  }
});
        //<SubDivName data={this.props.data} />

ReactDOM.render(
  <FooterBody data={data} />,
  document.getElementById('footer')
);

//ReactDOM.render(
//  <div>
//    <div>Are you known?</div>
//    <div>Here it!!</div>
//  </div>,
//  document.getElementById('footer')
//);

init();
