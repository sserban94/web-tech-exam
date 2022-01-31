const INITIAL_STATE = {
  virtualShelfList: [],
  error: null,
  fetching: false,
  fetched: false
}

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GET_VIRTUALSHELVES_PENDING':
    case 'ADD_VIRTUALSHELVES_PENDING':
    case 'SAVE_VIRTUALSHELVES_PENDING':
    case 'DELETE_VIRTUALSHELVES_PENDING':
      return { ...state, error: null, fetching: true, fetched: false }
    case 'GET_VIRTUALSHELVES_FULFILLED':
    case 'ADD_VIRTUALSHELVES_FULFILLED':
    case 'SAVE_VIRTUALSHELVES_FULFILLED':
    case 'DELETE_VIRTUALSHELVES_FULFILLED':
      return { ...state, virtualShelfList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
    case 'GET_VIRTUALSHELVES_REJECTED':
    case 'ADD_VIRTUALSHELVES_REJECTED':
    case 'SAVE_VIRTUALSHELVES_REJECTED':
    case 'DELETE_VIRTUALSHELVES_REJECTED':
      return { ...state, virtualShelfList: [], error: action.payload, fetching: false, fetched: true }
    default:
      return state
  }
}