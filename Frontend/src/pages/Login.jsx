import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import PageShell from '../components/PageShell';
import { useAppContext } from '../context/AppContext';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAppContext();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(formState.email, formState.password);
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageShell
      title="Log in"
      maxWidth="max-w-xl"
      sideTitle="Welcome Back"
      sideCopy="Log in to meet new friends or catch up with old ones!"
      sideIcon="💜"
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        <TextInput
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full py-3 text-base">
          Log In
        </Button>
      </form>
    </PageShell>
  );
}

export default Login;
