'use strict';

import React from 'react';

const PathCur = ({path_cur, active_pane_id, props}) => {
  let style = {};
  //const style = {
  //  color: '#AAAAAA'
  //  //border: '1px solid #FFFFFF'
  //  //flex: '0 0 auto',
  //  //overflowX: 'hidden'
  //};

  //console.log('props.id: ' + props.id + ', active_pane_id: ' + active_pane_id);

  if(active_pane_id === props.id){
    style['color'] = '#FFFFFF';
  }else{
    style['color'] = '#AAAAAA';
  }

  return (
    <div style={style}>
      {path_cur}
    </div>
  );
}

export default PathCur;
