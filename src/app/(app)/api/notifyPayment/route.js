import { NextRequest } from "next/server";
import mercadopago from "mercadopago";

mercadopago.configure({
		access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export async function POST(req, res) {
	
	const searchParams = req.nextUrl.searchParams;
	const topic = searchParams.get('topic') || searchParams.get('type');
	const orderId = searchParams.get('orderId');
	let merchantOrder;

	try {
		switch (topic){
			case "payment":
				console.log('payment');
				const paymentId = searchParams.get('id');
				let payment = await mercadopago.payment.findById(Number(paymentId));
				merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
			break;

			case "merchant_order":
				console.log('order');
				const orderId = searchParams.get('id');
				 merchantOrder = await mercadopago.merchant_orders.findById(Number(orderId));				

			break;

			default:
				return new Response('notificacion no interesante');
			break;
		}

		var paidAmount = 0;
		merchantOrder.body.payments.forEach(async payment => {

			if(payment.status === 'approved'){
				paidAmount+= payment.transaction_amount;
			}

			console.log('payment id:',payment.id);
			const existingPayment = await prisma.payment.findMany({
				where:{
					mercadopago_payment_id: payment.id,
				}
			})
			if(!existingPayment.length){

				const insertPayment = await prisma.payment.create({
					data: {
						id_order: Number(orderId),
						date: payment.date_created,
						status: payment.status,
						amount: payment.transaction_amount,
						currency_id: payment.currency_id,
						mercadopago_payment_id: payment.id,
					},
				})
			} else {
				console.log('hay pago con ese id');
			}
			
		});

		if(paidAmount >= merchantOrder.body.total_amount){
			console.log("entre");
			
			const updateOrder = await prisma.order.update({
				where: {
					id: Number(orderId),
				},
				data: {
					status: 'approved',
				},
			  })


			let queryUpdate = {
				where :{
					id: {
						id_user: updateOrder.id_user,
						id_book: updateOrder.id_book,
					}
				},
				update:{
					bought: true,
					id_order: updateOrder.id,
				},
				create:{
					bought: true,
					id_order: updateOrder.id,
					id_user: updateOrder.id_user,
					id_book: updateOrder.id_book,
				},
			}

			console.log(queryUpdate);
			
			const followedBook = await prisma.followedBook.upsert(queryUpdate);

			console.log('uoop');

			console.log('followedBook',followedBook);

			
	
		} else {
			console.log("no entre");
		}
	 
		return new Response('ok', {status: 200});
		
	} catch (error) {
		return new Response(error);
	}
};