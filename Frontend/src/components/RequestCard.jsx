import { Link } from 'react-router-dom';
import Button from './Button';
import Card, { CardBody, CardFooter, CardMedia } from './Card';
import Menu from './Menu';

function RequestCard({ profile, onAccept, onDecline }) {
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
            ariaLabel="Open request actions"
            buttonClassName="flex h-9 w-9 items-center justify-center rounded-full text-lg text-brand-700"
            items={[
              { label: 'View Profile', href: `/profile/${profile.id}` },
              { label: 'Accept', onClick: () => onAccept(profile.id) },
              { label: 'Decline', onClick: () => onDecline(profile.id) },
            ]}
          >
            <span aria-hidden="true" className="flex h-full w-full items-center justify-center leading-none">
              ...
            </span>
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
        <Button variant="outline" className="w-full" onClick={() => onDecline(profile.id)}>
          Decline
        </Button>
        <Button className="w-full" onClick={() => onAccept(profile.id)}>
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RequestCard;
