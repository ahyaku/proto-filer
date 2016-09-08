'use static';


class PaneCmd{
  constructor(id){
    this._id = id;
  }

  updatePane(){
    let e = document.getElementById(this._id);
    //console.log('height: ' + e.clientHeight);
    //e.style.cssText += 'min-height: 20;';
    //e.setAttribute('style', 'flex-wrap: nowrap; white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis;');
    e.innerHTML = "HOGEEEEEEEEEE!!";
  }
}

module.exports = PaneCmd;
