import store from "../store";
const state = store.getState();
import DbQueries from "./dbQueries";
import Color from "./colorConstants";
import { getBookChaptersFromMapping } from "./UtilFunctions";
import { style } from "../screens/Bible/style";
export function updateLangVersion(
  currentVisibleChapter,
  item, bId
) {
  if (item) {
    let bookName = null;
    let bookId = null;
    let bookItem = item.books.filter((i) => i.bookId == bId);
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
    let chapterNum = parseInt(currentVisibleChapter) > getBookChaptersFromMapping(bookId) ? 1 : parseInt(currentVisibleChapter);

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
    return { bookId, bookName }
  } else {
    return;
  }
}
export function setHighlightColor(color) {
  let value = Color.highlightColorA.const;
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
