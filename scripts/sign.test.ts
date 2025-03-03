import { signCookie, verifyCookie } from "./sign";

describe("Test sign and verify cookie", () => {
	const secret = "itsVeryVeryVeryLongSecretKey秘密キーsecret2@&";

	it("should verify signed cookies correctly", () => {
		const value = "123456特殊な文字test2@é";

		const signed = signCookie(value, secret);
		const verified = verifyCookie(signed, secret);
		expect({
			signed,
			verified,
		}).toMatchSnapshot();
	});

	it("should handle invalid signature", () => {
		const value = "invalid.signature.signed";

		const result = verifyCookie(value, secret);
		expect({
			result,
		}).toMatchSnapshot();
	});

	it("should handle incomplete signature", () => {
		const value = "incomplete.signed";

		const result = verifyCookie(value, secret);
		expect({
			result,
		}).toMatchSnapshot();
	});

	it("should handle empty value", () => {
		const value = "";

		const result = verifyCookie(value, secret);
		expect({
			result,
		}).toMatchSnapshot();
	});

	it("should handle no dots", () => {
		const value = "no.dots.here";

		const result = verifyCookie(value, secret);
		expect({
			result,
		}).toMatchSnapshot();
	});
});
