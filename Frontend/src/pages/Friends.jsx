import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FriendCard from '../components/FriendCard';
import RequestedCard from '../components/RequestedCard';
import { useAppContext } from '../context/AppContext';

function Friends() {
  const navigate = useNavigate();
  const {
    profiles,
    friends,
    friendRequests,
    setSelectedConversationId,
  } = useAppContext();

  const friendProfiles = profiles.filter((profile) => friends.includes(profile.id));
  const requestProfiles = profiles.filter((profile) => friendRequests.includes(profile.id));

  const handleMessage = (id) => {
    setSelectedConversationId(id);
    navigate('/messages');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <h1 className="text-4xl font-bold text-slate-900">Friends ({friendProfiles.length})</h1>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {friendProfiles.map((profile) => (
              <FriendCard key={profile.id} profile={profile} onMessage={handleMessage} />
            ))}
          </div>
          <h2 className="mt-12 text-4xl font-bold text-slate-900">
            Requested ({requestProfiles.length})
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {requestProfiles.map((profile) => (
              <RequestedCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Friends;
