import { Duplo, useBuilder, Response, zod } from "@duplojs/core";
import { cookieProcess } from "@duplojs/cookie/preflight";
import "@duplojs/node";

describe("cookie preflight", () => {
	const duplo = new Duplo({
		environment: "TEST",
		host: "localhost",
		port: 14092,
	});

	it("should get cookie", async() => {
		const route = useBuilder()
			.preflight(
				cookieProcess,
				{
					options: {},
				},
			)
			.createRoute("GET", "/test-cookie")
			.extract({
				cookies: {
					test: zod.string(),
				},
			})
			.handler(
				(pickup) => {
					const test = pickup("test");

					return new Response(200, "test", test);
				},
			);

		duplo.register(cookieProcess);
		duplo.register(route);

		const server = await duplo.launch();

		const result = await fetch(
			"http://localhost:14092/test-cookie",
			{
				method: "GET",
				headers: {
					Cookie: "test=cookie",
				},
			},
		);

		expect(await result.text()).toMatchSnapshot();

		server.close();
	});
});
