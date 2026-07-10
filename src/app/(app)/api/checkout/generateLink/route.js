import mercadopago from "mercadopago";
import { getPayload } from "payload";
import config from "@payload-config";

mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const URL = process.env.BASE_FETCH_URL;

export async function POST(req) {
    const data = await req.json();
    try {
        const payload = await getPayload({ config });

        // Read the authoritative amounts/owner from the order (cents) + book.
        const order = await payload.findByID({ collection: "orders", id: data.orderId, depth: 0 });
        const bookId = typeof order.book === "object" ? order.book.id : order.book;
        const book = await payload.findByID({ collection: "books", id: bookId, depth: 2 });
        const owner = book?.owner;
        const mpAccount = (owner?.payoutAccounts || []).find((a) => a.provider === "mercadopago")?.accountId;

        const preference = {
            items: [
                {
                    title: data.title,
                    unit_price: (order.grossAmount || 0) / 100, // cents -> currency units
                    quantity: 1,
                    currency_id: order.currencyId || "ARS",
                },
            ],
            // Marketplace split: the platform keeps `marketplace_fee`; the rest
            // is collected by the seller (book owner) directly.
            // TODO: a real MP Marketplace split requires creating this preference
            // with the SELLER's OAuth access token (their connected MP account,
            // id `mpAccount`). That OAuth connect flow is not built yet, so this
            // runs against the platform token for now.
            marketplace_fee: (order.platformFee || 0) / 100,
            auto_return: "approved",
            back_urls: {
                success: `${URL}/${data.returnPath}`,
                failure: `${URL}/${data.returnPath}`,
            },
            notification_url: `${URL}/api/notifyPayment?orderId=${order.id}`,
            external_reference: String(order.id),
        };

        const response = await mercadopago.preferences.create(preference);

        await payload.update({
            collection: "orders",
            id: order.id,
            data: { provider: "mercadopago", providerReference: response.body.id },
        });

        return new Response(JSON.stringify({ url: response.body.init_point }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error", error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
