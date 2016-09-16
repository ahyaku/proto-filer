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

let mediate_pane;
let id_pane_cmd_left;
let id_pane_cmd_right;

function init(){
  //let e = document.getElementById('window');
  //e.addEventListener('keydown', onKeyDown);

  id_pane_cmd_left = document.getElementById('pane_cmd_left');
  id_pane_cmd_right = document.getElementById('pane_cmd_right');

  //document.addEventListener('keydown', onKeyDown);


  //document.getElementById('pane_cmd_left').blur();
  //document.getElementById('pane_cmd_right').blur();

  mediate_pane = new MediatePane('item_list_left', 
                                 'item_list_right',
                                 'dir_cur_left',
                                 'dir_cur_right',
                                 'pane_cmd_left',
                                 'pane_cmd_right',
                                 'C:\\Go',
                                 'C:\\tmp\\test');

  //mediate_pane = new MediatePane('items_left', 
  //                               'items_right',
  //                               'dir_cur_left',
  //                               'dir_cur_right',
  //                               'C:\\Go',
  //                               'C:\\Go');

  mediate_pane.update;
}

init();
