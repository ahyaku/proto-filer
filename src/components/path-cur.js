'use strict';

import React from 'react';

const PathCur = ({dir_cur, active_pane_id, props}) => {
  console.log('PathCur() <> props.id = ' + props.id);
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
      {dir_cur}
    </div>
  );
}

export default PathCur;
