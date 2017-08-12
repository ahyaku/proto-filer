'use strict';

import electron, { ipcRenderer } from 'electron';
import fs from 'fs';
import util from 'util';
import im from 'immutable';
import { initAsItem, initAsDiskDrive } from './item';
import { ITEM_TYPE_KIND, SORT_TYPE } from './item_type';

export const DISK_DRIVE = 'Disk Drives';
export const BOOKMARK = 'Bookmark';

//export function updateItemsAsDiskDrive(drive_list){
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


/* ORG */
//export const sortItems = (state, sort_type) => {
//  const dir = state.getIn(['dirs', 0]);
//  const page = state.getIn(['pages', dir]);
//  const id_map = page.get('id_map');
//  const items = page.get('items');
//  let id_map_new;
//
//  //console.log('Before <> id_map: ' + id_map);
//  switch(sort_type){
//    //case 'name_asc':
//    case SORT_TYPE.NAME_ASC:
//      //id_map_new = sortByName(items, id_map, true);
//      id_map_new = sort(items, id_map, filterName, true);
//      break;
//    //case 'name_des':
//    case SORT_TYPE.NAME_DES:
//      //id_map_new = sortByName(items, id_map, false);
//      id_map_new = sort(items, id_map, filterName, false);
//      break;
//    case SORT_TYPE.TIME_ASC:
//      //id_map_new = sortByName(items, id_map, true);
//      id_map_new = sort(items, id_map, filterTime, true);
//      break;
//    //case 'name_des':
//    case SORT_TYPE.TIME_DES:
//      //id_map_new = sortByName(items, id_map, false);
//      id_map_new = sort(items, id_map, filterTime, false);
//      break;
//    case SORT_TYPE.EXT_ASC:
//      //id_map_new = sortByName(items, id_map, true);
//      id_map_new = sort(items, id_map, filterExt, true);
//      break;
//    //case 'name_des':
//    case SORT_TYPE.EXT_DES:
//      //id_map_new = sortByName(items, id_map, false);
//      id_map_new = sort(items, id_map, filterExt, false);
//      break;
//    case SORT_TYPE.SIZE_ASC:
//      //id_map_new = sortByName(items, id_map, true);
//      id_map_new = sort(items, id_map, filterSize, true);
//      break;
//    //case 'name_des':
//    case SORT_TYPE.SIZE_DES:
//      //id_map_new = sortByName(items, id_map, false);
//      id_map_new = sort(items, id_map, filterSize, false);
//      break;
//    case SORT_TYPE.CANCEL:
//      id_map_new = id_map;
//      break;
//    default:
//      /* Do Nothing.. */
//      console.log('Sort Error!!');
//      break;
//  }
//  //console.log('After <> id_map: ' + id_map_new);
//
//  //console.log('sortItemList() <> id_map: ' + id_map);
//
//  return state.setIn(['pages', dir, 'id_map'], id_map_new);
//}

export const sortItems = (state, sort_type) => {
  const dir = state.getIn(['dirs', 0]);
  const page = state.getIn(['pages', dir]);
  const id_map = page.get('id_map');
  const items = page.get('items');

  //return state.setIn(['pages', dir, 'id_map'], sortItemsCore(id_map, items, sort_type));

  return state.withMutations(s => s.setIn(['pages', dir, 'id_map'], sortItemsCore(id_map, items, sort_type))
                                   .set('sort_type', sort_type));
}

export const sortItemsCore = (id_map, items, sort_type) => {
  //console.log('Before <> id_map: ' + id_map);
  switch(sort_type){
    case SORT_TYPE.NAME_ASC:
      return sort(items, id_map, filterName, true);
    case SORT_TYPE.NAME_DES:
      return sort(items, id_map, filterName, false);
    case SORT_TYPE.TIME_ASC:
      return sort(items, id_map, filterTime, true);
    case SORT_TYPE.TIME_DES:
      return sort(items, id_map, filterTime, false);
    case SORT_TYPE.EXT_ASC:
      return sort(items, id_map, filterExt, true);
    case SORT_TYPE.EXT_DES:
      return sort(items, id_map, filterExt, false);
    case SORT_TYPE.SIZE_ASC:
      return sort(items, id_map, filterSize, true);
    case SORT_TYPE.SIZE_DES:
      return sort(items, id_map, filterSize, false);
    case SORT_TYPE.CANCEL:
      return id_map;
    default:
      /* Do Nothing.. */
      console.log('Sort Error!!');
      return null;
  }
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

  //const id_map_sorted = id_map_sort.sort(
  //  (a, b) => {
  //    return coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']));
  //  });

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
      //return coef * items.getIn([a, 'ext']).localeCompare(items.getIn([b, 'ext']));
      const ret_size = coef * items.getIn([a, 'ext']).localeCompare(items.getIn([b, 'ext']));
      const ret = ret_size === 0
                  ? coef * items.getIn([a, 'basename']).localeCompare(items.getIn([b, 'basename']))
                  : ret_size;
      return ret;
    });
}

