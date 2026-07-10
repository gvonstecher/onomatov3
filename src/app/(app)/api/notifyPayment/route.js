import mercadopago from "mercadopago";
import { getPayload } from "payload";
import config from "@payload-config";

mercadopago.configure({
	access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// Map MercadoPago payment statuses onto our provider-agnostic enum.
const mapStatus = (s) =>
	({ approved: 'approved', pending: 'pending', in_process: 'pending', authorized: 'pending', rejected: 'rejected', cancelled: 'rejected', refunded: 'refunded', charged_back: 'refunded' }[s] || 'pending');

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
				where: { providerPaymentId: { equals: String(payment.id) } },
				limit: 1,
			});
			if (!existing.docs.length) {
				await payload.create({
					collection: "payments",
					data: {
						order: Number(orderId),
						provider: "mercadopago",
						providerPaymentId: String(payment.id),
						amount: Math.round(payment.transaction_amount * 100), // -> cents
						currencyId: payment.currency_id,
						status: mapStatus(payment.status),
						date: payment.date_created,
					},
				});
			}
		}

		if (paidAmount >= merchantOrder.body.total_amount) {
			// Ownership is derived from the paid order — no followed-book flag.
			await payload.update({
				collection: "orders",
				id: Number(orderId),
				data: { status: 'paid' },
			});
		}

		return new Response('ok', { status: 200 });

	} catch (error) {
		return new Response(String(error), { status: 500 });
	}
}
