'use strict';

import React from 'react';

const PathCur = ({path_cur, props}) => {
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
