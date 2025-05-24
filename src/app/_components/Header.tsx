'use client';

import classes from '@/app/_components/Header.module.css';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <Link href="/" className='header-link'>
        Blog
      </Link>
      <Link href="/contact" className='header-link'>
        お問い合わせ
      </Link>
    </header>
  );
};