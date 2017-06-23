'use strict';

process.env.NODE_ENV = 'production';

import { remote, ipcRenderer } from 'electron';
import { SORT_TYPE } from '../../util/item_type';

let procYes;
let procNo;

const init = () => {
  let e = document.getElementById('window');
  e.addEventListener('keydown', onKeyDown);

  console.log('sort!!');
  procYes = function(){
    closeMainWindow();
  };
  procNo = closePopup;
  showMsgSort();
}


const showMsgSort = () => {

  const node_id = document.getElementById('msg_body');
  node_id.innerHTML = '<div>        \
                         (n)ame<br> \
                         (t)ime<br> \
                         (e)xt<br>  \
                         (s)ize<br> \
                         (N)ame<br> \
                         (T)ime<br> \
                         (E)xt<br>  \
                         (S)ize<br> \
                      </div>';

}

const onKeyDown = (e) => {
  console.log('sort <> key: ' + e);
  console.log('sort <> key_code: ' + e.keyCode);

  checkKeySort(e);
}

const checkKeySort = (e) => {
  switch(e.key){
    case 'y': /* 'y' */
      console.log('y');
      break;
    case 'n': /* 'n' */
      console.log('n');
      //sortItems('name_asc');
      sortItems(SORT_TYPE.NAME_ASC);
      break;
    case 'N': /* 'N' */
      console.log('N');
      //sortItems('name_des');
      sortItems(SORT_TYPE.NAME_DES);
      //procNo();
      break;
    case '[': /* 'n' */
      if(event.ctrlKey === true){
        procNo();
      }
      break;
    default:
      break;
  }
}

const closePopup = () => {
  ipcRenderer.sendSync('closePopup', 'sort');
}

const sortItems = (type) => {
  console.log('sortItems Start!!');
  ipcRenderer.sendSync('sortItems', type);
}

init();
