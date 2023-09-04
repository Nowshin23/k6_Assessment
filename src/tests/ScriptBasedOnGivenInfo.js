import http from 'k6/http';
import {sleep, check} from 'k6';
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    thresholds: {
        "http_req_duration": ['p(95)< 5000'],
        "http_req_failed": ['rate < 0.05'],
        "http_reqs": ['rate > 25']
    },
    scenarios: {
        Script_based_on_info: {
            executor: "ramping-vus",
            startVUs: 30,
            stages: [
                //{duration: '1s', target: 30},
                {duration: '2m', target: 30},
                {duration: '0s', target: 0}
            ],
            gracefulRampDown: '2m'
        }
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
        "summary1.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}