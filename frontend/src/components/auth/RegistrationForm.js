import React, { useState } from 'react';
import { useAuth } from '../../utils/authentication';
import Input from '../common/input';
import Button from '../common/button';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { register } = useAuth(); // Destructure login function from auth context
  const navigate = useNavigate(); // Use react-router's navigate function
  const [registrationError, setRegistrationError] = useState(null);

  const handleRegistrationError = (error) => {
    setRegistrationError(error);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Await the register function, since it's async
      await register(email, password, name).catch(error => {throw error;});
      // If registrations is successful, navigate to progress page
      navigate('/success');

    } catch (error) {
      // Here you could handle login errors, for example by setting an error message in the component's state
      handleRegistrationError("The Email you entered is already in use. Please try again.");
      console.error("Login failed: ", error);
    }
  };

  return (
    <div>
      {registrationError && <div className="error">{registrationError}</div>}
      <form onSubmit={handleSubmit}>
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="e-mail" type='email' required />
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
