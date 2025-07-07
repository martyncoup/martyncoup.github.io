---
title: Building Resilient Microservices with .NET and Azure
date: 2024-12-27 21:13:25.000000000 +00:00
description: "This year, I am making a second contribution to the Festive Tech Calendar 2024. I will share insights on using several resiliency patterns. These patterns are essential for building your microservices."
layout: post
authors: ["Martyn Coupland"]
categories: ["APIs", ".NET"]
thumbnail: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=640"
image: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=1600"
---

First of all, I apologise for doing this as a blog post. I wanted to record this, like my first session. But, due to the busy Christmas period and some travel, I didn't get around to it. Hopefully this is something I can share in video format another time.

The team are this year raising money for the Beatson Cancer Charity. No matter how small, if you can consider donating, then everything helps the vital work they do. You can visit the <a href="https://www.justgiving.com/page/festive-tech-calendar-2024">Just Giving</a> page to learn more and to donate.

Without further ado, let's get into building resilient microservices.

# Circuit breaker pattern

Handling faults can take a variable amount of time to recover from. This is especially true when connecting to a remote service or resource. When handled correctly, can improve the stability and resiliency of an application.

If a service is very busy, failure in one part of the system might lead to cascading failures. For example, an operation that invokes a service could be configured to implement a timeout. It can reply with a failure message if the service fails to respond within this period.

Implementing the Circuit Breaker Pattern in a .NET microservice helps to improve resiliency by preventing repeated failed requests to an external service or dependency.

A great way to handle this in your microservice is with a library known as <a href="https://www.thepollyproject.org/">Polly</a> (<a href="https://github.com/App-vNext/Polly">GitHub</a>). I'm a big fan of using the .NET CLI, so let's now have a look at how we can use Polly to have our microservice handle the circuit breaker pattern.

First of all, we need to add the library to your code.

```csharp
dotnet add package Polly.Core
```

To use Polly, you must provide a callback and execute it using resilience pipeline. A resilience pipeline is a combination of one or more resilience strategies such as retry, timeout, and rate limiter. Polly uses builders to integrate these strategies into a pipeline.

```csharp
// Create an instance of builder that exposes various extensions for adding resilience strategies
ResiliencePipeline pipeline = new ResiliencePipelineBuilder()
    .Build(); // Builds the resilience pipeline

// Execute the pipeline asynchronously
await pipeline.ExecuteAsync(static async token => { /* Your custom logic goes here*/ }, cancellationToken);
```

You can use the `CircuitBreakerStrategyOptions` class to define options for your circuit breaker policy.

For example, this policy will break the circuit if more than 50% of actions result in handled exceptions within any 10 second sampling during and at least 8 actions are processed.

```csharp
// Circuit breaker with customised options:
// The circuit will break if more than 50% of actions result in handled exceptions,
// within any 10-second sampling duration, and at least 8 actions are processed.
var optionsComplex = new CircuitBreakerStrategyOptions
{
    FailureRatio = 0.5,
    SamplingDuration = TimeSpan.FromSeconds(10),
    MinimumThroughput = 8,
    BreakDuration = TimeSpan.FromSeconds(30),
    ShouldHandle = new PredicateBuilder().Handle&lt;SomeExceptionType&gt;()
};
```

You can also define options in the policy for specific exceptions, allowing you to handle different circuit breaker configurations per policy.

```csharp
// Handle specific failed results for HttpResponseMessage:
var optionsShouldHandle = new CircuitBreakerStrategyOptions&lt;HttpResponseMessage&gt;
{
    ShouldHandle = new PredicateBuilder&lt;HttpResponseMessage&gt;()
        .Handle&lt;SomeExceptionType&gt;()
        .HandleResult(response =&gt; response.StatusCode == HttpStatusCode.InternalServerError)
};
```

These options are then added to your resilience pipeline, for circuit breakers, you would do this using the `AddCircuitBreaker` method. Here is an example of how to do this.

```csharp
var pipeline = new ResiliencePipelineBuilder()
    .AddCircuitBreaker(optionsShouldHandle)
    .Build();
```

# Retry pattern

We can also use Polly to handle the retry pattern in our microservice as well. You have two options, the first is a fixed delay retry. This is where the defined delay is fixed and the time between each retry remains the same.

```csharp
// For instant retries with no delay
var optionsNoDelay = new RetryStrategyOptions
{
    Delay = TimeSpan.FromSeconds(30)
};
```

Another type of delay is an exponential backoff delay, where each delay increases the time in between retries. It's still very easy to define the exponential backoff in your policy.

```csharp
var optionsComplex = new RetryStrategyOptions
{
    ShouldHandle = new PredicateBuilder().Handle&lt;SomeExceptionType&gt;(),
    BackoffType = DelayBackoffType.Exponential,
    UseJitter = true,  // Adds a random factor to the delay
    MaxRetryAttempts = 4,
    Delay = TimeSpan.FromSeconds(3),
};
```

Just like the previous example, this can easily be be wrapped around your existing code.

```csharp
var pipeline = new ResiliencePipelineBuilder()
    .AddRetry(optionsComplex)
    .Build();
```

# Bulkhead pattern

The Bulkhead pattern is a type of application design that is tolerant of failure. In a bulkhead architecture, also known as cell-based architecture, elements of an application are isolated into pools. If one element fails, the others will continue to function. It's named after the sectioned partitions (bulkheads) of a ship's hull. If the hull of a ship is compromised, only the damaged section fills with water. This design prevents the ship from sinking.

A cloud-based application may include multiple services, with each service having one or more consumers. Excessive load or failure in a service will impact all consumers of the service.

Polly also allows the handling of bulkhead resiliency pattern as well, and it's as simple as the previous examples.

In this example, we define the maximum number of concurrent executions. We also define the time window which this maximum is allowed. The second example shows how you can allow a maximum of 100 concurrent executions and a queue of 50.

```csharp
// Create a rate limiter that allows 100 executions per minute.
new ResiliencePipelineBuilder()
    .AddRateLimiter(new SlidingWindowRateLimiter(
        new SlidingWindowRateLimiterOptions
        {
            PermitLimit = 100,
            Window = TimeSpan.FromMinutes(1)
        }));

// Create a rate limiter to allow a maximum of 100 concurrent executions and a queue of 50.
new ResiliencePipelineBuilder()
.AddConcurrencyLimiter(100, 50);
```

Let's look at a simple implementation of this, where we set a number of tasks going.

```csharp
var pipeline = new ResiliencePipelineBuilder().AddConcurrencyLimiter(100, 50).Build();

try
{
    // Execute an asynchronous text search operation.
    var result = await pipeline.ExecuteAsync(
        token => TextSearchAsync(query, token),
        cancellationToken);
}
catch (RateLimiterRejectedException ex)
{
    // Handle RateLimiterRejectedException,
    // that can optionally contain information about when to retry.
    if (ex.RetryAfter is TimeSpan retryAfter)
    {
        Console.WriteLine($"Retry After: {retryAfter}");
    }
}
```

The `onBulkheadRejectedAsync` callback is triggered when requests exceed both `maxParallelization` and `maxQueuingActions`. Use this to log rejections or implement fallback logic.

```csharp
var withOnRejected = new ResiliencePipelineBuilder()
    .AddRateLimiter(new RateLimiterStrategyOptions
    {
        DefaultRateLimiterOptions = new ConcurrencyLimiterOptions
        {
            PermitLimit = 10
        },
        OnRejected = args =>
        {
            Console.WriteLine("Rate limit has been exceeded");
            return default;
        }
    }).Build();
```

You could use this handler to actually scale resources based on demand, if you have access to do this from within your microservice. Instrumentation can also be measured here using Application Insights for example and scaled based on the metrics collected.

# Integrating with dependency injection (DI)

Finally, I want to wrap up by explaining how we can integrate Polly. We can do this through dependency injection, which is the most common way of integrating. Add the extensions to your project.

```cli
dotnet add package Polly.Extensions
```

Afterwards, you can use the `AddResiliencePipeline` extension method to set up your pipeline:

```csharp
var services = new ServiceCollection();

// Define a resilience pipeline
services.AddResiliencePipeline("my-key", builder =>
{
    // Add strategies to your pipeline here, timeout for example
    builder.AddTimeout(TimeSpan.FromSeconds(10));
});

// You can also access IServiceProvider by using the alternate overload
services.AddResiliencePipeline("my-key", (builder, context) =>
{
    // Resolve any service from DI
    var loggerFactory = context.ServiceProvider.GetRequiredService<ILoggerFactory>();

    // Add strategies to your pipeline here
    builder.AddTimeout(TimeSpan.FromSeconds(10));

});

// Resolve the resilience pipeline
ServiceProvider serviceProvider = services.BuildServiceProvider();

ResiliencePipelineProvider<string> pipelineProvider = serviceProvider
    .GetRequiredService<ResiliencePipelineProvider<string>>();

ResiliencePipeline pipeline = pipelineProvider.GetPipeline("my-key");

// Use it
await pipeline.ExecuteAsync(static async cancellation => await Task.Delay(100, cancellation));
```
