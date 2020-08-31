'use strict';

import Realm from 'realm';
import LanguageModel from '../models/LanguageModel';
import VersionModel from '../models/VersionModel';
import BookModel from '../models/BookModel';
import NoteModel from '../models/NoteModel';
import ChapterModel from '../models/ChapterModel';
import VerseModel from '../models/VerseModel';
import NoteStylingModel from '../models/NoteStylingModel';
import VerseStylingModel from '../models/VerseStylingModel';
import ReferenceModel from '../models/ReferenceModel';
import BookmarksListModel from '../models/BookmarksListModel';
import HighlightsModel from '../models/HighlightsModel';
import HistoryModel from '../models/HistoryModel';
import VerseMetadataModel from '../models/VerseMetadataModel';
import bookNameList from '../models/bookNameList';
import BookmarksBookId from '../models/BookmarksBookId'
import HighlightsBookId from '../models/HighlightsBookId'
import LanguageMetaData from '../models/LanguageMetaData'


import {
	Platform,
} from 'react-native';
var RNFS = require('react-native-fs');

class DbHelper {
	async getRealm() {
		try {
			return await Realm.open({
				schemaVersion: 1,
				deleteRealmIfMigrationNeeded: true,
				path:
					Platform.OS === 'ios'
						? RNFS.MainBundlePath + '/vachan_go.realm'
						: RNFS.DocumentDirectoryPath + '/vachan_go.realm',
				schema: [LanguageModel.schema, LanguageMetaData.schema, VersionModel.schema, BookModel.schema, ChapterModel.schema, VerseModel.schema, NoteModel.schema, NoteStylingModel.schema, VerseStylingModel.schema, ReferenceModel.schema, HistoryModel.schema, BookmarksListModel.schema, HighlightsModel.schema, VerseMetadataModel.schema, bookNameList.schema, BookmarksBookId.schema, HighlightsBookId.schema]
			});
		} catch (err) {
			return null;
		}
	}

	async query(model: string, filter?: string, sort?: string, desc?: bool) {

		let realm = await this.getRealm();
		if (realm) {
			let results = realm.objects(model);
			if (filter) {
				results = results.filtered(filter);
			}
			if (sort) {
				return results = results.sorted(sort, desc);
			}
			return results;
		}
		return null;
	}

	async queryVersionWithCode(verCode: string, langCode: string) {
		let realm = await this.getRealm();
		if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langCode);
			let resultsA = result.versionModels;
			resultsA = resultsA.filtered('versionCode ==[c] "' + verCode + '"');
			return resultsA;
		}
		return null;
	}

	async queryBooksWithCode(verCode: string, langCode: string, text?: string) {
		let realm = await this.getRealm();
		if (realm) {
			let resultsA = realm.objects("BookModel")
			if (resultsA.length > 0) {
				var resultsB = resultsA.filtered('languageName ==[c] "' + langCode + '" && versionCode ==[c] "' + verCode + '" && bookName CONTAINS[c] "' + text + '"').sorted("bookNumber");
				if (resultsB.length > 0) {
					return { bookId: resultsB[0].bookId, bookName: resultsB[0].bookName }
				}
			}
			return null;
		}
		return null;
	}

	async queryInVerseText(verCode: string, langName: string, text: string) {
		let realm = await this.getRealm();
		if (realm) {
			let resultsA = realm.objects("BookModel")
			var resultsB = resultsA.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '"');
			if (resultsB.length > 0) {
				var textValue = []
				for (var i = 0; i <= resultsB.length - 1; i++) {
					for (var j = 0; j <= resultsB[i].chapters.length - 1; j++) {
						var matchedStr = resultsB[i].chapters[j].verses.filtered('text CONTAINS[c] "' + text + '"')
						if (Object.keys(matchedStr).length > 0) {
							textValue.push({
								bookId: resultsB[i].bookId,
								bookName: resultsB[i].bookName,
								chapterNumber: resultsB[i].chapters[j].chapterNumber,
								verseNumber: matchedStr[0].number,
								text: matchedStr[0].text,
							})
						}
					}
				}
				return textValue
			}
		}
		return null;
	}
	async queryHighlights(sourceId, bId, cNum) {
		let realm = await this.getRealm();
		if (realm) {
			let result1 = realm.objects("HighlightsModel");
			if (sourceId == null && bId == null && cNum == null) {
				if (Object.keys(result1).length > 0) {
					return result1
				}
				else {
					return null
				}
			}
			if (bId == null && cNum == null) {
				let highlights = result1.filtered('sourceId == "' + sourceId + '"')
				if (highlights.length > 0) {
					let highlightsId = highlights[0].highlightsBookId
					return highlightsId
				}
				else {
					return null
				}
			}
			else {
				let highlights = result1.filtered('sourceId == "' + sourceId + '"')
				if (highlights.length > 0) {
					let bookmarksId = highlights[0].highlightsBookId
					let res = bookmarksId.filtered('bookId==[c] "' + bId + '"&& chapterNumber==[c] "' + cNum + '"')
					if (Object.keys(res).length > 0) {
						return res
					}
					else {
						return null
					}
				}
				else {
					return null
				}
			}
		}

	}
	async updateHighlightsInVerse(sourceId, bId, chapterNumber, verseNumber, isHighlight) {
		let realm = await this.getRealm()
		var source = parseInt(sourceId)
		let sourcedata = realm.objects('HighlightsModel').filtered('sourceId=="' + source + '"')
		let vNum = parseInt(verseNumber)
		let cNum = parseInt(chapterNumber)
		if (realm) {
			if (isHighlight) {
				realm.write(() => {
					if (Object.keys(sourcedata).length == 0) {
						let highlights = realm.create('HighlightsModel', { sourceId: source, highlightsBookId: [] });
						highlights.highlightsBookId.push({ bookId: bId, chapterNumber: cNum, verseNumber: [vNum] })
					}
					else {
						var addToBook = sourcedata[0].highlightsBookId.filtered('bookId==[c]"' + bId + '"&& chapterNumber==[c]"' + cNum + '"')
						if (Object.keys(addToBook).length == 0) {
							sourcedata[0].highlightsBookId.push({ bookId: bId, chapterNumber: cNum, verseNumber: [vNum] })
						}
						else {
							if (addToBook[0].verseNumber.indexOf(vNum) == -1) {
								addToBook[0].verseNumber.push(vNum)
							}
						}
					}
				})
			}
			else {
				var addToBook = sourcedata[0].highlightsBookId.filtered('bookId==[c]"' + bId + '"&& chapterNumber==[c]"' + cNum + '"')
				var index = addToBook[0].verseNumber.indexOf(vNum)
				if (addToBook[0].verseNumber.indexOf(vNum) != -1) {
					realm.write(() => {
						addToBook[0].verseNumber.splice(index, 1)
					})
				}
			}
		}


	}

	async insert(model: string, value) {
		let realm = await this.getRealm();
		if (realm) {
			realm.write(() => {
				realm.create(model, value);
			});
		}
	}

	async insertNewBook(bookModel, versionModel, languageModel) {
		let realm = await this.getRealm();
		if (realm) {
			var ls = realm.objectForPrimaryKey('LanguageModel', languageModel.languageName);
			if (ls) {
				var pos = -1;
				for (var i = 0; i < ls.versionModels.length; i++) {
					var vModel = ls.versionModels[i];
					if (vModel.versionCode == versionModel.versionCode) {
						pos = i;
						break;
					}
				}
				if (pos > -1) {
					var bModels = ls.versionModels[pos].bookModels;
					// need to push bookmodel
					for (var j = 0; j < bModels.length; j++) {
						if (bModels[j].bookId == bookModel.bookId) {
							return;
						}
					}
					realm.write(() => {
						ls.versionModels[pos].bookModels.push(bookModel);
					});
				} else {
					realm.write(() => {
						ls.versionModels.push(versionModel);
					});
				}
			} else {
				realm.write(() => {
					realm.create('LanguageModel', languageModel);
				});
			}
		}
	}

	async queryBookIdModels(verCode: string, langName: string) {
		let realm = await this.getRealm();
		if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langName);
			let resultsA = result.versionModels;
			resultsA = resultsA.filtered('versionCode == [c] "' + verCode + '"');
			if (resultsA.length > 0) {
				let resultsB = resultsA[0].bookModels.sorted("bookNumber");
				let bookIdModels = [];
				for (var i = 0; i < resultsB.length; i++) {
					var bModel = {
						bookId: resultsB[i].bookId, bookName: resultsB[i].bookName,
						section: resultsB[i].section, bookNumber: resultsB[i].bookNumber,
						languageName: langName, versionCode: verCode, numOfChapters: resultsB[i].chapterModels.length
					};
					bookIdModels.push(bModel);
				}
				return bookIdModels;
			}
			return null;
		}
		return null;
	}



	async updateBookmarkInBook(sourceId, bId, cNum, isBookmark) {
		let realm = await this.getRealm();
		if (realm) {
			var source = parseInt(sourceId)
			let sourcedata = realm.objects('BookmarksListModel').filtered('sourceId=="' + source + '"')
			if (isBookmark) {
				realm.write(() => {
					if (Object.keys(sourcedata).length == 0) {
						let bookmarks = realm.create('BookmarksListModel', { sourceId: source, bookmarksBookId: [] });
						bookmarks.bookmarksBookId.push({ bookId: bId, chapterNumber: [cNum] })
					}
					else {
						var addToBook = sourcedata[0].bookmarksBookId.filtered('bookId=="' + bId + '"')
						if (Object.keys(addToBook).length == 0) {
							sourcedata[0].bookmarksBookId.push({ bookId: bId, chapterNumber: [cNum] })
						}
						else {
							if (addToBook[0].chapterNumber.indexOf(cNum) == -1) {
								addToBook[0].chapterNumber.push(cNum)
							}
						}
					}
				})
			}
			else {
				var addToBook = sourcedata[0].bookmarksBookId.filtered('bookId=="' + bId + '"')
				if (addToBook[0].chapterNumber.indexOf(cNum) > -1) {
					realm.write(() => {
						addToBook[0].chapterNumber.splice(addToBook[0].chapterNumber.indexOf(cNum), 1)
					})
				}

			}
		}

	}
	async queryBookmark(sourceId, bId) {

		let realm = await this.getRealm()
		if (realm) {
			let result1 = realm.objects("BookmarksListModel");
			if (sourceId == null && bId == null) {
				if (Object.keys(result1).length > 0) {
					return result1
				}
				else {
					return null
				}

			}
			else if (bId == null) {
				let bookmarks = result1.filtered('sourceId == "' + sourceId + '"')
				if (bookmarks.length > 0) {
					let bookmarksId = bookmarks[0].bookmarksBookId
					return bookmarksId
				}
			}
			else {
				let bookmarks = result1.filtered('sourceId == "' + sourceId + '"')
				if (bookmarks.length > 0) {
					let bookmarksId = bookmarks[0].bookmarksBookId
					let res = bookmarksId.filtered('bookId==[c] "' + bId + '"')
					if (Object.keys(res).length > 0) {
						return res
					}
					else {
						return null
					}
				}

			}
		}
	}
	async deleteBookmark() {
		let realm = await this.getRealm();
		if (realm) {
			realm.write(() => {
				let bookmarkList = realm.objects('BookmarksListModel')
				let highlights = realm.objects('HighlightsModel')
				realm.delete(bookmarkList);
				realm.delete(highlights);

			})
		}
	}
	async queryNotes() {
		let realm = await this.getRealm();
		if (realm) {
			let results = realm.objects('NoteModel');
			return results.sorted('modifiedTime', true);
		}
		return null;
	}

	async addOrUpdateNote(index, body, createdTime, modifiedTime, refList) {
		let realm = await this.getRealm();
		if (realm) {
			let results = realm.objects('NoteModel').filtered('createdTime = $0', createdTime);
			realm.write(() => {
				if (index == -1) {
					realm.create('NoteModel', {
						body: body, createdTime: createdTime, modifiedTime: modifiedTime,
						references: refList
					})
				} else {
					if (results.length > 0) {
						results[0].body = body;
						results[0].modifiedTime = modifiedTime;
						results[0].references = refList;
					}
				}
			});
		}
	}

	async deleteNote(createdTime) {
		let realm = await this.getRealm();
		realm.write(() => {
			let allNotes = realm.objects('NoteModel').filtered('createdTime = $0', createdTime);
			realm.delete(allNotes); // Deletes all
		});
	}
	async notesCharStyle(charIndex, styleOption) {
		let realm = await this.getRealm();
		if (realm) {
		}
	}

	async addHistory(sourceId, langName, langCode, verCode, bId, bookName, cNum, downloaded, timeStamp) {
		let realm = await this.getRealm();
		if (realm) {
			realm.write(() => {
				realm.create('HistoryModel', {
					sourceId: sourceId,
					languageName: langName,
					languageCode: langCode,
					versionCode: verCode,
					bookId: bId,
					bookName: bookName,
					chapterNumber: cNum,
					downloaded: JSON.parse(downloaded),
					time: timeStamp
				})
			});
		}
	}

	async queryHistory() {
		let realm = await this.getRealm();
		if (realm) {
			let results = realm.objects('HistoryModel')
			return results.sorted('time');
		}
		return null
	}

	async getVersionMetaData(langName,verCode,sourceId){
		let realm = await this.getRealm();
		if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langName)
			let resultsA = result.versionModels
			let resultsB = resultsA.filtered('versionCode ==[c] "' + verCode + '" && sourceId ==[c] "' + sourceId + '"')
			return resultsB[0].metaData
		}
		return null
	}
	

	async clearHistory() {
		let realm = await this.getRealm();
		realm.write(() => {
			let historyData = realm.objects('HistoryModel')
			realm.delete(historyData);
		});
	}

	async deleteBibleVersion(langName, verCode, sourceId, downloaded) {
		let realm = await this.getRealm();
		realm.write(() => {
			let result = realm.objectForPrimaryKey("LanguageModel", langName)
			let bible = realm.objects("BookModel")
			let bibleA = bible.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '"')
			realm.delete(bibleA);
			let resultsA = result.versionModels
			let resultsB = resultsA.filtered('versionCode ==[c] "' + verCode + '" && sourceId ==[c] "' + sourceId + '"')
			resultsB[0].downloaded = false
			resultsB[0].bookNameList = []
		})
	}

	async addLangaugeList(languages, books) {
		let realm = await this.getRealm()

		if (realm) {
			for (var i = 0; i < languages.length; i++) {
				for (var j = 0; j < books.length; j++) {
					var bookArr = []
					if (languages[i].languageName.toLowerCase() == books[j].language.name) {
						for (var k = 0; k < books[j].bookNames.length; k++) {
							const bookObj = {
								bookId: books[j].bookNames[k].book_code,
								bookName: books[j].bookNames[k].short,
								bookNumber: books[j].bookNames[k].book_id,
							}
							bookArr.push(bookObj)
						}
						var bookList = bookArr.sort(function (a, b) { return a.bookNumber - b.bookNumber })
						realm.write(() => {
							realm.create('LanguageModel', {
								languageName: languages[i].languageName,
								languageCode: languages[i].languageCode,
								versionModels: languages[i].versionModels,
								bookNameList: bookList,
							})
						})
					}
				}
			}
		}
	}

	async getLangaugeList() {
		let realm = await this.getRealm();
		if (realm) {
			let result = realm.objects('LanguageModel');
			if (Object.keys(result).length > 0) {
				return result
			}
			else {
				return null
			}
		}
	}

	//get all available booklist
	async getDownloadedBook(langName) {
		let realm = await this.getRealm();
		if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langName);
			let resultsA = result.bookNameList;
			return resultsA
		}
	}
	//download version
	async addNewVersion(langName, verCode, bookmodel, sourceId) {
		let realm = await this.getRealm();
		if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langName)
			let resultsA = result.versionModels
			var resultsB = resultsA.filtered('sourceId  =="' + sourceId + '"')
			var resultBook = realm.objects('BookModel').filtered('languageName ==[c] "' + langName + '" ')

			if (bookmodel.length > 0) {
				var bookIdList = []
				if (resultBook.length == 0) {
					realm.write(() => {
						for (var i = 0; i < bookmodel.length; i++) {
							realm.create('BookModel', bookmodel[i])
							bookIdList.push({ bookId: bookmodel[i].bookId, bookName: bookmodel[i].bookName, bookNumber: bookmodel[i].bookNumber })
						}
						resultsB[0].downloaded = true;
					})
				}
				else {
					for (var i = 0; i < resultBook.length; i++) {
						if (resultBook[i].versionCode == verCode) {
							realm.write(() => {
								for (var i = 0; i < bookmodel.length; i++) {
									realm.create('BookModel', bookmodel[i])
								}
								resultsA[0].downloaded = true;
							})
						}
					}

				}

			}
		}
	}
	//query  chapter
	async queryVersions(langName, verCode, bookId) {
		let realm = await this.getRealm()

		if (realm) {
			let result = realm.objects('BookModel')
			let data = result.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" && bookId =="' + bookId + '"')
			if (Object.keys(data).length > 0) {
				return data
			}
			else {
				return null
			}
		}
	}
	async queryTextForNote(langName, verCode, bookId, chapterNumber, verseNumber) {
		let realm = await this.getRealm()

		if (realm) {
			let result = realm.objects('BookModel')
			let data = result.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" && bookId =="' + bookId + '"')[0]
			let verse = data.chapters.filtered('chapterNumber =="' + chapterNumber + '"')[0]

			if (Object.keys(verse).length > 0) {
				let val = verse.verses[verseNumber - 1].text
				return val
			}
			else {
				return null
			}
		}
	}

}

export default new DbHelper();