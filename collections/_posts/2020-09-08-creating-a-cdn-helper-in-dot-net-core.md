---
layout: post
title: "Creating a CDN Helper in Dot Net Core"
date: 2020-09-08 20:21:00.000000000 +01:00
description: "Creating a custom helper is easier than you would think. So to keep things easy for us, we are going to use the configuration file appsettings.json to store the base path to our CDN. This will make it easier to change our root without having to update the whole of our application."
layout: post
authors: ["Martyn Coupland"]
categories: [".NET", "Snippets"]
thumbnail: "/assets/images/posts/2020/09/b1fde-photo-1542831371-29b0f74f9713.jpg"
image: "/assets/images/posts/2020/09/b1fde-photo-1542831371-29b0f74f9713.jpg"
---

# Code walkthrough

First of all, I am using Dot Net Core for this, you can easily achieve the same thing using the regular .NET Framework. Create a new class, I called mine `CdnUrlHtmlHelper.cs`, this makes it easy to see what it’s used for.

Within this file you will have two classes. But first, let’s have a look at the easiest part. This is reterieving the configuration setting from the configuration file.

```csharp
public class CdnUrlConfig {
  private static IConfiguration _configuration;

  public CdnUrlConfig(IConfiguration configuration) {
    _configuration = configuration;
  }

  public static string CdnBaseUrl
  {
    get {
      return _configuration["CdnBaseUrl"];
    }
  }
}
```

Using dependency injection within Dot Net Core, I am able to access the configuration settings easily using a private property. I then pass the `IConfiguration` interface into the constructor of the class to set the private property. Any of my configuration settings can now be accessed using the `_configuration` property.

```csharp
public static class CdnUrlHtmlHelper {
  public static string CdnUrl(this HtmlHelper helper, string contentPath) {
    if (contentPath.StartsWith("~")) {
      contentPath = contentPath.Substring(1);
    }

    contentPath = string.Format("{0}{1}", CdnUrlConfig.CdnBaseUrl.TrimEnd('/'), contentPath.TrimStart('/'));

    var url = new UrlHelper(new Microsoft.AspNetCore.Mvc.ActionContext(helper.ViewContext.HttpContext, helper.ViewContext.RouteData, helper.ViewContext.ActionDescriptor));

    return url.Content(contentPath);
  }
}
```

The next step is todefine a public static class for our actual helper. I shall move onto the usage shortly. The idea here is that I pass in the content path, then retrieve the base URL from configuration and build the URL to return back to the view engine.

I can then call this very simply, check out the examples below.

````csharp
<img src="@Html.CdnUrl("~/images/image1.png")" alt="Test"/>

<link rel="stylesheet" type="text/css" href="@Html.CdnUrl("~/style/site.min.css")" />```
````
