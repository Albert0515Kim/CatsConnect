import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCard from '../components/ProfileCard';
import Select from '../components/Select';
import { useAppContext } from '../context/AppContext';

const majors = ['Computer Science', 'Economics', 'Sociology', 'Journalism', 'Biology'];
const years = ['2025', '2026', '2027', '2028', '2029'];

function Home() {
  const {
    profiles,
    currentUserId,
    sendFriendRequest,
    outgoingRequests,
    friends,
  } = useAppContext();
  const currentUser = profiles.find((profile) => profile.id === currentUserId);
  const [searchTerm, setSearchTerm] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (profile.id === currentUserId) {
        return false;
      }
      if (friends.includes(profile.id)) {
        return false;
      }
      const matchesSearch = `${profile.firstName} ${profile.lastName} @${profile.username}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMajor = majorFilter ? profile.major1 === majorFilter : true;
      const matchesYear = yearFilter ? profile.gradYear === yearFilter : true;
      return matchesSearch && matchesMajor && matchesYear;
    });
  }, [profiles, currentUserId, searchTerm, majorFilter, yearFilter]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center gap-4 text-3xl font-bold text-slate-900">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-white">
              {currentUser?.imageUrl ? (
                <img
                  src={currentUser.imageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                'dY?_'
              )}
            </span>
            <h1>Hello, {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Friend'}!</h1>
          </div>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end">
            <label htmlFor="search" className="flex flex-1 flex-col gap-2 text-sm font-medium text-slate-700">
              Search
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  dY"?
                </span>
                <input
                  id="search"
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-base text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
            </label>
            <div className="flex flex-1 flex-col gap-4 md:flex-row">
              <Select
                label="Major"
                id="majorFilter"
                value={majorFilter}
                onChange={(event) => setMajorFilter(event.target.value)}
              >
                <option value="">Major</option>
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </Select>
              <Select
                label="Year"
                id="yearFilter"
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
              >
                <option value="">Class</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onAddFriend={sendFriendRequest}
                isRequested={outgoingRequests.includes(profile.id)}
                isFriend={friends.includes(profile.id)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
