import { ContentBlockSkeleton, PhotoHeroSkeleton } from '@/components/shared/PageSkeleton';

export default function Loading() {
  return (
    <main>
      <PhotoHeroSkeleton />
      <ContentBlockSkeleton />
    </main>
  );
}
