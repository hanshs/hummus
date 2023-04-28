import { nextApiHandler } from '@hummus/api';

export default nextApiHandler;

// to enable cors
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Enable cors
//   await cors(req, res);

//   // Let the tRPC handler do its magic
//   return nextApiHandler(req, res);
// };

// export default handler;
