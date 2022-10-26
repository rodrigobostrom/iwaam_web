var current = 0;
var voltage = 0;
var wireFeedSpeed = 0;
var speed = 0;

class auxPowerInfo {
    constructor (current, voltage, wireFeedSpeed, speed){
        this.current = current;
        this.voltage = voltage;
        this.wireFeedSpeed = wireFeedSpeed;
        this.speed = speed;
    }
    setCurrent(x) {
        this.current = x;
    }
    setVoltage(x) {
        this.voltage = x;
    }
    setWireFeedSpeed(x) {
        this.wireFeedSpeed = x;
    }
    setSpeed(x,y,z) {
		this.speed = (1000)*(Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2)));
	}
    getCurrent() {
        return this.current;
    }
    getVoltage() {
        return this.voltage;
    }
    getWireFeedSpeed() {
        return this.wireFeedSpeed;
    }
    getSpeed() {
		return this.speed;
	}
}

function roundToTwo(num) {
    return (Math.round(num * 100) / 100);
}

function roundToOne(num) {
    return (Math.round(num * 10) / 10);
}

var powerInfo = new auxPowerInfo(current, voltage, wireFeedSpeed, speed);

// Get torch name from parameterServer
var torch = 0;

// Create a Param object for the max linear speed
var torchParam = new ROSLIB.Param({
     ros : ros,
     name :  '/torch'
    });

// Get the value of the max linear speed paramater
torchParam.get(function(value) {
   if (value != null) {
       torch = value;
       console.log(torch);
   }
});

// Declaring topics
var listenerKukaRsiRemap = new ROSLIB.Topic({
    ros : ros,
    name : '/powersource_state'
});

var listenerKR90 = new ROSLIB.Topic({
	ros : ros,
	name : '/kr90/endpoint_twist',
	messageType : 'geometry_msgs/TwistStamped'
})

var listenerKR10 = new ROSLIB.Topic({
	ros : ros,
	name : '/kr10/endpoint_twist',
	messageType : 'geometry_msgs/TwistStamped'
})

// Subscribing to topic '/kr90/endpoint_twist'
listenerKR90.subscribe(function (message){
	x = message.twist.linear.x;
	y = message.twist.linear.y;
	z = message.twist.linear.z;

	powerInfo.setSpeed(x, y, z);
})

// Subscribing to topic '/kr10/endpoint_twist'
listenerKR10.subscribe(function (message){
	x = message.twist.linear.x;
	y = message.twist.linear.y;
	z = message.twist.linear.z;

	powerInfo.setSpeed(x, y, z);
})

listenerKukaRsiRemap.subscribe(function (message){
    if (!(torch.localeCompare("fronius")))
    {
        curr = message.arc_current;
	    volt = message.arc_voltage;
	    wfs = message.wire_feed_speed;
    }
    else if (!(torch.localeCompare("plasma")))
    {
        curr = message.EWM_current;
        volt = message.EWM_voltage;
        wfs = message.Dinse_wire_feed_speed;
    }
    else
    {
        curr = 0.0;
        volt = 0.0;
        wfs =  0.0;
    }

    powerInfo.setCurrent(curr);
    powerInfo.setVoltage(volt);
    powerInfo.setWireFeedSpeed(wfs);
})

function createPwrSrcTable() {

    var powerTable = document.getElementById("power_sourcer");

    for (var numberRows = 0; numberRows < 4; numberRows++) {
        var row = powerTable.insertRow(numberRows);

        powerTable.cellPadding = "5px 5px 5px 5px";

        //Inserting the cells in the row;
        var NameCell = row.insertCell(0);
        var ValueCell = row.insertCell(1);

        NameCell.width = "200px";
        NameCell.height = "200px";
        ValueCell.width = "200px";
        ValueCell.height = "200px";

        for (var numberCollumns = 0; numberCollumns < 2; numberCollumns++) {
            switch (numberRows) {
                case 0:

                    row.className = "table_even_row";

                    switch (numberCollumns) {
                        case 0:
                            var rowName = "Arc Current (A)";
                            NameCell.innerHTML = rowName.bold();
                            break;
                        case 1:
                            var auxPowerInfoFunc = powerInfo.getCurrent();
                            ValueCell.innerHTML = auxPowerInfoFunc;
                            ValueCell.tabIndex = "1";
                            break;
                    }
                    break;

                case 1:

                    row.className = "table_odd_row";

                    switch (numberCollumns) {
                        case 0:
                            var rowName = "Arc Voltage (V)";
                            NameCell.innerHTML = rowName.bold();
                            break;
                        case 1:
                            var auxPowerInfoFunc = powerInfo.getVoltage();
                            ValueCell.innerHTML = auxPowerInfoFunc;
                            ValueCell.tabIndex = "1";
                            break;
                    }
                    break;

                case 2:

                    row.className = "table_even_row";

                    switch (numberCollumns) {
                        case 0:
                            var rowName = "Wire Feed Speed (m/min)";
                            NameCell.innerHTML = rowName.bold();
                            break;
                        case 1:
                            var auxPowerInfoFunc = powerInfo.getWireFeedSpeed();
                            ValueCell.innerHTML = auxPowerInfoFunc;
                            ValueCell.tabIndex = "1";
                            break;
                    }
                    break;

                case 3:

                    row.className = "table_odd_row";

                    switch (numberCollumns) {
                        case 0:
                            var rowName = "Travel Speed (mm/s)";
                            NameCell.innerHTML = rowName.bold();
                            break;
                        case 1:
                            var auxPowerInfoFunc = powerInfo.getSpeed();
                            ValueCell.innerHTML = auxPowerInfoFunc;
                            ValueCell.tabIndex = "1";
                            break;
                    }
                    break;
            }
        }
    }
}

function updatePowerSourcerReadings()
{
    var updatePwrSrc = document.getElementById("power_sourcer");

    var current = powerInfo.getCurrent().toFixed(2);
    var voltage = powerInfo.getVoltage().toFixed(2);
    var wireFeedSpeed = powerInfo.getWireFeedSpeed().toFixed(2);
    var speed = powerInfo.getSpeed().toFixed(1);

    for (var i = 0; i != 4; i++)
    {
        switch (i) {
            case 0:

                // CORRENTE (0 A <= i <= 1000 A)
                if(current > 250 && current <= 500)
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'yellow';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = (current.toString()).bold();
                }
                else if (current > 500)
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'red';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = (current.toString()).bold();
                }
                else
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'black';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = current;
                }
                break;  

            case 1:

                // TENSÃO (0 V <= V <= 100 V)
                if(voltage > 50 && voltage <= 75)
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'yellow';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = (voltage.toString()).bold();
                }
                else if (voltage > 75)
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'red';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = (voltage.toString()).bold();
                }
                else
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'black';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = voltage;
                }
                break;

            case 2:

                // VELOCIDADE DO ARAME (-327.68 mm/s <= w <= 327.68 mm/s)
                if(wireFeedSpeed > 100 && wireFeedSpeed <= 200)
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'yellow';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = (wireFeedSpeed.toString()).bold();
                }
                else if (wireFeedSpeed > 200)
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'red';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = (wireFeedSpeed.toString()).bold();
                }
                else
                {
                    updatePwrSrc.rows[i].cells.item(1).style.color = 'black';
                    updatePwrSrc.rows[i].cells.item(1).innerHTML = wireFeedSpeed;
                } 
                break;

            case 3:

                // TRAVEL SPEED
                updatePwrSrc.rows[i].cells.item(1).innerHTML = speed;
        }
    }
}