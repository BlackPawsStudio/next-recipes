import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './styles.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className={styles['header']}>
        <Link href={'/'}>
          <h1>Next-recipes</h1>
        </Link>
      </header>
      <main className={styles['main']}>{children}</main>
    </>
  );
};
export default Layout;
