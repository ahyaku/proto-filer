'use strict';

import electron, { ipcRenderer } from 'electron';
import fs from 'fs';
import util from 'util';
import im from 'immutable';
import { initAsItem, initAsDiskDrive } from './item';
import { ITEM_TYPE_KIND, SORT_TYPE } from './item_type';

export const DISK_DRIVE = 'Disk Drives';
export const BOOKMARK = 'Bookmark';
export const HISTORY = 'History';

export const updateItemsAsDiskDrive = (drive_list) => {
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

//export function updateItems(dir_cur){
export const updateItems = (dir_cur) => {
  let es = ['..'];
  let es_tail = ipcRenderer.sendSync('fs.readdirSync', dir_cur);
  Array.prototype.push.apply(es, es_tail);

  /* If file access of fs.readdirSync is denied, es == null */
  if(es == null){
    console.log('ERROR <> es is null!!');
    return null;
  }

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

export const sortItemsInState = (state, sort_type) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  
  return state.withMutations(s => s.setIn(['pages', dir], sortItemsInPage(page, sort_type))
                                   .set('sort_type', sort_type));
}

export const sortItemsInPage = (page, sort_type) => {
  //console.log('Before <> id_map: ' + id_map);

  const id_map = page.get('id_map');
  const items = page.get('items');
  const line_cur = page.get('line_cur');
  const id_cursor = page.getIn(['id_map', line_cur]);
  
  let id_map_sorted;

  switch(sort_type){
    case SORT_TYPE.NAME_ASC:
      id_map_sorted = sort(items, id_map, filterName, true);
      break;
    case SORT_TYPE.NAME_DES:
      id_map_sorted = sort(items, id_map, filterName, false);
      break;
    case SORT_TYPE.TIME_ASC:
      id_map_sorted = sort(items, id_map, filterTime, true);
      break;
    case SORT_TYPE.TIME_DES:
      id_map_sorted = sort(items, id_map, filterTime, false);
      break;
    case SORT_TYPE.EXT_ASC:
      id_map_sorted = sort(items, id_map, filterExt, true);
      break;
    case SORT_TYPE.EXT_DES:
      id_map_sorted = sort(items, id_map, filterExt, false);
      break;
    case SORT_TYPE.SIZE_ASC:
      id_map_sorted = sort(items, id_map, filterSize, true);
      break;
    case SORT_TYPE.SIZE_DES:
      id_map_sorted = sort(items, id_map, filterSize, false);
      break;
    case SORT_TYPE.CANCEL:
      id_map_sorted = id_map;
      break;
    default:
      /* Do Nothing.. */
      console.log('Sort Error!!');
      break;
  }

  //const line_new = id_map_sorted.findKey((e) => {
  //                   return e === id_cursor;
  //                 });

  //for(let i=0; i<id_map.size; i++){
  //  console.log('i: ' + i + ', id_map: ' + id_map.get(i) + ', id_map_sorted: ' + id_map_sorted.get(i) + ', name: ' + items.getIn([id_map_sorted.get(i), 'name']));
  //}

  const line_new = id_map_sorted.findKey((e, i) => {
                     const ret = e === id_cursor;
                     //console.log('i: ' + i + ', e: ' + e);
                     return ret;
                   });

  return page.withMutations(s => s.set('id_map', id_map_sorted)
                                  .set('line_cur', line_new));
}

const sort = (items, id_map, filter, is_asc) => {
  const id_head = id_map.get(0);
  const id_tail = id_map.get(id_map.size - 1);

  const coef = is_asc === true
               ? 1
               : -1;

  let id_parent;
  let id_map_sort;

  /* Parent Directory '..' always must be the head or tail of the item list. */
  if( items.getIn([id_head, 'basename']) === '..'){
    id_map_sort = id_map.slice(1, id_map.size);
    id_parent = id_head;
  }else if( items.getIn([id_tail, 'basename']) === '..' ){
    id_map_sort = id_map.slice(0, id_map.size - 1);
    id_parent = id_tail;
  }else{
    id_map_sort = id_map;
    id_parent = -1;
  }

  const id_map_sorted = filter(items, id_map_sort, coef);

  if(id_parent === -1){
    return id_map_sorted;
  }else{
    if(is_asc === true){
      return id_map_sorted.unshift(id_parent);
    }else if(is_asc === false){
      return id_map_sorted.push(id_parent);
    }else{
      console.log('Sort Error!!');
    }
  }
}

const filterName = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      return coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']));
    });
}

const filterTime = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      const ret_date = coef * items.getIn([a, 'date']).localeCompare(items.getIn([b, 'date']));
      const ret_time = ret_date === 0
                         ? coef * items.getIn([a, 'time']).localeCompare(items.getIn([b, 'time']))
                         : ret_date;
      const ret = ret_time === 0
                    ? coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
                    : ret_time;
      return ret;
    });
}

const filterSize = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      const sa = items.getIn([a, 'fsize'])
      const sb = items.getIn([b, 'fsize'])

      if( (typeof sa === 'string') && (typeof sb === 'string') ){
        if( ( (sa === 'DIR') && (sb === 'DIR') ) ||
            ( (sa === '???') && (sb === '???') ) ){
          return coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
        }else if( sa === 'DIR' ){
          return -coef;
        }else if( sb === 'DIR' ){
          return coef;
        }else{
          console.log('filterSize Error!!');
        }
      }else if( typeof sa === 'string' ){
        return -coef;
      }else if( typeof sb === 'string' ){
        return coef;
      }else{
        return sa === sb
                  ? coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
                  : sa < sb
                       ? -coef
                       : coef
      }
    });
}

const filterExt = (items, id_map, coef) => {
  return id_map.sort(
    (a, b) => {
      const ret_size = coef * items.getIn([a, 'ext']).localeCompare(items.getIn([b, 'ext']));
      const ret = ret_size === 0
                  ? coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
                  : ret_size;
      return ret;
    });
}

