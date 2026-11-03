---

layout: post
title: "Protecting Web APIs Using Microsoft Identity Platform: Part 3"
date: "2021-08-11 10:01:04.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Development"]
thumbnail: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=640"
image: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=1600"
---

The following posts are part of this series:

*   [Part 1: Creating your App Registration](https://blog.m12d.com/protecting-web-apis-using-microsoft-identity-platform/?utm_source=inpost&utm_medium=click&utm_campaign=blog)
*   [Part 2: Configuring your code](https://blog.m12d.com/protecting-web-apis-using-microsoft-identity-platform-part-2/?utm_source=inpost&utm_medium=click&utm_campaign=blog)
*   [Part 3: Securing your API endpoints](https://blog.m12d.com/protecting-web-apis-using-microsoft-identity-platform-part-3/?utm_source=inpost&utm_medium=click&utm_campaign=blog)

In the previous post, we looked at the setup of your code to start accepting bearer tokens for authentication. Now we are looking at the validation of these tokens and how to verify scopes in your API controllers.

Token validation
================

A number of validators exist for you to validate aspects of the token to ensure you can trust the token you have been passed. Validators are defined in the source file in the `IdentityModel` [extensions](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/master/src/Microsoft.IdentityModel.Tokens/Validators.cs). The following table describes the validators available.

Validator

Description

ValidateAudience

Ensures the token is for the application that validates the token for you.

ValidateIssuer

Ensures the token was issued by a trusted STS, meaning it's from someone you trust.

ValidateIssuerSigningKey

Ensures the application validating the token trusts the key that was used to sign the token. There's a special case where the key is embedded in the token. But this case doesn't usually arise.

ValidateLifetime

Ensures the token is still or already valid. The validator checks if the lifetime of the token is in the range specified by the notbefore and expires claims.

ValidateSignature

Ensures the token hasn't been tampered with.

ValidateTokenReplay

Ensures the token isn't replayed. There's a special case for some onetime-use protocols.

Customising validation
----------------------

For the majority of cases, you will not need to change the parameters. One exception to this rule would be multi-tenant applications. In this scenario, applications accept users from any organisation, thus issuers must be validated. You can customise the token validation parameters in your `Startup.cs` using the following code.```
services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>{	var existingHandler = options.Events.OnTokenValidated;    options.Events.OnTokenValidated = async context =>    {    	await existingHandler(context);        options.TokenValidationParameters.ValidIssuers = new[] { /* list */ };        options.TokenValidationParameters.ValidAudiences = new[] { /* list */ };    };});
```You can of course pass in your list from a configuration value, which could come from any one of the configuration provider sources such as Azure App Configuration, or Azure Key Vault. If you are using Azure Functions, then you can provide token validation using the following example: [https://github.com/Azure-Samples/ms-identity-dotnet-webapi-azurefunctions](https://github.com/Azure-Samples/ms-identity-dotnet-webapi-azurefunctions).

Protecting controllers
======================

In order to protect controllers, or actions, you can use the `[Authorize]` attribute. The attribute can be used and mixed with `[AllowAnonymous]` if your scenario requires. In the following scenario, all actions require authenticated access.```
[Authorize]public class HomeController : Controller{	...}
```The following example, only the `Account` action of the controller requires authentication.```
public class HomeController : Controller{	[Authorize]	public IActionResult Account()	{		return View();	}}
```Finally, in the following example, the `Login` action allows unauthenticated access and every other action requires authenticated access.```
[Authorize]public class HomeController : Controller{	[AllowAnonymous]	public IActionResult Account()	{    	return View();	}}
```

Validating scopes
-----------------

In the first part of this series, we looked at the use of scopes in APIs, for example `read_user`. You can validate the scope requested in the token by using the `[RequiredScope]` attribute. Here is an example, where the GET method for the API must have the `read_user` scope.```
using Microsoft.Identity.Web[Authorize]public class UsersController : Controller{    [HttpGet]    [RequiredScope("read_user")    public IEnumerable<User> Get()    {        // ...    }}
```You can also define your scopes in your configuration, by adding the following to your app configuration.```
{ "AzureAd" : {   // more settings   "Scopes" : "access_as_user access_as_admin"  }}
```Finally, you can use the `[RequiredScope]` attribute as follows.```
using Microsoft.Identity.Web[Authorize]public class UsersController : Controller{    [HttpGet]    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")    public IEnumerable<User> Get()    {        // ...    }}
```Scopes can also be validated at the controller level, by using the `[RequiredScope]` attribute at the controller level. You may also conditionally verify scopes within your code using the `VerifyUserHasAnyAcceptedScope` extension method on `HttpContext`.```
using Microsoft.Identity.Web[Authorize]public class UsersController : Controller{    [HttpGet]    public IEnumerable<TodoItem> Get()    {         HttpContext.VerifyUserHasAnyAcceptedScope("read_user");        // ...    }}
```

What is actually validated?
---------------------------

When calling either the extension method above, or using the attribute, verification takes place to check there is a claim named either `scp` or `http://schemas.microsoft.com/identity/claims/scope`. Additionally, the claim must have a value that contains the scope expected by the API.

Summary
=======

There you have it, in three short posts, we have learned how to configure our application for the new v2.0 endpoints in Azure AD. Then we looked at how to configure our application to validate bearer tokens and how to validate scopes within tokens.