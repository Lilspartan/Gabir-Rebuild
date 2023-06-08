import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import dbConnect from "../../../../utils/dbConnect";
import User from '../../../../database/models/user';

export default async (req, res) => {
    const account_id = req.query.id;
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in
        let _user = await User.findOneAndUpdate(
            { email: session.user.email },
            { 
                iracing_account_id: account_id,
                alerts: [ 
                    ...session.userData.alerts,
                    {
                        title: "Account Linking Successful",
                        type: "success",
                        text: "Your Gabir Motors account is now linked to your iRacing account!",
                        id: "successful-linking"
                    }
                ]
            }    
        );

        res.status(200).json({ session });
    } else {
        // Not Signed in
        res.status(401)
    }
    res.end()
  }