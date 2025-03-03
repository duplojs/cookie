import crypto from "crypto";

export enum Algorithm {
	SHA256 = "sha256",
	SHA512 = "sha512",
	MD5 = "MD5",
	SHA1 = "sha1",
}

export function signCookie(value: string, secret: string, algorithm = Algorithm.SHA256) {
	const hmac = crypto.createHmac(
		algorithm,
		secret,
	);
	hmac.update(value);
	return `${value}.${hmac.digest("hex")}.signed`;
}

export function verifyCookie(signValue: string, secret: string, algorithm = Algorithm.SHA256) {
	const [value, hash, signed] = signValue.split(".");

	if (!value || !hash || signed !== "signed") {
		return null;
	}

	const expectSign = crypto.createHmac(
		algorithm || Algorithm.SHA256,
		secret,
	)
		.update(value)
		.digest("hex");

	if (hash.length !== expectSign.length) {
		return null;
	}

	if (crypto.timingSafeEqual(
		new Uint8Array(Buffer.from(hash)),
		new Uint8Array(Buffer.from(expectSign)),
	)) {
		return value;
	}

	return null;
}
