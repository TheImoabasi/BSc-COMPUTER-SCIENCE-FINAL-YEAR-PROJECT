# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

For the data, the publicly available OULAD dataset was used for this project's purpose.

A performance test was conducted to evaluate the system's performance when the working algorithm for the system's prediction model is Random Forest. The results were as follows:

============================================================
  PERFORMANCE EVALUATION COMPLETE
============================================================

Test 1 — Prediction + SHAP latency
min	max	avg	p95
Risk Profile				
High Risk	497.62	2295.82	799.26	2295.82
Medium Risk	415.43	893.85	514.15	893.85
Low Risk	396.63	770.64	493.05	770.64

Test 2 — Batch throughput
requested_size	students_tested	time_s	rate_students_per_s
0	10	10	6.1510	1.63
1	50	50	25.6610	1.95
2	100	100	55.0888	1.82
3	250	250	144.5125	1.73
4	500	500	342.3465	1.46

Test 3 — API response time
min	max	avg	p95	status_codes
Endpoint					
GET /api/v1/dashboard	12.8	1801.44	198.99	1801.44	200
GET /api/v1/students	84.2	331.27	145.23	331.27	200
GET /api/v1/alerts	26.74	104.4	44.58	104.4	200
GET /api/v1/model/info	8.27	15.72	11.35	15.72	200

Test 4 — Database performance
avg_ms	min_ms	max_ms
Query			
COUNT all predictions	0.240	0.107	1.346
Risk distribution	0.691	0.436	1.553
Top 50 high risk (Alerts)	8.096	1.005	61.833
Students JOIN Predictions	4.445	1.814	10.629

Test 5 — Memory usage
Measurement	Memory (MB)
0	Memory before loading model	135.6
1	Memory after loading model	185.3
2	Model memory footprint	49.7
