'use client';

export default function LoadingSpinner({ size = 'medium', fullPage = false, text = 'Loading...' }) {
  // Determine spinner size
  const spinnerSize = size === 'small' 
    ? 'h-5 w-5' 
    : size === 'large' 
      ? 'h-16 w-16' 
      : 'h-10 w-10';
  
  const borderSize = size === 'small' 
    ? 'border-2' 
    : size === 'large' 
      ? 'border-4' 
      : 'border-3';
  
  // Full page spinner
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
        <div className={`${spinnerSize} ${borderSize} border-t-primary-blue border-r-primary-blue border-b-primary-blue border-l-transparent rounded-full animate-spin`}></div>
        {text && <p className="mt-4 text-gray-700">{text}</p>}
      </div>
    );
  }
  
  // Inline spinner
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`${spinnerSize} ${borderSize} border-t-primary-blue border-r-primary-blue border-b-primary-blue border-l-transparent rounded-full animate-spin`}></div>
      {text && <p className="mt-2 text-gray-700 text-sm">{text}</p>}
    </div>
  );
}
