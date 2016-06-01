package com.engagepoint.cws.apqd.repository;

import com.engagepoint.cws.apqd.domain.Deleted;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Deleted entity.
 */
public interface DeletedRepository extends JpaRepository<Deleted,Long> {

}
