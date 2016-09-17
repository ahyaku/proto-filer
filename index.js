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

let SubDivName = React.createClass({
  render: function () {
    let data = this.props.data;
    return (
      <div className="subSivName">
        {data.map(function(e) {
          return <div key={e.id}> {e.name} </div>
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
    return (
      <div className="subDivExt">
        Ext!!
      </div>
    );
  }
});

let FooterBody = React.createClass({
  render: function () {
    return (
      <div className="footerBody">
        <SubDivName data={data} />
        <SubDivExt />
      </div>
    );
  }
});
        //<SubDivName data={this.props.data} />

ReactDOM.render(
  //<FooterBody />,
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
