package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.algorithm.Dijkstra;
import com.example.demo.service.AISuggestionService;
import com.example.demo.service.GraphService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/route")
public class RouteController {

    private AISuggestionService aiService = new AISuggestionService();

    @PostMapping
    public Map<String,Object> getRoute(@RequestBody Map<String,Object> request){

        int src = ((Number) request.get("src")).intValue();
        int dest = ((Number) request.get("dest")).intValue();

        List<List<Integer>> edges = (List<List<Integer>>) request.get("edges");

        GraphService graphService = new GraphService(edges);

        Map<String,Object> result =
                Dijkstra.shortestPath(graphService.getGraph(), src, dest);

        int distance = (int) result.get("distance");

        String aiSuggestion = aiService.suggestRouteStrategy(distance);

        result.put("aiSuggestion", aiSuggestion);

        return result;
    }
}