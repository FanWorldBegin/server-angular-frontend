// 后台返回的接口结构

import { Server } from "./server";

export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    // 返回时可选的
    data: { servers?: Server[], server?: Server}

}