import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

interface CaseProgressTrackerProps {
  steps: Step[];
}

export function CaseProgressTracker({ steps }: CaseProgressTrackerProps) {
  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200" style={{ zIndex: 0 }}>
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ 
              width: `${(steps.filter(s => s.status === 'completed').length / (steps.length - 1)) * 100}%`,
              backgroundColor: '#2563eb'
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between" style={{ zIndex: 1 }}>
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 bg-white transition-all ${
                    isCompleted
                      ? 'border-primary bg-primary'
                      : isActive
                      ? 'border-primary bg-white'
                      : 'border-slate-200 bg-white'
                  }`}
                  style={{
                    borderColor: isCompleted || isActive ? '#2563eb' : '#e2e8f0',
                    backgroundColor: isCompleted ? '#2563eb' : '#ffffff',
                    borderRadius: '9999px'
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span 
                      className={isActive ? 'text-primary' : 'text-slate-400'}
                      style={{ 
                        fontWeight: 600,
                        color: isActive ? '#2563eb' : '#94a3b8'
                      }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={`mt-3 text-center max-w-[100px] ${
                    isCompleted || isActive ? 'text-slate-900' : 'text-slate-500'
                  }`}
                  style={{ 
                    fontSize: '12px',
                    fontWeight: isCompleted || isActive ? 600 : 400
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
