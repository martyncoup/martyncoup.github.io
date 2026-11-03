---

layout: post
title: "Deploying to App Services with GitHub Actions"
date: "2020-10-19 20:16:00.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["App Services", "Azure", "GitHub Actions"]
thumbnail: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=640"
image: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=1600"
---

I initially migrated the blog over from Wordpress over to [Jekyll and a Static Web App in Azure](https://m12d.com/2020/09/11/migrating-to-azure-static-web-apps.html). I was very happy with how quick it was to do and how easy it is to setup. You even get a free SSL certificate included with the Static Web App. However you cannot use naked domains (without the www or anything), and while I can easily point everything to include this, I generally find it cleaner on URLs without it.

Migrating to a regular App Service won’t actually solve this problem either, as you can still get a free SSL certificate using the [App Service Managed Certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#create-a-free-certificate-preview) functionality, however this also does not support naked domains. What is supported though is Let’s Encrypt.

In fact, if you are running a Windows stack on your App Service, you can install an extension which automates the whole process after the initial installation. This is very helpful and takes the management out of the Let’s Encrypt certificates. You can also issue them on the command line using Certbot as well and OpenSSL. This is very handy if you are running a Linux App Service Plan where extensions are not supported.

### Building the GitHub Actions file

Without further delay, let’s look at how you can build the GitHub Actions file to take your code from your repository and deploy the Jekyll powered site into your Azure App Service. We will follow the following steps to achieve this:

1.  Execute on either a push to master or pull requests to master
2.  Checkout code from repository
3.  Install Ruby
4.  Install Bundle dependencies
5.  Execute a Jekyll build
6.  Deploy to our Azure App Service

It’s quite a simple process and we can achieve this in less than 50 lines of YAML.

First of all we need to define how the workflow will be executed, this is defined in the `on` section as shown below. We declare that this workflow will run when pushes occur against the master branch or a pull requests which is opened, synchronized, reopened or closed is executed on the master branch. This allows you to work in development branches without the workflow executing on every commit.

```
on:  push:    branches:      - master  pull_request:    types: [opened, synchronize, reopened, closed]    branches:      - master
```

Next we define the jobs which are executed in the workflow, this is done using the `jobs:` keyword. First, as a security blanket, we can add in an `if` statement, which controls when the jobs run. This statement just matches the conditions we have specified above.

```
jobs:  build-and-deploy:    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
```

Next we move into the steps which start to build the code. First of all we need to define what type of agent the workflow will be executed on. This is done using the `runs-on:` keyword. For this example, we are using `ubuntu-latest`, we also give the job a name, which is **Build and Deploy Job**.

Now we define the steps to checkout the code from the repository, you can do this with the code shown below after the `steps:` keyword.

```
- uses: actions/checkout@v2        with:          submodules: true
```

Now we have a working copy of our source code from Git, we can now install Ruby, this is the programming language used by Jekyll. We can also specify the specific version if required.

```
- name: Install Ruby        uses: ruby/setup-ruby@ec106b438a1ff6ff109590de34ddc62c540232e0        with:          ruby-version: 2.6
```

Next to install all the dependencies found in the Gemfile definition within the Jekyll installation, we execute a basic command, this is built in, so we don’t need the `uses:` keyword for this step.

```
- name: Install Dependencies        run: bundle install
```

We can also execute the build command on the Jekyll CLI the same way, as the dependencies file defines the installation of Jekyll which includes the CLI tools. The following will build the site.

```
- name: Jekyll Build        run: jekyll build
```

Next is the command to push the deployment to our Azure App Service. This can be done a number of ways, in this example I am using the Deployment Profile from the portal. First you will need to define a new secret in the repository settings, call it whatever you like and paste in the contents of the profile and save the secret.

```
- name: 'Deploy to Azure Web App'        uses: azure/webapps-deploy@v2        with:          app-name: 'myappservice'          slot-name: 'production'          publish-profile: $          package: "/home/runner/work/myrepo/myrepo/_site"
```

Notice a few things with the command above. First of all, in the `app-name:` keyword, you need to define the name of the App Service in your Azure subscription. If you are using deployment slots in your App Service, you can also define which deployment slot will receive the deployment. Next you have to define the variable for the secret you have created previously.

Finally, in the `package:` keyword, you will be able to define the path to a directory or a ZIP file you want to deploy, there is no need to create the ZIP file first, simply enter the working path to the `/_site` directory which is the output of the build command for Jekyll. If your path is different to the one above, then you can look at the output of the `jekyll build` command in the workflow and see what the path is.

### Source Code

Here is the source code, you can load this YAML into your GitHub Actions page as a new workflow.

```
name: Build and Deploy Jekyll Site
on:
push:
  - master
pull_request:
  types: [opened, synchronize, reopened, closed]
  branches:
    - master
jobs:
  build-and-deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Install Ruby
        uses: ruby/setup-ruby@ec106b438a1ff6ff109590de34ddc62c540232e0
        with:
          ruby-version: 2.6
      - name: Install Dependencies
        run: bundle install
      - name: Jekyll Build
        run: jekyll build
      - name: 'Deploy to Azure Web App'
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'm12d'
          slot-name: 'production'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: "/home/runner/work/m12d/m12d/_site"
```

### Summary

There you have it, if you still want to make use of the features in an Azure App Service but want to deploy your static web content for example using Jekyll, then this is all there is to it. It’s simple to do and you can still take advantage of all the great features with an Azure App Service.
