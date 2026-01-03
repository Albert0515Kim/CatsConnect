function FriendRequestCard({ request, onAccept, onDecline }) {
  return (
    <div className="mb-4 flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">
      <div className="h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-full">
        {request.avatar ? (
          <img src={request.avatar} alt={request.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-400 to-brand-700 text-2xl font-bold text-white">
            {request.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{request.name}</h3>
        <p className="text-sm text-slate-500">
          {request.mutualFriends || 0} mutual friends
        </p>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          onClick={() => onAccept(request.id)}
        >
          Accept
        </button>
        <button
          className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
          onClick={() => onDecline(request.id)}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export default FriendRequestCard;
