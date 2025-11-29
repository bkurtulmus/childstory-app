// Illustration components for onboarding slides

export function BookIllustration() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book */}
      <rect
        x="40"
        y="60"
        width="120"
        height="100"
        rx="8"
        fill="white"
        opacity="0.95"
      />
      <rect
        x="40"
        y="60"
        width="60"
        height="100"
        fill="white"
        opacity="0.8"
      />
      <line
        x1="100"
        y1="60"
        x2="100"
        y2="160"
        stroke="#667085"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* Pages detail */}
      <line x1="55" y1="80" x2="85" y2="80" stroke="#C8C5FF" strokeWidth="2" opacity="0.5" />
      <line x1="55" y1="90" x2="85" y2="90" stroke="#C8C5FF" strokeWidth="2" opacity="0.5" />
      <line x1="55" y1="100" x2="80" y2="100" stroke="#C8C5FF" strokeWidth="2" opacity="0.5" />
      
      <line x1="115" y1="80" x2="145" y2="80" stroke="#7DB6F8" strokeWidth="2" opacity="0.5" />
      <line x1="115" y1="90" x2="145" y2="90" stroke="#7DB6F8" strokeWidth="2" opacity="0.5" />
      <line x1="115" y1="100" x2="140" y2="100" stroke="#7DB6F8" strokeWidth="2" opacity="0.5" />
      
      {/* Magic sparkles */}
      <circle cx="35" cy="50" r="4" fill="#F6A6D7">
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="165" cy="55" r="3" fill="#B3E6C5">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="165" r="3" fill="#7DB6F8">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="155" cy="165" r="4" fill="#C8C5FF">
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Star shapes */}
      <path
        d="M100 30 L102 36 L108 38 L102 40 L100 46 L98 40 L92 38 L98 36 Z"
        fill="#F6A6D7"
        opacity="0.8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 30"
          to="360 100 30"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M170 100 L171.5 104 L175.5 105.5 L171.5 107 L170 111 L168.5 107 L164.5 105.5 L168.5 104 Z"
        fill="#B3E6C5"
        opacity="0.8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 170 100"
          to="360 170 100"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export function AIIllustration() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot head */}
      <rect
        x="60"
        y="70"
        width="80"
        height="80"
        rx="16"
        fill="white"
        opacity="0.95"
      />
      
      {/* Antenna */}
      <line x1="100" y1="70" x2="100" y2="50" stroke="white" strokeWidth="3" opacity="0.8" />
      <circle cx="100" cy="45" r="5" fill="#7DB6F8">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Eyes */}
      <circle cx="80" cy="95" r="8" fill="#7DB6F8" />
      <circle cx="120" cy="95" r="8" fill="#7DB6F8" />
      <circle cx="82" cy="93" r="3" fill="white" />
      <circle cx="122" cy="93" r="3" fill="white" />
      
      {/* Smile */}
      <path
        d="M 75 120 Q 100 130 125 120"
        stroke="#C8C5FF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Gear/tech elements */}
      <circle cx="70" cy="130" r="6" stroke="#B3E6C5" strokeWidth="2" fill="none" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 70 130"
          to="360 70 130"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="130" cy="130" r="6" stroke="#F6A6D7" strokeWidth="2" fill="none" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 130 130"
          to="-360 130 130"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Magic particles */}
      <circle cx="40" cy="80" r="3" fill="#F6A6D7">
        <animate
          attributeName="cy"
          values="80;75;80"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="160" cy="90" r="4" fill="#B3E6C5">
        <animate
          attributeName="cy"
          values="90;85;90"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="140" r="3" fill="#7DB6F8">
        <animate
          attributeName="cy"
          values="140;135;140"
          dur="1.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="150" cy="140" r="4" fill="#C8C5FF">
        <animate
          attributeName="cy"
          values="140;135;140"
          dur="2.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Stars */}
      <path
        d="M30 60 L31.5 64 L35.5 65.5 L31.5 67 L30 71 L28.5 67 L24.5 65.5 L28.5 64 Z"
        fill="#F6A6D7"
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 30 60"
          to="360 30 60"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M170 60 L171.5 64 L175.5 65.5 L171.5 67 L170 71 L168.5 67 L164.5 65.5 L168.5 64 Z"
        fill="#B3E6C5"
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 170 60"
          to="360 170 60"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export function ShieldIllustration() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield */}
      <path
        d="M100 40 L140 55 L140 95 C140 120 125 140 100 155 C75 140 60 120 60 95 L60 55 Z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M100 40 L140 55 L140 95 C140 120 125 140 100 155 C75 140 60 120 60 95 L60 55 Z"
        stroke="#7DB6F8"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Lock */}
      <rect
        x="85"
        y="95"
        width="30"
        height="30"
        rx="4"
        fill="#7DB6F8"
        opacity="0.8"
      />
      <path
        d="M 90 95 L90 85 C90 77 95 72 100 72 C105 72 110 77 110 85 L110 95"
        stroke="#7DB6F8"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="100" cy="110" r="4" fill="white" opacity="0.9" />
      
      {/* Checkmark accent */}
      <path
        d="M 92 107 L97 112 L108 101"
        stroke="#B3E6C5"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      
      {/* Protective particles */}
      <circle cx="75" cy="70" r="3" fill="#B3E6C5">
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="125" cy="70" r="3" fill="#B3E6C5">
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="2.3s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="70" cy="100" r="4" fill="#7DB6F8">
        <animate
          attributeName="opacity"
          values="0.4;0.9;0.4"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="130" cy="100" r="4" fill="#7DB6F8">
        <animate
          attributeName="opacity"
          values="0.4;0.9;0.4"
          dur="2.1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="80" cy="130" r="3" fill="#C8C5FF">
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="120" cy="130" r="3" fill="#C8C5FF">
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="1.9s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Sparkles */}
      <path
        d="M50 90 L51.5 94 L55.5 95.5 L51.5 97 L50 101 L48.5 97 L44.5 95.5 L48.5 94 Z"
        fill="#F6A6D7"
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 90"
          to="360 50 90"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M150 90 L151.5 94 L155.5 95.5 L151.5 97 L150 101 L148.5 97 L144.5 95.5 L148.5 94 Z"
        fill="#B3E6C5"
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 150 90"
          to="360 150 90"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M100 165 L101.5 169 L105.5 170.5 L101.5 172 L100 176 L98.5 172 L94.5 170.5 L98.5 169 Z"
        fill="#7DB6F8"
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 165"
          to="360 100 165"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
