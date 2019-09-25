import { css } from "lit-element";

export default css`
  .opened {
    display: flex;
  }
  .closed {
    display: none;
  }
  .dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    padding: 0.5em;
  }

  .overlay {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
  }

  chameleon-card {
    flex-direction: column;
    border-top: solid var(--color-secondary) 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-shadow: 0 5px 12px 0 rgba(44, 111, 183, 0.2),
      0 2px 6px -1px rgba(44, 111, 183, 0.12),
      0 1px 4px 0 rgba(44, 111, 183, 0.14);
    margin: auto;
    background-color: #ffffff;
    width: 300px;
    height: 360px;
    padding: 48px;
    animation-name: dialogopen;
    animation-duration: 1s;
  }

  .actions {
    width: 100%;
  }
  chameleon-button {
    margin-bottom: 0.5em;
    width: 100%;
  }

  svg {
    width: 100%;
    height: 100%;
    color: var(--color-gray-darkest);
  }

  :slotted(*) {
    color: var(--color-gray-darkest);
    height: 1.125em;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
  }

  ::slotted([slot="default-icon"]) {
    color: var(--color-secondary-dark);
    height: 2.625em;
  }

  ::slotted([slot="title"]) {
    color: var(--color-primary);
    font-size: 2em;
    font-weight: 300;
    line-height: 2.25em;
    letter-spacing: 0.016em;
  }

  ::slotted([slot="actions"]) {
    margin-top: 1.5em;
  }
  ::slotted([slot="actions"]) *:not(:last-of-type) {
    margin-bottom: 1.5em;
  }

  :host([slot="actions"]) {
    background-color: green;
  }

  @keyframes dialogopen {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
