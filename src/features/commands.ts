import fetch from "node-fetch";
import { Message, TextChannel } from "discord.js";
import cooldown from "./cooldown";
import { ChannelHandlers } from "../types";
import { isStaff } from "../utils";

const EMBED_COLOR = 7506394;

type Command = {
  words: string[];
  help: string;
  handleMessage: (msg: Message) => void;
};

const commandsList: Command[] = [
  {
    words: [`!commands`],
    help: `lists all available commands`,
    handleMessage: msg => {
      const payload = commandsList
        .filter(trigger => trigger.help)
        .map(trigger => {
          return `${trigger.words.join(", ")} - ${trigger.help}`;
        })
        .join("\n")
        .trim();

      msg.channel.send(
        `We have a few commands available: \`\`\`${payload}\`\`\``,
        {
          reply: msg.author
        }
      );
    }
  },
  {
    words: [`!rrlinks`],
    help: `shares a repository of helpful links regarding React and Redux`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Helpful links",
          type: "rich",
          description: `Reactiflux's Mark Erikson has put together a curated list of useful React & Redux links for developers of all skill levels. Check out https://github.com/markerikson/react-redux-links`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!xy`],
    help: `explains the XY problem`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "The XY Issue",
          type: "rich",
          description: `You may be experiencing an XY problem: http://xyproblem.info/ - basically, try to explain your end goal, instead of the error you got stuck on. Maybe there's a better way to approach the problem.`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!ymnnr`],
    help: `links to the You Might Not Need Redux article`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "You Might Not Need Redux",
          type: "rich",
          description: `People often choose Redux before they need it. “What if our app doesn’t scale without it?

https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!derived`],
    help: `links to the React docs regarding the getDerivedStateFromProps function (ab)use`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title:
            "You might not need getDerivedStateFrom props or state at all!",
          type: "rich",
          description: `React 16.4 included a bugfix for getDerivedStateFromProps which caused some existing bugs in React components to reproduce more consistently. If this release exposed a case where your application was using an anti-pattern and didn’t work properly after the fix...

https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!stateupdates`, `!su`],
    help: `Explains the implications involved with state updates being asynchronous`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "State Updates May Be Asynchronous",
          type: "rich",
          description: `Often times you run into an issue like this
\`\`\`js
const handleEvent = e => {
setState(e.target.value);
console.log(state);
}
\`\`\`
where \`state\` is not the most up to date value when you log it. This is caused by state updates being asynchronous.

Check out these resources for more information:
https://gist.github.com/bpas247/e177a772b293025e5324219d231cf32c
https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!bind`],
    help: `explains how and why to bind in React applications`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Binding functions",
          type: "rich",
          description: `In JavaScript, a class function will not be bound to the instance of the class, this is why you often see messages saying that you can't access something of undefined.

In order to fix this, you need to bind your function, either in constructor:

\`\`\`js
class YourComponent extends React.Component {
constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this);
}

handleClick() {
  // you can access \`this\` here, because we've
  // bound the function in constructor
}
}
\`\`\`

or by using class properties babel plugin (it works in create-react-app by default!)

\`\`\`js
class YourComponent extends React.Component {
handleClick = () => {
  // you can access \`this\` here just fine
}
}
\`\`\`

Check out https://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/ for more informations`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!lift`],
    help: `links to the React docs regarding the common need to "lift" state`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Lifting State Up",
          type: "rich",
          description: `Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor. Let’s see how this works in action.

https://reactjs.org/docs/lifting-state-up.html`,
          color: EMBED_COLOR
        }
      });
    }
  },

  {
    words: [`!ask`],
    help: `explains how to ask questions`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Asking to ask",
          type: "rich",
          description: `Instead of asking to ask, ask your question instead. People can help you better if they know your question.

Bad: "hey can anyone help me?"
Bad: "anyone good with redux?"
Good:
> I'm trying to fire a redux action from my component, but it's not getting to the reducer.
> \`\`\`js
> // snippet of code
> \`\`\`
> I'm seeing an error, but I don't know if it's related.
> \`Uncaught TypeError: undefined is not a function\``,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!code`, `!gist`],
    help: `explains how to attach code`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Attaching Code",
          type: "rich",
          description: `\\\`\\\`\\\`js
// short code snippets go here
\\\`\\\`\\\`

Link a Gist to upload entire files: https://gist.github.com
Link a Code Sandbox to share runnable examples: https://codesandbox.io/s
`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!ping`],
    help: `explains how to ping politely`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Don’t ping or DM other devs you aren’t actively talking to",
          type: "rich",
          description: `It’s very tempting to try to get more attention to your question by @-mentioning one of the high profile(or recently active) members of Reactiflux, but please don’t. They may not actually be online, they may not be able to help, and they may be in a completely different timezone–nobody likes push notifications at 3am from an impatient stranger.

Similarly, don’t DM other members without asking first. All of the same problems as @-mentioning apply, and private conversations can’t help anyone else. Your questions are likely not unique, and other people can learn from them when they’re kept public.`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!inputs`],
    help: `provides links to uncontrolled vs controlled components`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Uncontrolled vs Controlled components",
          type: "rich",
          description: `In React, inputs can either be uncontrolled (traditional input) or be controlled via state.
Here's an article explaining the difference between the two: https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/
          `,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!move`],
    help: `allows you to move the conversation to another channel, usage: !move #toChannel @person1 @person2 @person3 ...`,
    handleMessage: msg => {
      const [, newChannel] = msg.content.split(" ");

      try {
        const targetChannel = msg.guild?.channels.cache.get(
          newChannel.replace("<#", "").replace(">", "")
        ) as TextChannel;

        if (!msg.mentions.members) return;

        targetChannel.send(
          `${msg.author} has opened a portal from ${
            msg.channel
          } summoning ${msg.mentions.members.map(i => i).join(" ")}`
        );
      } catch (e) {
        console.log("Something went wrong when summoning a portal: ", e);
      }
    }
  },
  {
    words: [`!mdn`],
    help: `allows you to search something on MDN, usage: !mdn Array.prototype.map`,
    handleMessage: async msg => {
      const [, ...args] = msg.content.split(" ");
      const query = args.join(" ");
      const [fetchMsg, res] = await Promise.all([
        msg.channel.send(`Fetching "${query}"...`),
        fetch(
          `https://developer.mozilla.org/api/v1/search/en-US?highlight=false&q=${query}`
        )
      ]);

      const { documents } = await res.json();
      const [topResult] = documents;

      if (!topResult) {
        fetchMsg.edit(`Could not find anything on MDN for '${query}'`);
        return;
      }

      const { title, excerpt: description, slug, locale } = topResult;

      await msg.channel.send({
        embed: {
          type: "rich",
          author: {
            name: "MDN",
            url: "https://developer.mozilla.org",
            icon_url:
              "https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png"
          },
          title,
          description,
          color: 0x83d0f2,
          url: `https://developer.mozilla.org/${locale}/${slug}`
        }
      });

      fetchMsg.delete();
    }
  },
  {
    words: [`!appideas`],
    help: `provides a link to the best curated app ideas for beginners to advanced devs`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Florinpop17s Curated App Ideas!",
          type: "rich",
          description: `Sometimes it's tough finding inspiration, luckily this guy listed a bunch of stuff for you to pick from for your next project!  Well sorted progression to confidence in web dev.

          https://github.com/florinpop17/app-ideas
          `,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!cors`],
    help: `provides a link to what CORS is and how to fix it`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Understanding CORS",
          type: "rich",
          description: `
          Cross-Origin Resource Sharing (CORS) is a mechanism that lets remote servers restrict which origin (i.e your website) can access it.

          Read more at:
          https://medium.com/@baphemot/understanding-cors-18ad6b478e2b
          https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/
          `,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!immutability`, `!imm`],
    help: `provides resources for helping with immutability`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Immutable updates",
          type: "rich",
          description: `Immutable updates involve modifying data by creating new, updated objects instead of modifying the original object directly.
          You should not modify existing data directly in React or Redux, as mutating data can lead to bugs.

          https://daveceddia.com/react-redux-immutability-guide/
          https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
          `,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!formatting`, `!prettier`],
    help: `describes Prettier and explains how to use it to format code`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Formatting code with Prettier",
          type: "rich",
          description: `Inconsistent indentation and syntax can make it more difficult to understand code, create churn from style debates, and cause logic and syntax errors.

Prettier is a modern and well-supported formatter that completely reformats your code to be more readable and follow best practices.

To format some code without installing anything, use the playground: https://prettier.io/playground/
To enforce its style in your projects, use the CLI: https://prettier.io/docs/en/install.html
To integrate it into your editor: https://prettier.io/docs/en/editors.html`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: [`!gender`],
    help: `reminds users to use gender-neutral language`,
    handleMessage: msg => {
      msg.channel.send({
        embed: {
          title: "Please use gender neutral language by default",
          type: "rich",
          description: `Unless someone has made their pronouns known, please use gender neutral language.

- Instead of "hey guys," try "hey folks", "hey all", or similar
- Use "they/them/theirs" if you aren't sure of someone's pronouns
- "thanks friend" instead of "thanks man"`,
          color: EMBED_COLOR
        }
      });
    }
  },
  {
    words: ["@here", "@everyone"],
    help: "",
    handleMessage: msg => {
      if (!msg || !msg.guild) {
        return;
      }

      const member = msg.guild.member(msg.author.id);

      if (!member || isStaff(member)) {
        return;
      }

      msg.channel.send({
        embed: {
          title: "Tsk tsk.",
          type: "rich",
          description: `Please do **not** try to use \`@here\` or \`@everyone\` - there are ${msg.guild.memberCount} members in Reactiflux. Everybody here is a volunteer, and somebody will respond when they can.`,
          color: "#BA0C2F"
        }
      });
    }
  }
];

const commands: ChannelHandlers = {
  handleMessage: ({ msg }) => {
    if (!msg.guild && msg.channel.type !== "dm") {
      return;
    }

    commandsList.forEach(command => {
      const keyword = command.words.find(word => {
        return msg.content.toLowerCase().includes(word);
      });

      if (keyword) {
        if (cooldown.hasCooldown(msg.author.id, `commands.${keyword}`)) return;
        cooldown.addCooldown(msg.author.id, `commands.${keyword}`);
        command.handleMessage(msg);
      }
    });
  }
};

export default commands;
