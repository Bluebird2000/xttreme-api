import { onException } from "kaop-ts";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";

export const handleException = ():any => onException( meta => {
  let response = meta.args[1];
  sendResponse(new BasicResponse(Status.ERROR), response);
});

function sendResponse(serviceResponse: BasicResponse, responseObj): any {
  var clientResponse = {
    status: serviceResponse.getStatusString(),
    data: serviceResponse.getData()
  }

  responseObj.status(getHttpStatus(serviceResponse.getStatusString()));

  console.log('responding with', clientResponse);
  responseObj.json(clientResponse);
}



function getHttpStatus(status: string): number {
  switch (status) {
    case 'SUCCESS':
      return 200;
    case 'CREATED':
      return 201;
    case 'FAILED_VALIDATION':
      return 400;
    default:
      return 500;
  }
}