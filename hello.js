import http from 'k6/http';
import { check, sleep } from 'k6';

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
    return {
        'summary.html': htmlReport(data),
    };
}

export default () => {
    const res = http.get('http://localhost:3333');

    check(res, {
        'status code === 200': (res) => res.status === 200,
    });

    sleep(1);
};
