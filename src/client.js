import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import Layout from "./components/Layout";
import createStore from "./store";
import "./App.css";


const store = createStore( window.REDUX_DATA );

function set_state(campgrounds) {
  store.dispatch ({
  type: 'SET_STATE',
  state: {
    filters: [
      {id: 'shower', inuse: false },
      {id: 'pets', inuse: false },
      {id: 'flush', inuse: false },
      {id: 'water', inuse: false }
    ],
    markers: campgrounds,
    campgrounds: campgrounds
  }
 })
}

const jsx = (
    <ReduxProvider store={ store }>
        <Router>
            <Layout />
        </Router>
    </ReduxProvider>
);

const app = document.getElementById( "app" );
ReactDOM.hydrate( jsx, app );
