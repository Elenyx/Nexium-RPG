# SSL Certificate Troubleshooting Guide for nexium-rpg.win

This guide will help you resolve SSL certificate issues with your custom domain on Netlify.

## Current Issue

Error message: `ERR_CERT_AUTHORITY_INVALID`

This indicates that the SSL certificate for your custom domain isn't correctly set up or hasn't fully propagated yet.

## Step-by-Step Solution

### 1. Verify DNS Configuration

First, ensure your domain is correctly pointed to Netlify:

```bash
# Run this command to check where your domain is pointing
dig nexium-rpg.win +noall +answer
```

Expected results:

- For apex domain: Should show A records pointing to Netlify's IPs
- For www subdomain: Should show CNAME record pointing to your Netlify site

### 2. Check SSL Certificate in Netlify

1. Go to Netlify Dashboard
2. Select your site
3. Navigate to: **Site settings** → **Domain management** → **HTTPS**
4. Check the status of your certificate provisioning
5. If it says "Certificate not issued" or similar, click **Renew certificate**

### 3. Temporarily Disable HSTS (If Needed)

The error message mentions HSTS, which can prevent access even after fixing SSL:

1. In Netlify dashboard: **Site settings** → **Domain management** → **HTTPS**
2. Under HSTS, disable preloading temporarily
3. Update your `netlify.toml` to remove HSTS headers temporarily
4. Redeploy your site

### 4. Clear HSTS Cache in Your Browser

If your browser has cached the HSTS policy:

1. In Chrome, go to: `chrome://net-internals/#hsts`
2. Enter "nexium-rpg.win" in the "Delete domain security policies" section
3. Click "Delete"
4. Close and reopen Chrome

### 5. Try Alternative Browsers

Sometimes a different browser without cached HSTS data can access the site.

### 6. Check for Certificate Propagation

SSL certificates can take time to propagate:

```bash
# Check the current SSL certificate
openssl s_client -connect nexium-rpg.win:443 -servername nexium-rpg.win
```

### 7. Contact Netlify Support

If the issue persists after 24 hours:

1. Go to Netlify Support
2. Provide your site name, custom domain, and error screenshots
3. Mention that you're having SSL certificate issues with HSTS

## After Resolving

Once SSL is working correctly:

1. Re-enable HSTS with appropriate settings
2. Update your redirect URIs in Discord Developer Portal to use HTTPS
3. Update your environment variables to use HTTPS URLs

## Prevention for Future

1. Always test SSL configuration before enabling HSTS
2. Use Netlify DNS for easier SSL management
3. Allow up to 24 hours for SSL certificates to fully provision
