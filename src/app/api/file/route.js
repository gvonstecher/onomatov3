import { writeFile } from 'fs/promises'
import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/auth";
import prisma from "@/utils/connect";
import hash from 'object-hash'
import fs from 'fs';

export async function POST(req){

    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({ error: 'Not Authorized' },{ status: 401 })
    }

    const formData = await req.formData();
    const file = formData.get('file');
    console.log("form data", file);
    
    if (!file) {
        return NextResponse.json({ success: false })
    }

    var split = file.name.split('.');
    var filename = split[0];
    var extension = split[1];


    const newFilename = hash(filename)+'.'+extension;
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const path = `img/tmp/`
    const filePath = path + newFilename;
    await writeFile(filePath, buffer)
    console.log(`open ${filePath} to see the uploaded file`)

    const imagen = sharp(buffer);
    const metadata = await imagen.metadata();
    
    const result = await prisma.file.create({
        data: {
            name: file.name,
            hash: newFilename,
            path: path,
            type: file.type,
            size: file.size,
            width: metadata.width,
            height: metadata.height,
            created_at: new Date(),
            created_by: session.user.id
        }
    })
    return NextResponse.json(result);

}

export async function DELETE(req){
    const body = await req.json();

   const result = await prisma.file.delete({
        where: {
            id: body.id
        }
    })
    console.log(result);

    if (fs.existsSync(result.path)) {
        fs.unlinkSync(result.path);
        return NextResponse.json({ error: 'Archivo eliminado' },{ status: 200 })
      } else {
        return NextResponse.json({ error: 'Error' })
      }
}
