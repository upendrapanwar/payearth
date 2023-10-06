const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDate(param) {
    let date = new Date(param);
    return (date.getDate() + '-' + monthsNames[date.getMonth()] + '-' + date.getFullYear());
}

export default getDate;