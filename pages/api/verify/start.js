import fetch from "node-fetch";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_SECRET = process.env.AUTH0_SECRET;
const TEMPLATE_ID = process.env.TEMPLATE_ID;
const VDCS_BEARER = process.env.VDCS_BEARER;

if (!AUTH0_DOMAIN) throw new Error("AUTH0_DOMAIN not set");
if (!AUTH0_CLIENT_ID) throw new Error("AUTH0_CLIENT_ID not set");
if (!AUTH0_SECRET) throw new Error("AUTH0_SECRET not set");
if (!TEMPLATE_ID) throw new Error("TEMPLATE_ID not set");
if (!VDCS_BEARER) throw new Error("VDCS_BEARER not set");

export default async function handler(req, res) {
    try {
        const result = await run();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}


async function run() {
    const result = await fetch(`https://${AUTH0_DOMAIN}/vdcs/verification`, {
        method: "post",
        headers: {
            "authorization": `bearer ${VDCS_BEARER}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            template_id: TEMPLATE_ID,
            protocol: "mdoc/webapi/v1.0",
        }),
    })

    const { verificationId, engagement } = await result.json();

    // the url is the "QR Code" that a wallet would scan
    return {verificationId, engagement };
}