package com.reeckset.labyrinthrobots;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class API {

    @CrossOrigin(origins = "http://localhost:8000")
    @RequestMapping(value = "/levels", method = RequestMethod.GET)
    public String getLevels(){
        return "{\"levels\": \"these are the levels\"}";
    }

}
