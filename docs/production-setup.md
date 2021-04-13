# Setting up UnderBudget in a production environment

The two primary components of UnderBudget--the Flask backend API and the React
frontend webapp--have no authentication or security measures built into them. By
design, security is provided by a gateway or routing service. This allows for
integration with other single sign-on (SSO) schemes.

This document will describe setting up UnderBudget as a standalone application.
That is, there are no other self-hosted applications or SSO schemes with which
to integrate. We will be using docker-compose with the `docker-compose.yml` file
at the root of this repository.

## Domain and SSL

We are going to set up UnderBudget with the SWAG (Secure Web Application Gateway)
image from [linuxserver.io](https://docs.linuxserver.io/images/docker-swag).
This will give us a reverse proxy to our services and automatically generate
SSL certificates from Let's Encrypt.

In order to obtain an SSL certificate, you must have a domain name that you will
use to access UnderBudget (e.g., `https://underbudget.mycooldomain.com`).

The `docker-compose.yml` file defines a service running the `linuxserver/swag`
image. You must provide a `.proxy.env` file to define environment variables
to [configure the SWAG image](https://docs.linuxserver.io/images/docker-swag#environment-variables-e).

For example, the following `.proxy.env` configures SWAG to use cloudflare
DNS validation to generate the SSL certificate.

```
PUID=1000
PGID=1000
TZ=America/New_York
URL=mycooldomain.com
SUBDOMAINS=wildcard
VALIDATION=dns
DNSPLUGIN=cloudflare
```

The SWAG container will mount the `./proxy` directory into `/config`.
This directory is initially very sparse, but the SWAG container will
fully populate it the first time you run it. In our example, we must
create a `./proxy/dns-conf/cloudflare.ini` file with the appropriate
credentials to allow the container to authenticate with cloudflare.

```
# Instructions: https://github.com/certbot/certbot/blob/master/certbot-dns-cloudflare/certbot_dns_cloudflare/__init__.py#L20
# Replace with your values

# With global api key:
dns_cloudflare_email = me@email.com
dns_cloudflare_api_key = 0123456789abcdef0123456789abcdef01234567

# With token (comment out both lines above and uncomment below):
#dns_cloudflare_api_token = 0123456789abcdef0123456789abcdef01234567
```

When you bring up the container (i.e., `docker-compose up`), you should notice 
the following output:

```
underbudget-proxy | Requesting a certificate for *.mycooldomain.com and mycooldomain.com
underbudget-proxy | Performing the following challenges:
underbudget-proxy | dns-01 challenge for mycooldomain.com
underbudget-proxy | dns-01 challenge for mycooldomain.com
underbudget-proxy | Unsafe permissions on credentials configuration file: /config/dns-conf/cloudflare.ini
underbudget-proxy | Waiting 10 seconds for DNS changes to propagate
underbudget-proxy | Waiting for verification...
underbudget-proxy | Cleaning up challenges
underbudget-proxy | IMPORTANT NOTES:
underbudget-proxy |  - Congratulations! Your certificate and chain have been saved at:
underbudget-proxy |    /etc/letsencrypt/live/mycooldomain.com/fullchain.pem
underbudget-proxy |    Your key file has been saved at:
underbudget-proxy |    /etc/letsencrypt/live/mycooldomain.com/privkey.pem
```

## Authelia

## Database backups