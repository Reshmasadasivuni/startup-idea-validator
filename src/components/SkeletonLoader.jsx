function SkeletonBlock({ className }) {
  return (
    <div className={`animate-skeleton bg-white/[0.06] rounded-lg ${className}`} />
  )
}

export default function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Verdict */}
      <div className="glass rounded-xl p-5">
        <SkeletonBlock className="h-3 w-20 mb-3" />
        <SkeletonBlock className="h-5 w-3/4 mb-2" />
        <SkeletonBlock className="h-5 w-1/2" />
      </div>

      {/* Score + summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="w-[90px] h-[90px] rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-6 w-20" />
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-5 space-y-2">
          <SkeletonBlock className="h-3 w-16 mb-3" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>
      </div>

      {/* Target users */}
      <div className="glass rounded-xl p-5">
        <SkeletonBlock className="h-3 w-24 mb-3" />
        <div className="flex gap-2">
          {[80, 100, 72].map(w => (
            <SkeletonBlock key={w} className={`h-6 rounded-full`} style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* 4 cards */}
      <div className="grid grid-cols-2 gap-4">
        {[0,1,2,3].map(i => (
          <div key={i} className="glass rounded-xl overflow-hidden">
            <SkeletonBlock className="h-9 rounded-none" />
            <div className="p-4 space-y-2.5">
              <SkeletonBlock className="h-3.5 w-full" />
              <SkeletonBlock className="h-3.5 w-5/6" />
              <SkeletonBlock className="h-3.5 w-4/5" />
              <SkeletonBlock className="h-3.5 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
