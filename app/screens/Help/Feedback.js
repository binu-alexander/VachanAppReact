import React, { Component } from 'react';
import { WebView } from 'react-native-webview'

export default class Feedback extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {

        return (
            <WebView
                source={{
                    uri: 'https://docs.google.com/forms/d/e/1FAIpQLSd75swOEtsvWrzcQrynmCsu-ZZYktWbeeJXVxH7zNz-JIlEdA/viewform'
                }}
            />
        );
    }
};

