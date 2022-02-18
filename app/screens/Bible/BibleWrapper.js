import React from "react";
import { connect } from "react-redux";
import Bible from "./";
import LoginDataProvider from "../../context/LoginDataProvider";
import BibleContextProvider from "../../context/BibleContextProvider";
const BibleWrapper = (props) => {
<<<<<<< HEAD
    return (
        <LoginDataProvider navigation={props.navigation}>
            <BibleContextProvider navigation={props.navigation}>
                <Bible navigation={props.navigation} />
            </BibleContextProvider>
        </LoginDataProvider>
    );

=======
  return (
    <LoginDataProvider>
      <BibleContextProvider>
        <Bible navigation={props.navigation} />
      </BibleContextProvider>
    </LoginDataProvider>
  );
>>>>>>> 9f1ad2ed5a58ff99eeea3551d41fb16c9bd08154
};

const mapStateToProps = (state) => {
  return {
    sourceId: state.updateVersion.sourceId,
    chapterNumber: state.updateVersion.chapterNumber,
    email: state.userInfo.email,
    userId: state.userInfo.uid,
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
  };
};

export default connect(mapStateToProps, null)(BibleWrapper);
