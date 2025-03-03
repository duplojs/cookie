import { serializeCookies, parseCookies, verifyCookies } from "./actions";
import { Duplo, Response, Request } from "@duplojs/core";
import { cookiePlugin } from "./plugin";
import { Algorithm } from "./sign";

describe("actions", () => {
	const duplo = new Duplo({
		environment: "TEST",
		plugins: [cookiePlugin()],
	});

	const response = new Response(200, "ok", {})
		.setCookie("test", "test");

	const responseWithOptions = new Response(200, "ok", {})
		.setCookie("test", "test", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

	it("should be implemente serializeCookies", () => {
		serializeCookies(response, {});

		expect(response).toMatchSnapshot();
	});

	it("should be implemente serializeCookies with options", () => {
		serializeCookies(responseWithOptions, {});

		expect(responseWithOptions).toMatchSnapshot();
	});

	const request = new Request({
		method: "GET",
		url: "/test",
		host: "localhost",
		origin: "http://localhost",
		headers: {
			cookie: "test=test",
		},
		matchedPath: "/test",
		params: {},
		path: "/test",
		query: {},
	});

	it("should be implemente parseCookies", () => {
		parseCookies(request, {});

		expect(request.cookies).toMatchSnapshot();
	});
});

describe("actions with secret option", () => {
	const duplo = new Duplo({
		environment: "TEST",
		plugins: [
			cookiePlugin({
				secret: "secret",
				algorithm: Algorithm.SHA256,
			}),
		],
	});

	const responseWithSecret = new Response(200, "ok", {})
		.setCookie("test", "test");

	const responseWithOptionsWithSecret = new Response(200, "ok", {})
		.setCookie("test", "test", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

	it("should be implemente serializeCookies", () => {
		serializeCookies(responseWithSecret, {});

		expect(responseWithSecret).toMatchSnapshot();
	});

	it("should be implemente serializeCookies with options", () => {
		serializeCookies(responseWithOptionsWithSecret, {});

		expect(responseWithOptionsWithSecret).toMatchSnapshot();
	});

	const requestWithSignedCookies = new Request({
		method: "GET",
		url: "/test",
		host: "localhost",
		origin: "http://localhost",
		headers: {
			cookie: "test=test",
		},
		matchedPath: "/test",
		params: {},
		path: "/test",
		query: {},
	});

	it("should be implemente parseCookies", () => {
		parseCookies(requestWithSignedCookies, {
			secret: "secret",
		});

		expect(requestWithSignedCookies.cookies).toMatchSnapshot();
	});

	it("should be implemente verifyCookies", () => {
		const cookies = {
			test: "test",
			test2: undefined,
		};

		verifyCookies(cookies, "secret", Algorithm.SHA256);
	});
});
