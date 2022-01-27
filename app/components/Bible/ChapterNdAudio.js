import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Player from '../Audio/Player'
import Color from '../../utils/colorConstants'

const ChapterNdAudio = ({
    styles, audio,
    currentVisibleChapter, queryBookFromAPI, bookId, status, visibleParallelView, showBottomBar,
    totalChapters, languageCode, versionCode, nextContent, previousContent, downloaded
}) => (
        <View style={{ justifyContent: (currentVisibleChapter != 1 && currentVisibleChapter == currentVisibleChapter != totalChapters) ? 'center' : 'space-around', alignItems: 'center' }}>
            {
                ((currentVisibleChapter == 1 && downloaded == true) || (previousContent && Object.keys(previousContent).length == 0 && previousContent.constructor === Object)) ? null :
                    <View style={[styles.bottomBarPrevView, showBottomBar ? styles.showBottomBar : styles.hideBottomBar, visibleParallelView ?
                        styles.bottomBarParallelPrevView : styles.bottomBarPosition]}>
                        <Icon name={'chevron-left'} color={Color.Blue_Color} size={visibleParallelView ? 16 : 32}
                            style={styles.bottomBarChevrontIcon}
                            onPress={()=>queryBookFromAPI(downloaded ? false : previousContent)}
                        />
                    </View>
            }
            {
                audio && (
                    status && <View style={[styles.bottomBarAudioCenter, showBottomBar ? styles.showBottomBar : styles.hideBottomBar]}>
                        <Player
                            styles={styles}
                            languageCode={languageCode}
                            versionCode={versionCode}
                            bookId={bookId}
                            chapter={currentVisibleChapter}
                        />
                    </View>)
            }
            {
                ((currentVisibleChapter == totalChapters && downloaded) || (nextContent && Object.keys(nextContent).length == 0 && nextContent.constructor === Object)) ? null :
                    <View style={[styles.bottomBarNextView, showBottomBar ? styles.showBottomBar : styles.hideBottomBar, visibleParallelView ?
                        styles.bottomBarNextParallelView : styles.bottomBarPosition]}>
                        <Icon name={'chevron-right'} color={Color.Blue_Color} size={visibleParallelView ? 16 : 32}
                            style={styles.bottomBarChevrontIcon}
                            onPress={()=>queryBookFromAPI(downloaded ? true : nextContent)}
                        />
                    </View>
            }
        </View>
    )

export default ChapterNdAudio


