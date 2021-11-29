import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import ModalDropdown from "react-native-modal-dropdown";
import { fetchVersionBooks, updateVersionBook } from "../../../store/action/";
import { getBookChaptersFromMapping } from "../../../utils/UtilFunctions";
import { GIT_BASE_API } from "../../../utils/APIConstant";
import { Agenda } from "../../../lib/react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";
import { OBSStyle } from "./styles.js";
import Colors from "../../../utils/colorConstants";
var moment = require("moment");

class BRP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      chapterNumber: null,
      planSelected: null,
      planList: [],
      monthItems: [],
      manifestData: [],
      readingPlan: [],
      calendarOpened: false,
    };
    this.styles = OBSStyle(this.props.colorFile, this.props.sizeFile);
    this._dropdown_1 = null;
  }
  laodMonthItem(day) {
    if (Object.keys(this.state.items).length > 0) {
      for (var key in this.state.items) {
        if (day.dateString != "undefined" && day.dateString == key) {
          let val = this.state.items;
          val.key = val[key];
          this.setState({ monthItems: val });
        }
      }
    }
  }
  loadItems() {
    var currentYear = new Date().getFullYear();
    this.state.items = {};
    var readingPlan = this.state.readingPlan;
    if (readingPlan) {
      for (var i = 0; i < readingPlan.length; i++) {
        let planDate = currentYear + "-" + readingPlan[i].date;
        if (!this.state.items[planDate]) {
          this.state.items[planDate] = [];
          // readingPlan[i].reading.forEach((val) => {
          //   var words = val.ref.split(" ")
          //   var regmatch = val.text.split(" ")
          //   if (this.props.books) {
          //     var book = this.props.books.find((book) => words[0] == book.bookId)
          //     if (book) {
          //       if (regmatch) {
          //         val['native_name'] = book.bookName + " " + regmatch[regmatch.length - 1]
          //       }
          //     }
          //   }
          // })
          this.state.items[planDate].push({
            reading: readingPlan[i].reading,
            height: Math.max(50, Math.floor(Math.random() * 80)),
          });
        }
      }
    }
    const newItems = {};
    if (Object.keys(this.state.items).length > 0) {
      Object.keys(this.state.items).forEach((key) => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems,
      });
    }
  }
  navigateTo(item) {
    var words = item.split(" ");
    let bookId = words[0];
    let chapterNumber = words[1].match(/\d+/g);
    let bookName = null;
    let bookNumber = null;
    if (this.props.books) {
      if (this.props.books.length > 0) {
        for (var i = 0; i < this.props.books.length; i++) {
          if (this.props.books[i].bookId == bookId) {
            bookName = this.props.books[i].bookName;
            bookNumber = this.props.books[i].bookNumber;
          }
        }
      }
    }
    if (bookNumber && bookName) {
      this.props.updateVersionBook({
        bookId: bookId,
        bookName: bookName,
        chapterNumber: chapterNumber[0],
        totalChapters: getBookChaptersFromMapping(bookId),
      });
      this.props.navigation.navigate("Bible");
    } else {
      let language =
        this.props.languageName &&
        this.props.languageName.charAt(0).toUpperCase() +
          this.props.languageName.slice(1);
      Alert.alert("", "Book is unvailable in " + language);
    }
  }
  renderItem(item) {
    return item.reading.map((val, i) => {
      return (
        <TouchableOpacity
          key={i}
          style={[this.styles.item, { height: item.height }]}
          onPress={() => this.navigateTo(val.ref)}
        >
          <Text style={this.styles.textStyle}>{val.text} </Text>
        </TouchableOpacity>
      );
    });
  }
  rowHasChanged(r1, r2) {
    r1.reading.filter((val1) => {
      r2.reading.filter((val2) => {
        return val1.ref !== val2.ref;
      });
    });
  }

  componentDidMount() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    let selectedDate = yyyy + "-" + mm + "-" + dd;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let currentMonth = monthNames[mm - 1] + " " + yyyy;
    this.setState({ selectedDate, currentMonth }, () => {
      this.fetchPlan();
    });
  }

  fetchPlan() {
    try {
      fetch(GIT_BASE_API + "bible_reading_plans/manifest.json")
        .then((response) => response.json())
        .then((json) => {
          let planList = [];
          for (var i = 0; i < json.length; i++) {
            planList.push(json[i].name);
          }
          this.setState({ planList, manifestData: json }, () => {
            this.props.navigation.setOptions({
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    marginRight: 10,
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.white,
                  }}
                >
                  <ModalDropdown
                    options={this.state.planList}
                    onSelect={this.onSelect}
                    defaultValue={
                      this.state.planList.length > 0
                        ? this.state.planList[0]
                        : ""
                    }
                    isFullWidth={true}
                    dropdownStyle={{
                      padding: 10,
                      width: "60%",
                      height: "auto",
                    }}
                    adjustFrame={(style) => {
                      this.state.planList.length > 2 ? 80 : -1;
                      return style;
                    }}
                    dropdownTextStyle={{ fontSize: 18 }}
                    textStyle={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#fff",
                    }}
                  />
                  <Icon name="arrow-drop-down" color={"#fff"} size={20} />
                </TouchableOpacity>
              ),
            });
          });

          fetch(
            GIT_BASE_API +
              "bible_reading_plans/" +
              this.state.manifestData[0].file
          )
            .then((response) => response.json())
            .then((json) => {
              this.setState({ readingPlan: json }, () => {
                this.loadItems();
                this.laodMonthItem({ dateString: this.state.selectedDate });
              });
            });
        });
    } catch (error) {
      console.log(error.message);
    }
  }
  onSelect = (value) => {
    try {
      let val = this.state.manifestData[value].file;
      fetch(GIT_BASE_API + "bible_reading_plans/" + val)
        .then((response) => response.json())
        .then((json) => {
          this.setState(
            {
              planSelected: String(this.state.planList[value]),
              readingPlan: json,
            },
            () => {
              this.loadItems();
            }
          );
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  onUpdateSelectedDate = (date) => {
    if (
      this.state.currentMonth ==
      `${moment(date.dateString).format("MMMM")}` + " " + date.year
    ) {
      return;
    } else {
      this.setState({
        currentMonth:
          `${moment(date.dateString).format("MMMM")}` + " " + date.year,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.books.length != this.props.books.length ||
      Object.keys(prevState.items).length !=
        Object.keys(this.state.items).length
    ) {
      this.props.fetchVersionBooks({
        language: this.props.languageName,
        versionCode: this.props.versionCode,
        downloaded: this.props.downloaded,
        sourceId: this.props.sourceId,
      });
      this.fetchPlan();
    }
  }

  renderKnob = () => {
    return (
      <Icon
        name="keyboard-arrow-down"
        size={24}
        color={this.props.colorFile.blueText}
      />
    );
  };
  renderEmptyData() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "#3E4095",
          }}
        >
          Plan is available only for current year{"\n"}
        </Text>
      </View>
    );
  }
  render() {
    console.log(" brp ", this.state.planList[0]);
    const themeStyle = {
      calendarBackground: this.props.colorFile.backgroundColor, //agenda background
      agendaKnobColor: this.props.colorFile.blueText, // knob color
      backgroundColor: this.props.colorFile.backgroundColor, // background color below agenda
      agendaDayTextColor: this.props.colorFile.textColor, // day name
      agendaDayNumColor: this.props.colorFile.textColor, // day number
      agendaTodayColor: this.props.colorFile.textColor, // today in list
      monthTextColor: this.props.colorFile.textColor, // name in calendar
      textDefaultColor: this.props.colorFile.textColor,
      todayBackgroundColor: this.props.colorFile.backgroundColor,
      textSectionTitleColor: this.props.colorFile.textColor,
      selectedDayBackgroundColor: this.props.colorFile.blueText, // calendar sel date
      dayTextColor: this.props.colorFile.textColor, // calendar day
      dotColor: this.props.colorFile.blueText, // dots
      textDisabledColor: this.props.colorFile.textColor,
    };
    return (
      <View style={this.styles.container}>
        {Object.keys(this.state.items).length > 0 ? (
          <View style={{ flex: 1 }}>
            <Text
              style={[
                this.styles.agendaDate,
                {
                  color: this.state.calendarOpened
                    ? this.props.colorFile.backgroundColor
                    : this.props.colorFile.textColor,
                },
              ]}
            >
              {this.state.currentMonth}
            </Text>
            <Agenda
              style={[this.styles.agendaBackgroundColor]}
              items={this.state.monthItems}
              ref={(ref) => {
                this.agenda = ref;
              }}
              renderEmptyData={this.renderEmptyData.bind(this)}
              loadItemsForMonth={this.laodMonthItem.bind(this)}
              onDayChange={this.onUpdateSelectedDate}
              onDayPress={this.onUpdateSelectedDate}
              selected={this.state.selectedDate}
              renderItem={this.renderItem.bind(this)}
              rowHasChanged={this.rowHasChanged.bind(this)}
              pastScrollRange={new Date().getMonth()}
              futureScrollRange={12 - parseInt(new Date().getMonth() + 1)}
              renderKnob={this.renderKnob}
              onCalendarToggled={(calendarOpened) => {
                this.setState({ calendarOpened });
              }}
              theme={themeStyle}
            />
          </View>
        ) : (
          <ActivityIndicator
            size="small"
            color={Colors.Blue_Color}
            animate={true}
            style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    books: state.versionFetch.versionBooks,
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
    fetchVersionBooks: (value) => dispatch(fetchVersionBooks(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BRP);
