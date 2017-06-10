'use strict';

import electron, { ipcRenderer } from 'electron';
import fs from 'fs';
//import path from 'path';
import util from 'util';

import im from 'immutable';
//import Item from './item';
import { initAsItem, initAsDiskDrive } from './item';
import {ITEM_TYPE_KIND} from './item_type';

export const DISK_DRIVE = 'Disk Drives';

export function updateItemsAsDiskDrive(drive_list){
//  const items = im.Seq(im.Range(0, drive_list.length))
//                  .map((e, i) => {
//                    return initAsDiskDrive(i, drive_list[i]);
//                  });

  const items = im.List(im.Range(0, drive_list.length))
                  .map((e, i) => {
                    return initAsDiskDrive(i, drive_list[i]);
                  });

  return im.Map({
           'dir_cur': DISK_DRIVE,
           'reg_pat': '',
           'line_cur': 0,
           'items': items,
           'items_match': items
         });

}

export function updateItems(dir_cur){
  //let dir_cur = this.get('dir_cur')
  //let es = ipcRenderer.sendSync('fs.readdirSync', dir_cur);
  let es = ['..'];
  let es_tail = ipcRenderer.sendSync('fs.readdirSync', dir_cur);
  Array.prototype.push.apply(es, es_tail);

  /* If file access of fs.readdirSync is denied, es == null */
  if(es == null){
    console.log('ERROR <> es is null!!');
    return null;
  }

//  const items = im.Seq(im.Range(0, es.length))
//                  .map((e, i) => {
//                    return initAsItem(i, es[i], dir_cur);
//                  });


  const items = im.List(im.Range(0, es.length))
                  .map((e, i) => {
                    return initAsItem(i, es[i], dir_cur);
                  });


  return im.Map({
           'dir_cur': dir_cur,
           'reg_pat': '',
           'line_cur': 0,
           'items': items,
           'items_match': items
         });

}


//module.exports = ItemListPane;
