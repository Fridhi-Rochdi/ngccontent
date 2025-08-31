import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className = ''
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Génère les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si on a 5 pages ou moins, on les affiche toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (currentPage <= 3) {
        // Début de la pagination
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin de la pagination
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Milieu de la pagination
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`pagination-container ${className}`}>
      {/* Bouton Précédent */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        className="pagination-btn pagination-prev"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Précédent</span>
      </Button>

      {/* Numéros de pages */}
      {showPageNumbers && (
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`pagination-number ${isActive ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}

      {/* Bouton Suivant */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!canGoNext}
        className="pagination-btn pagination-next"
      >
        <span className="hidden sm:inline mr-2">Suivant</span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Informations de pagination */}
      <div className="pagination-info">
        <span className="pagination-info-text">
          Page {currentPage} sur {totalPages}
        </span>
      </div>
    </div>
  );
}

// Hook utilitaire pour la pagination
export function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const resetPagination = () => {
    setCurrentPage(1);
  };
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    resetPagination,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}
