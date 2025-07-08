---
title: "Everything as a Lambda: The Swiss Army Knife of AWS"
excerpt: "AWS Lambda isn’t just for APIs—it’s my secret weapon for solving odd problems fast. From custom resource automation to integrating external services like certificate APIs, Lambda acts as my Swiss Army knife in the cloud. In this post, I share how “everything as a Lambda” helps me keep projects efficient, flexible, and fun."
date: "2025-07-10"
readTime: "3 minutes"
tags: ["AWSLambda", "Serverless", "AWS", "DevOps", "Containers", "Layers"]
author: "Scott Van Gilder"
---

## Lambda

When most people think of AWS Lambda, they picture serverless APIs, cron jobs, or simple automation tasks. And sure, Lambda is great for all those things. But the longer I work in cloud infrastructure, the more I've come to see Lambda as my go-to Swiss Army knife—a tool I can reach for when I need to solve weird, specific, or otherwise impossible problems quickly.

I call it "everything as a Lambda," because there's almost nothing you can't wire up with a bit of code and a deployment.

### Lambda as the Glue
The beauty of Lambda is that it can live in the middle of any process. Need to fetch data from an external API during your infrastructure deployment? Lambda can do it. Need to transform JSON payloads on the fly? Lambda's your friend. Need to automate a tedious SDK operation that CloudFormation can't handle? You guessed it—Lambda.

In my work at AWS, I've ended up building quite a few Lambdas that exist solely to glue pieces of infrastructure together. They're small, focused, and incredibly powerful.

### Real-World Use Cases
Here are a couple of examples from projects I've worked on:

#### Custom Resource Lambdas for SDK Operations
CloudFormation is fantastic—but it's not omnipotent. There are plenty of AWS operations that just aren't available as native CloudFormation resources. That's where custom resources come in.

Recently, I built a Lambda custom resource that executes AWS SDK calls as part of a deployment. Instead of requiring someone to manually run a CLI command after deploying infrastructure, the custom resource handles it automatically, keeping deployments idempotent and repeatable.

#### Certificate Generation and Integration
Another fun use case was building a custom resource Lambda to integrate with an external certificate authority. We had an API that could vend custom certificates, and we needed to import those certs into AWS Certificate Manager (ACM) automatically. So I wrote a Lambda that:

* Calls the external API to generate a cert
* Retrieves the private key and cert chain
* Registers them into ACM for use with our infrastructure

This saved a ton of manual work and helped ensure that our deployments remained fully automated—even when integrating with services outside AWS.

### Why Lambda Fits So Well

Lambda is perfect for these jobs because:

* There's no infrastructure to manage
* It's cheap for small workloads
* It can run with minimal permissions scoped precisely to the task
* It deploys quickly and rolls back easily
* It scales seamlessly if you suddenly need more concurrency
* Plus, if you're already using Infrastructure-as-Code tools like CDK, deploying a Lambda function as part of your stack is ridiculously simple.

### Scaling Lambda Solutions: Layers and Containers

As your Lambda usage grows, you'll eventually hit challenges around dependency management and deployment size. Lambda provides two elegant solutions for these problems: layers and container images.

#### Lambda Layers for Shared Dependencies

Lambda layers are ZIP archives containing supplementary code or data that multiple functions can reference. Think of them as shared libraries that live in the `/opt` directory of your execution environment. When you have ten Lambda functions each bundling the same 50MB of dependencies, you're uploading 500MB of redundant data. Layers solve this by letting you upload those dependencies once and reference them across all functions.

I've seen layers cut deployment times by several minutes in projects with many functions sharing common dependencies. Beyond speed, layers separate your core function logic from dependencies, letting you update either independently. This also unlocks the console code editor for functions under 3MB—handy for quick testing and debugging.

Creating a layer is straightforward. Install your dependencies to a `python/` directory, ZIP it up, and publish with `aws lambda publish-layer-version`. Functions can then reference up to five layers, and you can version layers independently of your function code.

#### Container Images for Complex Requirements

Container images address different challenges than layers. Since December 2020, Lambda supports Docker images up to 10GB, opening doors for complex applications that don't fit the traditional ZIP model. This is particularly valuable for machine learning workloads, applications with OS-specific binaries, or custom runtimes like Rust or PHP.

Container images also provide better local testing since you can run the exact same environment locally that Lambda will use in production. The operational overhead is higher—you need to manage ECR repositories and Docker builds—but the control is worth it for complex use cases.

AWS provides base images that are cached proactively by the Lambda service, so despite being larger than minimal Alpine images, they often perform better due to reduced cold start times. Use multi-stage builds to keep your final images lean, and order your Dockerfile operations from most stable to most frequently changing to maximize build cache efficiency.

### A Few Tips for "Everything as a Lambda"

If you're going to start solving all your odd jobs with Lambda, here are a few things I've learned:

* **Keep Lambdas small and focused** on one job
* **Watch out for cold starts** if your function has large dependencies—this is where layers and optimized containers really shine
* **Handle errors and edge cases explicitly** so you're not left debugging failed deployments
* **Always test your custom resources thoroughly**—they run during deployments, and failures there can leave your stack in a weird state
* **Consider layers early** if you find yourself copying the same requirements.txt across multiple functions
* **Use containers strategically**—they're powerful but add operational complexity

### Why I Love It
For me, there's a certain magic in knowing that if I hit a wall with AWS tooling, I can usually solve it by dropping in a few lines of code in a Lambda. Whether it's a simple function with shared layers or a complex container with custom runtimes, Lambda gives me the flexibility to solve problems fast without getting bogged down in infrastructure management.

The addition of layers and container support has only made this more powerful. Now I can share common code efficiently, handle massive dependencies, and even run custom runtimes—all while keeping that serverless simplicity I love.

So here's to "everything as a Lambda." Long may it reign.

---

### References

* [AWS Lambda Layers Documentation](https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html)
* [Deploy Lambda functions with container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
* [Lambda Layers Best Practices](https://www.ranthebuilder.cloud/post/aws-lambda-layers-best-practices)
* [Optimizing Lambda functions packaged as container images](https://aws.amazon.com/blogs/compute/optimizing-lambda-functions-packaged-as-container-images/)
* [Using Lambda layers to simplify your development process](https://aws.amazon.com/blogs/compute/using-lambda-layers-to-simplify-your-development-process/)