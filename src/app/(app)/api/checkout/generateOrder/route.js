import { getAuthSession } from "@/utils/auth";
import { NextResponse } from 'next/server';
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(req) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json({ error: 'Not Authorized' }, { status: 401 });
    }

    const payload = await getPayload({ config });
    const data = await req.json();

    // Price and split are computed server-side (never trust the client). Money
    // is in cents. platformFee = commission%; authorAmount goes to the owner.
    const book = await payload.findByID({ collection: "books", id: data.bookId, depth: 0 });
    const gross = book?.price || 0;
    const settings = await payload.findGlobal({ slug: "payment-settings" });
    const pct = settings?.commissionPercent ?? 15;
    const platformFee = Math.round((gross * pct) / 100);
    const authorAmount = gross - platformFee;

    const order = await payload.create({
        collection: "orders",
        data: {
            status: 'pending',
            user: session.user.id,
            book: book.id,
            grossAmount: gross,
            platformFee,
            authorAmount,
            currencyId: 'ARS',
            provider: data.provider || 'mercadopago',
        },
    });

    if (data.suscribeAuthor && data.authorId) {
        // Follow is a wishlist relation, independent of ownership. Guarded by
        // the (user, author) unique index, so ignore a duplicate.
        try {
            await payload.create({
                collection: "followed-authors",
                data: { user: session.user.id, author: data.authorId },
            });
        } catch (err) {
            payload.logger.error(`generateOrder: follow author skipped: ${err}`);
        }
    }

    return NextResponse.json(order);
}
