const CarSkeleton = () => {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
        {/* Image */}
        <div className="h-48 bg-slate-200" />
  
        {/* Content */}
        <div className="p-5">
          <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
          <div className="h-5 bg-slate-200 rounded w-2/3 mb-4" />
  
          {/* Specs */}
          <div className="flex gap-3 mb-4">
            <div className="h-3 bg-slate-200 rounded w-16" />
            <div className="h-3 bg-slate-200 rounded w-16" />
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
  
          {/* Features */}
          <div className="flex gap-2 mb-4">
            <div className="h-5 bg-slate-200 rounded w-20" />
            <div className="h-5 bg-slate-200 rounded w-20" />
            <div className="h-5 bg-slate-200 rounded w-20" />
          </div>
  
          {/* Price & Button */}
          <div className="flex justify-between items-center">
            <div className="h-8 bg-slate-200 rounded w-20" />
            <div className="h-9 bg-slate-200 rounded w-28" />
          </div>
        </div>
      </div>
    );
  };
  
  export default CarSkeleton;