'use strict';

process.env.NODE_ENV = 'production';

import { ipcRenderer } from 'electron';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { render } from 'react-dom';
//import path from 'path';

import { SORT_TYPE } from '../../util/item_type';
import { RES } from '../../../res/res';

//const init = () => {
//  let e = document.getElementById('window');
//  e.addEventListener('keydown', onKeyDown);
//
//  console.log('rename!!');
//  showMsgSort();
//}
//
//
//const showMsgSort = () => {
//
//  const node_id = document.getElementById('root');
//  node_id.innerHTML = '<div>        \
//                         hoge<br>   \
//                         (n)ame<br> \
//                         (t)ime<br> \
//                         (e)xt<br>  \
//                         (s)ize<br> \
//                         (N)ame<br> \
//                         (T)ime<br> \
//                         (E)xt<br>  \
//                         (S)ize<br> \
//                      </div>';
//
//}
//
//const onKeyDown = (e) => {
//  console.log('sort <> key: ' + e);
//  console.log('sort <> key_code: ' + e.keyCode);
//
//  checkKeySort(e);
//}

const closePopup = () => {
  ipcRenderer.sendSync('closePopup', 'rename');
}

const reqRenameItem = (item_name_dst, item_name_src, dir_cur, id_target) => {
  //console.log('renameItem Start!!');
  ipcRenderer.sendSync('reqRenameItem', {item_name_dst, item_name_src, dir_cur, id_target});
  //const name_dst = path.join(dir_cur, item_name);
  //ipcRenderer.sendSync('reqRenameItem', name_dst);
};


const state_init = {
  item_name_src: '',
  item_name_dst: '',
  dir_cur: '',
  id_target: null
};

const reducer = (state, action) => {
  //console.log('action.type: ' + action.type);
  switch(action.type){
    case 'REQ_RENAME_ITEM':
      reqRenameItem(state.item_name_dst, state.item_name_src, state.dir_cur, state.id_target);
      closePopup();
      return state;
    case 'CLOSE_POPUP':
      closePopup();
      return state;
    case 'INIT_ITEM_NAME_CUR':
      return Object.assign({},
                           state,
                           {
                             item_name_src: action.item_name_src,
                             item_name_dst: action.item_name_dst,
                             dir_cur: action.dir_cur,
                             id_target: action.id_target
                           });
    case 'UPDATE_ITEM_NAME':
      return Object.assign({},
                           state,
                           {
                             item_name_dst: action.item_name_dst
                           });
    default:
      return state;
  }
}

const store = createStore(reducer, state_init, applyMiddleware(thunk));

const ListenKeydown = (mapEventToAction) => {

  return (dispatch, getState) => {

    const handleEvent = (e) => {
      dispatch(mapEventToAction(getState, e));
    } /* handleEvent */

    document.addEventListener('keydown', handleEvent);
    return () => document.removeEventListener('keydown', handleEvent);

  };

}

const checkKey = (state, e) => (dispatch) => {
  //return dispatch(
  //  {
  //    type: 'DO_NOTHING',
  //  });

  if(event.ctrlKey == true){
    return dispatch(_checkKeyWithCtrl(state, e));
  }else{
    return dispatch(_checkKey(state, e));
  }
}

const _checkKeyWithCtrl = (state, e) => (dispatch) => {

  switch(e.key){
    case 'm':
      event.preventDefault();
      return dispatch(
        {
          type: 'REQ_RENAME_ITEM',
          c: ''
        }
      );
    case '[':
      return dispatch({
        type: 'CLOSE_POPUP'
      });
    case 'h':
      return dispatch(receiveInputBS(state));
    case 'u':
      return dispatch(clearInput(state));
    case 'Control':
    default:
      return dispatch({
        type: 'DO_NOTHING'
      });
      //return dispatch(receiveInput(state, ''));
  }
}


const _checkKey = (state, e) => (dispatch) => {
  switch(e.key){
    case 'Escape':
      return dispatch({
        type: 'CLOSE_POPUP'
      });
    case 'Enter':
      return dispatch(
        {
          type: 'REQ_RENAME_ITEM',
          c: ''
        }
      );
    case 'Backspace':
    default:
      return dispatch({
        type: 'DO_NOTHING'
      });
  }
}

const receiveInput = (state, c) => (dispatch) => {
  //console.log('receiveinput()!!');
  return dispatch(updateItemName(state.item_name_dst + c));
}

const receiveInputBS = (state) => (dispatch) => {
  const item_name_dst = state.item_name_dst;
  return dispatch(updateItemName(item_name_dst.slice(0, item_name_dst.length - 1)));
}

const clearInput = (state) => (dispatch) => {
  return dispatch(updateItemName(''));
}

const updateItemName = (item_name_dst) => {
  //console.log('updateItemName() <> item_name_dst: ' + item_name_dst);
  return {
    type: 'UPDATE_ITEM_NAME',
    item_name_dst: item_name_dst
  }
}

const mapKeydownToAction = (getState, e) => {
  //console.log('mapKeydownToAction <> e.key: ' + e.key);
  return (dispatch) => {
    const state = getState();
    dispatch( checkKey(state, e) );
  }
}

const unlistenKeydown = store.dispatch(ListenKeydown(mapKeydownToAction));




class NameFormCore extends React.Component {
  constructor(props) {
    super(props);

    const style = {
      //minHeight: '20px',
      //height: '20px',
      borderTop: '1px solid #FFFFFF',
      borderLeft: '1px solid #FFFFFF',
      borderBottom: '1px solid #FFFFFF',
      //margin: '0px, 0px 0px',
      //padding: '0px, 0px 0px',
      minHeight: RES.CMD.HEIGHT + 'px',
      maxHeight: RES.CMD.HEIGHT + 'px',
      //minHeight: '16px',
      //maxHeight: '16px',
      //overflowX: 'hidden',
      //overflowY: 'hidden'

      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      fontSize: '14px'
    };

    this.state = {item_name: 'hogera'};

    this.onFormChange = this.onFormChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.cbRenameItem = this.cbRenameItem.bind(this);
  }

  render() {
    //console.log('render() <> item_name_dst: ' + this.props.item_name_dst);
    return (
      <div>
        <div>
          New Name:
        </div>
        <form /* onSubmit={this.handleSubmit} */ >
          <label>
            <input type="text" value={this.props.item_name_dst} onChange={this.onFormChange} />
          </label>
        </form>
      </div>
    );
  }


  componentDidMount(){
    //console.log('componentDidMount()!!');
    ipcRenderer.on('openPopUpRename', this.cbRenameItem);
  }

  componentWillUnmount(){
    //console.log('componentWillUnmount()!!');
    ipcRenderer.removeListener('openPopUpRename', this.cbRenameItem);
  }

  onFormChange(event){
    //console.log('onFormChange() <> event.target: ', event.target);
    this.props.updateItemName(event.target.value);
  }

  //handleSubmit(event){
  //  //alert('A name was submitted: ' + this.state.item_name);
  //  alert('A name was submitted: ' + this.props.item_name_dst);
  //  event.preventDefault();
  //}

  cbRenameItem(event, {item_name_init, dir_cur, id_target}){
    //console.log('cbRenameItem() <> item_name_init: ' + item_name_init + ', dir_cur: ' + dir_cur);
    this.props.initItemNameCur(item_name_init, dir_cur, id_target);
  }

}

const mapStateToProps = (state, props) => {
  //console.log('mapStateToProps <> state.item_name_dst: ', state.item_name_dst);
  return {item_name_dst: state.item_name_dst};
}

const mapDispatchToProps = (dispatch, props) => ({
  initItemNameCur: (item_name_init, dir_cur, id_target) => {
    dispatch({
      type: 'INIT_ITEM_NAME_CUR',
      item_name_src: item_name_init,
      item_name_dst: item_name_init,
      dir_cur: dir_cur,
      id_target: id_target
    });
  },
  updateItemName: (item_name_dst) => {
    //console.log('updateItemName() <> item_name_dst: ' + item_name_dst);
    dispatch({
      type: 'UPDATE_ITEM_NAME',
      item_name_dst: item_name_dst
    });
  }
});

//const mapStateToProps = (state, props) => {
//  const id = props.id;
//  const dir_cur = state.getIn(['arr_pages', id, 'dir_cur']);
//  const active_pane_id = state.get('active_pane_id');
//  return {dir_cur, active_pane_id, props};
//}

const NameForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(NameFormCore);


render(
  <Provider store={store}>
    <NameForm />
  </Provider>,
  document.getElementById('root')
);
