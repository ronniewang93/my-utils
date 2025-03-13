package com.myutils.repository;

import com.myutils.entity.Col;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColumnRepository extends JpaRepository<Col, String> {
    List<Col> findAllByOrderByOrderAsc();
} 