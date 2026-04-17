# eppsheating.com

Static marketing site for Epp’s Custom Heating & Air with a Vercel serverless endpoint for online service requests.

## Service request form

The online request page lives at `service-request.html` and submits to `/api/service-request`.

Required Vercel environment variables:

- `RESEND_API_KEY`

Optional environment variables:

- `SERVICE_REQUEST_TO`
- `SERVICE_REQUEST_FROM` (defaults to `Epp's Heating <onboarding@resend.dev>`)

## Local install

Install the serverless dependency before deploying or testing the API:

```bash
npm install
```
