---

layout: post
title: "The Great IaC Conundrum"
date: "2022-02-11 14:01:02.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["DevOps and Platform Engineering"]
thumbnail: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=640"
image: "https://images.unsplash.com/photo-1593153041370-5ebf6b82886a?q=80&w=1600"
---

When it comes to Infrastructure as Code, today, you are presented with a number of options. What are the best way to interpret the options available, and when should you use one or the other? This post gives an honest of the options available.

The options are endless, we are going to look at Bicep, ARM, Terraform, and Pulumi. Others are of course available, but this post features the main options when working with Microsoft Azure.

What is infrastructure as code?
-------------------------------

Traditionally, we would deploy our infrastructure using wizards or templates built into solutions we used to manage our environments. This evolved to using things like PowerShell to automate the tasks around infrastructure deployment and management. Infrastructure as Code is the management of infrastructure in a descriptive model.

There are generally two approaches; [declarative](https://en.wikipedia.org/wiki/Declarative_programming) (functional) vs. [imperative](https://en.wikipedia.org/wiki/Imperative_programming) (procedural). The difference between the declarative and the imperative approach is essentially _what _versus _how _. The declarative approach focuses on what the eventual target configuration should be; the imperative focuses on how the infrastructure is to be changed to meet this.

The declarative approach defines the desired state and the system executes what needs to happen to achieve that desired state. Imperative defines specific commands that need to be executed in the appropriate order to end with the desired conclusion.

Stateful vs stateless
---------------------

Two other important concepts surround state management. Solutions are either stateful or stateless. Stateful infrastructure as code uses an approach where a file containing the current state of the environment is stored. This file is then referenced during the execution of the environment build to determine the changes needed.

Stateless performs the same result, but without the need for storing state in a file. For example, Bicep is stateless, and the engine checks what you have described and if changes are needed, those changes are executed. Terraform uses state management and this file is the source of truth for how the environment is configured.

The result is the same, the execution is ultimately the same, from experience using stateless solutions add no real tangible overhead to using state based solutions. In fact, the correct management of the state file can add an operational overhead in some scenarios.

For all environments I have written either state or stateless based templates, the execution time is on the whole the same, ranging from small environments, to large enterprise solutions.

Continuous integration and deployment
-------------------------------------

Using solutions such as Azure DevOps or GitHub for your source code management means you can integrate your template deployments into Continuous integration (CI) or Continuous deployment (CD) pipelines, bringing the benefits of DevOps to your infrastructure management.

Using pipelines gives you the ability to automate your deployment workflow, this could be around automated testing and What If analysis of the results, to security testing, policy compliance, and of course approval management.

Bicep
-----

First up, let's take a closer look at Bicep. Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. In a Bicep file, you define the infrastructure you want to deploy to Azure, and then use that file throughout the development lifecycle to repeatedly deploy your infrastructure.

Bicep was introduced by Microsoft as a way to take some of the complicated expressions and verbosity required out of creating templates using JSON in Azure Resource Manager (ARM). Bicep templates can be compiled into ARM templates, and are executed as JSON when executed, but Bicep provides a cleaner experience for the template author.

Here is an example of creating a storage account using Bicep.

```
resource sa 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: 'sa'
  location: location
  sku: {
    name: 'Standard\_LRS'
  }
  kind: 'StorageV2'
  properties: {}
}
```

Bicep is also a stateless language, meaning that no file is required to store the current state of the infrastructure. You can natively execute Bicep locally on your machine using the available tools and extensions, as well as execute from your pipelines.

Getting started using VS Code is very easy. You can use the Bicep extension to provide Intellisense support to the interface to help you write templates and make use of pre-defined snippets.

The following page provides a great tutorial for writing your first Bicep template: [https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code)

ARM
---

Azure Resource Manager (ARM) is the deployment and management service for Microsoft Azure. Using a JSON schema, you can write templates which describe your infrastructure, execute them and, the resources defined in your template will be built and configured in the way you have described.

Much like Bicep, you can author these templates using VS Code as well as use a JSON extension to provide styling to your templates and define the schema path to have your JSON documents validated against that schema.

There is also support for using CI/CD tooling to automate the processes involved in your organisation with releasing template changes. Templates written in ARM can quickly and easily become complex. Adding loops, nested templates, references to resources can all add to the complexity of building templates in ARM.

As both Bicep and ARM are so closely linked, you can't not talk about them together, they both after all produce the same result. While Bicep has modules, you can achieve the same thing using linked templates in ARM.

This modular approach follows standard software engineering best practices, and produces reusable templates in different scenarios, reducing your overall codebase. Linked templates are a separate file you can link towards which holds a part of your deployment. Unfortunately linked templates cannot be a local file. The file must be accessible through an URL. This can be a link to a storage account or a public repository like GitHub.

Given the close relationship between Bicep and ARM, it will not be a shock that ARM is also a stateless solution.

Terraform
---------

Terraform is a template solution from [Hashicorp](https://www.terraform.io/). The solution is open source, and is used for provisioning and managing your cloud infrastructure. Terraform makes use of a command line interface (CLI). The Terraform CLI provides a simple mechanism to deploy and version the configuration files to Azure.

Terraform's template-based configuration files enable you to define, provision, and configure Azure resources in a repeatable and predictable manner. Terraform is also capable of deploying infrastructure across multiple cloud providers. It enables developers to use consistent tooling to manage each infrastructure definition.

Here is an example of Terraform to create a storage account.

```
resource "azurerm\_resource\_group" "example" {
  name     = "resourceGroup"
  location = "West Europe"
}

resource "azurerm\_storage\_account" "example" {
  name                     = "sa"
  resource\_group\_name      = azurerm\_resource\_group.example.name
  location                 = azurerm\_resource\_group.example.location
  account\_tier             = "Standard"
  account\_replication\_type = "LRS"
}
```

While not the same, writing Terraform looks very similar to Bicep, the syntax of both platforms is different, templates are not interchangeable between solutions, however if you are used to writing Bicep or Terraform, you should, once you learn the syntax be able to quickly switch between the two. Terraform actually makes use of the domain-specific language HCL (Hashicorp Configuration Language).

Terraform does make use of a state file to store the configuration. If we take a look at the lifecycle of Terraform, it includes the following steps.

*   Init - terraform init
*   Plan - terraform plan
*   Apply - terraform apply
*   Destroy - terraform destroy

The generated state file is used in the plan state to look at what is deployed today, and compare against the desired state from your Terraform templates. Plan creates an execution plan to reach the desired state of the infrastructure. Apply then makes those changes as defined in the plan.

Finally, destroy is used to delete old resources, these are marked as tainted during the apply phase. One advantage of using Bicep is that new features are immediately available, Terraform may take some time to include the new features.

Pulumi
------

Our final platform to look at is Pulumi, which takes a different approach than the other three solutions. Where our other three solutions make use of either JSON or a domain-specific language, Pulumi uses traditional programming languages to achieve the same result as the other three solutions.

Let's look at two examples. Let's look at how you deploy a resource group and storage account within that resource group. First of all using TypeScript.

```
import \* as resources from "@pulumi/azure-native/resources";
import \* as storage from "@pulumi/azure-native/storage";

const resourceGroup = new resources.ResourceGroup("resourceGroup");

const storageAccount = new storage.StorageAccount("sa", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: "Standard\_LRS",
    },
    kind: "StorageV2",
});
```

Next, let's look at deploying the same, but this time using C#.

```
using Pulumi;
using Pulumi.AzureNative.Resources;
using Pulumi.AzureNative.Storage;
using Pulumi.AzureNative.Storage.Inputs;

class MyStack : Stack
{
    public MyStack()
    {
        var resourceGroup = new ResourceGroup("resourceGroup");

        var storageAccount = new StorageAccount("sa", new StorageAccountArgs
        {
            ResourceGroupName = resourceGroup.Name,
            Sku = new SkuArgs { Name = "Standard\_LRS" },
            Kind = "StorageV2"
        });
    }
}
```

I appreciate unless you know both languages you may not understand what is happening in both of these examples. Hopefully you can see that using their own respective languages and SDKs available from Pulumi, you can use your usual language to deploy and manage your infrastructure.

Infrastructure can be defined in JavaScript, TypeScript, Python, Go, or any of the .NET languages such as C#, F#, and VB.

Pulumi also makes use of state to store metadata about the infrastructure. Just like Terraform a number of state locations are available. You can use either a self-managed solution such as your Azure Blob Storage, or make use of a Pulumi managed service.

Summary
-------

Like many things in technology, no solution is a one size fits all. Working with infrastructure as code for multiple clients, could be a case of using the solution that the client is most comfortable with, which presents another skills challenge for service providers and consultancy providers.

If you are using infrastructure as code for your own needs, then work with the solution that best fits the skills of the people in your team. For example, if nobody in your team has development experience, then writing in Pulumi would potentially not be a great idea.

Consider your goals, what you are trying to achieve and what other tooling you have available and tooling you want to integrate with. These factors will help you understand which solution fits your needs the best overall.

For me, I'm a software developer by trade, I love working with Pulumi, it's available in my native languages. That said, I also find Bicep really easy to use, feature rich, and was simple to get going and understand what I was doing. I flick between the two, depending on the situation and the needs of what I am working on.