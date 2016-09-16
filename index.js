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

init();
