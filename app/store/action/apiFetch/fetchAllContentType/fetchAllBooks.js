import {FECTH_ALL_BOOKS,ALL_BOOKS_FAILURE,ALL_BOOKS_SUCCESS } from "../../actionsType";


export const fetchAllBooks=()=>({
  type: FECTH_ALL_BOOKS,
})

export const allBooksSuccess= payload => ({
  type: ALL_BOOKS_SUCCESS,
  payload
})

export const allBooksFailure = error => ({
  type: ALL_BOOKS_FAILURE,
  error:error,
})

