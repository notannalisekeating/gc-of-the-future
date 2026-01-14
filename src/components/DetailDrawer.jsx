import React, { useState, useEffect } from 'react';

const TimelineStep = ({ step, isLast }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-4">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            step.completed
              ? 'bg-green-500 text-white'
              : step.inProgress
              ? 'bg-blue-500 text-white'
              : 'bg-slate-200 text-slate-400'
          }`}
        >
          {step.completed && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-12 ${
              step.completed ? 'bg-green-500' : 'bg-slate-200'
            }`}
          />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="font-medium text-slate-900">{step.label}</div>
        {step.days && (
          <div className="text-sm text-slate-500">{step.days} days</div>
        )}
        {step.inProgress && (
          <div className="text-sm text-blue-600 font-medium">In Progress</div>
        )}
      </div>
    </div>
  );
};

const IntegrationButton = ({ name }) => {
  return (
    <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]">
      <div className="w-8 h-8 mb-2 bg-slate-100 rounded flex items-center justify-center">
        <span className="text-xs font-semibold text-slate-600">
          {name.charAt(0)}
        </span>
      </div>
      <span className="text-xs text-slate-600">{name}</span>
    </button>
  );
};

const DetailDrawer = ({ contract, isOpen, onClose }) => {
  const [notes, setNotes] = useState(contract?.notes || '');

  // Update notes when contract changes
  useEffect(() => {
    if (contract) {
      setNotes(contract.notes || '');
    }
  }, [contract]);

  if (!isOpen || !contract) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-1/3 bg-white shadow-2xl z-50 border-l border-slate-200 overflow-y-auto transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 pr-2">{contract.name}</h2>
          <button
            onClick={onClose}
            className="p-3 md:p-2 hover:bg-slate-100 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Timeline Section */}
          <section>
            <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-4">Timeline</h3>
            <div>
              {contract.timeline.steps.map((step, index) => (
                <TimelineStep
                  key={index}
                  step={step}
                  isLast={index === contract.timeline.steps.length - 1}
                />
              ))}
            </div>
          </section>

          {/* Integrations Section */}
          <section>
            <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-4">Integrations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {contract.integrations.map((integration, index) => (
                <IntegrationButton key={index} name={integration} />
              ))}
            </div>
          </section>

          {/* Internal Notes Section */}
          <section>
            <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-4">Internal Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Add notes..."
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button className="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors min-h-[44px] font-medium">
                Save Addendum
              </button>
              <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors min-h-[44px] font-medium">
                Notify GC
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default DetailDrawer;
