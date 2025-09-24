package com.krishnaproject.admin.config;

import com.krishnaproject.admin.dto.CarDto;
import com.krishnaproject.admin.entity.Car;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        return new ModelMapper();
    }
}