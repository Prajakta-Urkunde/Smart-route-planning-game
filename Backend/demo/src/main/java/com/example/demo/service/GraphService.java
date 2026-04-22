package com.example.demo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.demo.model.Edge;

public class GraphService {

    private Map<Integer, List<Edge>> graph = new HashMap<>();

    public GraphService(List<List<Integer>> edges) {

        for(List<?> e : edges){
            List<?> edge = (List<?>) e;

            int u = ((Number) edge.get(0)).intValue();
            int v = ((Number) edge.get(1)).intValue();
            int w = ((Number) edge.get(2)).intValue();

            addEdge(u, v, w);
        }
    }

    private void addEdge(int u, int v, int w){
        graph.computeIfAbsent(u,k->new ArrayList<>()).add(new Edge(v,w));
        graph.computeIfAbsent(v,k->new ArrayList<>()).add(new Edge(u,w));
    }

    public Map<Integer,List<Edge>> getGraph(){
        return graph;
    }
}