//const ipc = require('ipc');
//const {ipcMain} = require('electron');
const fs = require('fs');
const util = require('util');
const path = require('path');
const electron = require('electron');
const shell = electron.shell;

const execFile = require('child_process').execFile;
const os = require('os');
//const iconv = require('iconv-lite');

//const KEY_INPUT_MODE = require('./src/core/item_type');
//import { KEY_INPUT_MODE } from './src/core/item_type':

//const cp = require('child_process');

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const webContents = electron.webContents

process.env.NODE_ENV = 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let confWindow

let g_mode;
let g_items_selected
let g_dir_cur;

function createWindow () {
  console.log(process.versions);
  {
    //let path = fs.realpathSync('C:\\');
    //let items = fs.readdirSync(path);
    //for(let e of items){
    //  console.log(util.format('[%s, %s]', e, e.ext));
    //}

    //try{ 
    //  /* This cause error */
    //  val = fs.statSync('C:\\hiberfil.sys').isDirectory();
    //  console.log(val);
    //}catch(e){
    //  console.log('catch: ' + e);
    //}
  }

  const path_react_devtool = app.getPath('userData') + '\\extensions\\fmkadmapgofadopljbjfkapdkoienihi';
  console.log('path_react_devtool: ' + path_react_devtool);
  BrowserWindow.addDevToolsExtension(path_react_devtool);

  // Create the browser window.
  //mainWindow = new BrowserWindow({width: 800, height: 600}) /* ORG */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //nodeIntegration: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null

    //if(confWindow != null){
    //  confWindow.close();
    //  confWindow = null;
    //}
  })
  console.log(webContents);

  {
    g_mode = null;
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


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
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//ipc.on('synchronous-message', function(event, arg){
//  event.returneValue = 'pong';
//});

electron.ipcMain.on('synchronous-message', (event, arg) => {
  //console.log(arg);
  event.returnValue = 'pong';
});

electron.ipcMain.on('fs.readdirSync', (event, arg) => {
  //console.log(arg);
  try{
    event.returnValue = fs.readdirSync(arg);
  }catch(e){
    console.log('readdir catch: ' + e);
    event.returnValue = null;
  }
});

electron.ipcMain.on('fs.isDirectory', (event, arg) => {
  //console.log(arg);
  //try{
  //  event.returnValue = fs.statSync(arg).isDirectory();
  //}catch(e){
  //  console.log('stat catch: ' + e);
  //  event.returnValue = false;
  //}
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

electron.ipcMain.on('copy', (event, item_dst, item_src) => {
  console.log('HERE!!!');
  console.log(item_src);
  console.log(item_dst);
  //event.returnValue = null;
  try{
    event.returnValue = fs.createReadStream(item_src).pipe(fs.createWriteStream(item_dst));
  }catch(e){
    console.log('catch: ' + e);
    event.returnValue = false;
  }

});

electron.ipcMain.on('delete', (event) => {
  for(let key in g_items_seleted){
    let target = path.join(g_dir_cur, key);
    let ret = shell.moveItemToTrash(target);
    console.log('target: ' + target + ', ret: ' + ret);
  }
  mainWindow.webContents.send('updatePane');
  event.returnValue = true;
});

//electron.ipcMain.on('popup', (event, mode, question) => {
electron.ipcMain.on('popup', (event, mode, params) => {
//electron.ipcMain.on('popup', (event, args) => {
  console.log('popup');
  //mainWindow.setFocusable(false);
  //mainWindow.setIgnoreMouseEvents(true);
  confWindow = new BrowserWindow({parent: mainWindow,
                                  modal: true, 
                                  width: 320,
                                  height: 240,
                                  resizable: true,
                                  minimizable: false,
                                  frame: true});
  //confWindow.webContents.openDevTools();
  confWindow.setMenu(null);
  confWindow.loadURL(`file://${__dirname}/popup/confirm.html`);

  confWindow.on('closed', function() {
    //console.log('closed!!!');
    confWindow = null;
  });

  confWindow.on('closed', function () {
    console.log('confWindow closed');
    mainWindow.webContents.send('popupClosed', 0);
  });

  g_mode = mode;

  switch(g_mode){
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
    //case 'quit':
    //  break;
    default:
      /* Do Nothing.. */
      break;
  }

  event.returnValue = true;
});

electron.ipcMain.on('closeMainWindow', (event) => {
  console.log('closeMainWindow');
  mainWindow.close();
})

electron.ipcMain.on('closePopup', (event) => {
  if(confWindow != null){
    confWindow.close();
    confWindow = null;
  }else{
    console.log('confWindow == null!!');
  }
  event.returnValue = true;
});

electron.ipcMain.on('check_mode', (event) => {
  console.log('check_mode is called!!');
  //event.returnValue = g_mode;
  event.returnValue = [g_mode, g_items_selected];
});

electron.ipcMain.on('isearch_start', (event) => {
  console.log('isearch_start @ main process');

  event.returnValue = true;
});

//electron.ipcMain.on('test_message', (event, arg_msg, dispatch) => {
//  const ret_msg = "Are you known??";
//  console.log('test_message <> arg_msg: ' + arg_msg);
//  console.log('test_message <> ret_msg: ' + ret_msg);
//  event.sender.send('test_message_reply', ret_msg, dispatch);
//});

electron.ipcMain.on('test_message', (event, arg_msg) => {
  const ret_msg = "Are you known??";
  console.log('test_message <> arg_msg: ' + arg_msg);
  console.log('test_message <> ret_msg: ' + ret_msg);
  event.sender.send('test_message_reply', ret_msg);
});

electron.ipcMain.on('narrow_down_items', (event, item_names, id, msg) => {
  let ids = [];
  let names = [];

  if(msg.length <= 0){
    for(let i=0; i<item_names.length; i++){
      ids.push(i);
    }
    event.sender.send(
      'narrow_down_items_cb',
      ids,
      '',
      0 /* KEY_INPUT_MODE.NORMAL */
    );
  }

  const pattern = msg.slice(1, msg.length);

  if(pattern.length > 0){
    //console.log('pattern.length > 0');
    //console.log('pattern: ' + pattern);
    const reg = new RegExp(pattern);

    for(let i=0; i<item_names.length; i++){
      if(reg.test(item_names[i])){
        //console.log('match <> ' + e.name);
        names.push(item_names[i]);
        ids.push(i);
      }
    }
  }else{
    for(let i=0; i<item_names.length; i++){
      ids.push(i);
    }

  }

  //console.log('ids: ' + ids);
  //if(pattern.length === 4){
  //  console.log('ids.length: ' + ids.length + ', names: ' + names);
  //}

  event.sender.send(
    'narrow_down_items_cb',
    ids,
    msg,
    1 /* KEY_INPUT_MODE.SEARCH */
  );

  /* DEBUG: Check async action..  */
  //setTimeout(
  //  () => {
  //    console.log('HERE!!!!!!!!!!!!');
  //    event.sender.send(
  //      'narrow_down_items_cb',
  //      ids,
  //      msg,
  //      1 /* KEY_INPUT_MODE.SEARCH */
  //    );
  //  },
  //  5000
  //);

});



//let ret = null;
//console.log('------------------------');
//console.log(ret);
//console.log('------------------------');

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
    //console.log('stdout', stdout);

    const arr = stdout.split('\n');
    const drive_list = arr.slice(1, arr.length - 2).map((e) => {
      return e.trim(' ');
    });

    //console.log('drive_list: ' + drive_list);

    event.returnValue = drive_list;


  });
}


//electron.ipcMain.on('narrow_down_items', (event, state_str, id, msg) => {
//  setTimeout(
//    () => {
//      event.sender.send(
//        'narrow_down_items_cb',
//        state_str
//      );
//    },
//    0
//  );
//  //event.sender.send(
//  //  'narrow_down_items_cb',
//  //  state_str
//  //);
//});

//electron.ipcMain.on('narrow_down_items', (event, state_str, id, msg) => {
//  let state_ret;
//  const state = im.fromJS(state_str);
//  //console.log('state: ' + state);
//
//  if(msg.length <= 0){
//    state_ret = state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//                                          .set('input_mode', KEY_INPUT_MODE.NORMAL));
//    event.sender.send(
//      'narrow_down_items_cb',
//      state_ret.toJS()
//    );
//
//    //event.sender.send(
//    //  'narrow_down_items_cb',
//    //  state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], '')
//    //                            .set('input_mode', KEY_INPUT_MODE.NORMAL))
//    //);
//  }
//
//  const pattern = msg.slice(1, msg.length);
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  console.log('dir_cur: ' + dir_cur);
//  let items;
//
//  items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items']);
//  //console.log('items: ' + items);
//
//  if(pattern.length > 0){
//    console.log('pattern.length > 0');
//    console.log('pattern: ' + pattern);
//    const reg = new RegExp(pattern);
//
//    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
//                       .filter((e, i) => {
//                         //console.log('e: ' + e);
//                         //console.log('e.name: ' + e.name); /* NG */
//                         //console.log('e[name]: ' + e["name"]); /* NG */
//                         console.log('e[name]: ' + e.get('name')); /* OK */
//                         //const item = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items', i]);
//                         //console.log('item.name: ' + item.name);
//                         if(reg.test(e.name)){
//                           console.log('match <> ' + e.name);
//                           return e;
//                         }
//                       });
//
//  }else{
//    items = state.getIn(['arr_pages', id, 'pages', dir_cur, 'items'])
//  }
//
//  //console.log('NarrowDownItemsCore() END!!');
//
//  state_ret = state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//                                        .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//                                        .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0));
//  event.sender.send(
//    'narrow_down_items_cb',
//    state_ret.toJS()
//  );
//
//  //event.sender.send(
//  //  'narrow_down_items_cb',
//  //  state.withMutations(s => s.setIn(['arr_pages', id, 'msg_cmd'], msg)
//  //                            .setIn(['arr_pages', id, 'pages', dir_cur, 'items_match'], items)
//  //                            .setIn(['arr_pages', id, 'pages', dir_cur, 'line_cur'], 0))
//  //);
//
//});

//const c = cp.fork('./src/proc-narrow-items.js');
//
//c.on('message', (m) => {
//  console.log('narrow_down_items_cb!! <> m: ' + m);
//});
//
//function test(){
//  console.log('HERE??');
//  //const ret = c.send({
//  //  channel: 'message',
//  //  arg: 'world'
//  //});
//  const ret = c.send({
//    hello: 'world'
//  });
//  console.log('ret: ' + ret);
//}
//
//test();


//const worker = new Worker("./src/webworker.js");

