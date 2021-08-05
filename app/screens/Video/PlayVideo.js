import React, { Component } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { bookStyle } from './styles.js'
import {
    View,
    Text,
    ActivityIndicator,
    AppState
} from 'react-native';
import { connect } from 'react-redux'

class PlayVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url:this.props.route.params ?this.props.route.params.url : null,
            title: this.props.route.params ? this.props.route.params.title : null,
            description: this.props.route.params? this.props.route.params.description : null,
            theme: this.props.route.params ? this.props.route.params.theme : null,
            playing: false,
            isLoading: false
        }
        this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);

    }
    componentDidMount() {
       
        this.onChangeState()
    }
    onError = () => alert('Oh! ', error);
    onReady() {
        this.setState({ playing: this.state.playing })
    }
    onChangeState(event) {
        if (event === undefined) {
            this.setState({ isLoading: true })
        } else {
            this.setState({ isLoading: false })
        }
    }
    handleYoutubePlay = (currentAppState) => {
        if (currentAppState == "background") {
            this.setState({ playing: false, })
        }
        if (currentAppState == "inactive") {
            this.setState({ playing: false })
        }
        if (currentAppState == "active") {
            this.setState({ playing: true })
        }
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            headerTitle: this.state.theme
        })
        this.setState({playing:true})
        AppState.addEventListener('change', this.handleYoutubePlay)
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleYoutubePlay);
    }

    render() {
        return (
            <View style={this.styles.container}>
                <Text style={this.styles.title}>
                    {this.state.title}
                </Text>
                {this.state.isLoading ? <View style={{ justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator animate={true} size={32} /></View> : null}
                <YoutubePlayer
                    ref={'playerRef'}
                    height={'36%'}
                    width={'100%'}
                    videoId={this.state.url}
                    play={this.state.playing}
                    onChangeState={(event) => this.onChangeState(event)}
                    onReady={() => this.onReady}
                    onError={this.onError}
                    volume={50}
                    playbackRate={1}
                />
                <Text style={this.styles.description}>
                    {this.state.description}
                </Text>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
        languageCode: state.updateVersion.languageCode,
        sizeFile: state.updateStyling.sizeFile,
        colorFile: state.updateStyling.colorFile,
    }
}

export default connect(mapStateToProps, null)(PlayVideo)
