import { NextApiHandler } from "next";
import { checkSubscription } from "./_lib/manageSubscriotions";

const subscribe: NextApiHandler = async (req, res) => {

  const methodNotAllowed = req.method !== 'GET'

  if (methodNotAllowed) {
    return res.status(205).send('Method not allowed')
  }

  const { email } = req.query

  const subscribed = await checkSubscription(email as string)

  return res.status(200).json({ subscribed })

}

export default subscribe