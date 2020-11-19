/*
 * @Author: dukang 
 * @Date: 2020-11-12 22:41:04 
 * @Last Modified by: dukang
 * @Last Modified time: 2020-11-18 21:04:27
 */
import React from 'react';
import './App.css';
// import test from './test.module.scss';

import {
  HashRouter, Switch, Route
  // , Link, NavLink
} from "react-router-dom";
import Home from "./components/Home.js";
import Side from "./components/Side";

// console.log(test);

function App() {
  const routes = [
    {
      path: "/bubblegum",
      sidebar: () => <div>bubblegum!</div>,
      main: () => <h2>Bubblegum</h2>
    },
    {
      path: "/shoelaces",
      sidebar: () => <div>shoelaces!</div>,
      main: () => <h2>Shoelaces</h2>
    }
  ];
  return (
    // <div className="App-header">
    //   <img src={logo} className="App-logo" alt="logo" />
    //   <NavLink activeClassName="selected" to="/main">Home</NavLink>
    //   <NavLink activeClassName="selected" to="/home">Learning React</NavLink>
    //   <NavLink activeClassName="selected" to="/side">Side Bar</NavLink>
    //   <NavLink activeClassName="selected" to="/bubblegum">bubblegum</NavLink>
    //   <NavLink activeClassName="selected" to="/shoelaces">shoelaces</NavLink>
    // </div>
    <HashRouter className="App" basename='/'>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route path="/side" component={Side} />
        {
          routes.map(r => {
            // console.log(r.main);
            return <Route path={r.path} children={<r.main />} />
          })
        }
      </Switch>
    </HashRouter>
  );
}

export default App;
