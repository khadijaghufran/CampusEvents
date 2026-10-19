const LIFECYCLE_STEPS = [
  {
    step: 1,
    title: 'Propose',
    actor: 'Society',
    description: 'Society creates event proposal, picks date & seminar hall.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    ),
  },
  {
    step: 2,
    title: 'Approve',
    actor: 'Admin',
    description: 'Admin checks venue conflicts and approves or returns with reason.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    step: 3,
    title: 'Publish',
    actor: 'System',
    description: 'Approved event is instantly published to campus calendar.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    ),
  },
  {
    step: 4,
    title: 'Register',
    actor: 'Student',
    description: 'Students book seats with automatic capacity enforcement.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    ),
  },
  {
    step: 5,
    title: 'Attendance',
    actor: 'Organizer',
    description: 'Organizers mark digital attendance live at the venue door.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    ),
  },
  {
    step: 6,
    title: 'Feedback',
    actor: 'Student',
    description: 'Attendees submit event rating and quality feedback.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    ),
  },
  {
    step: 7,
    title: 'Certificate',
    actor: 'System',
    description: 'Participation history and verified certificates generated.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
];

/**
 * Visual timeline showcasing the 7-stage lifecycle of university events.
 * Fully responsive: horizontal on desktop, vertical on mobile.
 */
export default function LifecycleSteps() {
  return (
    <div className="w-full">
      {/* Desktop Horizontal View (>= lg) */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-3 relative">
        {/* Background connecting bar */}
        <div
          className="absolute top-7 left-6 right-6 h-0.5 bg-gradient-to-r from-teal-500 via-teal-400 to-amber-500 -z-0 opacity-40"
          aria-hidden="true"
        />

        {LIFECYCLE_STEPS.map((step) => (
          <div
            key={step.step}
            className="relative z-10 flex flex-col items-center text-center p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all duration-200"
          >
            {/* Step Icon & Number Badge */}
            <div className="relative mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {step.icon}
                </svg>
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {step.step}
              </span>
            </div>

            {/* Stage title */}
            <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>

            {/* Actor badge */}
            <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700">
              {step.actor}
            </span>

            {/* Description */}
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet Sequential Vertical View (< lg) */}
      <div className="lg:hidden relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-300">
        {LIFECYCLE_STEPS.map((step) => (
          <div key={step.step} className="relative flex items-start gap-4">
            {/* Step Marker */}
            <div className="absolute -left-[30px] flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs shadow ring-4 ring-slate-50">
              {step.step}
            </div>

            {/* Step Content Card */}
            <div className="flex-1 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="text-teal-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {step.icon}
                    </svg>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-teal-50 text-teal-700">
                  {step.actor}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
