package com.example.demo.algorithm;

import com.example.demo.model.Edge;
import java.util.*;

public class Dijkstra {

    public static Map<String, Object> shortestPath(Map<Integer,List<Edge>> graph, int src, int dest){

        Map<Integer,Integer> dist = new HashMap<>();
        Map<Integer,Integer> parent = new HashMap<>();

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[1]));

        for(Integer node: graph.keySet()){
            dist.put(node, Integer.MAX_VALUE);
            parent.put(node, -1);
        }

        dist.put(src,0);
        pq.add(new int[]{src,0});

        while(!pq.isEmpty()){
            int[] cur = pq.poll();
            int u = cur[0];

            for(Edge e : graph.get(u)){
                if(dist.get(u)+e.weight < dist.get(e.to)){
                    dist.put(e.to, dist.get(u)+e.weight);
                    parent.put(e.to, u);
                    pq.add(new int[]{e.to, dist.get(e.to)});
                }
            }
        }

        List<Integer> path = new ArrayList<>();
        int current = dest;

        while(current != -1){
            path.add(current);
            current = parent.get(current);
        }

        Collections.reverse(path);

        Map<String,Object> result = new HashMap<>();
        result.put("path", path);
        result.put("distance", dist.get(dest));

        return result;
    }
}