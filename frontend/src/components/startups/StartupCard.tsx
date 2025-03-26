import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Startup } from '@/types/startup';

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  return (
    <Card className="overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={startup.startupLogo || '/default-startup-logo.png'}
              alt={startup.startupName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {startup.startupName}
            </h3>
            <p className="text-sm text-gray-500">{startup.industry}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {startup.description}
        </p>

        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Funding Goal</span>
            <span className="font-medium text-gray-900">
              ${startup.fundingGoal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Raised So Far</span>
            <span className="font-medium text-green-600">
              ${startup.raisedSoFar.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((startup.raisedSoFar / startup.fundingGoal) * 100, 100)}%`
            }}
          />
        </div>

        {/* Team Size and Location */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Team: {startup.team.length} members</span>
          <span>{startup.address}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StartupCard;