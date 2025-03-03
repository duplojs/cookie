import {
	Request,
	Response,
	type Duplo,
	type CurrentRequestObject,
} from "@duplojs/core";
import { type SerializeOptions } from "cookie";
import { type CookieOptions, serializeCookies, parseCookies } from "./actions";

declare module "@duplojs/core" {
	interface Request {
		cookies: Record<string, string | undefined>;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface Response<Code, Information, Body> {
		cookie: Record<
			string,
			{
				value: string;
				params?: SerializeOptions;
			}
		>;
		setCookie(name: string, value: string, params?: SerializeOptions): this;
		dropCookie(name: string): this;
	}
}

Request.prototype.cookies = {};

Response.prototype.cookie = {};

Response.prototype.setCookie = function(name, value, params) {
	this.cookie[name] = {
		value,
		params,
	};
	return this;
};

Response.prototype.dropCookie = function(name) {
	this.cookie[name] = {
		value: "",
		params: {},
	};
	return this;
};

export function duploCookie(
	instance: Duplo,
	options: CookieOptions = {},
) {
	instance.hook("beforeRouteExecution", (req: CurrentRequestObject) => {
		parseCookies(req, options);
	});

	instance.hook("beforeSend", (req, res: Response<any, any, any>) => {
		serializeCookies(res, options);
	});
}

export function cookiePlugin(options?: CookieOptions) {
	return function(duplo: Duplo) {
		duploCookie(duplo, options);
	};
}
