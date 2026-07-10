import mercadopago from "mercadopago";
import { getPayload } from "payload";
import config from "@payload-config";

mercadopago.configure({
	access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export async function POST(req) {

	const searchParams = req.nextUrl.searchParams;
	const topic = searchParams.get('topic') || searchParams.get('type');
	const orderId = searchParams.get('orderId');
	let merchantOrder;

	try {
		const payload = await getPayload({ config });

		switch (topic) {
			case "payment": {
				const paymentId = searchParams.get('id');
				const payment = await mercadopago.payment.findById(Number(paymentId));
				merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
				break;
			}
			case "merchant_order": {
				const mid = searchParams.get('id');
				merchantOrder = await mercadopago.merchant_orders.findById(Number(mid));
				break;
			}
			default:
				return new Response('notificacion no interesante');
		}

		let paidAmount = 0;
		for (const payment of merchantOrder.body.payments) {
			if (payment.status === 'approved') {
				paidAmount += payment.transaction_amount;
			}

			const existing = await payload.find({
				collection: "payments",
				where: { mercadopagoPaymentId: { equals: String(payment.id) } },
				limit: 1,
			});
			if (!existing.docs.length) {
				await payload.create({
					collection: "payments",
					data: {
						order: Number(orderId),
						date: payment.date_created,
						status: payment.status,
						amount: payment.transaction_amount,
						currencyId: payment.currency_id,
						mercadopagoPaymentId: String(payment.id),
					},
				});
			}
		}

		if (paidAmount >= merchantOrder.body.total_amount) {
			const updateOrder = await payload.update({
				collection: "orders",
				id: Number(orderId),
				data: { status: 'paid' },
			});

			// Mark the buyer's followed-book as bought (upsert).
			const fb = await payload.find({
				collection: "followed-books",
				where: { user: { equals: updateOrder.user }, book: { equals: updateOrder.book } },
				limit: 1,
			});
			if (fb.docs[0]) {
				await payload.update({
					collection: "followed-books",
					id: fb.docs[0].id,
					data: { bought: true, order: updateOrder.id },
				});
			} else {
				await payload.create({
					collection: "followed-books",
					data: { user: updateOrder.user, book: updateOrder.book, bought: true, order: updateOrder.id },
				});
			}
		}

		return new Response('ok', { status: 200 });

	} catch (error) {
		return new Response(String(error), { status: 500 });
	}
}
