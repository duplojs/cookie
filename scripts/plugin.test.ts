import { Duplo, OkHttpResponse, useBuilder, zod, Request } from "@duplojs/core";
import { cookiePlugin } from "./plugin";
import { Algorithm } from "./sign";
import { parseCookies } from "./actions";

describe("plugin", () => {
	it("should be implemente cookie plugin in duplo", () => {
		const duplo = new Duplo({
			environment: "TEST",
			plugins: [cookiePlugin()],
		});

		expect(duplo.config.plugins).toMatchSnapshot();
	});

	it("should be implemente cookie plugin in duplo with options", () => {
		const duplo = new Duplo({
			environment: "TEST",
			plugins: [
				cookiePlugin({
					secret: "secret",
					algorithm: Algorithm.SHA256,
				}),
			],
		});

		expect(duplo.config.plugins).toMatchSnapshot();
	});

	it("test make route with cookie plugin", () => {
		const duplo = new Duplo({
			environment: "TEST",
			plugins: [cookiePlugin()],
		});

		const route = useBuilder()
			.createRoute("GET", "/test")
			.extract({
				cookies: {
					test: zod.string(),
				},
			})
			.handler((pickup) => {
				const test = pickup("test");
				return new OkHttpResponse("ok", test);
			});

		expect(route).toMatchSnapshot();

		duplo.register(route);

		expect(duplo).toMatchSnapshot();
	});

	it("test drop cookie in response", () => {
		const duplo = new Duplo({
			environment: "TEST",
			plugins: [cookiePlugin()],
		});

		const response = new OkHttpResponse("ok", "test")
			.setCookie("test", "test")
			.dropCookie("test");

		expect(response).toMatchSnapshot();
	});
});
