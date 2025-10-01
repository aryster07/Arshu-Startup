import React, { useState, useEffect } from 'react';
import LawyerDashboardPage from './LawyerDashboardPage';
import LawyerDashboardMobile from './LawyerDashboardMobile';

export default function LawyerDashboardResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if device is mobile
    const checkIsMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024); // lg breakpoint in Tailwind
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Return mobile version for mobile devices, desktop version for desktop
  return isMobile ? <LawyerDashboardMobile /> : <LawyerDashboardPage />;
}