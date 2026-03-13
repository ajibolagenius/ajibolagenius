/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			display: ['var(--font-display)', 'sans-serif'],
  			body: ['var(--font-body)', 'sans-serif'],
  			mono: ['var(--font-mono)', 'monospace'],
  		},
  		maxWidth: {
  			'wrapper': '1160px',
  		},
  		spacing: {
  			'18': '72px',
  		},
  		borderRadius: {
  			DEFAULT: 'var(--r-sharp)',
  			none: 'var(--r-none)',
  			sm: 'var(--r-sm)',
  			md: 'var(--r-md)',
  			lg: 'var(--r-lg)',
  			xl: 'var(--r-xl)',
  			'2xl': 'var(--r-xl)',
  			full: 'var(--r-full)',
  		},
  		boxShadow: {
  			'sharp-sm': 'var(--shadow-sharp-sm)',
  			'sharp-md': 'var(--shadow-sharp-md)',
  			'sharp-lg': 'var(--shadow-sharp-lg)',
  			'sharp-gold': 'var(--shadow-sharp-gold)',
  			'sharp-cosmic': 'var(--shadow-sharp-cosmic)',
  			'sharp-ring': 'var(--shadow-sharp-ring)',
  		},
  		colors: {
  			void: 'var(--void)',
  			sungold: 'var(--sungold)',
  			nebula: 'var(--nebula)',
  			violet: 'var(--violet)',
  			stardust: 'var(--stardust)',
  			surface: 'var(--surface)',
  			elevated: 'var(--elevated)',
  			overlay: 'var(--overlay)',
  			deep: 'var(--deep)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};