package com.groovelink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableAsync
public class GroovelinkBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GroovelinkBackendApplication.class, args);
	}

}
