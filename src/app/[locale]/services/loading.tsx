import { CardsGridSkeleton, HeaderSkeleton } from '@/components/shared/PageSkeleton';

export default function Loading() {
  return (
    <main>
      <HeaderSkeleton />
      <CardsGridSkeleton />
    </main>
  );
}
