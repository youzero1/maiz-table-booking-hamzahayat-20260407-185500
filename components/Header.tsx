'use client';

import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import styles from './Header.module.css';
import { FaUtensils, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

interface HeaderProps {
  role: 'consumer' | 'restaurant';
}

export default function Header({ role }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={role === 'restaurant' ? '/restaurant' : '/consumer'} className={styles.logo}>
          <FaUtensils className={styles.logoIcon} />
          <span className={styles.logoText}>MAIZ</span>
        </Link>

        <nav className={styles.nav}>
          {role === 'consumer' && (
            <Link href="/consumer" className={styles.navLink}>Restaurants</Link>
          )}
          {role === 'restaurant' && (
            <Link href="/restaurant" className={styles.navLink}>Dashboard</Link>
          )}
        </nav>

        <div className={styles.actions}>
          {session ? (
            <div className={styles.userArea}>
              <FaUser className={styles.userIcon} />
              <span className={styles.userName}>{session.user?.name ?? session.user?.email}</span>
              <button
                className={styles.signOutBtn}
                onClick={() => signOut({ callbackUrl: '/consumer' })}
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className={styles.signInBtn}
              onClick={() => signIn()}
            >
              <FaSignInAlt />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
