import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import { fetchParallelBible, fetchVersionBooks } from '../../store/action'
import { styles } from './styles';
import { connect } from 'react-redux'
import { getResultText } from '../../utils/UtilFunctions'
import { Header, Button, Right, Title } from 'native-base'
import Color from '../../utils/colorConstants'
import ReloadButton from '../ReloadButton';
import vApi from '../../utils/APIFetch';

class BibleChapter extends Component {
    constructor(props) {
        super(props)
        this.styles = styles(this.props.colorFile, this.props.sizeFile);
        this.state = {
            currentParallelViewChapter: JSON.parse(this.props.currentChapter),
            bookId: this.props.bookId,
            bookName: this.props.bookName,
            totalChapters: this.props.totalChapters,
            error: null,
        }
        this.alertPresent = false
    }
    queryParallelBible = (val) => {
        this.setState({ currentParallelViewChapter: val != null ? this.state.currentParallelViewChapter + val : this.props.currentChapter }, () => {
            this.props.fetchParallelBible({
                isDownloaded: false, sourceId: this.props.parallelLanguage.sourceId,
                language: this.props.parallelLanguage.languageName,
                version: this.props.parallelLanguage.versionCode,
                bookId: this.props.bookId,
                chapter: this.state.currentParallelViewChapter
            })
        })
    }
    getRef = (item) => {
        this.setState({
            currentParallelViewChapter: item.chapterNumber,
            id: item.bookId,
            bookName: item.bookName,
            totalChapters: item.totalChapters
        }, () => {
            this.props.fetchParallelBible({
                isDownloaded: false, sourceId: this.props.parallelLanguage.sourceId,
                language: this.props.parallelLanguage.languageName, version: this.props.parallelLanguage.versionCode,
                bookId: item.bookId, chapter: item.chapterNumber
            })

        })
    }

    async componentDidMount() {
        this.queryParallelBible(null)
        try {
                let bookName=''
                let bookId=''
                let response = await vApi.get('booknames')
                for (var i = 0; i <= response.length-1; i++) {
                    if (this.props.parallelLanguage.languageName.toLowerCase() == response[i].language.name) {
                        for (var j = 0; j <= response[i].bookNames.length - 1; j++) {
                            if (response[i].bookNames[j].book_code == this.state.bookId) {
                                bookName = response[i].bookNames[j].short
                                bookId = response[i].bookNames[j].book_code
                            }
                        }
                    }
                }
                this.setState({ bookName: bookName,bookId:bookId })
        } catch (error) {
            this.setState({ error: error });
        }
    }
    componentWillUnmount() {
        // to get the books name in language for single reading page
        this.props.books.length = 0;
        this.props.fetchVersionBooks({
            language: this.props.language,
            versionCode: this.props.versionCode,
            downloaded: this.props.downloaded, sourceId: this.props.sourceId
        })
    }
    errorMessage() {
        if (!this.alertPresent) {
            this.alertPresent = true;
            if (this.props.error || this.state.error) {
                Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
            } else {
                this.alertPresent = false;
            }
        }
    }

    updateData = () => {
        if (this.props.error) {
            this.errorMessage()
            this.queryParallelBible(null)
        }
        else {
            return
        }
    }
    goToSelectionTab = () => {
        this.props.navigation.navigate("SelectionTab", {
            getReference: this.getRef, parallelContent: true, bookId: this.state.bookId, bookName: this.state.bookName,
            chapterNumber: this.state.currentParallelViewChapter, totalChapters: this.state.totalChapters,
            language: this.props.parallelLanguage.languageName, version: this.props.parallelLanguage.versionCode,
            sourceId: this.props.parallelLanguage.sourceId, downloaded: false,
        })

    }
    render() {
        let shortbookName = this.props.language.toLowerCase() == ('malayalam' || 'tamil' || 'kannada') ?
        (this.state.bookName.length > 4 ? this.state.bookName.slice(0, 3) + "..." : this.state.bookName) :
        this.state.bookName.length > 8 ? this.state.bookName.slice(0, 7) + "..." : this.state.bookName
        this.styles = styles(this.props.colorFile, this.props.sizeFile);
        return (
            <View style={this.styles.container}>
                <Header style={{ backgroundColor: Color.Blue_Color, height: 40, borderLeftWidth: 0.2, borderLeftColor: Color.White }}>
                    <Button transparent onPress={this.goToSelectionTab}>
                        <Title style={{ fontSize: 16 }}>{shortbookName} {this.state.currentParallelViewChapter}</Title>
                        <Icon name="arrow-drop-down" color={Color.White} size={20} />
                    </Button>
                    <Right>
                        <Button transparent onPress={() => this.props.toggleParallelView(false)}>
                            <Icon name='cancel' color={Color.White} size={20} />
                        </Button>
                    </Right>
                </Header>
                {this.props.isLoading &&
                    <Spinner
                        visible={true}
                        textContent={'Loading...'}
                    />}
                {
                    (this.props.error) ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ReloadButton
                                styles={this.styles}
                                reloadFunction={this.queryParallelBible}
                            />
                        </View>
                        :
                        <View style={{ flex: 1 }}>
                            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false} ref={(ref) => { this.scrollViewRef = ref; }} >
                                {this.props.parallelBible.map((verse, index) =>
                                    <View style={{ marginHorizontal: 16, paddingTop: 8 }}>
                                        {verse.number == 1 ?
                                            <Text letterSpacing={24}
                                                style={this.styles.verseWrapperText}>
                                                <Text style={this.styles.sectionHeading}>
                                                    {verse.metadata ? (verse.metadata[0].section && verse.metadata[0].section.text + "\n") : null}
                                                </Text>
                                                <Text style={this.styles.verseChapterNumber} >
                                                    {this.state.currentParallelViewChapter}{" "}
                                                </Text>
                                                <Text style={this.styles.textString}
                                                >
                                                    {getResultText(verse.text)}
                                                </Text>
                                            </Text>
                                            :
                                            <Text letterSpacing={24}
                                                style={this.styles.verseWrapperText}>
                                                <Text style={this.styles.sectionHeading}>
                                                    {verse.metadata ? (verse.metadata[0].section && verse.metadata[0].section.text + "\n") : null}
                                                </Text>
                                                <Text style={this.styles.verseNumber} >
                                                    {verse.number}{" "}
                                                </Text>
                                                <Text style={this.styles.textString}
                                                >
                                                    {getResultText(verse.text)}
                                                </Text>
                                            </Text>
                                        }
                                    </View>
                                )}
                                <View style={this.styles.addToSharefooterComponent}>
                                    {
                                        <View style={this.styles.footerView}>
                                            {(this.props.parallelMetaData.revision !== null && this.props.parallelMetaData.revision !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Copyright:</Text>{' '}{this.props.parallelMetaData.revision}</Text>}
                                            {(this.props.parallelMetaData.license !== null && this.props.parallelMetaData.license !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>License:</Text>{' '}{this.props.parallelMetaData.license}</Text>}
                                            {(this.props.parallelMetaData.technologyPartner !== null && this.props.parallelMetaData.technologyPartner !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Technology partner:</Text>{' '}{this.props.parallelMetaData.technologyPartner}</Text>}
                                        </View>
                                    }
                                </View>
                            </ScrollView>

                            <View style={{ justifyContent: (this.state.currentParallelViewChapter != 1 && this.state.currentParallelViewChapter == this.state.currentParallelViewChapter != this.state.totalChapters) ? 'center' : 'space-around', alignItems: 'center' }}>
                                {
                                    this.state.currentParallelViewChapter == 1 ? null :
                                        <View style={this.styles.bottomBarParallelPrevView}>
                                            <Icon name={'chevron-left'} color={Color.Blue_Color} size={16}
                                                style={this.styles.bottomBarChevrontIcon}
                                                onPress={() => this.queryParallelBible(-1)}
                                            />
                                        </View>
                                }
                                {
                                    this.state.currentParallelViewChapter == this.state.totalChapters ? null :
                                        <View style={this.styles.bottomBarNextParallelView}>
                                            <Icon name={'chevron-right'} color={Color.Blue_Color} size={16}
                                                style={this.styles.bottomBarChevrontIcon}
                                                onPress={() => this.queryParallelBible(1)}
                                            />
                                        </View>
                                }
                            </View>
                        </View>

                }
            </View>
        )
    }

}


const mapStateToProps = state => {
    return {
        sizeFile: state.updateStyling.sizeFile,
        colorFile: state.updateStyling.colorFile,
        books: state.versionFetch.data,
        language: state.updateVersion.language,
        versionCode: state.updateVersion.versionCode,
        sourceId: state.updateVersion.sourceId,
        downloaded: state.updateVersion.downloaded,
        bookId:state.updateVersion.bookId,
        bookName:state.updateVersion.bookName,
        parallelBible: state.parallel.parallelBible,
        error: state.parallel.error,
        loading: state.parallel.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchParallelBible: (data) => dispatch(fetchParallelBible(data)),
        fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BibleChapter)