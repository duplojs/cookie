import { Duplo, useBuilder, Response, zod } from "@duplojs/core";
import "@duplojs/node";
import { cookiePlugin } from "@duplojs/cookie";

describe("cookie plugin", () => {
	const duplo = new Duplo({
		environment: "TEST",
		host: "localhost",
		port: 14093,
		plugins: [cookiePlugin()],
	});

	it("should get and set cookie", async() => {
		const route = useBuilder()
			.createRoute("GET", "/test-cookie")
			.extract({
				cookies: {
					test: zod.string(),
				},
			})
			.handler(
				(pickup) => {
					const test = pickup("test");

					return new Response(200, "test", undefined)
						.setCookie("test", test);
				},
			);

		duplo.register(route);

		const server = await duplo.launch();

		const result = await fetch(
			"http://localhost:14093/test-cookie",
			{
				method: "GET",
				headers: {
					Cookie: "test=cookie",
				},
			},
		);

		expect(result.headers.get("Set-Cookie")).toMatchSnapshot();

		server.close();
	});
});
