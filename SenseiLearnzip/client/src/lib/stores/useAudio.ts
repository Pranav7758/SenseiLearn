import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

export const useAudio = create<AudioState>()(
  persist(
    (set, get) => ({
      backgroundMusic: null,
      hitSound: null,
      successSound: null,
      isMuted: true,
      
      setBackgroundMusic: (music) => set({ backgroundMusic: music }),
      setHitSound: (sound) => set({ hitSound: sound }),
      setSuccessSound: (sound) => set({ successSound: sound }),
      
      toggleMute: () => {
        const { isMuted, backgroundMusic } = get();
        const newMuted = !isMuted;
        
        if (backgroundMusic) {
          if (newMuted) {
            backgroundMusic.pause();
          } else {
            backgroundMusic.play().catch(() => {});
          }
        }
        
        set({ isMuted: newMuted });
      },
      
      playHit: () => {
        const { hitSound, isMuted } = get();
        if (hitSound && !isMuted) {
          hitSound.currentTime = 0;
          hitSound.play().catch(() => {});
        }
      },
      
      playSuccess: () => {
        const { successSound, isMuted } = get();
        if (successSound && !isMuted) {
          successSound.currentTime = 0;
          successSound.play().catch(() => {});
        }
      },
      
      playBackgroundMusic: () => {
        const { backgroundMusic, isMuted } = get();
        if (backgroundMusic && !isMuted) {
          backgroundMusic.play().catch(() => {});
        }
      },
      
      stopBackgroundMusic: () => {
        const { backgroundMusic } = get();
        if (backgroundMusic) {
          backgroundMusic.pause();
          backgroundMusic.currentTime = 0;
        }
      },
    }),
    {
      name: "sensei-audio",
      partialize: (state) => ({ isMuted: state.isMuted }),
    }
  )
);
