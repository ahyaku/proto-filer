'use strict';

import Redux from 'redux';
import { connect } from 'react-redux';
import Cmd from '../components/cmd';

const mapStateToProps = (state, props) => {
  return props;
}


const PaneCmd = connect(
  mapStateToProps
)(Cmd);

export default 
