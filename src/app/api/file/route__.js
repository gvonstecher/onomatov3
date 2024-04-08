
import bcrypt from 'bcrypt';

import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from 'next/server';

import prisma from "@/utils/connect";
import { authOptions } from "@/utils/auth";

import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

  export async function POST(req){
    const form = new formidable.IncomingForm();

    form.parse(req, async function (err, fields, files) {
      const data = fs.readFileSync(files.file.path);
      fs.writeFileSync(`./public/img/tmp/${files.file.name}`, data);
      await fs.unlinkSync(files.file.path);
      return NextResponse.json({file:f.name}, { status: 200 });
    });

}




  /*
export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':{
            res.status(200);
        }
        
    }
};*/