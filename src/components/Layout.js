import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "../routes";

class Layout extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Switch>
                    { routes.map( route => <Route key={ route.path } { ...route } /> ) }
                </Switch>
            </div>
        );
    }
}

export default Layout;
