import mercadopago from "mercadopago";
import { NextRequest } from "next/server";
import { bool } from "sharp";

// A fines del tutorial pongo un token de muestra, pero siempre esta información se tiene que manejar
// como variable de entorno en un archivo .env

mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const URL = process.env.BASE_FETCH_URL;

// En "items" se puede usar directamente el producto, a fines de prueba tambien se puede hardcodear y poner valores
// hasta 5 como minimo.

export async function POST(req, res) {
    const data = await req.json();
    try {
        const preference = {
            items: [
                {
                    title: data.title,
                    unit_price: parseInt(data.price),
                    //unit_price: parseInt(1000),
                    quantity: 1,
                    currency_id: "ARS",
                },
            ],
            auto_return: "approved",
            back_urls: {
                success: `${URL}/${data.returnPath}`,
                failure: `${URL}/${data.returnPath}`,
            },
            notification_url: `${URL}/api/notifyPayment?orderId=${data.orderId}`,
			external_reference: String(data.orderId)
        };

        const response = await mercadopago.preferences.create(preference);
        console.log(response);

        const result = await prisma.order.update({
            where:{
                id: data.orderId
            },
            data:{
               mercadopago_id: response.body.id
            }
        })

        return new Response(JSON.stringify({ url: response.body.init_point }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
