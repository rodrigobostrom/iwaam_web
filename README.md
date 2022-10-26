# WAAM Web Interface

This repository contains the webpage used for monitoring data from the KUKA robots located in LNTSold/UFRJ. It is possible to measure data
from the Fronius Power Source, such as current, voltage and wire feed speed, joint angles of the robot, including the KUKA KP2 table, position and orientation of the robot's effector in relation to the base. Besides that, there is a visualization of the robot by RVIZ and a graph is also plotted to illustrate the variation of Fronius Power Source's data over time.

## Installation Instructions

The following instructions are written for ROS NOETIC on Ubuntu 20.04. Following rospackages are needed:

- tf2_web_republisher:

```sudo apt-get install ros-<rosdistro>-tf2-web-republisher```

- robot_state_publisher:

```sudo apt-get install ros-<rosdistro>-robot-state-publisher```

- rosbridge_server:

```sudo apt-get install ros-<rosdistro>-rosbridge-server```

- Apache server is also needed:

```sudo apt-get install apache2```

With all the previous steps acomplished, clone this repository to /home/you/path_you_decide/. Then, perform the following steps:

```gedit /home/you/path_you_decide/waam_web_interface/Javascripts/RvizTable.js```

Find the following line of code var urdfPath = "http://172.16.11.27";, substitute http://172.16.11.27 for the robot fixed ip you configured then perform the operations below

```bash
sudo rm -r /var/www/html/*
sudo cp -r /home/you/path_you_decide/waam_web_interface/* /var/www/html/
sudo ln -s /var/www/html/teste.html /var/www/html/index.html
```

Then, all you have to do is to access the robot's IP address via browser. If IP is 172.16.11.27, then the url will be http://172.16.11.27. The webpage is online whenever the robot is on.

In order to have everything working properly, you need to start the Rosbridge Websocket, WAAM Interface's launch file and tf2_web_republisher through the commands below:

- Rosbridge Server:

```roslaunch rosbridge_server rosbridge_websocket.launch```

- TF2 Web Republisher 

```rosrun tf2_web_republisher tf2_web_republisher```

- WAAM Interface

```git clone https://gitlab.com/gscar-coppe-ufrj/waam/waam_interface.git ```

The webpage works with both the KUKA's robots, and the visualization that appears on the site depends on which robot is on.