'use strict';

import React from 'react';
import { RES } from '../../res/res';

class Info extends React.Component {
  constructor(props){
    super(props);

    this.height_base = RES.INFO.HEIGHT;

    this.style_base = {
      borderLeft: 'solid 1px #FFFFFF',
      borderTop: 'solid 1px #FFFFFF',
      borderRight: 'solid 1px #FFFFFF',
      borderBottom: 'solid 1px #FFFFFF',
      //flex: '0 0 auto'
      //boxSizing: 'border-box'

      display: 'flex',
      flex: 'auto',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      minHeight: this.height_base + 'px',
      maxHeight: this.height_base + 'px',
      //minHeight: '16.0px',
      //maxHeight: '16.0px',
      //minHeight: '23.0px',
      //maxHeight: '23.0px',
      boxSizing: 'border-box'
    };
  }

  render(){
    const height = this.height_base + this.props.height_delta;
    const style = this.style_base;
    //const style = Object.assign(
    //  {},
    //  this.style_base,
    //  {
    //    minHeight: height + 'px',
    //    maxHeight: height + 'px'
    //  }
    //  //{
    //  //  minHeight: this.props.height_margin_str,
    //  //  maxHeight: this.props.height_margin_str
    //  //}
    //);

    //console.log('info <> height: ' + height + ', delta: ' + this.props.height_delta + ', height_base: ' + this.height_base);
    return (
      <div style={style}>
        Info
      </div>
    );
  }

  shouldComponentUpdate(nextState, nextProps){
    //if(nextProps.action_type === 'UPDATE_INFO_PANE_HEIGHT'){
    //  return true;
    //}

    return true;
  }


}



//const Info = () => {
//  const style = {
//    borderLeft: 'solid 1px #FFFFFF',
//    borderTop: 'solid 1px #FFFFFF',
//    borderRight: 'solid 1px #FFFFFF',
//    borderBottom: 'solid 1px #FFFFFF',
//    //flex: '0 0 auto'
//    //boxSizing: 'border-box'
//
//    display: 'flex',
//    flex: 'auto',
//    flexDirection: 'row',
//    justifyContent: 'flex-start',
//    width: '100%',
//    minHeight: '16.0px',
//    maxHeight: '16.0px',
//    boxSizing: 'border-box'
//
//  };
//
//  return (
//    <div style={style}>
//      Info
//    </div>
//  );
//}

export default Info;
