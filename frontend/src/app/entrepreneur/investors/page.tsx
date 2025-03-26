"use client";
import React, { useState, useEffect, useCallback } from 'react';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import InvestorCard from '@/components/investors/InvestorCard';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { API_ROUTES } from '@/config/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

/**
 * Portfolio size options for filtering
 */
const PORTFOLIO_SIZE_OPTIONS = [
  'All',
  'Under $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M - $10M',
  'Over $10M'
];

/**
 * Investor interface
 */
interface Investor {
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
}

/**
 * InvestorsPage Component
 * Allows entrepreneurs to discover and browse potential investors
 */
const InvestorsPage: React.FC = () => {
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [portfolioFilter, setPortfolioFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  /**
   * Debounce search input to reduce API calls
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Fetch investors from API
   */
  const fetchInvestors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing. Please sign in again.');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(portfolioFilter !== 'All' && { portfolioSize: portfolioFilter })
      });

      const response = await fetch(`${API_ROUTES.INVESTOR_PROFILE.GET_ALL}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Error ${response.status}: Failed to fetch investors`);
      }

      const data = await response.json();
      
      setInvestors(data.data?.investors || []);
      setTotalPages(data.data?.pagination?.pages || 1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch investors';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, portfolioFilter]);

  /**
   * Fetch investors when search, filter, or page changes
   */
  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  /**
   * Handle search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  /**
   * Handle portfolio filter change
   */
  const handlePortfolioFilterChange = (value: string) => {
    setPortfolioFilter(value);
    setPage(1); // Reset to first page on new filter
  };

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8">
        <Card className="bg-white shadow-lg dark:bg-gray-800">
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investors</h1>
              <p className="text-gray-600 dark:text-gray-300">Browse potential investors for your startup</p>
            </div>

            <Separator className="my-6 dark:bg-gray-700" />

            {/* Search and Filter Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search investors..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 w-full bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Search investors"
                />
              </div>

              <Select 
                value={portfolioFilter} 
                onValueChange={handlePortfolioFilterChange}
              >
                <SelectTrigger 
                  className="w-full bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  aria-label="Filter by portfolio size"
                >
                  <SelectValue placeholder="Filter by portfolio size" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectGroup>
                    {PORTFOLIO_SIZE_OPTIONS.map((option) => (
                      <SelectItem 
                        key={option} 
                        value={option}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Error State */}
            {error && (
              <div 
                className="mt-8 p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/30 dark:border-red-800 text-red-800 dark:text-red-200"
                role="alert"
              >
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="font-medium">Error loading investors</span>
                </div>
                <p className="text-sm">{error}</p>
                <Button 
                  onClick={fetchInvestors}
                  className="mt-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-700"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center my-8" aria-live="polite" aria-busy="true">
                <div 
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" 
                  role="status"
                />
                <span className="sr-only">Loading investors...</span>
              </div>
            )}

            {/* Investors Grid */}
            {!loading && !error && (
              <div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                aria-live="polite"
              >
                {investors.length > 0 ? (
                  investors.map((investor) => (
                    <InvestorCard key={investor._id} investor={investor} />
                  ))
                ) : (
                  <div 
                    className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
                    aria-live="assertive"
                  >
                    <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                    <p className="font-medium">No investors found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && !error && investors.length > 0 && (
              <div className="flex justify-center gap-2 mt-8" role="navigation" aria-label="Pagination">
                <Button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  aria-label="Go to previous page"
                >
                  Previous
                </Button>
                <div className="flex items-center px-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </span>
                </div>
                <Button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  aria-label="Go to next page"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EntrepreneurSidebar>
  );
};

export default InvestorsPage;