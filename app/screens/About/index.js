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
            <Text style={this.styles.textStyle} textBreakStrategy={'simple'}>
              The Vachan Project is the technology umbrella under which free access to digital scripture engagement resources is made available to all. As part of this project the Vachan Online (<Text textBreakStrategy={'simple'} style={this.styles.linkText} onPress={() => { Linking.openURL('https://vachanonline.net/') }}>www.vachanonline.net</Text>) website and the Vachan Go companion mobile app have been developed for public use. The Vachan Project is an initiative of the Friends of Agape (FOA), USA. The content herein is not for reuse or redistribution in any other format or platform without explicit permission as multiple licensing strategies are involved.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Translation Partners:{'\n'}</Text>
                Bridge Connectivity Solutions Pvt. Ltd. (BCS) and its translation/localization partners; unfoldingWord, Wycliffe Associates, Crossway, Bridgeway Publications, BibleProject, and Visual Unit are involved in localisation of content and providing licenses to use on this site.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Technology Provider:{'\n'} </Text>
                Bridge Connectivity Solutions Pvt. Ltd. (BCS) developed this platform with an in-house team of developers inspired from similar websites in other countries.  VachanEngine powers the backend.
                Permission to use Vachan APIs can be be provided for similar digital content delivery for products with like minded vision. Please contact us at <Text style={this.styles.linkText} onPress={() => { Linking.openURL('thevachanproject@gmail.com') }}>thevachanproject@gmail.com</Text>. Also visit our company website <Text style={this.styles.linkText} textBreakStrategy={'simple'} onPress={() => { Linking.openURL('www.bridgeconn.com') }}>www.bridgeconn.com</Text> {'\n'}
              <Text textBreakStrategy={'simple'} style={{ fontWeight: 'bold' }}>{'\n'} Contact Us </Text>
              <Text style={this.styles.linkText} onPress={() => { Linking.openURL('thevachanproject@gmail.com') }}>{'\n'}thevachanproject@gmail.com</Text>
              <Text textBreakStrategy={'simple'} style={{ fontWeight: 'bold' }}>{'\n'}Release Notes (13/07/2020) v1.0 {'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Platform:{'\n'}</Text>
                The Vachan Online web application is developed in ReactJS enabled by Postgres APIs  (VachanEngine) in the back-end. The companion mobile app Vachan Go is written in ReactNative. {'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Content Additions (using Vachan API’s):{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bibles: Updated versions of IRV Bibles in all available Indian Gateway languages.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Commentary: IRV Notes (Hindi) + Mathew Henry Concise Bible Commentary (English) + Bridgeway Bible Commentary (English) + ESV Global Study Bible Notes (English).{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Dictionary: IRV Dictionary (Hindi){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Infographics: VisualUnit (Hindi)* {'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Audio: IRV NT Bible (Hindi){'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Video: BibleProject (English, Hindi & Telugu) *{'\n'}
                * Not available on the Vachan Go companion mobile app{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.TitleText}>{'\n'}Feature Additions:{'\n'}</Text>
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Cleaner Bible reading pane with section-headings.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Parallel 2-pane feature to display Bibles and other content.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added Commentary, Dictionary, & Infographics{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Added Audio Player.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Embedded YouTube Video Player.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Personalisation and sync using simple login.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Bookmarks, Highlights & Notes.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Basic Bible search.{'\n'}
              <Text textBreakStrategy={'simple'} style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>Personalisation{'\n'}
              <Text textBreakStrategy={'simple'} style={[this.styles.bulletIcon, { padding: 10 }]}>{'\u2022' + " "}</Text>Seamless transfer of User Data between Vachan Online and Vachan Go.{'\n'}

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
