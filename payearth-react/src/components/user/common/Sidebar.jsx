import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import RangeTwoThumbs from './RangeTwoThumbs';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Sidebar = (props) => {
    const {
        sideBarToggle,
        categories,
        pageName,
        onPriceRangeChange,
        onCategoryChange,
        onSubCategoryChange,
        onBrandChange,
    } = props;

    const [brands, setBrands] = useState('')
    const [priceRange, setPriceRange] = useState();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [productSubCategory, setProductSubCategory] = useState([]);
    const [max, setMax] = useState();
    const location = useLocation();


    // useEffect(() => {
    //     const params = queryString.parse(location.search);
    //     if (params.cat && params.cat !== '') {
    //         setSelectedCategories([params.cat]);
    //         onCategoryChange([params.cat]);
    //         getSubCat(params.cat);
    //     }
    //     if (params.subcat && params.subcat !== '') {
    //         setSelectedSubCategories([params.subcat]);
    //         onSubCategoryChange([params.subcat]);
    //     }
    // }, [location.search]);

    useEffect(() => {
        const params = queryString.parse(location.search);

        if ((!params.cat || params.cat.trim() === '') && (!params.searchText || params.searchText.trim() === '')) {
            setSelectedCategories([]);
            setSelectedSubCategories([]);
            setSelectedBrands([]);
            setPriceRange();
            onCategoryChange([]);
            onSubCategoryChange([]);
            onBrandChange([]);
            onPriceRangeChange();
            return; // Exit early to prevent unnecessary processing
        }

        if (params.cat && params.cat.trim() !== '') {
            console.log("params.cat", params.cat)
            setSelectedCategories([params.cat]);
            onCategoryChange([params.cat]);
            getSubCat(params.cat);
        }

        if (params.subcat && params.subcat.trim() !== '') {
            setSelectedSubCategories([params.subcat]);
            onSubCategoryChange([params.subcat]);
        }

        if (params.cat !== null) {
            const categoryId = params.cat;


        }
    }, [location.search]);

    console.log("selectedCategories", selectedCategories)

    useEffect(() => {
        axios
            .get("front/getProductMaxPrice")
            .then((response) => {
                if (response.data.status) {
                    setMax(response.data.data.price);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.error(error);
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("front/allProductBrands")
            .then((response) => {
                if (response.data.status) {
                    setBrands(response.data.data);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.error(error);
                console.log(error);
            });
    }, []);

    const getSubCat = (id) => {
        try {
            const data = {
                'categoryId': id
            }
            axios.post('front/getProductSubCat', data).then((response) => {
                if (response.data.status) {
                    let result = response.data.data;
                    setProductSubCategory(result)
                }
            })
        } catch (error) {
            console.log('Error', error)
        }
    }

    const handleCateCheckbox = (event) => {
        const categoryId = event.target.value;
        getSubCat(categoryId)
        const updatedCategories = event.target.checked
            ? [...selectedCategories, categoryId]
            : selectedCategories.filter(id => id !== categoryId);
        console.log("updatedCategories::::", updatedCategories)
        setSelectedCategories(updatedCategories);
        onCategoryChange(updatedCategories);
    };

    const handleSubCheckbox = (event) => {
        const categoryId = event.target.value;
        const updatedSubCategories = event.target.checked
            ? [...selectedSubCategories, categoryId]
            : selectedSubCategories.filter(id => id !== categoryId);
        setSelectedSubCategories(updatedSubCategories);
        onSubCategoryChange(updatedSubCategories)
    }

    const handleBrandCheckbox = (event) => {
        const brandId = event.target.value;
        const updatedBrands = event.target.checked
            ? [...selectedBrands, brandId]
            : selectedBrands.filter(id => id !== brandId);
        setSelectedBrands(updatedBrands);
        onBrandChange(updatedBrands);
        // if (event.target.checked) {
        //     setSelectedBrands(prevSelected => [...prevSelected, brandId]);
        // } else {
        //     setSelectedBrands(prevSelected => prevSelected.filter(id => id !== brandId));
        // }
    };

    const handleRangeData = (priceRange) => {
        setPriceRange(priceRange);
        onPriceRangeChange(priceRange);
    }

    const renderSubCategoryList = (categoryId) => {
        if (!selectedCategories.includes(categoryId)) return null;
        return (
            <div className="d-flex justify-content-center">
                <ul className="sub_category_list">
                    {productSubCategory
                        .filter((subCategory) => subCategory.parent === categoryId)
                        .map((subCategory, index) => (
                            <li key={subCategory.id}>
                                <div className="form-check d-flex">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={subCategory.id}
                                        value={subCategory.id}
                                        onChange={(event) => handleSubCheckbox(event, index)}
                                    />
                                    <label className="form-check-label" htmlFor={subCategory.id}>
                                        {subCategory.categoryName}
                                    </label>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        );
    };


    return (
        <div className={`side_bar mob-hide ${sideBarToggle ? '' : 'filter-mob-catShow'}`}>
            <div className="filters" >
                {pageName === 'product-listing' && categories.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Categories</h3>
                        </li>
                        {categories.map((category, index) => {
                            if (category.id !== '') {
                                return (
                                    <li key={category.id}>
                                        <div className="form-check d-flex">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={category.id}
                                                value={category.id}
                                                onChange={(event) => handleCateCheckbox(event, index)}
                                                checked={selectedCategories.includes(category.id)}
                                                disabled={selectedSubCategories && selectedSubCategories.length > 0}
                                            />
                                            <label className="form-check-label" htmlFor={category.id}>{category.categoryName}</label>
                                        </div>
                                        {renderSubCategoryList(category.id)}
                                    </li>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ul> : ''
                }
                <ul className="filter_list">
                    <li>
                        <h3>Price</h3>
                    </li>
                    <li className="mb-5">
                        <RangeTwoThumbs currency="USD" currencySymbol="$" sendRanges={handleRangeData} MAX={max} />
                    </li>
                </ul>
                {pageName === 'product-listing' && brands.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Brands</h3>
                        </li>
                        {brands.map((brand, index) => {
                            if (brands.id !== '') {
                                return (
                                    <li key={brand.id}>
                                        <div className="form-check d-flex align-items-center">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={brand.id}
                                                value={brand.id}
                                                onChange={(event) => handleBrandCheckbox(event, index)}
                                                checked={selectedBrands.includes(brand.id)}
                                            />
                                            {/* <label className="form-check-label" htmlFor={brand.id}>{brand.brandName}</label> */}
                                            <label className="form-check-label d-flex align-items-center" htmlFor={brand.id}>
                                                <div className="d-flex align-items-center">
                                                    {brand.logoImage && (
                                                        <img
                                                            src={brand.logoImage}
                                                            alt={brand.brandName}
                                                            style={{
                                                                width: '45px',
                                                                height: '45px',
                                                                marginRight: '10px',
                                                            }}
                                                        />
                                                    )}
                                                    <span>{brand.brandName}</span>
                                                </div>
                                            </label>
                                        </div>
                                    </li>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ul> : ''
                }
            </div>
        </div>
    )
}

export default Sidebar;