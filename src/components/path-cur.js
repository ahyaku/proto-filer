'use strict';

import React from 'react';
import { RES } from '../../res/res';

class PathCur extends React.Component {
  constructor(props){
    super(props);
    this.style = {
      //border: '1px solid #FFFFFF',
      minHeight: RES.PATH_CUR.HEIGHT + 'px',
      maxHeight: RES.PATH_CUR.HEIGHT + 'px',
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
