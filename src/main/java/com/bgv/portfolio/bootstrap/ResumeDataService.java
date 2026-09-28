package com.bgv.portfolio.bootstrap;

import com.bgv.portfolio.storage.JsonPortfolioStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

/** Resets the writable runtime document to the bundled, committed seed. */
@Service
@RequiredArgsConstructor
public class ResumeDataService {

    private final JsonPortfolioStore store;

    public void forceImportFromClasspath() throws IOException {
        store.resetFromSeed();
    }
}
