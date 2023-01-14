import {createStore} from 'redux'
import rootReducer from '../reducers/RootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

export const store = createStore(rootReducer, composeWithDevTools())
