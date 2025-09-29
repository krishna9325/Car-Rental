package com.krishnaproject.carrentalservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
//@EnableFeignClients
public class CarRentalServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarRentalServiceApplication.class, args);
	}

}
