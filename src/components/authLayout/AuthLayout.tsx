import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className='relative flex items-center justify-center min-h-[calc(100vh-3.5rem)] p-4 overflow-hidden bg-black'>
      <video
        autoPlay
        loop
        muted
        playsInline
        className='absolute inset-0 w-full h-full object-cover pointer-events-none z-0'
      >
        <source src='/auth-bg.mp4' type='video/mp4' />
      </video>
      <div className='absolute inset-0 bg-black/50 z-10 pointer-events-none'></div>
      <div className='relative z-20 w-full max-w-md bg-white/85 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-8 space-y-6'>
        <Outlet />
      </div>
    </div>
  );
}