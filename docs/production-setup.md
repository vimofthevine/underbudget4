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

Since we will only be using the `underbudget` subdomain, it will be necessary
for you to register a CNAME DNS record for the `underbudget` subdomain pointing
to your host.

## Security

In our standalone production setup, we will be using
[Authelia](https://www.authelia.com/) for authentication. Since the SWAG
container runs an instance of nginx, we use
[these instructions](https://www.authelia.com/docs/deployment/supported-proxies/nginx.html)
when integrating Authelia into our reverse proxy.

SWAG provides most of the necessary configuration for Authelia out of the box.
This repository even includes the
`proxy/nginx/proxy-confs/underbudget.subdomain.conf` configuration file for
the `underbudget` subdomain with the necessary configuration to integrate
with Authelia.

With the proxy fully configured, we move on to setting up Authelia itself.

The `docker-compose.yml` file defines a service running the `authelia/authelia`
image. You may provide a `.auth.env` file to define environment variables
for the container. Authelia does not rely on environment variables, so the
only variables we've set are to control the ownership of files created by
the image.

```
PUID=1000
PGID=1000
```

The Authelia container will mount the `./authelia` directory into `/config`.
This is where all Authelia configuration and data will reside.

You must provide a `configuration.yml` file in the `./authelia` directory
according to the [Authelia documentation](https://www.authelia.com/docs/configuration/).

A sample configuration file has been provided that uses an internal user
database. To use this sample file, rename it to `configuration.yml` and change
all instances of `mycooldomain.com` to the appropriate domain name.

Since we are using a flat file user database, we will follow
[these instructions](https://www.authelia.com/docs/configuration/authentication/file.html)
for defining users in `./authelia/users_database.yml` (because that is the location
specified in the sample configuration).

To create a hashed password, run the following:

```
?> docker run --rm authelia/authelia:latest authelia hash-password "yourpassword"
Password hash: $argon2id$v=19$m=1048576,t=1,p=8$aVZ0T2JCbXBmYmMwYWFEdg$QBaGSDnp+BQXgvZ50HwVzkJZazQnIV774b3pLPBTsFU
```

Example `users_database.yml`:

```
users:
  james:
    displayname: "James Dean"
    password "$argon2id$v=19$m=1048576,t=1,p=8$aVZ0T2JCbXBmYmMwYWFEdg$QBaGSDnp+BQXgvZ50HwVzkJZazQnIV774b3pLPBTsFU"
    email: james.dean@authelia.com
```

## Database

UnderBudget uses a PostgreSQL database. The `docker-compose.yml` file defines
a database service running the `postgres` image. It uses a docker volume to
store the actual database content.

Both the database service and the UnderBudget backend API service use a
`.db.env` file to define environment variables to specify connection parameters
for the database.

```
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

By default the UnderBudget backend API will connect to the database at
`db:5432`. If integrating with other services and the database service
has a different hostname or port, you can tell the backend API where
to find the database using the `POSTGRES_HOST` and `POSTGRES_PORT`
environment variables in `db.env`.

## Running

Once all configured, you can run `docker-compose up` to start all services
of the UnderBudget application. Once fully initialized, you can access the
application at `https://underbudget.mycooldomain.com`.
