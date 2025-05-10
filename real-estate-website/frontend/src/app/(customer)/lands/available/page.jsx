"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../../../../components/Shared/LoadingSpinner";

export default function AvailableLandsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Build query parameters for the new portfolio page
    const params = new URLSearchParams();

    // Set the service type to lands
    params.append("service", "lands");

    // Copy over any existing search parameters
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const location = searchParams.get("location");
    const sortBy = searchParams.get("sortBy");

    if (page) params.append("page", page);
    if (search) params.append("search", search);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (size) params.append("size", size);
    if (location) params.append("location", location);
    if (sortBy) params.append("sortBy", sortBy);

    // Redirect to the new portfolio page
    const queryString = params.toString();
    const url = queryString ? `/portfolio?${queryString}` : "/portfolio";

    router.replace(url);
  }, [router, searchParams]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold mb-8">Redirecting to Portfolio...</h1>
      <LoadingSpinner text="Please wait while we redirect you to our new Portfolio page" />
    </div>
  );
}
