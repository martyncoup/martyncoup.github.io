---
layout: post
title: "Beyond the Endpoint: Building Discoverable, Governed APIs with .NET and Azure"
date: 2026-11-02 16:43:00.000000000 +00:00
description: "Building APIs is relatively straightforward. Building an API estate that is discoverable, governed and reusable across an enterprise is a different challenge. In this article, we explore how .NET 10, OpenAPI, Azure API Management and Azure API Center work together to establish a more mature API lifecycle, from development and contract validation through to runtime governance, enterprise discovery and AI readiness."
layout: post
authors: ["Martyn Coupland"]
categories: ["API Architecture", ".NET", "Azure Integration PaaS"]
thumbnail: "images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=640"
image: "images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80&w=1600"
---

APIs have become the connective tissue of modern enterprise architecture. They enable applications to communicate, support partner integrations, expose business capabilities and increasingly provide the interfaces through which AI agents interact with enterprise systems.

Yet many organisations still struggle with a relatively fundamental problem: they don't know what APIs they have, who owns them, what they do, or whether they should be reused.

Building an API is relatively straightforward. Building an API estate that is discoverable, governed, secure and reusable is a different challenge.

In this article, I'll explore how .NET, OpenAPI, Azure API Management and Azure API Center can work together to establish a more mature approach to API development and governance.

The focus is on a simple principle:

**API governance shouldn't start when an API reaches production. It should be part of the engineering lifecycle from the beginning.**

## The problem with API sprawl

Consider a typical enterprise environment.

Different teams build APIs to support their applications, integrations and business processes. Some are developed using .NET, others using Java, Node.js or low-code platforms. Some are exposed through an API gateway, while others are consumed directly.

Over time, several challenges emerge:

- Discoverability: Developers don't know whether an API already exists before building another one.
  -- Ownership: There is no clear accountability for API maintenance and lifecycle management.
- Consistency: API naming, versioning, authentication and documentation vary between teams.
- Governance: Standards are documented but not consistently enforced.
- Visibility: Architecture teams lack a reliable inventory of the organisation's API estate.

These problems aren't necessarily caused by poor engineering. They're often the result of organisational growth, decentralised delivery and a lack of joined-up tooling.

An API gateway alone doesn't solve this problem. It provides an important runtime control point, but it doesn't automatically provide a complete picture of every API being developed across an organisation.

This is where separating API development, runtime management and enterprise discovery becomes important.

## Start with the contract: OpenAPI and .NET

or REST APIs, OpenAPI provides a machine-readable description of an API's capabilities.

It describes endpoints, operations, parameters, request and response schemas, and security requirements. This makes it useful not only for documentation, but also for tooling, testing, code generation and integration.

ASP.NET Core has built-in OpenAPI document generation through the Microsoft.AspNetCore.OpenApi package.

For a new .NET 10 application:

```bash
dotnet new webapi -n Orders.Api
cd Orders.Api

dotnet add package Microsoft.AspNetCore.OpenApi
```

A minimal API can expose its OpenAPI document with very little configuration.

```dotnet
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var orders = app.MapGroup("/api/orders")
    .WithTags("Orders");

orders.MapGet("/{id:guid}", (Guid id) =>
{
    return Results.Ok(new
    {
        Id = id,
        Status = "Processing",
        Total = 125.50m
    });
})
.WithName("GetOrder")
.WithSummary("Retrieve an order by its identifier")
.Produces(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);

app.Run();
```

Run the application and navigate to:

`/openapi/v1.json`

ASP.NET Core generates the document from the application's endpoint metadata.

There is an important distinction here: OpenAPI describes the contract, but it doesn't guarantee that the implementation behaves correctly or that the contract is complete. Good descriptions, response types, validation rules and security metadata still need to be designed deliberately.

### Build time generation

For enterprise delivery pipelines, I generally prefer generating the OpenAPI document during the build rather than relying exclusively on a running application.

Install the additional package:

```bash
dotnet add package Microsoft.Extensions.ApiDescription.Server
```

Then enable build-time generation in the project file:

```xml
<PropertyGroup>
  <OpenApiGenerateDocumentsOnBuild>true</OpenApiGenerateDocumentsOnBuild>
</PropertyGroup>
```

The document is generated as part of the build process and can be used for subsequent validation and publishing steps.

This creates an opportunity to treat the API contract as a build artefact.

It can be versioned, inspected, validated and compared before deployment. Changes to an API contract can therefore become part of the pull request and release process rather than something discovered after deployment.

One compatibility consideration: .NET 10 generates OpenAPI 3.1 by default. Azure API Management supports importing OpenAPI 3.1, but does not fully support all its features. For a straightforward APIM integration, consider generating OpenAPI 3.0 explicitly and validating the resulting document against your target platform's import requirements.

For example:

```dotnet
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion =
        Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0;
});
```

Always validate the resulting specification against the features your API actually uses.

## Runtime governance with Azure API Management

Once an API has been developed and its contract established, the next consideration is how it is exposed and managed.

Azure API Management provides a central runtime layer between API consumers and backend services.

It provides capabilities including:

- Authentication and authorisation integration
- Rate limiting and quota enforcement
- Request and response transformation
- Backend routing
- Caching
- API versioning and revisions
- Monitoring and request tracing

An OpenAPI specification can be imported into API Management, creating an API definition and its associated operations.

This gives us a repeatable route from API development to runtime exposure.

The important architectural decision is that API Management should own the runtime concerns that benefit from centralised enforcement, rather than pushing every cross-cutting requirement into individual API implementations.

For example, a policy can enforce a rate limit:

```xml
<policies>
<policies>
    <inbound>
        <base />
        <rate-limit-by-key
            calls="100"
            renewal-period="60"
            counter-key="@(context.Subscription.Id)" />
    </inbound>

    <backend>
        <base />
    </backend>

    <outbound>
        <base />
    </outbound>

    <on-error>
        <base />
    </on-error>
</policies>
```

This is a simple example, but it illustrates an important principle: runtime governance can be applied consistently without requiring every backend service to implement its own version of the same control.

Of course, API Management doesn't replace application-level security. Authentication, authorisation, input validation and business rules must still be correctly implemented within the API.

The gateway is another layer of defence, not a substitute for secure application engineering.

## Discoverability and governance with Azure API Center

Now we have an API that is documented and managed through API Management.

But how does another development team discover that it exists?

This is where Azure API Center becomes particularly interesting.

Azure API Center provides a centralised inventory for an organisation's APIs. It supports API discovery, metadata management, lifecycle tracking and the organisation of APIs across different environments and platforms.

The distinction between API Management and API Center is fundamental:

| Capability                   | Azure API Management        | Azure API Center     |
| ---------------------------- | --------------------------- | -------------------- |
| Runtime API gateway          | Yes                         | No                   |
| Traffic management           | Yes                         | No                   |
| Policy enforcement           | Yes                         | No                   |
| Centralised inventory        | Not its primary purpose     | Yes                  |
| API discovery                | Consumer portal capability  | Enterprise inventory |
| Lifecycle metadata           | API management capabilities | Yes                  |
| Cross-platform API inventory | Limited to managed estate   | Yes                  |

They solve different problems and complement each other.

## Connecting API Management to API Center

One particularly useful capability is the ability to integrate an Azure API Management instance with Azure API Center.

This enables APIs from API Management to be synchronised into the API Center inventory.

The integration can synchronise API definitions as well as API metadata, allowing teams to discover APIs without manually maintaining a separate inventory.

The synchronisation is one-way, from API Management into API Center.

This is an important architectural consideration: API Center isn't a replacement for API Management, and changes made to synchronised APIs in API Center aren't automatically pushed back into API Management.

Once synchronised, additional metadata can be maintained in API Center to improve discoverability.

For example:

- Business capability
- API owner
- Lifecycle stage
- Business domain
- Documentation links
- Licensing and terms of use

This is where the organisational value starts to become apparent.

An API inventory becomes more than a technical list of endpoints. It becomes a way of understanding the capabilities an organisation exposes and how those capabilities can be reused.

## Putting the architecture together

The following architecture illustrates how the components fit together.

flowchart TB
subgraph DEV["API Engineering"]
CODE[".NET 10 API"]
OAS["OpenAPI Contract"]
CI["CI/CD Pipeline"]
CODE --> OAS
OAS --> CI
end

    subgraph RUNTIME["Runtime Platform"]
        APIM["Azure API Management"]
        BACKEND["Backend Services"]
        CONSUMERS["Applications and Partners"]
        CONSUMERS --> APIM
        APIM --> BACKEND
    end

    subgraph GOVERNANCE["Enterprise API Governance"]
        CENTER["Azure API Center"]
        INVENTORY["API Inventory and Metadata"]
        DISCOVERY["Developer Discovery"]
        CENTER --> INVENTORY
        INVENTORY --> DISCOVERY
    end

    CI -->|"Publish API definition"| APIM
    APIM -->|"Synchronise APIs and definitions"| CENTER

The flow is straightforward:

1. Developers build APIs using .NET.
2. OpenAPI documents are generated as part of the engineering process.
3. The CI/CD pipeline validates and publishes API definitions.
4. Azure API Management provides the runtime gateway and governance layer.
5. Azure API Center synchronises the API estate into a central inventory.
6. Developers and architects use that inventory to discover and reuse existing APIs.

The pipeline and integration steps should be implemented with appropriate automation and access controls. The diagram describes the logical architecture rather than a claim that every step is configured automatically by default.

## Make governance part of CI/CD

Having the right Azure services is only part of the solution.

The real benefit comes when these capabilities become part of the software delivery lifecycle.

I'd look to establish a pipeline with several distinct stages.

**Stage 1 – Build**

Compile the .NET application.

Run unit and integration tests.

Generate the OpenAPI document.

**Stage 2 – Validate**

Validate the OpenAPI document against its specification.

Check naming and documentation conventions.

Detect breaking contract changes.

Validate security metadata and required API standards.

**Stage 3 – Publish**

Publish the API definition to the appropriate API Management environment.

Apply or validate the required API policies.

Verify the API configuration.

**Stage 4 – Discover**

Synchronise the API into Azure API Center.

Enrich the inventory with ownership and business metadata.

Make the API discoverable to other teams.

I would also introduce contract compatibility checks into pull requests.

For example, changing a response property from optional to required, removing an operation or changing a data type can introduce breaking changes for consumers.

These should be identified before the change reaches production.

The goal isn't to create another approval bottleneck. It's to give development teams rapid feedback and make good API engineering practices repeatable.

## Why this matters even more in the age of AI

There is another reason to take API discoverability seriously.

AI agents increasingly need to interact with enterprise systems, retrieve information and perform actions.

An organisation that cannot reliably discover, understand and govern its APIs will struggle to expose those capabilities safely to AI-powered applications.

OpenAPI provides a machine-readable contract. API Management provides an important runtime control point. API Center provides a way to discover and understand the wider API estate.

These capabilities create a useful foundation for AI readiness.

They don't automatically make an API suitable for agent consumption, however.

Agent-facing interfaces still need deliberate consideration around:

1. Authentication and delegated identity.
2. Authorisation and least privilege.
3. Clear operation descriptions.
4. Input and output schemas.
5. Rate limiting and resource consumption.
6. Auditability and observability.
7. Human approval for sensitive operations.

Model Context Protocol (MCP) introduces another way to expose tools and capabilities to AI clients.

Rather than assuming every existing API should become an MCP server, I would start by identifying which business capabilities are appropriate for agent consumption and how they should be exposed.

API Management has capabilities for exposing APIs as MCP servers, but the suitability of individual operations, security model and platform support must still be assessed.

The underlying API estate remains important. A well-governed API is a much stronger starting point than an undocumented endpoint with unclear ownership.

## Final thoughts

API management is often approached as a gateway implementation project.

That is an important part of the journey, but it isn't the whole picture.

Organisations need to consider the complete API lifecycle: design, development, documentation, validation, publication, runtime management, discovery and eventual retirement.

.NET provides a strong foundation for building APIs and generating their contracts. OpenAPI provides a standard way of describing those capabilities. Azure API Management provides runtime governance, while Azure API Center provides the enterprise inventory and discovery layer.

Together, they help move API governance away from spreadsheets, disconnected documentation and individual team knowledge towards a more consistent engineering capability.

My view is simple:

**An API that nobody can discover, understand or confidently reuse is an organisational asset that isn't delivering its full value.**

The opportunity isn't just to manage APIs better. It's to make the capabilities of the organisation easier to find, consume and ultimately innovate with.
