import { all } from 'redux-saga/effects'
import { watchVersion } from './apiFetch/fetchVersion'
import { watchAllContent } from './apiFetch/fetchAllContent'
import {watchVachanAPI} from './apiFetch/vachanAPIFetch'


export default function* rootSaga() {
  yield all([
    ...watchVersion,
    ...watchAllContent,
    ...watchVachanAPI
  ])
}
//all saga put here its a root of all saga
