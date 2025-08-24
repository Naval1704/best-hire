export const filterCandidates = (
    candidates,
    { locationFilter, availabilityFilter, skillFilter, experienceSearch }
) => {
    let filtered = candidates;

    if (locationFilter.length > 0) {
        filtered = filtered.filter((c) =>
            locationFilter.includes(c.location?.toLowerCase())
        );
    }

    if (availabilityFilter.length > 0) {
        filtered = filtered.filter((c) =>
            c.work_availability?.some((a) =>
                availabilityFilter.includes(a.toLowerCase())
            )
        );
    }

    if (skillFilter.length > 0) {
        filtered = filtered.filter((c) =>
            skillFilter.every((sf) =>
                c.skills?.some((s) =>
                    s.toLowerCase().includes(sf.toLowerCase())
                )
            )
        );
    }

    if (experienceSearch) {
        filtered = filtered.filter((c) =>
            c.work_experiences?.some((exp) =>
                exp.roleName?.toLowerCase().includes(experienceSearch.toLowerCase())
            )
        );
    }

    return filtered;
};
