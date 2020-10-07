import ApiUtils from './ApiUtils'
const API_BASE_URL = 'https://api.vachanonline.net/v1/'
const GIT_BASE_API = 'https://github.com/Bridgeconn/vachancontentrepository/raw/master/'
const OWN_BASE_URL = 'https://raw.githubusercontent.com/neetuy/BibleContent/master/jpg_files/'

var APIFetch = {

    async getChapterContent(sourceId, bookId, chapterNum) {
        try {
            return await fetch(API_BASE_URL + "bibles" + "/" + sourceId + "/" + "books" + "/" + bookId + "/" + "chapter" + "/" + chapterNum, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },
    async getAllBooks(sourceId, type) {
        try {
            return await fetch(API_BASE_URL + "bibles" + "/" + sourceId + "/" + type, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },

    async availableAudioBook(language_code, version) {
        const version_code = version.toLowerCase()
        try {
            return await fetch(GIT_BASE_API + "audio_bibles" + "/" + language_code + "/" + version_code + "/" + "manifest.json", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>e)
        } catch (error) {
            return error;
        }
    },

    async getInfographics(language_code) {
        try {
            return await fetch(API_BASE_URL +"infographics/"+ language_code, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async getDictionaries() {
        try {
            return await fetch(API_BASE_URL +"dictionaries", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },

    async fetchWord(sourceId, wordId) {
        try {
            return await fetch(API_BASE_URL+'dictionaries/' + sourceId + "/" + wordId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e =>  e)
        } catch (error) {
            return error;
        }
    },
    async fetchBookInLanguage() {
        try {
            return await fetch(API_BASE_URL+'booknames', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },
    async searchText(sId, text) {
        try {
            return await fetch(API_BASE_URL+'search/' + JSON.parse(sId) + '?keyword=' + text, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    },
    async fetchVideo(language_code){
        try {
            return await fetch(API_BASE_URL+'videos?language='+language_code,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => e)
        } catch (error) {
            return error;
        }
    }
}
export default APIFetch;