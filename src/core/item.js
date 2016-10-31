'use strict';

import im from 'immutable';

//import ITEM_TYPE_KIND from './item_type';
import {ITEM_TYPE_KIND} from './item_type';

//let ATTR = {
//  FILE  : 0,
//  DIR   : 1,
//};

const ItemRecord = im.Record({
  name: null,
  kind: null,
  ext : null,
  selected: false,
  is_dir: false,
  color: null
});

function getItemTypeKind(ext){
  //switch(ext){
  //  case 'exe'
  //    return ITEM_TYPE_KIND.EXE;
  //  default:
  //    return ITEM_TYPE_KIND.OTHER;
  //}

  const opt = {sensitivity: 'base'};

  if(ext.localeCompare('txt', 'en', opt) == 0){
    return ITEM_TYPE_KIND.TEXT;
  }else if(ext.localeCompare('exe', 'en', opt) == 0){
    return ITEM_TYPE_KIND.EXE;
  }else if( (ext.localeCompare('lib', 'en', opt) == 0) ||
            (ext.localeCompare('dll', 'en', opt) == 0) ||
            (ext.localeCompare('a',   'en', opt) == 0) ||
            (ext.localeCompare('so',  'en', opt) == 0) ){
    return ITEM_TYPE_KIND.BIN;
  }else if( (ext.localeCompare('jpg',  'en', opt) == 0) ||
            (ext.localeCompare('jpeg', 'en', opt) == 0) ||
            (ext.localeCompare('png',  'en', opt) == 0) ||
            (ext.localeCompare('gif',  'en', opt) == 0) ||
            (ext.localeCompare('bmp',  'en', opt) == 0) ){
    return ITEM_TYPE_KIND.IMAGE;
  }else if( (ext.localeCompare('mp4',  'en', opt) == 0) ||
            (ext.localeCompare('avi',  'en', opt) == 0) ||
            (ext.localeCompare('mpeg', 'en', opt) == 0) ){
    return ITEM_TYPE_KIND.MOVIE;
  }else if(ext.localeCompare('mp3', 'en', opt) == 0){
    return ITEM_TYPE_KIND.SOUND;
  }else if( (ext.localeCompare('zip', 'en', opt) == 0) ||
            (ext.localeCompare('rar', 'en', opt) == 0) ){
    return ITEM_TYPE_KIND.ARCHIVE;
  }else{
    return ITEM_TYPE_KIND.OTHER;
  }
}

class Item extends ItemRecord{
  //constructor(){
  //  this._selected = false;
  //  //this.attr = ATTR.FILE;
  //}
  //set name(name){
  //  this._name = name;
  //  //this._name = 'hoge';
  //  this._ext = name.slice(((name.lastIndexOf(".")-1)>>>0)+2);
  //  this._kind = getItemTypeKind(this._ext);
  //  //console.log('name: ' + name + ', ext: ' + this._ext + ', kind: ' + this._kind);
  //}
  //get name(){
  //  return this._name;
  //}
  //get kind(){
  //  return this._kind;
  //}
  //get ext(){
  //  return this._ext;
  //}
  //set selected(selected){
  //  this._selected = selected;
  //}
  //get selected(){
  //  return this._selected;
  //}
  //set is_dir(is_dir){
  //  this._is_dir = is_dir;
  //  if(is_dir){
  //    this._kind = ITEM_TYPE_KIND.DIR;
  //  }
  //}
  //get is_dir(){
  //  return this._is_dir;
  //}
  //set color(color){
  //  this._color = color;
  //}
  //get color(){
  //  return this._color;
  //}

  constructor(props){
    super(props);
  }

  //setName(name){
  //  return this.set('name', name);
  //}
  //getName(){
  //  return this.get('name');
  //}
  //setIsDir(is_dir){
  //  return this.set('is_dir', is_dir);
  //}
  //getIsDir(){
  //  return this.get('is_dir');
  //}
}

module.exports = Item;
