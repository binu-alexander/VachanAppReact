import React,{useContext} from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Player from '../Audio/Player'
import Color from '../../utils/colorConstants'
import { connect } from "react-redux";
import { bibleContext } from '../../screens/Bible';

const ChapterNdAudio = (props) => {
    const [{audio, currentVisibleChapter,styles,status,queryBookFromAPI,nextContent,previousContent,showBottomBar}] = useContext(bibleContext);
  
    return(
        <View style={{ justifyContent: (currentVisibleChapter != 1 && currentVisibleChapter == currentVisibleChapter != props.totalChapters) ? 'center' : 'space-around', alignItems: 'center' }}>
            {
                ((currentVisibleChapter == 1 && props.downloaded == true) || (previousContent && Object.keys(previousContent).length == 0 && previousContent.constructor === Object)) ? null :
                    <View style={[styles.bottomBarPrevView, showBottomBar ? styles.showBottomBar : styles.hideBottomBar, props.visibleParallelView ?
                        styles.bottomBarParallelPrevView : styles.bottomBarPosition]}>
                        <Icon name={'chevron-left'} color={Color.Blue_Color} size={props.visibleParallelView ? 16 : 32}
                            style={styles.bottomBarChevrontIcon}
                            onPress={()=>queryBookFromAPI(props.downloaded ? false : previousContent)}
                        />
                    </View>
            }
            {
                audio && (
                    status && <View style={[styles.bottomBarAudioCenter, showBottomBar ? styles.showBottomBar : styles.hideBottomBar]}>
                        <Player
                            styles={styles}
                            chapter={currentVisibleChapter}
                        />
                    </View>)
            }
            {
                ((currentVisibleChapter == props.totalChapters && props.downloaded) || (nextContent && Object.keys(nextContent).length == 0 && nextContent.constructor === Object)) ? null :
                    <View style={[styles.bottomBarNextView, showBottomBar ? styles.showBottomBar : styles.hideBottomBar, props.visibleParallelView ?
                        styles.bottomBarNextParallelView : styles.bottomBarPosition]}>
                        <Icon name={'chevron-right'} color={Color.Blue_Color} size={props.visibleParallelView ? 16 : 32}
                            style={styles.bottomBarChevrontIcon}
                            onPress={()=>queryBookFromAPI(props.downloaded ? true : nextContent)}
                        />
                    </View>
            }
        </View>
    )
}
    const mapStateToProps = (state) => {
        return {
          totalChapters: state.updateVersion.totalChapters,
          downloaded: state.updateVersion.downloaded,
          visibleParallelView: state.selectContent.visibleParallelView,
        };
      };
      
      
export default connect(mapStateToProps)(ChapterNdAudio);


