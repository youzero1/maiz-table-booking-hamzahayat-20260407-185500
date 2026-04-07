'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './signin.module.css';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaUtensils } from 'react-icons/fa';

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleParam = searchParams.get('role') ?? 'consumer';
  const callbackUrl = searchParams.get('callbackUrl') ?? (roleParam === 'restaurant' ? '/restaurant' : '/consumer');

  const [role, setRole] = useState<'consumer' | 'restaurant'>(roleParam === 'restaurant' ? 'restaurant' : 'consumer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false,
      });
      if (result?.error) {
        setError('Invalid email or password. Try password123');
      } else {
        router.push(role === 'restaurant' ? '/restaurant' : '/consumer');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.brandLogo}>
            <FaUtensils style={{ fontSize: '32px', color: 'var(--primary)' }} />
            <span className={styles.brandName}>MAIZ</span>
          </div>
          <h2 className={styles.tagline}>Your table is waiting</h2>
          <p className={styles.taglineDesc}>
            Discover extraordinary dining experiences and reserve your perfect table in seconds.
          </p>
          <div className={styles.featureList}>
            <div className={styles.feature}>✓ Instant confirmation</div>
            <div className={styles.feature}>✓ 500+ restaurants</div>
            <div className={styles.feature}>✓ Allergy management</div>
            <div className={styles.feature}>✓ Real-time availability</div>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.roleTabs}>
            <button
              className={`${styles.roleTab} ${role === 'consumer' ? styles.roleTabActive : ''}`}
              onClick={() => setRole('consumer')}
            >
              Diner
            </button>
            <button
              className={`${styles.roleTab} ${role === 'restaurant' ? styles.roleTabActive : ''}`}
              onClick={() => setRole('restaurant')}
            >
              Restaurant
            </button>
          </div>

          <h1 className={styles.formTitle}>
            {role === 'consumer' ? 'Welcome back, Foodie!' : 'Restaurant Login'}
          </h1>
          <p className={styles.formSubtitle}>
            {role === 'consumer' ? 'Sign in to manage your reservations' : 'Access your restaurant dashboard'}
          </p>

          <div className={styles.socialButtons}>
            <button className={styles.googleBtn} onClick={() => handleSocialLogin('google')}>
              <FaGoogle style={{ color: '#db4437' }} />
              Continue with Google
            </button>
            <button className={styles.facebookBtn} onClick={() => handleSocialLogin('facebook')}>
              <FaFacebook style={{ color: '#4267B2' }} />
              Continue with Facebook
            </button>
          </div>

          <div className={styles.divider}>
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleCredentialsLogin}>
            {error && <div className={styles.errorMsg}>{error}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className={styles.hintText}>
              Demo: use any email with password <strong>password123</strong>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.signupLink}>
            Don&apos;t have an account?{' '}
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up free</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
