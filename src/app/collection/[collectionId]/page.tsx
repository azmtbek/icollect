'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Collection = () => {
  const { collectionId } = useParams();
  return (
    <MinScreen>
      <div>
        <Link href={`/collection/${collectionId}/item/create`} > <Button>Add Item</Button></Link>
      </div>
      <div>items</div>
    </MinScreen >
  );
};

export default Collection;;