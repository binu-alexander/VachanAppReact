import React from "react";
import Bible from ".";
import BibleContextProvider from "../../BibleContext/BibleContext";
const BibleWrapper = (props) => {
  return (
    <BibleContextProvider value={"Esten"}>
      <Bible navigation={props.navigation} />
    </BibleContextProvider>
  );
};

export default BibleWrapper;
