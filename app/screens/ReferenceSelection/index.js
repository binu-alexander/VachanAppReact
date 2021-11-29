import React, { Component } from "react";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import SelectionTab from "./routes/index";
import { fetchVersionBooks } from "../../store/action/";
import Spinner from "react-native-loading-spinner-overlay";
import ReloadButton from "../../components/ReloadButton";
import { styles } from "./styles";

class ReferenceSelection extends Component {
  constructor(props) {
    super(props);
    this.alertPresent = false;
  }

  // all books to render
  getBooks() {
    if (this.props.route.params) {
      let params = this.props.route.params;
      this.props.fetchVersionBooks({
        language: params.language,
        versionCode: params.versionCode,
        downloaded: params.downloaded,
        sourceId: params.sourceId,
      });
    }
  }
  componentDidMount() {
    this.getBooks();
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error !== null) {
        Alert.alert(
          "",
          "Check your internet connection",
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        this.alertPresent = false;
      }
    }
  }
  // if error message or fetch data not available re-render
  reloadBooks = () => {
    this.errorMessage();
    this.getBooks();
  };
  render() {
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
    return this.props.isLoading ? (
      <Spinner visible={true} textContent={"Loading..."} />
    ) : this.props.error ? (
      <View style={this.styles.mainContainerReloadButton}>
        <ReloadButton
          styles={this.styles}
          reloadFunction={this.reloadBooks}
          message={null}
        />
      </View>
    ) : (
      <SelectionTab params={this.props.route.params} />
    );
  }
}

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
