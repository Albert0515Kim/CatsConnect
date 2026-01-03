import { createContext, useContext, useMemo, useState } from 'react';
import profilesData from '../data/profiles';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [profiles, setProfiles] = useState(profilesData);
  const [currentUserId, setCurrentUserId] = useState('2');
  const [friends, setFriends] = useState(['1', '4', '5']);
  const [friendRequests, setFriendRequests] = useState(['3']);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const login = () => {
    setCurrentUserId('2');
  };

  const signup = (userFields) => {
    const newProfile = {
      id: String(Date.now()),
      firstName: userFields.firstName || 'New',
      lastName: userFields.lastName || 'User',
      username: userFields.username || 'newuser',
      major1: userFields.major1 || 'Computer Science',
      major2: userFields.major2 || '',
      gradYear: userFields.gradYear || '2027',
      dorm: 'Unknown',
      clubs: ['DISC'],
      about: 'Excited to meet new Wildcats on CatsConnect!',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    };
    setProfiles((prev) => [newProfile, ...prev]);
    setCurrentUserId(newProfile.id);
  };

  const sendFriendRequest = (targetId) => {
    if (friends.includes(targetId) || friendRequests.includes(targetId) || targetId === currentUserId) {
      return;
    }
    setFriendRequests((prev) => [...prev, targetId]);
  };

  const acceptRequest = (id) => {
    setFriendRequests((prev) => prev.filter((requestId) => requestId !== id));
    setFriends((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const declineRequest = (id) => {
    setFriendRequests((prev) => prev.filter((requestId) => requestId !== id));
  };

  const updateProfile = (updatedFields) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === currentUserId
          ? {
              ...profile,
              ...updatedFields,
              clubs: Array.isArray(updatedFields.clubs)
                ? updatedFields.clubs
                : profile.clubs,
            }
          : profile
      )
    );
  };

  const value = useMemo(
    () => ({
      currentUserId,
      profiles,
      friends,
      friendRequests,
      selectedConversationId,
      login,
      signup,
      sendFriendRequest,
      acceptRequest,
      declineRequest,
      updateProfile,
      setSelectedConversationId,
    }),
    [
      currentUserId,
      profiles,
      friends,
      friendRequests,
      selectedConversationId,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
