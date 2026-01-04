import { useState, useEffect } from 'react';
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
  const { profiles, currentUserId, updateProfile, uploadProfileImage, isAuthenticated, isAuthReady } =
    useAppContext();
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
    clubs: currentUser?.clubs || [],
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.imageUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClubsOpen, setIsClubsOpen] = useState(false);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isAuthReady, navigate]);

  const handleChange = (event) => {
    const { name, value, multiple, options } = event.target;
    if (multiple) {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormState((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleClub = (club) => {
    setFormState((prev) => {
      const exists = prev.clubs.includes(club);
      const clubsArray = exists
        ? prev.clubs.filter((item) => item !== club)
        : [...prev.clubs, club];
      return { ...prev, clubs: clubsArray };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setRemoveAvatar(false);
    } else {
      setAvatarFile(null);
      setAvatarPreview(currentUser?.imageUrl || null);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      let imageUrl;
      if (avatarFile) {
        imageUrl = await uploadProfileImage(avatarFile);
      }

      await updateProfile({
        ...formState,
        ...(removeAvatar ? { imageUrl: null } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      });
      navigate(`/profile/${currentUserId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
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
          &times;
        </button>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center gap-3">
          <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-brand-100 shadow-sm transition hover:ring-2 hover:ring-brand-300">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload profile photo"
            />
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl text-brand-700">dY?_</span>
            )}
            <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-sm font-semibold text-white group-hover:flex">
              Change
            </span>
          </label>
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">Upload a square image for best results.</p>
            {avatarPreview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Remove photo
              </button>
            )}
          </div>
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
            <span className="text-xs font-normal text-slate-500">
              Share a few interests or what you are looking for in a roommate.
            </span>
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
          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Clubs/Activities</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsClubsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-2 text-left text-base text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {formState.clubs.length === 0 ? 'Select clubs' : formState.clubs.join(', ')}
                <span className="text-slate-400">▾</span>
              </button>
              {isClubsOpen ? (
                <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {clubs.map((club) => {
                      const checked = formState.clubs.includes(club);
                      return (
                        <label
                          key={club}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={checked}
                            onChange={() => toggleClub(club)}
                          />
                          <span>{club}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            <span className="text-xs font-normal text-slate-500">
              Choose all that apply.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <Button type="button" variant="ghost" className="px-10" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="px-10" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </PageShell>
  );
}

export default EditProfile;
