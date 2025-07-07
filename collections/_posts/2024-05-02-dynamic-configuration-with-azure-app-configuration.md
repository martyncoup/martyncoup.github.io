---
title: "Dynamic Configuration with Azure App Configuration"
date: 2024-05-02T09:38:03+00:00
layout: post
authors: ["Martyn Coupland"]
categories: ["Azure App Dev", ".NET", "TypeScript"]
description: "Azure App Configuration provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed in nature."
thumbnail: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=640"
image: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=1600"
---

In this post, we are going to take a look at not just dynamic configuration with Azure App Configuration, but we are going to look at using labels to further increase the level of dynamic configuration.

Using labels allows you, for example to provision environment specific settings in one place, while using environment variables to easily retrieve per-environment configuration values. You could also create different profiles using labels, it’s the same concept, just using a different key instead of the environment name.

First of all, let’s look at two samples of retrieving label specific configurations with both .NET and TypeScript.

# Calling label specific configurations with .NET

First of all, in .NET you will require the package `Microsoft.Extensions.Configuration.AzureAppConfiguration`. Using the `dotnet` CLI, you can do this with the following. Other Package Managers are also available!

```cli
dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
```

Configuring the connection to Azure App Configuration can be done using an environment variable with the connection string.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddAzureAppConfiguration(options => {
options.Connect(builder.Configuration.GetConnectionString("APPCONFIG_CONNECTION_STRING"))
    .Select(KeyFilter.Any, LabelFilter.Null)
    .Select(KeyFilter.Any, "<filter label>");
});
```

The first Select method loads all labels which have a null filter, this means any configurations which are not specifically labelled, will be loaded. The second Select filter, will load any configurations which have the specified label defined.

For an environment based approach to loading configurations, you can use the environment manager to load the current environment, using the following property `builder.Environment.EnvironmentName`.

Your configuration settings are then accessed through the normal IConfiguration interface.

For other approaches, you would simply enter the value of the filter label name in the Select method and load in that specific profile. That could come from another dynamic source, maybe a database, or even Redis cache for example.

# Calling label specific configurations with TypeScript

The same principles as above can be achieved using the JavaScript SDK as well. This allows you to work with React or even Angular based applications. First of all, just like in .NET, you will need to load in the package, the following will achieve this using NPM.

```cli
npm install @azure/app-configuration
```

The next step is to include a reference to this package in your TypeScript file, you can do this using the following line.

```ts
import { AppConfigurationClient } from "@azure/app-configuration";
```

Let’s now set some variables to allow us to connect to Azure App Configuration, and set our key to retrieve.

```ts
const connectionString = process.env["APPCONFIG_CONNECTION_STRING"] || "<connection string>";
const client = new AppConfigurationClient(connectionString);

const configKey = "Samples:Endpoint:Url";
const labelKey = process.env["ENVIRONMENT"] || "Development";
```

As before with .NET, these lines set the connection string, either from an environment variable or by passing in the string manually. We are also setting the label key we are looking for as well. This is used in combination with the configKey.

```ts
const betaEndpoint = await client.getConfigurationSetting({ key: configKey, label: labelKey });
```
