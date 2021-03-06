import React from 'react';
import { Route, Link } from 'react-router-dom';

function MenuLink({ label, to, activeOnlyWhenExact }) {
    return (
        <Route
            path={to}
            exact={activeOnlyWhenExact}
            children={({ match }) => (
                <div className={match ? "active" : ""}>
                    {match ? "> " : ""}
                    <Link to={to}>{label}</Link>
                </div>
            )}
        />
    );
}
export { MenuLink }