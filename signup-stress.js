import http from "k6/http";
import { check, sleep } from "k6";

import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        "signup-stress.html": htmlReport(data),
    };
}

export const options = {
    stages: [
        { duration: "10m", target: 200 }, // aumento do tráfego de 1 para mais de 200 usuários em 10 minutos.
        { duration: "30m", target: 400 }, // fique com mais de 200 usuários por 30 minutos
        { duration: "5m", target: 0 }, // redução para 0 usuários
    ],
    thresholds: {
        http_req_duration: ["p(95)<2000"],
        http_req_failed: ["rate<0.01"], // margem de erro aceitável
    },
};

export default () => {
    const url = "http://localhost:3333/signup";

    const data = JSON.stringify({
        email: `${uuidv4().substring(24)}@qa.raphael.com`,
        password: "123",
    });

    const headers = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = http.post(url, data, headers);

    check(res, {
        "status code === 201": (res) => res.status === 201,
    });

    // console.log(res.body);

    sleep(1);
};
