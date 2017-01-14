'use strict';

import path from 'path';
import im from 'immutable';

import { ITEM_TYPE_KIND } from './item_type';
import { ipcRenderer } from 'electron'

const ItemRecord = im.Record({
  id: null,
  name: null,
  basename: null,
  ext : null,
  kind: null,
  fsize: '???',
  date: '???',
  time: '???',
  selected: false,
  color: null,
});

class Item extends ItemRecord{

  constructor(props){
    super(props);
  }

  initAsItem(dir_cur){
    const fpath = path.join(dir_cur, this.get('name'));
    const ret = ipcRenderer.sendSync('fs.isDirectory', fpath);

    let fsize, basename, ext, kind;
    let name = this.get('name');

    if(ret['err'] === 0){
      if(ret['is_dir'] === true){
        fsize = 'DIR';
        basename = name;
        ext = '';
        kind = ITEM_TYPE_KIND.DIR;
      }else{
        fsize = ret['fsize'];
        ext = path.extname(name);
        basename = path.basename(name, ext);
        kind = getItemTypeKind(ext);
      }
      const date = ret['mtime'].slice(2, 10);
      const time = ret['mtime'].slice(11, 19);
      return this.withMutations(s => s.set('fsize', fsize)
                                      .set('date', date)
                                      .set('time', time)
                                      .set('basename', basename)
                                      .set('ext', ext)
                                      .set('kind', kind));
    }else{
      ext = path.extname(name);
      basename = path.basename(name, ext);
      kind = getItemTypeKind(ext);
      return this.withMutations(s => s.set('basename', basename)
                                      .set('ext', ext)
                                      .set('kind', kind));
    }

  }

  initAsDiskDrive(dir_cur){
    const name = this.get('name');
    const fsize = 'DRIVE';
    const basename = name;
    const kind = ITEM_TYPE_KIND.DRIVE;
    return this.withMutations(s => s.set('fsize', fsize)
                                    .set('date', '')
                                    .set('time', '')
                                    .set('basename', basename)
                                    .set('ext', '')
                                    .set('kind', kind));

  }

}

function getItemTypeKind(ext){
  const opt = {sensitivity: 'base'};

  if(ext.localeCompare('.txt', 'en', opt) == 0){
    return ITEM_TYPE_KIND.TEXT;
  }else if(ext.localeCompare('.exe', 'en', opt) == 0){
    return ITEM_TYPE_KIND.EXE;
  }else if( (ext.localeCompare('.lib', 'en', opt) == 0) ||
            (ext.localeCompare('.dll', 'en', opt) == 0) ||
            (ext.localeCompare('.a',   'en', opt) == 0) ||
            (ext.localeCompare('.so',  'en', opt) == 0) ){
    return ITEM_TYPE_KIND.BIN;
  }else if( (ext.localeCompare('.jpg',  'en', opt) == 0) ||
            (ext.localeCompare('.jpeg', 'en', opt) == 0) ||
            (ext.localeCompare('.png',  'en', opt) == 0) ||
            (ext.localeCompare('.gif',  'en', opt) == 0) ||
            (ext.localeCompare('.bmp',  'en', opt) == 0) ){
    return ITEM_TYPE_KIND.IMAGE;
  }else if( (ext.localeCompare('.mp4',  'en', opt) == 0) ||
            (ext.localeCompare('.avi',  'en', opt) == 0) ||
            (ext.localeCompare('.mpeg', 'en', opt) == 0) ){
    return ITEM_TYPE_KIND.MOVIE;
  }else if(ext.localeCompare('.mp3', 'en', opt) == 0){
    return ITEM_TYPE_KIND.SOUND;
  }else if( (ext.localeCompare('.zip', 'en', opt) == 0) ||
            (ext.localeCompare('.rar', 'en', opt) == 0) ){
    return ITEM_TYPE_KIND.ARCHIVE;
  }else{
    return ITEM_TYPE_KIND.OTHER;
  }
}

module.exports = Item;
