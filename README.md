# eppsheating.com

Static marketing site for Epp’s Custom Heating & Air with a Vercel serverless endpoint for online service requests.

## Service request form

The online request page lives at `service-request.html` and submits to `/api/service-request`.

Required Vercel environment variables:

- `SMTP_USER`
- `SMTP_PASSWORD`

Optional environment variables:

- `SMTP_FROM`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SERVICE_REQUEST_TO`

## Local install

Install the serverless dependency before deploying or testing the API:

```bash
npm install
```
