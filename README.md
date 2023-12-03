# Bowl Butler Pro - IoT Smart Pet Feeder

## Overview
The Bowl Butler Pro is a cost-effective, automated system designed for the regular and scheduled feeding of pets. This DIY project blends hardware integration with software control, using affordable components like the TTGO ESP32. It's an ideal solution for pet owners seeking a reliable yet budget-friendly way to ensure their pets are consistently fed, regardless of their schedule or location. With features like remote feeding activation, pet detection notification and a mobile-friendly interface, the Bowl Butler Pro is more than just a pet feeder—it's a comprehensive pet care system.

## Devices

### TTGO ESP32
The TTGO ESP32 board is the central component of this project. It controls the feeder's mechanisms and communicates with the server for remote operations.

#### Features:
- **WiFi Connectivity**: Connects to your home network for remote communication.
- **Servo Motor Control**: Operates the feeding mechanism to dispense food.
- **IR Sensor**: Detects the presence of a pet near the feeder.
- **LED Indicators**: 
  - Blinking green when waiting for WiFi connection.
  - Solid green when connected to WiFi.
  - Orange during feeding operation.
- **Manual Feed Button**: Allows on-demand feeding with a simple button press.

### Server (Node.js)
The server, built using Node.js, manages the IoT device's operations and user interactions through a web interface.

#### Features:
- **Remote Feeding Activation**: Allows users to trigger feeding remotely via a web interface.
- **Feeding Schedule Management**: Users can set up daily feeding times through a simple, user-friendly interface. The server stores these schedules and triggers the feeder at the designated times.
- **Feeding History Log**: The server records and displays the time of each feeding, providing a clear history of when the pet was last fed.
- **Pet Detection Notification**: An email alert is sent to the user when the pet is detected waiting near the feeder, indicating potential hunger.

### Mobile Web UI
A responsive web interface that adapts to various devices, allowing full control and monitoring of the pet feeder remotely.

![Feeding Schedule Interface](https://github.com/Patoucheas/pet-feeder/blob/main/BowlButlerWebUI.png)

#### Features:
- **'Feed Now' Button**: Instantly activate the feeder from anywhere.
- **Last Feeding Display**: Shows the time of the most recent feeding.
- **Meal Planner**: Schedule and manage daily feeding times, with options to add or delete meals.

## Installation

### Hardware Setup
1. **Assemble the Feeder**: Attach the servo motor to the feeder mechanism.
2. **Connect the TTGO Board**: Secure the TTGO ESP32 to the feeder and connect all necessary components (servo, IR sensor, LEDs).

### Software Configuration
1. **Flash the TTGO**: Upload the provided code to the TTGO ESP32 board. For detailed instructions, refer to the [ESP32 Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/index.html).
2. **Environment Configuration**: Set up WiFi credentials and server URLs in the TTGO code.
3. **Server Setup**: Deploy the Node.js server on a suitable hosting platform or locally. For beginners, follow this [Node.js Server Setup Guide](https://nodejs.org/en/docs/guides/getting-started-guide/). For hosting, [Render](https://render.com/docs/web-services) offers a free tier for basic usage. Follow Render's documentation for [Web Services](https://render.com/docs/web-services) to set up your server.
4. **Email Notifications Setup**: Configure NodeMailer for email notifications. This involves setting up your Gmail account to work with NodeMailer. You'll need to enable ["Less secure app access"](https://support.google.com/accounts/answer/6010255?hl=en) in your Gmail settings or use OAuth2 for a more secure setup. For more information on NodeMailer and its configuration, refer to the [NodeMailer documentation](https://nodemailer.com/about/).

## Usage

### Web Interface
- **Manual Feeding**: Use the 'Feed Now' button for immediate feeding.
- **Last Feeding Time**: Check the last feeding time on the web interface.
- **Schedule Feedings**: Set times for automatic feeding.
- **Pet Presence Notifications**: Receive real-time email notifications to your inbox if your pet is detected near the feeder for an extended period.

### Physical Interaction
- **Manual Feed Button**: Press to the physical button the feeding mechanism manually.
- **LED Indicators**: Observe the status of the feeder (e.g., successful feeding, WiFi status).

## Troubleshooting

- **WiFi Connection Issues**: Check the SSID and password in the TTGO code.
- **Feeding Mechanism Failure**: Ensure the servo motor is properly connected and functioning.
- **Sensor Inaccuracy**: Verify the placement and connection of the IR sensor.

## Credits and Acknowledgments
This project leverages several open-source libraries and platforms, including:
- [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32) for programming the TTGO ESP32 module.
- [NodeMailer](https://nodemailer.com/about/) for sending email notifications.
- [Express.js](https://expressjs.com/) for setting up the server framework.
- [Render](https://render.com/) for hosting the server.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.
