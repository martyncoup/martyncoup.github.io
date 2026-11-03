---

layout: post
title: "Call the Azure REST API using Microsoft Identity Web"
date: "2021-04-12 13:17:24.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["API Management and Integration"]
thumbnail: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=640"
image: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=1600"
---

The Microsoft Identity Platform provides developers with the opportunity to make use of v2.0 endpoints to develop their applications. In .NET Core this is the [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) package.

This library is specifically written for applications fulfilling either of the two scenarios below:

*   Web applications which sign in users and call web APIs
*   Protected web APIs which call downstream web APIs

A simple way of explaining this would be saying that you have a web application which is responsible for connecting to the Microsoft Graph API to authenticate and authorise users and make subsequent calls to the Graph API.

The second method is that you could write your own API which then calls other APIs within the methods you write in code. Creating a protected API is quite simple using this method, you can simply configure some configuration options and then add the standard `[Authorize]` attribute to your controllers. You can even combine scopes from your API endpoint and your tokens will be validated, this even supports multi-tenant APIs as well.

One of the major differences between this method and the previous v1 method is the acquisition of the access token. In the v1 endpoint `/oauth2/token`, you would expect to see something similar to the screenshot below.

![](/content/images/2021/04/image-3.png)

Figure 1 - API call in Postman to the Token endpoint.

Notice the `resource` parameter is set to the URI of the resource we want to use, for working with the Azure REST API, this would be set to `https://management.azure.com/`. We would then use the generated access token as a Bearer authorisation header in our call to the REST API.

However, when using the v2 endpoint, this changes to use a model built on [scopes](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent). If you are building your own custom API, then you can expose your own API scopes through the Azure AD configuration in _App Registrations_.

The differences for a v2 endpoint can be seen in the Postman screenshot here, where we use `/v2.0/token` in the URL and define `scope` instead of `resource` in the request, my app ID is obfuscated.

![](/content/images/2021/04/image-4.png)

Figure 2 - v2 API call in Postman to acquire a token.

Calling from your Web API
-------------------------

First, in your `appsettings.json` file, add the following.

```
"AzureApi": {    "BaseUrl": "https://management.azure.com/",    "Scopes": "https://management.azure.com//.default"  }
```

Note the scope here, usually this would be the AppID/.default, for example from the Graph API this could be `https://graph.microsoft.com/mail.send` to have permission to send mail.

When it comes to the Azure Management API, the trailing slash if left out causes problems with token validation. The resource URI for the Azure Resource Manager contains a trailing slash, so we must define the scope with `/.default` on the end.

Generally speaking, if you verify that the token is being issues, but rejected by the API that should otherwise accept it, then consider adding a second forward slash and trying again.

Back to the code now, you can add the ability in your `Startup.cs` configuration to use the configuration section you have already defined.

```
services.AddMicrosoftIdentityWebApiAuthentication(Configuration, "AzureAd")    .EnableTokenAcquisitionToCallDownstreamApi()    .AddDownstreamWebApi("Azure", Configuration.GetSection("AzureApi"))    .AddInMemoryTokenCaches();
```

Simply add the section above to enable this functionality. Now in your controller, make use of `IDownstreamWebApi` through dependency injection to call your API, this would be done using the following.

```
...private readonly IDownstreamWebApi _downstreamWebApi;public CostController(IDownstreamWebApi downstreamWebApi){    _downstreamWebApi = downstreamWebApi;}...
```

Next, simply add the code to call the endpoint, many of the options here can come from your `appsettings.json` file if you want, I'm including them here for brevity.

```
var response = await _downstreamWebApi.CallWebApiForAppAsync(    "AzureApi",    options =>    {        options.BaseUrl = "https://management.azure.com";        options.HttpMethod = HttpMethod.Get;        options.RelativePath = "subscriptions/<sub id>/resourcegroups?api-version=2020-09-01";        options.Scopes = "https://management.azure.com//.default";        options.Tenant = "<tenant id>";    });
```

Your response can then be sent back or further manipulated as required.