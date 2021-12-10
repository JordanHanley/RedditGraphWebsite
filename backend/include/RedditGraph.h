#include <fstream>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <vector>
#include <utility>
#include <iostream> 
#include <queue>
#include <set>
using namespace std;

class RedditGraph {
private:
    // Internal node subclass
    struct Node {
        Node* parent;
        string value;
        Node(Node* parent, string value) {
            this->parent = parent;
            this->value = value;
        }
    };
    // Fields
    unordered_map<string, vector<pair<string, int>>> data;
    vector<string> indexToKey;
    unordered_map<string, int> keyToIndex;
    // Constant to be used in the djisktras algo to make the higher weight edges count as lower weight
    // This constant must exceed the value of the highest weight edge
    const int DIJKSTRASCONSTANT = 100000;
    // Private Functions
    Node* BFSHelper(string from, string to, vector<Node*>& allocatedNodes, unordered_set<string>& visited);
public:
    // Public Funtions
    void readFromFile(string fileName);
    vector<string> getBFSPathFromTo(string from, string to);
    vector<string> getDijkstrasPathFromTo(string from, string to);
    bool keyExists(string key);
};
