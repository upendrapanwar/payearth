function isLogin() {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
    if (isLoggedIn !== null && isLoggedIn) {
        return true;
    } else {
        return false;
    }
}

export { isLogin };