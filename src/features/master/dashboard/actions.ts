"use server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function getMasterDashboardStats() {
  const supabase = await getSupabaseServerClient();

  // Get counts
  const [countriesResult, statesResult, citiesResult, profilesResult] = await Promise.all([
    supabase.from("countries").select("id", { count: "exact", head: true }),
    supabase.from("states").select("id", { count: "exact", head: true }),
    supabase.from("cities").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id, state_id, city_id", { count: "exact" }).is("deleted_at", null),
  ]);

  const totalCountries = countriesResult.count || 0;
  const totalStates = statesResult.count || 0;
  const totalCities = citiesResult.count || 0;
  
  // Calculate users with location
  const profiles = profilesResult.data || [];
  const usersWithLocation = profiles.filter(p => p.state_id || p.city_id).length;

  // Get top states by user count
  const stateUserCounts: Record<number, number> = {};
  profiles.forEach(p => {
    if (p.state_id) {
      stateUserCounts[p.state_id] = (stateUserCounts[p.state_id] || 0) + 1;
    }
  });

  const topStateIds = Object.entries(stateUserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => parseInt(id));

  // Get state names
  let topStates: { name: string; count: number }[] = [];
  if (topStateIds.length > 0) {
    const { data: stateNames } = await supabase
      .from("states")
      .select("id, name")
      .in("id", topStateIds);

    topStates = topStateIds.map(id => {
      const state = stateNames?.find(s => s.id === id);
      return {
        name: state?.name || "Unknown",
        count: stateUserCounts[id],
      };
    });
  }

  // Get top cities by user count
  const cityUserCounts: Record<number, number> = {};
  profiles.forEach(p => {
    if (p.city_id) {
      cityUserCounts[p.city_id] = (cityUserCounts[p.city_id] || 0) + 1;
    }
  });

  const topCityIds = Object.entries(cityUserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => parseInt(id));

  // Get city names
  let topCities: { name: string; count: number }[] = [];
  if (topCityIds.length > 0) {
    const { data: cityNames } = await supabase
      .from("cities")
      .select("id, name")
      .in("id", topCityIds);

    topCities = topCityIds.map(id => {
      const city = cityNames?.find(c => c.id === id);
      return {
        name: city?.name || "Unknown",
        count: cityUserCounts[id],
      };
    });
  }

  return {
    kpi: {
      totalCountries,
      totalStates,
      totalCities,
      usersWithLocation,
    },
    charts: {
      topStates,
      topCities,
    },
  };
}
