import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';

function Messages() {
  const { profiles, friends, selectedConversationId, setSelectedConversationId } = useAppContext();
  const friendProfiles = profiles.filter((profile) => friends.includes(profile.id));
  const selectedFriend = friendProfiles.find((profile) => profile.id === selectedConversationId);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-2xl bg-slate-100 p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-brand-700">Conversations</h2>
              <ul className="space-y-3">
                {friendProfiles.map((profile) => (
                  <li key={profile.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedConversationId(profile.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                        selectedConversationId === profile.id
                          ? 'bg-brand-100 text-brand-800'
                          : 'hover:bg-white'
                      }`}
                    >
                      <img
                        src={profile.imageUrl}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-xs text-slate-500">@{profile.username}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            <section className="flex min-h-[320px] flex-col justify-center rounded-2xl bg-white p-8 shadow-md">
              {selectedFriend ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-brand-700">
                    Chatting with {selectedFriend.firstName}
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Messaging UI coming soon. Start the conversation in real life!
                  </p>
                </div>
              ) : (
                <p className="text-center text-lg text-slate-500">
                  Select a friend to start chatting.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Messages;
