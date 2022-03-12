#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <FS.h>

const char* htmlFile = "/index.html";
const char* ssid     = "J_sele";
const char* password = "jpasspass3";

// Create AsyncWebServer object on port 80
ESP8266WebServer server(80);

void handleRoot()
{
  server.sendHeader("Location", "/index.html", true);
  server.send(302, "text/plane", "");
}

void handleWebRequests()
{
  if (loadFromSpiffs(server.uri())) return;

  String message = "File not detected\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";

  for (uint8_t i = 0; i < server.args(); i++)
  {
    message += " NAME:" + server.argName(i) + "\n VALUE:" + server.arg(i) + "\n";
  }

  server.send(404, "text/plain", message);
  Serial.println(message);
}

void setup() {
  // Serial port for debugging purposes
  Serial.begin(115200);
  Serial.println();

  SPIFFS.begin();
  // nodemcu as station
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("WiFi Failed!\n");
    return;
  }

  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.onNotFound(handleWebRequests);
  // Start server
  server.begin();
}

void loop() {
  server.handleClient();
}

bool loadFromSpiffs(String path)
{
  String dataType = "text/plain";
  
  if(path.endsWith("/"))
    path += "index.htm";

  if(path.endsWith(".src"))
    path = path.substring(0, path.lastIndexOf("."));

  else if(path.endsWith(".html"))
    dataType = "text/html";

  else if(path.endsWith(".htm"))
    dataType = "text/html";

  else if(path.endsWith(".css"))
    dataType = "text/css";

  else if(path.endsWith(".js")) 
    dataType = "application/javascript";

  else if(path.endsWith(".png")) 
    dataType = "image/png";

  else if(path.endsWith(".gif")) 
    dataType = "image/gif";

  else if(path.endsWith(".jpg")) 
    dataType = "image/jpeg";

  else if(path.endsWith(".ico")) 
    dataType = "image/x-icon";

  else if(path.endsWith(".xml")) 
    dataType = "text/xml";

  else if(path.endsWith(".pdf")) 
    dataType = "application/pdf";

  else if(path.endsWith(".zip")) 
    dataType = "application/zip";

  File dataFile = SPIFFS.open(path.c_str(), "r");
  if(server.hasArg("download"))
    dataType = "application/octet-stream";
  if(server.streamFile(dataFile, dataType) != dataFile.size())
  {
  
  }

  dataFile.close();
  return true;
}
