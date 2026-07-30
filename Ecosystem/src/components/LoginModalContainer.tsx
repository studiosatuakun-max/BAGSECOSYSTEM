'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoginModal from './LoginModal';

export default function LoginModalContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const isOpen = searchParams.get('login_modal') === 'true';
  const destinationUrl = searchParams.get('destination') || undefined;
  
  const handleClose = () => {
    // Remove login params from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('login_modal');
    params.delete('destination');
    
    // Construct the new URL string. If empty, just root /
    const newSearch = params.toString();
    router.replace(newSearch ? `/?${newSearch}` : '/', { scroll: false });
  };

  return <LoginModal isOpen={isOpen} onClose={handleClose} destinationUrl={destinationUrl} />;
}
