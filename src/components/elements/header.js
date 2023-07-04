import React from 'react';
import { ReactComponent as LightningCharge } from 'bootstrap-icons/icons/lightning-charge-fill.svg';

const Header = () => {
    return (
        <header className="p-3 text-bg-dark fixed-top">
            <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <h1 className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                    <LightningCharge className="bi me-2" width="24" height="24" aria-label="Lightning Charge" />
                    Meal Tracker
                </h1>
                <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li><a href="#" className="nav-link px-6 text-secondary">Profile</a></li>
                <li><a href="#" className="nav-link px-6 text-white">Home</a></li>
                </ul>
            </div>
            </div>
        </header>
    );
};
export default Header;
