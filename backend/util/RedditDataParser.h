#include <fstream>
#include <unordered_map>
#include <string>
#include <vector>
#include <utility>
#include <iostream> 
using namespace std;

class RedditDataParser {
    unordered_map<string, vector<pair<string, int>>> data;
public:
    void readFromFile(string fileName);
    void writeToFile(string fileName);
};