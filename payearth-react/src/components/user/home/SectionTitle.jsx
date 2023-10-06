import React from 'react';
import { Link } from 'react-router-dom';

const SectionTitle = (props) => {
    return(
        <div className="clearfix">
            <h4 className="h4 heading">{props.title}</h4>
            { props.viewMore === true ? <Link to={props.route} className="view_more">View More</Link>: '' }
        </div>
    )
}

export default SectionTitle;