
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import Footer from '../../../components/common/Footer';
import Header from '../../../components/user/common/Header';
import SpinnerLoader from '../../../components/common/SpinnerLoader';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../store/reducers/cart-slice-reducer";
import {
    setLoading,
    setIsLoginModalOpen,
  } from "../../../store/reducers/global-reducer";


const ListedProducts = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    const [listedProducts, setListedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("new_to_old");
    const [isLoading, setIsLoading] = useState(false);
    const [Discount, setDiscount] = useState('');
    const [DiscountId, setDiscountId] = useState('');

    const itemsPerPage = 4;

    const sortingOptions = [
        { value: "new_to_old", label: "New to Old" },
        { value: "old_to_new", label: "Old to New" },
    ];

    const authInfo = useSelector((state) => state.auth.authInfo);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    /*****************************************************************************/
    /*****************************************************************************/
    useEffect(() => {
        if (id) fetchDealProducts();
    }, [id]);

    useEffect(() => {
        applyFilters();
    }, [listedProducts, currentPage, sortOption]);

    /*****************************************************************************/

    const fetchDealProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`front/product/today-dealsById/${id}`);
            if (response.data.status) {
                const products = response.data.data.productId || [];
                setDiscount(response.data.data.discount)
                setDiscountId(response.data.data._id)
                setListedProducts(products);
                setTotalPages(Math.ceil(products.length / itemsPerPage));
                setCurrentPage(1);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching data.");
        } finally {
            setIsLoading(false);
        }
    };

    /*****************************************************************************/

    const applyFilters = () => {
        let sortedProducts = [...listedProducts];

        if (sortOption === "new_to_old") {
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOption === "old_to_new") {
            sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
        setFilteredProducts(paginatedProducts);
    };

    /*****************************************************************************/

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    /*****************************************************************************/

    const handleSortChange = (selectedOption) => {
        setSortOption(selectedOption.value);
        setCurrentPage(1);
    };

    /*****************************************************************************/

    // const addToCart = (product) => {
    //     console.log('add to cart product---', product)

    // };
    /*****************************************************************************/

     const openmodalHandler = () => {
        toast.error("Buyer login failed....");
        setTimeout(() => {
          dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
          document.body.style.overflow = "hidden";
        }, 2000);
      };
    /*****************************************************************************/
    /*****************************************************************************/

    return (
        <React.Fragment>
            <div className="seller_body">
                <Header />
                <div className="inr_top_page_title">
                    <h2>Listed Items</h2>
                </div>
                <Helmet>
                    <title>{"Listed Items - Pay Earth"}</title>
                </Helmet>
                <div className="tab-content">
                    <div>
                        <Select
                            className="sort_select text-normal ms-auto"
                            options={sortingOptions}
                            value={sortingOptions.find((option) => option.value === sortOption)}
                            onChange={handleSortChange}
                        />

                        <div>
                            {isLoading ? (
                                <SpinnerLoader />
                            ) : filteredProducts.length > 0 ? (
                                <div className="row">
                                    {filteredProducts.map((product, index) => (
                                        <div className="col-md-3" key={index}>
                                            <div className="card">
                                                <img
                                                    src={product.featuredImage}
                                                    alt={product.name}
                                                    className="card-img-top"
                                                />
                                                <div className="card-body">
                                                    <h5>{product.name}</h5>
                                                    {/* <p>{product.price} USD</p> */}
                                                    {product.price && (
                                                        <p>
                                                            <span style={{ textDecoration: 'line-through', marginRight: '8px', color: '#888' }}>
                                                                ${product.price.toFixed(2)}
                                                            </span>
                                                            <span style={{ fontWeight: 'bold', color: 'green' }}>
                                                                ${(product.price - (product.price * Discount) / 100).toFixed(2)} USD
                                                            </span>
                                                        </p>
                                                    )}


                                                    {product.quantity && product.quantity.stock_qty !== 0 ? (
                                                        <div className="d-flex prod_foot">
                                                            {isLoggedIn ? (
                                                                <>
                                                                    <Link
                                                                        className="btn custom_btn btn_yellow_bordered"
                                                                        to={'/my-cart'}
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                addToCart({
                                                                                    id: product.id,
                                                                                    name: product.name,
                                                                                    image: product.image,
                                                                                    price: product.price,
                                                                                    discountId: DiscountId,
                                                                                    discountPercent: Discount
                                                                                })
                                                                            )
                                                                        }
                                                                    >
                                                                        Buy Now
                                                                    </Link>

                                                                    <Link
                                                                        className="btn custom_btn btn_yellow"
                                                                        to={`#`}
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                addToCart({
                                                                                    id: product.id,
                                                                                    name: product.name,
                                                                                    image: product.image,
                                                                                    price: product.price,
                                                                                    quantity: 1,
                                                                                    discountId: DiscountId,
                                                                                    discountPercent: Discount
                                                                                })
                                                                            )
                                                                        }
                                                                    >
                                                                        Add to cart
                                                                    </Link>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Link
                                                                        className="btn custom_btn btn_yellow"
                                                                        to="#"
                                                                        onClick={openmodalHandler}
                                                                    >
                                                                        Buy Now
                                                                    </Link>
                                                                    <Link
                                                                        className="btn custom_btn btn_yellow_bordered"
                                                                        to="#"
                                                                        // add data in session storage...and use
                                                                        // onClick={openmodalHandler}
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                addToCart({
                                                                                    id: product.id,
                                                                                    name: product.name,
                                                                                    image: product.image,
                                                                                    price: product.price,
                                                                                    discountId: DiscountId,
                                                                                    discountPercent: Discount
                                                                                })
                                                                            )
                                                                        }
                                                                    >
                                                                        Add to cart
                                                                    </Link>
                                                                </>
                                                            )}

                                                        </div>
                                                    ) : (
                                                        <h5 className="text-danger text-center">Out of stock</h5>
                                                    )}


                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No products found.</p>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={currentPage === i + 1 ? "active" : ""}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default ListedProducts;
