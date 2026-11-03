---

layout: post
title: "Adding GitHub Azure Boards to Organisations"
date: "2021-05-14 15:39:52.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["DevOps and Platform Engineering"]
thumbnail: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=640"
image: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=1600"
---

For this post, I will walk through the process of adding the ability to see repositories in GitHub Organisations to your Azure DevOps instance.

When you are using Azure DevOps Boards, you have the choice of repositories to use to link your commits and pull requests back to work items you create in the Boards functionality.

Adding a connection to GitHub
-----------------------------

It's pretty easy to add your connection through to GitHub, from your project settings, simply click **GitHub connections**, from there you can then proceed click **Connect your GitHub account**. Once you have gone through the authentication process, you should see a list like this.

![](/content/images/2021/05/image-6.png)

Figure 1 - Screenshot showing the list of available repositories.

This is great, however repos that belong to organisations are not listed here. This is happening because when you authenticated in the previous step, you were authenticating to your personal account rather than your organisation account.

Adding Azure Boards to your organisation
----------------------------------------

In order to see your organisations repos, we need to enable the access in a slightly different way.

The first step, is to navigate to the Azure Boards application on the [GitHub Marketplace](https://github.com/marketplace/azure-boards). From here, either click the **Set up a plan** button at the top or simply scroll down to the bottom of the page.

![](/content/images/2021/05/image-8.png)

Figure 2 - Account selection dropdown box for the application installation.

Click the account dropdown and you should see your organisation listed, as I can in the screenshot above. You can see for me it's already deployed, but you should be able to select your organisation from the dropdown. The next step is to click the **Install** **it for free** button.

You will be taken to a checkout screen, but it's free, so you can confirm your purchase. Next you will be asked to authorise for all repositories, or only selected repositories.

![](/content/images/2021/05/image-9.png)

Figure 3 - Screenshot showing installation options.

At this point, you can select your preferred option and click **Install & Authorize**, you will be redirected to Azure DevOps to complete the authentication process.

Confirming your connection
--------------------------

When the process is completed, you will then be able to see your connection configured in the **GitHub connections** screen, as you can see below.

![](/content/images/2021/05/image-10.png)

Figure 4 - Screenshot showing GitHub connection in Azure DevOps.

If you want to add new repos, or remove old ones, simply go to your organisation account in GitHub, click on **Installed GitHub Apps** under **Settings**. Then next to Azure Boards, just click **Configure**, where you will be able to select more repositories, remove old ones, or authorise for all repositories as well as suspend the installation or uninstall the application.

![](/content/images/2021/05/image-11.png)

Figure 5 - Screenshot showing the all or select repositories option for the Azure Boards application.