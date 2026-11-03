---
layout: post
title: "Introduction to API Architecture Types"
date: "2023-02-01 08:51:00.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Cloud", "API", "Architecture", "Development", "REST", "GraphQL", "SOAP", "RPC", "Kafka"]
image: "https://cdn.m12d.com/posts/introduction-to-api-architecture-types/architecture-g0766ab6e3_640.jpg"
thumbnail: "https://cdn.m12d.com/posts/introduction-to-api-architecture-types/architecture-g0766ab6e3_640.jpg"
---

An API, or Application Programming Interface, is a set of protocols and tools for building software and applications. It specifies how software components should interact, allowing for communication between different systems, and enables the exchange of data between them. APIs provide a way for different software systems to interact with each other, allowing for integration and automation of specific tasks.

In this post, we will be taking an introductory look at the different architecture types available to developers when designing their APIs. We will be covering the following types:

* REST
* GraphQL
* SOAP
* RPC

## REST
REST, or Representational State Transfer, is a type of web architecture and a set of constraints that are usually applied to web services development. RESTful APIs use HTTP requests to POST (create), PUT (update), GET (read), and DELETE (delete) data.

A RESTful API is an API that follows the REST architectural style and constraints, which provide a standard for creating web services. RESTful APIs are easy to scale and maintain and are often used to build web services for modern applications. They are stateless, meaning that calls can be made independently of one another, and they do not store client context on the server between requests.

In total, REST APIs follow six constraints, these are:

1. Uniform interface
2. Client-server
3. Stateless
4. Cacheable
5. Layered system
6. Code on demand (optional)

You can read more on these constraints on the following {{<newtabref href="https://restfulapi.net/rest-architectural-constraints/" title="page">}}.

Generally speaking, REST APIs use either plain text, HTML, XML, or more commonly JSON as a data type. REST is the most common format used on the web today.

## GraphQL
GraphQL is a query language for APIs, as well as a runtime for executing those queries against your data. It was developed by Facebook in 2012 and released as an open-source project in 2015.

GraphQL differs from traditional REST APIs in that it allows the client to request exactly the data it needs, rather than having the server provide a fixed set of data. This results in less over- or under-fetching of data, and can simplify the creation of APIs that support multiple client types.

In GraphQL, the client makes a single request to the GraphQL server, specifying the data it needs. The server then returns a JSON object that exactly matches the shape of the requested data. This eliminates the need for multiple round trips to the server and reduces the amount of data transferred over the network.

GraphQL also provides a type system that allows the server to validate a client's request, ensuring that the data returned is of the correct type and structure. This can help reduce the risk of unexpected errors and improve the reliability of the API.

## SOAP
SOAP, or Simple Object Access Protocol, is a protocol for exchanging structured information in the implementation of web services. It uses XML as its message format, and relies on other application layer protocols, primarily HTTP and SMTP, for message negotiation and transmission.

SOAP APIs are web APIs that use the SOAP protocol for communication. They define a standard way of encoding messages sent over the internet, and specify a set of rules for how two systems should exchange information using the protocol.

SOAP APIs can be used to build a wide range of applications, including those that require secure, reliable and transactional messaging. They provide a way to access web services over the internet and can be used with a variety of programming languages, including Java, .NET, and PHP.

SOAP has a number of features, including support for secure and reliable messaging, extensibility, and support for advanced features such as transactions. However, it is generally seen as being less lightweight and less flexible than more modern API technologies such as REST and GraphQL.

## RPC
RPC, or Remote Procedure Call, is a protocol for making a request from one computer to another, usually over a network, to execute a specific procedure or function. The requesting computer is usually referred to as the client, and the remote computer that executes the procedure is referred to as the server.

An RPC API is a type of API that uses the RPC protocol for communication. The client sends a request to the server to execute a specific procedure, and the server returns a response with the result of that procedure. This allows for a high level of abstraction, as the client can call procedures on the server as if they were local to the client, even though they are actually executing on a remote machine.

RPC APIs are typically used for building client-server applications, where the client is responsible for presenting a user interface and the server is responsible for executing procedures and storing data. They provide a simple and efficient way to make remote calls, but can also be less flexible than other API technologies, such as REST and GraphQL, which are designed to be more scalable and support more complex use cases.