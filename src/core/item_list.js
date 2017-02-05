'use strict';

import electron, { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import util from 'util';

import im from 'immutable';
import Item from './item';
import {ITEM_TYPE_KIND} from './item_type';

const ItemListPaneRecord = im.Record({
  dir_cur: null,
  items_selected: {},
  reg_pat: '',
  line_cur: 0,
  items: null,
  items_match: null
});

class ItemListPane extends ItemListPaneRecord{
  constructor(props){
    super(props);
  }

  updateItemsAsDiskDrive(drive_list){
    const items = im.Seq(im.Range(0, drive_list.length))
                    .map((e, i) => {
                      return new Item({id: i, name: drive_list[i]}).initAsDiskDrive(false);
                    });

    const ret = this.withMutations(s => s.set('items', items)
                                         .set('items_match', items));

    return ret;
  }

  updateItems(){
    let dir_cur = this.get('dir_cur')
    //let es = ipcRenderer.sendSync('fs.readdirSync', dir_cur);
    let es = ['..'];
    let es_tail = ipcRenderer.sendSync('fs.readdirSync', dir_cur);
    Array.prototype.push.apply(es, es_tail);

    /* If file access of fs.readdirSync is denied, es == null */
    if(es == null){
      console.log('ERROR <> es is null!!');
      return null;
    }

    const items = im.Seq(im.Range(0, es.length))
                    .map((e, i) => {
                      return new Item({name: es[i]}, {id: i}).initAsItem(dir_cur);
                    });

    const ret = this.withMutations(s => s.set('items', items)
                                         .set('items_match', items));

    return ret;
  }
  
}

module.exports = ItemListPane;
