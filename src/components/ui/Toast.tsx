import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          color: '#171717',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#6172f3',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}

export { default as toast } from 'react-hot-toast';
