package com.civictrack.repository;

import com.civictrack.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    @Query(value = "SELECT * FROM complaints WHERE ST_DWithin(ST_MakePoint(longitude, latitude)::geography, ST_MakePoint(:lon, :lat)::geography, 500) AND category = :category AND status = 'active'", nativeQuery = true)
    List<Complaint> findSimilarWithinRadius(
        @Param("lat") double latitude, 
        @Param("lon") double longitude, 
        @Param("category") String category
    );
}

