import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

const ADD_SYMBOL = 'ADD_SYMBOL';
const REMOVE_SYMBOL = 'REMOVE_SYMBOL';

export const addSymbol = sym => {
    return {
        type: ADD_SYMBOL,
        payload: sym
    }
};

export const removeSymbol = sym => {
    return {
        type: REMOVE_SYMBOL,
        payload: sym
    }
};

const ADD_PROVIDER = 'ADD_PROVIDER';
const REMOVE_PROVIDER = 'REMOVE_PROVIDER';

export const addProvider = pvd => {
    return {
        type: ADD_PROVIDER,
        payload: pvd
    }
};

export const removeProvider = pvd => {
    return {
        type: REMOVE_PROVIDER,
        payload: pvd
    }
};

const UPDATE_PAGE_SIZE = 'UPDATE_PAGE_SIZE';
export const updatePageSize = num => {
    return {
        type: UPDATE_PAGE_SIZE,
        payload: num
    }
};

const START_FETCH = 'START_FETCH';
const COMPLETE_FETCH = 'COMPLETE_FETCH';

const fetchStart = page => {
    return {
        type: START_FETCH,
        payload: page
    }
};

const fetchComplete = json => {
    return {
        type: COMPLETE_FETCH,
        payload: json
    }
};

export const fetchPage = (page, pageSize, symbols, providers, startTime, endTime) => {
    return dispatch => {
        dispatch(fetchStart(page));
        let url = `/api/data?page=${page}`;
        if (symbols) {
            url = `${url}&sym=${symbols.join(',')}`;
        }
        if (providers) {
            url = `${url}&lp=${providers.join(',')}`;
        }
        if (startTime) {
            url = `${url}&startTime${startTime}`;
        }
        if (endTime) {
            url = `${url}&endTime=${endTime}`;
        }
        if (pageSize) {
            url = `${url}&pageSize=${pageSize}`;
        }
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                dispatch(fetchComplete({
                    ...json, 
                    values: json.values.map(v => {
                        return {
                            ...v, 
                            ts: new Date(v.ts)
                        }
                    })
                }));
            });
    }
}

const initalState = {
    page: {},
    loading: false,
    symbols: [],
    liquidityProviders: [],
    startTime: null,
    endTime: null,
    pageSize: 10,
    pageNumber: 1
};

const reducer = (state = initalState, action) => {
    switch(action.type) {
        case ADD_SYMBOL:
            return {
                ...state,
                symbols: [
                    ...state.symbols,
                    action.payload
                ]
            }
        case REMOVE_SYMBOL:
            return {
                ...state,
                symbols: state.symbols.filter(s => s !== action.payload)
            }
        case ADD_PROVIDER:
            return {
                ...state,
                liquidityProviders: [
                    ...state.liquidityProviders,
                    action.payload
                ]
            }
        case REMOVE_PROVIDER:
            return {
                ...state,
                liquidityProviders: state.liquidityProviders.filter(s => s !== action.payload)
            }
        case UPDATE_PAGE_SIZE:
            return {
                ...state,
                pageSize: action.payload
            }
        case START_FETCH:
            return {
                ...state,
                pageNumber: action.payload,
                loading: true
            }
        case COMPLETE_FETCH:
            return {
                ...state,
                page: action.payload 
            }
        default:
            return state;
    }
};

const store = createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

export default store;

store.dispatch(fetchPage(1));