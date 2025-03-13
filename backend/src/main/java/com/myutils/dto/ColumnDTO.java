package com.myutils.dto;

public class ColumnDTO {
    private String id;
    private String title;
    private int order;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    @Override
    public String toString() {
        return "ColumnDTO{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", order=" + order +
                '}';
    }
} 