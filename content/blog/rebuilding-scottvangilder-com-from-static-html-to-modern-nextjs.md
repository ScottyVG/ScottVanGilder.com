---
title: "Rebuilding ScottVanGilder.com: From Static HTML to Modern Next.js - A Vibe Coding Journey"
excerpt: "From bootcamp-era HTML/CSS to a modern Next.js blog with automated deployment - how I rebuilt my personal website in a single evening using AI-assisted development, and what I learned about the balance between GenAI productivity and deep technical understanding."
date: "2025-07-09"
readTime: "8 min read"
tags: ["WebDev", "NextJS", "GenAI", "PersonalProjects", "AWS", "DevOps"]
author: "Scott Van Gilder"
---

## Rebuilding ScottVanGilder.com

Sometimes the best coding sessions happen in the most unexpected places. Picture this: I'm in Steamboat Springs, Colorado, sitting in a quiet cabin while my wife performs with the orchestra at Strings Pavilion and my son sleeps peacefully upstairs. It's one of those rare moments of perfect focus, and I decide to try something I'd been hearing a lot about, "vibe coding" with AI tools like Cursor and Windsurf.

By the end of that evening, I had completely rebuilt and deployed my personal website. What started as casual experimentation turned into a complete technical transformation, and honestly? It was awesome.

### The Old Days: Raw HTML

Let me take you back to 2016. I was applying to the Galvanize Web Development Immersive program, and one of the requirements was to build a personal website. Like any eager bootcamp applicant, I dove in with pure HTML, CSS, and JavaScript—no frameworks, no build tools, just raw web fundamentals.

At the time, it felt incredible. I was hand-crafting every `<div>`, writing vanilla JavaScript for interactions, and deploying static files to a basic web server. There's something deeply satisfying about building something from scratch with just the core web technologies. It was my digital business card, and I was proud of every line of code.

But here's the thing about static websites built in 2016—they don't age gracefully.

Fast forward several years, and I'm looking at my website with growing embarrassment. The job I had listed in my "Current Position" section? I'd left that role *years* ago. The technologies I claimed to be "currently learning"? Some of them were already considered legacy. My personal website had become a time capsule of outdated information, and updating it felt like archaeological work.

The problem wasn't just the content—it was the architecture. Want to update your job title? Better hope you remember which line of HTML contains that information. Need to add a new project? Time to manually update the navigation across every single page. It was the kind of maintenance nightmare that makes you understand why content management systems exist.

### Enter "Vibe Coding"

Earlier this year, I kept hearing about these new AI-powered development tools from colleagues, particularly from a principal engineer at Amazon who was raving about the productivity gains. Terms like "vibe coding" started floating around—this idea that you could rapidly prototype and build applications by collaborating with AI, letting it handle the boilerplate while you focused on the architecture and business logic.

I was skeptical. As someone who's spent years building robust, scalable systems, the idea of AI-generated code felt... messy. But curiosity got the better of me, especially during that quiet evening in Steamboat.

I fired up Cursor, described what I wanted—a modern personal website with a blog, responsive design, and easy content management—and watched as it started scaffolding a Next.js application. Within minutes, I had a working foundation. Within hours, I had a complete website that looked better and functioned smoother than anything I'd built in pure HTML.

The experience was genuinely magical. I could describe features in plain English and watch them materialize in code. Need a dark mode toggle? Done. Want responsive navigation? Here's a complete implementation. Blog with markdown support? Already configured.

### The Technical Deep Dive

Let me walk you through the architecture that emerged from that evening of vibe coding, because the technical decisions were actually quite sophisticated:

#### Frontend Architecture

**Next.js 14 with App Router**: The foundation is built on Next.js 14 using the new App Router, which provides excellent performance through automatic code splitting and server-side rendering. The file-based routing system makes adding new pages trivial—no more manually updating navigation across multiple HTML files.

**TypeScript Throughout**: Every component, utility, and configuration file is written in TypeScript, providing compile-time safety and excellent developer experience. This was crucial for maintaining code quality even when rapidly iterating.

**Tailwind CSS for Styling**: Instead of writing custom CSS for every component, Tailwind provides utility-first styling that's both maintainable and performant. The design system is consistent, and responsive design is handled through Tailwind's responsive prefixes.

#### Content Management Revolution

The biggest architectural win was moving from static HTML to a markdown-based content system:

**File-Based Blog Posts**: Each blog post is now a markdown file in `content/blog/` with frontmatter for metadata. This means I can write posts in any editor, version control them with Git, and deploy them automatically.

**Automated Data Sync**: I built a sync script that reads all markdown files and generates a TypeScript data file for client-side filtering and navigation. No more manually maintaining blog indexes.

**Enhanced Markdown Processing**: Using `remark` and `remark-gfm`, the blog supports GitHub Flavored Markdown, code syntax highlighting, and proper image handling.

#### Build and Deployment Pipeline

**Static Site Generation**: The entire site builds to static files, making it incredibly fast and deployable anywhere. Next.js pre-renders all pages at build time, so users get instant page loads.

**Automated Deployment**: Every push to the main branch triggers a build and deployment to AWS S3 with CloudFront CDN. The entire process is automated—I write markdown, commit to Git, and the site updates automatically.

**Performance Optimizations**: The build process includes automatic image optimization, CSS purging, and JavaScript minification. The result is a site that scores 100/100 on Lighthouse performance metrics.

#### The Collapsible Sidebar Journey

One of my favorite technical challenges was implementing a collapsible sidebar for the blog. What started as a simple feature request turned into an interesting exploration of state management and user experience:

**Persistent State**: The sidebar remembers whether you've collapsed it across page navigation using localStorage, but only animates when you actually click the button—not during page loads.

**Responsive Design**: The collapse feature only appears on desktop, maintaining the mobile-first responsive design principles.

**Smooth Animations**: CSS transitions provide smooth expand/collapse animations, but they're conditionally applied to avoid animation artifacts during page navigation.

### The Limits of Vibe Coding

Riding high on the success of my website rebuild, I decided to push the boundaries. My next project was a standard todo application with user authentication—something more complex to really test the limits of AI-assisted development.

This is where I hit the wall.

While vibe coding excels at rapid prototyping and well-defined problems, it struggles with complex, multi-layered applications. My todo app quickly sprawled across frontend components, backend APIs, database schemas, authentication flows, and infrastructure configurations. The AI could generate individual pieces brilliantly, but keeping track of how everything connected became overwhelming.

I found that the GenAI tools would constantly context-switching between directories, trying to remember which files contained which logic, and struggling to maintain consistency across the growing codebase. The project became too big for it to grasp, and the AI couldn't provide the architectural oversight I needed.

Eventually, I abandoned the project. Not because the code was bad, but because the "vibe coding" process had become unmanageable.

### Finding the Balance

This experience taught me something important about the role of GenAI in software development. It's not a replacement for engineering expertise—it's a powerful tool that amplifies existing skills.

When I approach AI-assisted development now, I think of myself as a senior engineer doing code reviews. I can guide the AI in the right direction, catch architectural issues, and ensure the generated code meets my standards. For problems I understand well, like building a personal website, this collaboration is incredibly productive.

But for learning new technologies or exploring unfamiliar domains, I've found that minimal AI assistance works better. When the AI generates code for me, I don't develop the same deep familiarity with the patterns, edge cases, and nuances that come from writing it myself. It's the difference between reading about riding a bike and actually learning to balance.

### Generative AI: Neither Good nor Evil

I've come to believe that technology—including GenAI—is fundamentally neutral. Like social media, it's not inherently good or evil; it's a tool that amplifies human intentions and capabilities.

GenAI isn't going anywhere. The productivity gains are too significant, and the technology is improving too rapidly. But that doesn't mean we should abandon critical thinking or deep technical understanding. Instead, we need to be intentional about when and how we use these tools.

For my personal website, AI-assisted development was perfect. I knew exactly what I wanted to build, I understood the underlying technologies, and I could effectively guide the AI toward good solutions. The result was a modern, maintainable website that I'm genuinely proud of.

For learning new concepts or building complex systems, I still prefer the traditional approach of reading documentation, writing code by hand, and building understanding incrementally.

### The Modern ScottVanGilder.com

Today, my website is everything I wanted it to be back in 2016, but couldn't build with the tools and knowledge I had then:

- **Easy to Update**: Adding new content is as simple as creating a markdown file
- **Modern Design**: Responsive, accessible, and performant across all devices  
- **Automated Deployment**: Changes go live automatically without manual intervention
- **Scalable Architecture**: Built on proven technologies that can grow with my needs
- **Great Developer Experience**: TypeScript, hot reloading, and modern tooling make development enjoyable

That quiet evening in Steamboat turned into one of my most productive coding sessions ever. Not because I wrote the most code, but because I found the right balance between human expertise and AI assistance.

The future of software development isn't about replacing engineers with AI—it's about engineers learning to work effectively with AI. And sometimes, the best way to learn that balance is to spend an evening vibe coding while your family sleeps peacefully nearby.

### What's Next?

I'm continuing to explore the boundaries of AI-assisted development, but with a more nuanced approach. For well-defined problems in familiar domains, I'm embracing the productivity gains. For learning and complex system design, I'm maintaining the discipline of deep, hands-on work.

Recently, I've switched from using Cursor to [OpenCode](https://github.com/sst/opencode) with Claude, and I'm absolutely loving it. OpenCode provides a more integrated CLI experience that feels natural for my workflow, and Claude's reasoning capabilities seem particularly well-suited for the kind of architectural discussions and code reviews that make AI-assisted development most effective. The combination has made my development process even more fluid and productive.

The technology will keep evolving, and so will our understanding of how to use it effectively. But one thing remains constant: the best tools are the ones that amplify human creativity and expertise, not replace them.

And hey, if you're ever in Steamboat Springs with a sleeping child and a few hours to kill, I highly recommend giving vibe coding a try. You might just rebuild your entire digital presence before bedtime.

<!-- ---

*Want to see the code behind this website? Check out the [GitHub repository](https://github.com/scottyvg/ScottVanGilder.com) to explore the architecture and build processes I've described. And if you're curious about the technical details of any particular feature, feel free to reach out—I love talking about the intersection of AI and software development.* -->