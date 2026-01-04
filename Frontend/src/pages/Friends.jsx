import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FriendCard from '../components/FriendCard';
import RequestedCard from '../components/RequestedCard';
import RequestCard from '../components/RequestCard';
import { useAppContext } from '../context/AppContext';

function Friends() {
  const navigate = useNavigate();
  const {
    profiles,
    friends,
    friendRequests,
    outgoingRequests,
    setSelectedConversationId,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend,
  } = useAppContext();

  const friendProfiles = useMemo(
    () => profiles.filter((profile) => friends.includes(profile.id)),
    [profiles, friends],
  );

  const incomingRequestIds = friendRequests.map((request) => request.requesterId);
  const incomingRequestProfiles = useMemo(
    () => profiles.filter((profile) => incomingRequestIds.includes(profile.id)),
    [profiles, incomingRequestIds],
  );

  const outgoingRequestProfiles = useMemo(
    () => profiles.filter((profile) => outgoingRequests.includes(profile.id)),
    [profiles, outgoingRequests],
  );

  const handleMessage = (id) => {
    setSelectedConversationId(id);
    navigate('/messages');
  };

  const handleAccept = async (profileId) => {
    const request = friendRequests.find((item) => item.requesterId === profileId);
    if (!request) {
      return;
    }
    await acceptFriendRequest(request.id);
  };

  const handleDecline = async (profileId) => {
    const request = friendRequests.find((item) => item.requesterId === profileId);
    if (!request) {
      return;
    }
    await declineFriendRequest(request.id);
  };

  const handleCancel = async (profileId) => {
    await cancelFriendRequest(profileId);
  };

  const handleRemove = async (profileId) => {
    await removeFriend(profileId);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <h1 className="text-4xl font-bold text-slate-900">Friends ({friendProfiles.length})</h1>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {friendProfiles.map((profile) => (
              <FriendCard
                key={profile.id}
                profile={profile}
                onMessage={handleMessage}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <h2 className="mt-12 text-4xl font-bold text-slate-900">
            Requests ({incomingRequestProfiles.length})
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {incomingRequestProfiles.map((profile) => (
              <RequestCard
                key={profile.id}
                profile={profile}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </div>
          <h2 className="mt-12 text-4xl font-bold text-slate-900">
            Requested ({outgoingRequestProfiles.length})
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {outgoingRequestProfiles.map((profile) => (
              <RequestedCard key={profile.id} profile={profile} onCancel={handleCancel} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Friends;
