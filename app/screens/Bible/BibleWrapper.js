import React from "react";
import { connect } from "react-redux";
import Bible from "./";
import LoginDataProvider from "../../context/LoginDataProvider"
import BibleContextProvider from "../../context/BibleContextProvider";
const BibleWrapper = (props) => {
  return (
    <LoginDataProvider navigation={props.navigation}>
      <BibleContextProvider navigation={props.navigation}>
        <Bible navigation={props.navigation} />
      </BibleContextProvider>
    </LoginDataProvider>
  );

};

const mapStateToProps = (state) => {
  return {
    sourceId: state.updateVersion.sourceId,
    chapterNumber: state.updateVersion.chapterNumber,
    email: state.userInfo.email,
    userId: state.userInfo.uid, bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,

  };
};

export default connect(mapStateToProps, null)(BibleWrapper);
