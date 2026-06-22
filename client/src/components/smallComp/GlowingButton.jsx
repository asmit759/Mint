import React from 'react';
import styled from 'styled-components';

const GlowingButton = ({ text, icon, onClick, activeText, className = "", type = "button", disabled = false }) => {
  return (
    <StyledWrapper className={className} onClick={!disabled ? onClick : undefined} style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
      <div className="btn-wrapper w-full">
        <button className="btn w-full" type={type} disabled={disabled}>
          {icon && React.cloneElement(icon, { className: "btn-svg" })}
          <div className="txt-wrapper">
            <div className="txt-1">
              {text.split('').map((char, index) => (
                <span className="btn-letter" key={index}>{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </div>
            <div className="txt-2">
              {(activeText || text).split('').map((char, index) => (
                <span className="btn-letter" key={index}>{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </div>
          </div>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  
  .btn-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .btn {
    --border-radius: 16px;
    --padding: 4px;
    --transition: 0.4s;
    --button-color: rgba(20, 20, 20, 0.4);
    --highlight-color-hue: 90deg; /* Green-yellow */

    position: relative;
    z-index: 1;
    user-select: none;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.8em 1.2em;
    font-family: "Poppins", "Inter", "Segoe UI", sans-serif;
    font-size: 0.95em;
    font-weight: 500;
    min-height: 52px;

    background-color: var(--button-color);

    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      inset 0px 4px 4px rgba(255, 255, 255, 0.1),
      inset 0px 8px 8px rgba(255, 255, 255, 0.05),
      0px -1px 1px rgba(0, 0, 0, 0.02),
      0px -2px 2px rgba(0, 0, 0, 0.03),
      0px -4px 4px rgba(0, 0, 0, 0.05);

    border: solid 1px rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius);
    cursor: pointer;

    transition:
      box-shadow var(--transition),
      border var(--transition),
      background-color var(--transition);
  }
  
  .btn::before {
    content: "";
    position: absolute;
    top: calc(0px - var(--padding));
    left: calc(0px - var(--padding));
    width: calc(100% + var(--padding) * 2);
    height: calc(100% + var(--padding) * 2);
    border-radius: calc(var(--border-radius) + var(--padding));
    pointer-events: none;
    background-image: linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6));

    z-index: -2;
    transition:
      box-shadow var(--transition),
      filter var(--transition);
    box-shadow:
      0 -8px 8px -6px rgba(0,0,0,0) inset,
      1px 1px 1px rgba(255,255,255,0.1),
      2px 2px 2px rgba(255,255,255,0.05),
      -1px -1px 1px rgba(0,0,0,0.1);
  }
  
  .btn::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    pointer-events: none;
    z-index: -1;
    background-image: linear-gradient(
      0deg,
      #fff,
      hsl(var(--highlight-color-hue), 100%, 70%),
      hsla(var(--highlight-color-hue), 100%, 70%, 50%),
      8%,
      transparent
    );
    background-position: 0 0;
    opacity: 0;
    transition:
      opacity var(--transition),
      filter var(--transition);
  }

  .btn-letter {
    position: relative;
    display: inline-block;
    color: #ffffff;
    font-weight: 600;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    animation: letter-anim 2s ease-in-out infinite;
    transition:
      color var(--transition),
      text-shadow var(--transition),
      opacity var(--transition);
  }

  @keyframes letter-anim {
    50% {
      text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
      color: #fff;
    }
  }

  .btn-svg {
    flex-shrink: 0;
    height: 22px;
    width: 22px;
    margin-right: 0.7rem;
    color: #ffffff;
    stroke-width: 2.5;
    animation: flicker 2s linear infinite;
    animation-delay: 0.5s;
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.4));
    transition:
      color var(--transition),
      filter var(--transition),
      opacity var(--transition);
  }
  
  @keyframes flicker {
    50% {
      opacity: 0.8;
    }
  }

  .txt-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    white-space: nowrap;
    min-width: 4em;
    flex-grow: 1;
    min-height: 24px;
  }
  
  .txt-1,
  .txt-2 {
    position: absolute;
    left: 0;
  }
  
  .txt-1 {
    animation: appear-anim 1s ease-in-out forwards;
  }
  
  .txt-2 {
    opacity: 0;
  }
  
  @keyframes appear-anim {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  .btn:hover .txt-1, .btn:focus .txt-1 {
    animation: opacity-anim 0.3s ease-in-out forwards;
    animation-delay: 0.2s;
  }
  
  .btn:hover .txt-2, .btn:focus .txt-2 {
    animation: opacity-anim 0.3s ease-in-out reverse forwards;
    animation-delay: 0.2s;
  }
  
  @keyframes opacity-anim {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .btn:hover .btn-letter, .btn:focus .btn-letter {
    animation:
      focused-letter-anim 1s ease-in-out forwards,
      letter-anim 1.2s ease-in-out infinite;
    animation-delay: 0s, 1s;
  }
  
  @keyframes focused-letter-anim {
    0%,
    100% { filter: blur(0px); }
    50% {
      transform: scale(1.05); /* Reduced scale to prevent text overlap in small buttons */
      filter: blur(1px) brightness(150%)
        drop-shadow(-4px 2px 6px hsl(var(--highlight-color-hue), 100%, 70%));
    }
  }

  .btn:hover::before, .btn:focus::before {
    box-shadow:
      0 -8px 12px -6px rgba(255,255,255,0.1) inset,
      0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 20%) inset,
      1px 1px 1px rgba(255,255,255,0.2),
      -1px -1px 1px rgba(0,0,0,0.1);
  }
  
  .btn:hover::after, .btn:focus::after {
    opacity: 0.6;
    -webkit-mask-image: linear-gradient(0deg, #fff, transparent);
    mask-image: linear-gradient(0deg, #fff, transparent);
    filter: brightness(100%);
  }

  /* Active state */
  .btn:active {
    border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 70%);
    background-color: hsla(var(--highlight-color-hue), 50%, 20%, 0.5);
  }
  .btn:active::before {
    box-shadow:
      0 -8px 12px -6px rgba(255,255,255,0.6) inset,
      0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 80%) inset;
  }
  .btn:active::after {
    opacity: 1;
    -webkit-mask-image: linear-gradient(0deg, #fff, transparent);
    mask-image: linear-gradient(0deg, #fff, transparent);
    filter: brightness(200%);
  }
  .btn:active .btn-letter {
    text-shadow: 0 0 1px hsla(var(--highlight-color-hue), 100%, 90%, 90%);
    animation: none;
  }

  /* Hover border */
  .btn:hover, .btn:focus {
    border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 40%);
  }

  /* Assign slight delay to letters for wave effect (supports up to 15 chars) */
  ${Array.from({ length: 15 }).map((_, i) => `
    .btn-letter:nth-child(${i + 1}),
    .btn:hover .btn-letter:nth-child(${i + 1}),
    .btn:focus .btn-letter:nth-child(${i + 1}) {
      animation-delay: ${i * 0.04}s;
    }
  `).join('')}
`;

export default GlowingButton;
