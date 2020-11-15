/*
 * @Author: dukang 
 * @Date: 2020-11-12 22:41:04 
 * @Last Modified by: dukang
 * @Last Modified time: 2020-11-12 22:53:35
 */
import React from 'react';
import './App.css';
// import test from './test.module.scss';

import { HashRouter, Switch, Route, Link, NavLink } from "react-router-dom";
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
      <div style={{ width: '100%', height: '50vh' }} >
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
      </div>
    </HashRouter>
  );
}

export default App;
