export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-md p-8">{children}</div>
      </div>

      <div className="w-1/2 bg-cover bg-center">
        <video
          src="https://framerusercontent.com/assets/g2ttqRHn2wKZ109f4vX2nBbwJc.mp4"
          loop={true}
          autoPlay={true}
          muted={true}
          playsInline={true}
          className="cursor-auto w-full h-full rounded-none block object-contain bg-transparent object-center"
        />
      </div>
    </div>
  );
}
