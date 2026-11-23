tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['DM Sans', 'sans-serif'],
            serif: ['Fraunces', 'serif'],
            mono: ['IBM Plex Mono', 'monospace'],
          },
          colors: {
            paper: '#F4F0E6',
            paperDark: '#EAE3D2',
            ink: '#1C1B18',
            inkMuted: '#575349',
            brass: '#C87D28',
            brassLight: '#E8A848',
            vermilion: '#D14933',
            verdigris: '#2E6F5E',
            prussian: '#264E70',
            plum: '#6B3A5D',
          },
          animation: {
            'shake': 'shake 0.38s cubic-bezier(.36,.07,.19,.97) both',
            'stamp-in': 'stampIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          },
          keyframes: {
            shake: {
              '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
              '20%, 80%': { transform: 'translate3d(3px, 0, 0)' },
              '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
              '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
            },
            stampIn: {
              '0%': { opacity: '0', transform: 'translateY(6px) scale(0.985)' },
              '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
            }
          }
        }
      }
    };
