"use client";

export default function StatsOverview({ problems, patterns }) {
  const totalProblems = problems?.length || 0;
  const totalPatterns = patterns?.length || 0;

  const solvedProblems = problems?.filter((p) => p.lastSolvedDate).length || 0;

  const today = new Date().toISOString().split("T")[0];
  const dueToday = problems?.filter((p) => p.nextReviewDate && p.nextReviewDate <= today).length || 0;

  const totalReviews = problems?.reduce((sum, p) => sum + p.successfulReviews, 0) || 0;

  const overdue = problems?.filter((p) => p.nextReviewDate && p.nextReviewDate < today).length || 0;

  const stats = [
    {
      label: "Total Problems",
      value: totalProblems,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Patterns",
      value: totalPatterns,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Solved",
      value: solvedProblems,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Due Today",
      value: dueToday,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-orange-500 to-red-500",
      highlight: dueToday > 0,
    },
    {
      label: "Total Reviews",
      value: totalReviews,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-pink-500 to-rose-500",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "from-red-500 to-rose-500",
      highlight: overdue > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 transition-all hover:scale-105 hover:border-zinc-700 ${
            stat.highlight ? "animate-pulse" : ""
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}></div>

          <div className="relative">
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-3`}>
              <div className="text-white">{stat.icon}</div>
            </div>

            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-400">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}