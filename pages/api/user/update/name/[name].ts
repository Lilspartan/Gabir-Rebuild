import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

import dbConnect from "../../../../../utils/dbConnect";
import User from '../../../../../database/models/user';

export default async (req, res) => {
    const new_name = req.query.name;
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in
        let _user = await User.findOneAndUpdate(
            { email: session.user.email },
            { name: new_name }    
        );

        res.status(200).json({ session });
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
  }