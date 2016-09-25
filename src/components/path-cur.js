'use strict';

import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
    console.log('Header Instantiation!!!');
    //console.log('this.props: ' + this.props);
    console.log('this.props.path_cur: ' + this.props.path_cur);
    //console.log('props.path_cur: ' + this.props.path_cur);
    //this._path_cur = this.
  }

  render() {
    let path_cur = this.props.path_cur;
    const style = {
      //border: '1px solid #FF0000'
    };
    return (
      <div style={style}>
        {this.props.path_cur}
      </div>
    );
  }
}

export default Header;
