---
title: "Everyday Scripts That Actually Save Time: A Developer's Survival Kit"
excerpt: "After years of collecting small productivity wins, I've built a toolkit of simple scripts that eliminate daily friction. From clipboard automation to git shortcuts, these aren't fancy tools—they're the boring utilities that make everything else flow better. Here's what I actually use and why you might want them too."
date: "2025-10-23"
readTime: "10 min read"
tags: ["Productivity", "Scripts", "DevOps", "CLI", "Automation", "Developer Tools"]
author: "Scott Van Gilder"
---

## Everyday Scripts That Actually Save Time

I've been collecting small productivity hacks for years, building up a personal toolkit of everyday utilities—the boring, unglamorous aliases and functions that quietly make everything flow better.

I've gravitated toward zsh aliases and functions that live in my shell configuration rather than standalone scripts. These aren't groundbreaking innovations. They're solutions to tiny daily frictions that compound over time. The 5-second annoyance that happens 20 times a day. The three-command sequence you type constantly. The navigation patterns that become muscle memory.

After a decade of refining my shell environment, here's what actually stuck and why I chose aliases over scripts.

## My Environment Philosophy: Modular and Portable

Before diving into my toolkit, let me explain my approach to shell configuration. After years of different setups, I've settled on a modular system that prioritizes both organization and portability.

### The Architecture

My environment setup lives in `~/dev/environment/` and is broken into two main components:

**Dotfiles Management** (`dotfiles/`): Uses GNU Stow to manage symlinks from a version-controlled directory structure to my actual home directory. Everything from `.zshrc` to Neovim configs.

**Package Management** (`packages/`): Automated installation scripts that work across different machines (work laptop, personal Linux boxes, etc.) using hostname-based package lists.

### Why This Approach?

**Modular Configuration**: Instead of one massive `.zshrc`, my shell config is split into focused files:
- `aliases` - All my shortcuts and command variations
- `exports` - Environment variables 
- `functions` - Custom shell functions
- `prompt` - Git-aware prompt configuration
- `path` - PATH modifications

**Cross-Platform Compatibility**: The same aliases work on macOS (`ls -G`) and Linux (`ls --color`) through smart detection.

**Machine-Specific Packages**: Different machines get different tool sets. My work machine has AWS CLI tools, my personal Linux box has development tools, etc.

**Instant Setup**: New machine setup is just:
```bash
git clone environment-repo
cd environment/dotfiles && ./install  # Symlinks dotfiles
cd ../packages && ./install           # Installs packages
```

This gives me identical shell experience across all my machines in under 5 minutes.

## Directory Navigation: The Foundation

Let's start with the basics—moving around the filesystem efficiently. These are probably my most-used aliases:

### The Classic Dot Navigation

```zsh
# Easier navigation: .., ..., ...., ....., ......
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ......="cd ../../../../.."
alias -- -="cd -"  # Go back to previous directory
```

I know this looks excessive, but `....` is genuinely faster than `cd ../../..` when you're navigating deep directory structures. The muscle memory is real.

### Quick Directory Shortcuts

```zsh
alias dl="cd ~/Downloads"
alias dt="cd ~/Desktop"
alias ~="cd ~"  # Though `cd` is probably faster to type
```

Simple but effective. I use `dl` constantly when working with downloaded files or quick tests.

### `mcd` - Make and Change Directory

```zsh
mcd () { mkdir -p "$1" && cd "$1"; }
```

This function creates a directory and immediately moves into it. Essential for new projects, temporary workspaces, or any "let me just test this quickly" moment. I use this multiple times daily.

## File Listing: Making `ls` Actually Useful

The default `ls` output is pretty useless for daily development work. Here's how I've enhanced it:

### Smart Color Detection

```zsh
# Detect which `ls` flavor is in use
if ls --color > /dev/null 2>&1; then # GNU `ls`
    colorflag="--color"
    export LS_COLORS='no=00:fi=00:di=01;31:ln=01;36:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.gz=01;31:*.bz2=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.avi=01;35:*.fli=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.ogg=01;35:*.mp3=01;35:*.wav=01;35:'
else # macOS `ls`
    colorflag="-G"
    export LSCOLORS='BxBxhxDxfxhxhxhxhxcxcx'
fi

# Always use color output for `ls`
alias ls="command ls ${colorflag}"
```

This handles the differences between GNU ls (Linux) and BSD ls (macOS) automatically. Your `ls` will always be colorized, regardless of which system you're on.

### The `ls` Variants I Actually Use

```zsh
alias ll='ls -FGlAhp'      # Detailed list with human readable sizes
alias l="ls -laF ${colorflag}"    # List all files including dotfiles  
alias lf="ls -lF ${colorflag}"    # List all files in long format
alias lsd="ls -lF ${colorflag} | grep --color=never '^d'"  # List only directories
```

I probably use `ll` more than any other command. It shows file permissions, sizes in human-readable format, and includes hidden files. Perfect for getting oriented in a new directory.

### Full Recursive Directory Listing

```zsh
alias lr='ls -R | grep ":$" | sed -e '\''s/:$//'\'' -e '\''s/[^-][^\/]*\//--/g'\'' -e '\''s/^/   /'\'' -e '\''s/-/|/'\'' | less'
```

This creates a tree-like view of all subdirectories. Useful for understanding project structure, though I don't use it as often as the others.

## File Operations: Safety First

### Verbose and Safe Operations

```zsh
alias mv='mv -v'    # Show what's being moved
alias rm='rm -i -v' # Prompt before deletion and show what's being removed
alias cp='cp -v'    # Show what's being copied
```

The `-v` (verbose) flag gives you feedback about what's happening. The `-i` (interactive) flag on `rm` has saved me from countless "oh no, I didn't mean to delete that" moments.

### Smart Trash Function

```zsh
trash () { command mv "$@" ~/.Trash ; }
```

Instead of permanently deleting files, this moves them to the macOS Trash. Recoverable mistakes are better than permanent ones.

## Development Shortcuts: Pure Laziness

### Git and Kubernetes

```zsh
alias g="git"
alias k='kubectl'
```

These are pure laziness, but effective laziness. When you're running git and kubectl commands constantly, every keystroke saved matters.

### Intelligent Neovim Function

```zsh
v() {
  if [[ $# -eq 0 ]]; then
    nvim .
  else
    nvim "$@"
  fi
}
```

`v` with no arguments opens the current directory in Neovim. `v filename` opens that specific file. Simple but thoughtful—it adapts to what you're trying to do.

## System Information and Utilities

### PATH Management

```zsh
alias path='echo -e ${PATH//:/\\n}'
```

Prints each PATH entry on a separate line. Essential for debugging "command not found" issues or understanding what's in your environment.

### Shell Management

```zsh
alias reload="exec ${SHELL} -l"
```

Reloads your shell configuration. Invaluable when you're tweaking your `.zshrc` and want to test changes immediately.

### History and File Information

```zsh
alias h='history 20'           # Show last 20 commands
alias fs="stat -f \"%z bytes\"" # File size in bytes (macOS)
```

`h` gives you a quick view of recent commands—perfect for finding that command you ran five minutes ago. `fs` shows file sizes when `ls -la` gives you more info than you need.

### NPM Global Package Management

```zsh
alias listnpm='npm list -g --depth=0'
```

Shows all globally installed npm packages without the dependency tree. Useful for auditing what's installed globally or checking if a package is already available.

## When I Do Use Standalone Scripts

While aliases and functions handle 80% of my daily workflow, I do keep some standalone scripts for more complex operations:

### AWS Identity Check

```bash
#!/bin/bash
# ~/bin/aws-whoami
aws sts get-caller-identity --output table
echo "Region: $(aws configure get region)"
```

Essential when working with multiple AWS accounts. I run this constantly to make sure I'm in the right place before doing anything destructive. Too important to be just an alias.

### Quick Port Management

```bash
#!/bin/bash
# ~/bin/ports
if [ "$1" ]; then
    lsof -i :$1
else
    lsof -i -P -n | grep LISTEN
fi
```

Great for debugging "port already in use" errors or seeing what services are running. The conditional logic makes this better suited as a script than an alias.

## The Philosophy Behind the Choices

### Aliases vs Functions vs Scripts

Here's how I decide which approach to use:

**Aliases** are perfect for:
- Simple command shortcuts (`g` for `git`)
- Adding default flags (`ls` with colors)
- Common navigation patterns (`..`, `...`)

**Functions** work best when you need:
- Conditional logic (`v` function for Neovim)
- Multiple commands in sequence (`mcd`)
- Access to shell features (changing directories)

**Scripts** make sense for:
- Complex operations that don't fit in a function
- Tools you might want to call from other scripts
- Operations that need their own environment

### The Maintenance Factor

One of the biggest advantages of keeping most utilities as aliases and functions is maintenance simplicity. Everything lives in my `.zshrc` file, which I sync across machines using a simple git repository. 

No `chmod +x` to remember. No PATH management. No wondering if a script is installed on this particular machine. Just source the config and everything works.

### Performance Considerations

Aliases and functions are loaded into memory when your shell starts, making them extremely fast to execute. For commands you run dozens of times daily, this responsiveness matters more than you'd think.

That said, my `.zshrc` has grown to over 200 lines over the years. I occasionally audit it to remove aliases I don't actually use. Bloated shell configs can slow down shell startup, though it's rarely noticeable on modern machines.

## Special Cases: The Aliases That Save My Sanity

### System Shortcuts

```zsh
alias sd="sudo shutdown now"  # For Arch Linux boxes
```

Simple but effective when you're working on remote Linux systems and want to cleanly shut down.

## Building Your Own Toolkit

### Start Small and Iterate

The key to building a useful personal toolkit is to start with the pain points you experience most frequently. Don't try to optimize everything at once—focus on the commands and workflows you use multiple times daily.

I started with just `..` and `ll` aliases years ago. The rest grew organically as I noticed patterns in my daily work. The best utilities emerge from real frustrations, not theoretical optimizations.

### Make It Memorable

Your aliases need to feel natural. If you have to think about what a command does or how to invoke it, it's not helping your productivity. I prefer short, obvious names that match how I think about the operation.

Some guidelines that work for me:
- Keep navigation aliases short (`..`, `dl`, `dt`)
- Use familiar abbreviations for tools (`g` for `git`, `k` for `kubectl`)
- Make functions do what you'd expect (`v` for "edit", `mcd` for "make and change directory")

### Sync Across Machines

One huge advantage of keeping everything in your `.zshrc` is that it's trivial to sync across machines. I keep my dotfiles in a git repository and symlink my `.zshrc` to the version-controlled copy. New machine setup is just:

```bash
git clone my-dotfiles-repo
ln -s ~/dotfiles/.zshrc ~/.zshrc
```

Everything just works immediately.

## The Compound Effect

None of these aliases are revolutionary on their own. `ll` doesn't save you more than a few keystrokes. `..` isn't dramatically faster than `cd ..`. But these micro-optimizations compound throughout the day.

When you're navigating file systems, editing code, managing git repositories, and running AWS commands for 8+ hours daily, those saved keystrokes and reduced mental overhead add up. More importantly, they reduce friction in your workflow, helping you stay in flow state longer.

### Everyday Tasks: Terminal vs Neovim

This approach got me thinking about how I actually accomplish common development tasks. Some things are perfect for quick terminal aliases, while others benefit from Neovim's power. Here's how I approach different scenarios:

### Text Processing and JSON Formatting

**Terminal approach** (inspired by the `jsonformat` script):
```zsh
# Pretty-print JSON - already have jq in base packages
alias json='jq .'
echo '{"name":"test"}' | json
```

**Neovim approach**: Open any JSON file, `:set ft=json`, then `gg=G` to format it beautifully. Or use `:!jq .` on a visual selection.

### File Extraction and Archives

**Terminal** (like the universal `extract` script):
```zsh
# Our mcd function already handles directory creation
# Could add a simple extract function
extract() {
  case "$1" in
    *.tar.gz) tar xzf "$1" ;;
    *.zip) unzip "$1" ;;
    *.tar.bz2) tar xjf "$1" ;;
    *) echo "Unknown format" ;;
  esac
}
```

**Neovim**: For viewing archive contents without extracting, `:e archive.zip` works surprisingly well.

### Quick Text Manipulation

**Terminal approach** (inspired by the `markdownquote` script):
```zsh
# Add > to beginning of lines (markdown quote)
alias mdquote="sed 's/^/> /'"
echo "some text" | mdquote
```

**Neovim approach**: Visual select text, then `:s/^/> /` or use block visual mode (`Ctrl+v`) to prepend `> ` to multiple lines at once. Much more interactive and you can see the result immediately.

### Line Number Navigation

**Terminal**: A `line 10` script would be clever, but `sed -n '10p' file` does the same thing.

**Neovim**: Just `:10` or `10G`. Want to see context around line 10? `:10 | normal! zz` centers it on screen.

### Process and Port Management

**Terminal** (building on existing aliases):
```zsh
# See what's running on a port
ports() { lsof -i :${1:-} | grep LISTEN; }

# Kill by port (more brutal than the original)
killport() { lsof -ti:$1 | xargs kill -9; }
```

**Neovim approach**: Sometimes I'll use `:terminal` to run these commands without leaving my editor, especially when debugging a development server.

### UUID Generation and Random Data

**Terminal**: `uuidgen` is built into macOS, but for lowercase: `uuidgen | tr '[:upper:]' '[:lower:]'`

**Neovim**: Install a UUID plugin, or just `:r !uuidgen` to insert a UUID at cursor position.

### Clipboard Integration

**Terminal approach**:
```zsh
# Copy current directory (inspired by 'cpwd')
alias cpwd='pwd | pbcopy'

# Copy file contents
alias cfcopy='pbcopy <'
```

**Neovim approach**: System clipboard is just `"+y` and `"+p`. For copying the current file path: `:let @+ = expand('%:p')`

### The Real Productivity Win

The key insight from examining both approaches: **use the right tool for the task complexity**:

- **Aliases for frequent, simple operations**: `ll`, `gs`, `mcd`
- **Functions for logic that needs parameters**: `v()`, `trash()`
- **Neovim for anything involving text editing or complex manipulation**

The most productive developers I know aren't the ones with the most aliases—they're the ones who seamlessly switch between terminal efficiency and editor power based on what the task actually requires.

## The Meta-Lesson

Your environment setup demonstrates something important: **the best productivity systems are the ones you actually maintain**. Your modular approach with Stow, hostname-based package management, and organized dotfiles shows serious thought about long-term maintainability.

The key insight isn't just about individual aliases—it's about building systems that scale with your workflow complexity while remaining simple to maintain and deploy.

### What Makes Your Setup Work

1. **Separation of Concerns**: Dotfiles vs. packages, aliases vs. functions vs. exports
2. **Portability**: Works identically across macOS and Linux
3. **Automation**: New machine setup is scripted and tested
4. **Version Control**: Everything important is tracked and recoverable
5. **Modularity**: Easy to add/remove pieces without breaking everything

This is the kind of engineering thinking that separates senior developers from junior ones—treating your development environment as infrastructure that deserves the same care as production systems.

---

*Want to see my complete environment setup? Check out the [environment repository](https://github.com/scottyvg/environment) where you can explore the full dotfiles structure and package management system. The modular approach has saved me countless hours of setup time and kept my workflow consistent across machines.*