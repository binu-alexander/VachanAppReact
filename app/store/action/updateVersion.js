import { UPDATE_VERSION , SELECTED_BOOK,SELECTED_CHAPTER,SELECTED_VERSE,UPDATE_CONTENT_TYPE} from "./actionsType";

export const updateVersion = (payload)=>{
    return {
        type:UPDATE_VERSION,
        payload
    }
}

export const selectedBook = (bookId,bookName,totalChapters)=>{
    return {
        type:SELECTED_BOOK,
        bookId:bookId,
        bookName:bookName,
        totalChapters:totalChapters,
        // audio:
        // Commentary:
        // infographics:

    }
}
export const selectedChapter = (chapterNumber,totalVerses)=>{
    return {
        type:SELECTED_CHAPTER,
        chapterNumber:chapterNumber,
        totalVerses:totalVerses,
    }
}

export const selectedVerse = (verseNumber)=>{
    return {
        type:SELECTED_VERSE,
        verseNumber:verseNumber,
    }
}
export const updateContentType = (payload)=>{
    return{
        type: UPDATE_CONTENT_TYPE,
        payload
    }
}

// export const availableContent =() =>{
//    return{
//     type: AVAILABLE_CONTENT,
//     contentType:contentType
//    } 
// }