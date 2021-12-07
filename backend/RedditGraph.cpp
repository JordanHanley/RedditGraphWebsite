#include "include/RedditGraph.h"

void RedditGraph::readFromFile(string fileName) {
    ifstream file(fileName);
    string line;
    if (file.is_open()) {
        while (getline(file, line)) {
            string from = line.substr(0, line.find(','));
            line.erase(0, line.find(',') + 2);
            string to = line.substr(0, line.find(','));
            line.erase(0, line.find(',') + 2);
            int freq = stoi(line);
            data[from].push_back(make_pair(to, freq));
        }
    }
    // Now create mappings for each key and its respective index (for use in djikstras)
    // set to keep track of when we find a distinct index
    set<string> keys;
    int index = 0;
    for (auto iter = data.begin(); iter != data.end(); ++iter) {
        // First check if the key of the hashmap entry hasn't been seen yet
        string key = (*iter).first;
        if (keys.find(key) == keys.end()) {
            indexToKey.push_back(key);
            keyToIndex[key] = index;
            keys.insert(key);
            index++;
        }
        // Check each of the linked subreddits and see if they have been found yet
        vector<pair<string, int>>& vec = data[key];
        for (int i = 0; i < vec.size(); i++) {
            string linkedSubreddit = vec[i].first;
            if (keys.find(linkedSubreddit) == keys.end()) {
                indexToKey.push_back(linkedSubreddit);
                keyToIndex[linkedSubreddit] = index;
                keys.insert(linkedSubreddit);
                index++;
            }
        }
    }
}

RedditGraph::Node* RedditGraph::BFSHelper(string from, string to, vector<Node*>& allocatedNodes, unordered_set<string>& visited) {
    Node* root = new Node(NULL, from);
    // Queue for BFS
    queue<Node*> q;
    q.push(root);
    visited.insert(from);
    allocatedNodes.push_back(root);
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            Node* top = q.front();
            q.pop();
            vector<pair<string, int>>& adjacentNodes = data[top->value];
            for (int i = 0; i < adjacentNodes.size(); i++) {
                // If node has not been visited
                if (visited.find(adjacentNodes[i].first) == visited.end()) {
                    visited.insert(adjacentNodes[i].first);
                    // Make new node
                    Node* node = new Node(top, adjacentNodes[i].first);
                    allocatedNodes.push_back(node);
                    q.push(node);
                    // Check if target node found
                    if (adjacentNodes[i].first == to) {
                        return node;
                    }
                }
            }
        }
    }
    return NULL;
}

vector<string> RedditGraph::getBFSPathFromTo(string from, string to) {
    // Making a vector to hold all the dynamically allocated nodes, so that they can be deallocated at the end of the function
    vector<Node*> allocatedNodes;
    // Set to keep track of accessed nodes
    unordered_set<string> visited;
    // Call BFS helper and get tail of linked list holding the shortest path to our target node
    Node* tail = BFSHelper(from, to, allocatedNodes, visited);
    vector<string> path;
    while (tail != NULL) {
        path.insert(path.begin(), tail->value);
        tail = tail->parent;
    }
    // Deallocate the nodes
    for (Node* node : allocatedNodes) {
        delete node;
    }
    return path;
}

vector<string> RedditGraph::getDijkstrasPathFromTo(string from, string to) {
    set<int> notVisited;
    vector<int> dist;
    vector<int> predecessor;

    // Set up the notVisited map
    for (int i = 0; i < indexToKey.size(); i++) {
        notVisited.insert(i);
    }
    //Initalize dist array to max value
    for (int i = 0; i < indexToKey.size(); i++) {
        // Subtracting a constant to prevent incorrect comparisons caused by overflow
        dist.push_back(INT_MAX - DIJKSTRASCONSTANT);
    }
    //Initialize predecessor array to -1
    for (int i = 0; i < indexToKey.size(); i++) {
        predecessor.push_back(-1);
    }

    int src = keyToIndex[from];
    dist[src] = 0;
    while (!notVisited.empty()) {
        vector<pair<string, int>>& adj = data[indexToKey[src]];
        for (int i = 0; i < adj.size(); i++) {
            int adjVertex = keyToIndex[adj[i].first];
            // Subtracting actual weight from a constant so that higher values have lower weights for the algo
            int weight = DIJKSTRASCONSTANT - adj[i].second;
            if (dist[adjVertex] > dist[src] + weight) {
                dist[adjVertex] = dist[src] + weight;
                predecessor[adjVertex] = src;
            }
        }
        //Find the next vertex
        notVisited.erase(src);
        if (notVisited.empty()) break;
        int minVertex = *(notVisited.begin());
        int minVal = dist[*(notVisited.begin())];
        for (auto iter = notVisited.begin(); iter != notVisited.end(); ++iter) {
            if (minVal > dist[*(iter)]) {
                minVal = dist[*(iter)];
                minVertex = *(iter);
            }
        }
        src = minVertex;
    }
    // Return the path
    vector<string> path;
    int curIndex = keyToIndex[to];
    while (curIndex != -1) {
        path.insert(path.begin(), indexToKey[curIndex]);
        curIndex = predecessor[curIndex];
    }
    return path;
}

