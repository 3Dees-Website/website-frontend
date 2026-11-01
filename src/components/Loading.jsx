import { motion, useReducedMotion } from 'motion/react';
import {
  useLoadingGate,
  LOADING_DELAY,
  LOADING_MIN_DURATION,
} from '../hooks/useLoadingGate';
import './styles/Loading.css';

export function Loading({
  isLoading,
  size = 'lg',
  color = 'var(--color-brand-primary)',
  label = 'Loading…',
  showLabel = false,
  reserveSpace = false,
  delay = LOADING_DELAY,
  minDuration = LOADING_MIN_DURATION,
  className = '',
}) {
  const { visible } = useLoadingGate(isLoading, { delay, minDuration });
  const reduceMotion = useReducedMotion();

  if (!visible && !reserveSpace) return null;

  return (
    <span
      className={`loading loading-${size} ${className}`.trim()}
      style={{ color }}
      role={visible ? 'status' : undefined}
    >
      {visible && (
        <>
          <motion.span
            className="loading-circle"
            aria-hidden="true"
            initial={{ scale: reduceMotion ? 1 : 0.75, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          {showLabel ? (
            <span className="loading-label">{label}</span>
          ) : (
            <span className="loading-sr-only">{label}</span>
          )}
        </>
      )}
    </span>
  );
}
