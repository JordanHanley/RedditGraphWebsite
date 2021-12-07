#include <iostream>
#include "util/RedditDataParser.h"
#include "include/RedditGraph.h"
#include "include/crow_all.h"
using namespace std;

// File path to the data, change as needed
CONST string DATAPATH = "C:/Users/Jordan/source/repos/RedditGraphWebsite/RedditGraphWebsite/backend/data/parsed_data.csv";

int main()
{
	RedditGraph graph;
	graph.readFromFile(DATAPATH);

	crow::SimpleApp app;

	CROW_ROUTE(app, "/bfs")
		.methods("GET"_method)
		([&](const crow::request& req) {
		auto x = crow::json::load(req.body);
		if (!x)
			return crow::response(400);
		string from = x["from"].s();
		string to = x["to"].s();
		vector<string> path = graph.getBFSPathFromTo(from, to);
		crow::json::wvalue y;
		y = path;
		return crow::response(y);
			});

	CROW_ROUTE(app, "/dijkstra")
		.methods("GET"_method)
		([&](const crow::request& req) {
		auto x = crow::json::load(req.body);
		if (!x)
			return crow::response(400);
		string from = x["from"].s();
		string to = x["to"].s();
		vector<string> path = graph.getDijkstrasPathFromTo(from, to);
		crow::json::wvalue y;
		y = path;
		return crow::response(y);
			});

	app.port(18080).multithreaded().run();
}