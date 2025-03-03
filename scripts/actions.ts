import {
	type Response,
	type CurrentRequestObject,
} from "@duplojs/core";
import cookie from "cookie";
import { Algorithm, signCookie, verifyCookie } from "./sign";

export interface CookieOptions {
	secret?: string;
	algorithm?: Algorithm;
}

export function serializeCookies(res: Response<any, any, any>, options: CookieOptions) {
	if (Object.keys(res.cookie).length !== 0) {
		res.setHeader(
			"Set-Cookie",
			Object.entries(res.cookie).map(
				([name, content]) => cookie.serialize(
					name,
					options.secret
						? signCookie(content.value, options.secret, options.algorithm)
						: content.value,
					{
						...content.params,
					},
				),
			),
		);
	}
}

export function parseCookies(req: CurrentRequestObject, options: CookieOptions) {
	if (req.headers.cookie) {
		const cookies = cookie.parse(
			req.headers.cookie instanceof Array
				? req.headers.cookie.join("; ")
				: req.headers.cookie,
		);
		if (options.secret) {
			req.cookies = verifyCookies(
				cookies,
				options.secret,
				options.algorithm,
			);
		} else {
			req.cookies = cookies;
		}
	}
}

export function verifyCookies(
	cookies: Record<string, string | undefined>,
	secret: string,
	algorithm = Algorithm.SHA256,
) {
	return Object.entries(cookies)
		.reduce<Record<string, string | undefined>>(
			(acc, [name, value]) => {
				if (value === undefined) {
					return {
						...acc,
						[name]: undefined,
					};
				}

				return {
					...acc,
					[name]: verifyCookie(value, secret, algorithm) ?? value,
				};
			},
			{},
		);
}
