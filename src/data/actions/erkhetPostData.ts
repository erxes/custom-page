import { sendRPCMessage } from '../../messageBroker';
import { IShapeDocument } from '../../models/definitions/Automations';
// import { sendRequest } from './utils';

const erkhetPostData = async (shape: IShapeDocument, data: any, result: object) => {
  if (!shape.config.url) {
    return result;
  }

  // const url = shape.config.url;
  // const params = {
  // kind: shape.config.apiToken,
  // is_json: True
  // };
  const orderInfos = [
    {
      date: new Date().toISOString().slice(0, 10),
      orderId: data.deal._id,
      hasVat: true,
      hasCitytax: true,
      cashAmount: 1000,
      details: [
        {
          count: 1,
          amount: 1000,
          inventoryCode: '200301001',
        },
      ],
    },
  ];

  const postData = {
    userEmail: shape.config.userEmail,
    token: shape.config.apiToken,
    apiKey: shape.config.apiKey,
    apiSecret: shape.config.apiSecret,
    orderInfos: JSON.stringify(orderInfos),
  };

  const response = await sendRPCMessage({
    action: 'get-response-send-order-info',
    data: postData,
  });

  return response;
};

export default erkhetPostData;
