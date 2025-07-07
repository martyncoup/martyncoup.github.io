---
layout: post
title: "Azure DevOps 101: Pipelines"
date: 2019-07-29 20:54:00.000000000 +01:00
description: "Let me start by saying fundamentally, Azure DevOps is a platform agnostic tool. You can use many different languages to deploy to many platforms. If you build in Node.JS, Python, Java, PHP, Ruby, C/C++, or .NET then you can use Azure DevOps. Likewise, if you deploy to Azure, AWS, GCP or even on-premise then you can use Azure DevOps. This makes it a really powerful tool. As expected, you can also deploy containers and push images to various different registries."
layout: post
authors: ["Martyn Coupland"]
categories: ["Azure DevOps"]
thumbnail: "/assets/images/posts/2019/07/822b2-photo-1612438137269-70c848e102e1.jpg"
image: "/assets/images/posts/2019/07/822b2-photo-1612438137269-70c848e102e1.jpg"
---

Let me start by saying fundamentally, Azure DevOps is a platform agnostic tool. You can use many different languages to deploy to many platforms. If you build in Node.JS, Python, Java, PHP, Ruby, C/C++, or .NET then you can use Azure DevOps. Likewise, if you deploy to Azure, AWS, GCP or even on-premise then you can use Azure DevOps. This makes it a really powerful tool. As expected, you can also deploy containers and push images to various different registries.

# Pipelines

Azure DevOps supports building both continuous integration and continuous deployment pipelines, this provides you with the ability to both build and test your code, as well as deploy it to your platform of choice.

Pipelines are executed on agents which belong to groups known as agent pools. By default, your project will include Azure Pipelines as an agent pool which executes your pipelines in the cloud. If you need connectivity to your local network, then you can deploy self-hosted agents on your own virtual machines, this allows the execution of the pipeline to take place locally, thus have access to local resources.

At the time of writing a feature which is in preview allows you to deploy agents to a VM scale set in Azure, this allows the scaling capabilities to come into their own and scale the set of VMs when needed. Meaning just like the cloud based agents, you only use what you need.

# Marketplace content

I've mentioned the marketplace before, it's a powerful part of the toolset and many people including Microsoft have created addon content for Azure DevOps. I use a fair number of addons as part of pipelines generally speaking.

In previous roles I have made use of the <a href="https://marketplace.visualstudio.com/items?itemName=ms-vsclient.app-store" rel="noreferrer noopener">Apple App Store</a> integration to publish my built applications directly to the App Store, this is a great addon which saves a whole bunch of time.

I've also used quality tools like the <a href="https://marketplace.visualstudio.com/items?itemName=alanwales.resharper-code-analysis" rel="noreferrer noopener">Resharper Code Quality Analysis</a> tool, <a href="https://marketplace.visualstudio.com/items?itemName=mspremier.BuildQualityChecks" rel="noreferrer noopener">Build Quality Checks</a>, <a href="https://marketplace.visualstudio.com/items?itemName=louisgerard.slackposter" rel="noreferrer noopener">Post to Slack</a>, <a href="https://marketplace.visualstudio.com/items?itemName=azsdktm.AzSDK-task" rel="noreferrer noopener">Secure DevOps Kit</a> and many more. It's safe to say that if you want to integrate with the majority of common tools then you will likely find a method of integration here.

# Gates

A really useful feature I like is the ability to introduce gates to the process of your pipeline. You can do any number of things with the gate including integrate with service management tooling for gaining approvals, checking for outstanding bug work items in the current sprint, any number of things, this will enable you to have a level of quality assurance above the items in the pipeline which are executing. The integration with external tools just makes the suite my complete in my opinion and means we can leverage tools like ServiceNow to complete any approvals we need or even just log a ticket to say we are performing a build or release.

# YAML and Classic

Azure DevOps supports editing pipelines using two methods, either classic which is a GUI style interface where you define your pipeline to build your code and then publish artefacts you may need. Your release pipeline will then consume the output of the previous pipeline and deploy the artefacts to your deployment targets.

You can also use a YAML file called azure-pipelines.yaml and commit this file with the rest of your application to your Git repository. The pipeline is then versioned with the rest of your code, following the same branching structure, you may also make use of pull requests to do code reviews on your new pipeline.

The basic steps are as follows:

1. Configure the Azure Pipelines feature to use your repo.
2. Edit the azure-pipelines.yaml file to define your build.
3. Commit your code, which will kick off a default trigger to build and deploy then monitor the results.

It takes time to get use to the syntax for YAML, especially if you have used the classic interface for some time, however you can have numerous options available to you which you may not in the classic editor. It also enables you to very easily define templates for your pipelines which you can make repeatable in your workflow.

The official <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops#feature-availability" rel="noreferrer noopener">documentation</a> has a list of features which are supported in either the YAML or classic scenarios.
