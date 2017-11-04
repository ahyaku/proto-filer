'use strict';

process.env.NODE_ENV = 'production';

import { ipcRenderer } from 'electron';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { render } from 'react-dom';
//import path from 'path';

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
  ipcRenderer.sendSync('closePopup', 'create');
}

const reqCreateItem = (mode, item_name, dir_cur, id_target) => {
  //console.log('renameItem Start!!');
  ipcRenderer.sendSync('reqCreateItem', {mode, item_name, dir_cur, id_target});
  //const name_dst = path.join(dir_cur, item_name);
  //ipcRenderer.sendSync('reqCreateItem', name_dst);
};


const state_init = {
  mode: '',
  item_name: '',
  dir_cur: '',
  id_target: null
};

const reducer = (state, action) => {
  //console.log('reducer() <> action.type: ' + action.type);
  switch(action.type){
    case 'REQ_CREATE_ITEM':
      reqCreateItem(state.mode, state.item_name, state.dir_cur, state.id_target);
      closePopup();
      return state;
    case 'CLOSE_POPUP':
      closePopup();
      return state;
    //case 'INIT_ITEM_NAME_CUR':
    //  return Object.assign({},
    //                       state,
    //                       {
    //                         item_name_src: action.item_name_src,
    //                         item_name_dst: action.item_name_dst,
    //                         dir_cur: action.dir_cur,
    //                         id_target: action.id_target
    //                       });
    case 'INIT_STATE':
      //console.log('reducer() <> INIT_STATE');
      return Object.assign(
               {},
               state,
               {
                 mode: action.mode,
                 item_name: '',
                 dir_cur: action.dir_cur,
                 id_target: action.id_target
               }
             );
    case 'UPDATE_ITEM_NAME':
      return Object.assign(
               {},
               state,
               {
                 item_name: action.item_name
               }
             );
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
          type: 'REQ_CREATE_ITEM',
          c: ''
        }
      );
    case '[':
      return dispatch({
        type: 'CLOSE_POPUP'
        //type: 'WILL_CLOSE_POPUP'
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
  }
}


const _checkKey = (state, e) => (dispatch) => {
  switch(e.key){
    case 'Escape':
      return dispatch({
        type: 'CLOSE_POPUP'
        //type: 'WILL_CLOSE_POPUP'
      });
    case 'Enter':
      return dispatch(
        {
          type: 'REQ_CREATE_ITEM',
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

const receiveInputBS = (state) => (dispatch) => {
  const item_name = state.item_name;
  return dispatch(updateItemName(item_name.slice(0, item_name.length - 1)));
}

const clearInput = (state) => (dispatch) => {
  return dispatch(updateItemName(''));
}

const updateItemName = (item_name) => {
  //console.log('updateItemName() <> item_name: ' + item_name);
  return {
    type: 'UPDATE_ITEM_NAME',
    item_name: item_name
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

    this.state = {msg: ''};

    this.onFormChange = this.onFormChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.cbOpenPopUpCreate = this.cbOpenPopUpCreate.bind(this);
  }

  render() {
    //console.log('render() <> this.state.msg: ' + this.state.msg);
    return (
      <div>
        <div>
          {this.state.msg}
        </div>
        <form ref='form' /* onSubmit={this.handleSubmit} */ >
          <label>
            <input type="text" value={this.props.item_name_dst} onChange={this.onFormChange} autoFocus={focus} ref='input' />
          </label>
        </form>
      </div>
    );
  }


  componentDidMount(){
    //console.log('componentDidMount()!!');
    ipcRenderer.on('openPopUpCreate', this.cbOpenPopUpCreate);
  }

  componentWillUnmount(){
    //console.log('componentWillUnmount()!!');
    ipcRenderer.removeListener('openPopUpCreate', this.cbOpenPopUpCreate);
  }

  //componentWillReceiveProps(nextProps){
  //  console.log('componentWillReceiveProps() <> action_type: ' + nextProps.action_type);
  //  switch(nextProps.action_type){
  //    case 'WILL_CLOSE_POPUP':
  //      this.setState({msg: ''});
  //      this.refs.form.reset();
  //      break;
  //    default:
  //      /* Do Nothing.. */
  //      break;
  //  }
  //}

  //shouldComponentUpdate(nextProps, nextState){
  //  console.log('shouldComponentUpdate() <> action_type: ' + nextProps.action_type);
  //  switch(nextProps.action_type){
  //    //case 'CLOSE_POPUP'
  //    case 'WILL_CLOSE_POPUP':
  //      return true;
  //    default:
  //      return false;
  //  }
  //}

  //componentDidUpdate(prevProps, prevState){
  //  console.log('componentDidUpdate() <> action_type: ' + prevProps.action_type);
  //}

  /* MDF */
  onFormChange(event){
    //console.log('onFormChange() <> event.target: ', event.target);
    switch(this.props.action_type){
      ////case 'CLOSE_POPUP':
      //case 'WILL_CLOSE_POPUP':
      //  this.setState({msg: ''});
      //  this.refs.form.reset();
      //  break;
      default:
        this.props.updateItemName(event.target.value);
        break;
    }
  }

  /* ORG */
  //onFormChange(event){
  //  //console.log('onFormChange() <> event.target: ', event.target);
  //  this.props.updateItemName(event.target.value);
  //}

  //handleSubmit(event){
  //  //alert('A name was submitted: ' + this.state.item_name);
  //  alert('A name was submitted: ' + this.props.item_name_dst);
  //  event.preventDefault();
  //}

  cbOpenPopUpCreate(event, {action_type, dir_cur, id_target/*, cursor_pos*/}){
    switch(action_type){
      case 'DISP_POPUP_FOR_CREATE_DIR':
        this.setState({msg: 'New Directory Name:'});
        break;
      case 'DISP_POPUP_FOR_CREATE_FILE':
        this.setState({msg: 'New File Name:'});
        break;
    }
    //this.setState();
    //this.refs.form.reset();
    this.props.initState(action_type.replace('DISP_POPUP_FOR_', 'MODE_'), dir_cur, id_target);
  }

}

const mapStateToProps = (state, props) => {
  //console.log('mapStateToProps <> state.item_name_dst: ', state.item_name_dst);
  return {item_name_dst: state.item_name_dst};
}

const mapDispatchToProps = (dispatch, props) => ({
  initState: (mode, dir_cur, id_target) => {
    dispatch({
      type: 'INIT_STATE',
      mode: mode,
      dir_cur: dir_cur,
      id_target: id_target
    });
  },
  updateItemName: (item_name) => {
    dispatch({
      type: 'UPDATE_ITEM_NAME',
      item_name: item_name
    });
  }
});

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
