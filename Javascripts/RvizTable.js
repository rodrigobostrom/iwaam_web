/*
    CONNECTION WITH ROSBRIDGE SERVER, ROBOT VISUALIZATION (RVIZ) AND GRAPHS
*/

var connectState = false;
var ros = new ROSLIB.Ros({});
var localHost;

window.ros = ros;

// Connection with websocket
function connect()
{
    if (!connectState)
    {
        this.localHost = prompt("Enter the ip address of the websocket:", "192.168.1.121");
        this.rosUrl = "ws://" + this.localHost.toString() + ":9090/";
        ros.connect(rosUrl);

        console.log("rosUrl = " + rosUrl);
    }
    else
    {
        ros.close();
    }
}

ros.on('connection', function() {
    console.log('Connected to websocket server.');
    alert('Connected to websocket server.');
    connectState = true;
  });
  
  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
    alert("Error connecting to websocket server");
    connectState = false;
  });
  
  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
    alert("Connection to websocket server closed.");
    connectState = false;
  });

// Updating the image if the connection with the websocket was sucessfull
function updateConnectionImage()
{
    var updateConnectionImage = document.getElementById('connected_image');

    if(connectState)
    {
        updateConnectionImage.src = 'img/Connected.png';
    }
    else
    {
        updateConnectionImage.src = 'img/Disconnected.png';
    }
}

// Starting RVIZ depending on which button was pressed
var robotViz = false;

function startKR10()
{
    console.log("KR10");
    if (!robotViz && connectState)
    {
        robotViz = true;

        var initPos = {
            x : 1.50,
            y : 1.50,
            z : 1.50
        };

        var urdfPath = "http://" + localHost;
        console.log("URDF Path: " + urdfPath);

        // Create the main viewer.
        var viewer = new ROS3D.Viewer({
            divID : "robot_viz_container",
            width : 750,
            height : 600,
            antialias : true,
            intensity : 0.8,
            // background : '#363636',
            background : '#999999',
            cameraPose : initPos
        });

        // Add a grid.
        viewer.addObject(new ROS3D.Grid());

        // Setup a client to listen to TFs. This client will subscribe to changes in the TF tree and update the scene appropriately.
        var tfClient = new ROSLIB.TFClient({
            ros : ros,
            angularThres : 0.01,
            transThres : 0.01,
            rate : 10.0,
            fixedFrame : '/kr10_base_link',
            serverName : '/tf2_web_republisher',
            updateDelay: 10.0
        });

        var imClient = new ROS3D.MarkerClient({
            ros : ros,
            tfClient : tfClient,
            topic : '/trajectory_marker',
            rootObject : viewer.scene
        });

        var urdfClient = new ROS3D.UrdfClient({
            ros : ros,
            tfClient : tfClient,
            param: '/robot_description',
            path : urdfPath,
            rootObject : viewer.scene,
            loader : ROS3D.COLLADA_LOADER_2
        });
    }
}

function startKR90()
{
    console.log("KR90");
    if (!robotViz && connectState)
    {
        robotViz = true;

        var initPos = {
            x : 1.50,
            y : 1.50,
            z : 1.50
        };

        var urdfPath = "http://" + localHost;
        console.log("URDF Path: " + urdfPath);

        // Create the main viewer.
        var viewer = new ROS3D.Viewer({
            divID : "robot_viz_container",
            width : 750,
            height : 600,
            antialias : true,
            intensity : 0.8,
            background : '#999999',
            cameraPose : initPos
        });

        // Add a grid.
        viewer.addObject(new ROS3D.Grid());

        // Setup a client to listen to TFs.
        var tfClient = new ROSLIB.TFClient({
            ros : ros,
            angularThres : 0.01,
            transThres : 0.01,
            rate : 10.0,
            fixedFrame : '/kp2_base_link'
        });

        var imClient = new ROS3D.MarkerClient({
            ros : ros,
            tfClient : tfClient,
            topic : '/trajectory_marker',
            rootObject : viewer.scene
        });

        var urdfClient = new ROS3D.UrdfClient({
            ros : ros,
            tfClient : tfClient,
            param: '/robot_description',
            path : urdfPath,
            rootObject : viewer.scene,
            loader : ROS3D.COLLADA_LOADER_2
        });

    }
}

// Creating graphs for the Fronius parameters

function createChart() {
    
    var dps1 = [{x: 0, y: 0}];
    var dps2 = [{x: 0, y: 0}];
    var dps3 = [{x: 0, y: 0}];

    var chart1 = new CanvasJS.Chart("chartCurrent",{
        animationEnabled: true,
        backgroundColor: "#F5DEB3",
        borderWidth: 2,
        lineColor: "black",
        title: {
            text: "Arc Current"
        },
        axisX: {						
            title: "Time (s)" 
        },
        axisY: {						
            title: "Arc Current (A)"
        },
        data: [{
            type: "line", 
            lineThickness: 4,
            dataPoints : dps1
        }]
    });

    chart1.render();

    var chart2 = new CanvasJS.Chart("chartVoltage",{
        animationEnabled: true,
        backgroundColor: "#F5DEB3",
        lineColor: "black",
        title :{
            text: "Arc Voltage"
        },
        axisX: {						
            title: "Time (s)"
        },
        axisY: {						
            title: "Arc Voltage (V)"
        },
        data: [{
            type: "line",
            lineThickness: 4,
            dataPoints : dps2
        }]
    });

    chart2.render();

    var chart3 = new CanvasJS.Chart("chartWireFeed",{
        animationEnabled: true,
        backgroundColor: "#F5DEB3",
        lineColor: "black",
        title :{
            text: "Wire Feed Speed"
        },
        axisX: {						
            title: "Time (s)"
        },
        axisY: {						
            title: "Wire Feed Speed (mm/s)"
        },
        data: [{
            type: "line",
            lineThickness: 4,
            dataPoints : dps3
        }]
    });

    chart3.render();

    var xVal1 = dps1.length;
    var xVal2 = dps2.length;
    var xVal3 = dps3.length;
    yVal = [0, 0, 0];
    
    var updateInterval = 50;

    var updateChart = function updateChart() {

        // Chart will start running after the webpage is connected to the server
        if(connectState){
    
            // update chart after specified time. 
            for(i=0;i<=dps1.length;i++){

                switch (i){
                    case 0:
                        yVal[i] = powerInfo.getCurrent();
                        dps1.push({x: xVal1,y: yVal[i]});
                        xVal1 = xVal1 + (updateInterval/1000);
                        break;
                    case 1:
                        yVal[i] = powerInfo.getVoltage();
                        dps2.push({x: xVal2,y: yVal[i]});
                        xVal2 = xVal2 + (updateInterval/1000);
                        break;
                    case 2:
                        yVal[i] = powerInfo.getWireFeedSpeed();
                        dps3.push({x: xVal3,y: yVal[i]});
                        xVal3 = xVal3 + (updateInterval/1000);
                        break;
                }

            }
            
            // Showing data during 30 seconds
            if (dps1.length > 30*(1000/updateInterval) ){
                if (dps2.length > 30*(1000/updateInterval) ){
                    if (dps3.length > 30*(1000/updateInterval) ){
                        dps1.shift();
                        dps2.shift();
                        dps3.shift();
                    }
                }
            }			

            chart1.render();
            chart2.render();
            chart3.render();  
            }
        		

    };

    setInterval(function(){updateChart()}, updateInterval);

}