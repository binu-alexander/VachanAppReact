import React from "react";
import { connect } from "react-redux";
import { userInfo, userLogedIn } from "../../store/action";
import Login from "./Login";
// import { styles } from "./styles.js";
import ProfilePage from "./ProfilePage";

// class Auth extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: this.props.email,
//       imageUrl: this.props.photo,
//       userData: "",
//       isLoading: false,
//     };
//     this.styles = styles(this.props.colorFile, this.props.sizeFile);
//   }
//   render() {
//     if (this.props.email) {
//       return <ProfilePage navigation={this.props.navigation} />;
//     } else {
//       return <Login navigation={this.props.navigation} />;
//     }
//   }
// }

const Auth = (props) => {
  // const user = props.email;
  // const imageUrl = props.photo;
  // const userData = "";
  // const style = styles(props.colorFile, props.sizeFile);
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
