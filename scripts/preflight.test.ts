import { Duplo } from "@duplojs/core";
import { cookieProcess, Algorithm } from "./preflight";
import { makeFakeRequest } from "../test/utils";

describe("Test preflight", async() => {
	const duplo = new Duplo({
		environment: "TEST",
	});

	duplo.register(cookieProcess);

	const buildedProcess = await cookieProcess.build();

	it("test build process", async() => {
		const result = await buildedProcess(
			makeFakeRequest({
				headers: {
					cookie: "test=cookie",
				},
			}),
			{},
			undefined,
		);

		expect(result).toMatchSnapshot();
	});

	it("test build process with options", async() => {
		const result = await buildedProcess(
			makeFakeRequest({
				headers: {
					cookie: "test=123456特殊な文字test2@é.5bcfea31e320c8efc941c94cbdbdf78ed69e74bd3e1214c4f2f19f5f33416769.signed",
				},
			}),
			{},
			{
				secret: "secret",
				algorithm: Algorithm.SHA256,
			},
		);

		expect(result).toMatchSnapshot();
	});
});
