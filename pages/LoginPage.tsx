
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockLogin } from '../services/mockApi';
import { ADMIN_USERNAME } from '../constants';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || (username === ADMIN_USERNAME ? "/admin/dashboard" : "/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, user } = await mockLogin(username, isLoginView ? password : undefined);
      auth.login(token, user);
      
      if(user.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <div className="flex border-b border-nova-gray/20 mb-6">
          <button 
            onClick={() => setIsLoginView(true)}
            className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${isLoginView ? 'text-nova-red border-b-2 border-nova-red' : 'text-nova-gray'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLoginView(false)}
            className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${!isLoginView ? 'text-nova-red border-b-2 border-nova-red' : 'text-nova-gray'}`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-nova-light mb-6">
          {isLoginView ? 'Welcome Back' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md text-center">{error}</p>}
          
          <Input 
            label="Username"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {!isLoginView && (
             <Input 
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          )}

          <Input 
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" isLoading={isLoading}>
            {isLoginView ? 'Login' : 'Sign Up'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;