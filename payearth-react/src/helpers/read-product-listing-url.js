const readUrl = (dispatch, reqBody, location, setReqBody, param) => {
    let catId = '';
    let subCatId = '';
    let searchInput = '';

    if (location.pathname === '/product-listing') {
        if (location.search !== null && location.search !== '') {
            if (/cat=([^&]+)/.exec(location.search) !== null) {
                catId = /cat=([^&]+)/.exec(location.search)[1];
            }
            if (/subcat=([^&]+)/.exec(location.search) !== null) {
                subCatId = /subcat=([^&]+)/.exec(location.search)[1];
            }
            if (/search=([^&]+)/.exec(location.search) !== null) {
                searchInput = /search=([^&]+)/.exec(location.search)[1];
            }
        }
    }

    if (param === 'product-listing') {
        if (catId !== '') {
            reqBody.category_filter = [catId];
        }
        if (subCatId !== '') {
            reqBody.sub_category_filter = [subCatId];
        }
        if (searchInput !== '') {
            reqBody.search_value = searchInput;
        }

        dispatch(setReqBody({ reqBody }));
        return reqBody;
    } else if (param === 'header') {
        return { catId: catId, searchInput: searchInput };
    }

    if (location.pathname === '/service-listing') {
        if (location.search !== null && location.search !== '') {
            if (/cat=([^&]+)/.exec(location.search) !== null) {
                catId = /cat=([^&]+)/.exec(location.search)[1];
            }
            if (/search=([^&]+)/.exec(location.search) !== null) {
                searchInput = /search=([^&]+)/.exec(location.search)[1];
            }
        }
    }

    if (param === 'service-listing') {
        if (catId !== '') {
            reqBody.category_filter = [catId];
        }
        if (searchInput !== '') {
            reqBody.search_value = searchInput;
        }

        dispatch(setReqBody({ reqBody }));
        return reqBody;
    } else if (param === 'header') {
        return { catId: catId, searchInput: searchInput };
    }
}

export default readUrl;