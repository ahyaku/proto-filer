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
    this.style = {
      //border: '1px solid #FFFFFF',
      minHeight: '16px',
      maxHeight: '16px',
      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      //borderLeft: 'solid 1px #FFFFFF',
      //borderRight: 'solid 1px #FFFFFF',
      boxSizing: 'border-box',
      fontSize: '14px'
    };

  }

  render(){
    const dir_cur = this.props.dir_cur;
    const active_pane_id = this.props.active_pane_id;
    const id = this.props.id;

    //let style = {};

    //console.log('props.id: ' + props.id + ', active_pane_id: ' + active_pane_id);

    if(active_pane_id === id){
      this.style['color'] = '#FFFFFF';
    }else{
      this.style['color'] = '#AAAAAA';
    }

    return (
      <div style={this.style}>
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

export default PathCur;
