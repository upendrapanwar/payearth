import React from 'react';

const Rating = (props) => {
    var actualRating = props.avgRating;
    const ratings = [];
    actualRating = Math.ceil(actualRating);

    for (let index = 0; index < 5; index++) {
        if (index < actualRating) {
            ratings.push(<li className="star rated" key={index}></li>);
        } else {
            ratings.push(<li className="star" key={index}></li>);
        }
    }

    return(
        <ul className="rating">
            {ratings}
        </ul>
    )
}

export default Rating;