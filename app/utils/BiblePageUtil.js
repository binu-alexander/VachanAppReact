import store from "../store";
const state = store.getState();
import DbQueries from "./dbQueries";
import {
  extraSmallFont,
  smallFont,
  mediumFont,
  largeFont,
  extraLargeFont,
} from "./dimens.js";
import Color from "./colorConstants";
import { getBookChaptersFromMapping } from "./UtilFunctions";
import { style } from "../screens/Bible/style";
export function updateLangVersion(
  setMetadata,
  setVersion,
  setVersionBook,
  fetchVersionBooks,
  currentVisibleChapter,
  item
) {
  if (item) {
    console.log("HI updateLangVersion")
    let bookName = null;
    let bookId = null;
    let bookItem = item.books.filter((i) => i.bookId == bookId);
    if (bookItem.length > 0) {
      bookName = bookItem[0].bookName;
      bookId = bookItem[0].bookId;
    } else {
      for (var i = 0; i <= item.books.length - 1; i++) {
        if (item.books[i].bookId >= 39) {
          if (item.books[i].bookId == "gen") {
            bookName = item.books[i].bookName;
            bookId = item.books[i].bookId;
          }
        } else {
          if (item.books[i].bookId == "mat") {
            bookName = item.books[i].bookName;
            bookId = item.books[i].bookId;
          }
        }
      }
    }
    let chapterNum =
      parseInt(currentVisibleChapter) > getBookChaptersFromMapping(bookId)
        ? 1
        : parseInt(currentVisibleChapter);
    setMetadata({
      copyrightHolder: item.metadata[0].copyrightHolder,
      description: item.metadata[0].description,
      license: item.metadata[0].license,
      source: item.metadata[0].source,
      technologyPartner: item.metadata[0].technologyPartner,
      revision: item.metadata[0].revision,
      versionNameGL: item.metadata[0].versionNameGL,
    });
    setVersion({
      language: item.languageName,
      languageCode: item.languageCode,
      versionCode: item.versionCode,
      sourceId: item.sourceId,
      downloaded: item.downloaded,
    });
    setVersionBook({
      bookId: bookId,
      bookName: bookName,
      chapterNumber: chapterNum,
      totalChapters: getBookChaptersFromMapping(bookId),
    });
    fetchVersionBooks({
      language: item.languageName,
      versionCode: item.versionCode,
      downloaded: item.downloaded,
      sourceId: item.sourceId,
    })
    var time = new Date();
    DbQueries.addHistory(
      item.sourceId,
      item.languageName,
      item.languageCode,
      item.versionCode,
      bookId,
      bookName,
      chapterNum,
      item.downloaded,
      time
    );
  } else {
    return;
  }
}
export function changeSizeOnPinch(value, updateFontSize, colorFile, sizeMode) {
  console.log("VALUE ", value)
  switch (sizeMode) {
    case 0: {
      if (value == -1) {
        return;
      } else {
        updateFontSize(1);
        return style(colorFile, smallFont);
      }
    }
    case 1: {
      if (value == -1) {
        updateFontSize(0);
        return style(colorFile, extraSmallFont);
      } else {
        updateFontSize(2);
        return style(colorFile, mediumFont);
      }
    }
    case 2: {
      if (value == -1) {
        updateFontSize(1);
        return style(colorFile, smallFont);
      } else {
        updateFontSize(3);
        return style(colorFile, largeFont);
      }
    }
    case 3: {
      if (value == -1) {
        updateFontSize(2);
        return style(colorFile, mediumFont);
      } else {
        updateFontSize(4);
        return style(colorFile, extraLargeFont);
      }
    }
    case 4: {
      if (value == -1) {
        updateFontSize(3);
        return style(colorFile, largeFont);
      } else {
        return;
      }
    }
  }
}
export function setHighlightColor(color) {
  let value = Color.highlightColorA.const;
  console.log(value, "setHi");
  switch (color) {
    case Color.highlightColorA.code:
      value = Color.highlightColorA.const;
      break;
    case Color.highlightColorB.code:
      value = Color.highlightColorB.const;
      break;
    case Color.highlightColorC.code:
      value = Color.highlightColorC.const;
      break;
    case Color.highlightColorD.code:
      value = Color.highlightColorD.const;
      break;
    case Color.highlightColorE.code:
      value = Color.highlightColorE.const;
      break;
    default:
      value = Color.highlightColorA.const;
  }
  return value;
}
