import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AppContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_STORAGE_KEY = 'cc_access_token';
const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80';

const mapProfile = (profile) => ({
  id: profile.id,
  email: profile.email,
  firstName: profile.first_name ?? profile.firstName ?? '',
  lastName: profile.last_name ?? profile.lastName ?? '',
  username: profile.username ?? '',
  major1: profile.major1 ?? '',
  major2: profile.major2 ?? '',
  gradYear: profile.grad_year ?? profile.gradYear ?? '',
  dorm: profile.dorm ?? '',
  clubs: profile.clubs ?? [],
  about: profile.about ?? '',
  imageUrl: profile.image_url ?? profile.imageUrl ?? FALLBACK_AVATAR,
});

const buildProfileUpdatePayload = (data) => {
  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    username: data.username,
    major1: data.major1,
    major2: data.major2 === '' ? null : data.major2,
    grad_year: data.gradYear,
    dorm: data.dorm,
    clubs: data.clubs,
    about: data.about,
    image_url: data.imageUrl,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
};

export function AppProvider({ children }) {
  const [token, setToken] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const clearSession = useCallback(() => {
    setToken(null);
    setProfiles([]);
    setFriends([]);
    setFriendRequests([]);
    setOutgoingRequests([]);
    setCurrentUserId(null);
    setSelectedConversationId(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const request = useCallback(
    async (path, { method = 'GET', body, tokenOverride } = {}) => {
      const headers = {};
      if (body) {
        headers['Content-Type'] = 'application/json';
      }

      const activeToken = tokenOverride !== undefined ? tokenOverride : token;
      if (activeToken) {
        headers.Authorization = `Bearer ${activeToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response
        .json()
        .catch(() => ({ error: 'Unable to parse server response.' }));

      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
        }
        throw new Error(data.error || 'Request failed.');
      }

      return data;
    },
    [token, clearSession],
  );

  const hydrate = useCallback(
    async (activeToken) => {
      if (!activeToken) {
        return;
      }

      setIsLoading(true);
      try {
        const [{ profiles: profilesData }, { friends: friendsData }, { requests }] =
          await Promise.all([
            request('/api/profiles', { tokenOverride: activeToken }),
            request('/api/friends', { tokenOverride: activeToken }),
            request('/api/friends/requests', { tokenOverride: activeToken }),
          ]);

        setProfiles(profilesData.map(mapProfile));
        setFriends(friendsData);
        setFriendRequests(
          requests.map((requestRow) => ({
            id: requestRow.id,
            requesterId: requestRow.requester_id,
            recipientId: requestRow.recipient_id,
            status: requestRow.status,
          })),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [request],
  );

  const fetchCurrentUser = useCallback(
    async (activeToken) => {
      if (!activeToken) {
        return;
      }

      try {
        const { user } = await request('/api/auth/me', { tokenOverride: activeToken });
        if (user?.id) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [request],
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchCurrentUser(token);
    hydrate(token);
  }, [token, fetchCurrentUser, hydrate]);

  const login = useCallback(
    async (email, password) => {
      const { session, user } = await request('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        tokenOverride: null,
      });

      if (!session?.access_token) {
        throw new Error('Missing access token in login response.');
      }

      setToken(session.access_token);
      localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token);
      setCurrentUserId(user?.id || null);
      await hydrate(session.access_token);
    },
    [request, hydrate],
  );

  const signup = useCallback(
    async (payload) => {
      await request('/api/auth/signup', {
        method: 'POST',
        body: payload,
        tokenOverride: null,
      });

      await login(payload.email, payload.password);
    },
    [request, login],
  );

  const updateProfile = useCallback(
    async (updates) => {
      const payload = buildProfileUpdatePayload(updates);
      const { profile } = await request('/api/profiles/me', {
        method: 'PUT',
        body: payload,
      });

      const mappedProfile = mapProfile(profile);
      setProfiles((prev) =>
        prev.map((item) => (item.id === mappedProfile.id ? mappedProfile : item)),
      );

      return mappedProfile;
    },
    [request],
  );

  const refreshFriends = useCallback(async () => {
    if (!token) {
      return [];
    }

    const { friends: friendsData } = await request('/api/friends');
    setFriends(friendsData);
    return friendsData;
  }, [request, token]);

  const refreshRequests = useCallback(async () => {
    if (!token) {
      return [];
    }

    const { requests } = await request('/api/friends/requests');
    const mapped = requests.map((requestRow) => ({
      id: requestRow.id,
      requesterId: requestRow.requester_id,
      recipientId: requestRow.recipient_id,
      status: requestRow.status,
    }));
    setFriendRequests(mapped);
    return mapped;
  }, [request, token]);

  const sendFriendRequest = useCallback(
    async (recipientId) => {
      await request('/api/friends/requests', {
        method: 'POST',
        body: { recipientId },
      });
      setOutgoingRequests((prev) =>
        prev.includes(recipientId) ? prev : [...prev, recipientId],
      );
    },
    [request],
  );

  const acceptFriendRequest = useCallback(
    async (requestId) => {
      await request(`/api/friends/requests/${requestId}/accept`, { method: 'POST' });
      await Promise.all([refreshFriends(), refreshRequests()]);
    },
    [request, refreshFriends, refreshRequests],
  );

  const declineFriendRequest = useCallback(
    async (requestId) => {
      await request(`/api/friends/requests/${requestId}/decline`, { method: 'POST' });
      await refreshRequests();
    },
    [request, refreshRequests],
  );

  const isAuthenticated = Boolean(token);

  const contextValue = useMemo(
    () => ({
      profiles,
      friends,
      friendRequests,
      outgoingRequests,
      currentUserId,
      selectedConversationId,
      setSelectedConversationId,
      isLoading,
      login,
      signup,
      updateProfile,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      refreshFriends,
      refreshRequests,
      isAuthenticated,
      isAuthReady,
    }),
    [
      profiles,
      friends,
      friendRequests,
      outgoingRequests,
      currentUserId,
      selectedConversationId,
      isLoading,
      login,
      signup,
      updateProfile,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      refreshFriends,
      refreshRequests,
      isAuthenticated,
      isAuthReady,
    ],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
