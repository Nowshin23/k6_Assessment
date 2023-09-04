import http from 'k6/http';
import {sleep, check} from 'k6';
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    thresholds: {
        "http_req_duration": ['p(95)< 3000'],
        "http_req_failed": ['rate < 0.01']
    },
    scenarios: {
        Script_for_the_stress_test: {
            executor: "constant-vus",
            vus: 200,
            duration: "10s"
        },
    }
}

export default function () {
    const baseUrl = "http://103.95.98.138:5030/";
    const endPoint = "admin/terms-conditions";

    const res = http.get(`${baseUrl}${endPoint}`);

    check(res, {'is status 200': (r) => r.status === 200});

    sleep(1);
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}