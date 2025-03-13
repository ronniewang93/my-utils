package com.myutils.service;

import com.myutils.dto.TaskDTO;
import com.myutils.entity.Task;
import com.myutils.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        task.setColumnId(taskDTO.getColumnId());
        
        if (taskDTO.getCompletedDate() != null) {
            task.setCompletedDate(LocalDate.parse(taskDTO.getCompletedDate()));
        }

        task = taskRepository.save(task);
        return convertToDTO(task);
    }

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByColumnId(String columnId) {
        return taskRepository.findByColumnId(columnId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setColumnId(task.getColumnId());
        
        if (task.getCompletedDate() != null) {
            dto.setCompletedDate(task.getCompletedDate().format(DateTimeFormatter.ISO_DATE));
        }
        
        return dto;
    }
} 