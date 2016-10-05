'use strict';

import React from 'react';

const PathCur = ({arr_path_cur, props}) => {
  const id = props.id;
  const path_cur = arr_path_cur[props.id];
  //console.log('Pathcur <> ' + props);
  const style = {
    //border: '1px solid #FF0000'
    flex: '0 0 auto',
    overflowX: 'hidden'
  };

  return (
    <div style={style}>
      {path_cur}
    </div>
  );
}

export default PathCur;
