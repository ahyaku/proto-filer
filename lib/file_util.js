'use strict';

let fs = require('fs');
let path = require('path');

let fileUtil = {
  getItems: function(dir, cb){
    fs.readdir(dir, function(err, items) {
      //items.forEach(function(c){
      //  console.log(c);
      //})
      if(err){
        cb(err, null);
        return;
      }
      cb(null, items);
    });
  },

  getItemsSync: function(dir){
    return fs.readdirSync(dir);
  }
}

module.exports = fileUtil;
