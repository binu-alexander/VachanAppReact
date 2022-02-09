import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import ModalDropdown from "react-native-modal-dropdown";
import { fetchVersionBooks, updateVersionBook } from "../../../store/action/";
import { getBookChaptersFromMapping } from "../../../utils/UtilFunctions";
import { GIT_BASE_API } from "../../../utils/APIConstant";
import { Agenda } from "../../../lib/react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles.js";
import Colors from "../../../utils/colorConstants";
var moment = require("moment");

const BRP = (props) => {
  const [items, setItems] = useState({});
  const [planSelected, setPlanSelected] = useState(null);
  const [planList, setPlanList] = useState([]);
  const [monthItems, setMonthItems] = useState([]);
  const [manifestData, setManifestData] = useState([]);
  const [readingPlan, setReadingPlan] = useState([]);
  const [calendarOpened, setCalendarOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState("");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var currentMonths;

  const style = styles(props.colorFile, props.sizeFile);
  let agenda = useRef().current;
  const laodMonthItem = (day) => {
    if (Object.keys(items).length > 0) {
      for (var key in items) {
        if (day.dateString != "undefined" && day.dateString == key) {
          let val = items;
          val.key = val[key];
          setMonthItems(val);
        }
      }
    }
  };
  const loadItems = () => {
    var currentYear = new Date().getFullYear();
    let item = {};
    let readingPlans = readingPlan;
    if (readingPlans) {
      for (var i = 0; i < readingPlans.length; i++) {
        let planDate = currentYear + "-" + readingPlans[i].date;
        if (!item[planDate]) {
          item[planDate] = [];
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
          item[planDate].push({
            reading: readingPlans[i].reading,
            height: Math.max(50, Math.floor(Math.random() * 80)),
          });
        }
      }
    }
    const newItems = {};
    if (Object.keys(item).length > 0) {
      Object.keys(item).forEach((key) => {
        newItems[key] = item[key];
      });
      setItems(newItems);
    }
  };
  const navigateTo = (item) => {
    var words = item.split(" ");
    let bookId = words[0];
    let chapterNumber = words[1].match(/\d+/g);
    let bookName = null;
    let bookNumber = null;
    if (props.books) {
      if (props.books.length > 0) {
        for (var i = 0; i < props.books.length; i++) {
          if (props.books[i].bookId == bookId) {
            bookName = props.books[i].bookName;
            bookNumber = props.books[i].bookNumber;
          }
        }
      }
    }
    console.log(
      " bookId,word,chapterNumber,bookName ",
      bookId,
      words,
      chapterNumber,
      bookName
    );
    if (bookNumber && bookName) {
      props.updateVersionBook({
        bookId: bookId,
        bookName: bookName,
        chapterNumber: chapterNumber[0],
        totalChapters: getBookChaptersFromMapping(bookId),
      });
      props.navigation.navigate("Bible");
    } else {
      let language =
        props.languageName &&
        props.languageName.charAt(0).toUpperCase() +
          props.languageName.slice(1);
      Alert.alert("", "Book is unvailable in " + language);
    }
  };
  const renderItem = (item) => {
    return item.reading.map((val, i) => {
      return (
        <TouchableOpacity
          key={i}
          style={[style.item, { height: item.height }]}
          onPress={() => navigateTo(val.ref)}
        >
          <Text style={style.textStyle}>{val.text} </Text>
        </TouchableOpacity>
      );
    });
  };

  const rowHasChanged = (r1, r2) => {
    r1.reading.filter((val1) => {
      r2.reading.filter((val2) => {
        return val1.ref !== val2.ref;
      });
    });
  };
  const fetchPlan = () => {
    try {
      fetch(GIT_BASE_API + "bible_reading_plans/manifest.json")
        .then((response) => response.json())
        .then((json) => {
          let planLists = [];
          for (var i = 0; i < json.length; i++) {
            planLists.push(json[i].name);
          }
          setPlanList(planLists);
          setManifestData(json);
          props.navigation.setOptions({
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
                  options={planLists}
                  onSelect={onSelect}
                  defaultValue={planLists.length > 0 ? planLists[0] : ""}
                  isFullWidth={true}
                  dropdownStyle={{
                    padding: 10,
                    width: "60%",
                    height: "auto",
                  }}
                  adjustFrame={(style) => {
                    planList.length > 2 ? 80 : -1;
                    return style;
                  }}
                  dropdownTextStyle={{ fontSize: 18 }}
                  textStyle={{
                    fontSize: 18,
                    fontWeight: Platform.OS === "android" ? "800" : "400",
                    color: "#fff",
                  }}
                />
                <Icon name="arrow-drop-down" color={"#fff"} size={20} />
              </TouchableOpacity>
            ),
          });
          fetch(GIT_BASE_API + "bible_reading_plans/" + json[0].file)
            .then((response) => response.json())
            .then((readingPlan) => {
              setReadingPlan(readingPlan);
              loadItems();
              laodMonthItem({ dateString: selectedDate });
            });
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  const onSelect = (value) => {
    try {
      let val = manifestData[value].file;
      fetch(GIT_BASE_API + "bible_reading_plans/" + val)
        .then((response) => response.json())
        .then((json) => {
          setPlanSelected(String(planList[value]));
          setReadingPlan(json);
          loadItems();
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  const onUpdateSelectedDate = (date) => {
    if (
      currentMonth ==
      `${moment(date.dateString).format("MMMM")}` + " " + date.year
    ) {
      return;
    } else {
      setCurrentMonth(
        `${moment(date.dateString).format("MMMM")}` + " " + date.year
      );
    }
  };

  const renderKnob = () => {
    return (
      <Icon
        name="keyboard-arrow-down"
        size={24}
        color={props.colorFile.blueText}
      />
    );
  };
  const renderEmptyData = () => {
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
  };

  useEffect(() => {
    var yyyy = today.getFullYear();
    let selectedDates = yyyy + "-" + mm + "-" + dd;
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
    currentMonths = monthNames[mm - 1] + " " + yyyy;
    setSelectedDate(selectedDates);
    setCurrentMonth(currentMonths);
    fetchPlan();
  }, []);
  useEffect(() => {
    fetchPlan();
  }, [selectedDate, currentMonth]);
  useEffect(() => {
    props.fetchVersionBooks({
      language: props.languageName,
      versionCode: props.versionCode,
      downloaded: props.downloaded,
      sourceId: props.sourceId,
    });
  }, [JSON.stringify(props.books)]);
  useEffect(() => {
    loadItems();
  }, [JSON.stringify(readingPlan), planSelected]);

  const themeStyle = {
    calendarBackground: props.colorFile.backgroundColor, //agenda background
    agendaKnobColor: props.colorFile.blueText, // knob color
    backgroundColor: props.colorFile.backgroundColor, // background color below agenda
    agendaDayTextColor: props.colorFile.textColor, // day name
    agendaDayNumColor: props.colorFile.textColor, // day number
    agendaTodayColor: props.colorFile.textColor, // today in list
    monthTextColor: props.colorFile.textColor, // name in calendar
    textDefaultColor: props.colorFile.textColor,
    todayBackgroundColor: props.colorFile.backgroundColor,
    textSectionTitleColor: props.colorFile.textColor,
    selectedDayBackgroundColor: props.colorFile.blueText, // calendar sel date
    dayTextColor: props.colorFile.textColor, // calendar day
    dotColor: props.colorFile.blueText, // dots
    textDisabledColor: props.colorFile.textColor,
  };
  return (
    <View style={style.container}>
      {Object.keys(items).length > 0 ? (
        <View style={{ flex: 1 }}>
          <Text
            style={[
              style.agendaDate,
              {
                color: calendarOpened
                  ? props.colorFile.backgroundColor
                  : props.colorFile.textColor,
              },
            ]}
          >
            {currentMonth}
          </Text>
          <Agenda
            style={[style.agendaBackgroundColor]}
            items={monthItems}
            ref={agenda}
            renderEmptyData={renderEmptyData}
            loadItemsForMonth={laodMonthItem}
            onDayChange={onUpdateSelectedDate}
            onDayPress={onUpdateSelectedDate}
            selected={selectedDate}
            renderItem={renderItem}
            rowHasChanged={rowHasChanged}
            pastScrollRange={new Date().getMonth()}
            futureScrollRange={12 - parseInt(new Date().getMonth() + 1)}
            renderKnob={renderKnob}
            onCalendarToggled={(calendarOpened) =>
              setCalendarOpened(calendarOpened)
            }
            theme={themeStyle}
          />
        </View>
      ) : (
        <ActivityIndicator
          size="small"
          color={Colors.Blue_Color}
          animate={true}
          style={style.loaderCenter}
        />
      )}
    </View>
  );
};

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
