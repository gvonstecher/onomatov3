import { getAuthSession } from "@/utils/auth";
import { NextResponse } from 'next/server';
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(req){
    const session = await getAuthSession();
    if(!session){
        return NextResponse.json({ error: 'Not Authorized' },{ status: 401 })
    }

    const payload = await getPayload({ config });
    const data = await req.json();

    const order = await payload.create({
        collection: "orders",
        data: {
            status: 'pending',
            user: session.user.id,
            book: data.bookId,
            price: data.price,
            currencyId: 'ARS',
        },
    });

    if (data.suscribeAuthor) {
        await payload.create({
            collection: "followed-authors",
            data: { user: session.user.id, author: data.authorId },
        });
    }

    // Upsert the followed-book (bought: false) so it exists before payment.
    const existing = await payload.find({
        collection: "followed-books",
        where: { user: { equals: session.user.id }, book: { equals: data.bookId } },
        limit: 1,
    });
    if (!existing.docs[0]) {
        await payload.create({
            collection: "followed-books",
            data: { user: session.user.id, book: data.bookId, bought: false },
        });
    }

    return NextResponse.json(order);
}
