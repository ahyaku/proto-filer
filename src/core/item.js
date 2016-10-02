'use strict';

//let ATTR = {
//  FILE  : 0,
//  DIR   : 1,
//};

class Item{
  constructor(){
    this._selected = false;
    //this.attr = ATTR.FILE;
  }
  set name(name){
    this._name = name;
  }
  get name(){
    return this._name;
  }
  set selected(selected){
    this._selected = selected;
  }
  get selected(){
    return this._selected;
  }
//  set attr(attr){
//    this._attr = attr;
//  }
//  get attr(){
//    return this._attr;
//  }
  set is_dir(is_dir){
    this._is_dir = is_dir;
  }
  get is_dir(){
    return this._is_dir;
  }
  set color(color){
    this._color = color;
  }
  get color(){
    return this._color;
  }
}

module.exports = Item;
