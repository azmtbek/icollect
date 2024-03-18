import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Admin = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-scrn'>
      <Link href="/admin/topic" >
        <Button>
          Manage Topics
        </Button>
      </Link>
    </div>
  );
};

export default Admin;