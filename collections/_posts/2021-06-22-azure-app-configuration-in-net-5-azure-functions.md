---

layout: post
title: "Azure App Configuration in .NET 5 Azure Functions"
date: "2021-06-22 13:18:03.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: [".NET 5", "Azure App Configuration", "Azure Functions", "Development"]
thumbnail: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=640"
image: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=1600"
---

A number of changes affect the operation of Azure Functions from .NET 3 to .NET 5. In this post, we look at integrating with Azure App Configuration.

Recently, Microsoft [announced the availability](https://docs.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-developer-howtos?tabs=browser&pivots=development-environment-vscode) of support for .NET 5 in Azure Functions. Upgrading is a little more complicated than usual. Normally we would just change `netcoreapp3.1` over to `net5.0` and have done with it. Not this time.

Historically, Azure Functions have always been tightly coupled with the version of the runtime, Long Term Support (LTS) specifically. This meant that until the Azure Functions team updated their runtime, you were stuck on specific versions of .NET.

Now, this changes with the [Isolated Process model](https://docs.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-guide), also known in code as `dotnet-isolated`. We can, now, write in any version we like.

You'll need to do a few things like update your CSPROJ file to include the updated `TargetFramework` (net5.0), `AzureFunctionsVersion` (v3), `OutputType` (Exe), and `FunctionsSkipCleanOutput` (true). Also, don't forget to update your NuGet packages and `local.settings.json` file, the `FUNCTIONS_RUNTIME` will need changing to `dotnet-isolated`.

Changes to dependency injection
-------------------------------

The biggest change though, if you are used to using **Startup.cs** and the `Startup` method which extends `FunctionsStartup`, then you no longer need this. When it comes to Azure App Configuration, we may have done something similar to this.

```
using System;using Microsoft.Azure.Functions.Extensions.DependencyInjection;using Microsoft.Extensions.Configuration;[assembly: FunctionsStartup(typeof(FunctionApp.Startup))]namespace FunctionApp{    class Startup : FunctionsStartup    {        public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)        {            string cs = Environment.GetEnvironmentVariable("ConnectionString");            builder.ConfigurationBuilder.AddAzureAppConfiguration(cs);        }        public override void Configure(IFunctionsHostBuilder builder)        {        }    }}
```

Using the new dependency injection system, it's more aligned to ASP.NET and uses the `Microsoft.Extensions.Hosting.HostBuilder` class. Now, implementing Azure App Configuration using the new methodology, would require us to have the following inside our `Main()` function.

```
var host = new HostBuilder()    .ConfigureAppConfiguration(options =>    {        options.AddAzureAppConfiguration(config =>        {            config.Connect(Environment.GetEnvironmentVariable("ConnectionString"));        });    })    .ConfigureFunctionsWorkerDefaults()    .ConfigureServices(services =>    {        services.AddAzureAppConfiguration();    })    .Build();          host.Run();
```

Dependency injection from here, now works in the exact same way as before. In your function, add a reference to `Microsoft.Extensions.Configuration`, then declare your instance of `IConfiguration`.

```
private readonly IConfiguration _configuration;public Function1(IConfiguration configuration){    _configuration = configuration;}
```

Here is an example implementation of this in a function.

```
[Function("Function1")]public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req, FunctionContext executionContext){    var logger = executionContext.GetLogger("Function1");    string keyName = "TestApp:Settings:Message";    string message = _configuration[keyName];    var response = req.CreateResponse(HttpStatusCode.OK);    response.Headers.Add("Content-Type", "application/json; charset=utf-8");    response.WriteString(message);        if (message != null)    {        return response;    } else {        var error = req.CreateResponse(HttpStatusCode.BadRequest);        error.Headers.Add("Content-Type", "application/text; charset=utf-8");        error.WriteString($"Please create a key-value with the key '{keyName}' in App Configuration."));        return error;    }}
```

Summary
-------

You'll need to be aware of other changes to things like **HttpTrigger** and **TimerTrigger** when moving to Azure Functions and .NET 5, but this means you can keep your existing investments in Azure App Configuration.