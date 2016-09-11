//const ipc = require('ipc');
//const {ipcMain} = require('electron');
const fs = require('fs');
const util = require('util');
const path = require('path');
const electron = require('electron');
const shell = electron.shell;
const keypress = require('keypress');

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const webContents = electron.webContents

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let confWindow

let g_mode;
let g_items_selected
let g_dir_cur;

function createWindow () {
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

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

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

  //keypress(process.stdin);
  
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
    console.log('catch: ' + e);
    event.returnValue = null;
  }
});

electron.ipcMain.on('fs.isDirectory', (event, arg) => {
  //console.log(arg);
  try{
    event.returnValue = fs.statSync(arg).isDirectory();
  }catch(e){
    console.log('catch: ' + e);
    event.returnValue = false;
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

  //process.stdin.on('keypress', function(ch, key){
  //  console.log('keypress key: ' + key);
  //  if(key && key.ctrl && key.name == 'c'){
  //    console.log('ctrl + c !!');
  //    process.stdin.pause();
  //  }
  //});
  ////process.stdin.setRawMode(true);
  ////process.stdin.resume();

  event.returnValue = true;
});
