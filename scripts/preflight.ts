import { createProcess, type Request } from "@duplojs/core";
import { parseCookies, type CookieOptions } from "./actions";
import { Algorithm } from "./sign";

export interface CookiePreflithParams {
	options: CookieOptions;
}

const cookieOptionsSymbol = Symbol("cookieOptions");

export interface RequestCookies extends Request {
	cookies: Record<string, string | undefined>;
	[cookieOptionsSymbol]: CookieOptions;
}

const cookieProcess = createProcess<RequestCookies, CookiePreflithParams>(
	"cookie",
	{
		options: {},
	},
)
	.cut(
		({ pickup, dropper }, req) => {
			const options = pickup("options");

			parseCookies(req, options);

			return dropper(null);
		},
		[],
	)
	.exportation();

export {
	cookieProcess,
	Algorithm,
};
