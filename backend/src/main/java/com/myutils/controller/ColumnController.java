package com.myutils.controller;

import com.myutils.dto.ColumnDTO;
import com.myutils.service.ColumnService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/columns")
@CrossOrigin(origins = "http://localhost:3000")
public class ColumnController {
    private static final Logger logger = LoggerFactory.getLogger(ColumnController.class);

    @Autowired
    private ColumnService columnService;

    @GetMapping
    public ResponseEntity<List<ColumnDTO>> getAllColumns() {
        try {
            List<ColumnDTO> columns = columnService.getAllColumns();
            logger.info("Retrieved {} columns", columns.size());
            return ResponseEntity.ok(columns);
        } catch (Exception e) {
            logger.error("Error getting all columns", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<ColumnDTO> createColumn(@RequestBody ColumnDTO columnDTO) {
        try {
            logger.info("Received create column request: {}", columnDTO);
            
            // Validate required fields
            if (columnDTO.getId() == null || columnDTO.getId().trim().isEmpty()) {
                logger.error("Invalid column data: id is required");
                return ResponseEntity.badRequest().build();
            }
            if (columnDTO.getTitle() == null || columnDTO.getTitle().trim().isEmpty()) {
                logger.error("Invalid column data: title is required");
                return ResponseEntity.badRequest().build();
            }

            ColumnDTO created = columnService.createColumn(columnDTO);
            logger.info("Created new column: {}", created);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            logger.error("Error creating column", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateColumn(@PathVariable String id, @RequestBody ColumnDTO columnDTO) {
        try {
            logger.info("Updating column {}: {}", id, columnDTO);
            columnService.updateColumn(id, columnDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error updating column {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable String id) {
        try {
            logger.info("Deleting column: {}", id);
            columnService.deleteColumn(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting column {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}