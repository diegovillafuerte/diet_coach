import React from 'react';

const Button = ({ type = "button", children, onClick }) => {
    return (
        <button type={type} onClick={onClick} className="btn btn-primary">
            {children}
        </button>
    );
}

export default Button;
