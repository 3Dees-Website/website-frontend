import { useEffect, useRef } from 'react';
import { useToast } from '../hooks/useToast';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './styles/Toast.css';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styleMap = {
    success: {
      borderClass: 'toast--success',
      icon: <CheckCircle size={20} className="toast-icon toast-icon--success" />,
    },
    error: {
      borderClass: 'toast--error',
      icon: <AlertCircle size={20} className="toast-icon toast-icon--error" />,
    },
    info: {
      borderClass: 'toast--info',
      icon: <Info size={20} className="toast-icon toast-icon--info" />,
    },
  };

  const current = styleMap[toast.type] || styleMap.info;

  return (
    <div
      className={`toast-item ${current.borderClass}`}
      id={`toast-${toast.id}`}
    >
      <div className="toast-icon-wrap">{current.icon}</div>
      <div className="toast-body">
        <h4 className="toast-title">{toast.title}</h4>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="toast-close"
        id={`btn-close-toast-${toast.id}`}
        aria-label="Close"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <div className="toast-progress" />
    </div>
  );
}