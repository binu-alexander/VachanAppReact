import ApiUtils from './ApiUtils'
const API_BASE_URL = 'https://api.autographamt.com/v1/'
const GIT_BASE_API = 'https://github.com/Bridgeconn/vachancontentrepository/raw/master/audio_bibles/'

var APIFetch = {
    async getLanguages() {
        try {
            return await fetch(API_BASE_URL + "languages", {
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

    async getVersions() {
        try {
            return await fetch(API_BASE_URL + "bibles", {
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
    async getContent(sourceId, type, bookId) {
        try {
            // console.log("source id  "+sourceId+" type "+type+"book num "+bookNum)
            // var chapter = chapterNum  === undefined ? '' : '/' + chapterNum
            return await fetch(API_BASE_URL + "bibles" + '/' + sourceId + '/' + "books" + '/' + bookId + '/' + type, {
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
    async availableBooks(sourceId) {
        try {
            return await fetch(API_BASE_URL + "bibles" + "/" + sourceId + "/" + "books", {
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
    async getNumberOfChapter(sourceId, bookId) {
        try {
            return await fetch(API_BASE_URL + "bibles" + "/" + sourceId + "/" + "books" + "/" + bookId + "/" + "chapters", {
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
                .catch(e => console.log("erorr fetching all books ", e))
        } catch (error) {
            console.log("error on getting all books ", error)
            return error;
        }
    },
    async getAudioBible(language_code,version,bookId,chapter) {
        const version_code = version.toLowerCase() 
        // const book_code = bookId.toLowerCase()
        try {
            return await fetch(GIT_BASE_API + language_code + "/" + version_code + "/" + bookId + "/" + chapter + ".mp3", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response)
                .catch(e => console.log("erorr fetching all books ", e))
        } catch (error) {
            console.log("error on getting all books ", error)
            return error;
        }
    },
    async availableAudioBook(language_code,version) {
        console.log("anguage_code,version ",language_code,version)
        const version_code = version.toLowerCase() 
        // const book_code = bookId.toLowerCase()
        try {
            return await fetch(GIT_BASE_API + language_code + "/" + version_code + "/" + "manifest.json", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(ApiUtils.checkStatus)
                .then((response) => response.json())
                .catch(e => console.log("erorr fetching all books ", e))
        } catch (error) {
            console.log("error on getting all books ", error)
            return error;
        }
    },



}
export default APIFetch;