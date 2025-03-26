"use client";
import React, { useState, useEffect, useCallback } from 'react';
import InvestorSidebar from '@/app/sidebar/investor/page';
import { API_ROUTES } from '@/config/api';
import { Startup, StartupResponse } from '@/types/startup';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlassIcon, ReloadIcon, ExclamationTriangleIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import StartupCard from '@/components/startups/StartupCard';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';
import { SkeletonCard } from '@/components/ui/skeleton';

const INDUSTRY_OPTIONS = [
  'All',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'Manufacturing',
  'Other'
];

const STARTUPS_PER_PAGE = 9;

/**
 * InvestorStartupsPage Component
 * 
 * Displays a searchable, filterable list of startups for investors to browse and discover
 * investment opportunities.
 */
const InvestorStartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStartups, setTotalStartups] = useState(0);
  
  const router = useRouter();
  
  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  /**
   * Fetch startups from the API with current filters and pagination
   */
  const fetchStartups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check for authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to view startups');
        router.push('/auth/signin');
        return;
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: STARTUPS_PER_PAGE.toString(),
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(industryFilter !== 'All' && { industry: industryFilter })
      });

      const response = await fetch(`${API_ROUTES.INVESTOR.STARTUPS.GET_ALL}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please sign in again.');
        router.push('/auth/signin');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }

      const data: StartupResponse = await response.json();
      setStartups(data.startups);
      setTotalPages(data.pagination.pages);
      setTotalStartups(data.pagination.total);
    } catch (error) {
      console.error('Error fetching startups:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch startups';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearchQuery, industryFilter, router]);

  // Fetch startups when dependencies change
  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  /**
   * Handle search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  /**
   * Handle industry filter change
   */
  const handleIndustryChange = (value: string) => {
    setIndustryFilter(value);
    setPage(1); // Reset to first page on filter change
  };

  /**
   * Navigate to previous page
   */
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Navigate to next page
   */
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Jump to a specific page
   */
  const goToPage = (pageNumber: number) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Calculate page numbers to show in pagination
   */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first, last, and pages around current page
      if (page <= 3) {
        // Show first 4 pages + last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null); // Ellipsis
        pageNumbers.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Show first page + last 4 pages
        pageNumbers.push(1);
        pageNumbers.push(null); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show first page + middle 3 pages + last page
        pageNumbers.push(1);
        pageNumbers.push(null); // Ellipsis
        for (let i = page - 1; i <= page + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null); // Ellipsis
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <InvestorSidebar>
      <div className="container mx-auto p-4 md:p-8">
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Explore Startups</h1>
              <p className="text-gray-600">
                Discover promising startup opportunities for investment
              </p>
            </div>

            <Separator className="my-6" />

            {/* Search and Filter Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search by name, industry, or keywords..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 w-full bg-white border-gray-200"
                  aria-label="Search startups"
                />
              </div>

              <Select 
                value={industryFilter} 
                onValueChange={handleIndustryChange}
                aria-label="Filter by industry"
              >
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <SelectItem 
                        key={option} 
                        value={option}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            {!loading && !error && (
              <div className="mt-4 text-sm text-gray-600">
                {totalStartups > 0 ? (
                  <>
                    Showing {startups.length} of {totalStartups} startups
                    {debouncedSearchQuery && ` matching "${debouncedSearchQuery}"`}
                    {industryFilter !== 'All' && ` in ${industryFilter}`}
                  </>
                ) : (
                  <span>No startups found</span>
                )}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mt-6">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchStartups}
                    className="mt-2 ml-auto"
                  >
                    <ReloadIcon className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            )}

            {/* Startups Grid */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {startups.length > 0 ? (
                  startups.map((startup) => (
                    <StartupCard key={startup._id} startup={startup} />
                  ))
                ) : (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No startups found</h3>
                    <p className="max-w-md text-gray-500 mb-4">
                      {debouncedSearchQuery || industryFilter !== 'All' ? (
                        <>
                          We couldn't find any startups matching your current filters. 
                          Try adjusting your search criteria.
                        </>
                      ) : (
                        <>
                          There are no startups available at the moment. 
                          Please check back later for new opportunities.
                        </>
                      )}
                    </p>
                    {(debouncedSearchQuery || industryFilter !== 'All') && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setIndustryFilter('All');
                        }}
                        className="bg-white"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <div className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="px-2"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {getPageNumbers().map((pageNum, index) => (
                      pageNum === null ? (
                        <span 
                          key={`ellipsis-${index}`} 
                          className="w-8 h-8 flex items-center justify-center text-gray-400"
                        >
                          …
                        </span>
                      ) : (
                        <Button
                          key={`page-${pageNum}`}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum as number)}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={page === pageNum ? "page" : undefined}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      )
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className="px-2"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InvestorSidebar>
  );
};

export default InvestorStartupsPage;