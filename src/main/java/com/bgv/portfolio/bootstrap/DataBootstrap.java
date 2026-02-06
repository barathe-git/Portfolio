package com.bgv.portfolio.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1)
public class DataBootstrap implements CommandLineRunner {

    private final ResumeDataService resumeDataService;

    public DataBootstrap(ResumeDataService resumeDataService) {
        this.resumeDataService = resumeDataService;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        resumeDataService.importIfEmpty();
    }
}
