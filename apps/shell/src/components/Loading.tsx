interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const Loading = ({ size = 'medium', message = 'Carregando...' }: LoadingProps) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div 
      data-testid="loading"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '1rem'
      }}
    >
      <div
        style={{
          width: sizes[size],
          height: sizes[size],
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
        {message}
      </p>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
