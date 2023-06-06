
import IracingAPI from "iracing-api";

const client = new IracingAPI();

export default async function handler(req, res) {
    await client.login("gabekrahulik@gmail.com", process.env.PASSWORD);

    let data = await client.getMemberProfile ({ customerId: req.query.account_id });

    res.status(200).json(data);
}