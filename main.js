//const ipc = require('ipc');
//const {ipcMain} = require('electron');
const fs = require('fs-extra');
const util = require('util');
const path = require('path');
const electron = require('electron');
const shell = electron.shell;
const execFile = require('child_process').execFile;
const os = require('os');
//const RES = require('./res/res').RES;

//const RESIZE_STATE = {
//  NONE: 0,
//  SMALLER: 1,
//  LARGER: 2
//}
//const RESIZE_MARGIN = RES.ITEM.HEIGHT / 2;

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const webContents = electron.webContents

process.env.NODE_ENV = 'production';

const POPUP_POS_MARGIN = 10;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let quitWindow;
let sortWindow;
let renameWindow;
let createWindow;
let confWindow;

let g_items_selected;
let g_dir_cur;

//let g_height_win;
//let g_is_resize_first;
//let g_is_resize_fit;
//let g_resize_state = RESIZE_STATE.NONE;

function constructWindow () {
  console.log(process.versions);
  const path_react_devtool = app.getPath('userData') + '\\extensions\\fmkadmapgofadopljbjfkapdkoienihi';
  console.log('path_react_devtool: ' + path_react_devtool);
  BrowserWindow.addDevToolsExtension(path_react_devtool);

  // Create the browser window.
  //mainWindow = new BrowserWindow({width: 800, height: 600}) /* ORG */
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 650,
    frame: true,
    useContentSize: false,
    webPreferences: {
      //nodeIntegration: false
    }
  });

  mainWindow.setPosition(10, 10);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  //g_height_win = 0;
  //g_is_resize_first = true;
  //mainWindow.on('resize', function (e) {
  //  //console.log('resize!!');
  //  //const [w, h] = mainWindow.getSize();
  //  const [cw, ch] = mainWindow.getContentSize();
  //  //console.log('resize <> [w, h] = [' + w + ', ' + h + ']');
  //  console.log('resize <> [cw, ch] = [' + cw + ', ' + ch + '], g_height_win: ' + g_height_win);

  //  //e.preventDefault();
  //  //mainWindow.setContentSize(cw, g_height_win);


  //  //mainWindow.webContents.send('is_changed_main_window_size', ch);
  //  //if(ch != g_height_win){
  //  //  mainWindow.setContentSize(cw, g_height_win);
  //  //}

  //  //if(g_is_resize_first === true){
  //  //  g_is_resize_first = false;
  //  //  mainWindow.setContentSize(cw, g_height_win);
  //  //}else{
  //  //  g_is_resize_first = true;
  //  //}

  //  //if(ch > g_height_win){
  //  //  console.log('here!!');
  //  //  mainWindow.setContentSize(cw, g_height_win);
  //  //}

  //  //if(ch > g_height_win &&
  //  //   g_is_resize_first === true){
  //  //  console.log('here!!');
  //  //  g_is_resize_first = false;
  //  //  mainWindow.setContentSize(cw, g_height_win);
  //  //}else{
  //  //  g_is_resize_first = true;
  //  //}

  //});

  const time_out = 200;
  let id = null;
  //g_is_resize_fit = false;

  let ch_ref = 0;

  //mainWindow.on('mousedown', function(e){
  //  console.log('mousedown!!');
  //});

  mainWindow.webContents.on('mousedown', function(e){
    console.log('mousedown!!');
  });

  //mainWindow.on('dragend', function(e){
  //  console.log('dragend!!');
  //});

  //mainWindow.addEventListener('dragend', function(e){
  //  console.log('dragend!!');
  //}, true);



  //mainWindow.on('resize', function (e) {
  //  //console.log('resize!!');
  //  //const [w, h] = mainWindow.getSize();
  //  //const [cw, ch] = mainWindow.getContentSize();
  //  //console.log('resize <> [w, h] = [' + w + ', ' + h + ']');

  //  if(id !== null){
  //    clearTimeout(id);
  //  }

  //  if(g_is_resize_fit === true){
  //    g_is_resize_fit = false;
  //  }else{
  //    id = setTimeout(function () {
  //      const [cw, ch] = mainWindow.getContentSize();
  //      console.log('ch_ref: ' + ch_ref + ', ch: ' + ch);
  //      //height_win_new = RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * this.line_disp_num + RES.INFO.HEIGHT;

  //      //line_disp_num = Math.floor( ( ch - (RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.INFO.HEIGHT) ) / RES.ITEM.HEIGHT );

  //      //if(ch <= ch_ref){
  //      //  g_height_win = RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * line_disp_num + RES.INFO.HEIGHT;
  //      //}else{
  //      //  g_height_win = RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * (line_disp_num + 1) + RES.INFO.HEIGHT;
  //      //}

  //      switch(g_resize_state){
  //        case RESIZE_STATE.SMALLER:
  //          console.log('SMALLER');
  //          line_disp_num = Math.floor( ( ch - (RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.INFO.HEIGHT) ) / RES.ITEM.HEIGHT );
  //          g_height_win = RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * line_disp_num + RES.INFO.HEIGHT;
  //          break;
  //        case RESIZE_STATE.LARGER:
  //          console.log('LARGER');
  //          line_disp_num = Math.ceil( ( ch - (RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.INFO.HEIGHT) ) / RES.ITEM.HEIGHT );
  //          g_height_win = RES.PATH_CUR.HEIGHT * 2 + RES.CMD.HEIGHT + RES.ITEM.HEIGHT * (line_disp_num + 1) + RES.INFO.HEIGHT;
  //          break;
  //        default:
  //          break;
  //      }

  //      //console.log('resize <> [cw, ch] = [' + cw + ', ' + ch + '], g_height_win: ' + g_height_win + ', disp_num: ' + line_disp_num);
  //      g_is_resize_fit = true;
  //      mainWindow.setContentSize(cw, g_height_win);
  //      //mainWindow.setContentSize(640, 480);
  //    },
  //    time_out);
  //  }

  //  {
  //    const ch_tmp = mainWindow.getContentSize()[1];
  //    console.log('ch_ref: ' + ch_ref + ', ch_tmp: ' + ch_tmp);
  //    if(ch_tmp < (ch_ref - RESIZE_MARGIN)){
  //      console.log('tmp: SMALLER');
  //      g_resize_state = RESIZE_STATE.SMALLER;
  //    }else if(ch_tmp > (ch_ref + RESIZE_MARGIN)){
  //      console.log('tmp: LARGER');
  //      g_resize_state = RESIZE_STATE.LARGER;
  //    }
  //    ch_ref = ch_tmp;
  //  }

  //});

  //mainWindow.on('ready-to-show', function (e) {
  //  console.log('ready-to-show!!');
  //});

//  mainWindow.on('dragend', function () {
//    console.log('dragend!!');
//    //const [w, h] = mainWindow.getSize();
//    const [cw, ch] = mainWindow.getContentSize();
//    //console.log('sort <> [w, h] = [' + w + ', ' + h + ']');
//    console.log('sort <> [cw, ch] = [' + cw + ', ' + ch + ']');
//
//    mainWindow.webContents.send('is_changed_main_window_size', ch);
//  });

  //mainWindow.setMenu(null);
  console.log(webContents);


  quitWindow = createPopupWindow('quit', 320, 240);
  quitWindow.hide();

  sortWindow = createPopupWindow('sort', 150, 240);
  sortWindow.hide();

  renameWindow = createPopupWindow('rename', 800, 400);
  renameWindow.webContents.openDevTools();
  renameWindow.hide();

  createWindow = createPopupWindow('create', 800, 400);
  createWindow.webContents.openDevTools();
  createWindow.hide();

  confWindow = createPopupWindow('confirm', 320, 240);
  confWindow.webContents.openDevTools();
  confWindow.hide();

}

function createPopupWindow(ptype, width, height){
  let pwindow;
  pwindow = new BrowserWindow({parent: mainWindow,
                                  modal: true, 
                                  width: width,
                                  height: height,
                                  resizable: true,
                                  minimizable: false,
                                  frame: true});
  pwindow.setMenu(null);
  switch(ptype){
    case 'quit':
      pwindow.loadURL(`file://${__dirname}/src/popup/quit/main.html`);
      break;
    case 'sort':
      pwindow.loadURL(`file://${__dirname}/src/popup/sort/main.html`);
      break;
    case 'rename':
      pwindow.loadURL(`file://${__dirname}/src/popup/rename/main.html`);
      break;
    case 'create':
      pwindow.loadURL(`file://${__dirname}/src/popup/create/main.html`);
      break;
    case 'confirm':
      pwindow.loadURL(`file://${__dirname}/src/popup/confirm/main.html`);
      break;
  }

  //pwindow.webContents.openDevTools();

  pwindow.on('closed', function() {
    //console.log('closed!!!');
    pwindow = null;
  });

  return pwindow;
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', constructWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    constructWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//ipc.on('synchronous-message', function(event, arg){
//  event.returneValue = 'pong';
//});

electron.ipcMain.on('synchronous-message', (event, arg) => {
  event.returnValue = 'pong';
});

electron.ipcMain.on('fs.readdirSync', (event, arg) => {
  try{
    event.returnValue = fs.readdirSync(arg);
  }catch(e){
    console.log('readdir catch: ' + e);
    event.returnValue = null;
  }
});

electron.ipcMain.on('fs.isDirectory', (event, arg) => {
  //console.log(arg);
  try{
    const stat = fs.statSync(arg);
    event.returnValue = {is_dir: stat.isDirectory(),
                         fsize: stat['size'],
                         mtime: stat['mtime'],
                         err: 0};
  }catch(e){
    console.log('stat catch: ' + e);
    event.returnValue = {is_dir: null,
                         fsize: null,
                         mtime: null,
                         err: -1};
  }
});

electron.ipcMain.on('copy', (event, path_dst, path_src, item_names) => {
  //console.log('copy Start!!!');
  //console.log('path_dst: ' + path_dst);
  //console.log('path_src: ' + path_src);
  //console.log('item_names: ' + item_names);
  //console.log('item_names.length: ' + item_names.length);

  handleItems('copy', path_dst, path_src, item_names);
  event.returnValue = true;
});

electron.ipcMain.on('move', (event, path_dst, path_src, item_names) => {
  //console.log('move Start!!!');
  //console.log('path_dst: ' + path_dst);
  //console.log('path_src: ' + path_src);
  //console.log('item_names: ' + item_names);
  //console.log('item_names.length: ' + item_names.length);

  handleItems('move', path_dst, path_src, item_names);
  event.returnValue = true;
});

const handleItems = (mode, path_dst_root, path_src_root, items_root) => {
  //console.log('handleItems() Start!!');
  //console.log('handleItems() path_dst_root: ' + path_dst_root + ', path_src_root: ' + path_src_root);
  let del_list = [];

  const { procWriteFile,
          procWriteDir,
          procOwFileYes,
          procOwFileNo,
          procOwDir,
          procPost 
        } = getProcsMC(mode);

  const proc = (_path_dst, _path_src, _item, _del_list, _depth) => {
    return new Promise((resolve, reject) => {
      const _item_src = path.resolve(_path_src, _item);
      const _item_dst = path.resolve(_path_dst, _item);

      if(fs.existsSync(_item_dst) === true){ /* Target item already exists in _path_dst. */
        if( (fs.statSync(_item_dst).isDirectory() === false) && 
            (fs.statSync(_item_src).isDirectory() === false) ){
          const prom = new Promise((_resolve, _reject) => {
            electron.ipcMain.once('receiveOverwriteFlag', (event, flag) => {
              confWindow.hide();
              mainWindow.focus();
              if(flag === true){ /* Overwrite the target item in _path_dst by the one in _path_src. */
                  procOwFileYes(_item_dst, _item_src);
                  _resolve(_del_list);
                  return;
              }else{
                _resolve( procOwFileNo(_item_src, _del_list) );
                return;
              }
            });

            electron.ipcMain.once('showConfWindow', (event, arg) => {
              confWindow.show();
            });

            const ret = confWindow.webContents.send('transferItemName',
                                                        {
                                                          item_name: _item
                                                        });
          });

          prom.then((_del_list_new) => {
            resolve(_del_list_new);
          });
          return;
        }else if( fs.statSync(_item_dst).isDirectory() && 
                  fs.statSync(_item_src).isDirectory() ){
          const dl = procOwDir(_item_dst, _item_src, _del_list, _depth);
          walk_cur(_item_dst, _item_src, fs.readdirSync(_item_src), dl, (_depth + 1))
            .then((_del_list_new) => {
              resolve(_del_list_new);
            });
          return;
        }else{
          resolve(_del_list);
          return;
        }
      }else{ /* Target item does NOT exist in _path_dst. */
        if( fs.statSync(_item_src).isDirectory() ){
          const dl = procWriteDir(_item_dst, _item_src, _del_list);
          const prom = new Promise((_resolve, _reject) => {
            walk_cur(_item_dst, _item_src, fs.readdirSync(_item_src), dl, (_depth + 1))
              .then((_del_list_new) => {
                _resolve(_del_list_new);
              });
          });

          prom.then((_del_list_new) => {
            resolve(_del_list_new);
          });
          return;
        }else{
          procWriteFile(_item_dst, _item_src);
          resolve(_del_list);
          return;
        }
      }
    });
  }

  const walk_cur = (_path_dst, _path_src, _items, _del_list, _depth) => {
    let p = Promise.resolve(_del_list);
    for(let i = 0; i < _items.length; i++){
      p = p.then((_del_list_new) => {
             return proc(_path_dst, _path_src, _items[i], _del_list_new, _depth);
            });
    }
    return p;
  }

  walk_cur(path_dst_root, path_src_root, items_root, del_list, 0)
    .then((_del_list_new) => {
      procPost(_del_list_new);
    });

};

const getProcsMC = (mode) => {
  switch(mode){
    case 'move':
      return getProcsMove();
    case 'copy':
      return getProcsCopy();
    default:
      console.log('handleItems() <> Error!!: Incorrect mode');
      return null;
  }
};

const getProcsMove = () => {
  return {
    procWriteFile: (item_dst, item_src) => {
      fs.moveSync(item_src, item_dst, {overwrite: true});
    },
    procWriteDir: (item_dst, item_src, del_list) => {
      fs.mkdirSync(item_dst);
      del_list.push(item_dst);
      return del_list;
    },
    procOwFileYes: (item_dst, item_src) => {
      fs.moveSync(item_src, item_dst, {overwrite: true});
    },
    procOwFileNo: (item_src, del_list) => {
      return removeParentDirsFromDelList(del_list, item_src);
    },
    procOwDir: (item_dst, item_src, del_list, depth) => {
      del_list.push(item_src);
      return del_list;
    },
    procPost: (del_list) => {
      console.log('procPost() <> del_list: ' + del_list);

      for(let i=0; i<del_list.length; i++){
        try{
          fs.rmdirSync(del_list[i]);
        }catch(err){
          console.log("procPost() <> ERROR!!: " + err);
        }
      }
    }
  };

};

const getProcsCopy = () => {
  return {
    procWriteFile: (item_dst, item_src) => {
      fs.copySync(item_src, item_dst, {overwrite: true});
    },
    procWriteDir: (item_dst, item_src, del_list) => {
      fs.mkdirSync(item_dst);
      return null;
    },
    procOwFileYes: (item_dst, item_src) => {
      fs.copySync(item_src, item_dst, {overwrite: true});
    },
    procOwFileNo: (item_src, del_list) => {
      /* Do Nothing.. */
      return null;
    },
    procOwDir: (item_dst, item_src, del_list, depth) => {
      /* Do Nothing.. */
      return null;
    },
    procPost: (del_list) => {
      /* Do Nothing.. */
    }
  };

};

const removeParentDirsFromDelList = (del_list, path_cur) => {
  const pdlist = getParentDirList(path_cur);
  for(let i=0; i<pdlist.length; i++){
    const idx = del_list.indexOf(pdlist[i]);
    del_list.splice(idx, 1);
  }
  return del_list;
}

const getParentDirList = (path_init, root_limit) => {
  let pdlist = [];
  let path_tmp = path_init;
  while(true){
    path_tmp = path.dirname(path_tmp);
    if(path_tmp === pdlist[pdlist.length - 1]){
      return pdlist;
    }else if(path_tmp === root_limit){
      pdlist.push(path_tmp);
      return pdlist;
    }else{
      pdlist.push(path_tmp);
    }
  }
}

electron.ipcMain.on('trash', (event, path_src, item_names) => {
  console.log('trash!!!');
  console.log('path_src: ' + path_src);
  console.log('item_names: ' + item_names);
  console.log('item_names.length: ' + item_names.length);

  for(let i=0; i<item_names.length; i++){
    const item_src = path.join(path_src, item_names[i]);
    console.log(i + ': ' + item_src);
    shell.moveItemToTrash(item_src);
  }

  event.returnValue = true;
});

electron.ipcMain.on('open_item', (event, path_src, item_names) => {
  console.log('open_item!!!');
  console.log('path_src: ' + path_src);
  console.log('item_names: ' + item_names);
  console.log('item_names.length: ' + item_names.length);

  for(let i=0; i<item_names.length; i++){
    const item_src = path.join(path_src, item_names[i]);
    console.log(i + ': ' + item_src);
    shell.openItem(item_src);
  }

  event.returnValue = true;
});

electron.ipcMain.on('popup', (event, mode, params) => {

  switch(mode){
    case 'delete':
      g_dir_cur = params.dir_cur;
      g_items_selected = params.items_selected;
      console.log('mode: ' + mode);
      console.log('dir_cur: ' + params.dir_cur);
      let len = Object.keys(params.items_selected).length;
      console.log('len: ' + len);
      let count = 0;
      for(let key in params.items_selected){
        console.log('count: ' + count++ + ', key: ' + key + ', item: ' + params.items_selected[key]);
      }
      break;
    case 'quit':
      quitWindow.show();
      break;
    case 'sort':
      {
        const wpos = mainWindow.getPosition();
        const rect = mainWindow.getBounds();
        const crect = mainWindow.getContentBounds();
        const left = Math.round(rect.x + params.left + POPUP_POS_MARGIN);
        const top = Math.round(crect.y + params.top + POPUP_POS_MARGIN);
        sortWindow.setPosition(left, top);
        sortWindow.show();
        break;
      }
    case 'rename':
      {
        const wpos = mainWindow.getPosition();
        const rect = mainWindow.getBounds();
        const crect = mainWindow.getContentBounds();
        const left = Math.round(rect.x + params.left + POPUP_POS_MARGIN);
        const top = Math.round(crect.y + params.top + POPUP_POS_MARGIN);
        renameWindow.setPosition(left, top);
        renameWindow.webContents.send('openPopUpRename',
                                      {
                                        item_name_init: params.item_name,
                                        dir_cur: params.dir_cur,
                                        id_target: params.id_target,
                                        cursor_pos: params.cursor_pos
                                      });
        renameWindow.show();
        renameWindow.focus();
        break;
      }
    case 'create':
      console.log('creatre <> dir_cur: ' + params.dir_cur);
      {
        const wpos = mainWindow.getPosition();
        const rect = mainWindow.getBounds();
        const crect = mainWindow.getContentBounds();
        const left = Math.round(rect.x + params.left + POPUP_POS_MARGIN);
        const top = Math.round(crect.y + params.top + POPUP_POS_MARGIN);
        createWindow.setPosition(left, top);
        createWindow.webContents.send('openPopUpCreate',
                                      {
                                        action_type: params.action_type,
                                        dir_cur: params.dir_cur,
                                        id_target: params.id_target,
                                      });
        createWindow.show();
        createWindow.focus();
        break;
      }
    default:
      /* Do Nothing.. */
      break;
  }

  event.returnValue = true;
});

electron.ipcMain.on('closeMainWindow', (event) => {
  console.log('closeMainWindow');
  confWindow.close();
  quitWindow.close();
  renameWindow.close();
  createWindow.close();
  sortWindow.close();
  mainWindow.close();
})

electron.ipcMain.on('closePopup', (event, ptype) => {
  switch(ptype){
    case 'quit':
      quitWindow.hide();
      break;
    case 'sort':
      sortWindow.hide();
      break;
    case 'rename':
      renameWindow.hide();
      mainWindow.webContents.send('isClosedPopup');
    case 'create':
      console.log('closePopup <> ptype: create');
      createWindow.hide();
      mainWindow.webContents.send('isClosedPopup');
      break;
    case 'confirm':
      confWindow.hide();
      break;
  }
  mainWindow.focus();

  event.returnValue = true;
});

electron.ipcMain.on('sortItems', (event, type) => {
  mainWindow.webContents.send('sortItems', type);
  sortWindow.hide();
  mainWindow.focus();

  event.returnValue = true;
});

electron.ipcMain.on('reqRenameItem', (event, {item_name_dst, item_name_src, dir_cur, id_target}) => {
  const full_name_dst = path.join(dir_cur, item_name_dst);
  const full_name_src = path.join(dir_cur, item_name_src);

  if(item_name_dst !== ''){
    try{
      fs.renameSync(full_name_src, full_name_dst);
    }catch(e){
      console.log('reqRenameItem <> e: ', e);
    }
  }
  
  const item_name_mdf = getBasename(full_name_dst);
  mainWindow.webContents.send('renameItem', id_target, dir_cur, item_name_mdf);
  renameWindow.hide();
  createWindow.hide();
  mainWindow.focus();

  event.returnValue = true;
});

electron.ipcMain.on('reqCreateItem', (event, {mode, item_name, dir_cur, id_target}) => {
  console.log('reqCreateItem() <> mode: ' + mode);
  event.returnValue = true;

  if(item_name === ''){
    console.log('ERROR!! @ reqCreateItem <> item name is empty.');
    return;
  }

  if(fs.existsSync(path.resolve(dir_cur, item_name)) === true){
    console.log('ERROR!! @ reqCreateItem <> item: ' + item_name + ' already exists.');
    return;
  }

  switch(mode){
    case 'MODE_CREATE_DIR':
      console.log('MODE_CREATE_DIR <> item_name: ' + item_name + ', dir_cur: ' + dir_cur);
      createDir(item_name, dir_cur);
      break;
    case 'MODE_CREATE_FILE':
      console.log('MODE_CREATE_FILE <> item_name: ' + item_name + ', dir_cur: ' + dir_cur);
      createFile(item_name, dir_cur);
      break;
    default:
      console.log('ERROR!! @ reqCreateItem');
      break;
  }
});

function createDir(item_name, dir_cur){
  console.log('createDir <> item_name: ' + item_name + ', dir_cur: ' + dir_cur);
  try{
    fs.mkdirSync(path.resolve(dir_cur, item_name));
  }catch(e){
    console.log('createDir <> e: ', e);
  }
}

function createFile(item_name, dir_cur){
  console.log('createFile <> item_name: ' + item_name + ', dir_cur: ' + dir_cur);
  try{
    fs.writeFileSync(path.resolve(dir_cur, item_name), '');
  }catch(e){
    console.log('createFile <> e: ', e);
  }
}

function getBasename(full_name){
  switch(process.platform){
    case 'win32':
      return path.win32.basename(full_name);
      break;
    case 'darwin':
    case 'linux':
      return path.posix.basename(full_name);
      break;
    default: 
      console.log('ERROR!! reqRenameItem()');
      return null;
  }
}

electron.ipcMain.on('isearch_start', (event) => {
  console.log('isearch_start @ main process');
  event.returnValue = true;
});

electron.ipcMain.on('test_message', (event, arg_msg) => {
  const ret_msg = "Are you known??";
  console.log('test_message <> arg_msg: ' + arg_msg);
  console.log('test_message <> ret_msg: ' + ret_msg);
  event.sender.send('test_message_reply', ret_msg);
});

electron.ipcMain.on('narrow_down_items', (event, item_names, msg) => {
  let is_matched = [];

  if(msg.length <= 0){
    for(let i=0; i<item_names.length; i++){
      is_matched.push(true);
    }
    event.sender.send(
      'narrow_down_items_cb',
      is_matched,
      '',
      0 /* KEY_INPUT_MODE.NORMAL */
    );
  }

  const pattern = msg.slice(1, msg.length);

  if(pattern.length > 0){
    const reg = new RegExp(pattern);

    for(let i=0; i<item_names.length; i++){
      is_matched.push(reg.test(item_names[i]));
    }
  }else{
    for(let i=0; i<item_names.length; i++){
      is_matched.push(true);
    }
  }

  event.sender.send(
    'narrow_down_items_cb',
    is_matched,
    msg,
    1 /* KEY_INPUT_MODE.SEARCH */
  );

  /* DEBUG: Check async action..  */
  //setTimeout(
  //  () => {
  //    console.log('HERE!!!!!!!!!!!!');
  //    event.sender.send(
  //      'narrow_down_items_cb',
  //      is_matched,
  //      msg,
  //      1 /* KEY_INPUT_MODE.SEARCH */
  //    );
  //  },
  //  5000
  //);

});

electron.ipcMain.on('get_disk_drive_list', (event, arg) => {
  switch( os.platform() ){
    case 'win32':
      console.log('win32')
      detectDiskDriveWin32(event);
      break;
    case 'aix':
    case 'darwin':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'sunos':
    default:
      console.log('ERROR!!');
      event.returnValue = 'ERROR!!';
      break;
  }

});

const detectDiskDriveWin32 = (event) => {
  const child = execFile('wmic', ['logicaldisk', 'get', 'name'], (error, stdout, stderr) => {
    if (error) {
        console.error('stderr', stderr);
        throw error;
    }

    const arr = stdout.split('\n');
    const drive_list = arr.slice(1, arr.length - 2).map((e) => {
      return e.trim(' ');
    });

    event.returnValue = drive_list;
  });
}

//electron.ipcMain.on('update_window_size', (event, height_win) => {
//  const crect = mainWindow.getContentBounds();
//
//  //console.log('update_window_size <> wleft: ' + wpos[0] + ', wtop: ' + wpos[1]);
//  //console.log('update_window_size <> rect x:' + rect.x + ', y:' + rect.y);
//
//  //console.log('update_window_size <> crect x:' + crect.x + ', y:' + crect.y + ', height_win: '+ height_win);
//
//  //const trect = Object.assign(
//  //  {},
//  //  crect,
//  //  {
//  //    height: height_win
//  //  }
//  //);
//  //mainWindow.setContentBounds(trect);
//
//  g_height_win = height_win;
//
//  event.returnValue = true;
//
//});
