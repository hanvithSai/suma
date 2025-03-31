export default function HowItWorksSection() {
  return (
    <div id="how-it-works" className="bg-background overflow-hidden responsive-section">
      <div className="relative responsive-container">
        <svg
          className="absolute top-0 left-full transform -translate-x-1/2 -translate-y-3/4 lg:left-auto lg:right-full lg:translate-x-2/3 lg:translate-y-1/4"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="8b1b5f72-e944-4457-af67-0c6d15a99f38"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" className="text-muted" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#8b1b5f72-e944-4457-af67-0c6d15a99f38)" />
        </svg>

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">How SUMA Works</h2>
          </div>
          <dl className="mt-10 responsive-grid-2 gap-y-10 lg:mt-0 lg:col-span-2">
            <div>
              <dt>
                <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <p className="mt-5 text-lg leading-6 font-medium text-foreground">Create a Room</p>
              </dt>
              <dd className="mt-2 text-base text-muted-foreground">
                Hosts can easily create interactive rooms for their sessions, customizing settings to fit their needs.
              </dd>
            </div>
            <div>
              <dt>
                <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                </div>
                <p className="mt-5 text-lg leading-6 font-medium text-foreground">Invite Participants</p>
              </dt>
              <dd className="mt-2 text-base text-muted-foreground">
                Share a unique room link or code with participants to join the interactive session.
              </dd>
            </div>
            <div>
              <dt>
                <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="mt-5 text-lg leading-6 font-medium text-foreground">Engage in Real-time</p>
              </dt>
              <dd className="mt-2 text-base text-muted-foreground">
                Hosts can create polls, ask questions, and manage discussions while participants interact and respond in
                real-time.
              </dd>
            </div>
            <div>
              <dt>
                <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="mt-5 text-lg leading-6 font-medium text-foreground">Analyze Results</p>
              </dt>
              <dd className="mt-2 text-base text-muted-foreground">
                After the session, hosts can review engagement metrics and poll results to gain valuable insights.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

