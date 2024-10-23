// eslint-disable-next-line react/prop-types
const Video = ({ user, video }) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg aspect-video bg-slate-300">
      <video
        playsInline
        muted
        ref={video}
        autoPlay
        className="object-cover w-full h-full"
      />
      <div className="absolute px-2 py-1 text-sm bg-white rounded-lg shadow-lg bottom-2 left-2">
        {user}
      </div>
    </div>
  );
};

export default Video;
