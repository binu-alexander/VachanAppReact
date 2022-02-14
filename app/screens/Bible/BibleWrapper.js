import React, { useContext } from "react"
import Bible from "./"
import { BibleContext } from "./"
// try with add login data provider here 
const BibleWrapper = (props) => {
    return (
        <Bible navigation={props.navigation} />
    )
}
export default BibleWrapper
