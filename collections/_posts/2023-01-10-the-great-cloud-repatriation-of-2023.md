---
layout: post
title: "The Great Cloud Repatriation of 2023"
date: "2023-01-10 13:33:00.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Cloud", "Migration", "Management", "Thought"]
image: "https://cdn.m12d.com/posts/the-great-cloud-repatriation-of-2023/network-gedb7251c2_640.jpg"
thumbnail: "https://cdn.m12d.com/posts/the-great-cloud-repatriation-of-2023/network-gedb7251c2_640.jpg"
---

You may be hearing a lot about cloud repatriation. In this post I am going to cover off some of this in more detail, why, what, how. It's important to realise that cloud repatriation is real, lots of people are writing about it, lots of businesses are executing on it. What does it all mean? I'm going to look at this generically, rather than specific to a region.

## Introduction

Cloud repatriation is the process of moving data, applications, and other workloads from a public cloud back to an organization's on-premises infrastructure or a private cloud. This can be done for a variety of reasons, such as security concerns, regulatory compliance, or a desire to have more control over data and infrastructure.

The process of cloud repatriation typically involves several steps, such as assessing the workloads and data that need to be moved, designing a migration plan, testing the migration, and then executing the migration. It also includes operating the repatriated workloads and providing support for them.

One important aspect of cloud repatriation is data governance, which refers to the management of data throughout its lifecycle. This includes ensuring that data is accurate, complete, and protected, as well as ensuring compliance with relevant regulations and laws.

There are a variety of reasons why organisations may choose to repatriate their data and workloads from the public cloud. One of the most common reasons is to address concerns about security and compliance. Public cloud environments may not provide the same level of security and compliance controls as an organization's own on-premises or private cloud infrastructure. Additionally, organisations may have concerns about the privacy of their data in a public cloud environment.

Another reason why organisations may choose to repatriate their data and workloads is to reduce costs. While public cloud environments can be more cost-effective for certain types of workloads and use cases, they may not be the most cost-effective solution for all types of workloads and use cases. organisations may also find that the costs associated with maintaining and managing their own on-premises or private cloud infrastructure are lower in the long run.

Repatriation process is not simple and it require a proper planning and execution. One must have a clear understanding of their current and future requirements, cost analysis, evaluating the alternative options available, and assessing the impact on the overall business.

Repatriation also requires a strong support of IT team who are familiar with both the public cloud and on-premises/private cloud environments. They will be responsible for migrating data, applications, and workloads from the public cloud back to the organization's own infrastructure. This process can be time-consuming and complex, and may require specialized skills and expertise.

## Reasons for repatriation
I touched briefly on some of the reasons why organisations may consider repatriation of their workloads. I wanted to now look to expand this list and go a little bit into some of the reasons.

* Security concerns
* Compliance requirements
* Cost
* Latency
* Control and customisation
* Vendor lock-in

### Security concerns
Some companies may have concerns about the security of their data and applications when they are hosted on a public cloud, and may prefer to host them on-premises or on a private cloud for added security.

All of the public cloud vendors have had incidents when it comes to security, in Azure, think about the CosmosDB incident, and storage incidents. But, can you say your own data centre would be more secure?

### Compliance requirements
Some companies may have legal or regulatory compliance requirements that can only be met by hosting data and applications on-premises or on a private cloud.

The world of compliance adds complexity anywhere, but sometimes, they mean moving the workload back on-premises.

### Cost
While the cloud can be cost-effective in the short term, some companies may find that the costs of running applications and storing data on a public cloud long-term can be higher than expected.

### Latency
Some companies may experience high latency when running applications or accessing data hosted on a public cloud, particularly if they have users located in different regions.

### Control and customisation
Some company may want more control and ability to customize their infrastructure and the services they are using, which might not be available on certain public cloud platform.

### Vendor lock-in
Some companies may be concerned about vendor lock-in, where they become heavily reliant on a particular cloud service provider and would face significant challenges if they decided to move to a different provider.

## Improving the outlook for customers
With all this said, I think the future is still bright for cloud technology, and you can learn from the mistakes others have made. Cost management is still one of the things I talk to customers about. Helping model costs in the future is important in a true pay as you go environment.

When it comes to cost, I still believe that most organisations do not have a handle on how to switch their operating model to accommodate flexible costs. This is where practices like {{<newtabref href="https://finops.org/" title="FinOps">}} come into their own.

As for technical debt, the cloud is not an answer to your technical debt. A problem on-prem, not dealt with in an appropriate way is still technical debt in the cloud.

A lot of these issues, especially cost and technical debt can be overcome with innovation. The issue with innovation is that most organisations don't take advantage of the technology available. Again, many reasons for this, probably another blog post.

The fact is though, if you just lift and shift your workloads, and continue to add workloads on VM based technology, chances are, it will be more expensive than cloud-native based technology.

## Summary
It's worth noting again that, repatriation process is complex and time consuming, also it require a lot of planning, testing and resources. If you thought that migration to the cloud was complex, it can be even more complex to pull that back out of the cloud.

I can highly recommend reading this post {{<newtabref href="https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0" title="David Heinemeier Hansson">}} of Basecamp and HEY fame for his explanation. It's well balanced, considered, and does a good job of expanding on some of the points I have made above, in the context of their organisation.