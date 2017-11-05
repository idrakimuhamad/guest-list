import {
  combineReducers,
  createStore,
  applyMiddleware
} from 'redux'
import {
  composeWithDevTools
} from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import fetch from 'isomorphic-unfetch'

const apiContext = process.env.NODE_ENV !== 'production' ? 'http://localhost:1337' : 'https://guest-list-backend.herokuapp.com'

export const LOAD_LISTS = 'LOAD_LISTS'
export const LOAD_LISTS_SUCCESS = 'LOAD_LISTS_SUCCESS'
export const LOAD_LISTS_FAILURE = 'LOAD_LISTS_FAILURE'
export const ADD_LIST = 'ADD_LIST'
export const ADD_LIST_SUCCESS = 'ADD_LIST_SUCCESS'
export const ADD_LIST_FAILURE = 'ADD_LIST_FAILURE'
export const SEARCH_LIST = 'SEARCH_LIST'
export const SEARCH_LIST_UPDATE = 'SEARCH_LIST_UPDATE'
export const LOAD_TABLES = 'LOAD_TABLES'
export const LOAD_TABLES_SUCCESS = 'LOAD_TABLES_SUCCESS'
export const LOAD_TABLES_FAILURE = 'LOAD_TABLES_FAILURE'
export const LOAD_TABLE = 'LOAD_TABLE'
export const LOAD_TABLE_SUCCESS = 'LOAD_TABLE_SUCCESS'
export const LOAD_TABLE_FAILURE = 'LOAD_TABLE_FAILURE'
export const LOAD_GUESTS = 'LOAD_GUESTS'
export const LOAD_GUESTS_SUCCESS = 'LOAD_GUESTS_SUCCESS'
export const LOAD_GUESTS_FAILURE = 'LOAD_GUESTS_FAILURE'
export const SEARCH_GUEST_LIST = 'SEARCH_GUEST_LIST'
export const SEARCH_GUEST_UPDATE = 'SEARCH_GUEST_UPDATE'
export const SEARCH_TABLE_UPDATE = 'SEARCH_TABLE_UPDATE'
export const LOAD_LIST = 'LOAD_LIST'
export const LOAD_LIST_SUCCESS = 'LOAD_LIST_SUCCESS'
export const LOAD_LIST_FAILURE = 'LOAD_LIST_FAILURE'
export const LOAD_GUEST = 'LOAD_GUEST'
export const LOAD_GUEST_SUCCESS = 'LOAD_GUEST_SUCCESS'
export const LOAD_GUEST_FAILURE = 'LOAD_GUEST_FAILURE'
export const ADD_GUEST = 'ADD_GUEST'
export const ADD_GUEST_SUCCESS = 'ADD_GUEST_SUCCESS'
export const ADD_GUEST_FAILURE = 'ADD_GUEST_FAILURE'
export const DELETE_GUEST = 'DELETE_GUEST'
export const DELETE_GUEST_SUCCESS = 'DELETE_GUEST_SUCCESS'
export const DELETE_GUEST_FAILURE = 'DELETE_GUEST_FAILURE'
export const ADD_GUEST_FIELD = 'ADD_GUEST_FIELD'
export const UPDATE_GUEST_RSVP = 'UPDATE_GUEST_RSVP'
export const UPDATE_GUEST_RSVP_SUCCESS = 'UPDATE_GUEST_RSVP_SUCCESS'
export const UPDATE_GUEST_RSVP_FAILURE = 'UPDATE_GUEST_RSVP_FAILURE'
export const UPDATE_GUEST_ARRIVAL = 'UPDATE_GUEST_ARRIVAL'
export const UPDATE_GUEST_ARRIVAL_SUCCESS = 'UPDATE_GUEST_ARRIVAL_SUCCESS'
export const UPDATE_GUEST_ARRIVAL_FAILURE = 'UPDATE_GUEST_ARRIVAL_FAILURE'
export const CLEAR_GUEST = 'CLEAR_GUEST'

// Reducers
const listsInitialState = {
  lists: [],
  unfilteredLists: [],
  searchText: '',
  loadingList: false,
  loadingFailed: false,
  addLoading: false,
  addFailed: false
}

const listInitialState = {
  list: {},
  guests: [],
  unfilteredGuests: [],
  tables: [],
  unfilteredTables: [],
  searchText: '',
  loadingList: false,
  loadingFailed: false,
  guestsLoading: false,
  guestsFailed: false,
  guest: {
    rsvp: false,
    isArrived: false
  }
}

const guestInitialState = {
  table: {},
  name: '',
  pax: 1,
  rsvp: false,
  addingGuestSuccess: false,
  addingGuestFailed: false
}

const listsReducer = (state = listsInitialState, action) => {
  switch (action.type) {
    case LOAD_LISTS:
      return { ...state,
        loadingList: true,
        loadingFailed: false
      }
    case LOAD_LISTS_SUCCESS:
      const lists = action.results.map(item => {
        const {
          id,
          name,
          date,
          description,
          isActive
        } = item;
        return {
          id,
          name,
          date,
          description,
          isActive
        }
      })
      return { ...state,
        lists: [ ...lists ],
        unfilteredLists: [ ...lists ],
        loadingList: false,
        loadingFailed: false
      }
    case LOAD_LISTS_FAILURE:
      return { ...state,
        loadingList: false,
        loadingFailed: action.error
      }
    case SEARCH_LIST:
      return { ...state,
        searchText: action.query
      }
    case SEARCH_LIST_UPDATE:
      return { ...state,
        lists: [ ...action.payload.filtered ],
        unfilteredLists: [ ...action.payload.unfiltered ]
      }
    case ADD_LIST:
      return { ...state,
        addLoading: true,
        addFailed: false
      }
    case ADD_LIST_SUCCESS:
      return { ...state,
        addLoading: false,
        addFailed: false
      }
    case ADD_LIST_FAILURE:
      return { ...state,
        addLoading: false,
        addFailed: true
      }
    default:
      return state
  }
}

const listReducer = (state = listInitialState, action) => {
  switch (action.type) {
    case LOAD_LIST:
      return { ...state,
        loadingList: true,
        loadingFailed: false
      }
    case LOAD_LIST_SUCCESS:
      return { ...state,
        list: action.payload,
        loadingList: false,
        loadingFailed: false
      }
    case LOAD_LIST_FAILURE:
      return { ...state,
        loadingList: false,
        loadingFailed: action.error
      }
    case LOAD_TABLES:
      return { ...state }
    case LOAD_TABLES_SUCCESS:
      return { ...state,
        tables: action.payload,
        unfilteredTables: action.payload
      }
    case LOAD_TABLES_FAILURE:
      return { ...state,
        loadingList: false,
        loadingFailed: action.error
      }
    case LOAD_GUESTS:
      return { ...state }
    case LOAD_GUESTS_SUCCESS:
      return { ...state,
        guests: action.payload,
        unfilteredGuests: action.payload,
        guestsLoading: false,
        guestsFailed: false
      }
    case LOAD_GUESTS_FAILURE:
      return { ...state,
        guestsLoading: false,
        guestsFailed: action.error
      }
    case LOAD_GUEST:
      return { ...state }
    case LOAD_GUEST_SUCCESS:
      return { ...state,
        guest: action.payload,
        guestsLoading: false,
        guestsFailed: false
      }
    case LOAD_GUEST_FAILURE:
      return { ...state,
        guestsLoading: false,
        guestsFailed: action.error
      }
    case DELETE_GUEST:
      return { ...state, guestsLoading: true }
    case DELETE_GUEST_SUCCESS:
      const guests = [ ...state.guests ]
      const newGuests = guests.filter(guest => guest.id !== action.guestId)
      return { ...state,
        guests: [ ...newGuests ],
        guestsLoading: false,
        guestsFailed: false
      }
    case DELETE_GUEST_FAILURE:
      return { ...state,
        guestsLoading: false,
        guestsFailed: action.error
      }
    case CLEAR_GUEST:
      return { ...state,
        guest: Object.assign({}, listInitialState.guest)
      }
    case UPDATE_GUEST_RSVP:
      return { ...state }
    case UPDATE_GUEST_RSVP_SUCCESS:
      // also locally update the guest data in the guests list
      const guestList = [ ...state.guests ]
      const guestIndex = guestList.findIndex(guest => guest.id === action.payload.id)

      guestList[guestIndex].rsvp = !state.guest.rsvp

      return { ...state,
        guest: Object.assign({}, state.guest, {
          rsvp: !state.guest.rsvp
        }),
        guests: [ ...guestList ],
        guestsLoading: false,
        guestsFailed: false
      }
    case UPDATE_GUEST_RSVP_FAILURE:
      return { ...state,
        guestsLoading: false,
        guestsFailed: action.error
      }
    case UPDATE_GUEST_ARRIVAL:
      return { ...state }
    case UPDATE_GUEST_ARRIVAL_SUCCESS:
      const guestsArrivalCopy = [ ...state.guests ]
      const guestArrivalIndex = guestsArrivalCopy.findIndex(guest => guest.id === action.payload.id)

      guestsArrivalCopy[guestArrivalIndex].isArrived = !state.guest.isArrived

      return { ...state,
        guest: Object.assign({}, state.guest, {
          isArrived: !state.guest.isArrived
        }),
        guests: [ ...guestsArrivalCopy ],
        guestsLoading: false,
        guestsFailed: false
      }
    case UPDATE_GUEST_ARRIVAL_FAILURE:
      return { ...state,
        guestsLoading: false,
        guestsFailed: action.error
      }
    case SEARCH_GUEST_LIST:
      return { ...state,
        searchText: action.query
      }
    case SEARCH_GUEST_UPDATE:
      return { ...state,
        guests: [ ...action.payload.filtered ],
        unfilteredGuests: [ ...action.payload.unfiltered ]
      }
    case SEARCH_TABLE_UPDATE:
      return { ...state,
        tables: [ ...action.payload.filtered ],
        unfilteredTables: [ ...action.payload.unfiltered ]
      }
    default:
      return state
  }
}

const guestReducer = (state = guestInitialState, action) => {
  switch (action.type) {
    case ADD_GUEST_SUCCESS:
      return {
        ...state,
        name: '',
        rsvp: false,
        pax: 1,
        addingGuestSuccess: true,
        addingGuestFailed: false
      }
    case ADD_GUEST_FAILURE:
      return {
        ...state,
        addingGuestSuccess: false,
        addingGuestFailed: true
      }
    case LOAD_TABLE_SUCCESS:
      return { ...state,
        table: action.payload
      }
    case LOAD_TABLE_FAILURE:
      return { ...state,
        loadingList: false,
        loadingFailed: action.error
      }
    case ADD_GUEST_FIELD:
      return {
        ...state,
        ...action.field
      }
    default:
      return state
  }
}
// Actions

export const getLists = () => {
  // console.log('get lists');
  // console.log('Loading');

  return {
    type: LOAD_LISTS,
    payload: fetch(`${apiContext}/api/get-list`)
  }
}

export const getListsSuccess = (results) => {
  // console.log('get lists success');
  return {
    type: LOAD_LISTS_SUCCESS,
    results
  };
}

export const getListsFailure = (error) => {
  return {
    type: LOAD_LISTS_FAILURE,
    error
  };
}

export const getList = (listId) => {
  // console.log('get list');
  // console.log('Loading');

  return {
    type: LOAD_LIST,
    payload: fetch(`${apiContext}/api/get-list/${listId}`)
  }
}

export const getListSuccess = (results) => {
  // console.log('get list success');
  return {
    type: LOAD_LIST_SUCCESS,
    payload: results
  };
}

export const getListFailure = (error) => {
  return {
    type: LOAD_LIST_FAILURE,
    error
  };
}

export const searchList = (query) => {
  return {
    type: SEARCH_LIST,
    query
  }
}

export const updateSearchList = (filtered, unfiltered) => {
  return {
    type: SEARCH_LIST_UPDATE,
    payload: {
      filtered, unfiltered
    }
  }
}

export const getTables = (listId) => {
  // console.log('get tables');
  // console.log('Loading');

  return {
    type: LOAD_TABLES,
    payload: fetch(`${apiContext}/api/get-table-in-list/${listId}`)
  }
}

export const getTablesSuccess = (results) => {
  // console.log('get tables success');
  return {
    type: LOAD_TABLES_SUCCESS,
    payload: results
  };
}

export const getTablesFailure = (error) => {
  return {
    type: LOAD_TABLES_FAILURE,
    error
  };
}

export const getGuests = (listId) => {
  // console.log('get guests');
  // console.log('Loading');

  return {
    type: LOAD_GUESTS,
    payload: fetch(`${apiContext}/api/get-guest-in-list/${listId}`)
  }
}

export const getGuestsSuccess = (results) => {
  // console.log('get guests success');

  return {
    type: LOAD_GUESTS_SUCCESS,
    payload: [ ...results ]
  };
}

export const getGuestsFailure = (error) => {
  return {
    type: LOAD_GUESTS_FAILURE,
    error
  };
}

export const getTable = (id) => {
  // console.log('get table', id);
  // console.log('Loading');

  return {
    type: LOAD_TABLE,
    payload: fetch(`${apiContext}/api/get-table/${id}`)
  }
}

export const getTableSuccess = (results) => {
  // console.log('get table success');
  return {
    type: LOAD_TABLE_SUCCESS,
    payload: results
  };
}

export const getTableFailure = (error) => {
  return {
    type: LOAD_TABLE_FAILURE,
    error
  };
}

export const getGuest = (guestId) => {
  // console.log('get guest');
  // console.log('Loading');

  return {
    type: LOAD_GUEST,
    payload: fetch(`${apiContext}/api/get-guest/${guestId}`)
  }
}

export const getGuestSuccess = (results) => {
  // console.log('get guests success');

  return {
    type: LOAD_GUEST_SUCCESS,
    payload: results
  };
}

export const getGuestFailure = (error) => {
  // console.log('get guests failed');

  return {
    type: LOAD_GUEST_FAILURE,
    error
  };
}

export const deleteGuest = (guestId) => {
  // console.log('deleting guest');
  // console.log('Loading');

  return {
    type: DELETE_GUEST,
    payload: fetch(`${apiContext}/api/delete-guest/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: guestId })
    })
  }
}

export const deleteGuestSuccess = (guestId) => {
  // console.log('delete guest success');
  // console.log(guestId);

  return {
    type: DELETE_GUEST_SUCCESS,
    guestId
  };
}

export const deleteGuestFailure = (error) => {
  // console.log('delete guest failed');
  // console.log(error);

  return {
    type: DELETE_GUEST_FAILURE,
    error
  };
}

export const updateGuestForm = (update) => {
  return {
    type: ADD_GUEST_FIELD,
    field: update
  };
}

export const clearGuest = () => {
  return {
    type: CLEAR_GUEST
  };
}

export const updateGuestRsvp = (guestId) => {
  // console.log('update guest rsvp');

  return {
    type: UPDATE_GUEST_RSVP,
    payload: fetch(`${apiContext}/api/update-guest-rsvp`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: guestId })
    })
  }
}

export const updateGuestRsvpSuccess = (results) => {
  // console.log('update guest rsvp success');

  return {
    type: UPDATE_GUEST_RSVP_SUCCESS,
    payload: results
  };
}

export const updateGuestRsvpFailure = (error) => {
  return {
    type: UPDATE_GUEST_RSVP_FAILURE,
    error
  };
}

export const updateGuestArrival = (guestId) => {
  // console.log('update guest arrival');

  return {
    type: UPDATE_GUEST_ARRIVAL,
    payload: fetch(`${apiContext}/api/update-guest-arrival/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: guestId })
    })
  }
}

export const updateGuestArrivalSuccess = (results) => {
  // console.log('update guest arrival success');

  return {
    type: UPDATE_GUEST_ARRIVAL_SUCCESS,
    payload: results
  };
}

export const updateGuestArrivalFailure = (error) => {
  return {
    type: UPDATE_GUEST_ARRIVAL_FAILURE,
    error
  };
}

export const addingGuest = (params) => {
  // console.log('add guest into table');

  return {
    type: ADD_GUEST,
    payload: fetch(`${apiContext}/api/add-guest/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
  }
}

export const addingGuestSuccess = (results) => {
  // console.log('add guest success');

  return {
    type: ADD_GUEST_SUCCESS,
    payload: results
  };
}

export const addingGuestFailed = (error) => {
  return {
    type: ADD_GUEST_FAILURE,
    error
  };
}

export const searchGuestList = (query) => {
  return {
    type: SEARCH_GUEST_LIST,
    query
  }
}

export const updateGuestList = (filtered, unfiltered) => {
  return {
    type: SEARCH_GUEST_UPDATE,
    payload: {
      filtered, unfiltered
    }
  }
}

export const updateTablesList = (filtered, unfiltered) => {
  return {
    type: SEARCH_TABLE_UPDATE,
    payload: {
      filtered, unfiltered
    }
  }
}

export const addList = (data) => {
  return {
    type: LOAD_LISTS_FAILURE,
    error
  };
}

const reducers = combineReducers({
  listsReducer, listReducer, guestReducer
})

// create a store creator
export const makeStore = (initialState) => {
  return createStore(reducers, initialState);
};
