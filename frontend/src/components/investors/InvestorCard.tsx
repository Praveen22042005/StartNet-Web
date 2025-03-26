import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

interface InvestorCardProps {
  investor?: {
    _id: string;
    fullName: string;
    location: string;
    profilePicture: string;
    bio: string;
    portfolioSize: string;
    investmentRange: {
      min: number;
      max: number;
    };
    skills: Array<{ name: string }>;
  };
}

const InvestorCard = ({ investor }: InvestorCardProps) => {
  const router = useRouter();
  
  if (!investor) {
    return null;
  }

  const handleViewDetails = () => {
    router.push(`/entrepreneur/investors/${investor._id}`);
  };

  return (
    <Card className="overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={investor.profilePicture || '/default-profile.png'}
              alt={investor.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {investor.fullName}
            </h3>
            <p className="text-sm text-gray-500">{investor.location}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {investor.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">{investor.bio}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-600">Portfolio: {investor.portfolioSize}</span>
          <span className="text-gray-600">
            ${investor.investmentRange.min.toLocaleString()} - ${investor.investmentRange.max.toLocaleString()}
          </span>
        </div>
        
        {/* View Details Button */}
        <Button
          onClick={handleViewDetails}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 flex items-center justify-center"
          variant="default"
        >
          <ExternalLinkIcon className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default InvestorCard;