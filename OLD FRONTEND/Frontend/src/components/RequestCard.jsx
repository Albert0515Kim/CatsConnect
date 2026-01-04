import Button from './Button';
import Card, { CardBody, CardFooter, CardMedia } from './Card';
import Menu from './Menu';

function RequestCard({ profile, onAccept, onDecline }) {
  return (
    <Card>
      <CardMedia className="bg-brand-600">
        <div className="flex h-full items-center justify-center text-white">
          <span className="text-4xl">🐾</span>
        </div>
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
            buttonClassName="flex h-8 w-8 items-center justify-center rounded-full text-xl text-brand-700 hover:bg-slate-100"
            items={[
              { label: 'View Profile', href: `/profile/${profile.id}` },
              { label: 'Accept', onClick: () => onAccept(profile.id) },
              { label: 'Decline', onClick: () => onDecline(profile.id) },
              { label: 'Block' },
            ]}
          >
            ⋯
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
