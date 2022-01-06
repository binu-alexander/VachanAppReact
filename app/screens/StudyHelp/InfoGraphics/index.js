import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, CardItem } from "native-base";
import { connect } from "react-redux";
import { styles } from "./styles.js";
import { Toast } from "native-base";
import vApi from "../../../utils/APIFetch";
import ListContainer from "../../../components/Common/FlatList.js";

// class Infographics extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       bookId: this.props.route.params ? this.props.route.params.bookId : null,
//       bookName: this.props.route.params
//         ? this.props.route.params.bookName
//         : null,
//       infographics: [],
//       url: null,
//       isLoading: false,
//     };
//     this.styles = styles(this.props.colorFile, this.props.sizeFile);
//   }
//   async fetchInfographics() {
//     const apiData = await vApi.get("infographics/" + this.props.languageCode);
//     let infographicsBook = [];
//     if (apiData) {
//       let found = false;
//       for (var i = 0; i < apiData.books.length; i++) {
//         if (this.state.bookId) {
//           if (apiData.books[i].bookCode == this.state.bookId) {
//             found = true;
//             infographicsBook.push(apiData.books[i]);
//           }
//         }
//       }
//       if (found) {
//         this.setState({ infographics: infographicsBook, url: apiData.url });
//       } else {
//         if (this.state.bookId) {
//           Toast.show({
//             text:
//               "Infographics for " +
//               this.state.bookName +
//               " is unavailable. You can check other books",
//             duration: 8000,
//             position: "top",
//           });
//         }
//         this.setState({ infographics: apiData.books, url: apiData.url });
//       }
//     }
//   }
//   componentDidMount() {
//     this.fetchInfographics();
//   }
//   componentDidUpdate(prevProps) {
//     if (prevProps.books.length != this.props.books.length) {
//       this.fetchInfographics();
//     }
//   }
//   gotoImage = (item) => {
//     this.props.navigation.navigate("InfographicsImage", {
//       url: this.state.url,
//       fileName: item.fileName,
//     });
//   };
//   emptyMessageNavigation = () => {
//     this.props.navigation.navigate("Bible");
//   };
//   renderItem = ({ item }) => {
//     var bookName = null;
//     if (this.props.books) {
//       for (var i = 0; i <= this.props.books.length - 1; i++) {
//         var bId = this.props.books[i].bookId;
//         if (bId == item.bookCode) {
//           bookName = this.props.books[i].bookName;
//         }
//       }
//     } else {
//       this.setState({ infographics: [] });
//       return;
//     }
//     var value = item.infographics.map((e, i) => (
//       <Card key={i}>
//         <CardItem style={this.styles.cardItemStyle}>
//           <TouchableOpacity
//             style={this.styles.infoView}
//             onPress={() => this.gotoImage(e)}
//           >
//             <Text style={this.styles.infoText}>
//               {bookName}: {e.title}
//             </Text>
//           </TouchableOpacity>
//         </CardItem>
//       </Card>
//     ));
//     return <View>{bookName && value}</View>;
//   };
//   render() {
//     return (
//       <View style={this.styles.container}>
//         {this.state.isLoading ? (
//           // eslint-disable-next-line react/jsx-no-undef
//           <ActivityIndicator // it is showing undefined
//             animate={true}
//             style={{ justifyContent: "center", alignSelf: "center" }}
//           />
//         ) : (
//           <ListContainer
//             listData={this.state.infographics}
//             listStyle={this.styles.centerEmptySet}
//             renderItem={this.renderItem}
//             containerStyle={this.styles.emptyMessageContainer}
//             icon="image"
//             iconStyle={this.styles.emptyMessageIcon}
//             textStyle={this.styles.messageEmpty}
//             message={`No Infographics for ${this.props.languageName}`}
//             onPress={this.emptyMessageNavigation}
//           />
//         )}
//       </View>
//     );
//   }
// }

const Infographics = (props) => {
  const bookId = props.route.params ? props.route.params.bookId : null;
  const bookName = props.route.params ? props.route.params.bookName : null;
  const [infographics, setInfographics] = useState([]);
  const [url, setUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const prevBooks = useRef(props.books).current;
  const style = styles(props.colorFile, props.sizeFile);
  const fetchInfographics = async () => {
    const apiData = await vApi.get("infographics/" + props.languageCode);
    let infographicsBook = [];
    if (apiData) {
      let found = false;
      for (var i = 0; i < apiData.books.length; i++) {
        if (bookId) {
          if (apiData.books[i].bookCode == bookId) {
            found = true;
            infographicsBook.push(apiData.books[i]);
          }
        }
      }
      if (found) {
        setInfographics(infographicsBook);
        setUrl(apiData.url);
      } else {
        if (bookId) {
          Toast.show({
            text:
              "Infographics for " +
              bookName +
              " is unavailable. You can check other books",
            duration: 8000,
            position: "top",
          });
        }
        setInfographics(apiData.books);
        setUrl(apiData.url);
      }
    }
  };
  const gotoImage = (item) => {
    props.navigation.navigate("InfographicsImage", {
      url: url,
      fileName: item.fileName,
    });
  };
  const emptyMessageNavigation = () => {
    props.navigation.navigate("Bible");
  };
  const renderItem = ({ item }) => {
    var bookName = null;
    if (props.books) {
      for (var i = 0; i <= props.books.length - 1; i++) {
        var bId = props.books[i].bookId;
        if (bId == item.bookCode) {
          bookName = props.books[i].bookName;
        }
      }
    } else {
      setInfographics(infographics);
      return;
    }
    var value = item.infographics.map((e, i) => (
      <Card key={i}>
        <CardItem style={style.cardItemStyle}>
          <TouchableOpacity style={style.infoView} onPress={() => gotoImage(e)}>
            <Text style={style.infoText}>
              {bookName}: {e.title}
            </Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    ));
    return <View>{bookName && value}</View>;
  };

  useEffect(() => {
    fetchInfographics();
    if (prevBooks.length != props.books.length) {
      fetchInfographics();
    }
  }, [prevBooks, props.books, infographics]);
  return (
    <View style={style.container}>
      {isLoading ? (
        // eslint-disable-next-line react/jsx-no-undef
        <ActivityIndicator // it is showing undefined
          animate={true}
          style={{ justifyContent: "center", alignSelf: "center" }}
        />
      ) : (
        <ListContainer
          listData={infographics}
          listStyle={style.centerEmptySet}
          renderItem={renderItem}
          containerStyle={style.emptyMessageContainer}
          icon="image"
          iconStyle={style.emptyMessageIcon}
          textStyle={style.messageEmpty}
          message={`No Infographics for ${props.languageName}`}
          onPress={emptyMessageNavigation}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    books: state.versionFetch.versionBooks,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Infographics);
