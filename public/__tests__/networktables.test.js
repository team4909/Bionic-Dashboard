// const { _electron: electron } = require("playwright");
// const { test } = require("@playwright/test");

// global.NetworkTables = global.$ = require("../../public/lib/networktables");

// let electronApp;

// test.beforeAll(() => {
// 	electronApp = electron.launch({ args: ["./public/electron.js"] });
// 	console.log(electronApp.context());
// }); 



// test("double entry listener", () => {

// 	let double = 0;
// 	window.NetworkTables.addKeyListener("/test-value-double", (_key, value) => {
// 		double = value;
// 	});
// 	window.NetworkTables.putValue("/test-value-double", 50);
// 	test.expect(double).toBe(50);
// });

// test("string entry listener", () => {
// 	let string = "hello";
// 	window.NetworkTables.addKeyListener("/test-value-string", (_key, value) => {
// 		string = value;
// 	});
// 	window.NetworkTables.putValue("/test-value-string", "hello world");
// 	test.expect(string).toBe("hello world");
// });

// test("bool entry listener", () => {
// 	let bool = false;
// 	window.NetworkTables.addKeyListener("/test-value-bool", (_key, value) => {
// 		bool = value;
// 	});
// 	window.NetworkTables.putValue("/test-value-bool", true);
// 	test.expect(bool).toBe(true);
// });

// test.afterAll(() => {
// 	electronApp.close();
// });
