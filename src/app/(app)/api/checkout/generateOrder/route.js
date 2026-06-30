import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/auth";
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/connect";

export async function POST(req){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({ error: 'Not Authorized' },{ status: 401 })
    }

    const data = await req.json();
    console.log(data);

    const result = await prisma.order.create({
        data: {
            status: 'pending',
            id_user: session.user.id,
            id_book: data.bookId,
            created_at: new Date(),
            price: data.price,
            currency_id: 'ARS'
            
        }
    });

    if(data.suscribeAuthor){
        console.log('entre');
        const resultFollowed = await prisma.followedAuthor.create({
            data: {
                id_user: session.user.id,
                id_author: data.authorId    
            }
        });
    }

    const resultFollowedBook = await prisma.followedBook.upsert({
        where: {
            id: {
                id_user: session.user.id,
                id_book: data.bookId,
            }
        },
        create: {
            id_user: session.user.id,
            id_book: data.bookId,
            bought: false
        },
        update:{
        }
    });

    return NextResponse.json(result);
}