import { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <>
      {isLogin ? (
        <Login 
          onLogin={onLogin} 
          switchToRegister={switchToRegister} 
        />
      ) : (
        <Register 
          switchToLogin={switchToLogin} 
        />
      )}
    </>
  );
};

export default AuthContainer;
