#include <WiFi.h>
#include <ESP32Servo.h>
#include <HTTPClient.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

// Constants
const char* ssid = "EnterYourWifiSSID";  // WiFi network name
const char* password = "EnterYourWifiPassword";  // WiFi password
const char* serverUrl = "https://YourServerIP.com/";  // Server's IP
const char* notificationUrl = "https://YourServerIP.com/"; // URL for pet near bowl notification
const int greenLED = 13;  // GPIO pin for green LED
const int orangeLED = 21;  // GPIO pin for orange LED
const int buttonPin = 14;  // GPIO pin for button
const int servoPin = 12;  // GPIO pin for servo motor
const int irSensorPin = 36;  // GPIO pin for IR sensor
const long pollInterval = 5000;  // Polling interval for server (5 seconds)
const long debounceDelay = 50;  // Debounce delay (50 milliseconds)
const unsigned long irThresholdDuration = 10000;  // Duration threshold for IR sensor (10 seconds)

// Globals
Servo servoMotor;
bool isWiFiConnected = false;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long lastPollTime = 0;
unsigned long irStartTime = 0;
bool feederActivated = false;

void setup() {
  Serial.begin(115200);  // Start the serial communication
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);  // Disable brownout detector

  // Initialize the GPIO pins
  pinMode(greenLED, OUTPUT);
  pinMode(orangeLED, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(irSensorPin, INPUT);
  servoMotor.attach(servoPin);

  // Start WiFi connection
  WiFi.begin(ssid, password);  
  Serial.println("Connecting to WiFi...");
}

void loop() {
  unsigned long currentMillis = millis();  // Get the current time

  // Poll the server at specified intervals
  if (currentMillis - lastPollTime >= pollInterval) {
    lastPollTime = currentMillis;
    checkForCommands();
  }

  // Handle WiFi connection status and control the green LED
  handleWiFiConnection();

  // Handle button presses in a non-blocking way
  handleButtonPress(currentMillis);

  // Check the IR sensor at regular intervals in a non-blocking way
  handleIRSensor(currentMillis);
}

// Handles WiFi connection and controls the green LED
void handleWiFiConnection() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!isWiFiConnected) {
      isWiFiConnected = true;
      digitalWrite(greenLED, HIGH);  // Turn on green LED when connected
    }
  } else {
    isWiFiConnected = false;
    digitalWrite(greenLED, millis() % 1000 < 500 ? HIGH : LOW);  // Blink green LED when not connected
  }
}

// Handles button presses with debounce logic
void handleButtonPress(unsigned long currentMillis) {
  int reading = digitalRead(buttonPin);

  // Check if the button state has changed
  if (reading != lastButtonState) {
    lastDebounceTime = currentMillis;
  }

  // Take action only after the button state has been stable for longer than the debounce delay
  if ((currentMillis - lastDebounceTime) > debounceDelay) {
    if (reading == LOW && !feederActivated) {
      Serial.println("Button pressed, activating feeder...");
      activateFeeder();
      feederActivated = true;
    }
    else if (reading == HIGH) {
      feederActivated = false;
    }
  }

  lastButtonState = reading;  // Update the last button state
}

// Handles the IR sensor
void handleIRSensor(unsigned long currentMillis) {
  static unsigned long lastIRCheck = 0;  // Last time the IR sensor was checked
  const unsigned long irCheckInterval = 500;  // Interval to check the IR sensor

  // Check the IR sensor at regular intervals
  if (currentMillis - lastIRCheck >= irCheckInterval) {
    lastIRCheck = currentMillis;

    int irValue = analogRead(irSensorPin);  // Read the IR sensor value
    Serial.print("IR Sensor Value: ");
    Serial.println(irValue);
    if (irValue > 2000) {
      if (irStartTime == 0) {
        irStartTime = currentMillis;
      } else if (currentMillis - irStartTime > irThresholdDuration) {
        sendPetNearBowlNotification();
        irStartTime = 0;
      }
    } else {
      irStartTime = 0;
    }
  }
}

// Activates the feeder
void activateFeeder() {
  Serial.println("Feeding started...");
  digitalWrite(orangeLED, HIGH);
  servoMotor.write(180);  // Open the feeder
  delay(350);  // Wait for a short duration
  servoMotor.write(100);  // Close the feeder
  digitalWrite(orangeLED, LOW);
  Serial.println("Feeding complete!");
}

// Checks for commands from the server
void checkForCommands() {
  HTTPClient http;
  http.begin(serverUrl);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("Received: " + payload);
    if (payload.indexOf("feed") >= 0) {
      Serial.println("Feed command received, activating feeder...");
      activateFeeder();
    }
  } else {
    Serial.println("Error in HTTP request");
  }
  http.end();
}

// Sends a notification to the server when the pet is near the bowl
void sendPetNearBowlNotification() {
  HTTPClient http;
  http.begin(notificationUrl);
  http.POST("");
  http.end();
}
