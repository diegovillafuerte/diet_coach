import React, { useState } from 'react';
import { useAuth } from '../../utils/authentication';
import Input from '../common/input';
import Button from '../common/button';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Destructure login function from auth context
  const navigate = useNavigate(); // Use react-router's navigate function
  const [loginMessage, setLoginMessage] = useState(null);

  const handleLoginMessage = (error) => {
    setLoginMessage(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Await the login function, since it's async
      await login(email, password).catch(error => {throw error;});
      // If login is successful, navigate to progress page
      navigate('/progress');

    } catch (error) {
      // Here you could handle login errors, for example by setting an error message in the component's state
      handleLoginMessage("Your email or password are invalid. Please try again.");
      console.error("Login failed: ", error);
    }
  };

  return (
    <div>
      {loginMessage && <div className="error">{loginMessage}</div>}
      <form onSubmit={handleSubmit}>
        <Input id='login_email'value={email} onChange={e => setEmail(e.target.value)} placeholder="e-mail" type='email' required/>
        <Input id='login_password' value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required/>
        <Button id='login_submit' type="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
