'use strict';

export const ITEM_TYPE_KIND = {
  DIR      : 0,
  DRIVE    : 1,
  TEXT     : 2,
  EXE      : 3,
  BIN      : 4,
  IMAGE    : 5,
  MOVIE    : 6,
  SOUND    : 7,
  ARCHIVE  : 8,
  OTHER    : 9
};

//export const ITEM_LIST_MODE = {
//  ITEM     : 0,
//  DRIVE    : 1,
//  BOOKMARK : 2,
//  HISTORY  : 3
//}

export const KEY_INPUT_MODE = {
  NORMAL        : 0,
  SEARCH        : 1,
  POPUP_SORT    : 2,
  POPUP_RENAME  : 3,
  POPUP_CREATE  : 4
};

export const SORT_TYPE = {
  NAME_ASC : 0,
  EXT_ASC  : 1,
  SIZE_ASC : 2,
  TIME_ASC : 3,
  NAME_DES : 4,
  EXT_DES  : 5,
  SIZE_DES : 6,
  TIME_DES : 7,
  CANCEL   : 8
};

//export default ITEM_TYPE_KIND;
