'use strict';

import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import im from 'immutable';
import { updateItemsAsDiskDrive, DISK_DRIVE, BOOKMARK, HISTORY } from './item_list';
import { initAsItem, initAsDiskDrive, initAsBookmark, initAsHistory } from './item';
import { SORT_TYPE } from './item_type';
import { sortItemsInPage } from './item_list';


export const getDirIndex = (dirs, dir_cur) => {
  const ret = dirs.findIndex((dir)=>{
                    return (dir === dir_cur);
                  },
                  null);

  return ret;
}

export const changeDrive = (state, drive_list) => {
  const dirs = state.get('dirs');
  const idx_dir = getDirIndex(dirs, DISK_DRIVE);
  let dirs_new;
  if( idx_dir !== -1 ){
    dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                        .unshift(DISK_DRIVE));
  }else{
    dirs_new = dirs.unshift(DISK_DRIVE);
  }

  //console.log('changeDrive <> drive_list.length: ' + drive_list.length);
  
  const items = im.List(im.Range(0, drive_list.length))
                  .map((e, i) => {
                    return initAsDiskDrive(i, drive_list[i]);
                  });

  const is_matched = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return true;
                        });

  const is_selected = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return false;
                        });

  const id_map = im.List(im.Range(0, items.size));
  const page = im.Map({
                 'items': items,
                 'line_cur': 0,
                 'id_map': id_map,
                 'id_map_nrw': id_map,
                 'is_matched': is_matched,
                 'is_selected': is_selected
               });
  return state.withMutations(s => s.setIn(['pages', DISK_DRIVE], page)
                                   .set('dirs', dirs_new));
}

export const showBookmark = (state) => {
  const dirs = state.get('dirs');
  const idx_dir = getDirIndex(dirs, BOOKMARK);
  let dirs_new;
  if( idx_dir !== -1 ){
    dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                        .unshift(BOOKMARK));
  }else{
    dirs_new = dirs.unshift(BOOKMARK);
  }

  //console.log('changeDrive <> drive_list.length: ' + drive_list.length);

  //const list_bookmark = {
  //  'mydata': fs.realpathSync('C:\\Users\\mydata'),
  //  'tmp': fs.realpathSync('C:\\tmp'),
  //  'git_repo': fs.realpathSync('C:\\git_repo'),
  //  'Go': fs.realpathSync('C:\\Go')
  //}

  const list_bookmark = {
    0: {
      'name': 'mydata',
      'path_body': fs.realpathSync('C:\\Users\\mydata'),
    },
    1: {
      'name': 'tmp',
      'path_body': fs.realpathSync('C:\\tmp'),
    },
    2: {
      'name': 'git_repo',
      'path_body': fs.realpathSync('C:\\git_repo'), 
    },
    3: {
      'name': 'Go',
      'path_body': fs.realpathSync('C:\\Go')
    }
  }

  //console.log('list_bookmark[0]: ', list_bookmark[0]);
  //console.log('list_bookmark.length: ', Object.keys(list_bookmark).length);
  
  const items = im.List(im.Range(0, Object.keys(list_bookmark).length))
                  .map((e, i) => {
                    return initAsBookmark(i, list_bookmark[i]['name'], list_bookmark[i]['path_body']);
                  });

  const is_matched = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return true;
                        });

  const is_selected = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return false;
                        });

  const id_map = im.List(im.Range(0, items.size));

  const page = im.Map({
                 'items': items,
                 'line_cur': 0,
                 'id_map': id_map,
                 'id_map_nrw': id_map,
                 'is_matched': is_matched,
                 'is_selected': is_selected
               });
  return state.withMutations(s => s.setIn(['pages', BOOKMARK], page)
                                   .set('dirs', dirs_new));
}

export const showHistory = (state) => {
  const dirs = state.get('dirs');
  const idx_dir = getDirIndex(dirs, HISTORY);
  let dirs_new;
  if( idx_dir !== -1 ){
    dirs_new = dirs.withMutations(s => s.delete(idx_dir)
                                        .unshift(HISTORY));
  }else{
    dirs_new = dirs.unshift(HISTORY);
  }

  //console.log('changeDrive <> drive_list.length: ' + drive_list.length);

  //console.log('list_bookmark[0]: ', list_bookmark[0]);
  //console.log('list_bookmark.length: ', Object.keys(list_bookmark).length);
  
  const items = im.List(im.Range(0, dirs.size))
                  .map((e, i) => {
                    return initAsHistory(i, dirs.get(i));
                  });

  const is_matched = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return true;
                        });

  const is_selected = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return false;
                        });

  const id_map = im.List(im.Range(0, items.size));
  const page = im.Map({
                 'items': items,
                 'line_cur': 0,
                 'id_map': id_map,
                 'id_map_nrw': id_map,
                 'is_matched': is_matched,
                 'is_selected': is_selected
               });
  return state.withMutations(s => s.setIn(['pages', HISTORY], page)
                                   .set('dirs', dirs_new));
}

/* Need to rename this function. */
export const updatePageCur = (state, _dir_cur, line_cur_zero) => {
  const dir_cur = fs.realpathSync(_dir_cur);
  //console.log('updatePageCur <> dir_cur: ' + dir_cur + ', _dir_cur: ' + _dir_cur);

  if(state === null){
    return _constructNewPage(dir_cur);
  }else{
    const dirs_tmp = state.get('dirs');
    let dirs;

    switch(dirs_tmp.get(0)){
      case dir_cur: /* "dir_cur" is the current directory. */
        return _loadPage(state, dir_cur); /* reload page to reflesh the displayed item lists as the latest one. */

      /* Remove DISK_DRIVE and BOOKMARK from history. */
      case DISK_DRIVE:
      case BOOKMARK:
      case HISTORY:
        dirs = dirs_tmp.delete(0);
        break;
      default:
        dirs = dirs_tmp;
        break;
    }

    const idx_dir = getDirIndex(dirs, dir_cur);
    if( idx_dir !== -1 ){ /* "dir_cur" is not the current directory but already registered in "dirs" */
      return _makeRegisteredPageAsCurrent(state, dirs, idx_dir, line_cur_zero);
    }else{ /* "dir_cur" is not yet registered in "dirs" */
      return _loadPage(state, dir_cur).set('dirs', dirs.unshift(dir_cur));
    }
  }
}

const _constructNewPage = (dir_cur) => {
  const items = _updateItems(dir_cur);
  //console.log('updatePageCur <> items.getIn(1, name) ' + items.getIn([1, 'name']));

  const is_matched = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return true;
                        });

  const is_selected = im.List(im.Range(0, items.size))
                        .map((e, i) => {
                          return false;
                        });

  const id_map = im.List(im.Range(0, items.size));

  const page = im.Map({
                 'items': items,
                 'line_cur': 0,
                 'id_map': id_map,
                 'id_map_nrw': id_map,
                 'is_matched': is_matched,
                 'is_selected': is_selected
               });

  return im.Map({
           'dirs': im.List.of(dir_cur),
           'pages': im.Map({[dir_cur]: page}),
           'item_names': _updateItemNames(items),
           'msg_cmd': '',
           'sort_type': SORT_TYPE.NAME_ASC
         });
}

const _makeRegisteredPageAsCurrent = (state, dirs, idx_dir, line_cur_zero) => {
  const dir_cur = dirs.get(idx_dir);
  const sort_type = state.get("sort_type");

  //{
  //  console.log('----------------------------------------');
  //  dirs.forEach((e) => {
  //    console.log('Before: ' + e);
  //  });
  //  console.log('----------------------------------------');
  //  console.log('idx_dir: ' + idx_dir);
  //}

  const dirs_new = dirs.delete(idx_dir)
                       .unshift(dir_cur);


  //{
  //  console.log('----------------------------------------');
  //  dirs_new.forEach((e) => {
  //    console.log('After: ' + e);
  //  });
  //  console.log('----------------------------------------');
  //}

  const items = state.getIn(['pages', dirs_new.get(0), 'items']);
  const id_map = im.List(im.Range(0, items.size));
  const is_matched = id_map.map((e, i) => {
                              return true;
                            });
  const is_selected = id_map.map((e, i) => {
                              return false;
                            });
  const page = state.getIn(['pages', dirs_new.get(0)])
                    .withMutations((s) => s.set('id_map', id_map)
                                           .set('id_map_nrw', id_map)
                                           .set('is_matched', is_matched)
                                           .set('is_selected', is_selected));

  let page_new;
  if(line_cur_zero === true){
    page_new = sortItemsInPage(page, sort_type).set('line_cur', 0);
  }else{
    page_new = sortItemsInPage(page, sort_type);
  }

  const item_names = _updateItemNames(items);
  return state.withMutations(s => s.set('dirs', dirs_new)
                                   .setIn(['pages', dir_cur], page_new)
                                   .set('item_names', item_names)
                                   .set('msg_cmd', ''));

}

export const changeDirUpper = (state) => {
  const dir_cur = state.getIn(['dirs', 0]); 
  const name = path.basename(dir_cur);
  const dir_new = path.parse(dir_cur).dir; 

  switch(dir_cur){
    case DISK_DRIVE:
    case BOOKMARK:
    case HISTORY:
    case dir_new: /* If 'dir_cur' is the root directory, do not change the current directory. */
      return state;
    default:
      /* Do Nothing.. */
      break;
  }

  //console.log('dir_new: ' + dir_new);
  //console.log('name: ' + name);

  const state_new = updatePageCur(state, dir_new, false);
  return _moveLineByName(state_new, name);
}

const _moveLineByName = (state, name) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const items = page.get('items');
  const line_cur = page.get('id_map_nrw').findKey(
                     (e) => {
                       return items.getIn([e, 'name']) === name;
                     }
                   );
  //console.log('line_cur: ' + line_cur);

  return state.setIn(['pages', dir, 'line_cur'], line_cur);
}

export const changeDirLower = (state) => {
  //if(state.get('pages').size <= 0){
  //  return state;
  //}

  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const line_cur = page.get('line_cur');
  const id_map_nrw = page.get('id_map_nrw');
  const item_name = page.getIn(['items', id_map_nrw.get(line_cur), 'name']);

  //console.log('item_name: ' + item_name);
  if(typeof item_name === 'undefined'){
    return state;
  }

  let dir_new;
  switch(dir){
    case DISK_DRIVE:
      dir_new = item_name;
      break;
    case BOOKMARK:
      dir_new = page.getIn(['items', id_map_nrw.get(line_cur), 'path_body']);
      break;
    case HISTORY:
      dir_new = page.getIn(['items', id_map_nrw.get(line_cur), 'name']);
      //console.log('line_cur: ' + line_cur + ', dir_new: ' + dir_new);
      break;
    default:
      dir_new = path.join(dir, item_name);
      break;
  }

  const ret = ipcRenderer.sendSync('fs.isDirectory', dir_new)
  if(ret['is_dir']){
    return updatePageCur(state, dir_new, false);
  }else{
    return state;
  }
}

const _updateItems = (dir_cur) => {
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

  return items;
}

const _updateItemNames = (items) => {
  let array = [];
  //console.log('items: ' + items.get(3));
  for(let i=0; i<items.size; i++){
    array.push(items.getIn([i, 'name']));
    //console.log('array[' + i + ']: ' + array[i]);
  }
  return array;
}

const _loadPage = (state, dir_cur) => {
  const sort_type = state.get("sort_type");
  const items = _updateItems(dir_cur);
  const id_map = im.List(im.Range(0, items.size));
  const is_matched = id_map.map((e, i) => {
                               return true;
                             });
  const is_selected = id_map.map((e, i) => {
                               return false;
                             });

  const page = sortItemsInPage( im.Map({
                                'items': items,
                                'line_cur': 0,
                                'id_map': id_map,
                                'id_map_nrw': id_map,
                                'is_matched': is_matched,
                                'is_selected': is_selected}),
                                sort_type );
          
  //page.get('id_map').forEach((e, i) => {
  //  console.log('_loadPage <> i: ' + i + ', e: ' + e);
  //});

  const item_names = _updateItemNames(items);

  return state.withMutations(s => s.setIn(['pages', dir_cur], page)
                                   .set('item_names', item_names)
                                   .set('msg_cmd', ''));
}
