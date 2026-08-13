import React from 'react'
import { useWallpaper } from '../context/wallpaper';

function Chatpage() {
  const { frameStyle } = useWallpaper();
  return (
    <div
      className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8 bg-cover bg-center transition-all duration-300"
      style={frameStyle}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background/90 backdrop-blur-xl text-foreground shadow-2xl">
        Chatpage
      </div>
    </div>
  );
}

export default Chatpage;