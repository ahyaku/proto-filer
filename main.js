//const ipc = require('ipc');
//const {ipcMain} = require('electron');
const fs = require('fs-extra');
const util = require('util');
const path = require('path');
const electron = require('electron');
const shell = electron.shell;
const execFile = require('child_process').execFile;
const os = require('os');

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const webContents = electron.webContents

process.env.NODE_ENV = 'production';

const POPUP_POS_MARGIN = 10;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let confWindow
let sortWindow

let g_items_selected
let g_dir_cur;

function createWindow () {
  console.log(process.versions);
  const path_react_devtool = app.getPath('userData') + '\\extensions\\fmkadmapgofadopljbjfkapdkoienihi';
  console.log('path_react_devtool: ' + path_react_devtool);
  BrowserWindow.addDevToolsExtension(path_react_devtool);

  // Create the browser window.
  //mainWindow = new BrowserWindow({width: 800, height: 600}) /* ORG */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    useContentSize: false,
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
  })

  //mainWindow.setMenu(null);
  console.log(webContents);


  confWindow = createPopupWindow('quit', 320, 240);
  confWindow.hide();

  sortWindow = createPopupWindow('sort', 150, 240);
  sortWindow.hide();

}

function createPopupWindow(ptype, width, height){
  let pwindow;
  console.log('popup');
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
      pwindow.loadURL(`file://${__dirname}/src/popup/confirm/main.html`);
      break;
    case 'sort':
      pwindow.loadURL(`file://${__dirname}/src/popup/sort/main.html`);
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

//electron.ipcMain.on('copy', (event, item_dst, item_src) => {
//  console.log('HERE!!!');
//  console.log(item_src);
//  console.log(item_dst);
//
//  try{
//    event.returnValue = fs.createReadStream(item_src).pipe(fs.createWriteStream(item_dst));
//  }catch(e){
//    console.log('catch: ' + e);
//    event.returnValue = false;
//  }
//
//});

electron.ipcMain.on('copy', (event, path_dst, path_src, item_names) => {
  console.log('HERE!!!');
  console.log('path_dst: ' + path_dst);
  console.log('path_src: ' + path_src);
  console.log('item_names: ' + item_names);
  console.log('item_names.length: ' + item_names.length);

  for(let i=0; i<item_names.length; i++){
    let item_src = path.join(path_src, item_names[i]);
    let item_dst = path.join(path_dst, item_names[i]);
    console.log('item_src[' + i + ']: ' + item_src);
    console.log('item_dst[' + i + ']: ' + item_dst);

    //let rstream = fs.createReadStream(item_src);
    //let wstream = fs.createWriteStream(item_dst);
    //rstream.pipe(wstream);

    fs.copySync(item_src, item_dst);
    //let ret = fs.copySync(item_src, item_dst, {errorOnExist: true});
    //console.log('ret: ' + ret);
  }


//  try{
//    event.returnValue = fs.createReadStream(item_src).pipe(fs.createWriteStream(item_dst));
//  }catch(e){
//    console.log('catch: ' + e);
//    event.returnValue = false;
//  }

  event.returnValue = true;

});

electron.ipcMain.on('move', (event, path_dst, path_src, item_names) => {
  console.log('HERE!!!');
  console.log('path_dst: ' + path_dst);
  console.log('path_src: ' + path_src);
  console.log('item_names: ' + item_names);
  console.log('item_names.length: ' + item_names.length);

  for(let i=0; i<item_names.length; i++){
    let item_src = path.join(path_src, item_names[i]);
    let item_dst = path.join(path_dst, item_names[i]);
    console.log('item_src[' + i + ']: ' + item_src);
    console.log('item_dst[' + i + ']: ' + item_dst);

    //let rstream = fs.createReadStream(item_src);
    //let wstream = fs.createWriteStream(item_dst);
    //rstream.pipe(wstream);

    fs.moveSync(item_src, item_dst, {overwrite: true});
  }

  event.returnValue = true;

});

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
      confWindow.show();
      break;
    case 'sort':
      //console.log('sort <> left: ' + params.left + ', top: ' + params.top);

      const wpos = mainWindow.getPosition();
      const rect = mainWindow.getBounds();
      const crect = mainWindow.getContentBounds();

      //console.log('sort <> wleft: ' + wpos[0] + ', wtop: ' + wpos[1]);
      //console.log('sort rect <> x:' + rect.x + ', y:' + rect.y);
      //console.log('sort crect <> x:' + crect.x + ', y:' + crect.y);

      const left = Math.round(rect.x + params.left + POPUP_POS_MARGIN);
      const top = Math.round(crect.y + params.top + POPUP_POS_MARGIN);
      sortWindow.setPosition(left, top);
      sortWindow.show();
      break;
    default:
      /* Do Nothing.. */
      break;
  }

  event.returnValue = true;
});

electron.ipcMain.on('closeMainWindow', (event) => {
  console.log('closeMainWindow');
  confWindow.close();
  sortWindow.close();
  mainWindow.close();
})

electron.ipcMain.on('closePopup', (event, ptype) => {
  console.log('HERE!!');

  switch(ptype){
    case 'quit':
      confWindow.hide();
      break;
    case 'sort':
      sortWindow.hide();
      break;
  }
  mainWindow.focus();

  event.returnValue = true;
});

electron.ipcMain.on('sortItems', (event, type) => {
  //console.log('sortItems!!');
  mainWindow.webContents.send('sortItems', type);
  sortWindow.hide();
  mainWindow.focus();

  event.returnValue = true;
});

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
