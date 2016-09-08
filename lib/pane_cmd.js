'use static';


class PaneCmd{
  constructor(id){
    this._id = id;
  }

  updatePane(){
    let e = document.getElementById(this._id);
    console.log('height: ' + e.clientHeight);
    //e.style.cssText += 'min-height: 20;';
    e.innerHTML = "HOGEEEEEEEEEE!!";
  }
}

module.exports = PaneCmd;
