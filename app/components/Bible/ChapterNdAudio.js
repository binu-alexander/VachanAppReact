import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Player from '../Audio/Player'
import Color from '../../utils/colorConstants'
import { connect } from "react-redux";

const ChapterNdAudio = (props) => (
        <View style={{ justifyContent: (props.currentVisibleChapter != 1 && props.currentVisibleChapter == props.currentVisibleChapter != props.totalChapters) ? 'center' : 'space-around', alignItems: 'center' }}>
            {
                ((props.currentVisibleChapter == 1 && props.downloaded == true) || (props.previousContent && Object.keys(props.previousContent).length == 0 && props.previousContent.constructor === Object)) ? null :
                    <View style={[props.styles.bottomBarPrevView, props.showBottomBar ? props.styles.showBottomBar : props.styles.hideBottomBar, props.visibleParallelView ?
                        props.styles.bottomBarParallelPrevView : props.styles.bottomBarPosition]}>
                        <Icon name={'chevron-left'} color={Color.Blue_Color} size={props.visibleParallelView ? 16 : 32}
                            style={props.styles.bottomBarChevrontIcon}
                            onPress={()=>props.queryBookFromAPI(props.downloaded ? false : props.previousContent)}
                        />
                    </View>
            }
            {
                props.audio && (
                    props.status && <View style={[props.styles.bottomBarAudioCenter, props.showBottomBar ? props.styles.showBottomBar : props.styles.hideBottomBar]}>
                        <Player
                            styles={props.styles}
                            chapter={props.currentVisibleChapter}
                        />
                    </View>)
            }
            {
                ((props.currentVisibleChapter == props.totalChapters && props.downloaded) || (props.nextContent && Object.keys(props.nextContent).length == 0 && props.nextContent.constructor === Object)) ? null :
                    <View style={[props.styles.bottomBarNextView, props.showBottomBar ? props.styles.showBottomBar : props.styles.hideBottomBar, props.visibleParallelView ?
                        props.styles.bottomBarNextParallelView : props.styles.bottomBarPosition]}>
                        <Icon name={'chevron-right'} color={Color.Blue_Color} size={props.visibleParallelView ? 16 : 32}
                            style={props.styles.bottomBarChevrontIcon}
                            onPress={()=>props.queryBookFromAPI(props.downloaded ? true : props.nextContent)}
                        />
                    </View>
            }
        </View>
    )
    const mapStateToProps = (state) => {
        return {
          language: state.updateVersion.language,
          languageCode: state.updateVersion.languageCode,
          versionCode: state.updateVersion.versionCode,
      
          chapterNumber: state.updateVersion.chapterNumber,
          totalChapters: state.updateVersion.totalChapters,
          bookName: state.updateVersion.bookName,
          bookId: state.updateVersion.bookId,
          downloaded: state.updateVersion.downloaded,
          visibleParallelView: state.selectContent.visibleParallelView,
        };
      };
      
      
export default connect(mapStateToProps)(ChapterNdAudio);


