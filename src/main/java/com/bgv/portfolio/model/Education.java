package com.bgv.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "institute")
    private String institute;

    @Column(name = "degree")
    private String degree;

    @Column(name = "cgpa")
    private Double cgpa;

    @Column(name = "percentage")
    private String percentage;

    @Column(name = "board")
    private String board;

    @Column(name = "duration")
    private String duration;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;
}
