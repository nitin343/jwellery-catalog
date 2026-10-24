'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function AdminRoute() {
  const router = useRouter();
  const { setIsAdminAuthOpen } = useStore();

  useEffect(() => {
    setIsAdminAuthOpen(true);
    router.replace('/');
  }, [router, setIsAdminAuthOpen]);

  return null;
}
