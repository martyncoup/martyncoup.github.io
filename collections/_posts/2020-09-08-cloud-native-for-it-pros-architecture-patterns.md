---
layout: post
title: "Cloud Native for IT Pros: Architecture Patterns"
date: 2020-09-08 20:26:00.000000000 +01:00
description: "When it comes to the cloud, building scalable, secure, and reliable applications is key. I wrote this post with the cloud in mind, the same principles can apply to any system. So first, let’s look at the key challenges when developing in the cloud."
layout: post
authors: ["Martyn Coupland"]
categories: ["Cloud Native", "IT Pro"]
thumbnail: "/assets/images/posts/2020/09/13eca-photo-1545987796-200677ee1011.jpg"
image: "/assets/images/posts/2020/09/13eca-photo-1545987796-200677ee1011.jpg"
---

# Challenges of cloud

I would categorise the challenges into eight specific ones, but what are they and what does each one mean?

## Availability

Usually measured as a percentage, also known as uptime. Availability is the percentage of time within a specific period that the application is functioning and working. This is typically measured using a service level agreement.

## Data

One of the key elements of cloud applications is data management. Data can be static or dynamic. To address many of the challenges listed, I would typically host data in many locations. This can present it’s own challenges. For example, data consistency over many different locations.

## Design

I always consider how easy a solution is to manage, do I follow a component based design, and where possible reuse any components in any design.

## Messaging

The distributed nature of cloud applications requires a messaging infrastructure that connects components and services, ideally in a loosely coupled fashion to maximize scalability. Asynchronous messaging is widely used and offers many advantages, but also presents challenges like message order, handling of poisoned messages, idempotence, etc.

## Management

Cloud applications run in a remote data center where you do not have complete control over the infrastructure or, in some cases, the operating system. This can make management and monitoring more difficult than local deployment. Applications should display runtime information that administrators and operators can use to manage and monitor the system. As well as support changing business requirements and customization without the need to stop or republish the app.

## Performance and Scalability

Performance is an indication of a system’s responsiveness to perform any action within a given time frame, while scalability is the ability of a system to handle load increases without impacting performance or to rapidly increase available resources. Cloud applications typically encounter varying workloads and spikes in activity. Predicting them, especially in a multi-tenant scenario, is nearly impossible. Instead, applications should be able to scale within limits to meet peak demand and scale when demand decreases. Scalability isn’t just about compute instances, but other things like data storage, messaging infrastructure, and more.

## Resiliency

Resilience is the ability of a system to properly handle and correct errors. Because of the nature of cloud hosting, where applications often have multiple tenants, use shared platform services to compete for resources and bandwidth, communicate over the Internet, and run on off-the-shelf hardware, there is an increased likelihood of both temporary and more permanent errors. I consider the ability to detect errors and recover quickly and efficiently to maintain resilience.

## Security

Security is the ability of a system to prevent malicious or accidental actions outside of intended use and to prevent the disclosure or loss of information. Cloud applications are exposed on the Internet outside of local trusted boundaries, are often open to the public, and can serve untrusted users. I design and implement in a way that protects them from malicious attacks, restricts access to approved users only, and protects sensitive data.

# Architecture Patterns

I would say that well over 30 patterns exist that can help resolve some of the issues we explored above. Given the nature of the post, I want to focus on the ones which help IT pros gain a better understanding of cloud native.
With that, I want to explore two common patterns I use with my clients and what scenarios they work well and can be used. As well as looking at the issues with those patterns.

## Anti-Corruption Layer

In cloud architecture, often we are working with legacy systems deployed on cloud platforms. I often find it a common scenario to have to have modern cloud applications speak to legacy systems. You can implement a layer between the modern application and the legacy system know as an anti-corruption layer.

This implementation overall, helps with both design and management challenges. If you think about some of the implementations you have done recently, you may have implemented this pattern without realising it.

I would always advise wherever possible to make sure you move all of an application at once during migration. This reduces complexity around latency especially. However, where this is either not possible or even after migration, like in the diagram above. One application has gone through a modernisation effort and the other is still on infrastructure services then this pattern can help you.

In the example above, you can see that I have a legacy system hosting our application and data store on virtual machines. Before the migration to the cloud, I deployed our service on the left on virtual machines. Since the migration, this has converted to Azure Function Apps acting as microservices. But, both applications still need to communicate.

It is highly possible that this upgrade may break communication between the two systems. This is where the anti-corruption layer comes in. Using the example above, you can see we introduced an API to perform this role, it keeps the communication consistent. Also, it allows one system to remain unchanged without compromising design and approach.

## Static Content Hosting

For web applications, static content can make up a significant portion of the browers request. So it is common for static content such as JavaScript and stylesheets (CSS) to be deployed to cloud based storage and/or content delivery networks CDNs to enable the content to be served directly to the client.

Web servers are great at dynamic content and caching of output, but static content still needs to be handled. This can use vital processing cycles that can be put to better use. I would always consider the security implications of this pattern before implementation. Always ensure you only allow requests from trusted locations. I would look at using a valet key or another form of access control for this.</p>

If I am exposing static content then I want to optimise my hosting costs, this would be a great pattern to achieve that. I can also locate content globally using a CDN, this pattern enables this.

In Azure, I can enable a storage account to serve static content, by default this would be using the normal subdomain associated with a storage account. I can then generate a shared access signature to secure access and prevent any hotlinking.

I could extend this solution further by adding Azure CDN, which wold allow me to globally distribute my content on the Microsoft content delivery network. This means my content is then delivered from the closest geographic location to the requestor.

# Summary

I hope you found this information useful, even better if you recognise you have been doing this anyway and didn’t know it had a name. Check out some posts in the future where I look at patterns in more detail.
