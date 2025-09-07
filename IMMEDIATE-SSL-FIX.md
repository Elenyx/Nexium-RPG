# Immediate Actions to Fix SSL for nexium-rpg.win

Follow these steps in order to fix your SSL certificate issue:

## 1. Netlify Settings Check

- Log into your Netlify dashboard
- Go to Site settings > Domain management
- Verify that nexium-rpg.win is listed as a custom domain
- Check HTTPS section to see certificate status

## 2. Temporarily Disable HSTS in netlify.toml

Remove or comment out the HSTS headers in your netlify.toml file:

```toml
# [[headers]]
#   for = "/*"
#   [headers.values]
#     Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
```

Then deploy the updated configuration.

## 3. Clear HSTS Data in Your Browser

- Chrome: Visit chrome://net-internals/#hsts
- Enter "nexium-rpg.win" and click "Delete domain security policies"
- Close and restart Chrome

## 4. Verify DNS Configuration

Make sure your DNS is properly configured:

For Apex Domain (nexium-rpg.win):
- A Records pointing to Netlify's IPs:
  - 75.2.60.5
  - 99.83.190.57
  - 75.2.70.75
  - 99.83.179.38

For www Subdomain:
- CNAME record pointing to your-site-name.netlify.app

## 5. Force Netlify to Reprovision Certificate

- Go to Site settings > Domain management > HTTPS
- Click "Renew certificate"
- Wait 5-15 minutes for provisioning

## 6. Test in Incognito/Private Browsing

- Open an incognito window in Chrome or private window in Firefox
- Try accessing your site at https://nexium-rpg.win

## 7. If Still Not Working After 1 Hour

- Contact Netlify support with:
  1. Your site name
  2. Custom domain name (nexium-rpg.win)
  3. Error screenshot
  4. Steps you've already taken

## 8. After Site Becomes Accessible

- Update Discord Developer Portal with correct HTTPS redirect URIs
- Update all environment variables to use HTTPS URLs
- Re-enable HSTS with appropriate settings
