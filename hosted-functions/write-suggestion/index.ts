// https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node

export interface Doc {
  id: string;
  name: string;
  employeeId: number;
  address: string;
}

export interface Bindings {
  suggestionDocument: Doc;
}

export interface Context {
  log(...message: any[]): void;
  done(): void;
  bindings: Bindings;
  res: Response;
}

export interface Request {
  method: "GET" | "POST";
  body: Doc;
  query: any;
}

export interface Response {
  status: number;
  body: any;
}


// module.exports = function (context, req) {
//   var statusCode = 400;
//   var responseBody = "Invalid request object";

//   if (typeof req.body != 'undefined' && typeof req.body == 'object') {
//       statusCode = 201;
//       context.bindings.outTable = req.body;
//       responseBody = "Table Storage Created";
//   }

//   context.res = {
//       status: statusCode,
//       body: responseBody
//   };

//   context.done();
// };


export default (context: Context, req: Request) => {
  let statusCode = 400;
  let responseBody = '?';
  if (req.method === "POST") {
    if (req.body) {
      statusCode = 201;
      context.bindings.suggestionDocument = req.body;
      responseBody = 'Document created';
    }
  }
  context.res = {
    status: statusCode,
    body: responseBody
  }
  context.done();
};
