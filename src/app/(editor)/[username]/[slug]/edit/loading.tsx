import Loader from '@/components/ui/Loader';

function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center justify-center gap-3">
        <Loader size="xl" />
        <span className="text-muted-foreground text-sm">
          Loading post for edit…
        </span>
      </div>
    </div>
  );
}

export default Loading;
