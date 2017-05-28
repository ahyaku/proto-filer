'use strict';

import React from 'react';

const PathCur = ({dir_cur, active_pane_id, props}) => {
  //console.log('PathCur() <> props.id = ' + props.id);
  return (
    <PathCurView dir_cur={dir_cur} active_pane_id={active_pane_id} id={props.id}/>
  );
}

class PathCurView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const dir_cur = this.props.dir_cur;
    const active_pane_id = this.props.active_pane_id;
    const id = this.props.id;

    //let style = {};

    let style = {
      //border: '1px solid #FFFFFF',
      minHeight: '20px',
      maxHeight: '20px',
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    };

    //console.log('props.id: ' + props.id + ', active_pane_id: ' + active_pane_id);

    if(active_pane_id === id){
      style['color'] = '#FFFFFF';
    }else{
      style['color'] = '#AAAAAA';
    }

    return (
      <div style={style}>
        {dir_cur}
      </div>
    );
  }

  //componentDidMount(){
  //  console.log('PathCurView <> componentDidMount()');
  //}

  //componentDidUpdate(){
  //  console.log('PathCurView <> componentDidUpdate()');
  //}
}

//const PathCur = ({dir_cur, active_pane_id, props}) => {
//  console.log('PathCur() <> props.id = ' + props.id);
//  let style = {};
//  //const style = {
//  //  color: '#AAAAAA'
//  //  //border: '1px solid #FFFFFF'
//  //  //flex: '0 0 auto',
//  //  //overflowX: 'hidden'
//  //};
//
//  //console.log('props.id: ' + props.id + ', active_pane_id: ' + active_pane_id);
//
//  if(active_pane_id === props.id){
//    style['color'] = '#FFFFFF';
//  }else{
//    style['color'] = '#AAAAAA';
//  }
//
//  return (
//    <div style={style}>
//      {dir_cur}
//    </div>
//  );
//}



export default PathCur;
