var jointStateListener = [];
var auxJointInfo = [];
var pi = 3.14159;

for (var i = 0; i != 8; i++)
{   
    auxJointInfo.push({
        jointId: i,
        position: 0,
				setPosition: function (x) {
						this.position = x;
				},
				getPosition: function () {
						return this.position;
				},
				getJointId: function () {
						return this.jointId;
				},
    });
}

function roundToTwo(num) {
    return +(Math.round(num + "e+3")  + "e-3");
}

var jointStateListener = (new ROSLIB.Topic({
	ros: ros,
	name: '/joint_states',
	messageType: 'sensor_msgs/JointState'
}));

jointStateListener.subscribe(
	function (message)
	{
		for (var i = 0; i != 8; i++)
		{
			var aux = (message.position[i])*(180/Math.PI);
			auxJointInfo[i].setPosition(Math.round(aux));
		}
	}
);

function createJointStateTable() 
{
  var jointTable = document.getElementById("joint_state");

	jointTable.cellPadding = "5px 5px 5px 5px";

	for (var numberRows = 0; numberRows < 1; numberRows++)
	{
		var row = jointTable.insertRow(numberRows + 1);

		row.className = "table_even_row";

    //Inserting the cells in the row;
		var RowNameCell = row.insertCell(0);
		RowNameCell.width = "100px";
		RowNameCell.height = "100px";
		var jointCell = [];

		// Each one of the joints will be inserted and styled inside this loop
		for (var i = 1; i < 9; i++) {
			jointCell[i] = row.insertCell(i);
			jointCell[i].width = "10%";
			jointCell[i].height = "200px";
			jointCell[i].style.position = "relative";
		}

		for(var numberCollumns = 0; numberCollumns < 9; numberCollumns++)
		{
			switch(numberRows)
			{
				case 0:

					row.className = "table_odd_row";

          switch(numberCollumns)
					{
						case 0:
							var rowName = "Position (º)";
							RowNameCell.innerHTML = rowName.bold();
							break;
						case 1:
							var auxJointInfoFunc = auxJointInfo[0].getPosition();
							jointCell[numberCollumns].innerHTML = auxJointInfoFunc;
							break;
            case 2:
              var auxJointInfoFunc = auxJointInfo[1].getPosition();
							jointCell[numberCollumns].innerHTML = auxJointInfoFunc;
							break;
						case 3:
							var auxJointInfoFunc = auxJointInfo[2].getPosition();
							jointCell[numberCollumns].innerHTML = auxJointInfoFunc;
							break;
						case 4:
							var auxJointInfoFunc = auxJointInfo[3].getPosition();
							jointCell[numberCollumns].innerHTML = auxJointInfoFunc;
							break;
						case 5:
							var auxJointInfoFunc = auxJointInfo[4].getPosition();
							jointCell[numberCollumns].innerHTML = auxJointInfoFunc;
							break;
						case 6:
							var auxJointInfoFunc = auxJointInfo[5].getPosition();
							jointCell[numberCollumns].innerHTML = auxJointInfoFunc;
							break;
						case 7:
							var auxJointInfoFunc = auxJointInfo[6].getPosition();
							jointCell[numberCollumns].innerHTML = isNaN(auxJointInfoFunc) ? 0 : auxJointInfoFunc;
							break;
						case 8:
							var auxJointInfoFunc = auxJointInfo[7].getPosition();
							jointCell[numberCollumns].innerHTML = isNaN(auxJointInfoFunc) ? 0 : auxJointInfoFunc;
							break;
						default:
					}
					break;
				default:
			}
		}
	}
}

function updateJointStateTable()
{
	var updateJointTable = document.getElementById("joint_state");
	
	for (var i = 0; i != 8; i++)
	{
		var auxJointInfoFunc = auxJointInfo[i].getPosition();
    var position = auxJointInfoFunc;
		if(isNaN(position)){
			position = 0;
		}

		updateJointTable.rows[1].cells.item(i+1).innerHTML = position;
	}
}