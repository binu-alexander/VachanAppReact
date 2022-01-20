import React from "react";
import { connect } from "react-redux";
import { userInfo, userLogedIn } from "../../store/action";
import Login from "./Login";
// import { styles } from "./styles.js";
import ProfilePage from "./ProfilePage";

const Auth = (props) => {
  return props.email ? (
    <ProfilePage navigation={props.navigation} />
  ) : (
    <Login navigation={props.navigation} />
  );
};
const mapStateToProps = (state) => {
  return {
    email: state.userInfo.email,
    uid: state.userInfo.uid,
    photo: state.userInfo.photo,
    userName: state.userInfo.userName,
    pasLogedIn: state.userInfo.pasLogedIn,
    googleLogIn: state.userInfo.googleLogIn,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    userInfo: (payload) => dispatch(userInfo(payload)),
    userLogedIn: (payload) => dispatch(userLogedIn(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
