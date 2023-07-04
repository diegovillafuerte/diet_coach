import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegistrationForm from '../components/auth/RegistrationForm';
import Button from '../components/common/button';

const AuthenticationPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      {showLogin ? <LoginForm /> : <RegistrationForm />}
      <Button onClick={toggleForm}>
        {showLogin ? 'Switch to Signup' : 'Switch to Login'}
      </Button>
    </div>
  );
};

export default AuthenticationPage;