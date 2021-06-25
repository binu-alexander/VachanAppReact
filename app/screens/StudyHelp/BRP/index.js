import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import { Header, Button, Left, Right, Body } from "native-base";
import { updateVersionBook } from '../../../store/action/'
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../../utils/UtilFunctions'
import { GIT_BASE_API } from '../../../utils/APIConstant'
import { Agenda, Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { OBSStyle } from './styles.js'
import Color from '../../../utils/colorConstants';
import { months } from 'moment';

var moment = require('moment');

class BRP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      chapterNumber: null,
      planSelected: null,
      planList: [],
      monthItems: {},
      manifestData: [],
      readingPlan: []
    }
    this.styles = OBSStyle(this.props.colorFile, this.props.sizeFile);
  }
  laodMonthItem(day) {
    // console.log("day ",day.dateString)
    // for(var key in this.state.items){
    //   // if(){}
    //   if( dateString != 'undefined' && day.dateString == key){
    //     this.state.items[day.dateString]
    //     this.setState({monthItems: this.state.items[key]})
    //   }
    //   // console.log("KEY ",key)
    // }
    // if(dateString != 'undefined'){
    //   console.log(" DATE STRING ",this.state.items[day.dateString])
    // }
    // // var currentMonth = new Date().getMonth();
  }
  loadItems() {
    var currentYear = new Date().getFullYear();
    this.state.items = []
    if (this.state.readingPlan) {
      for (var i = 0; i < this.state.readingPlan.length; i++) {
        let planDate = currentYear + '-' + this.state.readingPlan[i].date
        if (!this.state.items[planDate]) {
          this.state.items[planDate] = []
          this.state.items[planDate].push({
            reading: this.state.readingPlan[i].reading,
          });
        }
      }
    }
    const newItems = {};
    Object.keys(this.state.items).forEach(key => {
      newItems[key] = this.state.items[key];
    });
    this.setState({
      items: newItems
    });
  }
  navigateTo(item) {
    var words = item.split(" ");
    let bookId = words[0]
    let chapterNumber = words[1].match(/\d+/g)
    let bookName = null
    if (this.props.books) {
      if (this.props.books.length > 0) {
        for (var i = 0; i < this.props.books.length; i++) {
          console.log(" BOOK ID ", this.props.books[i].bookId, bookId)
          if (this.props.books[i].bookId == bookId) {
            bookName = this.props.books[i].bookName
          }
        }
      }
    }
    console.log("Bookname ", bookName, bookId,chapterNumber[0])
    this.props.updateVersionBook({
      bookId: bookId,
      bookName: bookName != null ? bookName : getBookNameFromMapping(bookId),
      chapterNumber: chapterNumber[0],
      totalChapters: getBookChaptersFromMapping(bookId)
    })
    this.props.navigation.navigate('Bible')
  }
  renderItem(item) {
    return item.reading.map((val) => {
      return (
        <TouchableOpacity
          style={[styles.item]}
          onPress={() => this.navigateTo(val.ref)}
        >
          <Text>{val.text}</Text>
        </TouchableOpacity>
      )
    });

  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
  componentDidMount() {
    try {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      this.setState({ selectedDate: yyyy + "-" + mm + '-' + dd })
      fetch(GIT_BASE_API + 'bible_reading_plans/manifest.json',)
        .then((response) => response.json())
        .then((json) => {
          let planList = []
          for (var i = 0; i < json.length; i++) {
            planList.push(json[i].name)
          }
          console.log(" json ", planList)
          this.setState({ planList, manifestData: json })
          fetch(GIT_BASE_API + 'bible_reading_plans/' + this.state.manifestData[0].file)
            .then((response) => response.json())
            .then((json) => {
              this.setState({ readingPlan: json }, () => {
                this.loadItems()
              })
            })
        })


    } catch (error) {

    }
  }
  onSelect = (value) => {
    try {
      let val = this.state.manifestData[value].file
      fetch(GIT_BASE_API + 'bible_reading_plans/' + val)
        .then((response) => response.json())
        .then((json) => {
          this.setState({ planSelected: (String(this.state.planList[value])), readingPlan: json }, () => {
            this.loadItems()
          })
        })
    } catch (error) {

    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Header>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' color={"#fff"} size={24} onPress={() => { this.props.navigation.pop() }} />
            </Button>
          </Left>
          <Body style={{ flexDirection: 'row' }}>
            <ModalDropdown ref={el => this._dropdown_1 = el} options={this.state.planList}
              onSelect={this.onSelect} style={this.styles.modalStye}
              defaultValue={this.state.planList[0]} isFullWidth={true} dropdownStyle={{ padding: 10, width: '60%', height: '70%' }} dropdownTextStyle={{ fontSize: 18 }} textStyle={{ fontSize: 18, fontWeight: '400', color: '#fff' }} />
            <Icon name="arrow-drop-down" color={Color.White} size={20} />
          </Body>
        </Header>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.laodMonthItem.bind(this)}
          selected={this.state.selectedDate}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          // hideExtraDays={true}
          pastScrollRange={new Date().getMonth()}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={12 - parseInt(new Date().getMonth() + 1)}
        // showClosingKnob={true}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        // hideExtraDays={false}
        />
        {/* <Calendar
          markingType={'period'}
          markedDates={this.state.items}
        /> */}

      </>
    );
  }

};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});
const mapStateToProps = state => {
  return {
    books: state.versionFetch.data,
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BRP)
