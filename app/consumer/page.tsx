'use client';

import { useState } from 'react';
import { restaurants } from '@/lib/data';
import Header from '@/components/Header';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import styles from './consumer.module.css';

export default function ConsumerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [partySize, setPartySize] = useState(2);

  const cuisines = ['All', ...Array.from(new Set(restaurants.map((r) => r.cuisine)))];

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || r.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className={styles.page}>
      <Header role="consumer" />
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Reserve Your Perfect Table</h1>
          <p className={styles.heroSubtitle}>
            Discover the best restaurants and book your dining experience instantly
          </p>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            partySize={partySize}
            setPartySize={setPartySize}
          />
        </div>
      </div>

      <div className="container">
        <div className={styles.filtersRow}>
          <h2 className={styles.sectionTitle}>
            {filtered.length} Restaurant{filtered.length !== 1 ? 's' : ''} Available
          </h2>
          <div className={styles.cuisineFilters}>
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                className={`${styles.cuisineBtn} ${selectedCuisine === cuisine ? styles.cuisineBtnActive : ''}`}
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              selectedDate={selectedDate}
              partySize={partySize}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <p>No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
