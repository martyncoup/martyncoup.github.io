---
layout: post
title: "Protecting Web APIs Using Microsoft Identity Platform: Part 2"
date: "2021-08-11 08:29:46.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Development", "DotNet", "Identity"]
thumbnail: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=640"
image: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=1600"
---

# Defining protected

First of all, let's look at what we mean by protected. Much like in ASP.NET, in ASP.NET Core, you can use the `[Authorize]` attribute to define that your controller must be called with an authorised identity. We pass what is known as a bearer token as a Authorization header in our API requests, this holds information about the identity as well as user information unless the web app accepts calls from a daemon. You would use this in a service-to-service scenario.

# Configuring JWT

In your Web API, you need to configure your JSON Web Token ([JWT](https://jwt.io/)) bearer token. This is done within your configuration file. Here is a sample of the configuration.`{  "AzureAd": {    "Instance": "https://login.microsoftonline.com/",    "ClientId": "[ClientId]",    "TenantId": "common"  },  "Logging": {    "LogLevel": {      "Default": "Warning"    }  },  "AllowedHosts": "*"}`The `TenantId` field allows for a number of different values.

- `GUID` - You would use a GUID to specify the directory ID of an existing Azure AD tenant.
- `common` - Represents any organisation or personal account.
- `organizations` - Represents any organisation.
- `consumers` - Represents Microsoft personal accounts.

For applications which are multi-tenanted and accept only Azure AD logins, for example, this could be enterprise software, you would specify `organizations`. If you wanted to only accept Microsoft accounts, then you could use `consumers`, if you wanted to support both, then use `common`. If your application is bound to a specific organisation and is not multi-tenanted, then use the GUID of the directory.

# Using the App ID URI

If you have used the App ID URI from the app registration portal, then you don't need to specify the audience in the configuration. However, if you have customised the value of the App ID URI, then you should specify the `Audience` property, as shown below.```
{ "AzureAd": { "Instance": "https://login.microsoftonline.com/", "ClientId": "[ClientId]", "TenantId": "common", "Audience": "[AppIdUri]" }, // more lines}

````

Code configuration
==================

The recommendation is now to use the Microsoft Identity framework and use the [`Microsoft.Identity.Web`](https://www.nuget.org/packages/Microsoft.Identity.Web) package from NuGet. This package is what stitches together the authentication middleware and the authentication library with ASP.NET Core. Existing templates, at the time of writing, in Visual Studio when using ASP.NET Core 3.1 only provide the `Microsoft.AspNetCore.AzureAD.UI` library. You can instead place the following code in your `Startup.cs` to use the new package. First of all, we need to include the package in our code.```
using Microsoft.Identity.Web;
```The next step, in `ConfigureServices` is to add support for the middleware.```
public void ConfigureServices(IServiceCollection services){	services.AddMicrosoftIdentityWebApiAuthentication(Configuration, "AzureAd");    //...}
````

# Summary

There you have it, you are now ready with the basics of using JWT and the v2.0 Azure AD authentication in your Web API. In the next post, we look at token validation and validation of scopes.
