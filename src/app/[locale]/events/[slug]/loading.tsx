import { ContentBlockSkeleton, HeaderSkeleton } from '@/components/shared/PageSkeleton';

export default function Loading() {
  return (
    <main>
      <HeaderSkeleton />
      <ContentBlockSkeleton />
    </main>
  );
}
