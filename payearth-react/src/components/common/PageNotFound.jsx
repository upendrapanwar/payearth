import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = props => {
    return (
        <div className="page_not_found">
            <div>
                <h1 className="heading text-center">404</h1>
                <h3 className="heading d-block mt-3">Page Not Found</h3>
                <Link to="/" className="btn btn-primary mt-4">Back To Home</Link>
            </div>
        </div>
    );
}

export default PageNotFound;