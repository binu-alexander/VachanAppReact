import React, { createContext, useState } from "react";
import { connect } from "react-redux";

export const LoginData = createContext();

const GetLoginData = (props) => {
    //get highlightes,getbookmarks,getnotes,
    //also can pass function from here for do highlights,addNotes,Bookmarks
    return (
        <LoginData.Provider>{props.children}</LoginData.Provider>
    );
};
const mapStateToProps = (state) => {
    return {
        email: state.userInfo.email,
        userId: state.userInfo.uid,
    };
};

export default connect(
    mapStateToProps,
    null
)(GetLoginData);
