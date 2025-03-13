package com.myutils.service;

import com.myutils.dto.ColumnDTO;
import com.myutils.entity.Col;
import com.myutils.repository.ColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ColumnService {
    @Autowired
    private ColumnRepository columnRepository;

    @Transactional(readOnly = true)
    public List<ColumnDTO> getAllColumns() {
        return columnRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ColumnDTO createColumn(ColumnDTO columnDTO) {
        Col column = new Col();
        column.setId(columnDTO.getId());
        column.setTitle(columnDTO.getTitle());
        column.setOrder(columnDTO.getOrder());

        column = columnRepository.save(column);
        return convertToDTO(column);
    }

    @Transactional
    public void updateColumn(String id, ColumnDTO columnDTO) {
        Col column = columnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Col not found with id: " + id));

        column.setTitle(columnDTO.getTitle());
        column.setOrder(columnDTO.getOrder());

        columnRepository.save(column);
    }

    @Transactional
    public void deleteColumn(String id) {
        columnRepository.deleteById(id);
    }

    private ColumnDTO convertToDTO(Col column) {
        ColumnDTO dto = new ColumnDTO();
        dto.setId(column.getId());
        dto.setTitle(column.getTitle());
        dto.setOrder(column.getOrder());
        return dto;
    }
}