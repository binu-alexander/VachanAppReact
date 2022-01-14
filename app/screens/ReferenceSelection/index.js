import React, { useEffect } from "react";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import SelectionTab from "./routes/index";
import { fetchVersionBooks } from "../../store/action/";
import Spinner from "react-native-loading-spinner-overlay";
import ReloadButton from "../../components/ReloadButton";
import { styles } from "./styles";

const ReferenceSelection = (props) => {
  let alertPresent = false;
  const style = styles(props.colorFile, props.sizeFile);

  const getBooks = () => {
    if (props.route.params) {
      let params = props.route.params;
      props.fetchVersionBooks({
        language: params.language,
        versionCode: params.versionCode,
        downloaded: params.downloaded,
        sourceId: params.sourceId,
      });
    }
  };

  const errorMessage = () => {
    if (!alertPresent) {
      alertPresent = true;
      if (props.error !== null) {
        Alert.alert(
          "",
          "Check your internet connection",
          [
            {
              text: "OK",
              onPress: () => {
                alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        alertPresent = false;
      }
    }
  };
  // if error message or fetch data not available re-render
  const reloadBooks = () => {
    errorMessage();
    getBooks();
  };
  useEffect(() => {
    getBooks();
  }, []);
  return props.isLoading ? (
    <Spinner visible={true} textContent={"Loading..."} />
  ) : props.error ? (
    <View style={style.mainContainerReloadButton}>
      <ReloadButton
        styles={style}
        reloadFunction={reloadBooks}
        message={null}
      />
    </View>
  ) : (
    <SelectionTab params={props.route.params} />
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,

    books: state.versionFetch.versionBooks,
    error: state.versionFetch.error,
    isLoading: state.versionFetch.loading,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ReferenceSelection);
