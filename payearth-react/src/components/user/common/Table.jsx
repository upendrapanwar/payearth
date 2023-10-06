import React from 'react';

const Table = (props) => {
    const { title, data, action } = props;

    const getKeys = () => {
        return Object.keys(data[0]);
    }

    const camelPad = (str) => { return str
        // Look for long acronyms and filter out the last letter
        .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
        // Look for lower-case letters followed by upper-case letters
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        // Look for lower-case letters followed by numbers
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace(/^./, function(str){ return str.toUpperCase(); })
        // Remove any white space left around the word
        .trim();
    }

    const getHeader = () => {
        var keys = getKeys();
        return keys.map((key, index)=>{
            return <th key={key}>{camelPad(key).toUpperCase()}</th>
        })
    }

    const RenderRow = (props) =>{
        return props.keys.map((key, index)=>{
            if (key === 'image') {
                return <td key={props.data[key]}>
                            <div className="odr_item_img">
                                <img src={props.data[key]} className="img-fluid" alt="..." />
                            </div>
                        </td>
            } else {
                return <td key={props.data[key]}>{props.data[key]}</td>
            }
        })
    }

    const getRowsData = () => {
        var items = data;
        var keys = getKeys();
        return items.map((row, index)=>{
            return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
        })
    }

    return(
        <div className="cart wishlist">
            <div className="cart_wrap">
                <div className="items_incart">
                    <span>{title}</span>
                </div>
            </div>
            <div className="cart_list cart_wrap pb-5">
                <table className="table table-responsive table-hover pe_table">
                    <thead>
                        <tr>
                            {getHeader()}
                            <th scope="col" className={action === false ? 'd-none' : ''}>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getRowsData()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table;