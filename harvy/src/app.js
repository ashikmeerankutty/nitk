import React from 'react'
import Routes from './routes'
import { Provider } from 'react-redux'
import configureStore from './store'

const App = () => (<Provider store={configureStore()}><Routes /></Provider>)

export default App