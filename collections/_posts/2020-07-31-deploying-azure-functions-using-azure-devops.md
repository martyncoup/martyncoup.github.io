---
layout: post
title: Deploying Azure Functions using Azure DevOps
date: 2020-07-31 20:47:00.000000000 +01:00
description: "To start this post, I want to assume you are already familiar with the process of creating Azure Functions. In order to follow this post, you will need to have an Azure Function already deployed (could be empty though) and a project in Azure DevOps which you have access to."
layout: post
authors: ["Martyn Coupland"]
categories: ["Azure DevOps", "Serverless"]
thumbnail: "/assets/images/posts/2019/07/822b2-photo-1612438137269-70c848e102e1.jpg"
image: "/assets/images/posts/2019/07/822b2-photo-1612438137269-70c848e102e1.jpg"
---

# Clone a test function

If you don't have any code available (I'm using C# functions in this example), you can clone a repository from my <a href="https://github.com/martyncoup/TAGAzureFunctionsPipeline" rel="noreferrer noopener">GitHub</a> account if you wish to follow using the same code.

# Creating a service connection

When you have your function configured in the Azure Portal and you have cloned the repository or have your own ready to go, let's first configure the connection to our Azure Subscription from Azure DevOps.

<figure class="kg-card kg-image-card"><img src="/assets/images/posts/2020/07/func-pipe-arm.png" class="kg-image" alt="" loading="lazy"></figure>

Service principal would be the recommended way to go, if your Azure Subscription and Azure DevOps tenant are in the same directory, you can select the top option for automatic, which will list subscriptions you have available. Otherwise, set up a service principal in Azure AD and select <strong>Service principal (manual)</strong>.

I will be deploying code from GitHub as well, so make in my case I will set up a connection to GitHub as well from the same screen.

# Creating a continuous integration pipeline

Navigate to the Pipelines page in your Azure DevOps project. Create a new pipeline. For this example, I'll use the GUI. First you will need to select the source of your code, remember I'm using GitHub so make sure you select the right options based on where your code is stored.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/07/func-pipe-cisource.png?w=493" class="kg-image" alt="" loading="lazy"></figure>

While you could start from scratch, a good template is available for doing exactly what we need. Scroll down to find Azure functions for .NET from the list, as shown in the following screenshot.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/07/func-pipe-tpl.png?w=614" class="kg-image" alt="" loading="lazy"></figure>

If you are using the repository I have above, then when preparing your build, you may want to add the subdirectory in the path to the project in the build step. This ensures the command can find the .csproj file and complete the build.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/07/func-pipe-project.png?w=857" class="kg-image" alt="" loading="lazy"></figure>

Finally, on the Triggers section, enable continuous integration for the pipeline so it automatically executes upon a commit to the master branch, as per the default filters.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/07/func-pipe-ci.png?w=767" class="kg-image" alt="" loading="lazy"></figure>

When you have finished, save and run the pipeline at this point to ensure that your build completes. Your build request will be queued until the job can be completed. When completed, you should be able to see something similar to what is in place below.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/07/func-pipe-cidone.png?w=866" class="kg-image" alt="" loading="lazy"></figure>

# Creating a continuous deployment pipeline

Now we have a successful build, we should now create a pipeline which is responsible for taking the code built in the previous pipeline and deploys it to the Azure Function.

When you create a new pipeline, you can pick a template, this will add in the steps to deploy to an Azure Function. I'm using the option without slots for this example.

You will first need to configure the initial parameters, selecting your subscription service connection, the type of application and the name of the app service. You should now have a screen which looks as shown below.

Now you have configured the deployment stage, you will need to link the deployment pipeline by setting up the deployment trigger. You can do this by adding an artifact from the main pipeline screen.

On the screen which displays, select the continuous integration pipeline from the previous step, notice here that the version is always shown as latest.

Finally, click the lightning bolt in the top right corner of the artifact and enable the continuous deployment trigger. When you have finished, save the pipeline.

Now create a new release from the pipeline you have created, you can do this in the pipeline view by clicking <strong>Create release</strong>. At this stage the job will now execute and deploy the artifact from the build to the function app you configured.

Go to the Azure portal, now check on your Azure Function, click Functions in the pane and you should see your function deployed.

# End to end testing

Now we have everything set up, you can make a commit to the repository and then you will see the build pipeline execute, followed by the release pipeline. Here you can see the updated build running from a commit.

You should also see something similar on the release pipeline and your updated function will be deployed to Azure and executing as desired.
