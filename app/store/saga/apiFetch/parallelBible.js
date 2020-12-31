
import { FETCH_PARALLEL_BIBLE } from '../../action/actionsType'
import { parallelBibleSuccess, parallelBiblefailure, } from '../../action/'
import { put, takeLatest, call, fork, all } from 'redux-saga/effects'
import DbQueries from '../../../utils/dbQueries'
import store from '../../../store'

function* fetchParalleBible(params) {
  try {
    let state = store.getState()
    let chapterContent = []
    let totalVerses = null
    let payload = params.payload
    if (payload.isDownloaded == true) {
      let response = yield call(DbQueries.queryVersions(payload.language, payload.version, payload.bookId, payload.chapter))
      chapterContent = response[0].verses
      totalVerses = response[0].length
    }
    else {
      let url = state.updateVersion.baseAPI + "bibles" + "/" + payload.sourceId + "/" + "books" + "/" + payload.bookId + "/" + "chapter" + "/" + payload.chapter
      let res = yield call(fetch, url)
      if (res.ok && res.status == 200) {
        let response = yield res.json()
        let chapterContent = response.chapterContent.verses
        let totalVerses = response.chapterContent.verses.length
        let parallelBibleHeading = response.chapterContent.metadata &&
        (response.chapterContent.metadata[0].section && response.chapterContent.metadata[0].section.text)
        yield put(parallelBibleSuccess({ parallelBible: chapterContent, parallelBibleHeading: parallelBibleHeading, totalVerses: totalVerses }))
        yield put(parallelBiblefailure(null))
      }
    }
  } catch (e) {
    yield put(parallelBiblefailure(e))
    yield put(parallelBibleSuccess([]))

  }
}

export const watchParallelBible = [
  takeLatest(FETCH_PARALLEL_BIBLE, fetchParalleBible),
]