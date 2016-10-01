'use strict';

import React from 'react';

class PathCur extends React.Component {
  constructor(props) {
    super(props);
    console.log('PathCur Instantiation!!!');
    //console.log('this.props: ' + this.props);
    console.log('this.props.path_cur: ' + this.props.path_cur);
    //console.log('props.path_cur: ' + this.props.path_cur);
    //this._path_cur = this.
  }

  render() {
    let path_cur = this.props.path_cur;
    const style = {
      //border: '1px solid #FF0000'
      flex: '0 0 auto',
      overflowX: 'hidden'
    };
    return (
      <div style={style}>
        {this.props.path_cur}
      </div>
    );
  }
}

export default PathCur;
