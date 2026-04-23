export function HeroVideo() {
  return (
    <>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/favicon.svg"
        aria-hidden
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black"
        aria-hidden
      />
    </>
  );
}
