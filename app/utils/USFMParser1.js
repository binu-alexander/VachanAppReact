import DbQueries from './dbQueries'
import id_name_map from '../assets/mappings.json'
const Constants = require('./constants')

var RNFS = require('react-native-fs');

export default class USFMParser {

    constructor() {
        this.bookId = null;
        this.chapterList = [];
        this.verseList = [];
        this.mappingData = id_name_map;
        this.bookModel = null
        // this.languageCode = "";
        // this.languageName = "";
        // this.versionCode = "";
        // this.versionName = "";
        // this.source = "BridgeConn";
        // this.year = 2017;
        // this.license = "CCSA";
    }

    // parseFile(path, lCode, lName, vCode, vName, source, license, year, fromAssets) {
    //     this.languageCode = lCode;
    //     this.languageName = lName;
    //     this.versionCode = vCode;
    //     this.versionName = vName;
    //     this.source = source;
    //     this.license = license;
    //     this.year = year;

    //     if (fromAssets) {
    //         RNFS.readFileAssets(path)
    //             .then((result)=>{
    //                 this.parseFileContents(result);
    //             });
    //     } else {
    //         RNFS.readFile(path)
    //             .then((result)=>{
    //                 this.parseFileContents(result);
    //             });
    //     }
    // }
    
    parseFile(result,chapter) {
         console.log("result in parse file "+JSON.stringify(result))
        // this.languageCode = lCode;
        // this.languageName = lName;
        // this.versionCode = vCode;
        // this.versionName = vName;
        // this.source = source;
        // this.license = license;
        // this.year = year;
        return this.parseFileContents(result,chapter);
    }

    // parseFile() {
    //     this.languageCode =  "HIN",
    //     this.languageName = "Hindi",
    //     this.versionCode = "IRV",
    //     this.versionName = "Indian Revised Version",
    //     this.source = "Unfolding Word",
    //     this.license = "V5.0 (Consultant Checked)",
    //     this.year = 2018;
        
    // }

    parseFileContents(result,chapter) {
        console.log("CHAPTER in parse CONTENT "+chapter)
        console.log("result "+result)
        try {
            // console.log("line length",result.length)
            // if(id == )
            var lines = result.split("\n")
            for(var i = 0; i <lines.length; i++) {
                
                //code here using lines[i] which will give you each line
                if (!this.processLine(lines[i],chapter)) {
                    return false;
                }
            }
            this.addComponentsToChapter();
            return this.addBookToContainer();
        } catch(exception) {
            console.log("error in parsing file : " + exception)
        }
    }

    processLine(line,chapter){
        console.log("CHAPTER in process "+chapter)

        var splitString = line.split(/\s+/);
        if (splitString.length == 0) {
            return true;
        }
        switch (splitString[0]) {
            case Constants.MarkerConstants.MARKER_BOOK_NAME: {
                if (!this.addBook(splitString[1])) {
                    console.log("Skip book, already exist in db, " + splitString[1]);
                    return false;
                }
                break;
            }
            case Constants.MarkerConstants.MARKER_CHAPTER_NUMBER: {
                this.addChapter(splitString[1],chapter)
                break;
            }
            case Constants.MarkerConstants.MARKER_NEW_PARAGRAPH: {
                this.addParagraph(splitString, line);
                break;
            }
            case Constants.MarkerConstants.MARKER_VERSE_NUMBER: {
                this.addVerse(splitString)
                break;
            }
            case Constants.MarkerConstants.MARKER_SECTION_HEADING: {
                this.addSection(Constants.MarkerTypes.SECTION_HEADING_ONE, line, splitString);
                break;
            }
            case Constants.MarkerConstants.MARKER_SECTION_HEADING_ONE: {
                this.addSection(Constants.MarkerTypes.SECTION_HEADING_ONE, line, splitString);
                break;
            }
            case Constants.MarkerConstants.MARKER_SECTION_HEADING_TWO: {
                this.addSection(Constants.MarkerTypes.SECTION_HEADING_TWO, line, splitString);
                break;
            }
            case Constants.MarkerConstants.MARKER_SECTION_HEADING_THREE: {
                this.addSection(Constants.MarkerTypes.SECTION_HEADING_THREE, line, splitString);
                break;
            }
            case Constants.MarkerConstants.MARKER_SECTION_HEADING_FOUR: {
                this.addSection(Constants.MarkerTypes.SECTION_HEADING_FOUR, line, splitString);
                break;
            }
            case Constants.MarkerConstants.MARKER_CHUNK: {
                this.addChunk();
                break;
            }
            case "": {
                break;
            }
            default: {
                if (splitString.length == 1) {
                    // add this to the next coming verse
                    this.addFormattingToNextVerse(line);
                } else {
                    // add this to the last verse
                    this.addFormattingToLastVerse(line);
                }
            }
        }
        return true;
    }

    addBook(value) {
        console.log("boook id in parser "+value)
        this.bookId = value.toString().trim()
        return true;
       
    }

    addChapter(num,chapter){
        console.log("CHAPTER  "+chapter)
        var n = parseInt(num.toString().trim() , 10)
        if(n == chapter){
        console.log("HI IM CHAPTER IF ")
        console.log("HI IM CHAPTER  "+n)
        this.addComponentsToChapter()
        var number = chapter
        var chapterModel = {chapterNumber: number, numberOfVerses: 0, verseComponentsModels: []};
        this.chapterList.push(chapterModel);
        console.log("chapter id in parser "+JSON.stringify(this.chapterList))
        }
    }

    addChunk() {
        var verseComponentsModel = {type: Constants.MarkerTypes.CHUNK, verseNumber: "", 
            text: "",added: true, 
            languageCode: this.languageCode, versionCode: this.versionCode, bookId: this.bookId, 
            chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
        this.verseList.push(verseComponentsModel);
    }

    addSection(markerType, line, splitString){
        var res = "";
        if (splitString.length > 1) {
            var res = line.slice(3)
        }
        var verseComponentsModel = {type: markerType, verseNumber: "", 
            text: res,added: true, 
            languageCode: this.languageCode, versionCode: this.versionCode, bookId: this.bookId, 
            chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
        this.verseList.push(verseComponentsModel);
    }

    addParagraph(splitString, line) {
        var res = "";
        if (splitString.length > 1) {
            res = line.slice(3);
        }
        var verseComponentsModel = {type: Constants.MarkerTypes.PARAGRAPH, verseNumber: "", 
            text: res, added: true, 
            languageCode: this.languageCode, versionCode: this.versionCode, bookId: this.bookId, 
            chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
        this.verseList.push(verseComponentsModel);
    }

    addVerse(splitString) {
        var tempRes = [];
        for (var i=0; i<this.verseList.length; i++) {
            var verseModel = this.verseList[i];
            if (!verseModel.added) {
                tempRes.push(verseModel.text);
            }
        }
        var res = tempRes.join("");
        var j = this.verseList.length;
        while (j--) {
            if (!this.verseList[j].added) {
                this.verseList.splice(j, 1);
            }
        }
        var verseNum = splitString[1];
        var intString = verseNum.replace(/[^0-9]/g, "");
        var notIntString = verseNum.replace(/[0-9]/g, "");
        if (intString == "") {
            return;
        }
        if (!(notIntString == "" || notIntString == "-")) {
            return;
        }
        tempRes = [];
        for (var i=2; i<splitString.length; i++) {
            tempRes.push(splitString[i]);
        }
        for (var i=this.verseList.length - 1; i>=0; i--) {
            if (this.verseList[i].verseNumber == "") {
                this.verseList[i].verseNumber = splitString[1];
            } else {
                break;
            }
        }
        var result = res + tempRes.join(" ");
        var verseComponentsModel = {type: Constants.MarkerTypes.VERSE, verseNumber: splitString[1], 
            text: result, added: true, 
            languageCode: this.languageCode, versionCode: this.versionCode, bookId: this.bookId, 
            chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
        this.verseList.push(verseComponentsModel);
    }

    // addFootNotes(notes,verseNum){
    //     const noteData = notes.toString()
    //     if(notes.length == 0) {
    //         return 
    //     }
    //     // const fullStringNote = /((\\f\s+\+\s+\\fr\s+)(\d+\.\d+)(.*?)(\\f\*))/g
    //     const fqTag = /((\\fr(.*?)\\fq\s+)(.*?)(\\ft))/g
    //     const fullStringNote =/((\\fr(.*?)\\fq)((.*?)\\ft.*))/g
    //     const fTag = /((\\f\s+\+)(.*?)(\\f\*))/g
    //     const noteContent = noteData.replace(fTag,'$3')

    //     // const foootNoteRef = noteData.replace(fullStringNote,'$3')
    //     const footNotequotation = noteContent.replace(fullStringNote,'$5')
    //     const foootNoteText = noteContent.replace(fqTag,'')

    //     // console.log("FOOTNOTE TEXT "+foootNoteText+" FOOTNOTE REFERENCE "+foootNoteRef+" FOOTNOTES QUOTATION "+footNotequotation)
    //     var verseComponentsModel = {type:Constants.MarkerTypes.MARKER_FOOT_NOTES_QUOTATION, 
    //     verseNumber:verseNum, 
    //     text:footNotequotation, highlighted: false, added: true, 
    //     languageCode: this.languageCode, versionCode: this.versionCode, bookId: this.bookId, 
    //     chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
    //     this.verseList.push(verseComponentsModel)

    //     var verseComponentsModel = {type:Constants.MarkerTypes.MARKER_FOOT_NOTES_TEXT, 
    //         verseNumber:verseNum, 
    //         text:foootNoteText, highlighted: false, added: true, 
    //         languageCode: this.languageCode, versionCode: this.versionCode, bookId: this.bookId, 
    //         chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
    //     this.verseList.push(verseComponentsModel)

    // }

    addComponentsToChapter() {
        if (this.chapterList.length > 0) {
            if (this.verseList.length > 0) {
                for (var i=0; i<this.verseList.length; i++) {
                    if (this.verseList[i].verseNumber != null) {
                        this.chapterList[this.chapterList.length - 1].verseComponentsModels.push(this.verseList[i]);
                    }
                }
                var size = 0;
                for (var i=0; i< this.verseList.length; i++) {
                    if (this.verseList[i].verseNumber != null) {
                        if (i == 0 || this.verseList[i].verseNumber != this.verseList[i-1].verseNumber) {
                            size = size + 1;
                        }
                    }
                }
                this.chapterList[this.chapterList.length - 1].numberOfVerses = size;
                var j = this.verseList.length;
                while (j--) {
                    if (this.verseList[j].verseNumber != null) {
                        this.verseList.splice(j, 1);
                    }
                }
            }
        }
    }

    getBookNameFromMapping(bookId) {
        var obj = this.mappingData.id_name_map;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key == bookId) {
                    var val = obj[key];
                    return val;
                }
            }
        }
        return null;
    }

    addBookToContainer() {
        console.log("bookid "+this.bookId)
        var mapResult = this.getBookNameFromMapping(this.bookId);
        if (mapResult == null) {
            return;
        }
        const bookModel = {chapterModels: this.chapterList}
            return bookModel
       
        console.log("ADD BOOK : " +this.bookModel)
    }

    addFormattingToLastVerse(line) {
        if (this.verseList.length > 0) {
            var res = this.verseList[this.verseList.length - 1].text + " \n " + line + " ";
            this.verseList[this.verseList.length - 1].text = res;
        }
    }

    addFormattingToNextVerse(line) {
        var verseComponentsModel = {type: "", verseNumber: "", 
            text: " " + line + " ", added: false, 
            languageCode: this.languageCode, versionCode: this.versionCode, bookId: this.bookId, 
            chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
        this.verseList.push(verseComponentsModel);
    }
}