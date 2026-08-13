import React from 'react'
import AuthHeader from '../components/auth/AuthHeader';
import { AuthHeroPanel } from '../components/auth/AuthHeroPanel';
import { AuthActionPanel } from '../components/auth/AuthActionPanel';
import { useWallpaper } from '../context/wallpaper';

function Authpage() {
  const { frameStyle } = useWallpaper();
  return (
    <div
      className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8 bg-cover bg-center transition-all duration-300"
      style={frameStyle}
    >
      <div className="mx-auto flex w-full max-w-368 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background/90 backdrop-blur-xl text-foreground shadow-2xl">
        <AuthHeader />

        <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          <AuthHeroPanel />
          <AuthActionPanel />
        </main>
      </div>
    </div>
  );
}

export default Authpage;