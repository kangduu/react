import React from 'react';

// BrowserRouter or HashRouter ?
import { HashRouter, Switch, Route, Link } from "react-router-dom";

// webpack require.context() api



// components default
import App from '../App';

// 路由权限控制 ？
const Router = () => (
    <HashRouter>
        <div>
            <Link to='/home'>首页</Link>
        </div>
        <Switch>
            <Route path="/home" render={() => Home} />
        </Switch>
    </HashRouter>
)

export default Router