---
layout: post
title: Deploying .NET Applications to AKS using GitHub Actions
date: 2020-08-10 20:43:00.000000000 +01:00
description: "To start this post, I want to assume you are already familiar with the process of creating Azure Functions. In order to follow this post, you will need to have an Azure Function already deployed (could be empty though) and a project in Azure DevOps which you have access to."
layout: post
authors: ["Martyn Coupland"]
categories: ["GitHub", "Serverless", ".NET"]
thumbnail: "/assets/images/posts/2019/07/822b2-photo-1612438137269-70c848e102e1.jpg"
image: "/assets/images/posts/2019/07/822b2-photo-1612438137269-70c848e102e1.jpg"
---

In order to test locally, you will also need <a href="https://docs.docker.com/docker-for-windows/install/" rel="noreferrer noopener">Docker Desktop</a> installed on your machine. This should be done before you create your Visual Studio project below.

To start, we need some application code. Using Visual Studio, create a new project, for this walkthrough, I will be using an ASP.NET Core Web Application, I will also be publishing my source code in GitHub, this repository is already cloned locally to my machine.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-new.png" class="kg-image" alt="" loading="lazy"></figure>

This is a sample application, you can see from the screenshot above, I have called the project <strong>HelloWorld</strong> and made the choice to place both my project and solution in the same directory. On your project options window, I have still chosen to use the <strong>Web Application (Model-View-Controller)</strong> template, I have also enabled support for Docker using the <strong>Enable Docker Support</strong> checkbox. Finally, in order to keep the footprint of the application small, I am using .NET Core with ASP.NET Core 3.1.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-cfg.png?w=929" class="kg-image" alt="" loading="lazy"></figure>

In this example, we won’t be doing any development, this is just a sample application we want to run. Publish your Visual Studio project to the file system.

Next, let’s make sure that AKS is ready to accept our configuration and deployment of our container, issue the following command to get the credentials of your AKS cluster.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-getcred.png?w=602" class="kg-image" alt="" loading="lazy"></figure>

Next, we can issue a command to `kubectl` to make sure we have a pool available with Windows as the operating system. As you can see from the screenshot below, we do have the correct configuration to proceed (note the OS column).

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-getnodes.png?w=615" class="kg-image" alt="" loading="lazy"></figure>

When you enabled Docker support when creating your project, you will notice that in the root of your solution in Visual Studio you can see a file called Dockerfile, this is an instructional file that tells Docker how to create and build your container.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-dockerfile.png?w=518" class="kg-image" alt="" loading="lazy"></figure>

This file contains the image that will be used from the main container registry to build your container, it also includes commands on what files to use to build your application and define the entry point for your container.

# Testing the container locally

You can now test the deployment of your image locally if you have Docker Desktop installed, first by building your application using the following command, how you need to run this from the folder where you placed your Dockerfile (due to the path length, I am using the prompt `$g` command to shorten the prompt for display purposes).

If you need to cache files locally because this is the first time you have compiled your container, then this step may take a few minutes, the build process may also take a few minutes, depending on the size of your application. The output from the following command will be quite long as well.

```cli
docker build -t aksdotnet .
```

When this step completes, you will now need to run the container. Use the command below to start the container.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-run.png?w=522" class="kg-image" alt="" loading="lazy"></figure>

Providing all is well when you navigate to <a href="http://localhost:8080">http://localhost:8080</a>, you should be greeted with the default ASP.NET Core welcome page.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-browser.png?w=777" class="kg-image" alt="" loading="lazy"></figure>

# Pushing from source control

Now you can test locally, once you are ready to deploy to the actual container service, you can do this two ways. One using a series of commands that tags the container and deploys it to your Azure Container Registry instance, you can then create a YAML file with the container configuration in and apply the file using the `kubectl` command.

The other way, in my opinion, much more elegant and enables continuous delivery of your containers in this example is using GitHub actions. This time in the portal, head to your AKS service and click <strong>Deployment center (preview)</strong> from the navigation pane. In this post, we will select <strong>GitHub</strong>, authorise permissions to your GitHub account and then select the repository and branch you want to deploy from. The next step of the wizard, should automatically pick up your Dockerfile path, port number, and build context from the contents of the Dockerfile, you should see something similar to below.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-deploy.png?w=446" class="kg-image" alt="" loading="lazy"></figure>

You will then be asked to select a container registry, if you have one, then select your existing ACR. Note for this you will need the admin access enabled in the ACR you create or select. When you click <strong>Done</strong>, the wizard will go ahead and set up the required steps to enable continuous delivery.

Head over to your GitHub repository and click the <strong>Actions</strong> button on the menu. You should see your initial build and deployment starting, you can click the option in the portal to dig into the log file more. Using the default configuration, you’ll realise that the deployment fails.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-log.png?w=473" class="kg-image" alt="" loading="lazy"></figure>

This happens because the defaults in GitHub Actions runs the build on Ubuntu, however, this is a Windows image, we need to modify the deploytoAksCluster.yml file. Change line 4 in the screenshot below to say windows-latest instead of ubuntu-latest.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-yaml.png?w=273" class="kg-image" alt="" loading="lazy"></figure>

When this step finished, you can issue the following command in kubectl to make sure that the pod is running and head over to your public IP address, or private if you don’t have one and check the page is running properly.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-getsvc.png?w=697" class="kg-image" alt="" loading="lazy"></figure>

If everything is working as expected, you should see the following page when you navigate to the IP address.

<figure class="kg-card kg-image-card"><img src="{{site.baseurl}}/assets/images/posts/2020/08/dotnet-aksgha-final.png?w=833" class="kg-image" alt="" loading="lazy"></figure>

There you have it, once you have your application source, deploying to AKS is pretty simple, doing it through a continuous delivery pipeline has many benefits as well, once it’s set up, you can commit code and it will run through the deployment again and again.
