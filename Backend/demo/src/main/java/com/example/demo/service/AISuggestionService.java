package com.example.demo.service;

public class AISuggestionService {

    public String suggestRouteStrategy(int distance) {

        if(distance < 5)
            return "Fastest route - Low traffic 🚗";

        else if(distance < 10)
            return "Balanced route ⚖️";

        else
            return "Heavy traffic - Try alternative 🚦";
    }
}