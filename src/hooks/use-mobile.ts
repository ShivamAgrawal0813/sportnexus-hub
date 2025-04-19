import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if window exists (for SSR compatibility)
    if (typeof window === 'undefined') return;
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
    
    function checkIfMobile() {
      setIsMobile(window.innerWidth < 768); // 768px is the standard md breakpoint
    }
  }, []);
  
  return isMobile;
} 