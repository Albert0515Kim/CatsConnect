import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Select from '../components/Select';
import PageShell from '../components/PageShell';
import { useAppContext } from '../context/AppContext';

const majors = ['Computer Science', 'Economics', 'Sociology', 'Journalism', 'Biology'];
const years = ['2025', '2026', '2027', '2028', '2029'];
const dorms = ['Elder Hall', 'Allison Hall', 'Kemper Hall', 'Off-Campus'];
const clubs = ['DISC', 'Basketball', 'Field Hockey', 'Hack Club', 'Design Collective'];

function EditProfile() {
  const navigate = useNavigate();
  const { profiles, currentUserId, updateProfile } = useAppContext();
  const currentUser = profiles.find((profile) => profile.id === currentUserId);

  const [formState, setFormState] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    gradYear: currentUser?.gradYear || years[0],
    username: currentUser?.username || '',
    major1: currentUser?.major1 || majors[0],
    major2: currentUser?.major2 || '',
    about: currentUser?.about || '',
    dorm: currentUser?.dorm || dorms[0],
    clubs: currentUser?.clubs?.[0] || clubs[0],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile({
      ...formState,
      clubs: [formState.clubs],
    });
    navigate(`/profile/${currentUserId}`);
  };

  return (
    <PageShell
      title="Edit profile"
      maxWidth="max-w-5xl"
      headerAction={(
        <button
          type="button"
          className="rounded-full border border-slate-200 px-3 py-1 text-lg text-slate-500 transition hover:text-slate-700"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center">
          {currentUser?.imageUrl ? (
            <img
              src={currentUser.imageUrl}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-3xl text-white">
              🐾
            </div>
          )}
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <TextInput
            label="First Name"
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
          />
          <TextInput
            label="Last Name"
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
          />
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
          <TextInput
            label="Username"
            id="username"
            name="username"
            value={formState.username}
            onChange={handleChange}
            className="md:col-span-2"
          />
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
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
            About Me
            <textarea
              name="about"
              value={formState.about}
              onChange={handleChange}
              rows={4}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <Select
            label="Dorm"
            id="dorm"
            name="dorm"
            value={formState.dorm}
            onChange={handleChange}
          >
            {dorms.map((dorm) => (
              <option key={dorm} value={dorm}>
                {dorm}
              </option>
            ))}
          </Select>
          <Select
            label="Clubs/Activities"
            id="clubs"
            name="clubs"
            value={formState.clubs}
            onChange={handleChange}
          >
            {clubs.map((club) => (
              <option key={club} value={club}>
                {club}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <Button type="button" variant="ghost" className="px-10" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="px-10">
            Update Profile
          </Button>
        </div>
      </form>
    </PageShell>
  );
}

export default EditProfile;
