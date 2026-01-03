import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Select from '../components/Select';
import PageShell from '../components/PageShell';
import { useAppContext } from '../context/AppContext';

const majors = [
  'Computer Science',
  'Economics',
  'Sociology',
  'Journalism',
  'Biology',
];
const years = ['2025', '2026', '2027', '2028', '2029'];

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAppContext();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    major1: majors[0],
    major2: '',
    gradYear: years[2],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signup(formState);
    navigate('/home');
  };

  return (
    <PageShell
      title="Create your account"
      subtitle="Start building your profile in minutes."
      maxWidth="max-w-3xl"
      sideTitle="Meet your next study crew"
      sideCopy="Set up your basics so we can recommend Set up your basics so you can start finding classmates and others similar to you!"
      sideItems={['Find like-minded individuals', 'Find common activities and clubs', 'Access to student chats']}
      sideIcon="📚"
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
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput
            label="First Name"
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Last Name"
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <TextInput
          label="Username"
          id="username"
          name="username"
          value={formState.username}
          onChange={handleChange}
          required
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Select
            label="Major 1"
            id="major1"
            name="major1"
            value={formState.major1}
            onChange={handleChange}
          >
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </Select>
          <Select
            label="Major 2 (optional)"
            id="major2"
            name="major2"
            value={formState.major2}
            onChange={handleChange}
          >
            <option value="">Select a major</option>
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </Select>
        </div>
        <Select
          label="Graduation Year"
          id="gradYear"
          name="gradYear"
          value={formState.gradYear}
          onChange={handleChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <Button type="submit" className="w-full py-3 text-base">
          Sign up
        </Button>
      </form>
    </PageShell>
  );
}

export default Signup;
