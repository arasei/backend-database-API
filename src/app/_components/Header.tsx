'use client';

import classes from '@/app/_styles/Header.module.css';
import Link from 'next/link';


export const Header: React.FC = () => {
  return (
    <header className={classes.header}>
      <ul className={classes.ul}>
        <li className={classes.li}>
          <Link href="/">
            Blog
          </Link>
        </li>
        <li className={classes.li}>
          <Link href="/contact">
            お問い合わせ
          </Link>
        </li>
      </ul>
    </header>
  );
};