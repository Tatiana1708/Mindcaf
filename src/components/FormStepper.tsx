import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const FormStepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-1 w-full ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
                style={{ width: '100px' }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <div className="text-sm font-medium text-gray-700">Informations Personnelles</div>
        <div className="text-sm font-medium text-gray-700">Documents Requis</div>
      </div>
    </div>
  );
};

export default FormStepper;