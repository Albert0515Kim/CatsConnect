import { Link } from 'react-router-dom';
import Button from './Button';
import Card, { CardBody, CardFooter, CardMedia } from './Card';
import Menu from './Menu';

function ProfileCard({
  profile,
  onAddFriend,
  isRequested = false,
  isFriend = false,
  isIncomingRequest = false,
}) {
  const isActionDisabled = isRequested || isFriend || isIncomingRequest;
  const actionLabel = isFriend
    ? 'Friends'
    : isRequested
      ? 'Requested'
      : isIncomingRequest
        ? 'Incoming Request'
        : 'Add Friend';
  const actionVariant = isActionDisabled ? 'ghost' : 'green';
  const menuItems = [{ label: 'View Profile', href: `/profile/${profile.id}` }];
  if (!isActionDisabled) {
    menuItems.push({ label: 'Add Friend', onClick: () => onAddFriend(profile.id) });
  }

  return (
    <Card>
      <CardMedia>
        <Link to={`/profile/${profile.id}`} className="block h-full w-full">
          <img
            src={profile.imageUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="h-full w-full object-cover"
          />
        </Link>
      </CardMedia>
      <CardBody>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-brand-700">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-slate-600">@{profile.username}</p>
          </div>
          <Menu
            ariaLabel="Open profile actions"
            buttonClassName="flex h-8 w-8 items-center justify-center rounded-full text-xl text-brand-700"
            items={menuItems}
          >
            ...
          </Menu>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2 py-1">Major: {profile.major1}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">
            Class of {profile.gradYear}
          </span>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          variant={actionVariant}
          className={`w-full ${isActionDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
          disabled={isActionDisabled}
          onClick={isActionDisabled ? undefined : () => onAddFriend(profile.id)}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileCard;
