import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  compact?: boolean;
}

export default function StarRating({ rating, compact = false }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`${styles.stars} ${compact ? styles.compact : ''}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </div>
  );
}
