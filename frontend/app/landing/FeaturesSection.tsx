export default function FeaturesSection() {
  return (
    <div id="features" className="py-12 bg-card">
      <div className="responsive-container">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need for interactive sessions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
            SUMA provides a comprehensive set of tools for hosts and participants to create engaging, interactive
            experiences.
          </p>
        </div>

        <div className="mt-10">
          <dl className="responsive-grid-2 gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">Real-time Interaction</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-muted-foreground">
                Engage with your audience in real-time through live polls, chat, and Q&A sessions.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">Multiple-Choice Questions</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-muted-foreground">
                Create and manage multiple-choice questions to gauge audience understanding and engagement.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">Dynamic Data Visualization</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-muted-foreground">
                Visualize poll results and engagement metrics in real-time with intuitive charts and graphs.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md gradient-bg text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">Responsive Design</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-muted-foreground">
                Access SUMA from any device with our responsive design, optimized for both desktop and mobile use.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

