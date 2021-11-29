/* eslint-disable no-prototype-builtins */

import {
  FETCH_ALL_CONTENT,
  FECTH_ALL_LANGUAGE,
  FECTH_ALL_BOOKS,
} from "../../action/actionsType";
import {
  allContentFailure,
  allContentSuccess,
  allLanguageFailure,
  allLanguageSuccess,
  allBooksSuccess,
  allBooksFailure,
} from "../../action/";
import { put, takeLatest, call, all } from "redux-saga/effects";
import securityVaraibles from "./../../../../securityVaraibles.js";
import fetchApi from "../../api";
import store from "../../../store";

function* fetchAllContent() {
  try {
    const state = store.getState();
    const commentaryKey = securityVaraibles.COMMENTARY_KEY
      ? "?key=" + securityVaraibles.COMMENTARY_KEY
      : "";
    const bibleAPI = state.updateVersion.baseAPI + "bibles";
    const commentaryAPI =
      state.updateVersion.baseAPI + "commentaries" + commentaryKey;
    const [bibleLanguage, commentaryLanguage] = yield all([
      call(fetchApi, bibleAPI),
      call(fetchApi, commentaryAPI),
    ]);
    var bible = [];
    var commentary = [];
    for (var i = 0; i < bibleLanguage.length; i++) {
      let versions = [];
      const language =
        bibleLanguage[i].language.charAt(0).toUpperCase() +
        bibleLanguage[i].language.slice(1);
      let languageCode = "";
      for (var j = 0; j < bibleLanguage[i].languageVersions.length; j++) {
        let LatestBible = false;
        languageCode = bibleLanguage[i].languageVersions[j].language.code;
        const { version } = bibleLanguage[i].languageVersions[j];
        const metaD = bibleLanguage[i].languageVersions[j].metadata;
        let mData = [
          {
            abbreviation:
              metaD &&
              (metaD.hasOwnProperty("Abbreviation")
                ? metaD["Abbreviation"]
                : ""),
            contact:
              metaD &&
              (metaD.hasOwnProperty("Contact") ? metaD["Contact"] : ""),
            contentType:
              metaD &&
              (metaD.hasOwnProperty("Content Type")
                ? metaD["Content Type"]
                : ""),
            copyrightHolder:
              metaD &&
              (metaD.hasOwnProperty("Copyright Holder")
                ? metaD["Copyright Holder"]
                : ""),
            description:
              metaD &&
              (metaD.hasOwnProperty("Description") ? metaD["Description"] : ""),
            languageCode:
              metaD &&
              (metaD.hasOwnProperty("Language Code")
                ? metaD["Language Code"]
                : ""),
            languageName:
              metaD &&
              (metaD.hasOwnProperty("Language Name")
                ? metaD["Language Name"]
                : ""),
            license:
              metaD &&
              (metaD.hasOwnProperty("License") ? metaD["License"] : ""),
            licenseURL:
              metaD &&
              (metaD.hasOwnProperty("License URL") ? metaD["License URL"] : ""),
            NTURL:
              metaD && (metaD.hasOwnProperty("NT URL") ? metaD["NT URL"] : ""),
            OTURL:
              metaD && (metaD.hasOwnProperty("OT URL") ? metaD["OT URL"] : ""),
            publicDomain:
              metaD &&
              (metaD.hasOwnProperty("Public Domain")
                ? metaD["Public Domain"]
                : ""),
            revision:
              metaD &&
              (metaD.hasOwnProperty("Revision (Name & Year)")
                ? metaD["Revision (Name & Year)"]
                : ""),
            source:
              metaD &&
              (metaD.hasOwnProperty("Source (Name & Year)")
                ? metaD["Source (Name & Year)"]
                : ""),
            technologyPartner:
              metaD &&
              (metaD.hasOwnProperty("Technology Partner")
                ? metaD["Technology Partner"]
                : ""),
            versionName:
              metaD &&
              (metaD.hasOwnProperty("Version Name (in Eng)")
                ? metaD["Version Name (in Eng)"]
                : ""),
            versionNameGL:
              metaD &&
              (metaD.hasOwnProperty("Version Name (in GL)")
                ? metaD["Version Name (in GL)"]
                : ""),
            Latest:
              metaD &&
              (metaD.hasOwnProperty("Latest")
                ? metaD["Latest"].toLowerCase() === "true"
                  ? true
                  : false
                : false),
          },
        ];
        LatestBible = mData[0].Latest;
        if (LatestBible) {
          versions.push({
            sourceId: bibleLanguage[i].languageVersions[j].sourceId,
            versionName: version.name,
            versionCode: version.code,
            metaData: mData,
            downloaded: false,
          });
        }
      }
      if (versions.length > 0) {
        bible.push({
          languageName: language,
          languageCode: languageCode,
          versionModels: versions,
        });
      }
    }
    for (var k = 0; k < commentaryLanguage.length; k++) {
      let versions = [];
      const language =
        commentaryLanguage[k].language.charAt(0).toUpperCase() +
        commentaryLanguage[k].language.slice(1);
      const languageCode = commentaryLanguage[k].languageCode;
      for (var l = 0; l < commentaryLanguage[k].commentaries.length; l++) {
        const metaD = commentaryLanguage[k].commentaries[l].metadata;
        let mData = [
          {
            abbreviation:
              metaD &&
              (metaD.hasOwnProperty("Abbreviation")
                ? metaD["Abbreviation"]
                : ""),
            contact:
              metaD &&
              (metaD.hasOwnProperty("Contact") ? metaD["Contact"] : ""),
            contentType:
              metaD &&
              (metaD.hasOwnProperty("Content Type")
                ? metaD["Content Type"]
                : ""),
            copyrightHolder:
              metaD &&
              (metaD.hasOwnProperty("Copyright Holder")
                ? metaD["Copyright Holder"]
                : ""),
            description:
              metaD &&
              (metaD.hasOwnProperty("Description\u00a0")
                ? metaD["Description\u00a0"]
                : ""),
            languageCode:
              metaD &&
              (metaD.hasOwnProperty("Language Code\u00a0")
                ? metaD["Language Code\u00a0"]
                : ""),
            languageName:
              metaD &&
              (metaD.hasOwnProperty("Language Name\u00a0")
                ? metaD["Language Name\u00a0"]
                : ""),
            license:
              metaD &&
              (metaD.hasOwnProperty("License") ? metaD["License"] : ""),
            licenseURL:
              metaD &&
              (metaD.hasOwnProperty("License URL\u00a0")
                ? metaD["License URL\u00a0"]
                : ""),
            NTURL:
              metaD && (metaD.hasOwnProperty("NT URL") ? metaD["NT URL"] : ""),
            OTURL:
              metaD && (metaD.hasOwnProperty("OT URL") ? metaD["OT URL"] : ""),
            publicDomain:
              metaD &&
              (metaD.hasOwnProperty("Public Domain")
                ? metaD["Public Domain"]
                : ""),
            revision:
              metaD &&
              (metaD.hasOwnProperty("Revision (Name & Year)")
                ? metaD["Revision (Name & Year)"]
                : ""),
            source:
              metaD &&
              (metaD.hasOwnProperty("Source (Name & Year)")
                ? metaD["Source (Name & Year)"]
                : ""),
            technologyPartner:
              metaD &&
              (metaD.hasOwnProperty("Technology Partner")
                ? metaD["Technology Partner"]
                : ""),
            versionName:
              metaD &&
              (metaD.hasOwnProperty("Version Name (in Eng)")
                ? metaD["Version Name (in Eng)"]
                : ""),
            versionNameGL:
              metaD &&
              (metaD.hasOwnProperty("Version Name (in GL)")
                ? metaD["Version Name (in GL)"]
                : ""),
          },
        ];
        versions.push({
          sourceId: commentaryLanguage[i].commentaries[j].sourceId,
          versionName: commentaryLanguage[i].commentaries[j].name,
          versionCode: commentaryLanguage[i].commentaries[j].code,
          metaData: mData,
          downloaded: false,
        });
      }
      commentary.push({
        languageName: language,
        languageCode: languageCode,
        versionModels: versions,
      });
    }
    if (bible.length == 0 && commentary.length == 0) {
      yield put(allContentSuccess([]));
    } else {
      yield put(
        allContentSuccess([
          { contentType: "bible", content: bible },
          { contentType: "commentary", content: commentary },
        ])
      );
    }

    yield put(allContentFailure(null));
  } catch (e) {
    yield put(allContentFailure(e));
    yield put(allContentSuccess([]));
  }
}

function* fetchAllLanguage() {
  try {
    const state = store.getState();
    const response = yield call(
      fetchApi,
      state.updateVersion.baseAPI + "languages"
    );
    yield put(allLanguageSuccess(response));
    yield put(allLanguageFailure(null));
  } catch (e) {
    yield put(allLanguageFailure(e));
    yield put(allLanguageSuccess([]));
  }
}
function* fetchAllBooks() {
  try {
    const state = store.getState();
    var result = yield call(fetch, state.updateVersion.baseAPI + "booknames");
    if (result.ok && result.status == 200) {
      const response = yield result.json();
      yield put(allBooksSuccess(response));
      yield put(allBooksFailure(null));
    }
  } catch (e) {
    yield put(allBooksFailure(e));
    yield put(allBooksSuccess([]));
  }
}
export const watchAllContent = [
  takeLatest(FETCH_ALL_CONTENT, fetchAllContent),
  takeLatest(FECTH_ALL_LANGUAGE, fetchAllLanguage),
  takeLatest(FECTH_ALL_BOOKS, fetchAllBooks),
];
