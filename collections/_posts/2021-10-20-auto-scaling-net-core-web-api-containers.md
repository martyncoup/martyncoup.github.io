---

layout: post
title: "Auto-Scaling .NET Core Web API Containers"
date: "2021-10-20 11:20:27.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: [".NET", "AKS", "Containers", "Development", "Warmup"]
thumbnail: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=640"
image: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=1600"
---

In this post, we take a look at how to make sure you .NET Core Web API containers work well in auto-scalaing scenarios on Azure Kubernetes Service.

When you first access a newly released .NET Core Web API, even locally, does not have to be in a container, you will notice the first request is slow. You can see this with the following output, it's just from a brand new scaffolded project using the .NET CLI.

```
$url = "https://localhost:5001"

(Measure-Command -Expression { $site = Invoke-WebRequest -Uri $url -UseBasicParsing }).Milliseconds
0.612

(Measure-Command -Expression { $site = Invoke-WebRequest -Uri $url -UseBasicParsing }).Milliseconds
0.005
```

As to why this happens, in short I don't know. I've done a fair amount of research on the subject and despite trying a number of things I can only assume here that something internally is warming up for the first request which causes the delay in response.

In a monolithic application, we can most likely live with this behaviour, however what about when your application is a container, and auto-scaling is a consideration? In this scenario, having that delay on the first request is something which is not desirable.

Solution - Readiness Probes
---------------------------

In order to resolve this issue, we can use a feature called [readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#define-readiness-probes). The way it works is that a pod with a readiness probe will only get traffic once it’s readiness probe has successfully returned a result. This, is exactly what we need to do, a warmup.

We need to make some changes to our API code so we can support this scenario, it's basically a new endpoint, create a new controller within your application.

```
namespace M12D.Controllers
{
    \[Route("\[controller\]")\]
    public class ReadyController : Controller
    {
        private static bool warmed = false;
        private readonly IHttpClientFactory \_clientFactory;

        public ReadyController(IHttpClientFactory clientFactory)
        {
            \_clientFactory = clientFactory;
        }

        private string GetFullUrl(string relativeUrl) =>
            $"{Request.Scheme}://{Request.Host}{relativeUrl}";

        private async Task DoWarmUp()
        {
            // Warm up the /account endpoint.
            var request = new HttpRequestMessage(HttpMethod.Get,
            GetFullUrl(Url.Action("Get", "Account")));
            await \_clientFactory.SendAsync(request);

            warmed = true;
        }

        \[HttpGet, HttpHead\]
        public async Task<IActionResult> Get()
        {
            if (!warmed)
            {
                await DoWarmUp();
            }

            return Ok("Ready!");
        }
    }
}
```

The code is quite simple, but let's have a look at what is happening in a little more detail.

First of all, we are using `IHttpClientFactory` instead of `HttpClient`, if you're not using this, then read up on why you [should](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests). We build the address of the endpoint we want to warmup, in this example we're sending a GET request to the /account endpoint.

When that request has completed (you may add a check for `IsSuccessStatusCode` here as well), we set the warmup to true. Then we return a HTTP 200 simply stating "Ready!". Over in your Kubernetes YAML file, you will need to add the following to your container spec.

```
readinessProbe:
  httpGet:
    path: /ready
    port: 5000
  initialDelaySeconds: 10
  timeoutSeconds: 60
  periodSeconds: 60
```

When this is deployed, what will happen is that Kubernetes will not mark the pod as ready until the readiness probe has completed, in this configuration, production traffic will not be sent there until the pod is marked as ready.