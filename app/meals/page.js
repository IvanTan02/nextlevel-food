import Link from 'next/link';
import styles from './page.module.css';
import MealsGrid from '@/components/meals/meals-grid';
import { getMeals } from '@/lib/meals';
import { Suspense } from 'react';

export const metadata = {
  title: 'All Meals',
  description: 'Browse delicious meals shared by our community.',
};

async function Meals() {
  const meals = await getMeals();
  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {

  return (
    <>
      <header className={styles.header}>
        <h1>Delicious Meals, Create {' '}
          <span className={styles.highlight}>By You</span>
        </h1>
        <p>Choose your favourite recipe and start cooking!</p>
        <p className={styles.cta}>
          <Link href="/meals/share">Share Your Favourite Recipe</Link>
        </p>
      </header>
      <main className={styles.main}>
        <Suspense fallback={<p className={styles.loading}>Loading Meals...</p>}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}