import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className='relative flex items-center justify-center min-h-[calc(100vh-3.5rem)] p-4 overflow-hidden bg-black'>
      <iframe
        src='https://www.youtube.com/embed/yLjBzE71oII?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&modestbranding=0&iv_load_policy=3&playsinline=1&rel=0&playlist=yLjBzE71oII'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        className='absolute inset-0 w-full h-full scale-[3] md:scale-[1.5] pointer-events-none z-0 object-cover'
      ></iframe>
      <div className='absolute inset-0 bg-black/50 z-10 pointer-events-none'></div>
      <div className='relative z-20 w-full max-w-md bg-white/85 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-8 space-y-6'>
        <Outlet />
      </div>
    </div>
  );
}