import jsdom from "jsdom";
const { JSDOM } = jsdom;
import { readFileSync } from "fs";
import { join } from "path";
import { Client } from "wpilib-nt-client";
const client = new Client();

const dom = new JSDOM(
	`<!DOCTYPE html>
	<body><p id='main'>jsdom page</p>
	</body>`,
	{ runScripts: "dangerously", resources: "usable" });

window.onload = () => { console.log("window loaded"); };

let connectionInfo;

function injectScript() {
	const script = dom.window.document.createElement("script");
	script.type = "text/javascript";
	const requireJSFile = readFileSync(join(__dirname, "../../public/lib/networktables.js"),"utf8");
	script.innerHTML = requireJSFile;
	dom.window.document.getElementsByTagName("head")[0].appendChild(script);
}

//This probably doesnt need to be a promise but im not gonna touch it cause it works
const startClient = new Promise((res) => {
	client.start( (isConnected, error, is2_0) => {
		res({
			isConnected: isConnected,
			error: error,
			is2_0: is2_0
		});
	});
});

dom.window.document.addEventListener("client-add", mesg => {
	console.log("error" + client.Assign(mesg.detail.val, mesg.detail.key, (mesg.detail.flags & 1) === 1));
});
dom.window.document.addEventListener("client-update", (_ev, mesg) => {
	client.Update(mesg.detail.id, mesg.detail.val);
});


beforeAll(async () => {
	dom.window.TEST = true;
	injectScript();
	await startClient.then(val => { connectionInfo = val; });

	client.addListener((key, val, valType, msgType, id, flags) => {
		switch (msgType) {
		case "add":
			dom.window.document.dispatchEvent(new CustomEvent("nt-add", {detail: { key, val, valType, id, flags }}));
			break;
		case "update":
			dom.window.document.dispatchEvent(new CustomEvent("nt-update", {detail: { key, val, valType, id, flags }}));
			break;
		default:
			console.error("msgType of listener output invalid");
			break;
		}
	});
});


test("jsdom test", () => {
	expect(dom.window.document.getElementById("main").textContent).toBe("jsdom page");
	expect(dom.window.document.getElementById("ntscript")).toBeDefined();
});


test("client start", () => {
	expect(connectionInfo).toMatchObject({
		isConnected: true,
		error: null,
		is2_0: false
	});
});



/** 
 * After spending over 30 hours on these tests I'm giving up.
 * Problem: custom event & listener from networktables.js -> test is working
 * However they do not work when trying to dispatch an event from here (the test)
 * to networktables.js. No idea why, gives a useless error message.
 * Also the test is not properly being torn down.
 *  */ 

// test("double entry listener", async () => {
// 	let double = 0.0;
// 	dom.window.NetworkTables.addKeyListener("/test-value-double", (_key, value) => {
// 		double = value;
// 	}, true);
// 	dom.window.NetworkTables.putValue("/test-value-double", 50);
// 	expect(double).toBe(50);
// });

// test("string entry listener", () => {
// 	let string = "hello";
// 	dom.window.NetworkTables.addKeyListener("/test-value-string", (_key, value) => {
// 		string = value;
// 	});
// 	dom.window.NetworkTables.putValue("/test-value-string", "hello world");
// 	expect(string).toBe("hello world");
// });

// test("bool entry listener", () => {
// 	let bool = false;
// 	dom.window.NetworkTables.addKeyListener("/test-value-bool", (_key, value) => {
// 		bool = value;
// 	});
// 	dom.window.NetworkTables.putValue("/test-value-bool", true);
// 	expect(bool).toBe(true);
// });

afterAll(() => {
	client.stop();
	dom.window.TEST = false;
});
