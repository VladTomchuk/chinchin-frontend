'use client';

import { useState } from 'react';
import styles from './HamburgerIcon.module.css'; // CSS винесемо сюди

export default function HamburgerIcon() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.navIcon3} ${open ? styles.open : ''}`} onClick={() => setOpen(!open)}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
