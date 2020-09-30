import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
  Dimensions,
  ScrollView
} from 'react-native';
import { aboutPage } from './styles.js'
import { connect } from 'react-redux'
const screenHeight = Dimensions.get('window').height
class About extends Component {
  static navigationOptions = {
    headerTitle: 'About Us',
  };
  constructor(props) {
    super(props);
    this.styles = aboutPage(this.props.colorFile, this.props.sizeFile);
  }

  render() {
    return (
      <View style={[this.styles.container, { height: screenHeight }]}>
        <ScrollView >
          <View style={this.styles.textContainer}  >
          <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>The Vachan Project</Text>
            <Text style={this.styles.textStyle} textBreakStrategy={'simple'}>
              VachanOnline is a premier cross platfrom Bible study tool in Indian languages. VachanGo is a companion mobile app for this website. The Vachan Project  (<Text textBreakStrategy={'simple'} style={this.styles.linkText} onPress={() => { Linking.openURL('http://thevachanproject.in/') }}>http://thevachanproject.in</Text>) was established to provide free access to digital scripture engagement resources. You are free to use this for your personal Bible study or small groups, gatherings. Please note that many of the resources available are copyrighted. These are being made available here at VachanOnline under multiple licensing arrangements. Hence, the content is not for further redistribution in any other format or platform without explicit permission from the original copyright owners.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Content{'\n'}</Text>
              The content on VachanOnline and VachanGo is being made available under a collaborative arrangement among Friends of Agape, unfoldingWord, Wycliffe Associates, Crossway, Bridgeway Publications, Dusty Sandals, BibleProject, and Visual Unit, and Bridge Connectivity Solutions Pvt. Ltd. (BCS) (<Text textBreakStrategy={'simple'} style={this.styles.linkText} onPress={() => { Linking.openURL('https://www.bridgeconn.com') }}>https://www.bridgeconn.com</Text>) who is the localization and technology partner.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Technology{'\n'} </Text>
              BCS team has developed this platform inspired by similar initiatives in other countries. A cloud based, API driven, Biblical Computing engine - VachanEngine is the back-end of this. These Vachan APIs can be made available for digital content delivery on request.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Source Code{'\n'} </Text>
              The Soure Code available a GitHub: 
              <Text style={this.styles.linkText} onPress={() => {Linking.openURL('https://github.com/Bridgeconn/VachanOnline-v2') }}>{'\n'}https://github.com/Bridgeconn/VachanOnline-v2</Text>{'\n'}
              Previous versions used code forked from Digital Bible Society’s Browser Bible-3 (InScript) by John Dyer on GitHub.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Release Notes (30/09/2020) v1.0</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Platform Update:{'\n'}</Text>
              We are making a major technology change in this release. Code from Browser Bible-3 (InScript) is now replaced with a brand new web application in ReactJS powered by Postgres  and Python APIs  (VachanEngine) in the back-end. A companion mobile app written in ReactNative is also being released. The older legacy site will still be available for sometime on <Text style={this.styles.linkText} onPress={() => { Linking.openURL('www.vachanonline.net') }}>www.vachanonline.net</Text>.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Content Additions (using Vachan API’s):{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bibles: Latest versions of IRV Bibles in all available Indian Gateway languages{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Commentary: IRV Notes (Hindi) + Mathew Henry Concise Bible Commentary (English) + Bridgeway Bible Commentary (English){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Dictionary: IRV Dictionary (Hindi){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Infographics: VisualUnit (Hindi){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Audio: IRV NT Bible (Hindi){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Video: BibleProject (English, Hindi & Telugu){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Feature Additions:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Clean Bible reading pane with section-headings.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Parallel 2-pane feature to display Bibles, Commentaries etc.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added Commentary, Dictionary, & Infographics{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added Audio Player.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Embedded YouTube Video Player.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Embedded YouTube Video Player.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Personalisation using simple login.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bookmarks, Highlights & Notes.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Basic Bible search.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Changed website colors.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Dynamic Data powered by VachanEngine{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Operations Update:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added DigitalOcean Spaces with CDN to serve Audio & Video {'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added Firebase for personalisation and synchronisation {'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Contact Us</Text>
              thevachanproject@gmail.com
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}

export default connect(mapStateToProps, null)(About)
