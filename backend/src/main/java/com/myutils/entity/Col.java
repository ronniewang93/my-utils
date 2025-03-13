package com.myutils.entity;

import javax.persistence.*;

@Entity
@Table(name = "columns")
public class Col {
    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(name = "display_order")
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
} 