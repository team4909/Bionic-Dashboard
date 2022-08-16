const ntClient = require("wolfbyte-networktables");

const client = new ntClient.Client();


const connectToRobot = (client, address) => {
	client.start(
		(isConnected, error, is2_0) => { console.log({isConnected, error, is2_0, x}); },
		roborio_hostname
	);

	client.setReconnectDelay(5000); //ms
}

const listener = client.addListener((key, value, valueType, type, id) => {
	console.log({ key, value, valueType, type, id });
});


// console.log(client.Update(500, 16, false));
console.log(client.getKeyID());


// console.log(client.getEntry(client.getKeyID("SmartDashboard/Test Value")));
// console.log(client.getKeyID(1));

// client.Assign(20, "Test Val3", false);
// client.removeListener(listener);

client.Assign(20, "Test/Test Val5", false);
client.Update(-1, 25);
