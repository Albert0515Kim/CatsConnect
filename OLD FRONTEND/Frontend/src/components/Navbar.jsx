import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from './Button';
import Menu from './Menu';

function Navbar() {
  const location = useLocation();
  const { currentUserId, profiles } = useAppContext();
  const currentUser = profiles.find((profile) => profile.id === currentUserId);
  const isPublic = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-brand-700">
          CatsConnect
        </Link>
        {isPublic ? (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6 text-sm font-semibold text-brand-700">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? 'text-brand-900' : 'text-brand-700')}
            >
              Home
            </NavLink>
            <NavLink
              to="/friends"
              className={({ isActive }) => (isActive ? 'text-brand-900' : 'text-brand-700')}
            >
              Friends
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) => (isActive ? 'text-brand-900' : 'text-brand-700')}
            >
              Messages
            </NavLink>
            <Menu
              ariaLabel="Open profile menu"
              buttonClassName="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden"
              items={[
                {
                  label: 'My Profile',
                  href: currentUserId ? `/profile/${currentUserId}` : '/profile/me',
                },
                { label: 'Settings', href: '/profile/edit' },
                { label: 'Dark/Light Mode' },
                { label: 'Sign Out', href: '/login' },
              ]}
            >
              {currentUser?.imageUrl ? (
                <img
                  src={currentUser.imageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg">🐾</span>
              )}
            </Menu>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
