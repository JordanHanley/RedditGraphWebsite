#include "RedditDataParser.h"

void RedditDataParser::readFromFile(string fileName) {
    ifstream file(fileName);
    string line;
    getline(file, line);
    if (file.is_open()) {
        while (getline(file, line)) {
            string from = line.substr(0, line.find('\t'));
            line.erase(0, line.find('\t') + 1);
            string to = line.substr(0, line.find('\t'));
            line.erase(0, line.find('\t') + 1);

            //Check if combo already exists
            bool exists = false;
            vector<pair<string, int>>& vec = data[from];
            for (int i = 0; i < vec.size(); i++) {
                if (vec[i].first == to) {
                    exists = true;
                    vec[i].second++;
                }
            }
            if (!exists) {
                pair<string, int> p(to, 1);
                data[from].push_back(p);
            }
        }
    }
}

void RedditDataParser::writeToFile(string fileName) {
    ofstream file(fileName);
    if (file.is_open()) {
        for (auto iter = data.begin(); iter != data.end(); ++iter) {
            string from = (*iter).first;
            vector<pair<string, int>>& vec = (*iter).second;
            for (int i = 0; i < vec.size(); i++) {
                string to = vec[i].first;
                int freq = vec[i].second;
                string outputLine = from + ", " + to + ", " + to_string(freq) + "\n";
                file << outputLine;
            }
        }
    }

}