package com.project.Kat;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class KatApplication {
	public static void main(String[] args) {
		SpringApplication.run(KatApplication.class, args);
	}
}
