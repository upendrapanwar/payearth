import React from 'react';
import { Link } from 'react-router-dom';
import playStore from './../../assets/images/play-store.png';
import appStore from './../../assets/images/app-store.png';
import bitcoin from './../../assets/images/bitcoin.svg';
import litecoin from './../../assets/images/litecoin.svg';
import monerocoin from './../../assets/images/monero.svg';
import americanExpress from './../../assets/images/american-express.svg';
import paypal from './../../assets/images/paypal.svg';
import citi from './../../assets/images/citi.svg';
import bitcoinCard from './../../assets/images/bitcoin-card.svg';
import envelopeIcon from './../../assets/icons/envelope-icon.svg';
import linkedinIcon from './../../assets/icons/linkedin.svg';
import twitterIcon from './../../assets/icons/twitter.svg';
import facebook from './../../assets/icons/facebook.svg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="top">
                            <p className="mb-0">I want to get daily deals & offers in my email</p>
                            <form className="d-flex">
                                <div>
                                    <img src={envelopeIcon} alt="envelope-icon" loading="lazy" decoding="async" />
                                    <input className="form-control rounded-0 border-0" type="email" placeholder="Email address" aria-label="Search" />
                                </div>
                                <button className="btn btn_dark" type="submit">Subscribe</button>
                            </form>
                            <div className="play_store_box">
                                <Link to="#"><img src={playStore} alt="play-store" loading="lazy" decoding="async" /></Link>
                            </div>
                            <div className="app_store_box">
                                <Link to="#"><img src={appStore} alt="app-store" loading="lazy" decoding="async" /></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row gy-3 gy-5 gy-sm-3 py-5 body">
                    <div className="col-xs-12 col-md-4 col-lg-3">
                        <h6 className="title">Customer Care Service</h6>
                        <p>Request a call<br /> to write a message<br /> e-mail: payearth@mailinator.com</p>

                        <h6 className="title mt-5">Follow us</h6>
                        <div className="social_links">
                            <Link to="#" target="_blank" className="d-inline-block me-2"><img src={linkedinIcon} alt="linked-in" loading="lazy" decoding="async" /></Link>
                            <Link to="#" target="_blank" className="d-inline-block me-2"><img src={twitterIcon} alt="twitter" loading="lazy" decoding="async" /></Link>
                            <Link to="#" target="_blank"><img src={facebook} alt="facebook" loading="lazy" decoding="async" /></Link>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4 col-lg-3">
                        <h6 className="title">About company</h6>
                        <ul className="links-list">
                            <li><Link to="/page/bonus-program">Bonus program</Link></li>
                            <li><Link to="/page/how-it-works">How it works</Link></li>
                            <li><Link to="/page/shipping-and-payment">Shipping and payment</Link></li>
                            <li><Link to="/page/purity-guarantee">Purity guarantee</Link></li>
                            <li><Link to="/page/protection">Protection</Link></li>
                            <li><Link to="/page/questions-and-answers">Questions and answers</Link></li>
                            <li><Link to="/user-contact">Contacts</Link></li>
                            {/* <li><Link to="#">Give feedback</Link></li> */}
                        </ul>
                    </div>
                    {/* <div className="col-xs-12 col-md-4 col-lg-3">
                        <h6 className="title">Categories</h6>
                        <ul className="links-list">
                            <li><Link to="/product-listing?cat=60535b192565091ce443d53f&search=undefined">Clothing & accessories</Link></li>
                            <li><Link to="#">Electronics</Link></li>
                            <li><Link to="#">Mobile Phones & Accessories</Link></li>
                            <li><Link to="#">Books and CDS</Link></li>
                            <li><Link to="#">Decor</Link></li>
                            <li><Link to="#">Kids, Toys & mor</Link></li>
                        </ul>
                    </div> */}
                    <div className="col-xs-12 col-md-4 col-lg-3">
                        <h6 className="title">We accept</h6>
                        <div>
                            <Link to="#" target="_blank" className="d-inline-block me-2"><img src={bitcoin} alt="bitcoin" loading="lazy" decoding="async" /></Link>
                            <Link to="#" target="_blank" className="d-inline-block me-2"><img src={litecoin} alt="litecoin" loading="lazy" decoding="async" /></Link>
                            <Link to="#" target="_blank"><img src={monerocoin} alt="monero" loading="lazy" decoding="async" /></Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="bottom">
                            <p className="mb-0">pay.earth 2021. all right reserved</p>
                            <div className="payment_methods">
                                <Link to="#" className="d-inline-block me-2"><img src={americanExpress} alt="american-express" loading="lazy" decoding="async" /></Link>
                                <Link to="#" className="d-inline-block me-2"><img src={paypal} alt="paypal" loading="lazy" decoding="async" /></Link>
                                <Link to="#" className="d-inline-block me-2"><img src={citi} alt="citi" loading="lazy" decoding="async" /></Link>
                                <Link to="#"><img src={bitcoinCard} alt="bitcoin-card" loading="lazy" decoding="async" /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;