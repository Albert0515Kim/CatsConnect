import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';

function Profile() {
  const { id } = useParams();
  const { profiles, currentUserId, sendFriendRequest, friends } = useAppContext();
  const resolvedId = id === 'me' ? currentUserId : id;
  const profile = profiles.find((person) => person.id === resolvedId);
  const isSelf = resolvedId === currentUserId;
  const isFriend = friends.includes(resolvedId);

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-lg text-slate-500">Profile not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="rounded-3xl bg-brand-50 p-8 shadow-md">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-3xl text-white">
                  🐾
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-lg text-brand-700">@{profile.username}</p>
                </div>
              </div>
              {isSelf ? (
                <Link to="/profile/edit">
                  <Button variant="green" className="px-6 py-3 text-base">
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="green"
                  className="px-6 py-3 text-base"
                  onClick={() => sendFriendRequest(profile.id)}
                  disabled={isFriend}
                >
                  {isFriend ? 'Friends' : 'Add Friend'}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-brand-50 p-8 shadow-md">
            <h2 className="text-2xl font-bold text-brand-700">About Me</h2>
            <p className="mt-3 text-slate-700">
              {profile.about ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mi felis, tristique ac eleifend nec.'}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-brand-50 p-8 shadow-md">
              <div className="space-y-4 text-slate-700">
                <div>
                  <p className="text-lg font-semibold text-brand-700">Class</p>
                  <p>{profile.gradYear}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-brand-700">Major</p>
                  <p>{profile.major1}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-brand-700">Dorm</p>
                  <p>{profile.dorm}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-brand-700">Clubs/Activities</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {(profile.clubs || []).map((club) => (
                      <li key={club}>{club}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-brand-50 p-8 shadow-md">
              <h3 className="text-2xl font-bold text-brand-700">Friends</h3>
              <div className="mt-4 space-y-4">
                {profiles
                  .filter((person) => friends.includes(person.id))
                  .slice(0, 2)
                  .map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <img
                        src={friend.imageUrl}
                        alt={`${friend.firstName} ${friend.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-brand-700">
                          {friend.firstName} {friend.lastName}
                        </p>
                        <p className="text-sm text-slate-600">@{friend.username}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
